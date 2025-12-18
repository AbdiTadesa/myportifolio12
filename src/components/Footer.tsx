import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-sm text-muted-foreground"
          >
            © {currentYear} Abdi Tadese Abebe. All rights reserved.
          </motion.p>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-sm text-muted-foreground flex items-center gap-1"
          >
            Made with <Heart className="w-4 h-4 text-primary fill-primary" /> and creativity
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
