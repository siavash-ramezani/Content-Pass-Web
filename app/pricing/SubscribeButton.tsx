"use client";

import { useFormStatus } from "react-dom";
import { Spinner } from "@/components/Spinner";

// Reads pending state from the nearest ancestor <form> (which still points
// directly at the subscribeAction Server Action — see page.tsx) rather than
// wrapping/replacing the action itself, so the form keeps working via a plain
// POST without JavaScript (progressive enhancement, same as a Server Action
// passed straight to `action` would).
export function SubscribeButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
    >
      {pending && <Spinner className="h-4 w-4" />}
      {pending ? "Subscribing…" : "Subscribe"}
    </button>
  );
}
