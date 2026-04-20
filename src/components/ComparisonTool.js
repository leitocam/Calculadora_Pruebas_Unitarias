import React, { useState } from 'react';
import { calculateMortgage, calculateInsurance } from '../utilities/calculations';
import '../styles/Calculator.css';

/**
 * Componente Herramienta de Comparacion - Compara multiples escenarios hipotecarios
 */
const ComparisonTool = () => {
  const [scenarios, setScenarios] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    salary: '',
    salary2: '',
    deposit: '',
    commitments: '',
    term: '30',
    interest: '4.5',
    includeInsurance: true,
    insuranceType: 'standard'
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Se requiere un nombre de escenario';
    }

    if (!formData.salary || parseInt(formData.salary) <= 0) {
      newErrors.salary = 'Se requiere un salario valido';
    }

    if (!formData.deposit || parseInt(formData.deposit) <= 0) {
      newErrors.deposit = 'Se requiere un deposito valido';
    }

    if (formData.commitments === '' || parseInt(formData.commitments) < 0) {
      newErrors.commitments = 'Se requiere un compromiso valido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddScenario = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const mortgageResults = calculateMortgage(formData);
    const insuranceCost = formData.includeInsurance
      ? calculateInsurance(mortgageResults.maxHouseValue, formData.insuranceType)
      : 0;

    const newScenario = {
      id: Date.now(),
      ...formData,
      ...mortgageResults,
      insuranceCost,
      totalMonthlyWithInsurance:
        mortgageResults.monthlyPayment + insuranceCost / 12
    };

    setScenarios([...scenarios, newScenario]);

    setFormData({
      name: '',
      salary: '',
      salary2: '',
      deposit: '',
      commitments: '',
      term: '30',
      interest: '4.5',
      includeInsurance: true,
      insuranceType: 'standard'
    });
  };

  const handleRemoveScenario = (id) => {
    setScenarios(scenarios.filter((s) => s.id !== id));
  };

  const getBestValue = (field) => {
    if (scenarios.length === 0) return null;

    if (field === 'monthlyPayment') {
      return Math.min(...scenarios.map((s) => s.monthlyPayment));
    }

    if (field === 'maxHouseValue') {
      return Math.max(...scenarios.map((s) => s.maxHouseValue));
    }

    return null;
  };

  return (
    <div className="calculator-content">
      <div className="comparison-layout">
        <div className="form-section">
          <h2>Generador de Escenarios</h2>
          <p className="section-description">
            Crea y compara multiples escenarios hipotecarios
          </p>

          <form onSubmit={handleAddScenario} className="calculator-form">
            <div className="form-group">
              <label htmlFor="name">Nombre del Escenario *</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Ej: Conservador o Agresivo"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="salary">Salario Primario *</label>
              <input
                id="salary"
                type="number"
                name="salary"
                placeholder="Ej: 50000"
                value={formData.salary}
                onChange={handleChange}
                className={`form-input ${errors.salary ? 'error' : ''}`}
              />
              {errors.salary && <span className="error-message">{errors.salary}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="deposit">Deposito Inicial *</label>
                <input
                  id="deposit"
                  type="number"
                  name="deposit"
                  placeholder="Ej: 50000"
                  value={formData.deposit}
                  onChange={handleChange}
                  className={`form-input ${errors.deposit ? 'error' : ''}`}
                />
                {errors.deposit && (
                  <span className="error-message">{errors.deposit}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="term">Plazo del Prestamo (Anios) *</label>
                <input
                  id="term"
                  type="number"
                  name="term"
                  placeholder="Ej: 30"
                  value={formData.term}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="interest">Tasa de Interes (%) *</label>
                <input
                  id="interest"
                  type="number"
                  name="interest"
                  placeholder="Ej: 4.5"
                  step="0.1"
                  value={formData.interest}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="commitments">Compromisos Mensuales (GBP) *</label>
                <input
                  id="commitments"
                  type="number"
                  name="commitments"
                  placeholder="Ej: 500"
                  value={formData.commitments}
                  onChange={handleChange}
                  className={`form-input ${errors.commitments ? 'error' : ''}`}
                />
                {errors.commitments && (
                  <span className="error-message">{errors.commitments}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="includeInsurance"
                  checked={formData.includeInsurance}
                  onChange={handleChange}
                />
                Incluir Seguro en el Calculo
              </label>
            </div>

            <button type="submit" className="btn-primary">
              Anadir Escenario
            </button>
          </form>
        </div>

        <div className="comparison-section">
          <h2>Comparar Escenarios ({scenarios.length})</h2>

          {scenarios.length === 0 ? (
            <div className="empty-state">
              <p>Aun no hay escenarios. Anade uno para comenzar a comparar.</p>
            </div>
          ) : (
            <div className="scenarios-grid">
              {scenarios.map((scenario) => (
                <div key={scenario.id} className="scenario-card">
                  <div className="scenario-header">
                    <h3>{scenario.name}</h3>
                    <button
                      className="btn-remove"
                      onClick={() => handleRemoveScenario(scenario.id)}
                      title="Eliminar escenario"
                    >
                      X
                    </button>
                  </div>

                  <div className="scenario-details">
                    <div className="detail-row">
                      <span className="detail-label">Valor Max Casa</span>
                      <span
                        className={`detail-value ${
                          scenario.maxHouseValue === getBestValue('maxHouseValue')
                            ? 'best'
                            : ''
                        }`}
                      >
                        GBP {scenario.maxHouseValue.toLocaleString()}
                      </span>
                    </div>

                    <div className="detail-row">
                      <span className="detail-label">Pago Mensual</span>
                      <span
                        className={`detail-value ${
                          scenario.monthlyPayment === getBestValue('monthlyPayment')
                            ? 'best'
                            : ''
                        }`}
                      >
                        GBP {scenario.monthlyPayment.toLocaleString()}
                      </span>
                    </div>

                    {scenario.includeInsurance && (
                      <>
                        <div className="detail-row">
                          <span className="detail-label">Seguro</span>
                          <span className="detail-value">
                            GBP {(scenario.insuranceCost / 12).toFixed(2)}/mes
                          </span>
                        </div>

                        <div className="detail-row total">
                          <span className="detail-label">Total Mensual</span>
                          <span className="detail-value">
                            GBP {scenario.totalMonthlyWithInsurance.toLocaleString()}
                          </span>
                        </div>
                      </>
                    )}

                    <div className="detail-row">
                      <span className="detail-label">Intereses Totales</span>
                      <span className="detail-value">
                        GBP {scenario.totalInterest.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparisonTool;