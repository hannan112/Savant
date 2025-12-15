export const authConfig = {
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const onDashboard = nextUrl.pathname.startsWith('/dashboard');
            if (onDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }
            return true;
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.role = (user as any).role;
                token.plan = (user as any).plan;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).plan = token.plan;
                (session.user as any).id = token.id;
            }
            return session;
        },
    },
    providers: [], // Providers added in lib/auth.ts
} as any;
