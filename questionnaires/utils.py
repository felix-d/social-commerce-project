from .models import Questionnaire


def get_questionnaire_as_dict(phase):
    """Returns the primary questionnaire as a list"""

    # An array with question groups as roots
    res = []

    # In case multiple are marked as primary, take first one
    try:
        questionnaire = Questionnaire.objects.filter(phase=phase).first()
    except:
        raise Exception('You need to create a questionnaire for phase {}.'
                        .format(phase))

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
                choices_text = [r.name for r in choices]

                # append the question question with its choices
                res[-1]['questions'].append(dict(
                    question=q.text,
                    choices=choices_text,
                    id=question_id))

    return res
