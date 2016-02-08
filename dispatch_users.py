import django
import os
import random

os.environ.setdefault(
    'DJANGO_SETTINGS_MODULE',
    'social_commerce_project.settings')
django.setup()

from django.contrib.auth.models import User
from users.models import Tab, ControlGroup, UserControlGroup


def create_group(name, tabs):
    group, _ = ControlGroup.objects.get_or_create(name=name)
    for t in tabs:
        tab = Tab.objects.get(tab=t)
        group.tabs.add(tab)
    print('Created group {} with tabs {}'.format(name, tabs))
    return group


print('Creating tabs...')
[Tab.objects.get_or_create(tab=t) for t in ['a', 'f', 'fof', 'mf', 'ml']]

print('Creating control groups...')
GROUP_A = create_group('A', ['a'])
GROUP_B = create_group('B', ['a', 'f', 'fof', 'mf', 'ml'])

groups = [GROUP_A, GROUP_B, ]

print('Dispatching users...')
users = User.objects.all()
for u in users:
    cg = random.choice(groups)
    # We delete old control groups in case we are re-dispatching
    UserControlGroup.objects.filter(user=u).delete()
    UserControlGroup.objects.get_or_create(user=u, control_group=cg)
    print('Dispatched user {} in group {}.'.format(u, cg))

print('DONE.')
