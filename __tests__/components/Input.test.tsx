import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '@/components/ui/input'

describe('Input', () => {
  it('renderiza correctamente con placeholder', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('aplica el tipo de input correctamente', () => {
    render(<Input type="email" placeholder="Email" />)
    const input = screen.getByPlaceholderText('Email')
    expect(input).toHaveAttribute('type', 'email')
  })

  it('maneja el evento onChange correctamente', () => {
    const handleChange = jest.fn()
    render(<Input onChange={handleChange} placeholder="Test" />)
    
    const input = screen.getByPlaceholderText('Test')
    fireEvent.change(input, { target: { value: 'test value' } })
    
    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(input).toHaveValue('test value')
  })

  it('aplica clases personalizadas', () => {
    const { container } = render(<Input className="custom-class" placeholder="Test" />)
    const input = container.querySelector('input')
    expect(input).toHaveClass('custom-class')
  })

  it('se deshabilita correctamente', () => {
    render(<Input disabled placeholder="Disabled" />)
    const input = screen.getByPlaceholderText('Disabled')
    expect(input).toBeDisabled()
  })

  it('aplica el valor inicial correctamente', () => {
    render(<Input defaultValue="initial value" placeholder="Test" />)
    const input = screen.getByPlaceholderText('Test')
    expect(input).toHaveValue('initial value')
  })

  it('pasa props adicionales correctamente', () => {
    render(<Input data-testid="test-input" aria-label="Test" placeholder="Test" />)
    
    const input = screen.getByTestId('test-input')
    expect(input).toHaveAttribute('aria-label', 'Test')
  })

  it('tiene las clases base correctas', () => {
    const { container } = render(<Input placeholder="Base" />)
    const input = container.querySelector('input')
    expect(input).toHaveClass(
      'flex',
      'h-10',
      'w-full',
      'rounded-md',
      'border',
      'border-input',
      'bg-background',
      'px-3',
      'py-2',
      'text-base'
    )
  })

  it('maneja el evento onFocus correctamente', () => {
    const handleFocus = jest.fn()
    render(<Input onFocus={handleFocus} placeholder="Focus" />)
    
    const input = screen.getByPlaceholderText('Focus')
    fireEvent.focus(input)
    
    expect(handleFocus).toHaveBeenCalledTimes(1)
  })

  it('maneja el evento onBlur correctamente', () => {
    const handleBlur = jest.fn()
    render(<Input onBlur={handleBlur} placeholder="Blur" />)
    
    const input = screen.getByPlaceholderText('Blur')
    fireEvent.blur(input)
    
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('aplica el atributo required correctamente', () => {
    render(<Input required placeholder="Required" />)
    const input = screen.getByPlaceholderText('Required')
    expect(input).toHaveAttribute('required')
  })

  it('aplica el atributo name correctamente', () => {
    render(<Input name="test-name" placeholder="Named" />)
    const input = screen.getByPlaceholderText('Named')
    expect(input).toHaveAttribute('name', 'test-name')
  })

  it('combina múltiples props correctamente', () => {
    const { container } = render(
      <Input
        type="password"
        placeholder="Password"
        className="custom-class"
        disabled
        required
        name="password"
      />
    )
    
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('type', 'password')
    expect(input).toHaveAttribute('placeholder', 'Password')
    expect(input).toHaveClass('custom-class')
    expect(input).toBeDisabled()
    expect(input).toHaveAttribute('required')
    expect(input).toHaveAttribute('name', 'password')
  })
}) 