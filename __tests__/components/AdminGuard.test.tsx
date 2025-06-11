import React from 'react'
import { render, screen } from '@testing-library/react'
import { AdminGuard } from '@/components/admin-guard'

// Mock the useAuth hook
const mockUseAuth = jest.fn()
jest.mock('@/components/auth-provider', () => ({
  useAuth: () => mockUseAuth(),
}))

describe('AdminGuard', () => {
  const mockChildren = <div data-testid="admin-content">Admin Content</div>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('muestra el contenido cuando el usuario es admin', () => {
    mockUseAuth.mockReturnValue({
      user: { email: 'admin@muebleriasanbernardo.cl' },
      loading: false,
    })

    render(<AdminGuard>{mockChildren}</AdminGuard>)
    
    expect(screen.getByTestId('admin-content')).toBeInTheDocument()
  })

  it('muestra loading mientras se carga la autenticación', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
    })

    render(<AdminGuard>{mockChildren}</AdminGuard>)
    
    expect(screen.getByText('Cargando panel de administración...')).toBeInTheDocument()
    expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument()
  })

  it('muestra acceso denegado cuando no hay usuario', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    })

    render(<AdminGuard>{mockChildren}</AdminGuard>)
    
    expect(screen.getByText('Acceso Denegado')).toBeInTheDocument()
    expect(screen.getByText('No tienes permisos para acceder al panel de administración.')).toBeInTheDocument()
    expect(screen.getByText('Usuario actual: No autenticado')).toBeInTheDocument()
    expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument()
  })

  it('muestra acceso denegado cuando el usuario no es admin', () => {
    mockUseAuth.mockReturnValue({
      user: { email: 'user@example.com' },
      loading: false,
    })

    render(<AdminGuard>{mockChildren}</AdminGuard>)
    
    expect(screen.getByText('Acceso Denegado')).toBeInTheDocument()
    expect(screen.getByText('No tienes permisos para acceder al panel de administración.')).toBeInTheDocument()
    expect(screen.getByText('Usuario actual: user@example.com')).toBeInTheDocument()
    expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument()
  })

  it('muestra el ícono de escudo cuando el acceso es denegado', () => {
    mockUseAuth.mockReturnValue({
      user: { email: 'user@example.com' },
      loading: false,
    })

    render(<AdminGuard>{mockChildren}</AdminGuard>)
    
    const shieldIcon = screen.getByTestId('shield-icon')
    expect(shieldIcon).toBeInTheDocument()
    expect(shieldIcon).toHaveClass('text-red-500')
  })

  it('muestra el spinner de carga cuando está cargando', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
    })

    render(<AdminGuard>{mockChildren}</AdminGuard>)
    
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('animate-spin')
  })

  it('permite acceso con email de admin exacto', () => {
    mockUseAuth.mockReturnValue({
      user: { email: 'admin@muebleriasanbernardo.cl' },
      loading: false,
    })

    render(<AdminGuard>{mockChildren}</AdminGuard>)
    
    expect(screen.getByTestId('admin-content')).toBeInTheDocument()
    expect(screen.queryByText('Acceso Denegado')).not.toBeInTheDocument()
  })

  it('no permite acceso con email similar pero no exacto', () => {
    mockUseAuth.mockReturnValue({
      user: { email: 'admin@muebleriasanbernardo.com' },
      loading: false,
    })

    render(<AdminGuard>{mockChildren}</AdminGuard>)
    
    expect(screen.getByText('Acceso Denegado')).toBeInTheDocument()
    expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument()
  })
}) 