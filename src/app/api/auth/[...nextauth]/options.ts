import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

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
        // console.log("Redirect URL:", url);
        // console.log("Base URL:", baseUrl);
    
        // Check if the URL is the login page
        if (url === `${baseUrl}/login`) {
          return `${baseUrl}/content`; // Redirect to /content from /login
        }
        
        // Default redirect logic for other URLs
        if (url.startsWith("/")) return `${baseUrl}${url}`;
        else if (new URL(url).origin === baseUrl) return url;
    
        return baseUrl; // Fallback
      },
    
  },
  pages: {
    signIn: '/login', // Correct path based on where your login page is located
  },
};
