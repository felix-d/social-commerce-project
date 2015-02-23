from django.shortcuts import redirect


def redirect_user_to_current_step(user):
        user_step = user.userstep.step
        url = "/phase1/step{}/".format(user_step)
        return redirect(url)
