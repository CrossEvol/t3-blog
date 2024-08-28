import { getServerAuthSession } from "@/server/auth";
import LeftNav from "./left-nav";
import RightNav from "./right-nav";

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
