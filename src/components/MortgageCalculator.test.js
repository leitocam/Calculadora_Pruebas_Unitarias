import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MortgageCalculator from './MortgageCalculator';

describe('MortgageCalculator', () => {
  it('renders the main calculator form', () => {
    render(<MortgageCalculator />);

    expect(screen.getByRole('heading', { name: /Calculadora de Hipotecas/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Salario Anual Primario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Depósito Inicial/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Compromisos Mensuales/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Analizar Hipoteca/i })).toBeInTheDocument();
  });

  it('shows validation errors when required fields are missing', async () => {
    render(<MortgageCalculator />);

    await userEvent.click(screen.getByRole('button', { name: /Analizar Hipoteca/i }));

    expect(screen.getByText(/Se requiere un salario válido/i)).toBeInTheDocument();
    expect(screen.getByText(/Se requiere un depósito válido/i)).toBeInTheDocument();
    expect(screen.getByText(/Se requiere un compromiso válido/i)).toBeInTheDocument();
  });

  it('submits valid data and displays analysis results', async () => {
    render(<MortgageCalculator />);

    await userEvent.type(screen.getByLabelText(/Salario Anual Primario/i), '60000');
    await userEvent.type(screen.getByLabelText(/Depósito Inicial/i), '50000');
    await userEvent.type(screen.getByLabelText(/Compromisos Mensuales/i), '500');

    await userEvent.click(screen.getByRole('button', { name: /Analizar Hipoteca/i }));

    expect(await screen.findByRole('heading', { name: /Resultados del Análisis/i })).toBeInTheDocument();
    expect(screen.getByText(/ELEGIBLE PARA HIPOTECA/i)).toBeInTheDocument();
    expect(screen.getByText(/Relación Deuda-Ingresos/i)).toBeInTheDocument();
  });

  it('allows recalculating from adjustment panel and shows confirmation message', async () => {
    render(<MortgageCalculator />);

    await userEvent.type(screen.getByLabelText(/Salario Anual Primario/i), '60000');
    await userEvent.type(screen.getByLabelText(/Depósito Inicial/i), '50000');
    await userEvent.type(screen.getByLabelText(/Compromisos Mensuales/i), '500');
    await userEvent.click(screen.getByRole('button', { name: /Analizar Hipoteca/i }));

    await screen.findByRole('heading', { name: /Resultados del Análisis/i });

    await userEvent.click(screen.getByRole('button', { name: /Ajustar Valores/i }));
    await userEvent.clear(screen.getByLabelText(/Credit Score/i));
    await userEvent.type(screen.getByLabelText(/Credit Score/i), '750');
    await userEvent.click(screen.getByRole('button', { name: /Recalcular con Nuevos Valores/i }));

    expect(await screen.findByText(/Resultados recalculados con los nuevos valores/i)).toBeInTheDocument();
  });
});
