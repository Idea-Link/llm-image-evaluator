import { LogoutButton } from '@/components/features/auth/LogoutButton'

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Prompt Evaluation Platform</h1>
        <LogoutButton />
      </div>
    </header>
  )
}