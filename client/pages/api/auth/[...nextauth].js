import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const URL = process.env.NEXT_PUBLIC_URL;

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          throw new Error("Por favor ingresa tu correo y contraseña.");
        }

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
            const errorData = await res.json();
            throw new Error(errorData.message || "Credenciales inválidas.");
          }

          const data = await res.json();

          console.log("Authorize callback - response:", data); // Log de la respuesta del backend

          if (data.success && data.token) {
            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name,
              role: data.user.role,
              token: data.token,
            };
          } else {
            throw new Error(data.error || "Error inesperado en la autenticación.");
          }
        } catch (error) {
          console.error("Error de autenticación:", error.message || error);
          throw new Error("Error en el servidor. Intenta nuevamente.");
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

        console.log("JWT callback - user:", user); // Log de la información del user

        if (account?.provider === "google") {
          token.accessToken = account.access_token;
        }

        if (user.token) {
          token.token = user.token;
        }
      }
      console.log("JWT callback - token:", token); // Log del token que se está retornando
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.role = token.role;
      session.user.token = token.token;
      session.user.accessToken = token.accessToken;

      console.log("Session callback - session:", session); // Log de la sesión
      console.log("Session callback - token:", token); // Log del token en la sesión
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect callback - url:", url); // Log de la url de redirección
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});
