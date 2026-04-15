import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { SectionPageTitle } from "@/components/SectionPageTitle";

const stats = [
  { value: "10+", label: "Years Experience" },
  { value: "10+", label: "Happy Clients" },
  { value: "15+", label: "Projects Delivered" },
  { value: "5", label: "Awards Won" },
];

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-32 relative" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-primary" />
            <span className="text-primary font-mono text-sm tracking-wider uppercase">About Me</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-foreground">
            A Bit <span className="gradient-text">About How I Work</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="max-w-5xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <p className="text-muted-foreground leading-relaxed">
              I'm a full stack and AI engineer who cares about clear architecture, maintainable code, and
              products people actually use. Currently at <span className="text-primary font-semibold">RadCrew</span>,
              I build features across the stack — from APIs and data layers to polished UIs — and ship
              LLM-powered experiences where they add real value. I enjoy owning problems end to end:
              discovery, implementation, observability, and iteration.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              On the AI side, I've worked with RAG, prompt design, guardrails, and production LLM APIs —
              always with an eye on latency, cost, and reliability. On the application side, I'm comfortable
              in TypeScript-heavy frontends, Node services, and cloud-native deployments. When I'm not
              shipping code, I'm reading about new model capabilities, developer tooling, and better ways
              to test and ship software.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="p-6 rounded-xl bg-card border border-border text-center hover:border-primary/50 transition-colors duration-300"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary text-glow mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
