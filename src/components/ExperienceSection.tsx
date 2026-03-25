import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const experiences = [
  {
    role: "Full-Stack & LLM Engineer",
    company: "Copy.ai",
    period: "Oct 2024 – Feb 2026",
    current: true,
    summary:
      "Built and maintained GTM AI features—workflows, chat, and integrations—plus RAG with LangChain and Pinecone, prompt guardrails, and production LLM APIs with cost and latency tuning.",
  },
  {
    role: "Web3 Engineer",
    company: "Thorswap Finance",
    period: "Oct 2023 – Sep 2024",
    current: false,
    summary:
      "Worked on SwapKit and APIs for cross-chain swaps across many networks, integrating THORChain, Chainflip, and Maya, plus wallet flows and optional AML/KYT screening.",
  },
  {
    role: "Full-Stack & Blockchain Engineer",
    company: "Flash Technologies",
    period: "Mar 2021 – Oct 2023",
    current: false,
    summary:
      "Shipped DeFi products—token launches, presales, launchpads, and NFT utilities—with Solidity on EVM, Solana programs in Rust/Anchor, audit coordination (CertiK), and Slither-based analysis.",
  },
  {
    role: "Blockchain Developer",
    company: "ICICB",
    period: "Jan 2019 – Jul 2020",
    current: false,
    summary:
      "Delivered Web3 integrations and a React Native wallet, customized DEX-style platforms, trading automation, and NFT marketplaces and games.",
  },
  {
    role: "Web & Mobile Developer",
    company: "Beyond Finance",
    period: "Jan 2016 – Dec 2018",
    current: false,
    summary:
      "Built full-stack features for a consumer debt-resolution product on Node.js and AWS, React/Next.js dashboards, and a consolidated React Native app shipped to the App Store and Google Play.",
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

        <div className="max-w-4xl mx-auto space-y-0">
          {experiences.map((exp, i) => (
            <motion.div
              key={`${exp.company}-${exp.period}`}
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
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-primary font-semibold text-sm">{exp.company}</span>
                  <span className="text-muted-foreground text-sm">•</span>
                  <span className="text-muted-foreground text-sm font-mono">{exp.period}</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{exp.summary}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
