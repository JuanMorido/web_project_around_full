"use client";

import dynamic from "next/dynamic";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import SiteFooter from "@/components/site/SiteFooter";
import RequestStatus from "@/components/status/RequestStatus";
import { getProjects, type Project } from "@/utils/projectsApi";
import { publicUrl } from "@/utils/publicUrl";

const CountryGlobe = dynamic(() => import("./country-globe").then((module) => module.CountryGlobe), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center grayscale">
      <div className="size-[min(46vh,380px)] rounded-full bg-[radial-gradient(circle_at_32%_32%,#e7f3ea,#7fad98_42%,#315e86)]" />
    </div>
  ),
});

function SessionMenu({ onSignOut }: { onSignOut: () => void }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="flex items-center gap-2.5 rounded-lg py-1 pr-1.5 pl-1 hover:bg-muted"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span
          className="grid size-8 place-items-center rounded-full bg-primary text-xs font-medium text-primary-foreground"
          aria-hidden
        >
          JC
        </span>
        <span className="text-sm">Juan Camilo</span>
        <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <div
          id={panelId}
          role="region"
          aria-label="Sesión de Juan Camilo"
          className="absolute top-12 right-0 z-30 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-border bg-white p-4 shadow-lg"
        >
          <p className="text-xs text-muted-foreground">Sesión local</p>
          <p className="text-sm font-semibold">Juan Camilo Escobar</p>

          <section className="mt-4">
            <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Perfil</h2>
            <dl className="mt-2 grid gap-2">
              <div>
                <dt className="text-xs text-muted-foreground">Nombre</dt>
                <dd className="text-sm">Juan Camilo Escobar</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Dónde vive la sesión</dt>
                <dd className="text-sm">En este equipo. No hay una cuenta en un servidor.</dd>
              </div>
            </dl>
          </section>

          <section className="mt-4">
            <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Configuración</h2>
            <dl className="mt-2 grid gap-2">
              <div>
                <dt className="text-xs text-muted-foreground">Idioma</dt>
                <dd className="text-sm">Español</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Zona</dt>
                <dd className="text-sm">América/Bogotá</dd>
              </div>
            </dl>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">No hay más ajustes guardados.</p>
          </section>

          <section className="mt-4">
            <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Suscripciones</h2>
            <p className="mt-2 text-sm">Sin suscripción.</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">No hay un plan activo en esta sesión.</p>
          </section>

          <Button type="button" variant="outline" className="mt-4 w-full" onClick={onSignOut}>
            Cerrar sesión
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function SummaryBox({ title, rows }: { title: string; rows: { label: string; value: string }[] }) {
  return (
    <section className="border-t border-border bg-white px-4 py-3">
      <h3 className="text-sm font-semibold">{title}</h3>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="text-xs text-muted-foreground">{row.label}</dt>
            <dd className="text-sm font-medium">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

const EMPTY = "—";

type ProjectListStatus = "loading" | "error" | "empty" | "ready";

function projectListStatus(
  projects: Project[] | null,
  failed: boolean,
): ProjectListStatus {
  if (failed) return "error";
  if (projects === null) return "loading";
  if (projects.length === 0) return "empty";
  return "ready";
}

export function Studio({ onSignOut }: { onSignOut: () => void }) {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [projectsFailed, setProjectsFailed] = useState(false);

  useEffect(() => {
    let active = true;
    getProjects()
      .then((items) => {
        if (active) setProjects(items);
      })
      .catch(() => {
        if (active) setProjectsFailed(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const listStatus = projectListStatus(projects, projectsFailed);

  return (
    <div className="flex min-h-dvh flex-col bg-background md:h-dvh md:overflow-hidden">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-white px-4 sm:px-5">
        <div className="flex items-center gap-2.5">
          <img src={publicUrl("logo-viabilidad.svg")} alt="" width={32} height={32} className="size-8" />
          <p className="text-sm font-semibold tracking-tight">Mundínamo</p>
        </div>
        <SessionMenu onSignOut={onSignOut} />
      </header>

      <div className="grid grid-cols-1 md:min-h-0 md:flex-1 md:grid-cols-[300px_minmax(0,1fr)_320px]">
        <section className="order-2 flex min-h-0 flex-col border-b border-border bg-white md:order-1 md:overflow-hidden md:border-r md:border-b-0">
          <h2 className="px-4 pt-4 pb-2 text-sm font-semibold">Proyectos</h2>
          <div className="px-4 pt-1 pb-4">
            <Button
              type="button"
              variant="outline"
              disabled
              style={{ opacity: 1 }}
              className="h-12 w-full border-foreground/20 bg-white text-base font-medium text-foreground shadow-sm"
            >
              + Proyecto
            </Button>
          </div>
          <div className="min-h-16 flex-1 px-4 pb-4 md:min-h-0">
            {listStatus === "ready" ? (
              <ul className="grid gap-2">
                {(projects ?? []).map((project) => (
                  <li key={project.id} className="text-sm">
                    {project.name}
                  </li>
                ))}
              </ul>
            ) : (
              <RequestStatus status={listStatus} />
            )}
          </div>
          <SummaryBox
            title="Resumen del proyecto"
            rows={[
              { label: "Nombre", value: EMPTY },
              { label: "País", value: EMPTY },
              { label: "Tecnología", value: EMPTY },
              { label: "Nivel", value: EMPTY },
              { label: "CAPEX", value: EMPTY },
            ]}
          />
        </section>

        <main className="order-1 flex min-h-[70vh] flex-col bg-background md:order-2 md:min-h-0">
          <div className="min-h-[280px] flex-1">
            <CountryGlobe paused />
          </div>
          <SummaryBox
            title="Resumen del país"
            rows={[
              { label: "País", value: EMPTY },
              { label: "Capacidad", value: EMPTY },
              { label: "Demanda", value: EMPTY },
              { label: "Punta", value: EMPTY },
              { label: "Matriz", value: EMPTY },
            ]}
          />
        </main>

        <section className="order-3 flex min-h-0 flex-col border-t border-border bg-white md:overflow-hidden md:border-t-0 md:border-l">
          <h2 className="px-4 pt-4 pb-2 text-sm font-semibold">Tecnologías</h2>
          <div className="px-4 pt-1 pb-4">
            <Button
              type="button"
              variant="outline"
              disabled
              style={{ opacity: 1 }}
              className="h-12 w-full border-foreground/20 bg-white text-base font-medium text-foreground shadow-sm"
            >
              + Tecnología
            </Button>
          </div>
          <div className="min-h-4 md:min-h-0 md:flex-1" />
          <SummaryBox
            title="Resumen de la tecnología"
            rows={[
              { label: "Tecnología", value: EMPTY },
              { label: "Qué es", value: EMPTY },
              { label: "Qué manda el costo", value: EMPTY },
            ]}
          />
        </section>
      </div>
      <SiteFooter />
    </div>
  );
}
