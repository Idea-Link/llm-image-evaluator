import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout'

export default function Home() {
  return (
    <AuthenticatedLayout>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-center mb-8">
          Evaluation Platform
        </h1>
        <p className="text-center text-gray-600">
          LLM Evaluation Platform for Testing AI Models
        </p>
      </div>
    </AuthenticatedLayout>
  );
}