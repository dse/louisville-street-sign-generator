SSH_DEST = dse@webonastick.com
REPOS_DIR = ~/git/dse.d/louisville-street-sign-generator
REPOS_URL = git@github.com:dse/louisville-street-sign-generator.git
SYMLINK = /www/webonastick.com/htdocs/streetsign

publish:
	ssh $(SSH_DEST) '\
		if [ -d $(REPOS_DIR) ] ; then \
			cd $(REPOS_DIR) && git pull ; \
		else \
			cd "$$(dirname $(REPOS_DIR))" && git clone $(REPOS_URL) ; \
		fi ; \
		ln -n -f -s $(REPOS_DIR) $(SYMLINK)'
