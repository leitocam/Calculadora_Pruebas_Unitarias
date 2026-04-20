import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MortgageCalculator from './MortgageCalculator';

describe('MortgageCalculator', () => {
  it('renders the main calculator form', () => {
    render(<MortgageCalculator />);

    expect(
      screen.getByRole('heading', { name: /calculadora de hipotecas/i })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/salario anual primario/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/deposito inicial/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/compromisos mensuales/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /analizar hipoteca/i })
    ).toBeInTheDocument();
  });

  it('shows validation errors when required fields are missing', async () => {
    render(<MortgageCalculator />);

    fireEvent.click(
      screen.getByRole('button', { name: /analizar hipoteca/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText(/se requiere un salario valido/i)
      ).toBeInTheDocument();

      expect(
        screen.getByText(/se requiere un deposito valido/i)
      ).toBeInTheDocument();

      expect(
        screen.getByText(/se requiere un compromiso valido/i)
      ).toBeInTheDocument();
    });
  });

  it('submits valid data and displays analysis results', async () => {
    render(<MortgageCalculator />);

    fireEvent.change(screen.getByLabelText(/salario anual primario/i), {
      target: { value: '60000' },
    });

    fireEvent.change(screen.getByLabelText(/deposito inicial/i), {
      target: { value: '50000' },
    });

    fireEvent.change(screen.getByLabelText(/compromisos mensuales/i), {
      target: { value: '500' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: /analizar hipoteca/i })
    );

    expect(
      await screen.findByRole('heading', { name: /resultados del analisis/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/elegible para hipoteca/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/relacion deuda ingresos/i)
    ).toBeInTheDocument();
  });

  it('allows recalculating from adjustment panel and shows confirmation message', async () => {
    render(<MortgageCalculator />);

    fireEvent.change(screen.getByLabelText(/salario anual primario/i), {
      target: { value: '60000' },
    });

    fireEvent.change(screen.getByLabelText(/deposito inicial/i), {
      target: { value: '50000' },
    });

    fireEvent.change(screen.getByLabelText(/compromisos mensuales/i), {
      target: { value: '500' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: /analizar hipoteca/i })
    );

    await screen.findByRole('heading', { name: /resultados del analisis/i });

    fireEvent.click(
      screen.getByRole('button', { name: /ajustar valores/i })
    );

    fireEvent.change(screen.getByLabelText(/credit score/i), {
      target: { value: '750' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: /recalcular con nuevos valores/i })
    );

    expect(
      await screen.findByText(/resultados recalculados con los nuevos valores/i)
    ).toBeInTheDocument();
  });
});