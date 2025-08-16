import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home Page', () => {
  it('should render the home page', () => {
    render(<Home />);
    expect(screen.getByText('Evaluation Platform')).toBeInTheDocument();
  });

  it('should have the correct description', () => {
    render(<Home />);
    expect(screen.getByText('LLM Evaluation Platform for Testing AI Models')).toBeInTheDocument();
  });
});