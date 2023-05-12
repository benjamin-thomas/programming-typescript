# Reading the book Programming TypeScript

## TypeScript project setup

- yarn init -py
	- change the version to 0.0.1
	- change or delete licence
- yarn add -D @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint typescript
- copy `.eslintrc` and `.eslintignore` from a previous chapter
- cp -v ../chapter04/.eslint* .
- yarn tsc --init --outDir ./dist
- mkdir ./src
- echo 'console.log("Hello, World!")' >./src/index.ts
- yarn tsc && node ./dist/index.js


Then use this workflow:

```
Workflow: (editor provides eslint feedback)

	Pane #1:
	yarn tsc --watch

	Pane #2:
	echo ./dist/index.js | entr -c node /_

```

Optionally, add this start entry for better editor integration:

```
"scripts": {
  "start": "eslint --max-warnings 0 ./src/ && tsc && node ./dist/index.js"
},
```