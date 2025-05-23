from django.urls import path
from . import views
from .views import populate, signup, current_user, create_item, list_items, my_items,delete_item, update_item_price, change_password, checkout, add_to_cart,search_items
from rest_framework.authtoken.views import obtain_auth_token

# urls for the website
urlpatterns = [
    path('populate/', views.populate, name='populate-db'),
    path('populate/', populate, name='populate'),
    path('signup/', signup, name='signup'),
    path('login/', obtain_auth_token, name='login'),               
    path('whoami/', current_user, name='current_user'),           
    path('items/', create_item, name='create_item'),   
    path('items/all/', list_items),        
    path('items/mine/', my_items),  
    path('items/delete/<int:item_id>/', delete_item, name='delete_item'),
    path('items/update/<int:item_id>/', update_item_price, name='update_price'),
    path('change-password/', change_password, name='change_password'),
    path('checkout/', checkout, name='checkout'),
    path("cart/add/", add_to_cart),
    path("items/search/", search_items, name="search_items"),






]



