from django.db import models
from products.models import Product
from users.models import User


class Reviewing(models.Model):
    user = models.ForeignKey(User)
    product = models.ForeignKey(Product)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)


class ReviewRootElement(models.Model):
    order = models.SmallIntegerField()
    name = models.CharField(maxlength=255)
    has_child = models.BooleanField()


class ReviewChildGroup(models.Model):
    review_root_element = models.ForeignKey(ReviewRootElement)
    name = models.CharField(maxlength=255)
    order = models.SmallIntegerField()


class ReviewElement(models.Model):
    review_child_group = models.ForeignKey(ReviewChildGroup)
    name = models.CharField(maxlength=255)


class ReviewAnswer(models.Model):
    review = models.ForeignKey(Reviewing)
    review_element = models.ForeignKey(ReviewElement)
    text_value = models.TextField()
    boolean_value = models.BooleanField()
