import { analyzeMortgageEligibility, calculateMonthlyPayment } from './calculations';

describe('analyzeMortgageEligibility', () => {

  /**
   * TC1: Caso donde no se generan escenarios asequibles
   * El principal es válido pero todos los escenarios exceden el 43% de affordability
   */
  it('TC1: Debe retornar NO_AFFORDABLE_SCENARIOS cuando ningún escenario cumple la relación 43%', () => {
    // Arrange
    const applicant = {
      monthlyIncome: 2000,
      monthlyCommitments: 1500,
      propertyPrice: 200000,
      deposit: 40000,
      currentDebt: 200,
      creditScore: 700,
      loanTerm: 30
    };

    // Act
    const result = analyzeMortgageEligibility(applicant);

    // Assert
    expect(result.eligible).toBe(false);
    expect(result.reason).toBe('NO_AFFORDABLE_SCENARIOS');
    expect(result.details).toHaveProperty('income');
    expect(result.details).toHaveProperty('commitments');
  });

  /**
   * TC2: Caso donde la tasa de interés resultante es 0%
   * Valida que se genera al menos un escenario cuando la tasa es muy baja
   */
  it('TC2: Debe generar escenarios cuando las tasas son bajas y el pago es asequible', () => {
    // Arrange
    const applicant = {
      monthlyIncome: 5000,
      monthlyCommitments: 500,
      propertyPrice: 300000,
      deposit: 100000,
      currentDebt: 0,
      creditScore: 750,
      loanTerm: 30
    };

    // Act
    const result = analyzeMortgageEligibility(applicant);

    // Assert
    expect(result.eligible).toBe(true);
    expect(Array.isArray(result.scenarios)).toBe(true);
    expect(result.scenarios.length).toBeGreaterThan(0);
    expect(result.scenarios[0]).toHaveProperty('interestRate');
    expect(result.scenarios[0]).toHaveProperty('monthlyPayment');
  });

  /**
   * TC3: Caso donde después del loop no hay escenarios (scenarios.length === 0)
   * Simula que todas las tasas generan compromisos > 43%
   */
  it('TC3: Debe retornar NO_AFFORDABLE_SCENARIOS cuando el loop no agrega escenarios', () => {
    // Arrange
    const applicant = {
      monthlyIncome: 1500,
      monthlyCommitments: 1400,
      propertyPrice: 150000,
      deposit: 30000,
      currentDebt: 0,
      creditScore: 700,
      loanTerm: 30
    };

    // Act
    const result = analyzeMortgageEligibility(applicant);

    // Assert
    expect(result.eligible).toBe(false);
    expect(result.reason).toBe('NO_AFFORDABLE_SCENARIOS');
    expect(result.scenarios).toBeUndefined();
  });

  /**
   * TC4: Caso donde existen escenarios válidos y se selecciona correctamente el bestScenario
   */
  it('TC4: Debe retornar eligible=true y definir bestScenario cuando hay escenarios válidos', () => {
    // Arrange
    const applicant = {
      monthlyIncome: 6000,
      monthlyCommitments: 800,
      propertyPrice: 400000,
      deposit: 120000,
      currentDebt: 100,
      creditScore: 720,
      loanTerm: 25
    };

    // Act
    const result = analyzeMortgageEligibility(applicant);

    // Assert
    expect(result.eligible).toBe(true);
    expect(result.bestScenario).toBeDefined();
    expect(result.bestScenario).toHaveProperty('interestRate');
    expect(result.bestScenario).toHaveProperty('monthlyPayment');
    expect(result.bestScenario).toHaveProperty('affordabilityRatio');
  });

  /**
   * TC5: Caso donde el ciclo sobre tasas de interés genera múltiples escenarios
   * Valida que scenarios.length > 1
   */
  it('TC5: Debe generar múltiples escenarios cuando varias tasas cumplen affordability', () => {
    // Arrange
    const applicant = {
      monthlyIncome: 8000,
      monthlyCommitments: 1000,
      propertyPrice: 500000,
      deposit: 150000,
      currentDebt: 200,
      creditScore: 750,
      loanTerm: 30
    };

    // Act
    const result = analyzeMortgageEligibility(applicant);

    // Assert
    expect(result.eligible).toBe(true);
    expect(Array.isArray(result.scenarios)).toBe(true);
    expect(result.scenarios.length).toBeGreaterThan(1);
    
    // Valida que cada escenario tenga la estructura correcta
    result.scenarios.forEach(scenario => {
      expect(scenario).toHaveProperty('interestRate');
      expect(scenario).toHaveProperty('monthlyPayment');
      expect(scenario).toHaveProperty('affordabilityRatio');
      expect(scenario).toHaveProperty('totalMonthlyCommitment');
    });
  });

  /**
   * TC6: Caso general completo con perfil válido
   * Valida que el objeto de respuesta contiene todas las propiedades requeridas
   */
  it('TC6: Debe retornar estructura completa cuando el solicitante es elegible', () => {
    // Arrange
    const applicant = {
      monthlyIncome: 7000,
      monthlyCommitments: 900,
      propertyPrice: 450000,
      deposit: 135000,
      currentDebt: 150,
      creditScore: 700,
      loanTerm: 28
    };

    // Act
    const result = analyzeMortgageEligibility(applicant);

    // Assert
    expect(result.eligible).toBe(true);
    expect(result).toHaveProperty('applicantProfile');
    expect(result).toHaveProperty('riskAssessment');
    expect(result).toHaveProperty('scenarios');
    expect(result).toHaveProperty('bestScenario');
    expect(result).toHaveProperty('summary');

    // Valida estructura de applicantProfile
    expect(result.applicantProfile).toHaveProperty('creditRisk');
    expect(result.applicantProfile).toHaveProperty('creditScore');
    expect(result.applicantProfile).toHaveProperty('debtToIncomeRatio');
    expect(result.applicantProfile).toHaveProperty('depositStrategy');
    expect(result.applicantProfile).toHaveProperty('depositAmount');
    expect(result.applicantProfile).toHaveProperty('depositRatioPercentage');

    // Valida estructura de riskAssessment
    expect(result.riskAssessment).toHaveProperty('level');
    expect(result.riskAssessment).toHaveProperty('score');
    expect(result.riskAssessment).toHaveProperty('recommendation');

    // Valida estructura de summary
    expect(result.summary).toHaveProperty('loanAmount');
    expect(result.summary).toHaveProperty('propertyPrice');
    expect(result.summary).toHaveProperty('availableIncome');
    expect(result.summary).toHaveProperty('recommendation');
  });
});
