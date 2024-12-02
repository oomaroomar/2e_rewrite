"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function TopNav() {
  const { data: session } = useSession();
  console.log(session);
  return (
    <nav className="flex w-full items-center justify-between border-b border-black p-4 text-xl font-semibold">
      <div>Gallery</div>
      {session ? (
        <div onClick={() => signOut()}>{session?.user?.name}</div>
      ) : (
        <Link href={"/api/auth/signin"}>
          <div>Sign In</div>
        </Link>
      )}
    </nav>
  );
}
