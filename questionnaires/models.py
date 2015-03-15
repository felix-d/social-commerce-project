from django.db import models
from users.models import User


def get_primary_questionnaire_as_dict():
    """Returns the primary questionnaire as a list"""

    # An array with question groups as roots
    res = []

    # In case multiple are marked as primary, take first one
    questionnaire = Questionnaire.objects.filter(primary=True)[0]

    # We get all the question groups belonging to that questionnaire
    question_groups = questionnaire.questiongroup_set.all()

    # For every question group
    for qg in question_groups:

        # append to res the qgroup
        res.append(dict(group=qg.name, questions=[]))

        # get all the questions for that group
        questions = qg.question_set.all()

        # For every question
        for q in questions:

            # Get the question type
            question_type = q.qtype

            # Get the question id
            question_id = q.id

            # Is it an open answer question?
            if(question_type is None):

                # If it is, append only the question text to the array of
                # questions for the given question group
                res[-1]['questions'].append(dict(
                    question=q.text, id=question_id))

            else:

                # get the choices for the question
                choices = question_type.questionchoice_set.all()
                choices_text = []
                for r in choices:
                    choices_text.append(r.name)

                # append the question question with its choices
                res[-1]['questions'].append(
                    dict(question=q.text,
                         choices=choices_text,
                         id=question_id))

    return res


class Questionnaire(models.Model):
    name = models.CharField(max_length=255)
    primary = models.BooleanField(default=None)

    def __str__(self):
        return self.name


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
    question_type = models.ForeignKey(QuestionType)

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
