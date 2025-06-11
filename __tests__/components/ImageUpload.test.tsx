import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ImageUpload } from '@/components/image-upload'

// Mock the useToast hook
const mockToast = jest.fn()
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}))

describe('ImageUpload', () => {
  const mockOnImageSelect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza correctamente el área de drop', () => {
    render(<ImageUpload onImageSelect={mockOnImageSelect} />)
    
    expect(screen.getByText('Seleccionar imagen')).toBeInTheDocument()
    expect(screen.getByText('Arrastra una imagen aquí o haz clic para seleccionar')).toBeInTheDocument()
    expect(screen.getByText('PNG, JPG, WebP hasta 5MB')).toBeInTheDocument()
  })

  it('muestra la imagen actual si se proporciona', () => {
    const currentImage = 'data:image/jpeg;base64,test-image'
    render(<ImageUpload onImageSelect={mockOnImageSelect} currentImage={currentImage} />)
    
    const image = screen.getByAltText('Preview')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', currentImage)
  })

  it('maneja la selección de archivo válido correctamente', async () => {
    const user = userEvent.setup()
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    
    render(<ImageUpload onImageSelect={mockOnImageSelect} />)
    
    const input = screen.getByTestId('gallery-button')
    await user.click(input)
    
    const fileInput = screen.getByTestId('file-input') as HTMLInputElement
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    await waitFor(() => {
      expect(mockOnImageSelect).toHaveBeenCalled()
      expect(mockToast).toHaveBeenCalledWith({
        title: '¡Imagen cargada!',
        description: 'La imagen se ha cargado correctamente',
      })
    })
  })

  it('rechaza archivos que no son imágenes', async () => {
    const user = userEvent.setup()
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    
    render(<ImageUpload onImageSelect={mockOnImageSelect} />)
    
    const input = screen.getByTestId('gallery-button')
    await user.click(input)
    
    const fileInput = screen.getByTestId('file-input') as HTMLInputElement
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Error',
      description: 'Por favor selecciona un archivo de imagen válido',
      variant: 'destructive',
    })
  })

  it('rechaza archivos mayores a 5MB', async () => {
    const user = userEvent.setup()
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })
    
    render(<ImageUpload onImageSelect={mockOnImageSelect} />)
    
    const input = screen.getByTestId('gallery-button')
    await user.click(input)
    
    const fileInput = screen.getByTestId('file-input') as HTMLInputElement
    fireEvent.change(fileInput, { target: { files: [largeFile] } })
    
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Error',
      description: 'La imagen debe ser menor a 5MB',
      variant: 'destructive',
    })
  })

  it('maneja el drag and drop correctamente', async () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    
    render(<ImageUpload onImageSelect={mockOnImageSelect} />)
    
    const dropZone = screen.getByTestId('drop-zone')
    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [file],
      },
    })
    
    await waitFor(() => {
      expect(mockOnImageSelect).toHaveBeenCalled()
    })
  })

  it('previene el comportamiento por defecto en dragOver', () => {
    const preventDefault = jest.fn()
    
    render(<ImageUpload onImageSelect={mockOnImageSelect} />)
    
    const dropZone = screen.getByTestId('drop-zone')
    const dragOverEvent = new Event('dragover', { bubbles: true })
    Object.defineProperty(dragOverEvent, 'preventDefault', { value: preventDefault })
    
    fireEvent(dropZone, dragOverEvent)
    
    expect(preventDefault).toHaveBeenCalled()
  })

  it('permite eliminar la imagen seleccionada', async () => {
    const user = userEvent.setup()
    const currentImage = 'data:image/jpeg;base64,test-image'
    
    render(<ImageUpload onImageSelect={mockOnImageSelect} currentImage={currentImage} />)
    
    const removeButton = screen.getByTestId('remove-image-button')
    await user.click(removeButton)
    
    expect(mockOnImageSelect).toHaveBeenCalledWith('')
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Imagen eliminada',
      description: 'La imagen ha sido eliminada',
    })
  })

  it('no muestra el botón de galería cuando hay una imagen', () => {
    const currentImage = 'data:image/jpeg;base64,test-image'
    render(<ImageUpload onImageSelect={mockOnImageSelect} currentImage={currentImage} />)
    
    expect(screen.queryByTestId('gallery-button')).not.toBeInTheDocument()
  })

  it('limpia el input de archivo al eliminar imagen', async () => {
    const user = userEvent.setup()
    const currentImage = 'data:image/jpeg;base64,test-image'
    
    render(<ImageUpload onImageSelect={mockOnImageSelect} currentImage={currentImage} />)
    
    const removeButton = screen.getByTestId('remove-image-button')
    await user.click(removeButton)
    
    const fileInput = screen.getByTestId('file-input') as HTMLInputElement
    expect(fileInput.value).toBe('')
  })
}) 