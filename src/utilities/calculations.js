/**
 * Pure calculation functions for mortgage and financial calculations
 * These functions are designed to be easily tested
 */

/**
 * Calculate maximum house value
 * @param {number} salary1 - First annual salary
 * @param {number} salary2 - Second annual salary (optional)
 * @param {number} deposit - Initial deposit amount
 * @param {number} commitments - Monthly financial commitments
 * @returns {number} Maximum house value
 */
export const calculateMaxHouseValue = (salary1, salary2, deposit, commitments) => {
  if (!salary1 || !deposit) return 0;
  const totalSalary = salary1 + (salary2 || 0);
  const maxValue = totalSalary * 3 + deposit;
  return Math.max(0, maxValue - commitments);
};

/**
 * Calculate monthly mortgage repayment
 * @param {number} principalAmount - Total amount to borrow
 * @param {number} annualInterestRate - Annual interest rate percentage
 * @param {number} loanTermYears - Loan term in years
 * @returns {number} Monthly payment amount
 */
export const calculateMonthlyPayment = (principalAmount, annualInterestRate, loanTermYears) => {
  if (!principalAmount || !loanTermYears) return 0;
  
  const monthlyRate = annualInterestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;

  if (monthlyRate === 0) {
    return principalAmount / numberOfPayments;
  }

  const monthlyPayment =
    (principalAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  return monthlyPayment;
};

/**
 * Calculate total mortgage details
 * @param {object} data - Form data object
 * @returns {object} Mortgage calculation results
 */
export const calculateMortgage = (data) => {
  const {
    salary,
    salary2 = 0,
    deposit,
    commitments,
    term,
    interest
  } = data;

  const totalSalary = parseInt(salary) + parseInt(salary2 || 0);
  const maxHouseValue = calculateMaxHouseValue(totalSalary, 0, parseInt(deposit), parseInt(commitments));
  const outstandingDebt = maxHouseValue - parseInt(deposit);
  const monthlyPayment = calculateMonthlyPayment(outstandingDebt, parseFloat(interest), parseInt(term));
  const totalPaid = monthlyPayment * parseInt(term) * 12;
  const totalInterest = totalPaid - outstandingDebt;

  return {
    maxHouseValue: Math.round(maxHouseValue),
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPaid: Math.round(totalPaid * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    outstandingDebt: Math.round(outstandingDebt)
  };
};

/**
 * Calculate insurance cost based on property value
 * @param {number} propertyValue - Value of the property
 * @param {string} insuranceType - Type of insurance (basic, standard, premium)
 * @returns {number} Annual insurance cost
 */
export const calculateInsurance = (propertyValue, insuranceType = 'standard') => {
  if (!propertyValue) return 0;

  const rates = {
    basic: 0.003,      // 0.3%
    standard: 0.005,   // 0.5%
    premium: 0.008     // 0.8%
  };

  const rate = rates[insuranceType] || rates.standard;
  return Math.round((propertyValue * rate) * 100) / 100;
};

/**
 * Calculate compound interest
 * @param {number} principal - Initial investment
 * @param {number} annualRate - Annual interest rate percentage
 * @param {number} years - Number of years
 * @param {number} compoundFrequency - Times per year (1=annually, 12=monthly, etc)
 * @returns {number} Final amount with compound interest
 */
export const calculateCompoundInterest = (principal, annualRate, years, compoundFrequency = 12) => {
  if (!principal || !years) return 0;

  const rate = annualRate / 100;
  const amount = principal * Math.pow(1 + rate / compoundFrequency, compoundFrequency * years);
  return Math.round(amount * 100) / 100;
};

/**
 * Calculate affordability ratio (debt-to-income)
 * @param {number} monthlyDebt - Total monthly debt payments
 * @param {number} monthlyIncome - Total monthly income
 * @returns {number} Debt-to-income ratio percentage
 */
export const calculateAffordabilityRatio = (monthlyDebt, monthlyIncome) => {
  if (!monthlyIncome) return 0;
  return Math.round((monthlyDebt / monthlyIncome) * 100);
};

/**
 * Validate mortgage affordability
 * @param {number} monthlyPayment - Monthly mortgage payment
 * @param {number} monthlyIncome - Total monthly income
 * @returns {object} Affordability status and message
 */
export const validateAffordability = (monthlyPayment, monthlyIncome) => {
  const ratio = calculateAffordabilityRatio(monthlyPayment, monthlyIncome);
  
  if (ratio <= 28) {
    return { isAffordable: true, ratio, message: '✓ Excellent! Well within healthy limits' };
  } else if (ratio <= 36) {
    return { isAffordable: true, ratio, message: '✓ Acceptable! Within recommended limits' };
  } else if (ratio <= 43) {
    return { isAffordable: true, ratio, message: '⚠ Caution! Approaching high debt levels' };
  } else {
    return { isAffordable: false, ratio, message: '✗ High risk! This may be unaffordable' };
  }
};

// V(G) = 8 - COMPLEJIDAD CICLOMÁTICA
export const evaluateRiskLevel = (creditRisk, debtRatio) => {
  const riskMatrix = {
    EXCELLENT: { baseScore: 20, level: 'LOW', recommendation: 'APPROVE_STANDARD' },
    GOOD: { baseScore: 40, level: 'MODERATE', recommendation: 'APPROVE_WITH_TERMS' },
    FAIR: { baseScore: 60, level: 'HIGH', recommendation: 'APPROVE_WITH_CONDITIONS' },
    POOR: { baseScore: 75, level: 'HIGH', recommendation: 'REQUEST_HIGHER_DEPOSIT' },
    VERY_POOR: { baseScore: 90, level: 'VERY_HIGH', recommendation: 'REQUIRES_SPECIALIST_REVIEW' }
  };
  
  const baseRisk = riskMatrix[creditRisk] || { baseScore: 60, level: 'HIGH', recommendation: 'MANUAL_REVIEW' };
  const adjustedScore = baseRisk.baseScore + (debtRatio * 0.5);
  
  let finalLevel = baseRisk.level;
  if (adjustedScore > 80) finalLevel = 'VERY_HIGH';
  else if (adjustedScore > 60) finalLevel = 'HIGH';
  else if (adjustedScore > 40) finalLevel = 'MODERATE';
  else finalLevel = 'LOW';

  return {
    level: finalLevel,
    score: Math.round(adjustedScore),
    recommendation: baseRisk.recommendation
  };
};

export const analyzeMortgageEligibility = (applicant) => {
  // D1: Validar ingresos
  if (!applicant || applicant.monthlyIncome === undefined) {
    return { eligible: false, reason: 'INVALID_INPUT' };
  }

  const monthlyIncome = applicant.monthlyIncome;
  const monthlyCommitments = applicant.monthlyCommitments || 0;

  if (monthlyIncome < monthlyCommitments) {
    return { eligible: false, reason: 'INSUFFICIENT_INCOME', details: { deficit: monthlyCommitments - monthlyIncome } };
  }

  // D2: Validar depósito mínimo (5%)
  const propertyPrice = applicant.propertyPrice;
  const deposit = applicant.deposit;
  const minDeposit = propertyPrice * 0.05;

  if (deposit < minDeposit) {
    return { eligible: false, reason: 'INSUFFICIENT_DEPOSIT', details: { required: minDeposit, provided: deposit } };
  }

  // D3: Validar deuda actual (<50%)
  const currentDebt = applicant.currentDebt || 0;
  const currentDebtRatio = (currentDebt / monthlyIncome) * 100;

  if (currentDebtRatio > 50) {
    return { eligible: false, reason: 'EXCESSIVE_CURRENT_DEBT', details: { currentRatio: currentDebtRatio, limit: 50 } };
  }

  // D4-D7: Categoría de riesgo crediticio (5-way branch)
  const creditScore = applicant.creditScore;
  let creditRisk;
  if (creditScore >= 750) creditRisk = 'EXCELLENT';
  else if (creditScore >= 700) creditRisk = 'GOOD';
  else if (creditScore >= 650) creditRisk = 'FAIR';
  else if (creditScore >= 600) creditRisk = 'POOR';
  else creditRisk = 'VERY_POOR';

  // Cálculos
  const loanAmount = propertyPrice - deposit;
  const availableIncome = monthlyIncome - monthlyCommitments;

  // D8-D9: Estrategia de depósito (3-way branch)
  const depositRatio = (deposit / propertyPrice) * 100;
  let depositStrategy, depositRecommendation;
  if (depositRatio >= 25) {
    depositStrategy = 'OPTIMAL';
    depositRecommendation = 'Depósito fuerte. Tasas favorables.';
  } else if (depositRatio >= 15) {
    depositStrategy = 'INCREASE_SLIGHTLY';
    depositRecommendation = 'Depósito moderado. Mejora con cada 1%.';
  } else {
    depositStrategy = 'MINIMUM_REQUIRED';
    depositRecommendation = 'Depósito mínimo. Evalúa affordability.';
  }

  const riskAssessment = evaluateRiskLevel(creditRisk, currentDebtRatio);

  // LOOP: Analizar tasas de interés
  const interestRates = [2.5, 3.5, 4.5, 5.5, 6.5];
  const scenarios = [];

  for (let rate of interestRates) {
    const monthlyPayment = calculateMonthlyPayment(loanAmount, rate, applicant.loanTerm);
    const totalCommitments = monthlyCommitments + currentDebt + monthlyPayment;
    const newAffordability = (totalCommitments / monthlyIncome) * 100;

    if (newAffordability <= 43) {
      scenarios.push({
        interestRate: rate,
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        affordabilityRatio: Math.round(newAffordability),
        totalMonthlyCommitment: Math.round(totalCommitments * 100) / 100,
        isRecommended: rate === 3.5 || rate === 4.5
      });
    }
  }

  // D10: Validar escenarios viables
  if (scenarios.length === 0) {
    return { eligible: false, reason: 'NO_AFFORDABLE_SCENARIOS', details: { income: monthlyIncome, commitments: monthlyCommitments } };
  }

  const bestScenario = scenarios.reduce((best, current) => current.isRecommended ? current : best);

  return {
    eligible: true,
    applicantProfile: {
      creditRisk,
      creditScore,
      debtToIncomeRatio: Math.round(currentDebtRatio),
      depositStrategy,
      depositAmount: deposit,
      depositRatioPercentage: Math.round(depositRatio)
    },
    riskAssessment: { level: riskAssessment.level, score: riskAssessment.score, recommendation: riskAssessment.recommendation },
    scenarios: scenarios.map(s => ({ interestRate: s.interestRate, monthlyPayment: s.monthlyPayment, affordabilityRatio: s.affordabilityRatio, totalMonthlyCommitment: s.totalMonthlyCommitment })),
    bestScenario: { interestRate: bestScenario.interestRate, monthlyPayment: bestScenario.monthlyPayment, affordabilityRatio: bestScenario.affordabilityRatio },
    summary: { loanAmount, propertyPrice, availableIncome: Math.round(availableIncome * 100) / 100, recommendation: depositRecommendation }
  };
};
