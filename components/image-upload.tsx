"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, ImageIcon } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface ImageUploadProps {
  onImageSelect: (imageUrl: string) => void
  currentImage?: string
}

export function ImageUpload({ onImageSelect, currentImage }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage || "")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (file: File) => {
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo de imagen válido",
        variant: "destructive",
      })
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen debe ser menor a 5MB",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Convertir a base64
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreviewUrl(result)
        onImageSelect(result)

        toast({
          title: "¡Imagen cargada!",
          description: "La imagen se ha cargado correctamente",
        })
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error al cargar imagen:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar la imagen",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const removeImage = () => {
    setPreviewUrl("")
    onImageSelect("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    toast({
      title: "Imagen eliminada",
      description: "La imagen ha sido eliminada",
    })
  }

  return (
    <div className="space-y-4">
      {previewUrl ? (
        <div className="relative">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
            {isUploading ? (
              <div data-testid="loading-spinner" className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Image src={previewUrl || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
            )}
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={removeImage}
            data-testid="remove-image-button"
            aria-label="remove image"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          data-testid="drop-zone"
        >
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 text-gray-400">
              {isUploading ? (
                <div data-testid="loading-spinner" className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              ) : (
                <ImageIcon className="w-12 h-12" />
              )}
            </div>
            <div>
              <p className="text-lg font-medium">{isUploading ? "Cargando imagen..." : "Seleccionar imagen"}</p>
              <p className="text-sm text-gray-500">Arrastra una imagen aquí o haz clic para seleccionar</p>
              <p className="text-xs text-gray-400 mt-2">PNG, JPG, WebP hasta 5MB</p>
            </div>
          </div>
        </div>
      )}

      <input 
        ref={fileInputRef} 
        type="file" 
        accept="image/*" 
        onChange={handleFileInputChange} 
        className="hidden" 
        data-testid="file-input"
      />

      {!previewUrl && (
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full"
          data-testid="gallery-button"
        >
          <Upload className="h-4 w-4 mr-2" />
          Seleccionar desde Galería
        </Button>
      )}
    </div>
  )
}
