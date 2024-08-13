from django.db import models

class Item(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    starting_price = models.DecimalField(max_digits=10, decimal_places=2)
    current_price = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    auction_end_time = models.DateTimeField()
    picture = models.ImageField(upload_to="backend/item_images", null=True)

    def __str__(self):
        return self.name