import {
  calculateMortgage,
  calculateInsurance,
  calculateCompoundInterest,
  calculateAffordabilityRatio,
  validateAffordability,
  evaluateRiskLevel
} from './calculations';

describe('calculateMortgage', () => {
  
  /**
   * Camino 1 (V(G)=4): Cuando faltan datos obligatorios (salary vacío)
   * calculateMaxHouseValue retorna 0 porque salary es NaN (falsy)
   */
  describe('Camino 1: Datos obligatorios faltantes (salary = "")', () => {
    it('TC1: Debe manejar salary vacío y retornar maxHouseValue=0 con outstandingDebt=0', () => {
      // Arrange
      const inputData = {
        salary: '',
        salary2: 0,
        deposit: 50000,
        commitments: 500,
        term: 30,
        interest: 4.5
      };

      const result = calculateMortgage(inputData);

      expect(result).toEqual({
        maxHouseValue: 0,
        monthlyPayment: 0,
        totalPaid: 0,
        totalInterest: 0,
        outstandingDebt: 0
      });
    });
  });

  /**
   * Camino 2 (V(G)=4): Cuando la deuda pendiente es 0
   * calculateMonthlyPayment retorna 0 porque principalAmount es 0 (falsy)
   */
  describe('Camino 2: Deuda pendiente = 0 (outstandingDebt = 0)', () => {
    it('TC2: Debe retornar pago mensual=0 cuando outstandingDebt=0', () => {
      const inputData = {
        salary: 1000,
        salary2: 0,
        deposit: 1000,
        commitments: 3000,
        term: 30,
        interest: 4.5
      };

      const result = calculateMortgage(inputData);

      expect(result).toEqual({
        maxHouseValue: 1000,
        monthlyPayment: 0,
        totalPaid: 0,
        totalInterest: 0,
        outstandingDebt: 0
      });
    });
  });

  /**
   * Camino 3 (V(G)=4): Cuando la tasa de interés es 0
   * calculateMonthlyPayment usa la rama: return principalAmount / numberOfPayments
   * (evita la fórmula de amortización compleja)
   */
  describe('Camino 3: Tasa de interés = 0 (interés = 0%)', () => {
    it('TC3: Debe calcular pago mensual simple sin fórmula de amortización cuando interest=0', () => {
      const inputData = {
        salary: 50000,
        salary2: 0,
        deposit: 50000,
        commitments: 0,
        term: 10,
        interest: 0
      };

      const result = calculateMortgage(inputData);

      expect(result).toEqual({
        maxHouseValue: 200000,
        monthlyPayment: 1250,
        totalPaid: 150000,
        totalInterest: 0,
        outstandingDebt: 150000
      });
    });
  });

  /**
   * Camino 4 (V(G)=4): Caso general con interés > 0
   * Usa la fórmula completa de amortización:
   * monthlyPayment = (P × r × (1+r)^n) / ((1+r)^n - 1)
   */
  describe('Camino 4: Caso general con interés > 0 (fórmula de amortización)', () => {
    it('TC4: Debe calcular con fórmula de amortización cuando interest>0', () => {
      const inputData = {
        salary: 400,
        salary2: 0,
        deposit: 300,
        commitments: 0,
        term: 1,
        interest: 12
      };

      const result = calculateMortgage(inputData);

      expect(result).toEqual(expect.objectContaining({
        maxHouseValue: 1500,
        outstandingDebt: 1200
      }));
      
      expect(result.monthlyPayment).toBeCloseTo(106.62, 1);
      expect(result.totalPaid).toBeCloseTo(1279.44, 1);
      expect(result.totalInterest).toBeCloseTo(79.44, 1);
    });
  });
});


