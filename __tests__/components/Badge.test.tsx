import React from 'react'
import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/badge'

describe('Badge', () => {
  it('renderiza correctamente con texto', () => {
    render(<Badge>Test Badge</Badge>)
    expect(screen.getByText('Test Badge')).toBeInTheDocument()
  })

  it('aplica la variante default correctamente', () => {
    const { container } = render(<Badge>Default</Badge>)
    const badge = container.querySelector('div')
    expect(badge).toHaveClass('border-transparent', 'bg-primary', 'text-primary-foreground')
  })

  it('aplica la variante secondary correctamente', () => {
    const { container } = render(<Badge variant="secondary">Secondary</Badge>)
    const badge = container.querySelector('div')
    expect(badge).toHaveClass('border-transparent', 'bg-secondary', 'text-secondary-foreground')
  })

  it('aplica la variante destructive correctamente', () => {
    const { container } = render(<Badge variant="destructive">Destructive</Badge>)
    const badge = container.querySelector('div')
    expect(badge).toHaveClass('border-transparent', 'bg-destructive', 'text-destructive-foreground')
  })

  it('aplica la variante outline correctamente', () => {
    const { container } = render(<Badge variant="outline">Outline</Badge>)
    const badge = container.querySelector('div')
    expect(badge).toHaveClass('text-foreground')
  })

  it('aplica clases personalizadas', () => {
    const { container } = render(<Badge className="custom-class">Custom</Badge>)
    const badge = container.querySelector('div')
    expect(badge).toHaveClass('custom-class')
  })

  it('pasa props adicionales correctamente', () => {
    render(<Badge data-testid="test-badge" aria-label="Test">Test</Badge>)
    
    const badge = screen.getByTestId('test-badge')
    expect(badge).toHaveAttribute('aria-label', 'Test')
  })

  it('tiene las clases base correctas', () => {
    const { container } = render(<Badge>Base</Badge>)
    const badge = container.querySelector('div')
    expect(badge).toHaveClass(
      'inline-flex',
      'items-center',
      'rounded-full',
      'border',
      'px-2.5',
      'py-0.5',
      'text-xs',
      'font-semibold',
      'transition-colors'
    )
  })

  it('combina variante y clases personalizadas', () => {
    const { container } = render(
      <Badge variant="destructive" className="custom-class">
        Combined
      </Badge>
    )
    const badge = container.querySelector('div')
    expect(badge).toHaveClass('custom-class', 'bg-destructive', 'text-destructive-foreground')
  })

  it('renderiza con contenido complejo', () => {
    render(
      <Badge>
        <span>Icon</span>
        <span>Text</span>
      </Badge>
    )
    
    expect(screen.getByText('Icon')).toBeInTheDocument()
    expect(screen.getByText('Text')).toBeInTheDocument()
  })

  it('mantiene el comportamiento de focus', () => {
    const { container } = render(<Badge tabIndex={0}>Focusable</Badge>)
    const badge = container.querySelector('div')
    expect(badge).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-ring', 'focus:ring-offset-2')
  })
}) 