from django.contrib import admin
from reviews.models import\
    ReviewElement,\
    ReviewChildGroup,\
    ReviewRootElement,\
    ReviewWidget,\
    ReviewBoolAnswer,\
    ReviewComment,\
    ReviewRating,\
    Reviewing
from nested_inline.admin import NestedStackedInline, NestedModelAdmin


class ReviewElementInline(NestedStackedInline):
    model = ReviewElement


class ReviewChildGroupInline(NestedStackedInline):
    model = ReviewChildGroup
    inlines = [
        ReviewElementInline,
    ]


class ReviewRootElementInline(NestedStackedInline):
    model = ReviewRootElement
    inlines = [
        ReviewChildGroupInline,
    ]


@admin.register(ReviewWidget)
class ReviewWidgetAdmin(NestedModelAdmin):
    model = ReviewWidget
    inlines = [
        ReviewRootElementInline,
    ]


class ReviewBoolAnswerInline(admin.TabularInline):
    model = ReviewBoolAnswer


class ReviewCommentInline(admin.TabularInline):
    model = ReviewComment


class ReviewRatingInline(admin.TabularInline):
    model = ReviewRating


@admin.register(Reviewing)
class ReviewingAdmin(admin.ModelAdmin):
    model = Reviewing
    inlines = [
        ReviewBoolAnswerInline,
        ReviewCommentInline,
        ReviewRatingInline
    ]
