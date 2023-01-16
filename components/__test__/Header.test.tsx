import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import Header from "../Header"

describe('Header', () => {
  it('should not render back button', () => {
    render (
      <Header />
    )
    const elm = screen?.queryByTestId('backBtn');    
    expect(elm).not.toBeInTheDocument();
  })

  it('should render back button', () => {
    render(
      <Header withBackButton={'/'}/>
    );
    const elm = screen.getByTestId('backBtn');
    expect(elm).toBeInTheDocument();
  });

  it('should not render add button', () => {
    render(
        <Header/>
    );
    const elm = screen?.queryByTestId('addBtn');
    expect(elm).not.toBeInTheDocument();
  });

  it('should render add button', () => {
    render(
        <Header withAddButton={true}/>
    );
    const elm = screen.getByTestId('addBtn');
    expect(elm).toBeInTheDocument();
  });
})
