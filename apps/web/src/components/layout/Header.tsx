import Link from 'next/link'
import { LogoutButton } from '@/components/features/auth/LogoutButton'

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-foreground">Prompt Evaluation Platform</h1>
          <nav className="flex items-center gap-6">
            <Link href="/test-sets" className="text-foreground/80 hover:text-foreground transition-colors">
              Test Sets
            </Link>
          </nav>
        </div>
        <LogoutButton />
      </div>
    </header>
  )
}