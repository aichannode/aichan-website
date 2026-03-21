import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const experiences = [
  {
    role: "Blockchain & AI Engineer",
    company: "RadCrew",
    period: "2023 — Present",
    description: "Leading blockchain architecture and AI integration for startup products. Building smart contracts on EVM and Solana, and developing LLM-powered features.",
    current: true,
  },
  {
    role: "Senior Blockchain Developer",
    company: "Web3 Studio",
    period: "2021 — 2023",
    description: "Developed DeFi protocols and NFT platforms on multiple chains. Led a team of 4 engineers delivering production-grade dApps.",
    current: false,
  },
  {
    role: "Full Stack Developer",
    company: "TechForge",
    period: "2019 — 2021",
    description: "Built scalable web applications with React, Node.js, and cloud infrastructure. Transitioned into blockchain development.",
    current: false,
  },
];

const ExperienceSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" className="py-32 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-primary" />
            <span className="text-primary font-mono text-sm tracking-wider uppercase">Experience</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-foreground">
            Career <span className="gradient-text">Journey</span>
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-0">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 * i }}
              className="relative pl-8 pb-12 last:pb-0 border-l border-border group"
            >
              {/* Timeline dot */}
              <div
                className={`absolute left-0 top-1 w-3 h-3 rounded-full -translate-x-[7px] border-2 transition-colors duration-300 ${
                  exp.current
                    ? "bg-primary border-primary box-glow"
                    : "bg-background border-muted-foreground group-hover:border-primary"
                }`}
              />

              <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-500">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h3 className="text-lg font-bold text-foreground">{exp.role}</h3>
                  {exp.current && (
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-mono border border-primary/20">
                      Current
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-primary font-semibold text-sm">{exp.company}</span>
                  <span className="text-muted-foreground text-sm">•</span>
                  <span className="text-muted-foreground text-sm font-mono">{exp.period}</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{exp.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
