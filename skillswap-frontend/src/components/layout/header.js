import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/skill_swap_logo.png";

export default function Header() {
  return (
    <section className="flex justify-center ">
      <header className="flex grow px-6 pt-6 text-gray-200 justify-between">
        <div className="">
          <Link href={"/"}>
              <Image src={logo}
                     alt="Skill Swap"
                     width={200}
                     height={100}
              />
          </Link>
        </div>
        <nav className="">
          <Link
            className=" font-bold  text-black  border-black rounded-lg m-3"
            href={"/signin"}
          >
            Sign in
          </Link>
          <Link
            className=" font-bold text-indigo-600 hover:bg-indigo-600 hover:text-white   rounded-lg m-3 border border-indigo-600 p-3"
            href={"/signup"}
          >
            Join
          </Link>
        </nav>
      </header>
    </section>
  );
}
