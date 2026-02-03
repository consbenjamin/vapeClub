import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!email || !password) {
      setError("Por favor ingresa tu correo y contraseña.");
      setLoading(false);
      return;
    }
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Credenciales incorrectas o error en el servidor");
    } else {
      router.push("/");
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      const result = await signIn("google", { redirect: false });
      if (result?.error) {
        setError("No se pudo iniciar sesión con Google. Intenta de nuevo.");
        toast.error("Error al iniciar sesión con Google");
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch (err) {
      setError("Error al conectar con Google");
      toast.error("Error al iniciar sesión con Google");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Iniciar sesión – VapeClub</title>
        <meta name="description" content="Iniciá sesión en tu cuenta de VapeClub." />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-surface p-6 sm:p-8 rounded-2xl shadow-lg border border-border">
          <h2 className="font-display text-center text-2xl sm:text-3xl font-bold text-foreground">Iniciar sesión</h2>
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-2.5 border border-border rounded-xl text-foreground bg-surface placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-2.5 border border-border rounded-xl text-foreground bg-surface placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 text-center" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-white bg-brand hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 transition-colors ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {loading ? "Cargando..." : "Iniciar sesión"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface text-foreground/60">o continúa con</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full py-3 px-4 border border-border rounded-xl text-foreground bg-surface hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-60"
          >
            <Image src="/google-logo.png" alt="" width={20} height={20} />
            {googleLoading ? "Conectando..." : "Iniciar sesión con Google"}
          </button>

          <p className="text-center text-sm text-foreground/80">
            ¿No tenés cuenta?{" "}
            <Link href="/auth/register" className="font-medium text-brand hover:text-brand-dark dark:hover:text-brand-light">
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
