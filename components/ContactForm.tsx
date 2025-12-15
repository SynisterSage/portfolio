import React, { useEffect, useState } from 'react';
import { Send, Check, Loader2, Github, Linkedin, Instagram } from 'lucide-react';

const FORM_ENDPOINT = 'https://formsubmit.co/ajax/afergyy@gmail.com';
const RATE_LIMIT_MS = 60 * 1000;

type FormState = {
  name: string;
  email: string;
  message: string;
};

const ContactForm: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState<FormState>({ name: '', email: '', message: '' });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [rateLimitUntil, setRateLimitUntil] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);

  const isSubmitting = status === 'sending';
  const isSuccess = status === 'success';
  const isRateLimited = countdown > 0;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    const now = Date.now();
    if (rateLimitUntil && now < rateLimitUntil) {
      setStatus('error');
      setErrorMessage('Please wait before sending another message.');
      return;
    }

    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          _subject: 'New message from portfolio site',
          _captcha: 'false',
          _template: 'table'
        })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || 'Unable to send the form right now.');
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setRateLimitUntil(Date.now() + RATE_LIMIT_MS);

      setTimeout(() => {
        setStatus('idle');
      }, 2500);
    } catch (error) {
      console.error('Contact form submission failed', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unexpected error occurred.');
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!rateLimitUntil) {
      setCountdown(0);
      return;
    }

    const tick = () => {
      const now = Date.now();
      if (now >= rateLimitUntil) {
        setRateLimitUntil(null);
        setCountdown(0);
        setStatus('idle');
        setErrorMessage('');
        return;
      }
      setCountdown(Math.ceil((rateLimitUntil - now) / 1000));
    };

    tick();
    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [rateLimitUntil]);

  return (
    <div className="relative">
      <div className={`transition-all duration-500 ease-in-out ${isSuccess ? 'opacity-0 scale-95 pointer-events-none blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5 text-[10px] uppercase font-bold text-secondary tracking-wider">
              Name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                disabled={isSubmitting}
                className="w-full bg-black/5 dark:bg-white/5 border border-node-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-secondary/30 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-[10px] uppercase font-bold text-secondary tracking-wider">
              Email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
                disabled={isSubmitting}
                className="w-full bg-black/5 dark:bg-white/5 border border-node-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-secondary/30 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5 text-[10px] uppercase font-bold text-secondary tracking-wider">
            Message
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell me about your project..."
              required
              rows={4}
              disabled={isSubmitting}
              className="w-full bg-black/5 dark:bg-white/5 border border-node-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all resize-none placeholder:text-secondary/30 custom-scroll disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </label>

          {status === 'error' && (
            <p className="text-rose-400 text-sm font-mono">{errorMessage || 'Something went wrong. Try again.'}</p>
          )}
          {countdown > 0 && (
            <p className="text-xs font-mono uppercase tracking-wider text-secondary">
              Next submission in {countdown}s
            </p>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-4">
              <a href="#" className="text-secondary hover:text-primary transition-colors hover:scale-110 transform duration-200" title="GitHub">
                <Github size={20} />
              </a>
              <a href="#" className="text-secondary hover:text-blue-500 transition-colors hover:scale-110 transform duration-200" title="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-secondary hover:text-pink-500 transition-colors hover:scale-110 transform duration-200" title="Instagram">
                <Instagram size={20} />
              </a>
            </div>

            <button
              type="submit"
            disabled={isSubmitting || isRateLimited}
            className="bg-primary text-canvas-bg hover:bg-accent hover:text-white disabled:opacity-50 disabled:hover:bg-primary px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg cursor-pointer disabled:cursor-not-allowed"
          >
              {isSubmitting ? (
                <>
                  <span>Sending</span>
                  <Loader2 size={14} className="animate-spin" />
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <Send size={14} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ease-out ${
          isSuccess ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center text-center p-6 bg-node-bg/90 backdrop-blur-md rounded-xl border border-node-border shadow-2xl transform transition-transform">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-canvas-bg mb-4 shadow-lg ring-4 ring-accent/20">
            <Check size={32} strokeWidth={3} />
          </div>
          <h3 className="text-2xl font-bold text-primary mb-2">Message Sent!</h3>
          <p className="text-secondary text-sm max-w-[200px] leading-relaxed">
            Thanks for reaching out. I will respond within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
