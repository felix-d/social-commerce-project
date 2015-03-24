from fabric.api import env, run, cd, local

env.hosts = ['socialcomm@socialcomm.webfactional.com']


def commit():
    local("git add -A .")
    msg = raw_input("Commit message: ")
    local("git commit -am '%s'" % msg)
    local("git push")


def server_pull():
    with cd("/home/socialcomm/webapps/hec/social_commerce_project"):
        run("git reset --hard HEAD")
        run("git pull")
        run("python3.4 manage.py collectstatic --noinput")
        run("../apache2/bin/restart", pty=False)


def deploy():
    commit()
    server_pull()
