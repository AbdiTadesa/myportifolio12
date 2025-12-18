import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ExternalLink, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categories = ['All', 'Graphic Design', 'Logos', 'Posters', 'Video', 'Marketing'];

const projects = [
  {
    id: 1,
    title: 'Brand Identity System',
    category: 'Logos',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop',
    color: 'from-primary/80 to-secondary/80',
  },
  {
    id: 2,
    title: 'Tech Conference Poster',
    category: 'Posters',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
    color: 'from-secondary/80 to-primary/80',
  },
  {
    id: 3,
    title: 'Social Media Campaign',
    category: 'Marketing',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop',
    color: 'from-primary/80 to-secondary/80',
  },
  {
    id: 4,
    title: 'Product Showcase Video',
    category: 'Video',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=400&fit=crop',
    color: 'from-secondary/80 to-primary/80',
  },
  {
    id: 5,
    title: 'Creative Brochure Design',
    category: 'Graphic Design',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop',
    color: 'from-primary/80 to-secondary/80',
  },
  {
    id: 6,
    title: 'Startup Logo Collection',
    category: 'Logos',
    image: 'https://images.unsplash.com/photo-1636955779321-819753cd1741?w=600&h=400&fit=crop',
    color: 'from-secondary/80 to-primary/80',
  },
];

export default function Portfolio() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <section id="portfolio" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div ref={ref} className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-primary text-sm font-medium tracking-widest uppercase mb-4 block">
              Portfolio
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Featured <span className="text-gradient">Work</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A selection of projects showcasing my creative and technical capabilities
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className={activeCategory === category ? 'glow-primary' : ''}
              >
                {category}
              </Button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <motion.div 
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-2xl"
              >
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${project.color} opacity-0 group-hover:opacity-90 transition-all duration-500 flex flex-col items-center justify-center p-6`}>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    className="text-center"
                  >
                    <span className="text-xs uppercase tracking-widest text-primary-foreground/80 mb-2 block">
                      {project.category}
                    </span>
                    <h3 className="text-xl font-display font-bold text-primary-foreground mb-4">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <Button variant="glass" size="icon" className="rounded-full">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="glass" size="icon" className="rounded-full">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                </div>

                {/* Bottom info bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent group-hover:opacity-0 transition-opacity duration-300">
                  <span className="text-xs text-muted-foreground">{project.category}</span>
                  <h3 className="text-sm font-medium text-foreground">{project.title}</h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
