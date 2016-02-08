from django.contrib import admin
from .models import Tracked


@admin.register(Tracked)
class TrackedAdmin(admin.ModelAdmin):
    model = Tracked

    list_display = ('user', 'hook', 'created_at', 'data', )
