import { getServerAuthSession } from "@/server/auth";
import Link from "next/link";
import LeftNav from "./LeftNav";

const Header = async () => {
  const isActive: (pathname: string) => boolean = (path) => true;

  const session = await getServerAuthSession();

  if (!session) {
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
        <LeftNav session={session} />
        <Right />
      </nav>
    );
  }
  const Right = () => (
    <div className="ml-auto flex items-center space-x-4">
      <p className="text-sm">
        {session.user.name} ({session.user.email})
      </p>
      <Link
        href="/post/create"
        className="inline-block rounded border border-black px-4 py-2"
      >
        New post
      </Link>
      <Link className="inline-block border-none" href={"/api/auth/signout"}>
        Log out
      </Link>
    </div>
  );

  return (
    <nav className="flex w-full items-center  p-8">
      <LeftNav session={session} />
      <Right />
    </nav>
  );
};

export default Header;
