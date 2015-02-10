from django.db import models


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
