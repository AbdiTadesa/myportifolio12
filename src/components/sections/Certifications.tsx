import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Award, CheckCircle } from 'lucide-react';

const certifications = [
  {
    title: 'Graphic Designing',
    issuer: 'Professional Certification',
    description: 'Comprehensive training in visual design principles and industry-standard tools',
  },
  {
    title: 'Video Editing',
    issuer: 'Professional Certification',
    description: 'Advanced video post-production and motion graphics expertise',
  },
  {
    title: 'Digital Marketing',
    issuer: 'Professional Certification',
    description: 'Strategic marketing, analytics, and campaign management',
  },
  {
    title: 'Logo Designing',
    issuer: 'Professional Certification',
    description: 'Brand identity creation and visual storytelling mastery',
  },
  {
    title: 'Poster Designing',
    issuer: 'Professional Certification',
    description: 'Print and digital visual composition techniques',
  },
];

export default function Certifications() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="certifications" className="py-32 relative">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6">
        <div ref={ref} className="max-w-4xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm font-medium tracking-widest uppercase mb-4 block">
              Certifications
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Professional <span className="text-gradient">Credentials</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Certified expertise across creative and technical domains
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-primary transform md:-translate-x-1/2" />

            {certifications.map((cert, index) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Dot */}
                <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background transform md:-translate-x-1/2 glow-primary z-10" />

                {/* Content */}
                <div className={`ml-8 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="glass p-6 rounded-2xl group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <Award className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-display font-semibold text-foreground">
                            {cert.title}
                          </h3>
                          <CheckCircle className="w-4 h-4 text-primary" />
                        </div>
                        <p className="text-sm text-primary mb-2">{cert.issuer}</p>
                        <p className="text-sm text-muted-foreground">{cert.description}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
