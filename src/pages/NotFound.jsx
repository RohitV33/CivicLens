import { Link } from 'react-router-dom'
import { MapPinOff } from 'lucide-react'
import Button from '../components/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-bg dark:bg-bg-dark">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
        <MapPinOff size={26} className="text-primary dark:text-primary-dark" />
      </div>
      <h1 className="font-display text-2xl font-bold text-text-primary dark:text-text-dark mb-2">Page not found</h1>
      <p className="text-sm text-text-secondary dark:text-text-dark/60 mb-6 max-w-sm">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Button as={Link} to="/">Back to home</Button>
    </div>
  )
}
