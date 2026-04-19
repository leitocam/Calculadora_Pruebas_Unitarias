import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComparisonTool from './ComparisonTool';
import InsuranceCalculator from './InsuranceCalculator';
import InvestmentAnalyzer from './InvestmentAnalyzer';
import MortgageCalculator from './MortgageCalculator';

describe('ComparisonTool component', () => {
  it('muestra estado vacío y permite agregar un escenario', async () => {
    render(<ComparisonTool />);

    expect(screen.getByText(/Aún no hay escenarios/i)).toBeInTheDocument();

    userEvent.type(screen.getByLabelText(/Nombre del Escenario/i), 'Escenario Test');
    userEvent.type(screen.getByLabelText(/Salario Primario/i), '50000');
    userEvent.type(screen.getByLabelText(/Depósito Inicial/i), '50000');
    userEvent.type(screen.getByLabelText(/Plazo del Préstamo/i), '30');
    userEvent.type(screen.getByLabelText(/Tasa de Interés/i), '4.5');

    fireEvent.click(screen.getByRole('button', { name: /\+ Añadir Escenario/i }));

    expect(await screen.findByText(/Escenario Test/i)).toBeInTheDocument();
    expect(screen.getByText(/Pago Mensual/i)).toBeInTheDocument();
    expect(screen.getByText(/Seguro/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Eliminar escenario/i }));
    expect(await screen.findByText(/Aún no hay escenarios/i)).toBeInTheDocument();
  });

  it('muestra error si falta nombre o datos requeridos', () => {
    render(<ComparisonTool />);

    fireEvent.click(screen.getByRole('button', { name: /\+ Añadir Escenario/i }));

    expect(screen.getByText(/Se requiere un nombre de escenario/i)).toBeInTheDocument();
  });
});

describe('InsuranceCalculator component', () => {
  it('muestra error cuando el valor de la propiedad es inválido', () => {
    render(<InsuranceCalculator />);

    fireEvent.click(screen.getByRole('button', { name: /Calcular Seguro/i }));
    expect(screen.getByText(/Por favor, ingresa un valor de propiedad válido/i)).toBeInTheDocument();
  });

  it('calcula y muestra el resultado para un seguro premium', async () => {
    render(<InsuranceCalculator />);

    userEvent.type(screen.getByLabelText(/Valor de la Propiedad/i), '100000');
    fireEvent.click(screen.getByLabelText(/Premium/i));
    fireEvent.click(screen.getByRole('button', { name: /Calcular Seguro/i }));

    expect(await screen.findByRole('heading', { name: /Estimaci.n de Seguro/i })).toBeInTheDocument();
    expect(screen.getByText(/£800.00/)).toBeInTheDocument();
    expect(screen.getByText(/£66.67/)).toBeInTheDocument();
  });

  it('restablece el formulario y borra el resultado', async () => {
    render(<InsuranceCalculator />);

    userEvent.type(screen.getByLabelText(/Valor de la Propiedad/i), '100000');
    fireEvent.click(screen.getByRole('button', { name: /Calcular Seguro/i }));

    expect(await screen.findByText(/Estimaci.n de Seguro/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Restablecer/i }));
    await waitFor(() => {
      expect(screen.queryByText(/Estimaci.n de Seguro/i)).not.toBeInTheDocument();
    });
  });
});

describe('InvestmentAnalyzer component', () => {
  it('muestra error cuando el capital es inválido', () => {
    render(<InvestmentAnalyzer />);

    fireEvent.click(screen.getByRole('button', { name: /Calcular Crecimiento/i }));
    expect(screen.getByText(/Por favor, ingresa una cantidad de capital válida/i)).toBeInTheDocument();
  });

  it('calcula el crecimiento y muestra el resultado', async () => {
    render(<InvestmentAnalyzer />);

    userEvent.type(screen.getByLabelText(/Inversión Inicial/i), '10000');
    userEvent.clear(screen.getByLabelText(/Tasa de Interés Anual/i));
    userEvent.type(screen.getByLabelText(/Tasa de Interés Anual/i), '5');
    userEvent.clear(screen.getByLabelText(/Período de Inversión/i));
    userEvent.type(screen.getByLabelText(/Período de Inversión/i), '2');
    fireEvent.click(screen.getByRole('button', { name: /Calcular Crecimiento/i }));

    expect(await screen.findByText(/Crecimiento de Inversión/i)).toBeInTheDocument();
    expect(screen.getByText(/Intereses Ganados/i)).toBeInTheDocument();
    expect(screen.getByText(/Cantidad Final/i)).toBeInTheDocument();
  });
});

describe('MortgageCalculator component', () => {
  it('muestra errores de validación cuando los campos requeridos faltan', async () => {
    render(<MortgageCalculator />);

    fireEvent.click(screen.getByRole('button', { name: /Analizar Hipoteca/i }));

    expect(await screen.findByText(/Se requiere un salario válido/i)).toBeInTheDocument();
    expect(screen.getByText(/Se requiere un depósito válido/i)).toBeInTheDocument();
  });

  it('agrega el segundo salario al formulario cuando se pulsa el botón', () => {
    render(<MortgageCalculator />);

    fireEvent.click(screen.getByRole('button', { name: /Segundo Salario/i }));
    expect(screen.getByLabelText(/Salario Anual Secundario/i)).toBeInTheDocument();
  });

  it('procesa la hipoteca y muestra resultados cuando el formulario es correcto', async () => {
    render(<MortgageCalculator />);

    userEvent.type(screen.getByLabelText(/Salario Anual Primario/i), '60000');
    userEvent.type(screen.getByLabelText(/Depósito Inicial/i), '50000');
    userEvent.type(screen.getByLabelText(/Compromisos Mensuales/i), '500');
    userEvent.type(screen.getByLabelText(/Plazo \(Años\)/i), '30');
    userEvent.type(screen.getByLabelText(/Tasa de Interés/i), '4.5');

    fireEvent.click(screen.getByRole('button', { name: /Analizar Hipoteca/i }));

    expect(await screen.findByText(/Resultados del Análisis/i)).toBeInTheDocument();
    expect(screen.getByText(/✅ ¡ELEGIBLE PARA HIPOTECA!/i)).toBeInTheDocument();
    expect(screen.getByText(/Relación Deuda-Ingresos:/i)).toBeInTheDocument();
  });
});
