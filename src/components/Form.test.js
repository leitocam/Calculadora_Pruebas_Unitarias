import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Form from './Form';

describe('Form', () => {
  it('renders core fields and submit action', () => {
    render(<Form onFormSubmit={jest.fn()} />);

    expect(screen.getByLabelText(/Your annual salary/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Your deposit/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Monthly commitments/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mortgage term in years/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Monthly interest rate/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Calculate/i })).toBeInTheDocument();
  });

  it('allows typing and submitting valid values, then calls onFormSubmit with parsed numbers', async () => {
    const onFormSubmit = jest.fn();
    render(<Form onFormSubmit={onFormSubmit} />);

    await userEvent.clear(screen.getByLabelText(/Your annual salary/i));
    await userEvent.type(screen.getByLabelText(/Your annual salary/i), '60000');
    await userEvent.clear(screen.getByLabelText(/Your deposit/i));
    await userEvent.type(screen.getByLabelText(/Your deposit/i), '50000');
    await userEvent.clear(screen.getByLabelText(/Monthly commitments/i));
    await userEvent.type(screen.getByLabelText(/Monthly commitments/i), '500');
    await userEvent.clear(screen.getByLabelText(/Mortgage term in years/i));
    await userEvent.type(screen.getByLabelText(/Mortgage term in years/i), '30');
    await userEvent.clear(screen.getByLabelText(/Monthly interest rate/i));
    await userEvent.type(screen.getByLabelText(/Monthly interest rate/i), '4.5');

    await userEvent.click(screen.getByRole('button', { name: /Add another salary/i }));
    await userEvent.clear(screen.getByLabelText(/Other salary/i));
    await userEvent.type(screen.getByLabelText(/Other salary/i), '15000');

    await userEvent.click(screen.getByRole('button', { name: /Calculate/i }));

    expect(onFormSubmit).toHaveBeenCalledTimes(1);
    expect(onFormSubmit).toHaveBeenCalledWith({
      salary: 60000,
      salary2: 15000,
      deposit: 50000,
      commitments: 500,
      term: 30,
      interest: 4.5,
    });

    expect(screen.getByLabelText(/Your annual salary/i)).toHaveValue(0);
    expect(screen.getByLabelText(/Your deposit/i)).toHaveValue(0);
  });

  it('does not submit when required fields are missing', async () => {
    const onFormSubmit = jest.fn();
    render(<Form onFormSubmit={onFormSubmit} />);

    await userEvent.click(screen.getByRole('button', { name: /Calculate/i }));

    expect(onFormSubmit).not.toHaveBeenCalled();
  });
});