describe('evaluateRiskLevel', () => {
  it.each([
    ['EXCELLENT', 0, { level: 'LOW', score: 20, recommendation: 'APPROVE_STANDARD' }],
    ['GOOD', 0, { level: 'LOW', score: 40, recommendation: 'APPROVE_WITH_TERMS' }],
    ['FAIR', 0, { level: 'MODERATE', score: 60, recommendation: 'APPROVE_WITH_CONDITIONS' }],
    ['POOR', 0, { level: 'HIGH', score: 75, recommendation: 'REQUEST_HIGHER_DEPOSIT' }],
    ['VERY_POOR', 0, { level: 'VERY_HIGH', score: 90, recommendation: 'REQUIRES_SPECIALIST_REVIEW' }]
  ])(
    'retorna el nivel ajustado correcto para creditRisk=%s con debtRatio=0',
    (creditRisk, debtRatio, expected) => {
      const result = evaluateRiskLevel(creditRisk, debtRatio);
      expect(result).toEqual(expected);
    }
  );

  it('maneja creditRisk desconocido con fallback', () => {
    const result = evaluateRiskLevel('UNKNOWN', 0);
    expect(result).toEqual({
      level: 'MODERATE',
      score: 60,
      recommendation: 'MANUAL_REVIEW'
    });
  });

  it.each([
    // adjustedScore > 80 -> VERY_HIGH (usando FAIR baseScore=60 + debtRatio*0.5 > 80)
    ['FAIR', 41, { level: 'VERY_HIGH', score: 81, recommendation: 'APPROVE_WITH_CONDITIONS' }],
    // 60 + (41 * 0.5) = 60 + 20.5 = 80.5 > 80 -> VERY_HIGH

    // 60 < adjustedScore <= 80 -> HIGH (usando FAIR baseScore=60 + debtRatio*0.5)
    ['FAIR', 21, { level: 'HIGH', score: 71, recommendation: 'APPROVE_WITH_CONDITIONS' }],
    // 60 + (21 * 0.5) = 60 + 10.5 = 70.5 -> HIGH

    // 40 < adjustedScore <= 60 -> MODERATE (usando GOOD baseScore=40 + debtRatio*0.5)
    ['GOOD', 21, { level: 'MODERATE', score: 51, recommendation: 'APPROVE_WITH_TERMS' }],
    // 40 + (21 * 0.5) = 40 + 10.5 = 50.5 -> MODERATE

    // adjustedScore <= 40 -> LOW (usando EXCELLENT baseScore=20 + debtRatio*0.5 <= 40)
    ['EXCELLENT', 0, { level: 'LOW', score: 20, recommendation: 'APPROVE_STANDARD' }]
    // 20 + 0 = 20 <= 40 -> LOW
  ])(
    'ajusta el nivel final basado en adjustedScore para creditRisk=%s y debtRatio=%i',
    (creditRisk, debtRatio, expected) => {
      const result = evaluateRiskLevel(creditRisk, debtRatio);
      expect(result).toEqual(expected);
    }
  );
});


describe('calculateInsurance', () => {
  it('retorna 0 cuando el valor de la propiedad es falsy', () => {
    expect(calculateInsurance(0)).toBe(0);
    expect(calculateInsurance(null)).toBe(0);
  });

  it('calcula el seguro básico correctamente', () => {
    expect(calculateInsurance(100000, 'basic')).toBe(300);
  });

  it('usa la tarifa estándar cuando el tipo es desconocido', () => {
    expect(calculateInsurance(100000, 'gold')).toBe(500);
  });
});

describe('calculateCompoundInterest', () => {
  it('retorna 0 cuando el capital o los años están ausentes', () => {
    expect(calculateCompoundInterest(0, 5, 10)).toBe(0);
    expect(calculateCompoundInterest(1000, 5, 0)).toBe(0);
  });

  it('calcula el interés compuesto correctamente', () => {
    expect(calculateCompoundInterest(1000, 5, 2, 2)).toBe(1103.81);
  });
});

describe('calculateAffordabilityRatio', () => {
  it('retorna 0 cuando el ingreso mensual es false', () => {
    expect(calculateAffordabilityRatio(500, 0)).toBe(0);
  });

  it('calcula el porcentaje de la relación deuda-ingreso', () => {
    expect(calculateAffordabilityRatio(500, 2000)).toBe(25);
  });
});

describe('validateAffordability', () => {
  it.each([
    [500, 2000, true, 25, '✓ Excellent! Well within healthy limits'],
    [700, 2000, true, 35, '✓ Acceptable! Within recommended limits'],
    [800, 2000, true, 40, '⚠ Caution! Approaching high debt levels'],
    [900, 2000, false, 45, '✗ High risk! This may be unaffordable']
  ])(
    'Retorna la evaluación de asequibilidad correctamente para pago mensual=%i e ingreso mensual=%i',
    (monthlyPayment, monthlyIncome, expectedAffordable, expectedRatio, expectedMessage) => {
      const result = validateAffordability(monthlyPayment, monthlyIncome);
      expect(result).toEqual({
        isAffordable: expectedAffordable,
        ratio: expectedRatio,
        message: expectedMessage
      });
    }
  );
});
/////////////////////////////////////////////////////////////


