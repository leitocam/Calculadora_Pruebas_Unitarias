import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InsuranceCalculator from './InsuranceCalculator';

describe('InsuranceCalculator', () => {
  it('shows validation when property value is missing', async () => {
    render(<InsuranceCalculator />);

    await userEvent.click(screen.getByRole('button', { name: /Calcular Seguro/i }));

    expect(screen.getByText(/Por favor, ingresa un valor de propiedad válido/i)).toBeInTheDocument();
  });

  it('calculates and renders insurance result for premium plan', async () => {
    render(<InsuranceCalculator />);

    await userEvent.type(screen.getByLabelText(/Valor de la Propiedad/i), '100000');
    await userEvent.click(screen.getByRole('radio', { name: /Premium/i }));
    await userEvent.click(screen.getByRole('button', { name: /Calcular Seguro/i }));

    expect(await screen.findByRole('heading', { name: /Estimación de Seguro/i })).toBeInTheDocument();
    expect(screen.getByText('£800')).toBeInTheDocument();
    expect(screen.getByText('£66.67')).toBeInTheDocument();
  });

  it('resets form and clears rendered result', async () => {
    render(<InsuranceCalculator />);

    await userEvent.type(screen.getByLabelText(/Valor de la Propiedad/i), '100000');
    await userEvent.click(screen.getByRole('button', { name: /Calcular Seguro/i }));
    expect(await screen.findByRole('heading', { name: /Estimación de Seguro/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Restablecer/i }));

    expect(screen.queryByRole('heading', { name: /Estimación de Seguro/i })).not.toBeInTheDocument();
    expect(screen.getByLabelText(/Valor de la Propiedad/i)).toHaveValue(null);
  });
});
