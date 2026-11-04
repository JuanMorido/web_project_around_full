"use client";

import dynamic from "next/dynamic";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import CountrySources from "@/components/studio/country-sources";
import SiteFooter from "@/components/site/SiteFooter";
import { getCatalog, type Country } from "@/utils/projectsApi";
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
const fieldClass =
  "h-10 w-full rounded-lg border border-border bg-white px-3 text-sm font-normal outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

type ProjectDraft = {
  nombre: string;
  paisId: string;
  tecnologia: string;
  estado: string;
  nivel: string;
  demanda: string;
  capex: string;
  precioMwh: string;
};

type TechnologyDraft = {
  nombre: string;
  queEs: string;
  queMandaElCosto: string;
  seComercializa: string;
  combustible: string;
};

function ToolDialog({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/40 px-4 py-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="max-h-[calc(100dvh-3rem)] w-full max-w-md overflow-y-auto rounded-xl border border-border bg-white p-6 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}

function ProjectDialog({
  countries,
  initialCountryId,
  onClose,
  onSave,
}: {
  countries: Country[];
  initialCountryId: string;
  onClose: () => void;
  onSave: (draft: ProjectDraft) => void;
}) {
  const [draft, setDraft] = useState<ProjectDraft>({
    nombre: "",
    paisId: initialCountryId,
    tecnologia: "",
    estado: "Por diseñar",
    nivel: "Orden de magnitud",
    demanda: "",
    capex: "",
    precioMwh: "",
  });

  function update(key: keyof ProjectDraft, value: string): void {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  return (
    <ToolDialog title="Proyecto" onClose={onClose}>
      <form
        className="mt-5 grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSave(draft);
        }}
      >
        <Field label="Nombre">
          <input className={fieldClass} required value={draft.nombre} onChange={(event) => update("nombre", event.target.value)} />
        </Field>
        <Field label="País">
          <select className={fieldClass} required value={draft.paisId} onChange={(event) => update("paisId", event.target.value)}>
            <option value="">Elige un país</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.nombre}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Tecnología">
          <input className={fieldClass} required value={draft.tecnologia} onChange={(event) => update("tecnologia", event.target.value)} />
        </Field>
        <Field label="Estado de la planta">
          <select className={fieldClass} value={draft.estado} onChange={(event) => update("estado", event.target.value)}>
            <option>Por diseñar</option>
            <option>Ya construida</option>
          </select>
        </Field>
        <Field label="Nivel de estimación">
          <select className={fieldClass} value={draft.nivel} onChange={(event) => update("nivel", event.target.value)}>
            <option>Orden de magnitud</option>
            <option>Estudio más avanzado</option>
          </select>
        </Field>
        <Field label="Demanda">
          <input className={fieldClass} required value={draft.demanda} onChange={(event) => update("demanda", event.target.value)} />
        </Field>
        <Field label="CAPEX">
          <input className={fieldClass} required value={draft.capex} onChange={(event) => update("capex", event.target.value)} />
        </Field>
        <Field label="Precio por MWh">
          <input className={fieldClass} required value={draft.precioMwh} onChange={(event) => update("precioMwh", event.target.value)} />
        </Field>
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </ToolDialog>
  );
}

function TechnologyDialog({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (draft: TechnologyDraft) => void;
}) {
  const [draft, setDraft] = useState<TechnologyDraft>({
    nombre: "",
    queEs: "",
    queMandaElCosto: "",
    seComercializa: "Sí",
    combustible: "",
  });

  function update(key: keyof TechnologyDraft, value: string): void {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  return (
    <ToolDialog title="Tecnología" onClose={onClose}>
      <form
        className="mt-5 grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSave(draft);
        }}
      >
        <Field label="Nombre">
          <input className={fieldClass} required value={draft.nombre} onChange={(event) => update("nombre", event.target.value)} />
        </Field>
        <Field label="Qué es">
          <textarea className={`${fieldClass} h-24 py-2`} required value={draft.queEs} onChange={(event) => update("queEs", event.target.value)} />
        </Field>
        <Field label="Qué manda el costo">
          <textarea
            className={`${fieldClass} h-24 py-2`}
            required
            value={draft.queMandaElCosto}
            onChange={(event) => update("queMandaElCosto", event.target.value)}
          />
        </Field>
        <Field label="¿Ya se comercializa?">
          <select className={fieldClass} value={draft.seComercializa} onChange={(event) => update("seComercializa", event.target.value)}>
            <option>Sí</option>
            <option>No</option>
          </select>
        </Field>
        <Field label="Combustible">
          <input className={fieldClass} value={draft.combustible} onChange={(event) => update("combustible", event.target.value)} />
        </Field>
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </ToolDialog>
  );
}

