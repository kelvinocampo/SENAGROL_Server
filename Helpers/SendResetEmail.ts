import { TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo';

export interface DataEmail {
    token: string,
    email: string,
}

const BREVO_KEY = process.env.BREVO_KEY || "";
const FRONTEND_URL = process.env.FRONTEND_URL;

const brevoApi = new TransactionalEmailsApi();
brevoApi.setApiKey(0, BREVO_KEY);

export async function sendResetEmail(dataEmail: DataEmail) {
    try {
        const resetLink = `${FRONTEND_URL}/reset-password?token=${dataEmail.token}`;

        const sendSmtpEmail: SendSmtpEmail = {
            subject: "Recuperación de contraseña",
            sender: {
                name: "SENAGROL",
                email: "kevinocampooso@gmail.com"
            },
            to: [{ email: dataEmail.email }],
            htmlContent: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        .button {
                            background-color: #4CAF50;
                            border: none;
                            color: white;
                            padding: 15px 32px;
                            text-align: center;
                            text-decoration: none;
                            display: inline-block;
                            font-size: 16px;
                            margin: 20px 0;
                            cursor: pointer;
                            border-radius: 5px;
                        }
                    </style>
                </head>
                <body>
                    <h2>Recupera tu contraseña</h2>
                    <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
                    <a href="${resetLink}" class="button">Restablecer contraseña</a>
                    <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
                    <p><small>Este enlace expirará en 1 hora.</small></p>
                </body>
                </html>
            `,
            textContent: `Para restablecer tu contraseña, visita: ${resetLink}`
        };

        // Enviar email
        const response = await brevoApi.sendTransacEmail(sendSmtpEmail);
        return true;

    } catch (error) {
        console.error('Error al enviar email con Brevo:', error);
        throw new Error('Error al enviar email de recuperación');
    }
}