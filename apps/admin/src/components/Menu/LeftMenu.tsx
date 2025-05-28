import { Filter } from "./filter";
import LogOut from "./LogOut";
import Image from "next/image";
import Link from "next/link";

type LeftMenuProps = {
  tag: string;
  setTag: (v: string) => void;
  date: string;
  setDate: (v: string) => void;
  content: string;
  setContent: (v: string) => void;
  sort: string;
  setSort: (v: string) => void;
};

export function LeftMenu(props: LeftMenuProps) {
  return (
    <div className="w-1/4  border-r-2 border-gray-200 pt-8">
      <h1 className="flex w-full items-center justify-center space-x-4">
        <Image src={"/wsulogo.png"} alt="WSU logo" width={40} height={40} />
        <Link href={"/"} className="w-full text-xl font-bold">Full Stack Blog</Link>
      </h1>
      <nav className="font-bold py-12">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <Filter {...props} />
          </li>
          <li>
           <LogOut/>
          </li>
        </ul>
      </nav>
    </div>
  );
}