import { json } from '@sveltejs/kit';
import { Resend } from 'resend';
import { z } from 'zod';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000, 'Message is too long')
});

export async function POST({ request }) {
  try {
    const body = await request.json();

    // Validate the form data
    const validatedData = contactFormSchema.parse(body);

    if (!resend) {
      return json(
        { error: 'Resend API key is not configured.' },
        { status: 500 }
      );
    }

    // Send email using Resend
    const result = await resend.emails.send({
      from: 'Portfolio Contact <noreply@solanke.dev>',
      to: 'contact@solankea.dev',
      replyTo: validatedData.email,
      subject: `New Portfolio Message from ${validatedData.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Message:</strong></p>
        <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
      `
    });

    if (result.error) {
      console.error('Resend error:', result.error);
      return json(
        { error: 'Failed to send email. Please try again.' },
        { status: 500 }
      );
    }

    // Send confirmation email to user
    await resend.emails.send({
      from: 'Portfolio <noreply@solanke.dev>',
      to: validatedData.email,
      subject: 'Message Received - Thank You!',
      html: `
        <h2>Thank You, ${validatedData.name}!</h2>
        <p>I received your message and will get back to you as soon as possible.</p>
        <p>In the meantime, feel free to check out my work at <a href="https://solanke.dev">solanke.dev</a></p>
        <hr>
        <p><strong>Your message:</strong></p>
        <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
      `
    });

    return json(
      { 
        success: true, 
        message: 'Email sent successfully! I\'ll get back to you soon.' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);

    if (error instanceof z.ZodError) {
      const validationErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return json(
        { error: 'Validation error', details: validationErrors },
        { status: 400 }
      );
    }

    return json(
      { error: 'An error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
