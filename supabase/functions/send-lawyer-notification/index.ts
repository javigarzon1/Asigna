import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Query {
  ritm: string;
  typology: string;
  isUrgent: boolean;
  deadline: string;
  status: string;
}

interface EmailRequest {
  lawyerName: string;
  lawyerEmail: string;
  queries: Query[];
  isAutomatic?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lawyerName, lawyerEmail, queries, isAutomatic = false }: EmailRequest = await req.json();

    console.log(`Sending notification to ${lawyerName} (${lawyerEmail}) for ${queries.length} queries`);

    // Email al letrado con las consultas asignadas
    const urgentQueries = queries.filter(q => q.isUrgent);
    const normalQueries = queries.filter(q => !q.isUrgent);

    const lawyerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">Nuevas Consultas Asignadas</h2>
        <p>Hola ${lawyerName},</p>
        <p>Se te han asignado <strong>${queries.length}</strong> nuevas consultas${isAutomatic ? ' (automático - consultas urgentes)' : ''}:</p>
        
        ${urgentQueries.length > 0 ? `
          <h3 style="color: #dc2626; margin-top: 20px;">⚠️ Consultas Urgentes (${urgentQueries.length})</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #fee2e2;">
                <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">RITM</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Tipología</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Plazo</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Estado</th>
              </tr>
            </thead>
            <tbody>
              ${urgentQueries.map(q => `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd;">${q.ritm}</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${q.typology}</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${new Date(q.deadline).toLocaleDateString('es-ES')}</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${q.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : ''}
        
        ${normalQueries.length > 0 ? `
          <h3 style="color: #1e40af; margin-top: 20px;">Consultas Normales (${normalQueries.length})</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #dbeafe;">
                <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">RITM</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Tipología</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Plazo</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Estado</th>
              </tr>
            </thead>
            <tbody>
              ${normalQueries.map(q => `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd;">${q.ritm}</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${q.typology}</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${new Date(q.deadline).toLocaleDateString('es-ES')}</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${q.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : ''}
        
        <p style="margin-top: 20px;">Por favor, revisa y gestiona estas consultas en el sistema.</p>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">Este es un correo automático, por favor no respondas.</p>
      </div>
    `;

    const lawyerEmailResponse = await resend.emails.send({
      from: "Sistema de Gestión <onboarding@resend.dev>",
      to: [lawyerEmail],
      subject: `${isAutomatic ? '⚠️ URGENTE - ' : ''}Nuevas Consultas Asignadas (${queries.length})`,
      html: lawyerEmailHtml,
    });

    console.log("Email sent to lawyer:", lawyerEmailResponse);

    // Emails de confirmación a Rocío y Andrea
    const confirmationEmails = [
      "rocio@example.com", // Cambiar por el email real de Rocío
      "andrea@example.com" // Cambiar por el email real de Andrea
    ];

    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">✓ Confirmación de Email Enviado</h2>
        <p>Se ha enviado correctamente una notificación a:</p>
        <ul>
          <li><strong>Letrado:</strong> ${lawyerName}</li>
          <li><strong>Email:</strong> ${lawyerEmail}</li>
          <li><strong>Consultas:</strong> ${queries.length} (${urgentQueries.length} urgentes)</li>
          <li><strong>Tipo:</strong> ${isAutomatic ? 'Envío automático por consultas urgentes' : 'Envío manual'}</li>
        </ul>
        
        <h3 style="margin-top: 20px;">Resumen de consultas enviadas:</h3>
        ${urgentQueries.length > 0 ? `<p style="color: #dc2626;">⚠️ <strong>Urgentes:</strong> ${urgentQueries.map(q => q.ritm).join(', ')}</p>` : ''}
        ${normalQueries.length > 0 ? `<p><strong>Normales:</strong> ${normalQueries.map(q => q.ritm).join(', ')}</p>` : ''}
        
        <p style="color: #666; font-size: 12px; margin-top: 30px;">Fecha y hora: ${new Date().toLocaleString('es-ES')}</p>
      </div>
    `;

    for (const email of confirmationEmails) {
      await resend.emails.send({
        from: "Sistema de Gestión <onboarding@resend.dev>",
        to: [email],
        subject: `Confirmación: Email enviado a ${lawyerName}`,
        html: confirmationHtml,
      });
    }

    console.log("Confirmation emails sent to Rocío and Andrea");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Emails enviados correctamente",
        lawyerEmail: lawyerEmail,
        confirmationEmails: confirmationEmails
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-lawyer-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
