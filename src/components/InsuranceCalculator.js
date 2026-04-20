import React, { useState } from 'react';
import { calculateInsurance } from '../utilities/calculations';
import '../styles/Calculator.css';

/**
 * Componente Calculadora de Seguros - Calculo de costos de seguros
 */
const InsuranceCalculator = () => {
  const [formData, setFormData] = useState({
    propertyValue: '',
    insuranceType: 'standard'
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const insuranceTypes = [
    { value: 'basic', label: 'Basico (0.3% - Presupuesto)', description: 'Cobertura esencial' },
    { value: 'standard', label: 'Estandar (0.5% - Recomendado)', description: 'Cobertura completa' },
    { value: 'premium', label: 'Premium (0.8% - Completo)', description: 'Maxima cobertura' }
  ];

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

    if (!formData.propertyValue || parseInt(formData.propertyValue) <= 0) {
      setError('Por favor, ingresa un valor de propiedad valido');
      return;
    }

    const annualCost = calculateInsurance(
      parseInt(formData.propertyValue),
      formData.insuranceType
    );
    const monthlyCost = annualCost / 12;

    setResult({
      propertyValue: parseInt(formData.propertyValue),
      insuranceType: formData.insuranceType,
      annualCost,
      monthlyCost
    });
  };

  const handleReset = () => {
    setFormData({
      propertyValue: '',
      insuranceType: 'standard'
    });
    setResult(null);
    setError('');
  };

  return (
    <div className="calculator-content">
      <div className="calculator-layout">
        <div className="form-section">
          <h2>Calculadora de Seguros</h2>
          <p className="section-description">
            Calcula el costo anual del seguro de tu propiedad
          </p>

          <form onSubmit={handleSubmit} className="calculator-form">
            <div className="form-group">
              <label htmlFor="propertyValue">Valor de la Propiedad (GBP) *</label>
              <input
                id="propertyValue"
                type="number"
                name="propertyValue"
                placeholder="Ej: 250000"
                value={formData.propertyValue}
                onChange={handleChange}
                className={`form-input ${error ? 'error' : ''}`}
              />
              {error && <span className="error-message">{error}</span>}
            </div>

            <div className="form-group">
              <label>Tipo de Seguro *</label>
              <div className="insurance-options">
                {insuranceTypes.map((type) => (
                  <label key={type.value} className="insurance-option">
                    <input
                      type="radio"
                      name="insuranceType"
                      value={type.value}
                      checked={formData.insuranceType === type.value}
                      onChange={handleChange}
                    />
                    <div className="option-content">
                      <span className="option-label">{type.label}</span>
                      <span className="option-description">{type.description}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Calcular Seguro
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleReset}
              >
                Restablecer
              </button>
            </div>
          </form>
        </div>

        {result && (
          <div className="results-section">
            <h2>Estimacion de Seguro</h2>
            <div className="results-card">
              <div className="result-item">
                <span className="result-label">Valor de la Propiedad</span>
                <span className="result-value">
                  GBP {result.propertyValue.toLocaleString()}
                </span>
              </div>

              <div className="result-item">
                <span className="result-label">Tipo de Seguro</span>
                <span className="result-value">
                  {result.insuranceType.charAt(0).toUpperCase() +
                    result.insuranceType.slice(1)}
                </span>
              </div>

              <div className="divider"></div>

              <div className="result-item">
                <span className="result-label">Costo Anual</span>
                <span className="result-value highlight">
                  GBP {result.annualCost.toLocaleString()}
                </span>
              </div>

              <div className="result-item">
                <span className="result-label">Costo Mensual</span>
                <span className="result-value">
                  GBP {result.monthlyCost.toFixed(2)}
                </span>
              </div>

              <div className="info-box">
                <p>
                  <strong>Consejo:</strong> Anade este valor al pago mensual de
                  hipoteca para obtener el costo total de vivienda.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsuranceCalculator;