export const emailTemplates = {
  verificationEmail: (name: string, token: string) => `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Hola ${name},</h2>
      <p>Gracias por registrarte en Movie App. Por favor verifica tu correo electrónico dando clic en el siguiente enlace:</p>
      <a href="${process.env.FRONTEND_URL}/verify-email?token=${token}" target="_blank" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none;">Verificar correo</a>
      <p>Si no creaste esta cuenta, puedes ignorar este correo.</p>
    </div>
  `
};
