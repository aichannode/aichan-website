import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import flashLaunchThumb from "@/assets/flash-launch.png";
import tvtFrontendThumb from "@/assets/tvt-frontend.png";
import tokenTool from "@/assets/token-tool.png";
import circularRing from "@/assets/circular-ring.png";
import aptosFamousFoxThumb from "@/assets/aptos-famous-fox.png";

const projects = [
  {
    title: "Flash Launch",
    description:
      "No-code decentralized launchpad for token creation, presales, and fair launches—with KYC and investor-focused tooling.",
    tags: ["Next.js", "TypeScript", "Node.js", "EVM"],
    color: "from-primary/20 to-accent/10",
    image: flashLaunchThumb,
    link: "https://flash-launch.com",
    github: "https://github.com/aichannode/Flash-Launch/",
  },
  {
    title: "TokenTool.io",
    description:
      "Create and deploy ERC20 and Solana SPL tokens in minutes—EVM chains plus Solana, with Raydium liquidity tooling.",
    tags: ["Next.js", "TypeScript", "Solana", "EVM"],
    color: "from-accent/15 to-primary/20",
    image: tokenTool,
    link: "https://www.tokentool.io/",
    github: "https://github.com/aichannode/TokenTool",
  },
  {
    title: "Aptos — Famous Fox Federation",
    description:
      "Utility suite for Famous Fox Federation on Aptos—NFT mint, bulk send, peer-to-peer swap, bulk list/delist, and related NFT workflows.",
    tags: ["Next.js", "TypeScript", "Aptos", "NFT"],
    color: "from-accent/20 to-primary/10",
    image: aptosFamousFoxThumb,
    link: "https://aptos.famousfoxes.com/",
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
    tags: ["React", "TypeScript", "Material Tailwind"],
    color: "from-accent/20 to-primary/10",
    image: tvtFrontendThumb,
    link: "https://tvt-front.vercel.app/",
    github: "https://github.com/aichannode/TVT-Front",
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
  {
    title: "Circular Ring",
    description:
      "React Native mobile app—native UI and performance on iOS and Android from a single codebase.",
    tags: ["React Native", "TypeScript", "Mobile"],
    color: "from-primary/10 to-accent/20",
    image: circularRing,
    link: "https://play.google.com/store/apps/details?id=xyz.circular.circular&hl=en_US&pli=1",
    github: "https://github.com/aichannode/circular-ring",
  },
];

const isLiveProjectLink = (url: string) => url.startsWith("http://") || url.startsWith("https://");

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
          {projects.map((project, i) => {
            const live = isLiveProjectLink(project.link);
            const shellClass = `h-40 flex items-center justify-center relative overflow-hidden shrink-0 ${project.image ? "" : `bg-gradient-to-br ${project.color}`}`;
            const thumbnailInner = (
              <>
                {project.image ? (
                  <>
                    <img
                      src={project.image}
                      alt=""
                      className={`absolute inset-0 w-full h-full object-cover ${live ? "transition-transform duration-500 group-hover:scale-[1.03]" : ""}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/20 to-transparent pointer-events-none" />
                  </>
                ) : (
                  <div className="text-4xl font-bold text-primary/30 group-hover:text-primary/50 transition-colors font-mono">
                    {`0${i + 1}`}
                  </div>
                )}
              </>
            );

            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="group rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-500 overflow-hidden flex flex-col"
              >
                {live ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${shellClass} cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset`}
                    aria-label={`Open ${project.title}`}
                  >
                    {thumbnailInner}
                  </a>
                ) : (
                  <div className={shellClass}>{thumbnailInner}</div>
                )}
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
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
