import { getServerAuthSession } from "@/server/auth";
import Link from "next/link";
import LeftNav from "./LeftNav";
import RightNav from "./RightNav";

const Header = async () => {
  const session = await getServerAuthSession();

  return (
    <nav className="flex w-full items-center  p-8">
      <LeftNav session={session} />
      <RightNav session={session} />
    </nav>
  );
};

export default Header;
