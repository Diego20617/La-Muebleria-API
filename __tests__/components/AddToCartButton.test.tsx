import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddToCartButton } from '@/components/add-to-cart-button'

// Mock the useToast hook
const mockToast = jest.fn()
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}))

// Mock the SimpleCart
jest.mock('@/lib/simple-cart', () => ({
  SimpleCart: {
    addItem: jest.fn(),
  },
}))

// Import the mocked SimpleCart
import { SimpleCart } from '@/lib/simple-cart'

describe('AddToCartButton', () => {
  const mockProducto = {
    id: 1,
    nombre: 'Mesa de Centro',
    precio: 89990,
    imagen_url: '/mesa-centro.jpg',
    stock: 10,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renderiza correctamente con el botón de agregar al carrito', () => {
    render(<AddToCartButton producto={mockProducto} />)
    
    expect(screen.getByText('Agregar al Carrito')).toBeInTheDocument()
    expect(screen.getByTestId('quantity-display')).toHaveTextContent('1')
  })

  it('incrementa la cantidad cuando se hace clic en el botón plus', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<AddToCartButton producto={mockProducto} />)
    
    const plusButton = screen.getByTestId('plus-button')
    await user.click(plusButton)
    
    expect(screen.getByTestId('quantity-display')).toHaveTextContent('2')
  })

  it('decrementa la cantidad cuando se hace clic en el botón minus', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<AddToCartButton producto={mockProducto} />)
    
    // Primero incrementar a 2
    const plusButton = screen.getByTestId('plus-button')
    await user.click(plusButton)
    
    // Luego decrementar a 1
    const minusButton = screen.getByTestId('minus-button')
    await user.click(minusButton)
    
    expect(screen.getByTestId('quantity-display')).toHaveTextContent('1')
  })

  it('no permite decrementar la cantidad por debajo de 1', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<AddToCartButton producto={mockProducto} />)
    
    const minusButton = screen.getByTestId('minus-button')
    await user.click(minusButton)
    
    expect(screen.getByTestId('quantity-display')).toHaveTextContent('1')
    expect(minusButton).toBeDisabled()
  })

  it('agrega el producto al carrito cuando se hace clic en el botón principal', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<AddToCartButton producto={mockProducto} />)
    
    const addButton = screen.getByTestId('add-to-cart-button')
    await user.click(addButton)
    
    await waitFor(() => {
      expect(SimpleCart.addItem).toHaveBeenCalledWith({
        id: mockProducto.id,
        nombre: mockProducto.nombre,
        precio: mockProducto.precio,
        imagen_url: mockProducto.imagen_url,
        stock: mockProducto.stock,
      })
    })
  })

  it('muestra el estado de carga mientras se agrega al carrito', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<AddToCartButton producto={mockProducto} />)
    
    const addButton = screen.getByTestId('add-to-cart-button')
    await user.click(addButton)
    
    expect(screen.getByText('Agregando...')).toBeInTheDocument()
    expect(addButton).toBeDisabled()
  })

  it('muestra el mensaje de éxito después de agregar al carrito', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<AddToCartButton producto={mockProducto} />)
    
    const addButton = screen.getByTestId('add-to-cart-button')
    await user.click(addButton)
    
    // Avanzar el tiempo para simular el delay
    jest.advanceTimersByTime(300)
    
    await waitFor(() => {
      expect(screen.getByText('¡Agregado al Carrito!')).toBeInTheDocument()
    })
  })

  it('deshabilita el botón cuando el producto no tiene stock', () => {
    const productoSinStock = { ...mockProducto, stock: 0 }
    render(<AddToCartButton producto={productoSinStock} />)
    
    const addButton = screen.getByTestId('add-to-cart-button')
    expect(addButton).toBeDisabled()
    expect(screen.getByText('Sin Stock')).toBeInTheDocument()
  })

  it('muestra advertencia cuando quedan pocas unidades', () => {
    const productoPocoStock = { ...mockProducto, stock: 3 }
    render(<AddToCartButton producto={productoPocoStock} />)
    
    expect(screen.getByText('⚠️ Solo quedan 3 unidades')).toBeInTheDocument()
  })

  it('agrega múltiples cantidades al carrito', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<AddToCartButton producto={mockProducto} />)
    
    // Incrementar cantidad a 3
    const plusButton = screen.getByTestId('plus-button')
    await user.click(plusButton)
    await user.click(plusButton)
    
    const addButton = screen.getByTestId('add-to-cart-button')
    await user.click(addButton)
    
    await waitFor(() => {
      expect(SimpleCart.addItem).toHaveBeenCalledTimes(3)
    })
  })
}) 