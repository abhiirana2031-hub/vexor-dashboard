import { useRouteError } from "react-router";

export default function ErrorPage() {
  const routeError = useRouteError() as unknown;
  const message =
    routeError instanceof Error
      ? routeError.message
      : typeof routeError === "string"
        ? routeError
        : "Unexpected runtime error";
  const stack = routeError instanceof Error ? routeError.stack : null;

  return (
    <div className="min-h-screen w-full bg-background text-foreground p-6 md:p-10">
      <div className="mx-auto max-w-4xl rounded-xl border border-destructive/30 bg-soft-shadow-gray/30 p-6">
        <h1 className="text-2xl font-bold text-destructive">Route Error</h1>
        <p className="mt-3 text-sm md:text-base">{message}</p>
        {stack && (
          <pre className="mt-4 overflow-auto rounded bg-background/70 p-4 text-xs whitespace-pre-wrap">
            {stack}
          </pre>
        )}
      </div>
    </div>
  );
}
