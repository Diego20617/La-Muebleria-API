"use server"

import nodemailer from 'nodemailer'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// Configuración de Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// Tipos para las respuestas de los emails
interface EmailResponse {
  success: boolean
  messageId?: string
  error?: string
  message?: string
  results?: BulkEmailResult[]
  summary?: BulkEmailSummary
}

interface BulkEmailResult {
  email: string
  success: boolean
  messageId?: string
  error?: string
}

interface BulkEmailSummary {
  total: number
  success: number
  errors: number
}

interface SentEmail {
  id: string
  to: string
  subject: string
  message: string
  type: string
  message_id?: string
  sent_at: string
  status: 'sent' | 'failed'
  error_message?: string
}

// Función para guardar correo enviado en la base de datos
async function saveSentEmail(emailData: {
  to: string
  subject: string
  message: string
  type: string
  messageId?: string
  status: 'sent' | 'failed'
  errorMessage?: string
}): Promise<void> {
  try {
    const supabase = createServerSupabaseClient()
    await supabase.from('emails_enviados').insert({
      to_email: emailData.to,
      subject: emailData.subject,
      message: emailData.message,
      type: emailData.type,
      message_id: emailData.messageId,
      status: emailData.status,
      error_message: emailData.errorMessage,
      sent_at: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error guardando email en BD:', error)
  }
}

// Función para obtener historial de correos enviados
export async function getSentEmails(): Promise<SentEmail[]> {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('emails_enviados')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Error obteniendo emails enviados:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

// Función para obtener usuarios con emails
export async function getUsersWithEmails(): Promise<any[]> {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('perfiles')
      .select('id, nombre, apellido, email')
      .order('nombre')

    if (error) {
      console.error('Error obteniendo usuarios:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

export async function sendEmail(data: {
  to: string
  subject: string
  message: string
  type: "promocion" | "notificacion" | "personalizado" | "test"
}): Promise<EmailResponse> {
  try {
    const { to, subject, message, type } = data

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      return { success: false, error: "Email inválido" }
    }

    // Plantilla HTML base mejorada
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              margin: 0; 
              padding: 0; 
              background-color: #f4f4f4;
            }
            .container { 
              max-width: 600px; 
              margin: 20px auto; 
              background: white; 
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header { 
              background: linear-gradient(135deg, #2563eb, #1d4ed8); 
              color: white; 
              padding: 40px 20px; 
              text-align: center; 
            }
            .header h1 { 
              margin: 0; 
              font-size: 28px; 
              font-weight: 600;
            }
            .content { 
              padding: 40px 30px; 
              background: white; 
            }
            .content p { 
              margin-bottom: 15px; 
              font-size: 16px;
            }
            .footer { 
              padding: 30px 20px; 
              text-align: center; 
              font-size: 12px; 
              color: #666; 
              background: #f8f9fa; 
              border-top: 1px solid #e9ecef;
            }
            .btn { 
              display: inline-block; 
              padding: 12px 24px; 
              background: #2563eb; 
              color: white; 
              text-decoration: none; 
              border-radius: 6px; 
              margin: 15px 0; 
              font-weight: 500;
            }
            .highlight {
              background: #f0f9ff;
              padding: 20px;
              border-left: 4px solid #2563eb;
              margin: 20px 0;
              border-radius: 0 6px 6px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🪑 Mueblería San Bernardo</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Tu tienda de muebles de confianza</p>
            </div>
            <div class="content">
              <div class="highlight">
                ${message.replace(/\n/g, "<br>")}
              </div>
            </div>
            <div class="footer">
              <p><strong>Mueblería San Bernardo</strong></p>
              <p>📍 San Bernardo, Región Metropolitana, Chile</p>
              <p>📞 Teléfono: +56 2 XXXX XXXX | 📱 WhatsApp: +56 9 XXXX XXXX</p>
              <p>🌐 www.muebleriasanbernardo.cl | ✉️ contacto@muebleriasanbernardo.cl</p>
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #e9ecef;">
              <p>© 2024 Mueblería San Bernardo. Todos los derechos reservados.</p>
              <p style="margin-top: 15px; font-size: 11px; color: #999;">
                Si no deseas recibir estos correos, puedes <a href="#" style="color: #2563eb;">darte de baja aquí</a>.
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    // Preparar el email usando nodemailer
    const mailOptions = {
      from: {
        name: "Mueblería San Bernardo",
        address: process.env.EMAIL_USER || ""
      },
      to: to,
      subject: subject,
      html: htmlTemplate
    }

    try {
      const info = await transporter.sendMail(mailOptions)
      
      // Guardar en base de datos
      await saveSentEmail({
        to,
        subject,
        message,
        type,
        messageId: info.messageId,
        status: 'sent'
      })

      return {
        success: true,
        messageId: info.messageId,
        message: "Correo enviado exitosamente"
      }
    } catch (error) {
      console.error("Error enviando correo:", error)
      
      // Guardar error en base de datos
      await saveSentEmail({
        to,
        subject,
        message,
        type,
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : "Error desconocido"
      })

      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido al enviar correo"
      }
    }
  } catch (error) {
    console.error("Error en sendEmail:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido"
    }
  }
}

export async function sendBulkEmail(data: {
  recipients: string[]
  subject: string
  message: string
  type: "promocion" | "notificacion" | "newsletter"
}): Promise<EmailResponse> {
  try {
    const { recipients, subject, message, type } = data

    // Validar que hay destinatarios
    if (!recipients || recipients.length === 0) {
      return { success: false, error: "No hay destinatarios especificados" }
    }

    // Validar emails
    const validEmails = recipients.filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))

    if (validEmails.length === 0) {
      return { success: false, error: "No hay emails válidos en la lista" }
    }

    const results: BulkEmailResult[] = []
    let successCount = 0
    let errorCount = 0

    console.log(`Iniciando envío masivo a ${validEmails.length} destinatarios...`)

    // Enviar correos uno por uno con un delay para evitar límites de Gmail
    for (let i = 0; i < validEmails.length; i++) {
      const email = validEmails[i]
      
      try {
        console.log(`Enviando correo ${i + 1}/${validEmails.length} a ${email}`)
        
        // Usar nodemailer directamente para el envío masivo
        const mailOptions = {
          from: {
            name: "Mueblería San Bernardo",
            address: process.env.EMAIL_USER || ""
          },
          to: email,
          subject: subject,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${subject}</title>
                <style>
                  body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    line-height: 1.6; 
                    color: #333; 
                    margin: 0; 
                    padding: 0; 
                    background-color: #f4f4f4;
                  }
                  .container { 
                    max-width: 600px; 
                    margin: 20px auto; 
                    background: white; 
                    border-radius: 10px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                  }
                  .header { 
                    background: linear-gradient(135deg, #2563eb, #1d4ed8); 
                    color: white; 
                    padding: 40px 20px; 
                    text-align: center; 
                  }
                  .header h1 { 
                    margin: 0; 
                    font-size: 28px; 
                    font-weight: 600;
                  }
                  .content { 
                    padding: 40px 30px; 
                    background: white; 
                  }
                  .content p { 
                    margin-bottom: 15px; 
                    font-size: 16px;
                  }
                  .footer { 
                    padding: 30px 20px; 
                    text-align: center; 
                    font-size: 12px; 
                    color: #666; 
                    background: #f8f9fa; 
                    border-top: 1px solid #e9ecef;
                  }
                  .btn { 
                    display: inline-block; 
                    padding: 12px 24px; 
                    background: #2563eb; 
                    color: white; 
                    text-decoration: none; 
                    border-radius: 6px; 
                    margin: 15px 0; 
                    font-weight: 500;
                  }
                  .highlight {
                    background: #f0f9ff;
                    padding: 20px;
                    border-left: 4px solid #2563eb;
                    margin: 20px 0;
                    border-radius: 0 6px 6px 0;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>🪑 Mueblería San Bernardo</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">Tu tienda de muebles de confianza</p>
                  </div>
                  <div class="content">
                    <div class="highlight">
                      ${message.replace(/\n/g, "<br>")}
                    </div>
                  </div>
                  <div class="footer">
                    <p><strong>Mueblería San Bernardo</strong></p>
                    <p>📍 San Bernardo, Región Metropolitana, Chile</p>
                    <p>📞 Teléfono: +56 2 XXXX XXXX | 📱 WhatsApp: +56 9 XXXX XXXX</p>
                    <p>🌐 www.muebleriasanbernardo.cl | ✉️ contacto@muebleriasanbernardo.cl</p>
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #e9ecef;">
                    <p>© ${new Date().getFullYear()} Mueblería San Bernardo. Todos los derechos reservados.</p>
                    <p style="margin-top: 15px; font-size: 11px; color: #999;">
                      Si no deseas recibir estos correos, puedes <a href="#" style="color: #2563eb;">darte de baja aquí</a>.
                    </p>
                  </div>
                </div>
              </body>
            </html>
          `,
          text: message
        }

        const info = await transporter.sendMail(mailOptions)
        results.push({
          email,
          success: true,
          messageId: info.messageId
        })
        successCount++

        // Esperar 1 segundo entre envíos para evitar límites de Gmail
        if (i < validEmails.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }

      } catch (error) {
        console.error(`Error enviando a ${email}:`, error)
        results.push({
          email,
          success: false,
          error: error instanceof Error ? error.message : "Error desconocido"
        })
        errorCount++
      }
    }

    return {
      success: true,
      results,
      summary: {
        total: validEmails.length,
        success: successCount,
        errors: errorCount
      }
    }
  } catch (error) {
    console.error("Error en envío masivo:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido al enviar correos masivos"
    }
  }
}

export async function sendTestEmail(): Promise<EmailResponse> {
  try {
    const testData = {
      to: process.env.EMAIL_USER || "test@example.com",
      subject: "Test de Email - Mueblería San Bernardo",
      message: "Este es un correo de prueba para verificar que el sistema de emails funciona correctamente.",
      type: "test" as const
    }

    return await sendEmail(testData)
  } catch (error) {
    console.error("Error en sendTestEmail:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido en test de email"
    }
  }
}

export async function getEmailTemplates(): Promise<{
  promocion: { subject: string; message: string }
  notificacion: { subject: string; message: string }
  newsletter: { subject: string; message: string }
}> {
  return {
    promocion: {
      subject: "¡Ofertas Especiales en Mueblería San Bernardo! 🪑",
      message: `
        ¡Hola! 👋
        
        Tenemos ofertas increíbles para ti:
        
        🛋️ Sofás con hasta 30% de descuento
        🛏️ Dormitorios completos desde $299.990
        🪑 Mesas de comedor con 4 sillas incluidas
        🗄️ Muebles de oficina con envío gratis
        
        ¡No te pierdas estas ofertas por tiempo limitado!
        
        Visítanos en nuestra tienda o contáctanos para más información.
        
        Saludos,
        Equipo Mueblería San Bernardo
      `
    },
    notificacion: {
      subject: "Actualización Importante - Mueblería San Bernardo",
      message: `
        Estimado cliente,
        
        Te informamos sobre importantes actualizaciones:
        
        📦 Tu pedido está siendo procesado
        🚚 Envío programado para la próxima semana
        📞 Contacto disponible para consultas
        
        Gracias por confiar en nosotros.
        
        Saludos cordiales,
        Mueblería San Bernardo
      `
    },
    newsletter: {
      subject: "Newsletter Mensual - Mueblería San Bernardo",
      message: `
        ¡Bienvenido a nuestro newsletter mensual! 📧
        
        En este mes:
        
        🆕 Nuevos productos llegaron a nuestra tienda
        💡 Ideas de decoración para tu hogar
        🎉 Eventos especiales y promociones
        📸 Galería de proyectos realizados
        
        ¡Mantente al día con las últimas tendencias en muebles!
        
        Saludos,
        Equipo Mueblería San Bernardo
      `
    }
  }
}
