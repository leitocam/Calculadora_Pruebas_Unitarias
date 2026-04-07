import React, { useState } from 'react';
import { calculateMortgage, calculateInsurance } from '../utilities/calculations';
import '../styles/Calculator.css';

/**
 * Componente Herramienta de Comparaci\u00f3n - Compara m\u00faltiples escenarios hipotecarios
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
    if (!formData.name.trim()) newErrors.name = 'Se requiere un nombre de escenario';
    if (!formData.salary || parseInt(formData.salary) <= 0) newErrors.salary = 'Se requiere un salario v\u00e1lido';
    if (!formData.deposit || parseInt(formData.deposit) <= 0) newErrors.deposit = 'Se requiere un dep\u00f3sito v\u00e1lido';
    if (!formData.commitments || parseInt(formData.commitments) < 0) newErrors.commitments = 'Se requiere un compromiso v\u00e1lido';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({
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
      totalMonthlyWithInsurance: mortgageResults.monthlyPayment + (insuranceCost / 12)
    };

    setScenarios([...scenarios, newScenario]);
    
    // Restablecer formulario
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
    setScenarios(scenarios.filter(s => s.id !== id));
  };

  const getBestValue = (field) => {
    if (scenarios.length === 0) return null;
    if (field === 'monthlyPayment') {
      return Math.min(...scenarios.map(s => s.monthlyPayment));
    }
    if (field === 'maxHouseValue') {
      return Math.max(...scenarios.map(s => s.maxHouseValue));
    }
    return null;
  };

  return (
    <div className="calculator-content">
      <div className="comparison-layout">
        <div className="form-section">
          <h2>Generador de Escenarios</h2>
          <p className="section-description">Crea y compara m\u00faltiples escenarios hipotecarios</p>
          
          <form onSubmit={handleAddScenario} className="calculator-form">
            <div className="form-group">
              <label htmlFor="name">Nombre del Escenario *</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="p.ej., Conservador / Agresivo"
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
                placeholder="p.ej., 50000"
                value={formData.salary}
                onChange={handleChange}
                className={`form-input ${errors.salary ? 'error' : ''}`}
              />
              {errors.salary && <span className="error-message">{errors.salary}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="deposit">Depósito Inicial *</label>
                <input
                  id="deposit"
                  type="number"
                  name="deposit"
                  placeholder="p.ej., 50000"
                  value={formData.deposit}
                  onChange={handleChange}
                  className={`form-input ${errors.deposit ? 'error' : ''}`}
                />
              </div>

              <div className="form-group">
                <label htmlFor="term">Plazo del Préstamo (Años) *</label>
                <input
                  id="term"
                  type="number"
                  name="term"
                  placeholder="p.ej., 30"
                  value={formData.term}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="interest">Tasa de Interés (%) *</label>
                <input
                  id="interest"
                  type="number"
                  name="interest"
                  placeholder="p.ej., 4.5"
                  step="0.1"
                  value={formData.interest}
                  onChange={handleChange}
                  className="form-input"
                />
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
                Incluir Seguro en el C\u00e1lculo
              </label>
            </div>

            <button type="submit" className="btn-primary">+ A\u00f1adir Escenario</button>
          </form>
        </div>

        <div className="comparison-section">
          <h2>Comparar Escenarios ({scenarios.length})</h2>
          
          {scenarios.length === 0 ? (
            <div className="empty-state">
              <p>📊 Aún no hay escenarios. ¡Añade uno para comenzar a comparar!</p>
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
                      \u2717
                    </button>
                  </div>

                  <div className="scenario-details">
                    <div className="detail-row">
                      <span className="detail-label">Valor M\u00e1x Casa</span>
                      <span className={`detail-value ${scenario.maxHouseValue === getBestValue('maxHouseValue') ? 'best' : ''}`}>
                        £{scenario.maxHouseValue.toLocaleString()}
                      </span>
                    </div>

                    <div className="detail-row">
                      <span className="detail-label">Pago Mensual</span>
                      <span className={`detail-value ${scenario.monthlyPayment === getBestValue('monthlyPayment') ? 'best' : ''}`}>
                        £{scenario.monthlyPayment.toLocaleString()}
                      </span>
                    </div>

                    {scenario.includeInsurance && (
                      <>
                        <div className="detail-row">
                          <span className="detail-label">Seguro</span>
                          <span className="detail-value">£{(scenario.insuranceCost / 12).toFixed(2)}/mes</span>
                        </div>

                        <div className="detail-row total">
                          <span className="detail-label">Total Mensual</span>
                          <span className="detail-value">£{scenario.totalMonthlyWithInsurance.toLocaleString()}</span>
                        </div>
                      </>
                    )}

                    <div className="detail-row">
                      <span className="detail-label">Intereses Totales</span>
                      <span className="detail-value">£{scenario.totalInterest.toLocaleString()}</span>
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
