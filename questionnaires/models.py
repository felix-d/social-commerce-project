from django.db import models

class Questionnaire(models.Model):
    name = models.CharField(max_length=255)


class QuestionGroup(models.Model):
    name = models.CharField(max_length=255)
    questionnaire = models.ForeignKey(Questionnaire)

class Question(models.Model):
    text = models.TextField()
    qtype = models.SmallIntegerField()
    qgroup  = models.ForeignKey(QuestionGroup)

class QuestionChoice(models.Model):
    name = models.CharField(max_length=255)
    question = models.ForeignKey(Question)



