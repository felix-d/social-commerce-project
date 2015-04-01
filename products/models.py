from django.db import models
from django.templatetags.static import static


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


def get_products():
    """
    Get products with their tags and image paths.
    """
    products = list(Product.objects.values())

    for p in products:

        p_tags = [x['name'] for x in list(
            Tag.objects.filter(product=p['id']).values('name'))]
        p['tags'] = p_tags

        # augment path
        p['sm_image_path'] = static('images/products/small/' +
                                    p['image_path'])
        p['image_path'] = static('images/products/' + p['image_path'])

    return products


class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    image_path = models.URLField()
    caracteristic_1 = models.CharField(max_length=255, default=None)
    caracteristic_2 = models.CharField(max_length=255, default=None)
    tags = models.ManyToManyField(Tag)

    def __str__(self):
        return self.name
