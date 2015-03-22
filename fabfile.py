from fabric.api import local


def backup():
    local('git pull')
    local('git add .')

    print("enter your commit comment:")
    comment = raw_input()
    local('git commit -m "{}"'.format(comment))

    local('git push')

# prod_server = 'socialcomm@socialcomm.webfactional.com'


# def prod():
#     env.hosts = [prod_server]
#     env.remote_app_dir = "~/webapps/socialcommerceproject/" +\
#                          "socialcommerceproject"
#     env.remote_apache_dir = "~/webapps/socialcommerceproject/apache2"
#     env.bash_rc = "~/.bashrc"


# def collectstatic():
#     require('hosts', provided_by=[prod])
#     run("cd {}; python3.4 manage.py collectstatic --noinput"
#         .format(env.remote_app_dir))


# def restart_server():
#     """Restart apache on the server."""
#     require('hosts', provided_by=[prod])
#     require('remote_apache_dir', provided_by=[prod])

#     run("{}/bin/restart;".format(env.remote_apache_dir))


# def check_env(var, val):
#     require('bash_rc', provided_by=[prod])
#     if not env[var]:
#         run("echo export {}={} >> {}".format(
#             var,
#             val,
#             env.bash_rc
#         ))


# def check_and_set_envs():
#     check_env('DJANGO_SETTINGS_MODULE', 'prod_settings.py')


# def deploy():
#     require('hosts', provided_by=[prod])
#     require('remote_apache_dir', provided_by=[prod])
#     check_and_set_envs()
#     collectstatic()
#     restart_server()
