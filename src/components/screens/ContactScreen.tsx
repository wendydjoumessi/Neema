import { useState } from 'react';
import { Mail, ArrowLeft, Send, CheckCircle, Clock, Phone } from 'lucide-react';
import logo from '@/assets/logo.png';
import { cn } from '@/lib/utils';
import { OutlineButton } from '@/neema/ui';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

interface ContactScreenProps {
  onBack: () => void;
}

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  subject: z.string().trim().min(1, "Subject is required").max(200, "Subject must be less than 200 characters"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000, "Message must be less than 2000 characters")
});


const inputCls = 'w-full rounded-xl border border-neema-border bg-white px-4 text-base text-neema-ink placeholder:text-neema-muted transition-colors duration-150 focus:border-neema-primary focus:outline-none focus:ring-2 focus:ring-neema-primary/30';

export function ContactScreen({ onBack }: ContactScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form data
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        },
      });

      if (error) throw error;
      
      setIsSubmitted(true);
      toast({
        title: "Message sent!",
        description: "We'll get back to you within 24-48 hours.",
      });
    } catch (error: any) {
      console.error('Contact form error:', error);
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitted(false);
    setErrors({});
  };

  const field = (name: keyof typeof formData, label: string, placeholder: string, type = 'text') => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-[13px] font-semibold text-neema-ink">{label}</label>
      {name === 'message' ? (
        <textarea id={name} name={name} rows={6} value={formData[name]} onChange={handleInputChange} placeholder={placeholder}
          aria-invalid={!!errors[name]}
          className={cn(inputCls, 'py-3', errors[name] && 'border-neema-sos')} />
      ) : (
        <input id={name} name={name} type={type} value={formData[name]} onChange={handleInputChange} placeholder={placeholder}
          aria-invalid={!!errors[name]}
          className={cn(inputCls, 'min-h-[52px]', errors[name] && 'border-neema-sos')} />
      )}
      {errors[name] && <p className="text-sm font-medium text-neema-sos">{errors[name]}</p>}
    </div>
  );

  const info = [
    { Icon: Mail, title: 'Email us', text: <a href="mailto:fortunelekane61@gmail.com" className="break-all font-semibold text-neema-dark underline-offset-2 hover:underline">fortunelekane61@gmail.com</a>, tint: 'bg-neema-primary-soft text-neema-dark' },
    { Icon: Clock, title: 'Response time', text: 'We usually reply within 24–48 hours.', tint: 'bg-neema-ochre-soft text-neema-ochre-ink' },
    { Icon: Phone, title: 'Support hours', text: 'Monday – Friday, 9:00 – 18:00 (WAT)', tint: 'bg-neema-success-soft text-neema-success-ink' },
  ];

  return (
    <div className="min-h-screen bg-neema-cream font-sans text-base text-neema-ink">
      <header className="sticky top-0 z-40 border-b border-neema-line bg-neema-cream">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-5 py-2 md:px-10">
          <button type="button" onClick={onBack} className="flex min-h-[48px] items-center gap-1.5 rounded-full px-3 font-semibold text-neema-dark transition-colors duration-150 hover:bg-neema-sand">
            <ArrowLeft className="h-5 w-5" /> Back
          </button>
          <img src={logo} alt="Neema — Care for Every Stage" className="h-14 w-auto" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 py-10 md:px-10 md:py-16">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full bg-neema-primary-soft px-4 py-1.5 text-[13px] font-semibold text-neema-dark">Get in touch</span>
          <h1 className="text-3xl font-bold leading-tight text-neema-ink md:text-4xl">We’d love to hear from you</h1>
          <p className="mt-3 text-lg text-neema-muted-strong">Questions, feedback or ideas for Neema? Send us a message and we’ll reply by email.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-4">
            {info.map(({ Icon, title, text, tint }) => (
              <section key={title} className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-neema-card">
                <span className={cn('flex h-12 w-12 flex-none items-center justify-center rounded-xl', tint)}><Icon className="h-6 w-6" /></span>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold leading-6">{title}</h2>
                  <div className="mt-0.5 text-neema-muted-strong">{text}</div>
                </div>
              </section>
            ))}
            <a href="tel:119" className="flex min-h-[48px] items-center justify-center gap-2 rounded-full border-[1.5px] border-neema-sos bg-neema-sos-soft px-5 font-semibold text-neema-sos">
              <Phone className="h-5 w-5" /> Emergency? Call 119 (SAMU)
            </a>
          </div>

          <section className="rounded-2xl bg-white p-5 shadow-neema-card md:p-8 lg:col-span-2">
            {isSubmitted ? (
              <div className="flex flex-col items-center py-10 text-center">
                <span className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-neema-success-soft text-neema-success-ink">
                  <CheckCircle className="h-10 w-10" />
                </span>
                <h2 className="text-2xl font-bold">Message sent</h2>
                <p className="mt-2 max-w-sm text-neema-muted-strong">Thank you for reaching out. We’ll reply to the email address you gave us.</p>
                <OutlineButton onClick={resetForm} className="mt-6 max-w-xs">Send another message</OutlineButton>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                <div>
                  <h2 className="text-2xl font-bold">Send us a message</h2>
                  <p className="mt-1 text-neema-muted-strong">All fields are required.</p>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  {field('name', 'Your name', 'e.g. Amina Fouda')}
                  {field('email', 'Email address', 'you@example.com', 'email')}
                </div>
                {field('subject', 'Subject', 'How can we help?')}
                {field('message', 'Message', 'Tell us more…')}
                <button type="submit" disabled={isSubmitting} className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-xl bg-neema-dark px-4 font-semibold text-white transition-transform duration-150 active:scale-[0.98] disabled:opacity-60">
                  {isSubmitting ? (
                    <><span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Sending…</>
                  ) : (
                    <><Send className="h-5 w-5" /> Send message</>
                  )}
                </button>
              </form>
            )}
          </section>
        </div>
      </main>

      <footer className="border-t border-neema-line bg-white py-8">
        <p className="px-5 text-center text-sm text-neema-muted-strong">© 2026 Neema. Educational information only — always consult a qualified health worker.</p>
      </footer>
    </div>
  );
}
