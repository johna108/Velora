"use client";

import Link from "next/link";
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
import { login, signup, signInWithGoogle } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { useState, useTransition, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [isSignup, setIsSignup] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const authError = searchParams.get("error");
  const authMessage = searchParams.get("message");

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const action = isSignup ? signup : login;
      const result = await action(formData);
      if (result?.error) {
        toast({
          variant: "destructive",
          title: isSignup ? "Signup Failed" : "Login Failed",
          description: result.error,
        });
      }
    });
  };

  const handleGoogleLogin = () => {
    startTransition(async () => {
      const result = await signInWithGoogle();
      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Google Login Failed",
          description: result.error,
        });
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">
            {isSignup ? "Create an Account" : "Login to Velora"}
          </CardTitle>
          <CardDescription>
            {isSignup
              ? "Enter your email below to create your account"
              : "Enter your email below to login to your account"}
          </CardDescription>
          {authError && (
            <p className="text-sm text-destructive mt-2">
              {authMessage
                ? decodeURIComponent(authMessage)
                : "Authentication failed. Please try again."}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <form action={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {!isSignup && (
                    <Link
                      href="#"
                      className="ml-auto inline-block text-sm underline"
                    >
                      Forgot your password?
                    </Link>
                  )}
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isSignup ? "Creating account..." : "Logging in..."}
                  </>
                ) : isSignup ? (
                  "Sign Up"
                ) : (
                  "Login"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={isPending}
              >
                Login with Google
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setIsSignup(false)}
                  className="underline font-medium"
                >
                  Login
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => setIsSignup(true)}
                  className="underline font-medium"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-secondary">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
