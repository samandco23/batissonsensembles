import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth/next";
import { compare } from "bcryptjs";

/**
 * Authentification administrateur.
 *
 * Un seul compte, défini par variables d'environnement (aucun utilisateur en base).
 * ADMIN_PASSWORD_HASH est un hash bcrypt : `npm run hash -- 'motdepasse'`.
 */
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: { signIn: "/admin/login" },
  providers: [
    CredentialsProvider({
      name: "Administration",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        if (!email || !password) return null;

        const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
        const adminHash = process.env.ADMIN_PASSWORD_HASH || "";

        if (!adminEmail || !adminHash) {
          console.error(
            "Auth : ADMIN_EMAIL et ADMIN_PASSWORD_HASH doivent être définis.",
          );
          return null;
        }

        // On compare toujours le hash, même si l'email ne correspond pas,
        // afin de ne pas révéler quels emails existent.
        const passwordOk = await compare(password, adminHash).catch(() => false);
        if (!passwordOk || email !== adminEmail) return null;

        return { id: "admin", email: adminEmail, name: "Administrateur" };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = "admin";
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.role = token.role === "admin" ? "admin" : undefined;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function getAdminSession() {
  return getServerSession(authOptions);
}

export async function isAdmin(): Promise<boolean> {
  const session = await getAdminSession();
  return Boolean(session?.user);
}
