import nodemailer from 'nodemailer'

export const sendEmail = async ({ to, subject, html, text }) => {
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT || 587
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const fromEmail = process.env.SMTP_FROM || '"CivicLens AI" <noreply@civiclens.ai>'

  // If real SMTP credentials exist in .env, send actual email
  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort),
        secure: parseInt(smtpPort) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      })

      const info = await transporter.sendMail({
        from: fromEmail,
        to,
        subject,
        text,
        html,
      })

      console.log(`📧 Transactional email sent to ${to}: Message ID ${info.messageId}`)
      return { success: true, messageId: info.messageId }
    } catch (err) {
      console.error(`⚠️ Failed to send SMTP email to ${to}:`, err.message)
    }
  }

  // Local Dev Fallback (Console notification logging)
  console.log('---------------------------------------------------------')
  console.log(`📧 [MOCK EMAIL DISPATCH]`)
  console.log(`TO: ${to}`)
  console.log(`SUBJECT: ${subject}`)
  console.log(`BODY:\n${text || html}`)
  console.log('---------------------------------------------------------')

  return { success: true, mocked: true }
}
