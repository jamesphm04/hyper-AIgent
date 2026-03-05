import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number; // Add your custom properties here
      name?: string | null;
      email?: string | null;
      token?: string;
    };
  }

  interface User {
    id: number;
    name?: string | null;
    email?: string | null;
    token?: string;
  }
}
