import React from 'react'
import { render, screen } from '@testing-library/react'
import { ProductCard } from '@/components/product-card'

// Mock the AddToCartButton component
jest.mock('@/components/add-to-cart-button', () => ({
  AddToCartButton: ({ producto }: any) => (
    <button data-testid="add-to-cart-button">
      Agregar {producto.nombre}
    </button>
  ),
}))

// Mock the useToast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

describe('ProductCard', () => {
  const mockProducto = {
    id: 1,
    nombre: 'Sillón Reclinable',
    precio: 299990,
    precio_anterior: 399990,
    imagen_url: '/test-image.jpg',
    stock: 5,
    nuevo: true,
    destacado: false,
    descuento: 25,
    categoria: 'Sillones',
  }

  it('renderiza correctamente con todos los datos del producto', () => {
    render(<ProductCard producto={mockProducto} />)
    
    expect(screen.getByText('Sillón Reclinable')).toBeInTheDocument()
    expect(screen.getByText('Sillones')).toBeInTheDocument()
    expect(screen.getByText('Nuevo')).toBeInTheDocument()
    expect(screen.getByText('-25%')).toBeInTheDocument()
    expect(screen.getByText('$299.990')).toBeInTheDocument()
    expect(screen.getByText('$399.990')).toBeInTheDocument()
    expect(screen.getByText('5 unidades')).toBeInTheDocument()
    expect(screen.getByTestId('add-to-cart-button')).toBeInTheDocument()
  })

  it('muestra el badge de destacado cuando el producto es destacado', () => {
    const productoDestacado = { ...mockProducto, destacado: true, nuevo: false }
    render(<ProductCard producto={productoDestacado} />)
    
    expect(screen.getByText('Destacado')).toBeInTheDocument()
    expect(screen.queryByText('Nuevo')).not.toBeInTheDocument()
  })

  it('muestra el mensaje de ahorro cuando hay descuento', () => {
    render(<ProductCard producto={mockProducto} />)
    
    expect(screen.getByText(/Ahorras \$100\.000/)).toBeInTheDocument()
  })

  it('muestra "Sin stock" cuando el stock es 0', () => {
    const productoSinStock = { ...mockProducto, stock: 0 }
    render(<ProductCard producto={productoSinStock} />)
    
    expect(screen.getByText('Sin stock')).toBeInTheDocument()
  })

  it('aplica las clases CSS correctas para el hover effect', () => {
    const { container } = render(<ProductCard producto={mockProducto} />)
    
    const card = container.querySelector('.group')
    expect(card).toHaveClass('group', 'overflow-hidden', 'hover:shadow-lg', 'transition-shadow', 'duration-300')
  })

  it('renderiza la imagen con los atributos correctos', () => {
    render(<ProductCard producto={mockProducto} />)
    
    const image = screen.getByAltText('Sillón Reclinable')
    expect(image).toHaveAttribute('src', '/test-image.jpg')
    expect(image).toHaveAttribute('width', '300')
    expect(image).toHaveAttribute('height', '300')
  })
}) 