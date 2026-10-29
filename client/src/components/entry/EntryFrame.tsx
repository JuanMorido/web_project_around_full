import SiteFooter from "../site/SiteFooter";
import { publicUrl } from "../../utils/publicUrl";
import "../../styles/globals.css";

type EntryFrameProps = {
  title: string;
  notice?: string | null;
  children: React.ReactNode;
};

export default function EntryFrame({
  title,
  notice,
  children,
}: EntryFrameProps): React.JSX.Element {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
    <main className="grid flex-1 place-items-center px-4 py-10">
      <section className="w-full max-w-sm rounded-xl border border-border bg-white p-6 shadow-lg">
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
        <h1 className="mt-6 text-xl font-semibold tracking-tight">{title}</h1>
        {notice ? (
          <p className="mt-4 rounded-lg border border-border bg-muted px-3 py-2 text-sm">
            {notice}
          </p>
        ) : null}
        {children}
      </section>
    </main>
    <SiteFooter />
    </div>
  );
}
