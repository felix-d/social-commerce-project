from django.db import models
from users.models import User

class Questionnaire(models.Model):
    name = models.CharField(max_length=255)
    primary = models.BooleanField(default=None)


class QuestionGroup(models.Model):
    name = models.CharField(max_length=255)
    questionnaire = models.ForeignKey(Questionnaire)

    def __str__(self):
        return self.name


class QuestionType(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class QuestionChoice(models.Model):
    name = models.CharField(max_length=255)
    question_choice_group = models.ForeignKey(QuestionType)

    def __str__(self):
        return self.name


class Question(models.Model):
    text = models.TextField()
    qgroup = models.ForeignKey(QuestionGroup)
    qtype = models.ForeignKey(QuestionType, blank=True, null=True,
                              help_text="Keep blank for open answer question.")

    def __str__(self):
        return self.text


class QuestionnaireAnswering(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User)


class QuestionAnswer(models.Model):
    questionnaire_answering = models.ForeignKey(QuestionnaireAnswering)
    question = models.ForeignKey(Question)
    text_value = models.TextField()
    boolean_value = models.BooleanField(default=None)
