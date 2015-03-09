from django.contrib import admin
from reviews.models import Reviewing,\
    ReviewRootElement, ReviewChildGroup, ReviewElement
from nested_inline.admin import NestedStackedInline, NestedModelAdmin


class ReviewElementInline(NestedStackedInline):
    model = ReviewElement


class ReviewChildGroupInline(NestedStackedInline):
    model = ReviewChildGroup
    inlines = [
        ReviewElementInline,
    ]


@admin.register(ReviewRootElement)
class ReviewRootElement(NestedModelAdmin):
    model = ReviewRootElement
    inlines = [
        ReviewChildGroupInline,
    ]

admin.register(Reviewing)
