import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Code2, Palette, Video, TrendingUp } from 'lucide-react';

const highlights = [
  { icon: Code2, label: 'Tech-Savvy', color: 'text-primary' },
  { icon: Palette, label: 'Creative', color: 'text-secondary' },
  { icon: Video, label: 'Visual Storyteller', color: 'text-primary' },
  { icon: TrendingUp, label: 'Results-Driven', color: 'text-secondary' },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div ref={ref} className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm font-medium tracking-widest uppercase mb-4 block">
              About Me
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Bridging <span className="text-gradient">Technology</span> & <span className="text-gradient">Creativity</span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <p className="text-lg text-muted-foreground leading-relaxed">
                I'm a <span className="text-foreground font-medium">Computer Science student</span> with a deep passion for creative design and digital storytelling. My journey combines technical expertise with artistic vision, allowing me to create solutions that are both functional and visually compelling.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                With certifications in <span className="text-primary">Graphic Design</span>, <span className="text-secondary">Video Editing</span>, <span className="text-primary">Digital Marketing</span>, and <span className="text-secondary">Brand Identity Design</span>, I bring a unique perspective to every project—understanding both the technical foundations and the creative elements that make digital experiences memorable.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                My goal is to build impactful digital experiences that merge innovation with aesthetics, helping brands tell their stories in the most engaging way possible.
              </p>
            </motion.div>

            {/* Highlights Grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 gap-4"
            >
              {highlights.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="glass p-6 rounded-2xl text-center group cursor-default"
                >
                  <item.icon className={`w-10 h-10 mx-auto mb-4 ${item.color} group-hover:scale-110 transition-transform duration-300`} />
                  <span className="text-foreground font-medium">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
