from ...models import AutoBiddingConfig, Item, Notification
from ...serializers import BidSerializer
from rest_framework import status
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime
import pytz
from django.db import transaction


def create_bid(request, item):
    try:
        with transaction.atomic():
            # Lock the item row for update to prevent race conditions
            item = Item.objects.select_for_update().get(id=item.id)

            serializer = BidSerializer(data=request.data)

            if serializer.is_valid():
                if datetime.now(pytz.timezone('UTC')) >= item.auction_end_time:
                    return Response({"error": "Auction for this item has ended"}, status=status.HTTP_400_BAD_REQUEST)
                if serializer.validated_data['amount'] <= item.current_price:
                    return Response({"error": "Bid must be higher than current price"},
                                    status=status.HTTP_400_BAD_REQUEST)

                # Check if the last bid was made by the same user
                if item.bids.first() and item.bids.first().user == request.data['user']:
                    return Response({"error": "Your bid is already the highest bid in the system"},
                                    status=status.HTTP_400_BAD_REQUEST)

                # Save the bid and update the current price
                bid = serializer.save(item=item)
                item.current_price = bid.amount
                item.save()

                # Fetch all autobidding configurations for other users
                auto_bidding_configs = AutoBiddingConfig.objects.filter(items=item).exclude(user=request.data['user'])

                for config in auto_bidding_configs:
                    remaining_budget = config.max_bid_amount - config.get_total_spent()
                    print(config.user, config.max_bid_amount, config.get_total_spent(), remaining_budget)
                    # Calculate the next bid amount (+1)
                    auto_bid_amount = item.current_price + 1

                    if remaining_budget > 0 and auto_bid_amount <= remaining_budget:
                        # Place auto-bid +1
                        auto_bid_data = {
                            'user': config.user,
                            'amount': auto_bid_amount,
                        }
                        auto_bid_serializer = BidSerializer(data=auto_bid_data)
                        if auto_bid_serializer.is_valid():
                            auto_bid = auto_bid_serializer.save(item=item)
                            item.current_price = auto_bid.amount
                            item.save()
                        else:
                            # Handle auto-bid serializer errors if necessary
                            continue
                    else:
                        continue
                    if (config.get_total_spent() /config.max_bid_amount) >= config.alert_percentage/100:
                        Notification.objects.create(user=config.user, message=f"Autobidding bot exceeded more than {config.alert_percentage}% of the budget set")

                        pass
                        #notification creation here

                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Item.DoesNotExist:
        return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
