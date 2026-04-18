import { analyzeMortgageEligibility } from './calculations';

describe('analyzeMortgageEligibility', () => {
  it('returns INVALID_INPUT when applicant data is missing', () => {
    expect(analyzeMortgageEligibility()).toEqual({
      eligible: false,
      reason: 'INVALID_INPUT',
    });
  });

  it('returns INSUFFICIENT_INCOME when commitments exceed monthly income', () => {
    const result = analyzeMortgageEligibility({
      monthlyIncome: 1000,
      monthlyCommitments: 1200,
      propertyPrice: 200000,
      deposit: 20000,
      creditScore: 720,
      loanTerm: 30,
    });

    expect(result).toEqual({
      eligible: false,
      reason: 'INSUFFICIENT_INCOME',
      details: { deficit: 200 },
    });
  });

  it('returns INSUFFICIENT_DEPOSIT when deposit is lower than 5%', () => {
    const result = analyzeMortgageEligibility({
      monthlyIncome: 4000,
      monthlyCommitments: 500,
      propertyPrice: 300000,
      deposit: 10000,
      currentDebt: 0,
      creditScore: 710,
      loanTerm: 30,
    });

    expect(result.eligible).toBe(false);
    expect(result.reason).toBe('INSUFFICIENT_DEPOSIT');
    expect(result.details).toEqual({ required: 15000, provided: 10000 });
  });

  it('returns EXCESSIVE_CURRENT_DEBT when debt ratio is over 50%', () => {
    const result = analyzeMortgageEligibility({
      monthlyIncome: 4000,
      monthlyCommitments: 500,
      propertyPrice: 300000,
      deposit: 60000,
      currentDebt: 2500,
      creditScore: 710,
      loanTerm: 30,
    });

    expect(result.eligible).toBe(false);
    expect(result.reason).toBe('EXCESSIVE_CURRENT_DEBT');
    expect(result.details.currentRatio).toBeCloseTo(62.5, 1);
    expect(result.details.limit).toBe(50);
  });

  it('returns NO_AFFORDABLE_SCENARIOS when no interest scenario is affordable', () => {
    const result = analyzeMortgageEligibility({
      monthlyIncome: 2500,
      monthlyCommitments: 900,
      propertyPrice: 350000,
      deposit: 17500,
      currentDebt: 200,
      creditScore: 720,
      loanTerm: 30,
    });

    expect(result).toEqual({
      eligible: false,
      reason: 'NO_AFFORDABLE_SCENARIOS',
      details: { income: 2500, commitments: 900 },
    });
  });

  it('returns a full successful analysis with scenarios for valid applicant', () => {
    const result = analyzeMortgageEligibility({
      monthlyIncome: 9000,
      monthlyCommitments: 500,
      propertyPrice: 450000,
      deposit: 112500,
      currentDebt: 300,
      creditScore: 760,
      loanTerm: 30,
    });

    expect(result.eligible).toBe(true);
    expect(result).toHaveProperty('applicantProfile');
    expect(result).toHaveProperty('riskAssessment');
    expect(result).toHaveProperty('scenarios');
    expect(result).toHaveProperty('bestScenario');
    expect(result).toHaveProperty('summary');

    expect(result.applicantProfile).toEqual({
      creditRisk: 'EXCELLENT',
      creditScore: 760,
      debtToIncomeRatio: 3,
      depositStrategy: 'OPTIMAL',
      depositAmount: 112500,
      depositRatioPercentage: 25,
    });

    expect(result.riskAssessment).toEqual({
      level: 'LOW',
      score: 22,
      recommendation: 'APPROVE_STANDARD',
    });

    expect(Array.isArray(result.scenarios)).toBe(true);
    expect(result.scenarios.length).toBe(5);
    result.scenarios.forEach((scenario) => {
      expect(scenario).toHaveProperty('interestRate');
      expect(scenario).toHaveProperty('monthlyPayment');
      expect(scenario).toHaveProperty('affordabilityRatio');
      expect(scenario).toHaveProperty('totalMonthlyCommitment');
    });

    expect(result.bestScenario).toEqual({
      interestRate: 4.5,
      monthlyPayment: 1710.35,
      affordabilityRatio: 28,
    });

    expect(result.summary).toEqual({
      loanAmount: 337500,
      propertyPrice: 450000,
      availableIncome: 8500,
      recommendation: 'Depósito fuerte. Tasas favorables.',
    });
  });

  it('assigns MINIMUM_REQUIRED strategy and VERY_POOR credit risk at lower bounds', () => {
    const result = analyzeMortgageEligibility({
      monthlyIncome: 7000,
      monthlyCommitments: 300,
      propertyPrice: 200000,
      deposit: 10000,
      currentDebt: 0,
      creditScore: 599,
      loanTerm: 30,
    });

    expect(result.eligible).toBe(true);
    expect(result.applicantProfile.creditRisk).toBe('VERY_POOR');
    expect(result.applicantProfile.depositStrategy).toBe('MINIMUM_REQUIRED');
    expect(result.summary.recommendation).toBe('Depósito mínimo. Evalúa affordability.');
  });

  it('assigns INCREASE_SLIGHTLY strategy in middle deposit range and GOOD risk threshold', () => {
    const result = analyzeMortgageEligibility({
      monthlyIncome: 9000,
      monthlyCommitments: 500,
      propertyPrice: 300000,
      deposit: 45000,
      currentDebt: 200,
      creditScore: 700,
      loanTerm: 30,
    });

    expect(result.eligible).toBe(true);
    expect(result.applicantProfile.creditRisk).toBe('GOOD');
    expect(result.applicantProfile.depositStrategy).toBe('INCREASE_SLIGHTLY');
    expect(result.summary.recommendation).toBe('Depósito moderado. Mejora con cada 1%.');
  });
});
