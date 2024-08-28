"use client";

import type { Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  session: Session | null;
}

const LeftNav = ({ session }: Props) => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex items-center space-x-4">
      <Link
        href="/"
        className={`font-bold ${isActive("/drafts") && "text-gray-500"}`}
      >
        Feed
      </Link>
      {session && (
        <Link
          href="/drafts"
          className={`${isActive("/drafts") && "font-semibold text-black"}`}
        >
          Drafts
        </Link>
      )}
    </div>
  );
};

export default LeftNav;
