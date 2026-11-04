import { Link } from "react-router-dom";
import { publicUrl } from "../utils/publicUrl";
import SiteFooter from "../components/site/SiteFooter";
import "../styles/globals.css";

const paragraphs = [
  "Bienvenido a Mundínamo, la suite para evaluar la viabilidad de un proyecto de generación de energía en cualquier lugar del mundo. Sirve para pasar de una idea de planta a una primera respuesta: qué tecnología, en qué país y a qué precio podría entregar la energía.",
  "Está pensada para quien trabaja en generación y necesita plantear una solución con una tecnología que ya se comercialice. Se parte de lo que hoy se puede comprar, construir y operar.",
  "La planta puede estar ya construida o todavía por diseñar. En la sección de tecnologías se miran las condiciones técnicas de esa solución y, al mismo tiempo, un estimado de costos. Ese estimado sigue el nivel de estimación económica que usted elija: una mirada de orden de magnitud no pide el mismo detalle que un estudio más avanzado.",
  "Esa tecnología necesita un destino. El destino es un país, y puede ser cualquiera. De allí se recoge cómo es la red eléctrica nacional, qué dice la normativa y qué combustibles hay disponibles. Esos datos se cruzan con los indicadores económicos del caso para calcular el precio final por MWh de la tecnología planteada en el país seleccionado.",
  "Una tecnología en un lugar es un proyecto. Usted puede crear varios. Con la misma tecnología en distintos países compara precios y posibilidades, y ve dónde esa planta tiene más sentido. También puede fijar un lugar y una demanda, y probar distintas soluciones hasta ver cuál encaja mejor.",
  "Mundínamo quiere ampliar el acceso de cualquier persona al mundo de la energía. Está hecha para que usted explore sus ideas con orden y encuentre una salida en un mercado difícil, pero con una demanda alta.",
];

export default function AboutPage(): React.JSX.Element {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
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
        <h1 className="mt-6 text-xl font-semibold tracking-tight">Mundínamo</h1>
        <div className="mt-4 grid gap-4 text-sm leading-6">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
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
