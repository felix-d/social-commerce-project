from django.shortcuts import redirect


def redirect_user_to_current_step(user):
        user_step = user.userstep.step
        # because 4 is to indicate sharing happened,
        # we still redirect on 3
        user_step = 3 if user_step is 4 else user_step
        if user_step is 1:
                url = "/phase1/"
        else:
                url = "/phase1/step{}/".format(user_step)
        return redirect(url)
