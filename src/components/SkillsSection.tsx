import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SectionPageTitle } from "@/components/SectionPageTitle";

const skillCategories = [
  {
    title: "Frontend",
    icon: "🎨",
    skills: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "React Native",
      "Tailwind CSS",
      "shadcn/ui",
      "TanStack Query",
      "Zustand",
      "React Hook Form"
    ],
  },
  {
    title: "Backend & DevOps",
    icon: "⚙️",
    skills: [
      "Node.js",
      "Django",
      "GraphQL",
      "MongoDB",
      "PostgreSQL",
      "Redis",
      "RabbitMQ",
      "Docker",
      "Kubernetes",
      "CI/CD",
      "AWS",
      "AWS Lambda",
      "GCP",
    ],
  },
  {
    title: "Blockchain & Protocols",
    icon: "⛓️",
    skills: [
      "Solidity",
      "Rust",
      "EVM",
      "Hardhat",
      "Wagmi",
      "Viem",
      "Solana",
      "Anchor",
      "Polkadot",
      "Substrate",
      "Cosmos",
      "ZK proofs",
      "Bittensor",
    ],
  },
  {
    title: "AI / LLM Systems",
    icon: "🧠",
    skills: [
      "Python",
      "LangChain (LangGraph, LangSmith)",
      "Prompt Engineering",
      "RAG",
      "Vector DBs",
      "Fine-tuning",
      "MCP",
      "AutoGen",
      "CrewAI",
      "n8n",
    ],
  },
];

const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-32 relative" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <SectionPageTitle kicker="Skills">
            Tech <span className="gradient-text">Arsenal</span>
          </SectionPageTitle>
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
