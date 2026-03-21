import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const skillCategories = [
  {
    title: "Blockchain",
    icon: "⛓️",
    skills: ["Solidity", "Rust (Solana)", "Anchor", "Hardhat", "Foundry", "Ethers.js", "Web3.js", "Wagmi"],
  },
  {
    title: "AI / LLM",
    icon: "🧠",
    skills: ["Python", "LangChain", "OpenAI API", "HuggingFace", "RAG", "Fine-tuning", "Vector DBs", "Prompt Engineering"],
  },
  {
    title: "Frontend",
    icon: "🎨",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Three.js", "Framer Motion"],
  },
  {
    title: "Backend & DevOps",
    icon: "⚙️",
    skills: ["Node.js", "PostgreSQL", "Redis", "Docker", "AWS", "GraphQL"],
  },
];

const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-32 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-primary" />
            <span className="text-primary font-mono text-sm tracking-wider uppercase">Skills</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-foreground">
            Tech <span className="gradient-text">Arsenal</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {skillCategories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 * i }}
              className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-500 group"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{cat.icon}</span>
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {cat.title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-mono border border-border hover:border-primary/40 hover:text-primary transition-all duration-300 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
