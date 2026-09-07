import { redirect } from "next/navigation";

type SearchParams = { [key: string]: string | string[] | undefined };

/**
 * Legacy entry point kept for existing links. The live conversation now lives
 * on the Messages screen itself, so this just forwards the same params there.
 */
export default async function ChatPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const forward = new URLSearchParams();
  forward.set("guest", "1");
  if (typeof params.engineer === "string") forward.set("engineer", params.engineer);
  if (typeof params.detail === "string") forward.set("detail", params.detail);
  redirect(`/app/inbox?${forward.toString()}`);
}
