"use client";

import dynamic from "next/dynamic";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import CountrySources from "@/components/studio/country-sources";
import RequestStatus from "@/components/status/RequestStatus";
import SiteFooter from "@/components/site/SiteFooter";
import { getCatalog, type Country } from "@/utils/projectsApi";
import { REQUEST_ERROR } from "@/utils/messages";
import {
  createEnergyProject,
  deleteEnergyProject,
  getEnergyProjects,
  updateEnergyProject,
  type EnergyProject,
} from "@/utils/energyProjects";
import { NAME_MAX_LENGTH, NAME_MIN_LENGTH, PROJECTS_PAGE_SIZE } from "@/utils/config";
import { publicUrl } from "@/utils/publicUrl";

const CountryGlobe = dynamic(() => import("./country-globe").then((module) => module.CountryGlobe), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center grayscale">
      <div className="size-[min(46vh,380px)] rounded-full bg-[radial-gradient(circle_at_32%_32%,#e7f3ea,#7fad98_42%,#315e86)]" />
    </div>
  ),
});

function initials(name: string): string {
  const letters = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  return letters || "M";
}

function NameField({
  onRename,
  userName,
}: {
  onRename: (name: string) => Promise<void>;
  userName: string;
}) {
  const [name, setName] = useState(userName);
  const [notice, setNotice] = useState("");
  const [savingName, setSavingName] = useState(false);

  return (
    <form
      className="mt-2 grid gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        setNotice("");
        setSavingName(true);
        onRename(name.trim())
          .then(() => setNotice("Nombre guardado."))
          .catch((reason: unknown) => {
            setNotice(reason instanceof Error ? reason.message : REQUEST_ERROR);
          })
          .finally(() => setSavingName(false));
      }}
    >
      <label className="grid gap-1 text-xs text-muted-foreground">
        Nombre
        <input
          className={fieldClass}
          maxLength={NAME_MAX_LENGTH}
          minLength={NAME_MIN_LENGTH}
          placeholder="Tu nombre"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      {notice ? (
        <p className="text-sm" role="status">
          {notice}
        </p>
      ) : null}
      <Button type="submit" variant="outline" disabled={savingName}>
        {savingName ? "Guardando…" : "Guardar nombre"}
      </Button>
    </form>
  );
}

function SessionMenu({
  onRename,
  onSignOut,
  userName,
  userEmail,
}: {
  onRename: (name: string) => Promise<void>;
  onSignOut: () => void;
  userName: string;
  userEmail: string;
}) {
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
          {initials(userName)}
        </span>
        <span className="text-sm">{userName || "Cuenta"}</span>
        <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <div
          id={panelId}
          role="region"
          aria-label={`Sesión de ${userName || "la cuenta"}`}
          className="absolute top-12 right-0 z-30 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-border bg-white p-4 shadow-lg"
        >
          <p className="text-xs text-muted-foreground">Cuenta</p>
          <p className="text-sm font-semibold">{userName || "Usuario"}</p>

          <section className="mt-4">
            <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Perfil</h2>
            <NameField onRename={onRename} userName={userName} />
            <p className="mt-2 text-xs text-muted-foreground">Correo de recuperación</p>
            <p className="text-sm">{userEmail}</p>
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
  saving,
}: {
  countries: Country[];
  initialCountryId: string;
  onClose: () => void;
  onSave: (draft: ProjectDraft) => void;
  saving: boolean;
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
          <input className={fieldClass} placeholder="Nombre de la planta" required value={draft.nombre} onChange={(event) => update("nombre", event.target.value)} />
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
          <input className={fieldClass} placeholder="Solar, gas, agua…" required value={draft.tecnologia} onChange={(event) => update("tecnologia", event.target.value)} />
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
          <input className={fieldClass} placeholder="10 MW" required value={draft.demanda} onChange={(event) => update("demanda", event.target.value)} />
        </Field>
        <Field label="CAPEX">
          <input className={fieldClass} placeholder="8 millones" required value={draft.capex} onChange={(event) => update("capex", event.target.value)} />
        </Field>
        <Field label="Precio por MWh">
          <input className={fieldClass} placeholder="70 USD" required value={draft.precioMwh} onChange={(event) => update("precioMwh", event.target.value)} />
        </Field>
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Guardando…" : "Guardar"}
          </Button>
        </div>
      </form>
    </ToolDialog>
  );
}

function TechnologyDialog({
  onClose,
  onSave,
  saving,
}: {
  onClose: () => void;
  onSave: (draft: TechnologyDraft) => void;
  saving: boolean;
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
          <input className={fieldClass} placeholder="Nombre de la tecnología" required value={draft.nombre} onChange={(event) => update("nombre", event.target.value)} />
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
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Guardando…" : "Guardar"}
          </Button>
        </div>
      </form>
    </ToolDialog>
  );
}

