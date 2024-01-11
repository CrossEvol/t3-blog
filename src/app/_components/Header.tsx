import { getServerAuthSession } from "@/server/auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import React from "react";

const Header = async () => {
  const isActive: (pathname: string) => boolean = (path) => true;

  const session = await getServerAuthSession();

  if (!session) {
    const Left = () => (
      <div className="flex items-center space-x-4">
        <Link
          href="/"
          className={`font-bold ${isActive("/") && "text-gray-500"}`}
        >
          Feed
        </Link>

        {/* Add more navigation links as needed */}
      </div>
    );
    const Right = () => (
      <div className="ml-auto flex items-center space-x-4">
        <Link
          href="/api/auth/signin"
          className={`rounded border border-black px-4 py-2 ${
            isActive("/signin") ? "text-gray-500" : "text-black"
          }`}
        >
          Log in
        </Link>
      </div>
    );

    return (
      <nav className="flex w-full items-center p-8">
        <Left />
        <Right />
      </nav>
    );
  }

  const Left = () => (
    <div className="flex items-center space-x-4">
      <Link
        href="/"
        className={`font-bold ${isActive("/") && "text-gray-500"}`}
      >
        Feed
      </Link>
      <Link
        href="/drafts"
        className={`${isActive("/drafts") && "text-gray-500"}`}
      >
        My drafts
      </Link>
    </div>
  );
  const Right = () => (
    <div className="ml-auto flex items-center space-x-4">
      <p className="text-sm">
        {session.user.name} ({session.user.email})
      </p>
      <Link
        href="/create"
        className="inline-block rounded border border-black px-4 py-2"
      >
        New post
      </Link>
      <button onClick={() => signOut()} className="border-none">
        <a className="inline-block">Log out</a>
      </button>
    </div>
  );

  return (
    <nav className="flex w-full items-center  p-8">
      <Left />
      <Right />
    </nav>
  );
};

export default Header;
