import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import { authConfig } from "@/lib/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectDB();

        const email = String(credentials.email).toLowerCase().trim();
        const user = await User.findOne({ email });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          plan: user.plan,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session }) {
      // Run the original callback logic
      // We manually copy logic because wrapping async callbacks is tricky or call super?
      // Let's just reimplement the combo here since this runs in Node.

      if (user) {
        token.role = (user as any).role;
        token.plan = (user as any).plan;
        token.id = user.id;
      }

      // REFRESH LOGIC (Node only)
      // If no user (subsequent calls), fetch fresh data from DB
      if (!user && token.email) {
        try {
          await connectDB();
          const freshUser = await User.findOne({ email: token.email });
          if (freshUser) {
            token.plan = freshUser.plan;
            token.role = freshUser.role;
          }
        } catch (error) {
          console.error("Error refreshing token data:", error);
        }
      }

      return token;
    },
    // We can inherit session callback safely as it has no DB calls
  },
});
