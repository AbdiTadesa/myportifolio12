import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Code, 
  Palette, 
  PenTool, 
  Layout, 
  Video, 
  TrendingUp,
  Layers,
  Sparkles
} from 'lucide-react';

const skills = [
  {
    icon: Code,
    title: 'Programming & Tech',
    description: 'Strong foundation in computer science, algorithms, and software development',
    color: 'from-primary to-primary/50',
    iconColor: 'text-primary',
  },
  {
    icon: Palette,
    title: 'Graphic Design',
    description: 'Creating visually stunning designs that communicate effectively',
    color: 'from-secondary to-secondary/50',
    iconColor: 'text-secondary',
  },
  {
    icon: PenTool,
    title: 'Logo Design',
    description: 'Crafting memorable brand identities that stand out',
    color: 'from-primary to-primary/50',
    iconColor: 'text-primary',
  },
  {
    icon: Layout,
    title: 'Poster Design',
    description: 'Eye-catching visual compositions for print and digital media',
    color: 'from-secondary to-secondary/50',
    iconColor: 'text-secondary',
  },
  {
    icon: Video,
    title: 'Video Editing',
    description: 'Professional motion graphics and video post-production',
    color: 'from-primary to-primary/50',
    iconColor: 'text-primary',
  },
  {
    icon: TrendingUp,
    title: 'Digital Marketing',
    description: 'Strategic campaigns that drive engagement and growth',
    color: 'from-secondary to-secondary/50',
    iconColor: 'text-secondary',
  },
];

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="skills" className="py-32 relative">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      
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
              Skills & Expertise
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              What I <span className="text-gradient">Bring</span> to the Table
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A diverse skill set that bridges the gap between technical development and creative design
            </p>
          </motion.div>

          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <div className="glass p-8 rounded-2xl h-full relative overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <skill.icon className={`w-7 h-7 ${skill.iconColor}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                    {skill.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {skill.description}
                  </p>

                  {/* Corner accent */}
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${skill.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-bl-full`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
