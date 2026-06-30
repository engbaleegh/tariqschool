import { DefaultSession, type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { db } from "@/lib/prisma";
import { User, UserRole } from "@/generated/prisma";
import { JWT } from "next-auth/jwt";
import { BOOTSTRAP_ADMIN } from "@/constants/site";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends Partial<User> {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, token }) => {
      if (token?.id) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.image = token.image as string;
      }
      return session;
    },
    jwt: async ({ token, user }): Promise<JWT> => {
      if (user) {
        return {
          id: user.id,
          name: user.name ?? "",
          email: user.email ?? "",
          role: (user as { role?: UserRole }).role ?? UserRole.EDITOR,
          image: user.image,
        };
      }
      if (token?.id) return token as JWT;

      try {
        const dbUser = await db.user.findUnique({
          where: { email: token?.email ?? "" },
        });
        if (dbUser?.isActive) {
          return {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role,
            image: dbUser.image,
          };
        }
      } catch {
        // Database unavailable — keep existing token
      }

      return token as JWT;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
    updateAge: 10 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const email = credentials.email.trim().toLowerCase();
        const password = credentials.password;

        try {
          const user = await db.user.findUnique({ where: { email } });
          if (user?.isActive) {
            const valid = await bcrypt.compare(password, user.password);
            if (valid) {
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image,
              };
            }
          }

          const userCount = await db.user.count();
          if (userCount > 0) {
            return null;
          }
        } catch {
          // Database unavailable — fall through to bootstrap admin for initial setup
        }

        const bootstrapEmail =
          process.env.BOOTSTRAP_ADMIN_EMAIL?.toLowerCase() ?? BOOTSTRAP_ADMIN.email;
        const bootstrapPassword =
          process.env.BOOTSTRAP_ADMIN_PASSWORD ?? BOOTSTRAP_ADMIN.password;

        if (email === bootstrapEmail && password === bootstrapPassword) {
          return {
            id: "bootstrap-admin",
            name: BOOTSTRAP_ADMIN.name,
            email: bootstrapEmail,
            role: UserRole.SUPER_ADMIN,
            image: null,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/ar/auth/signin",
  },
};
