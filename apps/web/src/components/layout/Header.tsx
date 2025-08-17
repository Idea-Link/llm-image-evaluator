import { LogoutButton } from '@/components/features/auth/LogoutButton'

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Prompt Evaluation System</h1>
        <LogoutButton />
      </div>
    </header>
  )
}