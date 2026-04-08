import Link from "next/link";
import { listAdminWriting } from "@/lib/content-source/get-writing";
import { deleteWritingAction } from "@/app/admin/(protected)/writing/actions";
import { DeleteWritingButton } from "@/app/admin/(protected)/writing/delete-writing-button";

export default async function AdminWritingPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const items = await listAdminWriting();

  return (
    <main>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Writing</h1>
          <p className="mt-2 text-sm text-black/60">
            Manage writing posts from the database-backed admin flow.
          </p>
        </div>
        <Link
          href="/admin/writing/new"
          className="rounded-md bg-black px-4 py-2 font-mono text-sm text-white transition-opacity hover:opacity-90"
        >
          New writing
        </Link>
      </div>
      <div className="mt-3 min-h-5 text-sm">
        {params.status === "deleted" ? <p className="text-green-700">Writing deleted.</p> : null}
        {params.status === "delete_missing" ? (
          <p className="text-red-700">Delete failed: item was not found.</p>
        ) : null}
        {params.status === "delete_error" ? (
          <p className="text-red-700">Delete failed: invalid request.</p>
        ) : null}
      </div>

      {items.length === 0 ? (
        <p className="mt-8 text-sm text-black/55">No writing entries yet.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-black/10 text-left font-mono text-xs uppercase tracking-[0.12em] text-black/45">
                <th className="px-2 py-3">Title</th>
                <th className="px-2 py-3">Slug</th>
                <th className="px-2 py-3">State</th>
                <th className="px-2 py-3">Featured</th>
                <th className="px-2 py-3">Published at</th>
                <th className="px-2 py-3">Updated at</th>
                <th className="px-2 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.dbId} className="border-b border-black/8 text-sm">
                  <td className="px-2 py-3">{item.title}</td>
                  <td className="px-2 py-3 font-mono text-xs text-black/60">{item.slug}</td>
                  <td className="px-2 py-3">{item.published ? "published" : "draft"}</td>
                  <td className="px-2 py-3">{item.featured ? "Yes" : "No"}</td>
                  <td className="px-2 py-3 font-mono text-xs text-black/60">
                    {item.publishedAt ? new Date(item.publishedAt).toISOString().slice(0, 10) : "-"}
                  </td>
                  <td className="px-2 py-3 font-mono text-xs text-black/60">
                    {item.updatedAt ? new Date(item.updatedAt).toISOString().slice(0, 10) : "-"}
                  </td>
                  <td className="px-2 py-3">
                    <Link
                      href={`/admin/writing/${item.dbId}`}
                      className="font-mono text-xs text-black/65 underline decoration-black/20 underline-offset-4 hover:text-black"
                    >
                      edit
                    </Link>
                    <span className="px-2 text-black/35">|</span>
                    <form action={deleteWritingAction} className="inline">
                      <input type="hidden" name="id" value={item.dbId} />
                      <DeleteWritingButton />
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
