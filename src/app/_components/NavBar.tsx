import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import Image from "next/image";
import { auth, signOut } from "~/server/auth";

export async function TopNav() {
  const session = await auth();
  return (
    <nav className="hidden w-full grid-cols-3 items-center border-b border-black p-1 text-xl md:grid">
      <div className="pl-4">
        <Image height={50} width={50} alt="Spellbook manager" src="/book.png" />
      </div>
      <ul className="flex items-center justify-between gap-x-4 justify-self-center">
        <li>
          <Link className="hover:text-pink-500" href={"/"}>
            Home
          </Link>
        </li>
        {session ? (
          <>
            <li>
              <Link className="hover:text-pink-500" href={"/library"}>
                Spellbook manager
              </Link>
            </li>
            <li>
              <Link className="hover:text-pink-500" href={"/homebrew"}>
                Create a spell
              </Link>
            </li>
          </>
        ) : (
          <Link href={"/api/auth/signin"}>
            <div className="text-zinc-600 hover:text-pink-500">
              Please sign in to use all features
            </div>
          </Link>
        )}
      </ul>
      <div className="justify-self-end py-2 pr-4 hover:cursor-pointer">
        {session ? (
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
            className="flex items-center"
          >
            <button type="submit">
              <Avatar>
                <AvatarImage src={session?.user?.image ?? undefined} />
                <AvatarFallback>
                  {session?.user?.name ?? undefined}
                </AvatarFallback>
              </Avatar>
            </button>
          </form>
        ) : (
          <Link href={"/api/auth/signin"}>
            <div className="hover:text-pink-500">Sign In</div>
          </Link>
        )}
      </div>
    </nav>
  );
}
