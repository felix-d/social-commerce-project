from fabric.api import env, run, cd, local


env.hosts = ['socialcomm@socialcomm.webfactional.com']


def commit():
    local("git add -A .")
    msg = raw_input("Commit message: ")
    local('git commit -am "%s"' % msg)
    local("git push")


def server_pull():
    with cd("/home/socialcomm/webapps/hec/social_commerce_project"):
        run("git reset --hard HEAD")
        run("git pull")
        run("python3.4 manage.py collectstatic --noinput")
        run("../apache2/bin/restart", pty=False)


def create_fixtures():
    local("python manage.py dumpdata" +
          "--indent=4 -e contenttypes " +
          "-e sessions -e admin " +
          "-e auth.Permission -n > 'data.json'")
    local("cp -f data.json ./reviews/fixtures/")
    local("cp -f data.json ./phase1/fixtures/")
    local("cp -f data.json ./phase2/fixtures/")
    

def deploy():
    commit()
    server_pull()
