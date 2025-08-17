import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Welcome</CardTitle>
            <CardDescription className="text-lg mt-2">
              Prompt Evaluation Platform
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Welcome to the Prompt Evaluation Platform. This platform allows you to test and evaluate AI model responses with custom prompts and test sets.
            </p>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}