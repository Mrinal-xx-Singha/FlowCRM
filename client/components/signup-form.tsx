"use client";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(7, {
    message: "Password must be at least 7 characters.",
  }),
});

export function SignupForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const signupMutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => authApi.register(values),
    onSuccess: (data) => {
      // Store token (consider using a more secure way or a dedicated auth hook/provider)
      if (data && data.token) {
        document.cookie = `token=${data.token}; path=/; max-age=3600`; // Expires in 1 hour
      }
      if (data && data.name) {
        localStorage.setItem("userName", data.name);
      }
      router.push("/");
    },
    onError: (error: any) => {
      console.error("Signup failed:", error);
      // You could set a form error here
      form.setError("root", {
        message: error.response?.data?.error || "Signup failed. Please check your information."
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    signupMutation.mutate(values);
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          {form.formState.errors.root && (
            <p className="text-sm font-medium text-destructive text-center">
              {form.formState.errors.root.message}
            </p>
          )}
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              required
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              required
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={signupMutation.isPending}>
            {signupMutation.isPending ? "Creating account..." : "Sign Up"}
          </Button>
          <Button variant="outline" className="w-full" type="button">
            Sign up with Google
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
