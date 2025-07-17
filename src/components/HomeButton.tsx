'use client'

import { Home } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function HomeButton() {
  const router = useRouter()

  const handleClick = () => {
    router.push('/')
  }

  return (
    <Button 
      variant="outline" 
      size="icon" 
      className="h-9 w-9" 
      onClick={handleClick}
      aria-label="Go to homepage"
    >
      <Home className="h-4 w-4" />
    </Button>
  )
}