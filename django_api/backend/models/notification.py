from django.db import models


class Notification(models.Model):
    user = models.CharField(max_length=20)
    message = models.CharField(max_length=100)
