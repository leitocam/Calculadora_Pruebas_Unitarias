# Financial Calculator Suite

React app with mortgage, insurance, and investment calculators.

## X-Unit framework used

This repository uses **Jest** (through `react-scripts test`) as the X-Unit framework.

### Why Jest (technical justification)

- Already integrated in Create React App (`react-scripts`), so no custom test runner wiring is required.
- Native support for assertions, mocks/spies, coverage reports, and watch mode.
- Strong ecosystem support with `@testing-library/jest-dom` for UI assertions when needed.
- Good fit for pure-function unit testing in `src/utilities/calculations.js`.

## Project setup

```bash
npm install
```

## Run unit tests

```bash
npm test -- --watchAll=false
```

## Run coverage

```bash
npm test -- --watchAll=false --coverage
```

## Assignment testing scope

Implemented/updated unit tests for these real functions in `src/utilities/calculations.js`:

- `calculateMaxHouseValue`
- `calculateMonthlyPayment`
- `calculateMortgage`
- `calculateInsurance`
- `calculateCompoundInterest`
- `calculateAffordabilityRatio`
- `validateAffordability`
- `evaluateRiskLevel`
- `analyzeMortgageEligibility`

See [TESTING.md](./TESTING.md) for full details, coverage notes, and limitations.
