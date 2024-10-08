import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/db";
import { compare } from "bcrypt";
import { signOut } from "next-auth/react";
export const authOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: { signIn: "/sign-in", signOut: "/sign-out" },
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@mail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Add logic here to look up the user from the credentials supplied
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const existingUser = await db.user.findUnique({
          where: {
            email: credentials?.email,
          },
          include: { roles: { include: { permissions: true } } },
        });
        if (!existingUser) {
          return null;
        }
        //console.log("ExistingUser details", existingUser);
        const passwordMatch = await compare(
          credentials.password,
          existingUser.password
        );
        if (!passwordMatch) {
          return null;
        }
        const roles = existingUser.roles.map((role) => role.name); // Role names
        const permissions = existingUser.roles.flatMap((role) =>
          role.permissions.map((permission) => permission.name)
        );

        return {
          id: `${existingUser.id}`,
          email: existingUser.email,
          restaurantId: existingUser.restaurantId,
          phoneNumber: existingUser.phoneNumber,
          roles, // Array of role names
          permissions, // Array of permission names
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.restaurantId = user.restaurantId;
        token.phoneNumber = user.phoneNumber;
        token.roles = user.roles; // Add roles
        token.permissions = user.permissions; // Add permissions
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          email: token.email,
          restaurantId: token.restaurantId,
          phoneNumber: token.phoneNumber,
          roles: token.roles, // Include roles in session
          permissions: token.permissions,
        },
      };

      return session;
    },
  },
};
export default NextAuth(authOptions);
