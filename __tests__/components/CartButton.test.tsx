import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CartButton } from '@/components/cart-button'

// Mock the useAuth hook
const mockUser = { id: '1', email: 'test@example.com' }
jest.mock('@/components/auth-provider', () => ({
  useAuth: () => ({
    user: mockUser,
    loading: false,
  }),
}))

// Mock the useToast hook
const mockToast = jest.fn()
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}))

// Mock fetch
global.fetch = jest.fn()

describe('CartButton', () => {
  const defaultProps = {
    productId: 1,
    productName: 'Mesa de Comedor',
    stock: 10,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetch as jest.Mock).mockClear()
  })

  it('renderiza correctamente con el botón de agregar al carrito', () => {
    render(<CartButton {...defaultProps} />)
    
    expect(screen.getByText('Agregar al Carrito')).toBeInTheDocument()
    expect(screen.getByDisplayValue('1')).toBeInTheDocument()
  })

  it('incrementa la cantidad cuando se hace clic en el botón plus', async () => {
    const user = userEvent.setup()
    render(<CartButton {...defaultProps} />)
    
    const plusButton = screen.getByRole('button', { name: /plus/i })
    await user.click(plusButton)
    
    expect(screen.getByDisplayValue('2')).toBeInTheDocument()
  })

  it('decrementa la cantidad cuando se hace clic en el botón minus', async () => {
    const user = userEvent.setup()
    render(<CartButton {...defaultProps} />)
    
    // Primero incrementar a 2
    const plusButton = screen.getByRole('button', { name: /plus/i })
    await user.click(plusButton)
    
    // Luego decrementar a 1
    const minusButton = screen.getByRole('button', { name: /minus/i })
    await user.click(minusButton)
    
    expect(screen.getByDisplayValue('1')).toBeInTheDocument()
  })

  it('no permite incrementar más allá del stock disponible', async () => {
    const user = userEvent.setup()
    render(<CartButton {...defaultProps} stock={2} />)
    
    const plusButton = screen.getByRole('button', { name: /plus/i })
    await user.click(plusButton) // 2
    await user.click(plusButton) // sigue en 2 (máximo)
    
    expect(screen.getByDisplayValue('2')).toBeInTheDocument()
    expect(plusButton).toBeDisabled()
  })

  it('no permite decrementar por debajo de 1', async () => {
    const user = userEvent.setup()
    render(<CartButton {...defaultProps} />)
    
    const minusButton = screen.getByRole('button', { name: /minus/i })
    await user.click(minusButton)
    
    expect(screen.getByDisplayValue('1')).toBeInTheDocument()
    expect(minusButton).toBeDisabled()
  })

  it('agrega el producto al carrito exitosamente', async () => {
    const user = userEvent.setup()
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true }),
    })
    
    render(<CartButton {...defaultProps} />)
    
    const addButton = screen.getByText('Agregar al Carrito')
    await user.click(addButton)
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/carrito/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productoId: 1,
          cantidad: 1,
        }),
      })
    })
    
    expect(mockToast).toHaveBeenCalledWith({
      title: '¡Agregado al carrito!',
      description: '1 Mesa de Comedor agregado al carrito',
    })
  })

  it('maneja errores de la API correctamente', async () => {
    const user = userEvent.setup()
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))
    
    render(<CartButton {...defaultProps} />)
    
    const addButton = screen.getByText('Agregar al Carrito')
    await user.click(addButton)
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Ocurrió un error al agregar el producto',
        variant: 'destructive',
      })
    })
  })

  it('muestra el estado de carga mientras se agrega al carrito', async () => {
    const user = userEvent.setup()
    ;(fetch as jest.Mock).mockImplementation(() => new Promise(() => {})) // Never resolves
    
    render(<CartButton {...defaultProps} />)
    
    const addButton = screen.getByText('Agregar al Carrito')
    await user.click(addButton)
    
    expect(screen.getByText('Agregando...')).toBeInTheDocument()
    expect(addButton).toBeDisabled()
  })

  it('deshabilita el botón cuando no hay stock', () => {
    render(<CartButton {...defaultProps} stock={0} />)
    
    const addButton = screen.getByText('Sin Stock')
    expect(addButton).toBeDisabled()
  })

  it('dispara el evento cartUpdated cuando se agrega exitosamente', async () => {
    const user = userEvent.setup()
    const mockDispatchEvent = jest.spyOn(window, 'dispatchEvent')
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true }),
    })
    
    render(<CartButton {...defaultProps} />)
    
    const addButton = screen.getByText('Agregar al Carrito')
    await user.click(addButton)
    
    await waitFor(() => {
      expect(mockDispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'cartUpdated',
        })
      )
    })
    
    mockDispatchEvent.mockRestore()
  })

  it('aplica clases CSS personalizadas', () => {
    const { container } = render(<CartButton {...defaultProps} className="custom-class" />)
    
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('custom-class')
  })
}) 