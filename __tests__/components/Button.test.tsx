import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renderiza correctamente con texto', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('aplica la variante default correctamente', () => {
    const { container } = render(<Button>Default Button</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('bg-primary', 'text-primary-foreground', 'hover:bg-primary/90')
  })

  it('aplica la variante destructive correctamente', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('bg-destructive', 'text-destructive-foreground', 'hover:bg-destructive/90')
  })

  it('aplica la variante outline correctamente', () => {
    const { container } = render(<Button variant="outline">Outline</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('border', 'border-input', 'bg-background', 'hover:bg-accent')
  })

  it('aplica la variante secondary correctamente', () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground', 'hover:bg-secondary/80')
  })

  it('aplica la variante ghost correctamente', () => {
    const { container } = render(<Button variant="ghost">Ghost</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('hover:bg-accent', 'hover:text-accent-foreground')
  })

  it('aplica la variante link correctamente', () => {
    const { container } = render(<Button variant="link">Link</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('text-primary', 'underline-offset-4', 'hover:underline')
  })

  it('aplica el tamaño sm correctamente', () => {
    const { container } = render(<Button size="sm">Small</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('h-9', 'rounded-md', 'px-3')
  })

  it('aplica el tamaño lg correctamente', () => {
    const { container } = render(<Button size="lg">Large</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('h-11', 'rounded-md', 'px-8')
  })

  it('aplica el tamaño icon correctamente', () => {
    const { container } = render(<Button size="icon">Icon</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('h-10', 'w-10')
  })

  it('maneja el evento onClick correctamente', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('aplica clases personalizadas', () => {
    const { container } = render(<Button className="custom-class">Custom</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('custom-class')
  })

  it('se deshabilita correctamente', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('renderiza como child cuando asChild es true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
  })

  it('pasa props adicionales correctamente', () => {
    render(<Button data-testid="test-button" aria-label="Test">Test</Button>)
    
    const button = screen.getByTestId('test-button')
    expect(button).toHaveAttribute('aria-label', 'Test')
  })
}) 