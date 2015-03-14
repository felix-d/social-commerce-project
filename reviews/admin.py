from django.contrib import admin
from reviews.models import Reviewing,\
    ReviewRootElement, ReviewChildGroup, ReviewElement,\
    ReviewBoolAnswer, ReviewComment, ReviewRecommendIt
from nested_inline.admin import NestedStackedInline, NestedModelAdmin


class ReviewElementInline(NestedStackedInline):
    model = ReviewElement


class ReviewChildGroupInline(NestedStackedInline):
    model = ReviewChildGroup
    inlines = [
        ReviewElementInline,
    ]


@admin.register(ReviewRootElement)
class ReviewRootElementAdmin(NestedModelAdmin):
    model = ReviewRootElement
    inlines = [
        ReviewChildGroupInline,
    ]


class ReviewBoolAnswerInline(admin.TabularInline):
    model = ReviewBoolAnswer


class ReviewCommentInline(admin.TabularInline):
    model = ReviewComment


class ReviewRecommendItInline(admin.TabularInline):
    model = ReviewRecommendIt


@admin.register(Reviewing)
class ReviewingAdmin(admin.ModelAdmin):
    model = Reviewing
    inlines = [
        ReviewBoolAnswerInline,
        ReviewCommentInline,
        ReviewRecommendItInline
    ]
