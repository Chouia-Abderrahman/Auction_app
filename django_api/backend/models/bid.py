from django.db import models
from .item import Item
from django.contrib.auth.models import User

class Bid(models.Model):
    item = models.ForeignKey(Item, related_name='bids', on_delete=models.CASCADE)
    user = models.CharField(max_length=20)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    time = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-amount']

    def __str__(self):
        return f"{self.user.username} bid ${self.amount} on {self.item.name}"