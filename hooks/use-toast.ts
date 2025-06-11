type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export const toast = ({ title, description, variant = "default" }: ToastProps) => {
  // Implementación simple de toast
  const toastElement = document.createElement("div")
  toastElement.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
    variant === "destructive" ? "bg-red-500 text-white" : "bg-green-500 text-white"
  }`

  toastElement.innerHTML = `
    <div class="font-semibold">${title || ""}</div>
    <div class="text-sm">${description || ""}</div>
  `

  document.body.appendChild(toastElement)

  setTimeout(() => {
    document.body.removeChild(toastElement)
  }, 3000)
}

export const useToast = () => {
  return { toast }
}
