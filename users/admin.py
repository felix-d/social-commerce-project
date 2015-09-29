from django.contrib import admin
from .models import UserStep, User, Friendship, UserImage, MutualLikes, MutualFriends


class UserStepInline(admin.TabularInline):
    model = UserStep


class UserAdmin(admin.ModelAdmin):
    inlines = [UserStepInline]

admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Friendship)
admin.site.register(MutualLikes)
admin.site.register(MutualFriends)
admin.site.register(UserImage)
