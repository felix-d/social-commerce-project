from django.test import TestCase, Client
from products.models import Product
import json
from django.contrib.auth.models import User
from reviews.models import create_review, Reviewing, del_review


class ReviewsTests(TestCase):
    fixtures = ['data.json']

    def setUp(self):

        self.data = '{"productId":222,"reviewData":{"comment":"test","tabs":[{"name":"I liked...","categories":[{"name":"Music","elements":[{"name":"Was alright","id":1,"isChecked":true},{"name":"Fabulous","id":2,"isChecked":true},{"name":"Incredible","id":3,"isChecked":false},{"name":"Bof","id":16,"isChecked":false}]},{"name":"Plot","elements":[{"name":"Bof","id":4,"isChecked":false},{"name":"Awesome","id":5,"isChecked":true},{"name":"I got sick","id":6,"isChecked":false}]}]},{"name":"I didn\'t like...","categories":[{"name":"Music","elements":[{"name":"Too loud?","id":7,"isChecked":true},{"name":"Too hip hop","id":8,"isChecked":true},{"name":"Whatever","id":9,"isChecked":false}]},{"name":"Plot","elements":[{"name":"Aggressive","id":10,"isChecked":true},{"name":"Tortuous","id":11,"isChecked":false},{"name":"What the hell","id":12,"isChecked":false}]}]},{"name":"My overall rating...","categories":[{"name":"The movie","elements":[{"name":"Was great","id":13,"isChecked":false},{"name":"Was bad","id":14,"isChecked":true},{"name":"Was okay","id":15,"isChecked":false}]}]}],"rating":5}}'

        self.test_user = User.objects.create_user(username="test",
                                                  email="test@test.com",
                                                  password="test")
        self.c = Client()
        self.c.login(username="test", password="test")

    def test_review_is_created(self):
        response = self.c.post("/phase1/review/",
                               self.data,
                               HTTP_X_REQUESTED_WITH='XMLHttpRequest',
                               content_type="application/json")
        self.assertEqual(200, response.status_code)

    def test_review_cant_be_created_twice(self):
        self.c.post("/phase1/review/",
                    self.data,
                    HTTP_X_REQUESTED_WITH='XMLHttpRequest',
                    content_type="application/json")
        self.c.post("/phase1/review/",
                    self.data,
                    HTTP_X_REQUESTED_WITH='XMLHttpRequest',
                    content_type="application/json")
        data = json.loads(self.data)
        revs = Reviewing.objects.filter(product_id=data['productId'])
        self.assertEqual(1, len(revs))
