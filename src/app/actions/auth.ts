"use server"

import { FormState, LoginFormState, LoginSchema, SignupFormSchema } from '@/lib/definitions';
import bcrypt from 'bcryptjs';
import prisma from '../../lib/prisma';
import { createSession, deleteSession } from '../../lib/session';
import { cookies } from 'next/headers';

export async function login(prevState: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // If any form fields are invalid, return early with errors
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Extract validated data
  const { email, password } = validatedFields.data;

  try {
    // Find user by email
    const user = await prisma.users.findUnique({
      where: { email },
      select: { user_id: true, password: true, username: true ,email: true}, // Only select necessary fields
    });

    // Check if user exists (invalid email)
    if (!user) {
      return { success: false, errors: { email: ['Invalid email'] } };
    }

    // Check if the password matches
    const passwordMatch = await bcrypt.compare(password, user.password as string);

    if (!passwordMatch) {
      // Password is incorrect but email exists
      return { success: false, errors: { password: ['Invalid password'] } };
    }

    // If both email and password are correct, create a session
    await createSession(`session: ${user.user_id}`, `${user.username}`, `${user.email}`);
    return {
      success: true,
      message: 'Login successful!',
      user: { id: user.user_id, username: user.username }
    };

  } catch (error) {
    console.error('Login error:', error);
    return { success: false, errors: { global: ['An error occurred during login.'] } };
  }
}

export async function signup(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // 1. Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirm_password: formData.get('confirm_password'),
  });

  // If any form fields are invalid, return early with errors
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid fields. Please check your input.",
    };
  }

  // 2. Extract validated data
  const { username, email, password } = validatedFields.data;

  // 3. Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // 4. Insert the user into the MySQL database using Prisma
    const user = await prisma.users.create({
      data: {
        username: username,
        email: email, 
        password: hashedPassword!, 
      },
      select: { user_id: true }, // Only return the user ID
    });

    // 5. Return success with the user ID if the user was created
    return {
      success: true,
      message: "Account created successfully!",
      userId: user.user_id,
    };
  } catch (error: any) {
    // Handle unique constraint violation errors (e.g., duplicate email or username)
    if (error.code === "P2002" && error.meta?.target) {
      const targetField = error.meta.target; // Get the conflicting field (email or username)
      return {
        success: false,
        errors: {
          [targetField]: [`This ${targetField} is already in use.`],
        },
        message: "Unique constraint violation.",
      };
    }
    // Catch-all error handling
    return {
      success: false,
      message: "An error occurred while creating your account.",
    };
  }
}


export async function logout() {
  try {
    const cookieStore = cookies();
    
    // Clear all cookies (retrieve all cookies and clear them)
    cookieStore.getAll().forEach(cookie => {
      cookieStore.set(cookie.name, '', { maxAge: 0 });
    });

    return { redirect: '/' };
  } catch (error) {
    console.error('Error logging out:', error);
    return {
      success: false,
      message: 'An error occurred while logging out.',
    };
  }
}
