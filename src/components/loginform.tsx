"use client";

import Image from "next/image";
import Link from "next/link";
import { SubmitButton } from "./submitButton";
import { useFormState } from "react-dom";
import { login } from "@/app/actions/auth";
import { LoginFormState } from "@/lib/definitions";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const [state, formAction] = useFormState<LoginFormState, FormData>(login, {});
  const router = useRouter();

  useEffect(() => {
    if (state.success && state.user) {
      // Redirect to login page after successful signup
      redirect("/content");
    }
  }, [state.success, state.user]);

  const handleOAuthSignIn = (provider: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    signIn(provider);
  };

  return (
    <div className="flex flex-col md:flex-row w-9/10 max-h-full mx-auto shadow-lg rounded-lg overflow-hidden">
      <div className="flex-1 relative hidden md:block">
        <Image src="/hero-flix.jpeg" alt="Login illustration" fill />
      </div>
      <form action={formAction} className="flex-1 p-8 bg-white text-gray-700">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Login to MyFlix
        </h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {state?.errors?.email && (
              <p className="mt-1 text-sm text-red-600">{state.errors.email}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {state?.errors?.password && (
              <p className="mt-1 text-sm text-red-600">
                {state.errors.password}
              </p>
            )}
          </div>
        </div>
        <SubmitButton />
        {state?.success && (
          <p className="mt-4 text-green-600 font-semibold">{state.message}</p>
        )}

        {/* OAuth buttons */}
        <div className="mt-6">
          <p className="text-center text-sm text-gray-600 mb-4">
            Or login with
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleOAuthSignIn("google")}
              className="px-4 py-2 border flex gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150"
            >
              <img
                className="w-6 h-6"
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                loading="lazy"
                alt="google logo"
              />
              <span>Google</span>
            </button>
            <button
              onClick={handleOAuthSignIn("github")}
              className="px-4 py-2 border flex gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150"
            >
              <img
                className="w-6 h-6"
                src="https://www.svgrepo.com/show/512317/github-142.svg"
                loading="lazy"
                alt="github logo"
              />
              <span>GitHub</span>
            </button>
          </div>
        </div>

        {/* don't have an account */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don&#39;t have an account?{" "}
            <Link
              href="/signup"
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
