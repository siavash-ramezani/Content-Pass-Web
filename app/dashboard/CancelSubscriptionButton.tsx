"use client";

import { useFormStatus } from "react-dom";
import { Spinner } from "@/components/Spinner";

// See SubscribeButton for why this reads useFormStatus() instead of wrapping
// the action in useActionState: it keeps the form's `action` pointed directly
// at the real Server Action, preserving progressive enhancement.
export function CancelSubscriptionButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 rounded border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 disabled:opacity-50 dark:border-red-800 dark:text-red-300"
    >
      {pending && <Spinner className="h-4 w-4" />}
      {pending ? "Cancelling…" : "Cancel subscription"}
    </button>
  );
}
