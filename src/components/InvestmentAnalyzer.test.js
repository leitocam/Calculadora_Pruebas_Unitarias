import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import InvestmentAnalyzer from './InvestmentAnalyzer';

describe('InvestmentAnalyzer', () => {
  it('shows validation when initial amount is missing', async () => {
    render(<InvestmentAnalyzer />);

    fireEvent.click(
      screen.getByRole('button', { name: /calcular inversion/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText(/por favor, ingresa un monto inicial valido/i)
      ).toBeInTheDocument();
    });
  });

  it('calculates and renders investment results', async () => {
    render(<InvestmentAnalyzer />);

    fireEvent.change(screen.getByLabelText(/monto inicial/i), {
      target: { value: '10000' },
    });

    fireEvent.change(screen.getByLabelText(/tasa anual/i), {
      target: { value: '7' },
    });

    fireEvent.change(screen.getByLabelText(/periodo \(anios\)/i), {
      target: { value: '10' },
    });

    fireEvent.change(screen.getByLabelText(/frecuencia de capitalizacion/i), {
      target: { value: '12' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: /calcular inversion/i })
    );

    const resultsHeading = await screen.findByRole('heading', {
      name: /resultados de la inversion/i,
    });

    expect(resultsHeading).toBeInTheDocument();

    const resultsSection = resultsHeading.closest('.results-section');
    expect(resultsSection).not.toBeNull();

    expect(
      within(resultsSection).getByText(/monto final/i)
    ).toBeInTheDocument();

    expect(
      within(resultsSection).getByText(/ganancia total/i)
    ).toBeInTheDocument();

    expect(
      within(resultsSection).getByText(/crecimiento/i)
    ).toBeInTheDocument();

    expect(
      within(resultsSection).getByText(/GBP 10,000/i)
    ).toBeInTheDocument();
  });

  it('resets form and clears rendered result', async () => {
    render(<InvestmentAnalyzer />);

    fireEvent.change(screen.getByLabelText(/monto inicial/i), {
      target: { value: '10000' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: /calcular inversion/i })
    );

    expect(
      await screen.findByRole('heading', { name: /resultados de la inversion/i })
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: /restablecer/i })
    );

    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { name: /resultados de la inversion/i })
      ).not.toBeInTheDocument();
    });

    expect(screen.getByLabelText(/monto inicial/i)).toHaveValue(null);
  });
});