
from django.contrib import admin
from .models import Item, CartItem

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'price', 'status', 'date_added')
    list_filter  = ('status', 'date_added')
    search_fields = ('title', 'description', 'ownerusername')

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('user', 'item', 'added_at')
    search_fields = ('userusername', 'item__title')
