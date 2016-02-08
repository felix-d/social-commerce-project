from django.contrib import admin
from .models import Phase


@admin.register(Phase)
class PhaseAdmin(admin.ModelAdmin):
    model = Phase
 
