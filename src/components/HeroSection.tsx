import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { socialProfileFallback } from "@/data/social.fallback";
import { useSocialProfile } from "@/hooks/useSocialProfile";
import { cn } from "@/lib/utils";
import heroBgDark from "@/assets/hero-bg.jpg";
import heroBgLight from "@/assets/hero-bg-light.jpg";

const HeroSection = () => {
  const { theme } = useTheme();
  const { profile } = useSocialProfile();
  const fullname = profile.fullname?.trim() || socialProfileFallback.fullname!;
  const firstName = fullname.split(/\s+/)[0] || fullname;
  const role = profile.role?.trim() || socialProfileFallback.role!;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background: dark cyber (default) vs lighter art for light theme */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBgDark}
          alt=""
          aria-hidden
          className={cn(
            "absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500",
            theme === "dark" ? "opacity-[0.42] saturate-[1.08]" : "opacity-0",
          )}
        />
        <img
          src={heroBgLight}
          alt=""
          aria-hidden
          className={cn(
            "absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500",
            theme === "light" ? "opacity-[0.36] saturate-[1.06]" : "opacity-0",
          )}
        />
        {/* Edge blend into page — keeps the art visible in the middle instead of a flat white slab */}
        <div
          className="absolute inset-0 bg-[linear-gradient(to_bottom,hsl(var(--background))_0%,transparent_24%,transparent_76%,hsl(var(--background))_100%)] pointer-events-none transition-opacity duration-500"
          aria-hidden
        />
        {/* Soft radial behind headline for contrast without hiding the illustration */}
        <div
          className={cn(
            "absolute inset-0 pointer-events-none transition-opacity duration-500",
            theme === "light"
              ? "bg-[radial-gradient(ellipse_85%_55%_at_50%_42%,hsl(var(--background)_/_0.38),transparent_68%)]"
              : "bg-[radial-gradient(ellipse_85%_55%_at_50%_42%,hsl(var(--background)_/_0.45),transparent_68%)]",
          )}
          aria-hidden
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-secondary/50 mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
              <span className="text-sm text-muted-foreground font-mono">Available for new opportunities</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
          >
            <span className="text-foreground">Hi, I'm </span>
            <span className="gradient-text">{firstName}</span>
            <br />
            <span className="text-foreground text-4xl md:text-5xl lg:text-6xl">{role}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Building the future at the intersection of{" "}
            <span className="text-primary">EVM & Solana</span> ecosystems and{" "}
            <span className="text-accent">Large Language Models</span>.
            Currently engineering at <span className="text-foreground font-semibold">RadCrew</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex items-center justify-center gap-4 mb-12"
          >
            <a
              href="#projects"
              className="px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="px-8 py-3.5 rounded-lg border border-border text-foreground font-semibold hover:border-primary hover:text-primary transition-all duration-300"
            >
              Get In Touch
            </a>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
          <ArrowDown size={20} className="animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
