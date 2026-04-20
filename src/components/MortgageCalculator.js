import React, { useState } from 'react';
import {
  calculateMortgage,
  validateAffordability,
  analyzeMortgageEligibility
} from '../utilities/calculations';
import '../styles/Calculator.css';

const MortgageCalculator = () => {
  const [formData, setFormData] = useState({
    salary: '',
    salary2: '',
    deposit: '',
    commitments: '',
    term: '30',
    interest: '4.5'
  });

  const [adjustableValues, setAdjustableValues] = useState({
    creditScore: '700',
    currentDebt: '0'
  });

  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState({});
  const [showSecondSalary, setShowSecondSalary] = useState(false);
  const [showAdjustmentPanel, setShowAdjustmentPanel] = useState(false);
  const [showRecalculateMessage, setShowRecalculateMessage] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.salary || parseInt(formData.salary) <= 0) {
      newErrors.salary = 'Se requiere un salario valido';
    }

    if (!formData.deposit || parseInt(formData.deposit) <= 0) {
      newErrors.deposit = 'Se requiere un deposito valido';
    }

    if (formData.commitments === '' || parseInt(formData.commitments) < 0) {
      newErrors.commitments = 'Se requiere un compromiso valido';
    }

    if (!formData.term || parseInt(formData.term) <= 0) {
      newErrors.term = 'Se requiere un plazo valido';
    }

    if (!formData.interest || parseFloat(formData.interest) < 0) {
      newErrors.interest = 'Se requiere una tasa valida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAdjustableChange = (e) => {
    const { name, value } = e.target;

    setAdjustableValues((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateResults = (formValues, adjustValues) => {
    const monthlyIncome =
      (parseInt(formValues.salary) + parseInt(formValues.salary2 || 0)) / 12;

    const basicResults = calculateMortgage(formValues);
    const propertyPrice = basicResults.maxHouseValue;

    const affordability = validateAffordability(
      basicResults.monthlyPayment,
      monthlyIncome
    );

    const eligibilityAnalysis = analyzeMortgageEligibility({
      monthlyIncome,
      monthlyCommitments: parseInt(formValues.commitments),
      propertyPrice,
      deposit: parseInt(formValues.deposit),
      currentDebt: parseInt(adjustValues.currentDebt || 0),
      creditScore: parseInt(adjustValues.creditScore),
      loanTerm: parseInt(formValues.term)
    });

    return {
      basicResults,
      affordability,
      eligibilityAnalysis,
      inputs: { ...formValues, propertyPrice, monthlyIncome },
      adjustableValues: adjustValues
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const newResults = calculateResults(formData, adjustableValues);
    setResults(newResults);
  };

  const handleRecalculate = () => {
    if (results) {
      const newResults = calculateResults(formData, adjustableValues);
      setResults(newResults);
      setShowRecalculateMessage(true);

      setTimeout(() => {
        setShowRecalculateMessage(false);
      }, 3000);
    }
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

    setAdjustableValues({
      creditScore: '700',
      currentDebt: '0'
    });

    setResults(null);
    setErrors({});
    setShowSecondSalary(false);
    setShowAdjustmentPanel(false);
    setShowRecalculateMessage(false);
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'LOW':
        return '#2ecc71';
      case 'MODERATE':
        return '#f39c12';
      case 'HIGH':
        return '#e74c3c';
      case 'VERY_HIGH':
        return '#c0392b';
      default:
        return '#3498db';
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'LOW':
        return 'OK';
      case 'MODERATE':
        return 'WARN';
      case 'HIGH':
        return 'HIGH';
      case 'VERY_HIGH':
        return 'STOP';
      default:
        return 'INFO';
    }
  };

  return (
    <div className="calculator-content">
      <div className="calculator-layout">
        <div className="form-section">
          <h2>Calculadora de Hipotecas</h2>

          <form onSubmit={handleSubmit} className="calculator-form">
            <div className="form-note">
              Ingresa los datos basicos. Usamos valores predeterminados
              (Credit Score: 700, Deuda Actual: GBP 0) que puedes ajustar despues.
            </div>

            <div className="form-section-divider">
              <h3>Tus Ingresos</h3>
            </div>

            <div className="form-group">
              <label htmlFor="salary">Salario Anual Primario *</label>
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

            <div className="form-group">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowSecondSalary(!showSecondSalary)}
              >
                {showSecondSalary ? 'Ocultar Segundo Salario' : 'Mostrar Segundo Salario'}
              </button>
            </div>

            {showSecondSalary && (
              <div className="form-group">
                <label htmlFor="salary2">Salario Anual Secundario</label>
                <input
                  id="salary2"
                  type="number"
                  name="salary2"
                  placeholder="Ej: 30000"
                  value={formData.salary2}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            )}

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
              {errors.deposit && <span className="error-message">{errors.deposit}</span>}
            </div>

            <div className="form-section-divider">
              <h3>Compromisos Mensuales</h3>
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

            <div className="form-section-divider">
              <h3>Terminos del Prestamo</h3>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="term">Plazo (Anios) *</label>
                <input
                  id="term"
                  type="number"
                  name="term"
                  placeholder="Ej: 30"
                  value={formData.term}
                  onChange={handleChange}
                  className={`form-input ${errors.term ? 'error' : ''}`}
                />
                {errors.term && <span className="error-message">{errors.term}</span>}
              </div>

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
                  className={`form-input ${errors.interest ? 'error' : ''}`}
                />
                {errors.interest && (
                  <span className="error-message">{errors.interest}</span>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Analizar Hipoteca
              </button>
              <button type="button" className="btn-secondary" onClick={handleReset}>
                Restablecer
              </button>
            </div>
          </form>
        </div>

        {results && (
          <div className="results-section">
            <h2>Resultados del Analisis</h2>

            <div className="adjustment-section">
              <button
                className="adjustment-header"
                onClick={() => setShowAdjustmentPanel(!showAdjustmentPanel)}
              >
                Ajustar Valores
              </button>

              {showAdjustmentPanel && (
                <div className="adjustment-panel">
                  <div className="adjustment-group">
                    <label htmlFor="creditScore">Credit Score (Defecto: 700)</label>
                    <input
                      id="creditScore"
                      type="number"
                      name="creditScore"
                      min="300"
                      max="850"
                      value={adjustableValues.creditScore}
                      onChange={handleAdjustableChange}
                      className="form-input"
                    />
                  </div>

                  <div className="adjustment-group">
                    <label htmlFor="currentDebt">Deuda Actual Mensual (GBP) (Defecto: 0)</label>
                    <input
                      id="currentDebt"
                      type="number"
                      name="currentDebt"
                      min="0"
                      value={adjustableValues.currentDebt}
                      onChange={handleAdjustableChange}
                      className="form-input"
                    />
                  </div>

                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleRecalculate}
                  >
                    Recalcular con Nuevos Valores
                  </button>
                </div>
              )}
            </div>

            {showRecalculateMessage && (
              <div className="recalculate-success-message">
                <span className="success-icon">OK</span>
                <span className="success-text">
                  Resultados recalculados con los nuevos valores
                </span>
              </div>
            )}

            {results.eligibilityAnalysis.eligible ? (
              <div className="eligibility-card eligible">
                <h3>ELEGIBLE PARA HIPOTECA</h3>
              </div>
            ) : (
              <div className="eligibility-card ineligible">
                <h3>NO ELEGIBLE</h3>
                <p className="reason-text">
                  Razon: <strong>{results.eligibilityAnalysis.reason}</strong>
                </p>

                {results.eligibilityAnalysis.details && (
                  <div className="details-text">
                    {results.eligibilityAnalysis.reason === 'INSUFFICIENT_INCOME' &&
                      `Deficit: GBP ${results.eligibilityAnalysis.details.deficit.toLocaleString()}`}
                    {results.eligibilityAnalysis.reason === 'INSUFFICIENT_DEPOSIT' &&
                      `Requerido: GBP ${results.eligibilityAnalysis.details.required.toLocaleString()}, Proporcionado: GBP ${results.eligibilityAnalysis.details.provided.toLocaleString()}`}
                    {results.eligibilityAnalysis.reason === 'EXCESSIVE_CURRENT_DEBT' &&
                      `Ratio: ${results.eligibilityAnalysis.details.currentRatio.toFixed(1)}% (Limite: ${results.eligibilityAnalysis.details.limit}%)`}
                    {results.eligibilityAnalysis.reason === 'NO_AFFORDABLE_SCENARIOS' &&
                      `Ingresos: GBP ${results.eligibilityAnalysis.details.income.toLocaleString()}, Compromisos: GBP ${results.eligibilityAnalysis.details.commitments.toLocaleString()}`}
                  </div>
                )}
              </div>
            )}

            {results.eligibilityAnalysis.eligible && (
              <>
                <div className="results-card">
                  <h3>Perfil del Solicitante</h3>
                  <div className="profile-grid">
                    <div className="profile-item">
                      <span className="label">Credit Score</span>
                      <span className="value">
                        {results.eligibilityAnalysis.applicantProfile.creditScore}
                      </span>
                    </div>
                    <div className="profile-item">
                      <span className="label">Categoria Crediticia</span>
                      <span className="value">
                        {results.eligibilityAnalysis.applicantProfile.creditRisk}
                      </span>
                    </div>
                    <div className="profile-item">
                      <span className="label">Ratio Deuda Ingresos</span>
                      <span className="value">
                        {results.eligibilityAnalysis.applicantProfile.debtToIncomeRatio}%
                      </span>
                    </div>
                    <div className="profile-item">
                      <span className="label">Estrategia de Deposito</span>
                      <span className="value">
                        {results.eligibilityAnalysis.applicantProfile.depositStrategy}
                      </span>
                    </div>
                    <div className="profile-item">
                      <span className="label">Deposito Proporcionado</span>
                      <span className="value">
                        GBP {results.eligibilityAnalysis.applicantProfile.depositAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="profile-item">
                      <span className="label">Porcentaje de Deposito</span>
                      <span className="value">
                        {results.eligibilityAnalysis.applicantProfile.depositRatioPercentage}%
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="risk-card"
                  style={{
                    borderLeftColor: getRiskColor(
                      results.eligibilityAnalysis.riskAssessment.level
                    )
                  }}
                >
                  <h3>Evaluacion de Riesgo</h3>
                  <div className="risk-display">
                    <div className="risk-icon" style={{ fontSize: '36px' }}>
                      {getRiskIcon(results.eligibilityAnalysis.riskAssessment.level)}
                    </div>
                    <div className="risk-info">
                      <div
                        className="risk-level"
                        style={{
                          color: getRiskColor(
                            results.eligibilityAnalysis.riskAssessment.level
                          )
                        }}
                      >
                        {results.eligibilityAnalysis.riskAssessment.level}
                      </div>
                      <div className="risk-score">
                        Score: {results.eligibilityAnalysis.riskAssessment.score}
                      </div>
                      <div className="risk-recommendation">
                        Recomendacion:{' '}
                        {results.eligibilityAnalysis.riskAssessment.recommendation}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="results-card">
                  <h3>Detalles de la Hipoteca</h3>
                  <div className="results-grid">
                    <div className="result-item">
                      <span className="result-label">Cantidad a Prestar</span>
                      <span className="result-value">
                        GBP {results.eligibilityAnalysis.summary.loanAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="result-item">
                      <span className="result-label">Precio de Propiedad</span>
                      <span className="result-value">
                        GBP {results.eligibilityAnalysis.summary.propertyPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="result-item">
                      <span className="result-label">Pago Mensual</span>
                      <span className="result-value highlight">
                        GBP {results.basicResults.monthlyPayment.toLocaleString()}
                      </span>
                    </div>
                    <div className="result-item">
                      <span className="result-label">
                        Total Pagado ({results.inputs.term} anios)
                      </span>
                      <span className="result-value">
                        GBP {results.basicResults.totalPaid.toLocaleString()}
                      </span>
                    </div>
                    <div className="result-item">
                      <span className="result-label">Intereses Totales</span>
                      <span className="result-value">
                        GBP {results.basicResults.totalInterest.toLocaleString()}
                      </span>
                    </div>
                    <div className="result-item">
                      <span className="result-label">Ingresos Disponibles</span>
                      <span className="result-value">
                        GBP {results.eligibilityAnalysis.summary.availableIncome.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="scenarios-card">
                  <h3>Escenarios Viables</h3>
                  <div className="scenarios-grid">
                    {results.eligibilityAnalysis.scenarios.map((scenario, idx) => (
                      <div
                        key={idx}
                        className={`scenario-item ${
                          scenario.interestRate ===
                          results.eligibilityAnalysis.bestScenario.interestRate
                            ? 'recommended'
                            : ''
                        }`}
                      >
                        <div className="scenario-rate">Tasa: {scenario.interestRate}%</div>
                        <div className="scenario-payment">
                          Pago: GBP {scenario.monthlyPayment.toLocaleString()}
                        </div>
                        <div className="scenario-affordability">
                          Affordability: {scenario.affordabilityRatio}%
                        </div>
                        <div className="scenario-total">
                          Total Mensual: GBP {scenario.totalMonthlyCommitment.toLocaleString()}
                        </div>
                        {scenario.interestRate ===
                          results.eligibilityAnalysis.bestScenario.interestRate && (
                          <div className="best-badge">RECOMENDADO</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="recommendation-box">
                  <h3>Recomendacion Final</h3>
                  <p>{results.eligibilityAnalysis.summary.recommendation}</p>
                </div>

                <div
                  className={`affordability-check ${
                    results.affordability.isAffordable ? 'affordable' : 'unaffordable'
                  }`}
                >
                  <span className="affordability-ratio">
                    Relacion Deuda Ingresos: {results.affordability.ratio}%
                  </span>
                  <span className="affordability-message">
                    {results.affordability.message}
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MortgageCalculator;