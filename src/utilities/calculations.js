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
