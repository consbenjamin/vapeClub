import { useState } from "react";
import { useRouter } from "next/router";
import useStore from "@/store/store";
import Head from "next/head";
import Link from "next/link";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { registerUser, loading, error, setError } = useStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    const success = await registerUser({ name, email, password });
    if (success) router.push("/");
  };

  return (
    <>
      <Head>
        <title>Crear cuenta – VapeClub</title>
        <meta name="description" content="Creá tu cuenta en VapeClub." />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-surface p-6 sm:p-8 rounded-2xl shadow-lg border border-border">
          <h2 className="font-display text-center text-2xl sm:text-3xl font-bold text-foreground">Crear una cuenta</h2>
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-4 py-2.5 border border-border rounded-xl text-foreground bg-surface placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                placeholder="Tu nombre"
              />
            </div>
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
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </form>
          <p className="text-center text-sm text-foreground/80">
            ¿Ya tenés cuenta?{" "}
            <Link href="/auth/login" className="font-medium text-brand hover:text-brand-dark dark:hover:text-brand-light">
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
