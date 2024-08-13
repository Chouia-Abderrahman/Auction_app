from django.db import models
from django.contrib.auth.models import User
from .item import Item


class AutoBiddingConfig(models.Model):
    max_bid_amount = models.DecimalField(max_digits=10, decimal_places=2)
    alert_percentage = models.IntegerField()
    user = models.CharField(max_length=100)
    items = models.ManyToManyField(Item, related_name="auto_bidding_configs")

    def __str__(self):
        return f"Auto-bidding config for {self.user}"

    def get_total_spent(self):
        total_spent = 0
        for item in self.items.all():
            # Get the highest bid for this item
            highest_bid = item.bids.order_by('-amount').first()

            # Check if the current user is the highest bidder
            if highest_bid and highest_bid.user == self.user:
                total_spent += item.current_price

        return total_spent