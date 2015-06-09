BASE = .

all: serve

node_modules:
	npm install

serve: test
	npm start

test: node_modules
	./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha -- test/ -R spec

report: test
	open coverage/lcov-report/index.html

clean:
	$(RM) -r node_modules

.PHONY: test server report


