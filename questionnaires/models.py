from django.db import models
from users.models import User


class Questionnaire(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class QuestionGroup(models.Model):
    name = models.CharField(max_length=255)
    questionnaire = models.ForeignKey(Questionnaire)

    def __str__(self):
        return self.name


class QuestionChoice(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Question(models.Model):
    text = models.TextField()
    qtype = models.SmallIntegerField()
    qgroup = models.ForeignKey(QuestionGroup)
    qchoices = models.ManyToManyField(QuestionChoice)

    def __str__(self):
        return self.text


class QuestionnaireAnswering(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User)


class QuestionAnswer(models.Model):
    questionnaire_answering = models.ForeignKey(QuestionnaireAnswering)
    question = models.ForeignKey(Question)
    text_value = models.TextField()
    boolean_value = models.BooleanField()
