import Link from "next/link";
import { Nav } from "./Nav";

export function Header() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          ContentPass
        </Link>
        <Nav />
      </div>
    </header>
  );
}
