from django.db import models
from users.models import get_fof, get_friends
from django.contrib.auth.models import User


def get_review_data(user, product):
    """Returns the review data for a given user and product"""

    rev_info = dict()

    # we get the user review
    try:
        reviewing = Reviewing.objects.get(user=user,
                                          product=product)
    except:
        return False

    # we get the bool answers as [{'val': True, 'id': 1, 'name': 'was alright', 'chilgroup_id': 1, 'childgroup_name': 'music', ...}]
    # rev_info['boolAnswers'] = [dict(val=x['boolean_value'],
    #                                 id=x['review_element'],
    #                                 name=x['review_element__name'],
    #                                 childgroup_id=x['review_element__review_child_group'],
    #                                 childgroup=x['review_element__review_child_group__name'],
    #                                 rootgroup_id=x['review_element__review_child_group__review_root_element'],
    #                                 rootgroup=x['review_element__review_child_group__review_root_element__name']
    #                             )
    #                            for x in list(ReviewBoolAnswer.objects
    #                                 .filter(reviewing=reviewing)
    #                                 .values('boolean_value',
    #                                         'review_element',
    #                                         'review_element__name',
    #                                         'review_element__review_child_group',
    #                                         'review_element__review_child_group__name',
    #                                         'review_element__review_child_group__review_root_element',
    #                                         'review_element__review_child_group__review_root_element__name'
    #                                     ))]

    # we get the bool answers as [[{childGroupName: "name", answers: ["blabla", "blabla2"]}]]
    rba = [dict(
        childGroupName=x['name'],
        answers=[r['review_element__name'] for r in ReviewBoolAnswer.objects.filter(
            reviewing=reviewing
        ).filter(
            review_element__review_child_group=x['id']
        ).filter(
            boolean_value=True).values('review_element__name')])\
           for x in ReviewChildGroup.objects.all().values('name', 'id')]

    # we want to concatenate child group answers with the same name
    rev_info['boolAnswers'] = []
    seen = []
    for a in rba:
        if a['childGroupName'] in seen:
            for b in rev_info['boolAnswers']:
                if b['childGroupName'] == a['childGroupName']:
                    b['answers'] = b['answers'] + a['answers']
        else:
            if a['answers']:
                rev_info['boolAnswers'].append(a)
        seen.append(a)

    # we get the comment answer
    rev_info['comment'] = ReviewComment\
        .objects\
        .get(reviewing=reviewing)\
        .text_value

    # we get the rating
    rev_info['rating'] = ReviewRating\
        .objects\
        .get(reviewing=reviewing)\
        .rating


    # we only return if not empty
    return {k: v for k, v in rev_info.items() if v}


def get_reviewers(user, product, types=('a', 'f', 'fof')):
    """
    Returns a dictionnary of the form {type1:[id1, id2, id3], type2:...}
    Accepts 'a' for all reviewers, 'f' for friends and 'fof' for friends
    of friends
    """

    result = dict()

    # we get users ids that did in a list
    # note that it contains friends and fof too
    all_reviewers = [
        dict(
            user_id=x.user.id,
            username=x.user.username
        )
        for x in Reviewing.objects.filter(product=product)
    ]

    if 'a' in types:
        result['all_reviewers'] = all_reviewers

    if 'f' in types:
        f = get_friends(user)
        f_reviewers = [u for u in all_reviewers if u['user_id'] in f]
        result['f_reviewers'] = f_reviewers

    if 'fof' in types:
        fof = get_fof(user)
        fof_reviewers = [u for u in all_reviewers if u['user_id'] in fof]
        result['fof_reviewers'] = fof_reviewers

    return result


def get_review_tree():
    """Returns the reviewing widget structure"""

    # We build the review tree
    try:
        review_widget = ReviewWidget.objects.filter(
            primary=True)[0]
    except IndexError:
        review_widget = ReviewWidget.objects.all()[0]
    except IndexError:
        raise("Please create a review widget")

    review_root_elements = ReviewRootElement.objects.filter(
        review_widget=review_widget)

    # We create a list composed of dicts(name=X, childs=[...])
    review_tree = [dict(name=rre.name, categories=[])
                   for rre in review_root_elements]
    # For every root element
    for i, r in enumerate(review_root_elements):

        # Get all the review_child_groups
        review_child_groups = ReviewChildGroup.objects.filter(
            review_root_element=r)

        # And for every review_child_group
        for j, c in enumerate(review_child_groups):

            # Create a dictionnary of the same form
            review_child_group = dict(name=c.name, elements=[])

            # Build a list of element names and ids for that child group
            review_elements = list(map(lambda x: dict(name=x.name, id=x.id),
                                       ReviewElement.objects.filter(
                                           review_child_group=c)))

            # Set childs to those elements
            review_child_group['elements'] = review_elements

            # Set this child group as a child of current review_root_element
            review_tree[i]['categories'].append(review_child_group)

    return review_tree


def create_review(review_data, user, product):

    """Creates a reviewing object, and its corresponding review answers"""

    # We create the reviewing object, created_at will be updated auto
    reviewing = Reviewing(user=user, product=product)
    reviewing.save()

    # We create the comment object
    comment = ReviewComment(reviewing=reviewing,
                            text_value=review_data['comment'])
    comment.save()

    # We create the reviewRecommendIt element
    rating = ReviewRating(reviewing=reviewing,
                          rating=review_data['rating'])
    rating.save()

    # We create the reviewBoolAnswer for every answer
    for root in review_data['tabs']:
        for cat in root['categories']:
            for element in cat['elements']:
                review_element = ReviewElement.objects.get(id=element['id'])
                reviewBoolAnswer = ReviewBoolAnswer(
                    reviewing=reviewing,
                    review_element=review_element,
                    boolean_value=element['isChecked']
                )
                reviewBoolAnswer.save()


def del_review(user, product):
    """Delete a review for the given user and product"""
    try:
        Reviewing.objects.get(user=user, product=product).delete()
    except:
        pass


class Reviewing(models.Model):
    user = models.ForeignKey(User)
    product = models.ForeignKey('products.Product')
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "{} reviewed by {} {}."\
            .format(self.product, self.user.first_name, self.user.last_name)


class ReviewWidget(models.Model):
    name = models.CharField(max_length=255)
    primary = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class ReviewRootElement(models.Model):
    name = models.CharField(max_length=255)
    review_widget = models.ForeignKey(ReviewWidget)

    def __str__(self):
        return self.name


class ReviewChildGroup(models.Model):
    review_root_element = models.ForeignKey(ReviewRootElement)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class ReviewElement(models.Model):
    review_child_group = models.ForeignKey(ReviewChildGroup)
    name = models.CharField(max_length=255)
    # order = models.SmallIntegerField(default=0)

    def __str__(self):
        return "Element '{}' belonging to group '{}'".format(
            self.name, self.review_child_group)


class ReviewBoolAnswer(models.Model):
    reviewing = models.ForeignKey(Reviewing)
    review_element = models.ForeignKey(ReviewElement)
    boolean_value = models.BooleanField(default=None)

    def __str__(self):
        return "{} is {}".format(self.review_element, self.boolean_value)


class ReviewComment(models.Model):
    reviewing = models.OneToOneField(Reviewing, primary_key=True)
    text_value = models.TextField()

    def __str__(self):
        return self.text_value


class ReviewRating(models.Model):
    reviewing = models.OneToOneField(Reviewing, primary_key=True)
    rating = models.IntegerField(default=0)

    def __str__(self):
        return "Rated {} stars".format(self.rating) if self.rating\
            else "Not rated"
