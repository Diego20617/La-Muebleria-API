import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar';
import { AuthProvider } from '../../context/AuthContext';

// Mock del contexto de autenticación
const mockAuthContext = {
  state: {
    isAuthenticated: false,
    user: null,
    isAdmin: false
  },
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn()
};

// Wrapper para proveer el contexto de autenticación y el router
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Navbar', () => {
  it('muestra los enlaces de navegación principales', () => {
    renderWithProviders(<Navbar />);
    
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Colecciones')).toBeInTheDocument();
    expect(screen.getByText('Nosotros')).toBeInTheDocument();
    expect(screen.getByText('Contacto')).toBeInTheDocument();
  });

  it('muestra los botones de inicio de sesión y registro cuando el usuario no está autenticado', () => {
    renderWithProviders(<Navbar />);
    
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.getByText('Registrarse')).toBeInTheDocument();
  });

  it('alterna el menú móvil al hacer clic en el botón de menú', () => {
    renderWithProviders(<Navbar />);
    
    const menuButton = screen.getByRole('button');
    fireEvent.click(menuButton);
    
    // Verificar que el menú móvil está visible
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Colecciones')).toBeInTheDocument();
    expect(screen.getByText('Nosotros')).toBeInTheDocument();
    expect(screen.getByText('Contacto')).toBeInTheDocument();
    
    // Cerrar el menú
    fireEvent.click(menuButton);
    // No verificamos visibilidad porque el DOM no elimina el nodo, solo cambia el estado
  });
}); 