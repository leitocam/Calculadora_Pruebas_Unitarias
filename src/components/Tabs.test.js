import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tabs from './Tabs';

const tabs = [
  { id: 'mortgage', label: 'Hipotecas', icon: '🏠', description: 'Calculadora hipotecaria' },
  { id: 'insurance', label: 'Seguros', icon: '🛡️', description: 'Seguro del hogar' },
  { id: 'investment', label: 'Inversiones', icon: '📈', description: 'Crecimiento de capital' },
];

const TabsHarness = () => {
  const [activeTab, setActiveTab] = useState('mortgage');

  return (
    <>
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <section aria-label="active-content">
        {activeTab === 'mortgage' && <p>Contenido Hipotecas</p>}
        {activeTab === 'insurance' && <p>Contenido Seguros</p>}
        {activeTab === 'investment' && <p>Contenido Inversiones</p>}
      </section>
    </>
  );
};

describe('Tabs', () => {
  it('renders tab labels', () => {
    render(<Tabs tabs={tabs} activeTab="mortgage" onTabChange={jest.fn()} />);

    expect(screen.getByRole('button', { name: /Hipotecas/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Seguros/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Inversiones/i })).toBeInTheDocument();
  });

  it('calls onTabChange with selected tab id', async () => {
    const onTabChange = jest.fn();
    render(<Tabs tabs={tabs} activeTab="mortgage" onTabChange={onTabChange} />);

    await userEvent.click(screen.getByRole('button', { name: /Seguros/i }));

    expect(onTabChange).toHaveBeenCalledWith('insurance');
  });

  it('changes visible active content when clicking tabs', async () => {
    render(<TabsHarness />);

    expect(screen.getByText(/Contenido Hipotecas/i)).toBeInTheDocument();
    expect(screen.queryByText(/Contenido Seguros/i)).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Seguros/i }));

    expect(screen.getByText(/Contenido Seguros/i)).toBeInTheDocument();
    expect(screen.queryByText(/Contenido Hipotecas/i)).not.toBeInTheDocument();
  });
});
