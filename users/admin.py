from django.contrib import admin
from .models import UserStep
from .models import User

class UserStepInline(admin.TabularInline):
    model = UserStep

class UserAdmin(admin.ModelAdmin):
    inlines = [UserStepInline]

admin.site.unregister(User)
admin.site.register(User, UserAdmin)

