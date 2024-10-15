import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const options: NextAuthOptions = {
  providers: [
    GitHubProvider({
      profile(profile) {
        console.log("GitHub profile:", profile);
        let userRole = "GitHub User";
        if (profile?.email === "kinyagia10@gmail.com") {
          userRole = "admin";
        }
        return {
          ...profile,
          name: profile.login,
          role: userRole,
        };
      },
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      profile(profile) {
        console.log("Google profile:", profile);
        let userRole = "Google User"; 
        if (profile?.email === "kinyagia10@gmail.com") {
          userRole = "admin";
        }
        return {
          ...profile,
          id: profile.sub,
          role: userRole,
        };
      },
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; 
      }
      return token;
    },
    async session({ session, token }) { 
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {    
      if (url === `${baseUrl}/login`) {
        return `${baseUrl}/content`;
      }
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async signIn({ user, account, profile }) {
      try {
        const existingUser = await prisma.users.findUnique({
          where: { email: user.email ?? undefined },
        });
        if (!existingUser) {
          const hashedPassword = await bcrypt.hash('12345678', 10);
          await prisma.users.create({
            data: {
              email: user.email,
              username: user.name ?? 'Unknown User',
              role: user.role ?? 'user',
              password: hashedPassword,
            },
          });
        }
        return true;
      } catch (error) {
        console.error("Error signing in:", error);
        return false;
      }
    },
  },
  events: {
    async signOut({ session, token }) {
      // Perform any necessary cleanup here
    },
  },
  pages: {
    signIn: '/login',
  },
};