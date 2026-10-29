import { Link } from "react-router-dom";
import { publicUrl } from "../utils/publicUrl";
import SiteFooter from "../components/site/SiteFooter";
import "../styles/globals.css";

export default function AboutPage(): React.JSX.Element {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-10">
        <div className="flex items-center gap-2.5">
          <img
            src={publicUrl("logo-viabilidad.svg")}
            alt=""
            width={32}
            height={32}
            className="size-8"
          />
          <p className="text-sm font-semibold tracking-tight">Mundínamo</p>
        </div>
        <h1 className="mt-6 text-xl font-semibold tracking-tight">
          Sobre Mundínamo
        </h1>
        <p className="mt-4 text-sm leading-6">
          La explicación de qué hace el programa queda pendiente.
        </p>
        <Link
          className="mt-6 inline-block text-sm font-medium underline-offset-4 hover:underline"
          to="/"
        >
          Volver
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
