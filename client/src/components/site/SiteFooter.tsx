import { Link } from "react-router-dom";

export default function SiteFooter(): React.JSX.Element {
  return (
    <footer className="shrink-0 border-t border-border bg-white px-4 py-2.5">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 text-sm">
        <p>© 2026 Mundínamo</p>
        <Link
          className="font-medium underline-offset-4 hover:underline"
          to="/sobre"
        >
          Sobre Mundínamo
        </Link>
      </div>
    </footer>
  );
}