export function Studio({ onSignOut }: { onSignOut: () => void }) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [place, setPlace] = useState<{ lat: number; lng: number } | null>(null);
  const [focusRequest, setFocusRequest] = useState("");
  const [projectDraft, setProjectDraft] = useState<ProjectDraft | null>(null);
  const [technologyDraft, setTechnologyDraft] = useState<TechnologyDraft | null>(null);
  const [openTool, setOpenTool] = useState<"project" | "technology" | null>(null);

  useEffect(() => {
    let active = true;
    getCatalog()
      .then((catalog) => {
        if (active) setCountries(catalog.paises);
      })
      .catch(() => {
        if (active) setCountries([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const selectedCountry = countries.find((country) => country.id === selectedCountryId) ?? null;
  const projectCountry = countries.find((country) => country.id === projectDraft?.paisId) ?? null;

  function chooseCountry(country: Country, lat: number, lng: number): void {
    setSelectedCountryId(country.id);
    setPlace({ lat, lng });
  }

  function saveProject(draft: ProjectDraft): void {
    setProjectDraft(draft);
    setSelectedCountryId(draft.paisId);
    setFocusRequest(draft.paisId);
    setOpenTool(null);
  }

  function saveTechnology(draft: TechnologyDraft): void {
    setTechnologyDraft(draft);
    setOpenTool(null);
  }

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
              className="h-12 w-full border-foreground/20 bg-white text-base font-medium text-foreground shadow-sm"
              onClick={() => setOpenTool("project")}
            >
              + Proyecto
            </Button>
          </div>
          <div className="min-h-16 flex-1 md:min-h-0" />
          <SummaryBox
            title="Resumen del proyecto"
            rows={[
              { label: "Nombre", value: projectDraft?.nombre || EMPTY },
              { label: "País", value: projectCountry?.nombre ?? EMPTY },
              { label: "Tecnología", value: projectDraft?.tecnologia || EMPTY },
              { label: "Nivel", value: projectDraft?.nivel || EMPTY },
              { label: "CAPEX", value: projectDraft?.capex || EMPTY },
            ]}
          />
        </section>

        <main className="order-1 flex min-h-[70vh] flex-col bg-background md:order-2 md:min-h-0">
          <div className="min-h-[280px] flex-1">
            <CountryGlobe
              countryName={selectedCountry?.nombre ?? "Sin país"}
              selectedCode={selectedCountry?.code ?? ""}
              availableCodes={countries.map((country) => country.code)}
              focusRequest={focusRequest}
              onSelect={(identity) => {
                const country = countries.find((item) => item.code === identity.code);
                if (country) chooseCountry(country, identity.lat, identity.lng);
              }}
            />
          </div>
          <SummaryBox
            title="Resumen del país"
            rows={[
              { label: "País", value: selectedCountry?.nombre ?? EMPTY },
              { label: "Capacidad", value: selectedCountry?.red.capacidad ?? EMPTY },
              { label: "Demanda", value: selectedCountry?.red.demanda ?? EMPTY },
              { label: "Punta", value: selectedCountry?.red.punta ?? EMPTY },
              { label: "Matriz", value: selectedCountry?.red.matriz ?? EMPTY },
            ]}
          />
          {selectedCountry && place ? (
            <CountrySources
              key={`${selectedCountry.code}-${place.lat}-${place.lng}`}
              code={selectedCountry.code}
              lat={place.lat}
              lng={place.lng}
            />
          ) : null}
        </main>

        <section className="order-3 flex min-h-0 flex-col border-t border-border bg-white md:overflow-hidden md:border-t-0 md:border-l">
          <h2 className="px-4 pt-4 pb-2 text-sm font-semibold">Tecnologías</h2>
          <div className="px-4 pt-1 pb-4">
            <Button
              type="button"
              variant="outline"
              className="h-12 w-full border-foreground/20 bg-white text-base font-medium text-foreground shadow-sm"
              onClick={() => setOpenTool("technology")}
            >
              + Tecnología
            </Button>
          </div>
          <div className="min-h-16 flex-1 md:min-h-0" />
          <SummaryBox
            title="Resumen de la tecnología"
            rows={[
              { label: "Tecnología", value: technologyDraft?.nombre || EMPTY },
              { label: "Qué es", value: technologyDraft?.queEs || EMPTY },
              { label: "Qué manda el costo", value: technologyDraft?.queMandaElCosto || EMPTY },
            ]}
          />
        </section>
      </div>
      <SiteFooter />
      {openTool === "project" ? (
        <ProjectDialog
          countries={countries}
          initialCountryId={selectedCountryId ?? ""}
          onClose={() => setOpenTool(null)}
          onSave={saveProject}
        />
      ) : null}
      {openTool === "technology" ? (
        <TechnologyDialog onClose={() => setOpenTool(null)} onSave={saveTechnology} />
      ) : null}
    </div>
  );
}
