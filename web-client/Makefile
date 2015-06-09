BASE = .

ISTANBUL = ./node_modules/.bin/istanbul

node_modules:
	npm install

test: node_modules
	$(ISTANBUL) cover ./node_modules/.bin/_mocha -- test/ -R spec

clean:
	$(RM) -r node_modules
