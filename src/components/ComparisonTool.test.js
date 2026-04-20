import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComparisonTool from './ComparisonTool';

describe('ComparisonTool', () => {
  it('shows empty state initially', () => {
    render(<ComparisonTool />);

    expect(screen.getByText(/Aún no hay escenarios/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Comparar Escenarios \(0\)/i })).toBeInTheDocument();
  });

  it('shows validation messages for missing required fields', async () => {
    render(<ComparisonTool />);

    await userEvent.click(screen.getByRole('button', { name: /Añadir Escenario/i }));

    expect(screen.getByText(/Se requiere un nombre de escenario/i)).toBeInTheDocument();
    expect(screen.getByText(/Se requiere un salario válido/i)).toBeInTheDocument();
  });

  it('adds a scenario and allows removing it', async () => {
    render(<ComparisonTool />);

    await userEvent.type(screen.getByLabelText(/Nombre del Escenario/i), 'Escenario Familiar');
    await userEvent.type(screen.getByLabelText(/Salario Primario/i), '65000');
    await userEvent.type(screen.getByLabelText(/Depósito Inicial/i), '50000');
    await userEvent.type(screen.getByLabelText(/Plazo del Préstamo/i), '30');
    await userEvent.type(screen.getByLabelText(/Tasa de Interés/i), '4.5');

    const commitmentsInput = screen.getByRole('spinbutton', { name: /Compromisos Mensuales/i });
    await userEvent.type(commitmentsInput, '400');

    await userEvent.click(screen.getByRole('button', { name: /Añadir Escenario/i }));

    expect(await screen.findByText(/Escenario Familiar/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Comparar Escenarios \(1\)/i })).toBeInTheDocument();
    expect(screen.getByText(/Pago Mensual/i)).toBeInTheDocument();

    const card = screen.getByText(/Escenario Familiar/i).closest('.scenario-card');
    const removeButton = within(card).getByRole('button', { name: /✗/i });
    await userEvent.click(removeButton);

    expect(await screen.findByText(/Aún no hay escenarios/i)).toBeInTheDocument();
  });
});
