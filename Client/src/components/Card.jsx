import { motion } from 'framer-motion'

export default function Card({ children, className = '', hover = true, as = 'div', ...props }) {
  const Component = motion[as] || motion.div
  return (
    <Component
      className={`craft-card p-6 sm:p-7 ${hover ? 'hover:-translate-y-1 hover:shadow-craft' : ''} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}