export function Studio({
  onRename,
  onSignOut,
  userName,
  userEmail,
}: {
  onRename: (name: string) => Promise<void>;
  onSignOut: () => void;
  userName: string;
  userEmail: string;
}) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [place, setPlace] = useState<{ lat: number; lng: number } | null>(null);
  const [focusRequest, setFocusRequest] = useState("");
  const [projects, setProjects] = useState<EnergyProject[]>([]);
  const [projectStatus, setProjectStatus] = useState<"loading" | "error" | "empty" | "ready">("loading");
  const [selectedProject, setSelectedProject] = useState<EnergyProject | null>(null);
  const [technologyDraft, setTechnologyDraft] = useState<TechnologyDraft | null>(null);
  const [openTool, setOpenTool] = useState<"project" | "technology" | null>(null);
  const [saveError, setSaveError] = useState("");
  const [saveNotice, setSaveNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PROJECTS_PAGE_SIZE);

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

  useEffect(() => {
    let active = true;
    getEnergyProjects()
      .then((items) => {
        if (!active) return;
        setProjects(items);
        setProjectStatus(items.length > 0 ? "ready" : "empty");
      })
      .catch(() => {
        if (active) setProjectStatus("error");
      });
    return () => {
      active = false;
    };
  }, []);

  const selectedCountry = countries.find((country) => country.id === selectedCountryId) ?? null;
  const projectCountry = countries.find((country) => country.id === selectedProject?.paisId) ?? null;

  function chooseCountry(country: Country, lat: number, lng: number): void {
    setSelectedCountryId(country.id);
    setPlace({ lat, lng });
  }

  function selectProject(project: EnergyProject): void {
    setSelectedProject(project);
    setTechnologyDraft({
      nombre: project.tecnologia,
      queEs: project.queEs,
      queMandaElCosto: project.queMandaElCosto,
      seComercializa: project.seComercializa || "Sí",
      combustible: project.combustible,
    });
    setSelectedCountryId(project.paisId);
    setFocusRequest(`${project.paisId}-${project._id}`);
    setPlace(null);
  }

  function saveProject(draft: ProjectDraft): void {
    setSaveError("");
    setSaveNotice("");
    setSaving(true);
    createEnergyProject(draft)
      .then((project) => {
        setProjects((current) => [project, ...current.filter((item) => item._id !== project._id)]);
        setProjectStatus("ready");
        selectProject(project);
        setSaveNotice("Proyecto guardado.");
        setOpenTool(null);
      })
      .catch(() => {
        setSaveError(REQUEST_ERROR);
      })
      .finally(() => setSaving(false));
  }

  function saveTechnology(draft: TechnologyDraft): void {
    setTechnologyDraft(draft);
    if (!selectedProject) {
      setOpenTool(null);
      return;
    }
    setSaveError("");
    setSaveNotice("");
    setSaving(true);
    updateEnergyProject(selectedProject._id, {
      tecnologia: draft.nombre,
      queEs: draft.queEs,
      queMandaElCosto: draft.queMandaElCosto,
      seComercializa: draft.seComercializa,
      combustible: draft.combustible,
    })
      .then((project) => {
        setProjects((current) => current.map((item) => (item._id === project._id ? project : item)));
        setSelectedProject(project);
        setSaveNotice("Tecnología guardada.");
        setOpenTool(null);
      })
      .catch(() => {
        setSaveError(REQUEST_ERROR);
      })
      .finally(() => setSaving(false));
  }

  function removeProject(): void {
    if (!selectedProject || saving) return;
    const id = selectedProject._id;
    setSaveError("");
    setSaveNotice("");
    setSaving(true);
    deleteEnergyProject(id)
      .then(() => {
        const next = projects.filter((item) => item._id !== id);
        setProjects(next);
        setProjectStatus(next.length > 0 ? "ready" : "empty");
        setSelectedProject(null);
        setTechnologyDraft(null);
        setSaveNotice("Proyecto quitado.");
      })
      .catch(() => {
        setSaveError(REQUEST_ERROR);
      })
      .finally(() => setSaving(false));
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background md:h-dvh md:overflow-hidden">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-white px-4 sm:px-5">
        <div className="flex items-center gap-2.5">
          <img src={publicUrl("logo-viabilidad.svg")} alt="Logotipo de Mundínamo" width={32} height={32} className="size-8" />
          <p className="text-sm font-semibold tracking-tight">Mundínamo</p>
        </div>
        <SessionMenu onRename={onRename} onSignOut={onSignOut} userEmail={userEmail} userName={userName} />
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
          <div className="min-h-16 flex-1 overflow-y-auto px-4 md:min-h-0">
            {projectStatus === "ready" ? (
              <ul className="grid gap-1">
                {projects.slice(0, visibleCount).map((project) => (
                  <li key={project._id}>
                    <button
                      type="button"
                      className={`w-full rounded-lg px-2 py-1.5 text-left text-sm hover:bg-muted ${
                        selectedProject?._id === project._id ? "bg-muted font-medium" : ""
                      }`}
                      onClick={() => selectProject(project)}
                    >
                      {project.nombre}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <RequestStatus status={projectStatus} />
            )}
            {projectStatus === "ready" && visibleCount < projects.length ? (
              <Button
                type="button"
                variant="outline"
                className="mt-2 w-full"
                onClick={() => setVisibleCount((count) => count + PROJECTS_PAGE_SIZE)}
              >
                Mostrar más
              </Button>
            ) : null}
            {saveNotice ? (
              <p className="mt-2 text-sm leading-5" role="status">
                {saveNotice}
              </p>
            ) : null}
            {saveError ? (
              <p className="mt-2 text-sm leading-5" role="alert">
                {saveError}
              </p>
            ) : null}
          </div>
          <SummaryBox
            title="Resumen del proyecto"
            rows={[
              { label: "Nombre", value: selectedProject?.nombre || EMPTY },
              { label: "País", value: projectCountry?.nombre ?? EMPTY },
              { label: "Tecnología", value: selectedProject?.tecnologia || EMPTY },
              { label: "Nivel", value: selectedProject?.nivel || EMPTY },
              { label: "CAPEX", value: selectedProject?.capex || EMPTY },
            ]}
          />
          {selectedProject ? (
            <div className="px-4 pb-4">
              <Button type="button" variant="outline" className="w-full" disabled={saving} onClick={removeProject}>
                {saving ? "Guardando…" : "Quitar proyecto"}
              </Button>
            </div>
          ) : null}
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
          saving={saving}
        />
      ) : null}
      {openTool === "technology" ? (
        <TechnologyDialog onClose={() => setOpenTool(null)} onSave={saveTechnology} saving={saving} />
      ) : null}
    </div>
  );
}
