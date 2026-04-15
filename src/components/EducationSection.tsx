import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SectionPageTitle } from "@/components/SectionPageTitle";
import { GraduationCap } from "lucide-react";

const education: {
  institution: string;
  location: string;
  degree?: string;
  period?: string;
}[] = [
  {
    institution: "Colegio Universitario de San Juan",
    location: "San Juan, Puerto Rico",
  },
];

const EducationSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="education" className="py-32 relative" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <SectionPageTitle kicker="Education">
            Academic <span className="gradient-text">Background</span>
          </SectionPageTitle>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          {education.map((item, i) => (
            <motion.div
              key={item.institution}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="p-6 md:p-8 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-500"
            >
              <div className="flex gap-4">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <GraduationCap className="w-6 h-6" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-1">{item.institution}</h3>
                  <p className="text-primary font-medium text-sm mb-2">{item.location}</p>
                  {item.degree && (
                    <p className="text-muted-foreground text-sm leading-relaxed mb-1">{item.degree}</p>
                  )}
                  {item.period && (
                    <p className="text-muted-foreground text-sm font-mono">{item.period}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
