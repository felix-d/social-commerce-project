from django.db import models
from django.contrib.auth.models import User
import pprint


def get_review_tree():

    # We build the review tree
    review_widget = ReviewWidget.objects.filter(
        primary=True)[0]

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


def create_review(data, user, product):

    """Creates a reviewing object, and its corresponding review answers"""

    review_data = data['reviewData']
    pp = pprint.PrettyPrinter(indent=4)
    pp.pprint(review_data)

    # We create the reviewing object, created_at will be updated auto
    reviewing = Reviewing(user=user, product=product)
    reviewing.save()

    # We create the comment object
    comment = ReviewComment(reviewing=reviewing,
                            text_value=review_data['comment'])
    comment.save()

    # We create the reviewRecommendIt element
    recommend_it = ReviewRecommendIt(reviewing=reviewing,
                                     boolean_value=review_data['recommendIt'])
    recommend_it.save()

    # We create the reviewBoolAnswer for every answer
    for root in review_data['tabs']:
        for cat in root['categories']:
            for element in cat['elements']:
                print(element)
                review_element = ReviewElement.objects.get(id=element['id'])
                reviewBoolAnswer = ReviewBoolAnswer(
                    reviewing=reviewing,
                    review_element=review_element,
                    boolean_value=element['isChecked']
                )
                reviewBoolAnswer.save()


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
    # order = models.SmallIntegerField(default=0)
    name = models.CharField(max_length=255)
    review_widget = models.ForeignKey(ReviewWidget)

    def __str__(self):
        return self.name


class ReviewChildGroup(models.Model):
    review_root_element = models.ForeignKey(ReviewRootElement)
    name = models.CharField(max_length=255)
    # order = models.SmallIntegerField(default=0)

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


class ReviewRecommendIt(models.Model):
    reviewing = models.OneToOneField(Reviewing, primary_key=True)
    boolean_value = models.BooleanField(default=None)

    def __str__(self):
        return "Recommended it" if self.boolean_value\
            else "Didn't recommend it"
