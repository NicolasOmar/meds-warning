---
applyTo: "**/*.test.ts,**/*.test.tsx"
---
# Project unit tests standards
- All mocked data used for the tests should be located in a separated `mocks.json` file and import them.
- Every time a test file is updated, at the end of the update, run the following scripts in order:
  - `npm run build` to check project builds correctly.
  - `npm run lint` to check the code maintains correct standards.
- In case any of those scripts throw errors or warning messages, look for a fix on those files.
- After running the mentioned scripts, run `npm run test:ci` and review that code coverage is above 90%.
  - In case is below that percentage, please work on adding new unit tests in order to achieve the desired coverage.