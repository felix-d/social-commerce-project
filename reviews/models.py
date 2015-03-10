from django.db import models
from django.contrib.auth.models import User


def get_review_tree():

    # We build the review tree
    review_root_elements = ReviewRootElement.objects.all()

    # We create a list composed of dicts(name=X, childs=[...])
    review_tree = [dict(text=rre.name, categories=[])
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


class Reviewing(models.Model):
    user = models.ForeignKey(User)
    product = models.ForeignKey('products.Product')
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "{} reviewed by {} {}."\
            .format(self.product, self.user.first_name, self.user.last_name)


class ReviewRootElement(models.Model):
    order = models.SmallIntegerField(default=0)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class ReviewChildGroup(models.Model):
    review_root_element = models.ForeignKey(ReviewRootElement)
    name = models.CharField(max_length=255)
    order = models.SmallIntegerField(default=0)

    def __str__(self):
        return self.name


class ReviewElement(models.Model):
    review_child_group = models.ForeignKey(ReviewChildGroup)
    name = models.CharField(max_length=255)
    order = models.SmallIntegerField(default=0)


class ReviewAnswer(models.Model):
    review = models.ForeignKey(Reviewing)
    review_element = models.ForeignKey(ReviewElement)
    text_value = models.TextField()
    boolean_value = models.BooleanField(default=None)
