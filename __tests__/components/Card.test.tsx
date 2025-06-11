import React from 'react'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

describe('Card Components', () => {
  describe('Card', () => {
    it('renderiza correctamente con contenido', () => {
      render(<Card>Card Content</Card>)
      expect(screen.getByText('Card Content')).toBeInTheDocument()
    })

    it('aplica clases personalizadas', () => {
      const { container } = render(<Card className="custom-class">Content</Card>)
      const card = container.querySelector('div')
      expect(card).toHaveClass('custom-class')
    })

    it('tiene las clases base correctas', () => {
      const { container } = render(<Card>Base</Card>)
      const card = container.querySelector('div')
      expect(card).toHaveClass('rounded-lg', 'border', 'bg-card', 'text-card-foreground', 'shadow-sm')
    })

    it('pasa props adicionales correctamente', () => {
      render(<Card data-testid="test-card" aria-label="Test">Test</Card>)
      
      const card = screen.getByTestId('test-card')
      expect(card).toHaveAttribute('aria-label', 'Test')
    })
  })

  describe('CardHeader', () => {
    it('renderiza correctamente con contenido', () => {
      render(<CardHeader>Header Content</CardHeader>)
      expect(screen.getByText('Header Content')).toBeInTheDocument()
    })

    it('aplica clases personalizadas', () => {
      const { container } = render(<CardHeader className="custom-class">Header</CardHeader>)
      const header = container.querySelector('div')
      expect(header).toHaveClass('custom-class')
    })

    it('tiene las clases base correctas', () => {
      const { container } = render(<CardHeader>Base</CardHeader>)
      const header = container.querySelector('div')
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6')
    })
  })

  describe('CardTitle', () => {
    it('renderiza correctamente con texto', () => {
      render(<CardTitle>Card Title</CardTitle>)
      expect(screen.getByText('Card Title')).toBeInTheDocument()
    })

    it('aplica clases personalizadas', () => {
      const { container } = render(<CardTitle className="custom-class">Title</CardTitle>)
      const title = container.querySelector('div')
      expect(title).toHaveClass('custom-class')
    })

    it('tiene las clases base correctas', () => {
      const { container } = render(<CardTitle>Base</CardTitle>)
      const title = container.querySelector('div')
      expect(title).toHaveClass('text-2xl', 'font-semibold', 'leading-none', 'tracking-tight')
    })
  })

  describe('CardDescription', () => {
    it('renderiza correctamente con texto', () => {
      render(<CardDescription>Card Description</CardDescription>)
      expect(screen.getByText('Card Description')).toBeInTheDocument()
    })

    it('aplica clases personalizadas', () => {
      const { container } = render(<CardDescription className="custom-class">Description</CardDescription>)
      const description = container.querySelector('div')
      expect(description).toHaveClass('custom-class')
    })

    it('tiene las clases base correctas', () => {
      const { container } = render(<CardDescription>Base</CardDescription>)
      const description = container.querySelector('div')
      expect(description).toHaveClass('text-sm', 'text-muted-foreground')
    })
  })

  describe('CardContent', () => {
    it('renderiza correctamente con contenido', () => {
      render(<CardContent>Content</CardContent>)
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('aplica clases personalizadas', () => {
      const { container } = render(<CardContent className="custom-class">Content</CardContent>)
      const content = container.querySelector('div')
      expect(content).toHaveClass('custom-class')
    })

    it('tiene las clases base correctas', () => {
      const { container } = render(<CardContent>Base</CardContent>)
      const content = container.querySelector('div')
      expect(content).toHaveClass('p-6', 'pt-0')
    })
  })

  describe('CardFooter', () => {
    it('renderiza correctamente con contenido', () => {
      render(<CardFooter>Footer Content</CardFooter>)
      expect(screen.getByText('Footer Content')).toBeInTheDocument()
    })

    it('aplica clases personalizadas', () => {
      const { container } = render(<CardFooter className="custom-class">Footer</CardFooter>)
      const footer = container.querySelector('div')
      expect(footer).toHaveClass('custom-class')
    })

    it('tiene las clases base correctas', () => {
      const { container } = render(<CardFooter>Base</CardFooter>)
      const footer = container.querySelector('div')
      expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0')
    })
  })

  describe('Card Composition', () => {
    it('renderiza una card completa con todos los componentes', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
          </CardHeader>
          <CardContent>Test Content</CardContent>
          <CardFooter>Test Footer</CardFooter>
        </Card>
      )

      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
      expect(screen.getByText('Test Content')).toBeInTheDocument()
      expect(screen.getByText('Test Footer')).toBeInTheDocument()
    })

    it('mantiene la estructura jerárquica correcta', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      )

      const card = container.firstChild as HTMLElement
      const header = card.querySelector('[class*="p-6"]')
      const content = card.querySelector('[class*="pt-0"]')

      expect(header).toBeInTheDocument()
      expect(content).toBeInTheDocument()
    })
  })
}) 