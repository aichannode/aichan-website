import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "Flash Launch",
    description:
      "No-code decentralized launchpad for token creation, presales, and fair launches—with KYC and investor-focused tooling.",
    tags: ["Next.js", "TypeScript", "Node.js", "EVM"],
    color: "from-primary/20 to-accent/10",
    link: "https://flash-launch.com",
    github: "https://github.com/squirdev/Flash-Launch/",
  },
  {
    title: "Solana NFT Marketplace",
    description: "Full-featured NFT marketplace on Solana with auction mechanics, collection analytics, and real-time price feeds.",
    tags: ["Rust", "Anchor", "Next.js", "Metaplex"],
    color: "from-accent/20 to-primary/10",
    link: "#",
    github: "#",
  },
  {
    title: "AI Trading Assistant",
    description: "LLM-powered trading bot that analyzes on-chain data, sentiment, and technical indicators to provide actionable insights.",
    tags: ["Python", "LangChain", "OpenAI", "Web3.py"],
    color: "from-primary/20 to-primary/5",
    link: "#",
    github: "#",
  },
  {
    title: "Track Verify Trust",
    description: "Blockchain-based supply chain tracking platform on Solana, enabling transparent product verification for consumers and businesses.",
    tags: ["Solana", "React", "TypeScript", "Anchor"],
    color: "from-accent/20 to-primary/10",
    link: "https://tvt-front.vercel.app/",
    github: "https://github.com/squirdev/TVT-Front",
  },
  {
    title: "RAG Knowledge Base",
    description: "Enterprise-grade RAG system with custom embeddings, multi-modal document processing, and conversational retrieval.",
    tags: ["Python", "Pinecone", "FastAPI", "React"],
    color: "from-primary/15 to-accent/15",
    link: "#",
    github: "#",
  },
  {
    title: "Cross-Chain Bridge",
    description: "Trustless bridge protocol enabling asset transfers between EVM chains and Solana with optimistic verification.",
    tags: ["Solidity", "Rust", "TypeScript", "Wormhole"],
    color: "from-accent/15 to-primary/15",
    link: "#",
    github: "#",
  },
];

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-32 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-primary" />
            <span className="text-primary font-mono text-sm tracking-wider uppercase">Projects</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-foreground">
            Featured <span className="gradient-text">Work</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="group rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-500 overflow-hidden flex flex-col"
            >
              <div className={`h-40 bg-gradient-to-br ${project.color} flex items-center justify-center relative`}>
                <div className="text-4xl font-bold text-primary/30 group-hover:text-primary/50 transition-colors font-mono">
                  {`0${i + 1}`}
                </div>
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Github size={14} />
                  </a>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md bg-secondary text-xs font-mono text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
