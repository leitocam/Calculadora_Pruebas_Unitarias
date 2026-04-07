import React, { useState } from 'react';
import { calculateCompoundInterest } from '../utilities/calculations';
import '../styles/Calculator.css';

/**
 * Componente Analizador de Inversiones - Analizar el crecimiento y los ahorros de la inversión
 */
const InvestmentAnalyzer = () => {
  const [formData, setFormData] = useState({
    principal: '',
    annualRate: '5',
    years: '10',
    compoundFrequency: '12'
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const compoundOptions = [
    { value: '1', label: 'Anualmente' },
    { value: '2', label: 'Semestralmente' },
    { value: '4', label: 'Trimestralmente' },
    { value: '12', label: 'Mensualmente' },
    { value: '365', label: 'Diariamente' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.principal || parseFloat(formData.principal) <= 0) {
      setError('Por favor, ingresa una cantidad de capital válida');
      return;
    }

    const principal = parseFloat(formData.principal);
    const rate = parseFloat(formData.annualRate);
    const years = parseInt(formData.years);
    const frequency = parseInt(formData.compoundFrequency);

    const finalAmount = calculateCompoundInterest(principal, rate, years, frequency);
    const interestEarned = finalAmount - principal;

    setResult({
      principal,
      rate,
      years,
      frequency,
      finalAmount,
      interestEarned,
      growthPercentage: ((interestEarned / principal) * 100).toFixed(2)
    });
  };

  const handleReset = () => {
    setFormData({
      principal: '',
      annualRate: '5',
      years: '10',
      compoundFrequency: '12'
    });
    setResult(null);
    setError('');
  };

  return (
    <div className="calculator-content">
      <div className="calculator-layout">
        <div className="form-section">
          <h2>Analizador de Inversiones</h2>
          <p className="section-description">Calcula la capitalización de intereses y el crecimiento de inversiones</p>
          
          <form onSubmit={handleSubmit} className="calculator-form">
            <div className="form-group">
              <label htmlFor="principal">Inversión Inicial (£) *</label>
              <input
                id="principal"
                type="number"
                name="principal"
                placeholder="p.ej., 10000"
                value={formData.principal}
                onChange={handleChange}
                className={`form-input ${error ? 'error' : ''}`}
              />
              {error && <span className="error-message">{error}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="annualRate">Tasa de Interés Anual (%) *</label>
                <input
                  id="annualRate"
                  type="number"
                  name="annualRate"
                  placeholder="p.ej., 5"
                  step="0.1"
                  value={formData.annualRate}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="years">Período de Inversión (Años) *</label>
                <input
                  id="years"
                  type="number"
                  name="years"
                  placeholder="p.ej., 10"
                  value={formData.years}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="compoundFrequency">Frecuencia de Capitalización *</label>
              <select
                id="compoundFrequency"
                name="compoundFrequency"
                value={formData.compoundFrequency}
                onChange={handleChange}
                className="form-input"
              >
                {compoundOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">Calcular Crecimiento</button>
              <button type="button" className="btn-secondary" onClick={handleReset}>Restablecer</button>
            </div>
          </form>
        </div>

        {result && (
          <div className="results-section">
            <h2>Crecimiento de Inversión</h2>
            <div className="results-card">
              <div className="result-item">
                <span className="result-label">Inversión Inicial</span>
                <span className="result-value">£{result.principal.toLocaleString()}</span>
              </div>

              <div className="result-item">
                <span className="result-label">Tasa de Interés</span>
                <span className="result-value">{result.rate}% por año</span>
              </div>

              <div className="result-item">
                <span className="result-label">Período de Tiempo</span>
                <span className="result-value">{result.years} años</span>
              </div>

              <div className="divider"></div>

              <div className="result-item">
                <span className="result-label">Intereses Ganados</span>
                <span className="result-value highlight">£{result.interestEarned.toLocaleString()}</span>
              </div>

              <div className="result-item">
                <span className="result-label">Cantidad Final</span>
                <span className="result-value highlight">£{result.finalAmount.toLocaleString()}</span>
              </div>

              <div className="result-item">
                <span className="result-label">Crecimiento Total</span>
                <span className="result-value">{result.growthPercentage}%</span>
              </div>

              <div className="info-box">
                <p>💡 <strong>Consejo:</strong> ¡Cuanto más frecuents sea la capitalización, más ganarás!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentAnalyzer;
