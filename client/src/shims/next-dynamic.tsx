import {
  lazy,
  Suspense,
  type ComponentType,
  type LazyExoticComponent,
} from "react";

type Loaded<P> = ComponentType<P> | { default: ComponentType<P> };

type DynamicOptions = {
  ssr?: boolean;
  loading?: () => React.ReactNode;
};

export default function dynamic<P extends object>(
  loader: () => Promise<Loaded<P>>,
  options?: DynamicOptions,
): ComponentType<P> {
  const Lazy = lazy(() =>
    loader().then((loaded) => {
      if (typeof loaded === "function") {
        return { default: loaded as ComponentType<P> };
      }
      return loaded;
    }),
  ) as LazyExoticComponent<ComponentType<P>>;

  function DynamicComponent(props: P) {
    const Loading = options?.loading;
    return (
      <Suspense fallback={Loading ? <Loading /> : null}>
        <Lazy {...props} />
      </Suspense>
    );
  }

  return DynamicComponent;
}
