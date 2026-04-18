# Testing and Coverage Report

## 1) Audit (real repository state)

### Repository inspection
- `package.json` defines test command as `react-scripts test`.
- Existing tests found in:
  - `src/utilities/calculations.test.js`
  - `src/utilities/analyzeMortgageEligibility.test.js`
- Target pure logic file: `src/utilities/calculations.js`.

### Framework and scripts detected
- Framework: **Jest** (via Create React App runner).
- Script: `npm test` → `react-scripts test`.

### Initial issues found during audit
- Existing tests only covered a subset of behaviors and left many branches/functions weakly asserted.
- Running tests in this execution environment failed because `react-scripts` binary was unavailable due restricted package installation policy (registry access blocked).

## 2) Unit tests implemented

Updated tests now cover all required functions and key branches:

- `calculateMaxHouseValue`
  - Required inputs missing
  - Normal dual-income case
  - Non-negative clamp behavior
- `calculateMonthlyPayment`
  - Missing principal/term
  - 0% interest branch
  - amortization formula branch
- `calculateMortgage`
  - Invalid/missing numeric values
  - normal scenario with rounded totals
- `calculateInsurance`
  - missing value
  - known plan rates + unknown type fallback
- `calculateCompoundInterest`
  - missing principal/years
  - default monthly compounding
  - custom compounding frequency
- `calculateAffordabilityRatio`
  - zero-income guard
  - rounded ratio
- `validateAffordability`
  - all tier boundaries (excellent/acceptable/caution/high risk)
- `evaluateRiskLevel`
  - known matrix value
  - unknown fallback branch
  - final level adjustments by score thresholds
- `analyzeMortgageEligibility`
  - invalid input
  - insufficient income
  - insufficient deposit
  - excessive current debt
  - no affordable scenarios
  - successful path with full structure assertions
  - deposit strategy boundary cases and credit-risk thresholds

## 3) Minimal bug fix applied

### Fix: `calculateMortgage` defensive numeric parsing and debt clamp

File: `src/utilities/calculations.js`

What was fixed:
- Added safe numeric conversion with fallback (`Number.isFinite`) for all inputs.
- Defaulted function argument to empty object (`data = {}`).
- Prevented negative `outstandingDebt` by clamping to `Math.max(0, ...)`.

Why:
- Previously, empty or invalid inputs could propagate `NaN` and/or negative debt values into downstream calculations, producing non-sensical financial outputs.
- This is a minimal correctness fix that improves robustness and testability without redesigning the app.

## 4) Coverage measurement

## Initial coverage
Attempted command:
```bash
CI=true npm test -- --watchAll=false --coverage
```

Observed in this environment:
- Could not execute because `react-scripts` was not runnable due dependency installation/network policy constraints.

## Final coverage
Intended command (same as instructor/demo flow):
```bash
CI=true npm test -- --watchAll=false --coverage
```

Status in this environment:
- Execution blocked by the same toolchain installation limitation.

> Note: The repository is prepared with deterministic Jest test suites and ready to produce coverage in a standard Node/npm environment with full dependency resolution.

## 5) How to run for instructor/demo

```bash
npm install
CI=true npm test -- --watchAll=false
CI=true npm test -- --watchAll=false --coverage
```

Coverage output will be generated in the standard Jest/CRA format (`text` summary and `coverage/` artifacts).

## 6) Limitations

- This run environment blocked package retrieval from npm registry (HTTP 403 for required packages), which prevented executing the CRA test runner here.
- Test implementation and commands are complete; execution should work in a normal development/instructor machine with registry access.
