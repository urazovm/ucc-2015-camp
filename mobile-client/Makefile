BASE = .
BASE = .

ISTANBUL = ./node_modules/.bin/istanbul

node_modules:
	npm install

test: node_modules
	gulp test

clean:
	$(RM) -r node_modules
