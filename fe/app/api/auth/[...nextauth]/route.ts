import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginUser } from "@/services/users/authService";

// 1. Trigger authorize(credentials) when the user submits the form
// 2. Trigger the callback jwt when the user is authenticated
// 3. Trigger the callback session when the user accesses a protected route

const authOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const userData = await loginUser(
          credentials!.email,
          credentials!.password
        );

        if (!userData) {
          return null;
        }

        return {
          id: Number(userData.user.id),
          name: userData.user.name,
          email: userData.user.email,
          token: userData.token,
          expiresIn: userData.expiresIn,
        };
      },
    }),
  ],

  // this is for JWT token handling
  session: {
    strategy: "jwt" as const,
  },

  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.token = user.token;
        token.expires = Date.now() + user.expiresIn; // milliseconds
      }

      // 🔐 Token expiration check
      if (token.expires && Date.now() > token.expires) {
        return {}; // will cause session to become unauthenticated
      }

      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      // Pass the token data to the session
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.token = token.token;
      }

      return session;
    },
  },
};

// Named handlers for App Router
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
