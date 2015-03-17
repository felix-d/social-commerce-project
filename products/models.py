from django.db import models
from django.templatetags.static import static
from reviews.models import Reviewing, ReviewBoolAnswer,\
    ReviewComment, ReviewRecommendIt
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

    def get_user_products(self, user):
        """
        Get user movies. This method adds a property 'reviewd'
        reviewed movies
        """
        # get all the products, as a dictonary rather than
        # model-instance object
        products = list(self.model.objects.values())

        # the set that will contain ids of reviewed products
        reviewed_product_ids = set()

        # add ids of reviewed products to set
        for e in Reviewing.objects.select_related('product').filter(
                user=user):
            reviewed_product_ids.add(e.product.id)

        for p in products:

            # if the movie id is in the set, add reviewd=true
            # and get review answers
            if p['id'] in reviewed_product_ids:

                # we get the user review
                reviewing = Reviewing.objects.filter(user=user,
                                                     product_id=p['id'])\
                                             .latest('created')

                # we get the bool answers as [{'val': True, 'id': 1}]
                bool_answers = [dict(val=x['boolean_value'],
                                     id=x['review_element_id']) for x in
                                list(ReviewBoolAnswer.objects
                                     .filter(reviewing=reviewing)
                                     .values('boolean_value',
                                             'review_element_id'))]

                # we get the comment answer
                comment = ReviewComment\
                    .objects\
                    .get(reviewing=reviewing)\
                    .text_value

                # we get the recommend_it
                recommend_it = ReviewRecommendIt\
                    .objects\
                    .get(reviewing=reviewing)\
                    .boolean_value

                # we set the review
                p['review'] = dict(
                    boolAnswers=bool_answers,
                    comment=comment,
                    recommendIt=recommend_it
                )

            # else there is no review for the product
            else:
                p['review'] = False

            # get tags names for the given product
            p_tags = [x['name'] for x in list(
                Tag.objects.filter(product=p['id']).values('name'))]
            p['tags'] = p_tags

            # augment path
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
