import React, { useState } from 'react';
import { calculateCompoundInterest } from '../utilities/calculations';
import '../styles/Calculator.css';

const InvestmentAnalyzer = () => {
  const [formData, setFormData] = useState({
    principal: '',
    annualRate: '7',
    years: '10',
    compoundFrequency: '12'
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.principal || parseFloat(formData.principal) <= 0) {
      setError('Por favor, ingresa un monto inicial valido');
      return;
    }

    if (!formData.years || parseInt(formData.years) <= 0) {
      setError('Por favor, ingresa un numero de anios valido');
      return;
    }

    const finalAmount = calculateCompoundInterest(
      parseFloat(formData.principal),
      parseFloat(formData.annualRate),
      parseInt(formData.years),
      parseInt(formData.compoundFrequency)
    );

    const totalGrowth = finalAmount - parseFloat(formData.principal);
    const growthPercentage = (totalGrowth / parseFloat(formData.principal)) * 100;

    setResult({
      principal: parseFloat(formData.principal),
      annualRate: parseFloat(formData.annualRate),
      years: parseInt(formData.years),
      compoundFrequency: parseInt(formData.compoundFrequency),
      finalAmount,
      totalGrowth,
      growthPercentage
    });
  };

  const handleReset = () => {
    setFormData({
      principal: '',
      annualRate: '7',
      years: '10',
      compoundFrequency: '12'
    });
    setResult(null);
    setError('');
  };

  const getFrequencyLabel = (frequency) => {
    switch (frequency) {
      case 1:
        return 'Anual';
      case 2:
        return 'Semestral';
      case 4:
        return 'Trimestral';
      case 12:
        return 'Mensual';
      case 365:
        return 'Diario';
      default:
        return `${frequency} veces por anio`;
    }
  };

  return (
    <div className="calculator-content">
      <div className="calculator-layout">
        <div className="form-section">
          <h2>Analizador de Inversion</h2>
          <p className="section-description">
            Calcula el crecimiento de tu inversion con interes compuesto
          </p>

          <form onSubmit={handleSubmit} className="calculator-form">
            <div className="form-group">
              <label htmlFor="principal">Monto Inicial (GBP) *</label>
              <input
                id="principal"
                type="number"
                name="principal"
                placeholder="Ej: 10000"
                value={formData.principal}
                onChange={handleChange}
                className={`form-input ${error ? 'error' : ''}`}
              />
              {error && <span className="error-message">{error}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="annualRate">Tasa Anual (%) *</label>
                <input
                  id="annualRate"
                  type="number"
                  name="annualRate"
                  placeholder="Ej: 7"
                  step="0.1"
                  value={formData.annualRate}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="years">Periodo (Anios) *</label>
                <input
                  id="years"
                  type="number"
                  name="years"
                  placeholder="Ej: 10"
                  value={formData.years}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="compoundFrequency">Frecuencia de Capitalizacion *</label>
              <select
                id="compoundFrequency"
                name="compoundFrequency"
                value={formData.compoundFrequency}
                onChange={handleChange}
                className="form-input"
              >
                <option value="1">Anual</option>
                <option value="2">Semestral</option>
                <option value="4">Trimestral</option>
                <option value="12">Mensual</option>
                <option value="365">Diario</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Calcular Inversion
              </button>
              <button type="button" className="btn-secondary" onClick={handleReset}>
                Restablecer
              </button>
            </div>
          </form>
        </div>

        {result && (
          <div className="results-section">
            <h2>Resultados de la Inversion</h2>
            <div className="results-card">
              <div className="result-item">
                <span className="result-label">Monto Inicial</span>
                <span className="result-value">GBP {result.principal.toLocaleString()}</span>
              </div>

              <div className="result-item">
                <span className="result-label">Tasa Anual</span>
                <span className="result-value">{result.annualRate}%</span>
              </div>

              <div className="result-item">
                <span className="result-label">Periodo</span>
                <span className="result-value">{result.years} anios</span>
              </div>

              <div className="result-item">
                <span className="result-label">Frecuencia</span>
                <span className="result-value">
                  {getFrequencyLabel(result.compoundFrequency)}
                </span>
              </div>

              <div className="divider"></div>

              <div className="result-item">
                <span className="result-label">Monto Final</span>
                <span className="result-value highlight">
                  GBP {result.finalAmount.toLocaleString()}
                </span>
              </div>

              <div className="result-item">
                <span className="result-label">Ganancia Total</span>
                <span className="result-value">
                  GBP {result.totalGrowth.toLocaleString()}
                </span>
              </div>

              <div className="result-item">
                <span className="result-label">Crecimiento</span>
                <span className="result-value">
                  {result.growthPercentage.toFixed(1)}%
                </span>
              </div>

              <div className="info-box">
                <p>
                  <strong>Consejo:</strong> Mientras mayor sea el tiempo y la frecuencia de
                  capitalizacion, mayor sera el efecto del interes compuesto.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentAnalyzer;