import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const URL = process.env.NEXT_LOCAL_URL || process.env.NEXT_PUBLIC_URL;

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
        if (account?.provider === "google") {
          try {
            const backendUrl = process.env.NEXT_LOCAL_URL || process.env.NEXT_PUBLIC_URL;
            const res = await fetch(`${backendUrl}/api/user/google`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                image: user.image,
              }),
            });
            if (res.ok) {
              const data = await res.json();
              token.id = data.user.id;
              token.email = data.user.email;
              token.name = data.user.name;
              token.role = data.user.role;
              token.token = data.token;
            }
          } catch (err) {
            console.error("Error enlazando sesión Google con backend:", err.message);
          }
          token.accessToken = account.access_token;
        } else {
          token.id = user.id || token.id;
          token.email = user.email || token.email;
          token.name = user.name || token.name;
          token.role = user.role || token.role;
          if (user.token) token.token = user.token;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) session.user.id = token.id;
      if (token.email) session.user.email = token.email;
      if (token.name) session.user.name = token.name;
      if (token.role) session.user.role = token.role;
      if (token.token) session.user.token = token.token;
      if (token.accessToken) session.user.accessToken = token.accessToken;
      if (token.picture) session.user.image = token.picture;
      return session;
    },
    async redirect({ url, baseUrl }) {
      const base = (baseUrl || "").replace(/\/$/, "");
      const home = base ? `${base}/` : "/";
      if (!url) return home;
      if (url.includes("/auth/") || url.includes("signin") || url === baseUrl || url === base) return home;
      if (url.startsWith("/")) return base ? `${base}${url}` : url;
      if (base && (url.startsWith(baseUrl) || url.startsWith(base))) return url;
      return home;
    }
  },
    pages: {
      signIn: "/auth/login",
    },
});
