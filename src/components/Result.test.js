import React from 'react';
import { render, screen } from '@testing-library/react';
import Result from './Result';

describe('Result', () => {
  it('renders result values passed via props', () => {
    render(<Result results={250000} repaymentResults={1250} />);

    expect(screen.getByRole('heading', { name: /Maximum House Value: £250000/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Expected Monthly Repayments: £1250/i })).toBeInTheDocument();
  });

  it('renders safe defaults when values are not provided', () => {
    render(<Result />);

    expect(screen.getByRole('heading', { name: /Maximum House Value: £0/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Expected Monthly Repayments: £0/i })).toBeInTheDocument();
  });
});
