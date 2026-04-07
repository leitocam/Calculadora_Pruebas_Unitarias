import React, { useState } from 'react';
import './App.css';
import Tabs from './components/Tabs';
import MortgageCalculator from './components/MortgageCalculator';
import InsuranceCalculator from './components/InsuranceCalculator';
import ComparisonTool from './components/ComparisonTool';
import InvestmentAnalyzer from './components/InvestmentAnalyzer';

/**
 * Componente Principal de la Aplicación
 * Gestiona la navegación por pestañas y muestra diferentes herramientas de cálculo
 */
function App() {
  const [activeTab, setActiveTab] = useState('mortgage');

  // Configuración de pestañas con iconos y descripciones
  const tabs = [
    {
      id: 'mortgage',
      label: 'Hipotecas',
      icon: '📋',
      description: 'Calcula pagos hipotecarios y accesibilidad',
      component: MortgageCalculator
    },
    {
      id: 'insurance',
      label: 'Seguros',
      icon: '🔒',
      description: 'Estima costos de seguros de propiedad',
      component: InsuranceCalculator
    },
    {
      id: 'comparison',
      label: 'Comparativa',
      icon: '📊',
      description: 'Compara múltiples escenarios hipotecarios',
      component: ComparisonTool
    },
    {
      id: 'investment',
      label: 'Inversiones',
      icon: '💼',
      description: 'Analiza el crecimiento de inversiones con interés compuesto',
      component: InvestmentAnalyzer
    }
  ];

  // Get the current tab's component
  const CurrentComponent = tabs.find(tab => tab.id === activeTab)?.component || MortgageCalculator;

  return (
    <div className="app">
      {/* Encabezado */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-icon">💰</div>
          <h1>Portal de Cálculos Financieros</h1>
          <p>Herramientas profesionales para hipotecas, seguros, comparativas e inversiones</p>
        </div>
      </header>

      {/* Contenedor Principal */}
      <div className="app-container">
        <div className="app-main">
          {/* Navegación de Pestañas */}
          <div className="tabs-wrapper">
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Contenido de Pestaña */}
          <div className="content-area">
            <CurrentComponent />
          </div>
        </div>
      </div>

      {/* Pie de Página */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>&copy; 2026 Portal de Cálculos Financieros. Todos los derechos reservados.</p>
          <p>Diseñado para optimizar la planificación hipotecaria y financiera.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
