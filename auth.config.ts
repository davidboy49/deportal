import type { NextAuthConfig } from 'next-auth';

const authConfig = {
  pages: { signIn: '/login' },
  providers: [],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as 'USER' | 'ADMIN';
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? (process.env.NODE_ENV !== "production" ? "dev-insecure-secret-change-me" : undefined),
} satisfies NextAuthConfig;

export default authConfig;
