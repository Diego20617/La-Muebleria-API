import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mocks globales
const mockToast = jest.fn()
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}))

const mockSignOut = jest.fn()
jest.mock('@/lib/supabase/client', () => ({
  getSupabaseClient: () => ({
    auth: { signOut: mockSignOut },
  }),
}))

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

jest.mock('@/components/modals/perfil-modal', () => ({
  PerfilModal: ({ open }: any) => (open ? <div data-testid="perfil-modal">Perfil Modal</div> : null),
}))

jest.mock('@/components/modals/pedidos-modal', () => ({
  PedidosModal: ({ open }: any) => (open ? <div data-testid="pedidos-modal">Pedidos Modal</div> : null),
}))

jest.mock('@/components/modals/configuracion-modal', () => ({
  ConfiguracionModal: ({ open }: any) => (open ? <div data-testid="config-modal">Config Modal</div> : null),
}))

// Mock dinámico para useAuth y useCart
const mockUseAuth = jest.fn()
const mockUseCart = jest.fn()

jest.mock('@/components/auth-provider', () => ({
  useAuth: () => mockUseAuth(),
}))

jest.mock('@/hooks/use-cart', () => ({
  useCart: () => mockUseCart(),
}))

import { UserMenu } from '@/components/user-menu'

describe('UserMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Configurar mocks por defecto
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'admin@muebleriasanbernardo.cl' },
      loading: false,
    })
    mockUseCart.mockReturnValue({ itemCount: 2 })
  })

  it('renderiza correctamente para usuarios autenticados', () => {
    render(<UserMenu />)
    expect(screen.getByText('admin')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('renderiza correctamente para usuarios no autenticados', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false })
    mockUseCart.mockReturnValue({ itemCount: 0 })
    
    render(<UserMenu />)
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument()
    expect(screen.getByText('Registrarse')).toBeInTheDocument()
  })

  it('muestra el estado de carga', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true })
    mockUseCart.mockReturnValue({ itemCount: 0 })
    
    render(<UserMenu />)
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
  })

  it('abre el dropdown cuando se hace clic en el botón de usuario', async () => {
    const user = userEvent.setup()
    render(<UserMenu />)
    
    const userButton = screen.getByRole('button', { name: /admin/i })
    await user.click(userButton)
    
    await waitFor(() => {
      expect(screen.getByText('Mi Perfil')).toBeInTheDocument()
      expect(screen.getByText('Mis Pedidos')).toBeInTheDocument()
      expect(screen.getByText('Mis Reseñas')).toBeInTheDocument()
      expect(screen.getByText('Configuración')).toBeInTheDocument()
      expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument()
    })
  })

  it('muestra el badge de administrador para usuarios admin', async () => {
    const user = userEvent.setup()
    render(<UserMenu />)
    
    const userButton = screen.getByRole('button', { name: /admin/i })
    await user.click(userButton)
    
    await waitFor(() => {
      expect(screen.getAllByText('admin')[0]).toBeInTheDocument()
      expect(screen.getByText('admin@muebleriasanbernardo.cl')).toBeInTheDocument()
    })
  })

  it('no muestra el enlace de administración para usuarios no admin', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: '2', email: 'user@example.com' },
      loading: false,
    })
    mockUseCart.mockReturnValue({ itemCount: 0 })
    
    const user = userEvent.setup()
    render(<UserMenu />)
    
    const userButton = screen.getByRole('button', { name: /user/i })
    await user.click(userButton)
    
    await waitFor(() => {
      expect(screen.queryByText('Panel de Administración')).not.toBeInTheDocument()
    })
  })
}) 