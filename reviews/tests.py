from django.test import TestCase
from reviews.models import get_review_tree


class ReviewsTests(TestCase):
    fixtures = ['data.json']

    def setUp(self):
        pass

    def test_review(self):
        print(get_review_tree())
