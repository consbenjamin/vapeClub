"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/NavBar";

export default function Perfil() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  if (!session) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto py-12 px-4 max-w-2xl">
          <Head>
            <title>Mi perfil – VapeClub</title>
          </Head>
          <h1 className="font-display text-2xl font-bold text-center text-foreground mb-4">
            Iniciá sesión para ver tu perfil
          </h1>
          <p className="text-center text-foreground/80 mb-6">
            No tenés acceso a esta página sin una sesión activa.
          </p>
          <div className="flex justify-center">
            <Link
              href="/auth/login"
              className="inline-flex px-6 py-3 rounded-xl bg-brand text-white font-medium hover:bg-brand-dark transition-colors"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </>
    );
  }

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <Head>
        <title>Mi perfil – VapeClub</title>
        <meta name="description" content="Tu perfil de usuario en VapeClub." />
      </Head>
      <Navbar />
      <div className="container mx-auto py-8 px-4 max-w-2xl flex-grow">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-center text-foreground mb-8">Mi perfil</h1>
        <div className="bg-surface rounded-2xl shadow-md border border-border p-6 md:p-8">
          <div className="flex flex-col items-center mb-8">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "Avatar"}
                width={96}
                height={96}
                className="rounded-full object-cover border-4 border-brand-100"
              />
            ) : (
              <span className="w-24 h-24 rounded-full bg-brand text-white text-2xl font-bold flex items-center justify-center border-4 border-brand-100">
                {getInitials(session.user.name)}
              </span>
            )}
            <h2 className="mt-4 font-display text-xl font-semibold text-foreground">{session.user.name}</h2>
          </div>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-foreground/70">Email</dt>
              <dd className="mt-1 text-foreground">{session.user.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-foreground/70">Rol</dt>
              <dd className="mt-1 text-foreground capitalize">{session.user.role || "Usuario"}</dd>
            </div>
          </dl>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={handleBackClick}
              className="px-6 py-2.5 rounded-xl border border-border text-foreground font-medium hover:bg-surface-hover transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
