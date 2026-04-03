import { Resend } from 'resend';

// Inizializza Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export { resend };
