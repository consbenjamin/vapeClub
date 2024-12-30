import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const URL = process.env.NEXT_PUBLIC_API_URL;

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${URL}/api/user/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },                    
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            throw new Error("Error en la solicitud de autenticación");
          }

          const data = await res.json();

          if (data.success && data.token) {
            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name,
              role: data.user.role,
              token: data.token,
            };
          } else {
            console.error("Error en el login:", data.error || "Sin éxito");
            return null;
          }
        } catch (error) {
          console.error("Error de autenticación:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id || token.id;
        token.email = user.email || token.email;
        token.name = user.name || token.name;
        token.role = user.role || token.role;

        if (account?.provider === "google") {
          token.accessToken = account.access_token;
        }

        if (user.token) {
          token.token = user.token;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.role = token.role;
      session.user.token = token.token;
      session.user.accessToken = token.accessToken;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});
