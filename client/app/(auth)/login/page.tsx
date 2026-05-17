"use client"
import { LoginForm } from "@/components/login-form"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export default function LoginPage() {
  const queryClient = new QueryClient();
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <QueryClientProvider client={queryClient}>
          <LoginForm />
        </QueryClientProvider>
      </div>
    </div>
  )
}
