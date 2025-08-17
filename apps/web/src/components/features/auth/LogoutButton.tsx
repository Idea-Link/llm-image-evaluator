'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { authService } from '@/services/auth'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const result = await authService.signOut()
    
    if (!result.error) {
      router.push('/login')
      router.refresh()
    }
  }

  return (
    <Button 
      onClick={handleLogout} 
      variant="outline"
      size="sm"
    >
      Logout
    </Button>
  )
}