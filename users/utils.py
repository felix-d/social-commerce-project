import functools

from django.contrib.auth.models import User

from .models import Wish, Friendship, MutualFriends, MutualLikes


def set_user_step(user, step, phase=1):
    """Sets user step.

    Normally this would have been part of the user model
    but we didn't override the user model.
    """
    phase_step = 'phase{}_step'.format(phase)
    setattr(user.userstep, phase_step, step)
    user.userstep.save()


def is_wish(user, product):
    """Is there a wish for current user and product.

    :rtype: bool
    """
    wish_count = Wish.objects.filter(
        user=user.id, product=product).count()
    return False if wish_count is 0 else True


def get_number_reviews(user):
    """Get number of reviews done by a given user.

    :param user: User instance
    :type user: User

    :returns: int
    """
    return user.reviewing_set.all().count()


@functools.lru_cache()
def get_friends(user):
    """Get list of friend ids for the given user.

    :param user: User instance or id.
    :rtype: list of int
    """
    return (Friendship.objects.filter(user=user)
            .values_list('friend', flat=True))


@functools.lru_cache()
def get_fof(user):
    """Get a list of fof ids for the given user.

    :param user: User instance or id.
    :rtype: list of int
    """
    friends_ids = get_friends(user)
    fofs = []
    for fid in friends_ids:
        friends_of_friend = get_friends(fid)
        for f in friends_of_friend:
            # We don't want to include the current user
            if f is not user.id and f not in friends_ids:
                fofs.append(f)
    return fofs


@functools.lru_cache()
def get_users_share_mutual_friends(user):
    """Get list of user ids that has mutual friends ith user.

    :param user: User instance or id.
    :rtype: list of int
    """
    return (MutualFriends.objects.filter(user=user)
            .values_list('second_user', flat=True))


@functools.lru_cache()
def get_users_share_mutual_likes(user):
    """Get list of user ids that has mutual likes with user.

    :param user: User instance or id.
    :rtype: list of int
    """
    return (MutualLikes.objects.filter(user=user)
            .values_list('second_user', flat=True))


def get_user(user):
    """Get info for the given user.

    :returns: dict(id=int, username=str, pic=str)
    """
    try:
        _user = User.objects.get(id=user)
        try:
            url = _user.userimage.url
        except:
            url = ''
    except:
        pass
    return dict(id=_user.id, username=_user.username, pic=url)
