import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "10+", label: "Years Experience" },
  { value: "15+", label: "Happy Clients" },
  { value: "15+", label: "Projects Delivered" },
  { value: "5", label: "Awards Won" },
];

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-32 relative" ref={ref}>
      <div className="container mx-auto px-6">
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
            Crafting the <span className="gradient-text">Decentralized Future</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="max-w-5xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                I'm a passionate Blockchain and AI Engineer with deep expertise in EVM-compatible chains,
                Solana, and Large Language Models. Currently working at <span className="text-primary font-semibold">RadCrew</span>,
                I build cutting-edge decentralized applications and AI-powered solutions.
              </p>
              <p>
                From smart contract development and DeFi protocols to building intelligent
                AI agents, I thrive at the intersection of Web3 and artificial intelligence —
                creating technology that's both powerful and accessible.
              </p>
            </div>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                My journey spans from architecting complex on-chain systems on Ethereum and Solana
                to fine-tuning LLMs and building production-grade AI applications. I believe in
                writing clean, auditable code that stands the test of adversarial environments.
              </p>
              <p>
                When I'm not shipping code, I'm exploring the latest in zero-knowledge proofs,
                chain abstraction, and multi-modal AI systems.
              </p>
            </div>
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
