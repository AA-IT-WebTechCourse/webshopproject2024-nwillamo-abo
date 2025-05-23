from django.conf import settings
from django.db import models

class Item(models.Model):
    STATUS_CHOICES = [
        ('on_sale', 'On Sale'),
        ('sold', 'Sold'),
        ('purchased', 'Purchased'),
    ]

    title        = models.CharField(max_length=200)
    description  = models.TextField(blank=True)
    price        = models.DecimalField(max_digits=8, decimal_places=2)
    date_added   = models.DateTimeField(auto_now_add=True)
    photo        = models.ImageField(upload_to='items/', blank=True, null=True)
    status       = models.CharField(max_length=20, choices=STATUS_CHOICES, default='on_sale')
    owner        = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='items')
    buyer        = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='purchases')

    def __str__(self):
        return f"{self.title} ({self.status})"


class CartItem(models.Model):
    user     = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cart_items')
    item     = models.ForeignKey(Item, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'item')
        verbose_name = "Cart Item"
        verbose_name_plural = "Cart Items"

    def __str__(self):
        return f"{self.user.username} - {self.item.title}"
