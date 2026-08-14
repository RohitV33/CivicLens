import { motion } from 'framer-motion'

const variants = {
  primary: 'btn-primary rounded-full',
  secondary: 'btn-secondary rounded-full',
  ghost: 'btn-ghost rounded-full',
  danger: 'inline-flex items-center justify-center gap-2 rounded-full bg-danger text-white font-medium px-5 py-2.5 text-sm shadow-soft hover:opacity-90 active:scale-[0.98] transition-all duration-200',
}

const sizes = {
  sm: 'text-xs px-3.5 py-2',
  md: '',
  lg: 'text-base px-6 py-3',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  className = '',
  as: Component = 'button',
  ...props
}) {
  const MotionComp = motion(Component)

  return (
    <MotionComp
      whileTap={{ scale: 0.97 }}
      className={`${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={16} strokeWidth={2.25} />}
      {children}
      {IconRight && <IconRight size={16} strokeWidth={2.25} />}
    </MotionComp>
  )
}
