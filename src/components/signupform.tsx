"use client";

import { useFormState } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitButton } from "./submitButton";
import { signup } from "@/app/actions/auth";
import { FormState } from "@/lib/definitions";

export function SignupForm() {
  const router = useRouter();
  const [state, formAction] = useFormState<FormState, FormData>(signup, {});

  useEffect(() => {
    if (state.success && state.userId) {
      // Redirect to login page after successful signup
      router.push("/login");
    }
  }, [state.success, state.userId, router]);

  return (
    <div className="flex flex-col md:flex-row w-9/10 h-full mx-auto shadow-lg rounded-lg overflow-hidden">
      <form action={formAction} className="flex-1 p-8 bg-white text-gray-700">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Sign Up</h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              id="username"
              name="username"
              placeholder="Enter your name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {state?.errors?.username && (
              <p className="mt-1 text-sm text-red-600">
                {state.errors.username}
              </p>
            )}
          </div>
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
              <div className="mt-1 text-sm text-red-600">
                <p>Password must:</p>
                <ul className="list-disc list-inside">
                  {state.errors.password.map((error: string) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="confirm_password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              id="confirm_password"
              name="confirm_password"
              type="password"
              placeholder="Confirm your password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {state?.errors?.confirm_password && (
              <p className="mt-1 text-sm text-red-600">
                {state.errors.confirm_password}
              </p>
            )}
          </div>
        </div>
        <SubmitButton />
        {state?.success && (
          <p className="mt-4 text-green-600 font-semibold">{state.message}</p>
        )}
        {!state?.success && state?.message && (
          <p className="mt-4 text-red-600 font-semibold">{state.message}</p>
        )}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              Log in
            </Link>
          </p>
        </div>
      </form>
      <div className="flex-1 relative hidden md:block">
        <Image
          src="/hero-flix1.jpeg?height=600&width=600"
          alt="Signup illustration"
          fill
        />
      </div>
    </div>
  );
}
