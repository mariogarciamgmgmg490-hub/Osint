import nodemailer from 'nodemailer';

export async function sendDocumentEmail(user) {
  const hasSMTP = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
  const subject = 'Constancia interna de expediente biométrico';
  const text = `Hola ${user.name},\n\nSe ha generado la constancia interna de tu expediente biométrico.\nDNI: ${user.dni}\nValor a recuperar: ${Number(user.recoveryAmount || 0).toLocaleString('es-ES')} euros\n\nEste es un documento interno generado por el sistema.`;

  if (!hasSMTP) {
    console.log('ENVÍO SIMULADO DE CORREO');
    console.log({ to: user.email, subject, text });
    return { simulated: true };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: user.email,
    subject,
    text
  });
  return { simulated: false };
}
