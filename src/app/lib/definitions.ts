import { z } from 'zod'
import { JWTPayload } from 'jose';
 
export const SignupFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .trim(),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
})

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
})
 
export type FormState = {
  errors?: {
    username?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string;
  success?: boolean;
  userId?: number;
};

export type LoginFormState = {
  errors?: {
    email?: string[];
    password?: string[];
    global?: string[];
  };
  success?: boolean;
  message?: string;
  user?: {
    id: number;
    username: string;
  };
};

//session payload
export interface SessionPayload extends JWTPayload  {
  userId: string;
  email: string;
  username: string;
  role: string; // e.g., "user" or "admin"
}