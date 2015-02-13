from django.contrib import admin
from .models import Question, QuestionType, QuestionChoice, Questionnaire,\
    QuestionGroup
from nested_inline.admin import NestedStackedInline, NestedModelAdmin


class QuestionInline(NestedStackedInline):
    model = Question
    extra = 1
    fk_name = 'qgroup'


class QuestionGroupInline(NestedStackedInline):
    model = QuestionGroup
    extra = 1
    fk_name = 'questionnaire'
    inlines = [QuestionInline]


@admin.register(Questionnaire)
class Questionnaire(NestedModelAdmin):
    model = Questionnaire
    inlines = [QuestionGroupInline]


class QuestionChoiceInline(admin.StackedInline):
    model = QuestionChoice


@admin.register(QuestionType)
class QuestionChoiceInlineAdmin(admin.ModelAdmin):
    inlines = [QuestionChoiceInline]
