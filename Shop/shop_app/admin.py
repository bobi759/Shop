from django.contrib import admin

from Shop.shop_app.models import Book, Genre, Profile, Cart, CartItem, Order, OrderItems, BookReview


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    pass


@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    pass

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    pass

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    pass

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    pass

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    pass

@admin.register(OrderItems)
class OrderItemsAdmin(admin.ModelAdmin):
    pass

@admin.register(BookReview)
class BookReviewAdmin(admin.ModelAdmin):
    pass


