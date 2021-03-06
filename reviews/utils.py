from users import utils as user_utils
from .models import ReviewBoolAnswer, Reviewing, ReviewComment, ReviewRating,\
    ReviewChildGroup, ReviewRootElement, ReviewWidget, ReviewElement


def get_bool_answers(reviewing):
    """Get bool answers for a review.

    Returns a list of dictionaries for the bool answers with the following
    form.

    {
        'val': <Boolean>,
        'id': <Review element id>,
        'name': <Review element name>,
        'childgroup_id': <Review element child group id>,
        'childgroup': <Review element child group name>,
        'rootgroup_id': <Review element root group id>,
        'rootgroup': <Review element root group name>
    }
    """
    res = []
    review_bool_answer_values = list(
        ReviewBoolAnswer.objects
        .filter(reviewing=reviewing)
        .values(
            'boolean_value',
            'review_element',
            'review_element__name',
            'review_element__review_child_group',
            'review_element__review_child_group__name',
            'review_element__review_child_group__review_root_element',
            'review_element__review_child_group__review_root_element__name'
        )
    )
    for x in review_bool_answer_values:
        data = dict(
            val=x['boolean_value'],
            id=x['review_element'],
            name=x['review_element__name'],
            childgroup_id=x['review_element__review_child_group'],
            childgroup=x['review_element__review_child_group__name'],
            rootgroup_id=x['review_element__review_child_group__review_root_element'],
            rootgroup=x['review_element__review_child_group__review_root_element__name'],
        )
        res.append(data)
    return res


def get_review_data(user, product):
    """Returns the review data for a given user and product."""

    rev_info = dict()

    try:
        reviewing = Reviewing.objects.get(
            user=user, product=product)
    except:
        return False

    rev_info['boolAnswers'] = get_bool_answers(reviewing)

    try:
        rev_info['comment'] = (
            ReviewComment.objects.get(reviewing=reviewing).text_value)
    except:
        pass

    try:
        rev_info['rating'] = (
            ReviewRating.objects.get(reviewing=reviewing).rating)
    except:
        pass

    # we only return if not empty
    return {k: v for k, v in rev_info.items() if v}


def get_reviewers(user, product, types=('a', 'f', 'fof', 'mf', 'ml')):
    """Get reviewers for a given product, relative to the given user.

    Returns a dictionnary of the form {type1:[id1, id2, id3], type2:...}
    Accepts 'a' for all reviewers, 'f' for friends and 'fof' for friends
    of friends. A f and a fof can be in all reviewers.
    """

    result = dict()

    # we get users ids that did in a list
    # note that it contains friends and fof too
    all_reviewers = [dict(id=x.user.id, username=x.user.username) for
                     x in Reviewing.objects.filter(product=product)
                     .exclude(user=user.id)]

    if 'a' in types:
        if all_reviewers:
            result['all_reviewers'] = all_reviewers

    if 'f' in types and user.is_authenticated():
        f = user_utils.get_friends(user)
        f_reviewers = [u for u in all_reviewers if u['id'] in f]
        if f_reviewers:
            result['f_reviewers'] = f_reviewers

    if 'fof' in types and user.is_authenticated():
        fof = user_utils.get_fof(user)
        fof_reviewers = [u for u in all_reviewers if u['id'] in fof]
        # We remove friends from friends of friends
        if f:
            fof_reviewers = [u for u in fof_reviewers if u['id'] not in f]
        if fof_reviewers:
            result['fof_reviewers'] = fof_reviewers

    if 'mf' in types and user.is_authenticated():
        mutual_friends = user_utils.get_users_share_mutual_friends(user)
        mutual_friends_rev = [u for u in all_reviewers if
                              u['id'] in mutual_friends]
        if mutual_friends_rev:
            result['mf_reviewers'] = mutual_friends_rev

    if 'ml' in types and user.is_authenticated():
        mutual_likes = user_utils.get_users_share_mutual_likes(user)
        mutual_likes_rev = [u for u in all_reviewers
                            if u['id'] in mutual_likes]
        if mutual_likes_rev:
            result['ml_reviewers'] = mutual_likes_rev

    return result


def get_review_tree():
    """Returns the reviewing widget structure"""

    # We build the review tree
    try:
        review_widget = ReviewWidget.objects.get(
            primary=True)
    except Exception:
        raise Exception("Please create a review widget")

    review_root_elements = ReviewRootElement.objects.filter(
        review_widget=review_widget)

    # We create a list composed of dicts(name=X, childs=[...])
    review_tree = [dict(name=rre.name, categories=[])
                   for rre in review_root_elements]
    # For every root element
    for i, r in enumerate(review_root_elements):

        # Get all the review_child_groups
        review_child_groups = ReviewChildGroup.objects.filter(
            review_root_element=r)

        # And for every review_child_group
        for j, c in enumerate(review_child_groups):

            # Create a dictionnary of the same form
            review_child_group = dict(name=c.name, elements=[])

            # Build a list of element names and ids for that child group
            review_elements = list(map(lambda x: dict(name=x.name, id=x.id),
                                       ReviewElement.objects.filter(
                                           review_child_group=c)))

            # Set childs to those elements
            review_child_group['elements'] = review_elements

            # Set this child group as a child of current review_root_element
            review_tree[i]['categories'].append(review_child_group)

    return review_tree


def create_review(review_data, user, product):
    """Creates a reviewing object, and its corresponding review answers"""

    # We create the reviewing object, created_at will be updated auto
    reviewing = Reviewing(user=user, product=product)
    reviewing.save()

    # We create the comment object
    comment = ReviewComment(reviewing=reviewing,
                            text_value=review_data['comment'])
    comment.save()

    # We create the reviewRecommendIt element
    rating = ReviewRating(reviewing=reviewing,
                          rating=review_data['rating'])
    rating.save()

    # We create the reviewBoolAnswer for every answer
    for root in review_data['tabs']:
        for cat in root['categories']:
            for element in cat['elements']:
                review_element = ReviewElement.objects.get(id=element['id'])
                reviewBoolAnswer = ReviewBoolAnswer(
                    reviewing=reviewing,
                    review_element=review_element,
                    boolean_value=element['isChecked']
                )
                reviewBoolAnswer.save()


def del_review(user, product):
    """Delete a review for the given user and product"""
    try:
        Reviewing.objects.get(user=user, product=product).delete()
    except:
        pass
