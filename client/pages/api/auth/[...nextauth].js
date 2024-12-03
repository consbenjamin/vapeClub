import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

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
          const res = await fetch("http://localhost:5000/api/user/login", {
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

          if (data.success) {
            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name,
              token: data.token,
            };
          } else {
            return null;
          }
        } catch (error) {
          console.error("Error de autenticación:", error);
          return null;
        }
      },
    }),
    // Proveedor de inicio de sesión con Google
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
      session.user.token = token.token;
      session.user.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});
