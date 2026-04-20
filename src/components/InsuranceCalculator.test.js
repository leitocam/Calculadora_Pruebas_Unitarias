import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InsuranceCalculator from './InsuranceCalculator';

describe('InsuranceCalculator', () => {
  it('shows validation when property value is missing', async () => {
    render(<InsuranceCalculator />);

    fireEvent.click(
      screen.getByRole('button', { name: /calcular seguro/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText(/por favor, ingresa un valor de propiedad valido/i)
      ).toBeInTheDocument();
    });
  });

  it('calculates and renders insurance result for premium plan', async () => {
    render(<InsuranceCalculator />);

    fireEvent.change(screen.getByLabelText(/valor de la propiedad/i), {
      target: { value: '100000' },
    });

    fireEvent.click(screen.getByDisplayValue('premium'));

    fireEvent.click(
      screen.getByRole('button', { name: /calcular seguro/i })
    );

    expect(
      await screen.findByRole('heading', { name: /estimacion de seguro/i })
    ).toBeInTheDocument();

    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.getByText('GBP 800')).toBeInTheDocument();
    expect(screen.getByText('GBP 66.67')).toBeInTheDocument();
  });

  it('resets form and clears rendered result', async () => {
    render(<InsuranceCalculator />);

    fireEvent.change(screen.getByLabelText(/valor de la propiedad/i), {
      target: { value: '100000' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: /calcular seguro/i })
    );

    expect(
      await screen.findByRole('heading', { name: /estimacion de seguro/i })
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: /restablecer/i })
    );

    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { name: /estimacion de seguro/i })
      ).not.toBeInTheDocument();
    });

    expect(screen.getByLabelText(/valor de la propiedad/i)).toHaveValue(null);
  });
});