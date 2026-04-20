import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InvestmentAnalyzer from './InvestmentAnalyzer';

describe('InvestmentAnalyzer', () => {
  it('shows validation error when initial investment is invalid', async () => {
    render(<InvestmentAnalyzer />);

    await userEvent.click(screen.getByRole('button', { name: /Calcular Crecimiento/i }));

    expect(screen.getByText(/Por favor, ingresa una cantidad de capital válida/i)).toBeInTheDocument();
  });

  it('renders growth analysis results for valid inputs', async () => {
    render(<InvestmentAnalyzer />);

    await userEvent.type(screen.getByLabelText(/Inversión Inicial/i), '10000');
    await userEvent.clear(screen.getByLabelText(/Tasa de Interés Anual/i));
    await userEvent.type(screen.getByLabelText(/Tasa de Interés Anual/i), '5');
    await userEvent.clear(screen.getByLabelText(/Período de Inversión/i));
    await userEvent.type(screen.getByLabelText(/Período de Inversión/i), '2');
    await userEvent.selectOptions(screen.getByLabelText(/Frecuencia de Capitalización/i), '12');

    await userEvent.click(screen.getByRole('button', { name: /Calcular Crecimiento/i }));

    expect(await screen.findByRole('heading', { name: /Crecimiento de Inversión/i })).toBeInTheDocument();
    expect(screen.getByText(/Intereses Ganados/i)).toBeInTheDocument();
    expect(screen.getByText(/Cantidad Final/i)).toBeInTheDocument();
  });
});
