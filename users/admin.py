from django.contrib import admin
from django.contrib.auth.models import Group
from .models import UserStep, User, Friendship, UserImage,\
    MutualLikes, MutualFriends, Tab, ControlGroup, UserControlGroup


class UserStepInline(admin.TabularInline):
    model = UserStep


class ControlGroupInline(admin.TabularInline):
    model = UserControlGroup


class UserAdmin(admin.ModelAdmin):
    inlines = [UserStepInline, ControlGroupInline, ]


class ControlGroupAdmin(admin.ModelAdmin):
    model = ControlGroup


class TabAdmin(admin.ModelAdmin):
    model = Tab


admin.site.unregister(User)
admin.site.unregister(Group)
admin.site.register(User, UserAdmin)
admin.site.register(ControlGroup, ControlGroupAdmin)
admin.site.register(Tab, TabAdmin)
admin.site.register(Friendship)
admin.site.register(MutualLikes)
admin.site.register(MutualFriends)
admin.site.register(UserImage)
