import React from 'react';
import { render, screen, within, fireEvent, waitFor } from '@testing-library/react';
import ComparisonTool from './ComparisonTool';

describe('ComparisonTool', () => {
  it('shows empty state initially', () => {
    render(<ComparisonTool />);

    expect(screen.getByText(/aun no hay escenarios/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /comparar escenarios \(0\)/i })
    ).toBeInTheDocument();
  });

  it('shows validation messages for missing required fields', async () => {
    render(<ComparisonTool />);

    fireEvent.click(
      screen.getByRole('button', { name: /anadir escenario/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/se requiere un nombre de escenario/i)).toBeInTheDocument();
      expect(screen.getByText(/se requiere un salario valido/i)).toBeInTheDocument();
      expect(screen.getByText(/se requiere un deposito valido/i)).toBeInTheDocument();
      expect(screen.getByText(/se requiere un compromiso valido/i)).toBeInTheDocument();
    });
  });

  it('adds a scenario and allows removing it', async () => {
    render(<ComparisonTool />);

    fireEvent.change(screen.getByLabelText(/nombre del escenario/i), {
      target: { value: 'Escenario Familiar' },
    });

    fireEvent.change(screen.getByLabelText(/salario primario/i), {
      target: { value: '65000' },
    });

    fireEvent.change(screen.getByLabelText(/deposito inicial/i), {
      target: { value: '50000' },
    });

    fireEvent.change(screen.getByRole('spinbutton', { name: /compromisos mensuales/i }), {
      target: { value: '400' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: /anadir escenario/i })
    );

    expect(await screen.findByText(/escenario familiar/i)).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: /comparar escenarios \(1\)/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/pago mensual/i)).toBeInTheDocument();

    const card = screen.getByText(/escenario familiar/i).closest('.scenario-card');
    expect(card).not.toBeNull();

    const removeButton = within(card).getByTitle(/eliminar escenario/i);
    fireEvent.click(removeButton);

    expect(await screen.findByText(/aun no hay escenarios/i)).toBeInTheDocument();
  });
});