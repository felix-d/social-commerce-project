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
