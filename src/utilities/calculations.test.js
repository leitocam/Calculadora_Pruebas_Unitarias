import { calculateMortgage } from './calculations';

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