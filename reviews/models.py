from django.db import models
from django.contrib.auth.models import User


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
