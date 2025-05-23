from django.shortcuts import get_object_or_404
from .models import Item, CartItem
from django.views.decorators.csrf import csrf_exempt
import random
from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated


User = get_user_model()
@csrf_exempt 
@api_view(['POST'])
@permission_classes([AllowAny])

#populates database with test users and items
def populate(request):
    with transaction.atomic():
        CartItem.objects.all().delete()
        Item.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()
        users = []
        for i in range(1, 7):
            u = User.objects.create_user(
                username=f"test User {i}",
                email=f"testUser{i}@example.com",
                password="1234"
            )
            users.append(u)
        for u in users[:3]:
            for j in range(1, 11):
                Item.objects.create(
                    title=f"Test game {u.username}-item {j}",
                    description="A great game.",
                    price=round(random.uniform(20, 300), 2),
                    owner=u
                )

    return Response({"message": "Database populated with test users and items."})

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
#signup view
def signup(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')

    if not username or not password or not email:
        return Response({'error': 'All fields are required.'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already taken.'}, status=400)

    user = User.objects.create_user(username=username, password=password, email=email)
    return Response({'message': 'User created successfully'})


User = get_user_model()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
#shows current user
def current_user(request):
    return Response({'username': request.user.username})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
#creates items
def create_item(request):
    title = request.data.get('title')
    description = request.data.get('description')
    price = request.data.get('price')
    if not (title and description and price):
        return Response({'error': 'All fields required.'}, status=400)
    item = Item.objects.create(
        title=title,
        description=description,
        price=price,
        owner=request.user
    )
    return Response({
      'id': item.id,
      'title': item.title,
      'description': item.description,
      'price': item.price,
      'date_added': item.date_added
    })

@api_view(['GET'])
@permission_classes([AllowAny])
#shows the on sale items in the shop
def list_items(request):
    items = Item.objects.filter(status="on_sale").order_by("-date_added")
    data = [
        {
            'id': item.id,
            'title': item.title,
            'description': item.description,
            'price': item.price,
            'owner': item.owner.username,
            'date_added': item.date_added,
        }
        for item in items
    ]
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
#shows the items classeed by their status
def my_items(request):
    owned = Item.objects.filter(owner=request.user)
    purchased = Item.objects.filter(buyer=request.user)

    return Response({
        "on_sale": [serialize(i) for i in owned.filter(status="on_sale")],
        "sold": [serialize(i) for i in owned.filter(status="purchased")],
        "purchased": [serialize(i) for i in purchased],
    })


def serialize(item):
    return {
        "id": item.id,
        "title": item.title,
        "description": item.description,
        "price": item.price,
        "date_added": item.date_added,
    }

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
#removes item from sale
def delete_item(request, item_id):
    try:
        item = Item.objects.get(id=item_id, owner=request.user)
    except Item.DoesNotExist:
        return Response({"error": "Item not found or unauthorized"}, status=404)

    item.delete()
    return Response({"message": "Item removed from sale."})

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
#updates the price of items
def update_item_price(request, item_id):
    try:
        item = Item.objects.get(id=item_id, owner=request.user)
    except Item.DoesNotExist:
        return Response({"error": "Item not found or not yours"}, status=404)

    new_price = request.data.get("price")
    if not new_price:
        return Response({"error": "Price is required"}, status=400)

    item.price = new_price
    item.save()
    return Response({"message": "Price updated", "price": item.price})

from django.contrib.auth import authenticate

@api_view(['POST'])
@permission_classes([IsAuthenticated])
#changes password of autheticated user
def change_password(request):
    user = request.user
    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")

    if not old_password or not new_password:
        return Response({"error": "Both old and new passwords are required."}, status=400)

    if not user.check_password(old_password):
        return Response({"error": "Old password is incorrect."}, status=400)

    user.set_password(new_password)
    user.save()

    return Response({"message": "Password changed successfully."})


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

@api_view(['POST'])
@permission_classes([AllowAny])
#allows purchasing of items from cart
def checkout(request):
    user = request.user if request.user.is_authenticated else None
    if user:
        cart_items = CartItem.objects.filter(user=user).select_related('item')
        if not cart_items.exists():
            return Response({"error": "Cart is empty"}, status=400)

        for cart_item in cart_items:
            item = cart_item.item

            if item.owner == user:
                continue 

            if item.status != "on_sale":
                continue

            item.status = "purchased"
            item.buyer = user
            item.save()

            cart_item.delete()  

    else:
        item_ids = request.data.get("cart", [])
        if not item_ids:
            return Response({"error": "Cart is empty"}, status=400)

        items = Item.objects.filter(id__in=item_ids, status="on_sale")

        for item in items:
            item.status = "purchased"
            item.buyer = None
            item.save()

    return Response({"message": "Checkout successful"})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
#adds item to cart
def add_to_cart(request):
    item_id = request.data.get("item_id")
    item = get_object_or_404(Item, id=item_id)

    if item.owner == request.user:
        return Response({"error": "Cannot add your own item to cart."}, status=400)

    cart_item, created = CartItem.objects.get_or_create(user=request.user, item=item)
    return Response({"message": "Item added to cart."})

@api_view(['GET'])
@permission_classes([AllowAny])
#allows for searching of items
def search_items(request):
    query = request.GET.get("q", "")
    items = Item.objects.filter(status="on_sale", title__icontains=query).order_by("-date_added")
    
    return Response([
        {
            "id": item.id,
            "title": item.title,
            "description": item.description,
            "price": item.price,
            "owner": item.owner.username,
        }
        for item in items
    ])
