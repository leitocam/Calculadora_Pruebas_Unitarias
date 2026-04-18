import {
  calculateMaxHouseValue,
  calculateMonthlyPayment,
  calculateMortgage,
  calculateInsurance,
  calculateCompoundInterest,
  calculateAffordabilityRatio,
  validateAffordability,
  evaluateRiskLevel,
} from './calculations';

describe('calculateMaxHouseValue', () => {
  it('returns 0 when required values are missing', () => {
    expect(calculateMaxHouseValue(0, 20000, 30000, 500)).toBe(0);
    expect(calculateMaxHouseValue(50000, 0, 0, 500)).toBe(0);
  });

  it('calculates max value for dual income and commitments', () => {
    expect(calculateMaxHouseValue(40000, 10000, 30000, 500)).toBe(179500);
  });

  it('never returns a negative house value', () => {
    expect(calculateMaxHouseValue(1000, 0, 1000, 100000)).toBe(0);
  });
});

describe('calculateMonthlyPayment', () => {
  it('returns 0 when principal or term is missing', () => {
    expect(calculateMonthlyPayment(0, 5, 30)).toBe(0);
    expect(calculateMonthlyPayment(100000, 5, 0)).toBe(0);
  });

  it('uses simple division when interest rate is zero', () => {
    expect(calculateMonthlyPayment(120000, 0, 10)).toBe(1000);
  });

  it('uses amortization formula when interest rate is greater than zero', () => {
    expect(calculateMonthlyPayment(200000, 5, 30)).toBeCloseTo(1073.64, 2);
  });
});

describe('calculateMortgage', () => {
  it('returns safe values for missing or invalid numeric inputs', () => {
    const result = calculateMortgage({ salary: '', deposit: 50000, commitments: 500, term: 30, interest: 4.5 });

    expect(result).toEqual({
      maxHouseValue: 0,
      monthlyPayment: 0,
      totalPaid: 0,
      totalInterest: 0,
      outstandingDebt: 0,
    });
  });

  it('calculates mortgage fields for a normal scenario', () => {
    const result = calculateMortgage({
      salary: 60000,
      salary2: 20000,
      deposit: 50000,
      commitments: 500,
      term: 25,
      interest: 4,
    });

    expect(result).toEqual({
      maxHouseValue: 289500,
      monthlyPayment: 1263.55,
      totalPaid: 379063.66,
      totalInterest: 139563.66,
      outstandingDebt: 239500,
    });
  });
});

describe('calculateInsurance', () => {
  it('returns 0 when property value is missing', () => {
    expect(calculateInsurance(0)).toBe(0);
  });

  it('calculates known insurance types and defaults unknown type to standard', () => {
    expect(calculateInsurance(200000, 'basic')).toBe(600);
    expect(calculateInsurance(200000, 'standard')).toBe(1000);
    expect(calculateInsurance(200000, 'premium')).toBe(1600);
    expect(calculateInsurance(200000, 'invalid-type')).toBe(1000);
  });
});

describe('calculateCompoundInterest', () => {
  it('returns 0 when principal or years are missing', () => {
    expect(calculateCompoundInterest(0, 5, 10)).toBe(0);
    expect(calculateCompoundInterest(10000, 5, 0)).toBe(0);
  });

  it('calculates compound interest with default monthly frequency', () => {
    expect(calculateCompoundInterest(10000, 6, 10)).toBeCloseTo(18193.97, 2);
  });

  it('supports custom compound frequency', () => {
    expect(calculateCompoundInterest(10000, 6, 10, 1)).toBeCloseTo(17908.48, 2);
  });
});

describe('calculateAffordabilityRatio', () => {
  it('returns 0 when monthly income is zero', () => {
    expect(calculateAffordabilityRatio(1500, 0)).toBe(0);
  });

  it('returns rounded debt-to-income percentage', () => {
    expect(calculateAffordabilityRatio(1500, 4000)).toBe(38);
  });
});

describe('validateAffordability', () => {
  it('returns excellent tier for ratio <= 28', () => {
    const result = validateAffordability(1000, 4000);
    expect(result).toEqual({
      isAffordable: true,
      ratio: 25,
      message: '✓ Excellent! Well within healthy limits',
    });
  });

  it('returns acceptable tier for ratio <= 36', () => {
    expect(validateAffordability(1400, 4000)).toEqual({
      isAffordable: true,
      ratio: 35,
      message: '✓ Acceptable! Within recommended limits',
    });
  });

  it('returns caution tier for ratio <= 43', () => {
    expect(validateAffordability(1700, 4000)).toEqual({
      isAffordable: true,
      ratio: 43,
      message: '⚠ Caution! Approaching high debt levels',
    });
  });

  it('returns high-risk tier for ratio > 43', () => {
    expect(validateAffordability(2000, 4000)).toEqual({
      isAffordable: false,
      ratio: 50,
      message: '✗ High risk! This may be unaffordable',
    });
  });
});

describe('evaluateRiskLevel', () => {
  it('returns expected data for known risk category', () => {
    expect(evaluateRiskLevel('EXCELLENT', 20)).toEqual({
      level: 'LOW',
      score: 30,
      recommendation: 'APPROVE_STANDARD',
    });
  });

  it('falls back to manual review for unknown credit risk', () => {
    expect(evaluateRiskLevel('UNKNOWN', 10)).toEqual({
      level: 'HIGH',
      score: 65,
      recommendation: 'MANUAL_REVIEW',
    });
  });

  it('adjusts final risk level based on adjusted score boundaries', () => {
    expect(evaluateRiskLevel('GOOD', 1).level).toBe('MODERATE');
    expect(evaluateRiskLevel('GOOD', 50).level).toBe('HIGH');
    expect(evaluateRiskLevel('VERY_POOR', 0).level).toBe('VERY_HIGH');
  });
});
