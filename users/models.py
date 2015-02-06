from django.db import models

#TO SEE THE GENERATED SQL TYPE
#python manage.py sqlmigrate phase1 {migration_number}

# Create your models here.
class User(models.Model):
    """The model for our users"""

    #The uid provided by the provider
    oauth_uid = models.CharField(max_length=255)

    #The oauth provider (e.g. Facebook, etc.)
    oauth_provider = models.CharField(max_length=255)

    #The name of the user
    username = models.CharField(max_length=255)

    #DateTime when the user was created
    created_at = models.DateTimeField(auto_now_add=True)


class Friendship(models.Model):
    """Many to many cyclic relationship"""
    
    #id of the user
    user = models.ForeignKey("User", related_name="the_user")

    #id of its friend
    friend = models.ForeignKey("User", related_name="the_friend")


class Session(models.Model):
    """The model for user sessions"""

    #The id of the user
    user = models.ForeignKey('User')

    #DateTime when the session was created
    created_at = models.DateTimeField(auto_now_add=True)

    #DateTime when the session was destroyed
    destroyed_at = models.DateTimeField()





