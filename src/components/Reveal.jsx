import { motion } from 'framer-motion'

export default function Reveal({ children, delay = 0, y = 24, style, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function RevealGroup({ children, stagger = 0.08, style, ...props }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({ children, y = 20, style, ...props }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } }}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  )
}
