import { motion, useInView } from "framer-motion";
import { useRef, useState, type FormEvent } from "react";
import { SectionPageTitle } from "@/components/SectionPageTitle";
import { Loader2, Mail, MapPin, Send } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { env, isWeb3FormsConfigured } from "@/config/env";
import { useSocialProfile } from "@/hooks/useSocialProfile";

const WEB3FORMS_URL = "https://api.web3forms.com/submit";

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { profile } = useSocialProfile();
  const emailDisplay = profile.email?.trim() || "aichannode@gmail.com";
  const emailHref = emailDisplay.startsWith("mailto:") ? emailDisplay : `mailto:${emailDisplay}`;
  const locationDisplay = profile.location?.trim() || "Puerto Rico";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Missing information", {
        description: "Please enter your name, email, and message before sending.",
      });
      return;
    }

    if (!isWeb3FormsConfigured()) {
      toast.error("Form not configured", {
        description:
          process.env.NODE_ENV === "production"
            ? "Set NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY in Vercel → Settings → Environment Variables, then redeploy."
            : "Add NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY to your .env file (see .env.example).",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(WEB3FORMS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: env.web3formsAccessKey,
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          subject: `Portfolio contact from ${name.trim()}`,
        }),
      });

      const data = (await res.json()) as { success?: boolean; message?: string };

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Something went wrong.");
      }

      toast.success("Message sent", {
        description: "Thanks for reaching out — I'll reply as soon as I can.",
      });
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      const text = err instanceof Error ? err.message : "Failed to send. Try again or email directly.";
      toast.error("Could not send message", {
        description: text,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 relative" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <SectionPageTitle kicker="Contact" headingSpacingClassName="mb-6">
            {"Let's Build "}
            <span className="gradient-text">Together</span>
          </SectionPageTitle>

          <p className="text-muted-foreground text-lg mb-12 max-w-xl">
            Have a project in mind? Whether it's AI, product work, or full-stack — I'd love to hear about it.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="w-full max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-2 md:items-start gap-8 lg:gap-10">
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <a href={emailHref} className="text-foreground hover:text-primary transition-colors font-medium">
                    {emailDisplay.replace(/^mailto:/i, "")}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Location</div>
                  <div className="text-foreground font-medium">{locationDisplay}</div>
                </div>
              </div>

            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors disabled:opacity-60"
              />
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors disabled:opacity-60"
              />
              <textarea
                name="message"
                rows={4}
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="w-full px-6 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
