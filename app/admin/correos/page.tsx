"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Mail, Send, Users, FileText, Loader2, AlertCircle, TestTube, CheckCircle, History, User, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import {
  sendEmail,
  sendBulkEmail,
  getEmailTemplates,
  sendTestEmail,
  getSentEmails,
  getUsersWithEmails,
} from "@/lib/actions/email-actions"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface SentEmail {
  id: string
  to_email: string
  subject: string
  message: string
  type: string
  message_id?: string
  sent_at: string
  status: 'sent' | 'failed'
  error_message?: string
}

interface UserWithEmail {
  id: string
  nombre: string
  apellido: string
  email: string
}

export default function EmailManagement(): JSX.Element {
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const [isAdmin, setIsAdmin] = useState(false)
  const [sending, setSending] = useState(false)
  const [testing, setTesting] = useState(false)
  const [usuarios, setUsuarios] = useState<UserWithEmail[]>([])
  const [sentEmails, setSentEmails] = useState<SentEmail[]>([])
  const [templates, setTemplates] = useState<any>({})
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [loadingSentEmails, setLoadingSentEmails] = useState(false)

  // Estados para correo individual
  const [singleEmail, setSingleEmail] = useState({
    to: "",
    subject: "",
    message: "",
    type: "personalizado" as "promocion" | "notificacion" | "personalizado",
  })

  // Estados para correo masivo
  const [bulkEmail, setBulkEmail] = useState({
    recipients: [] as string[],
    subject: "",
    message: "",
    type: "promocion" as "promocion" | "notificacion" | "newsletter",
  })

  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  useEffect(() => {
    if (user) {
      setIsAdmin(user.email === "admin@muebleriasanbernardo.cl")
    }
  }, [user])

  useEffect(() => {
    if (isAdmin) {
      loadUsuarios()
      loadTemplates()
      loadSentEmails()
    }
  }, [isAdmin])

  const loadUsuarios = async () => {
    setLoadingUsers(true)
    try {
      const usuariosData = await getUsersWithEmails()
      setUsuarios(usuariosData)
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Error inesperado al cargar usuarios",
        variant: "destructive",
      })
    } finally {
      setLoadingUsers(false)
    }
  }

  const loadSentEmails = async () => {
    setLoadingSentEmails(true)
    try {
      const emailsData = await getSentEmails()
      setSentEmails(emailsData as unknown as SentEmail[])
    } catch (error) {
      console.error("Error cargando emails enviados:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los correos enviados",
        variant: "destructive",
      })
    } finally {
      setLoadingSentEmails(false)
    }
  }

  const loadTemplates = async () => {
    try {
      const templatesData = await getEmailTemplates()
      setTemplates(templatesData)
    } catch (error) {
      console.error("Error cargando plantillas:", error)
    }
  }

  const handleUserSelect = (userId: string) => {
    const selectedUser = usuarios.find(u => u.id === userId)
    if (selectedUser) {
      if (selectedUser.email && selectedUser.email.trim() !== "") {
        setSingleEmail(prev => ({ ...prev, to: selectedUser.email }))
      } else {
        setSingleEmail(prev => ({ ...prev, to: "" }))
        toast({
          title: "Usuario sin email",
          description: `El usuario ${selectedUser.nombre} ${selectedUser.apellido} no tiene un correo registrado.`,
          variant: "destructive",
        })
      }
    }
  }

  const handleSendTestEmail = async () => {
    if (!singleEmail.to) {
      toast({
        title: "Error",
        description: "Ingresa un email para la prueba",
        variant: "destructive",
      })
      return
    }

    setTesting(true)
    try {
      const result = await sendTestEmail()

      if (result.success) {
        toast({
          title: "🧪 Correo de Prueba Enviado",
          description: `Revisa la bandeja de entrada de ${singleEmail.to}`,
        })
        loadSentEmails() // Recargar historial
      } else {
        toast({
          title: "Error en Prueba",
          description: result.error || "No se pudo enviar el correo de prueba",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error inesperado al enviar correo de prueba",
        variant: "destructive",
      })
    } finally {
      setTesting(false)
    }
  }

  const handleSendIndividualEmail = async () => {
    try {
      setSending(true)
      const result = await sendEmail(singleEmail)
      if (result.success) {
        toast({
          title: 'Éxito',
          description: 'Correo enviado correctamente',
        })
        setSingleEmail({
          to: "",
          subject: "",
          message: "",
          type: "personalizado",
        })
        loadSentEmails() // Recargar historial
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Error al enviar correo',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error sending email:', error)
      toast({
        title: 'Error',
        description: 'No se pudo enviar el correo',
        variant: 'destructive',
      })
    } finally {
      setSending(false)
    }
  }

  const handleSendBulkEmail = async () => {
    try {
      setSending(true)
      const recipients = selectedUsers.map(userId => usuarios.find(u => u.id === userId)?.email || '')
      const result = await sendBulkEmail({
        ...bulkEmail,
        recipients,
      })
      if (result.success) {
        toast({
          title: 'Éxito',
          description: 'Correos enviados correctamente',
        })
        setBulkEmail({
          recipients: [],
          subject: "",
          message: "",
          type: "promocion",
        })
        setSelectedUsers([])
        loadSentEmails() // Recargar historial
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Error al enviar correos',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error sending bulk email:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron enviar los correos',
        variant: 'destructive',
      })
    } finally {
      setSending(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    if (status === 'sent') {
      return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Enviado</Badge>
    } else {
      return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Fallido</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Cargando...</p>
          </div>
        </div>
      ) : !user || !isAdmin ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">Acceso Denegado</h2>
            <p className="mb-4">No tienes permisos para acceder a esta página.</p>
            <Button asChild>
              <Link href="/admin">Volver al Panel</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al Panel
                </Link>
              </Button>
            </div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Mail className="h-8 w-8" />
              Gestión de Correos
            </h1>
            <p className="text-muted-foreground">Envía correos promocionales y notificaciones a tus clientes</p>

            {/* Panel de pruebas */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <TestTube className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-blue-800">Pruebas del Sistema</p>
                  <p className="text-blue-700 text-sm mb-3">
                    Verifica que la configuración de emails esté funcionando correctamente.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleSendTestEmail} disabled={testing}>
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar Prueba
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <Tabs defaultValue="individual" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="individual">Correo Individual</TabsTrigger>
              <TabsTrigger value="masivo">Correo Masivo</TabsTrigger>
              <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
              <TabsTrigger value="historial">Historial</TabsTrigger>
            </TabsList>
            
            <TabsContent value="individual" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Enviar Correo Individual</CardTitle>
                  <CardDescription>
                    Envía un correo electrónico a un destinatario específico.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    handleSendIndividualEmail()
                  }}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="userSelect">Seleccionar Usuario</Label>
                        <Select onValueChange={handleUserSelect}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un usuario para autocompletar el email" />
                          </SelectTrigger>
                          <SelectContent>
                            {usuarios.map((usuario) => (
                              <SelectItem key={usuario.id} value={usuario.id}>
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  {usuario.nombre} {usuario.apellido} - {usuario.email}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="to">Destinatario</Label>
                        <Input
                          id="to"
                          type="email"
                          placeholder="ejemplo@email.com"
                          value={singleEmail.to}
                          onChange={(e) => setSingleEmail(prev => ({ ...prev, to: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="subject">Asunto</Label>
                        <Input
                          id="subject"
                          placeholder="Asunto del correo"
                          value={singleEmail.subject}
                          onChange={(e) => setSingleEmail(prev => ({ ...prev, subject: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="message">Mensaje</Label>
                        <Textarea
                          id="message"
                          placeholder="Escribe tu mensaje aquí..."
                          value={singleEmail.message}
                          onChange={(e) => setSingleEmail(prev => ({ ...prev, message: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="type">Tipo de Correo</Label>
                        <Select
                          value={singleEmail.type}
                          onValueChange={(value) => setSingleEmail(prev => ({ ...prev, type: value as any }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el tipo de correo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="personalizado">Personalizado</SelectItem>
                            <SelectItem value="promocion">Promoción</SelectItem>
                            <SelectItem value="notificacion">Notificación</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit" disabled={sending}>
                          {sending ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Enviando...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Enviar
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="masivo" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Enviar Correo Masivo</CardTitle>
                  <CardDescription>
                    Envía un correo electrónico a múltiples destinatarios.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Seleccionar Usuarios</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                        {usuarios.map((usuario) => (
                          <div key={usuario.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={usuario.id}
                              checked={selectedUsers.includes(usuario.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedUsers(prev => [...prev, usuario.id])
                                } else {
                                  setSelectedUsers(prev => prev.filter(id => id !== usuario.id))
                                }
                              }}
                              className="rounded"
                            />
                            <label htmlFor={usuario.id} className="text-sm">
                              {usuario.nombre} {usuario.apellido}
                            </label>
                          </div>
                        ))}
                      </div>
                      {selectedUsers.length > 0 && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {selectedUsers.length} usuario(s) seleccionado(s)
                        </p>
                      )}
                    </div>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      handleSendBulkEmail()
                    }}>
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="bulkSubject">Asunto</Label>
                          <Input
                            id="bulkSubject"
                            placeholder="Asunto del correo"
                            value={bulkEmail.subject}
                            onChange={(e) => setBulkEmail(prev => ({ ...prev, subject: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="bulkMessage">Mensaje</Label>
                          <Textarea
                            id="bulkMessage"
                            placeholder="Escribe tu mensaje aquí..."
                            value={bulkEmail.message}
                            onChange={(e) => setBulkEmail(prev => ({ ...prev, message: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="bulkType">Tipo de Correo</Label>
                          <Select
                            value={bulkEmail.type}
                            onValueChange={(value) => setBulkEmail(prev => ({ ...prev, type: value as any }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona el tipo de correo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="promocion">Promoción</SelectItem>
                              <SelectItem value="notificacion">Notificación</SelectItem>
                              <SelectItem value="newsletter">Newsletter</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex justify-end">
                          <Button type="submit" disabled={sending || selectedUsers.length === 0}>
                            {sending ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Enviando...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-2" />
                                Enviar ({selectedUsers.length})
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="usuarios" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Lista de Usuarios
                  </CardTitle>
                  <CardDescription>
                    Usuarios registrados en el sistema con sus correos electrónicos.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingUsers ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      Cargando usuarios...
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {usuarios.map((usuario) => (
                        <div key={usuario.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{usuario.nombre} {usuario.apellido}</p>
                              <p className="text-sm text-muted-foreground">{usuario.email}</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSingleEmail(prev => ({ ...prev, to: usuario.email }))
                              // Cambiar a la pestaña individual
                              const tabsList = document.querySelector('[role="tablist"]') as HTMLElement
                              const individualTab = tabsList?.querySelector('[value="individual"]') as HTMLElement
                              individualTab?.click()
                            }}
                          >
                            Usar Email
                          </Button>
                        </div>
                      ))}
                      {usuarios.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          No hay usuarios registrados
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="historial" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Historial de Correos Enviados
                  </CardTitle>
                  <CardDescription>
                    Registro de todos los correos enviados desde el sistema.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingSentEmails ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      Cargando historial...
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sentEmails.map((email) => (
                        <div key={email.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{email.to_email}</span>
                                {getStatusBadge(email.status)}
                              </div>
                              <h4 className="font-semibold text-sm">{email.subject}</h4>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(email.sent_at)}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {email.type}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {email.message}
                            </p>
                          </div>
                          {email.error_message && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                              <strong>Error:</strong> {email.error_message}
                            </div>
                          )}
                        </div>
                      ))}
                      {sentEmails.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          No hay correos enviados aún
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
