import React, { useState } from 'react';
import { calculateMortgage, validateAffordability } from '../utilities/calculations';
import '../styles/Calculator.css';

/**
 * Componente Calculadora de Hipotecas - Funcionalidad principal de c\u00e1lculo
 */
const MortgageCalculator = () => {
  const [formData, setFormData] = useState({
    salary: '',
    salary2: '',
    deposit: '',
    commitments: '',
    term: '30',
    interest: '4.5'
  });

  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState({});
  const [showSecondSalary, setShowSecondSalary] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.salary || parseInt(formData.salary) <= 0) newErrors.salary = 'Se requiere un salario v\u00e1lido';
    if (!formData.deposit || parseInt(formData.deposit) <= 0) newErrors.deposit = 'Se requiere un dep\u00f3sito v\u00e1lido';
    if (!formData.commitments || parseInt(formData.commitments) < 0) newErrors.commitments = 'Se requiere un compromiso v\u00e1lido';
    if (!formData.term || parseInt(formData.term) <= 0) newErrors.term = 'Se requiere un plazo v\u00e1lido';
    if (!formData.interest || parseFloat(formData.interest) < 0) newErrors.interest = 'Se requiere una tasa de inter\u00e9s v\u00e1lida';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const results = calculateMortgage(formData);
    const monthlyIncome = (parseInt(formData.salary) + parseInt(formData.salary2 || 0)) / 12;
    const affordability = validateAffordability(results.monthlyPayment, monthlyIncome);

    setResults({
      ...results,
      affordability
    });
  };

  const handleReset = () => {
    setFormData({
      salary: '',
      salary2: '',
      deposit: '',
      commitments: '',
      term: '30',
      interest: '4.5'
    });
    setResults(null);
    setErrors({});
    setShowSecondSalary(false);
  };

  return (
    <div className="calculator-content">
      <div className="calculator-layout">
        <div className="form-section">
          <h2>Calculadora de Hipotecas</h2>
          <form onSubmit={handleSubmit} className="calculator-form">
            <div className="form-group">
              <label htmlFor="salary">Salario Anual Primario *</label>
              <input
                id="salary"
                type="number"
                name="salary"
                placeholder="p.ej., 50000"
                value={formData.salary}
                onChange={handleChange}
                className={`form-input ${errors.salary ? 'error' : ''}`}
              />
              {errors.salary && <span className="error-message">{errors.salary}</span>}
            </div>

            <div className="form-group">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowSecondSalary(!showSecondSalary)}
              >
                {showSecondSalary ? '\u2212 Eliminar' : '+'} Segundo Salario
              </button>
            </div>

            {showSecondSalary && (
              <div className="form-group">
                <label htmlFor="salary2">Salario Anual Secundario</label>
                <input
                  id="salary2"
                  type="number"
                  name="salary2"
                  placeholder="p.ej., 30000"
                  value={formData.salary2}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="deposit">Dep\u00f3sito Inicial *</label>
              <input
                id="deposit"
                type="number"
                name="deposit"
                placeholder="p.ej., 50000"
                value={formData.deposit}
                onChange={handleChange}
                className={`form-input ${errors.deposit ? 'error' : ''}`}
              />
              {errors.deposit && <span className="error-message">{errors.deposit}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="commitments">Compromisos Mensuales (£) *</label>
              <input
                id="commitments"
                type="number"
                name="commitments"
                placeholder="p.ej., 500"
                value={formData.commitments}
                onChange={handleChange}
                className={`form-input ${errors.commitments ? 'error' : ''}`}
              />
              {errors.commitments && <span className="error-message">{errors.commitments}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="term">Plazo del Préstamo (Años) *</label>
                <input
                  id="term"
                  type="number"
                  name="term"
                  placeholder="p.ej., 30"
                  value={formData.term}
                  onChange={handleChange}
                  className={`form-input ${errors.term ? 'error' : ''}`}
                />
                {errors.term && <span className="error-message">{errors.term}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="interest">Tasa de Inter\u00e9s (%) *</label>
                <input
                  id="interest"
                  type="number"
                  name="interest"
                  placeholder="p.ej., 4.5"
                  step="0.1"
                  value={formData.interest}
                  onChange={handleChange}
                  className={`form-input ${errors.interest ? 'error' : ''}`}
                />
                {errors.interest && <span className="error-message">{errors.interest}</span>}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">Calcular</button>
              <button type="button" className="btn-secondary" onClick={handleReset}>Restablecer</button>
            </div>
          </form>
        </div>

        {results && (
          <div className="results-section">
            <h2>Tus Resultados</h2>
            <div className="results-card">
              <div className="result-item">
                <span className="result-label">Valor Máximo de la Casa</span>
                <span className="result-value">£{results.maxHouseValue.toLocaleString()}</span>
              </div>

              <div className="result-item">
                <span className="result-label">Deuda Pendiente</span>
                <span className="result-value">£{results.outstandingDebt.toLocaleString()}</span>
              </div>

              <div className="divider"></div>

              <div className="result-item">
                <span className="result-label">Pago Mensual</span>
                <span className="result-value highlight">£{results.monthlyPayment.toLocaleString()}</span>
              </div>

              <div className="result-item">
                <span className="result-label">Total Pagado ({formData.term} a\u00f1os)</span>
                <span className="result-value">£{results.totalPaid.toLocaleString()}</span>
              </div>

              <div className="result-item">
                <span className="result-label">Intereses Totales</span>
                <span className="result-value">£{results.totalInterest.toLocaleString()}</span>
              </div>

              <div className="divider"></div>

              <div className={`affordability-check ${results.affordability.isAffordable ? 'affordable' : 'unaffordable'}`}>
                <span className="affordability-ratio">Relaci\u00f3n Deuda-Ingresos: {results.affordability.ratio}%</span>
                <span className="affordability-message">{results.affordability.message}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MortgageCalculator;
