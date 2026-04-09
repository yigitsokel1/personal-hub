import { getContentHealthSurface } from "@/lib/content/health-surface";

export default async function AdminContentHealthPage() {
  const report = await getContentHealthSurface();
  const tagIssues = report.blocking.filter((line) => line.toLowerCase().includes("tag"));

  return (
    <main>
      <h1 className="text-2xl font-semibold tracking-tight">Content Health</h1>
      <p className="mt-2 text-sm text-black/60">
        Runtime diagnostics for publish state, tags, and featured policy limits.
      </p>

      <section className="mt-8 space-y-3">
        <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-black/55">
          Invalid publish state
        </h2>
        {report.invalidPublishState.length === 0 ? (
          <p className="text-sm text-green-700">No invalid publish state found.</p>
        ) : (
          <ul className="space-y-2 text-sm text-red-700">
            {report.invalidPublishState.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-black/55">Tag issues</h2>
        {tagIssues.length === 0 ? (
          <p className="text-sm text-green-700">No tag issues found.</p>
        ) : (
          <ul className="space-y-2 text-sm text-red-700">
            {tagIssues.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-black/55">
          Featured overflow
        </h2>
        {report.featuredOverflow.length === 0 ? (
          <p className="text-sm text-green-700">No featured overflow found.</p>
        ) : (
          <ul className="space-y-2 text-sm text-red-700">
            {report.featuredOverflow.map((row) => (
              <li key={row.domain}>
                [{row.domain}] limit={row.limit}, count={row.count}, slugs={row.slugs.join(", ")}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-black/55">
          Advisory + blocking
        </h2>
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-black/70">Blocking</h3>
            {report.blocking.length === 0 ? (
              <p className="mt-2 text-sm text-green-700">No blocking issues found.</p>
            ) : (
              <ul className="mt-2 space-y-2 text-sm text-red-700">
                {report.blocking.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-black/70">Advisory</h3>
            {report.advisory.length === 0 ? (
              <p className="mt-2 text-sm text-green-700">No advisory issues found.</p>
            ) : (
              <ul className="mt-2 space-y-2 text-sm text-black/70">
                {report.advisory.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
