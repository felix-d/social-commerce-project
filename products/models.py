from django.db import models
from django.templatetags.static import static
from reviews.models import Reviewing
import json


class CustomTagManager(models.Manager):
    def get_tag_names(self):
        """Returns the tags as a list of strings"""
        tags = list(map(lambda t: t['name'],
                        self.model.objects.values('name')))
        return tags


class Tag(models.Model):
    name = models.CharField(max_length=255)
    objects = CustomTagManager()

    def __str__(self):
        return self.name


class CustomProductManager(models.Manager):

    def get_user_products(self, request):
        """
        Get user movies. This method adds a property 'reviewd'
        reviewed movies
        """
        # get all the products
        products = list(self.model.objects.values())
        # the set that will contain ids of reviewed products
        reviewed_product_ids = set()

        # add ids of reviewed products to set
        for e in Reviewing.objects.filter(
                user=request.user).select_related('product'):
            reviewed_product_ids.add(e.product.id)

        # if the movie id is in the set, add reviewd=true
        for p in products:
            p['reviewed'] = True if p['id'] in reviewed_product_ids else False
            p_tags = list(
                Tag.objects.filter(product=p['id']).values('name'))
            p_tags_names = []

            for pt in p_tags:
                p_tags_names.append(pt['name'])

            p['tags'] = p_tags_names
            p['image_path'] = static('images/products/' + p['image_path'])

        return json.dumps(products)


class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    image_path = models.URLField()
    caracteristic_1 = models.CharField(max_length=255, default=None)
    caracteristic_2 = models.CharField(max_length=255, default=None)
    tags = models.ManyToManyField(Tag)
    objects = CustomProductManager()

    def __str__(self):
        return self.name
