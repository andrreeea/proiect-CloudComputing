import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-3 shadow-md sticky top-0 z-50">
      <div className="flex flex-wrap justify-center gap-4 text-sm sm:text-base font-medium">
        <Link href="/">
          <span className="hover:underline cursor-pointer">Acasă</span>
        </Link>
        <Link href="/history">
          <span className="hover:underline cursor-pointer">Istoric</span>
        </Link>
        <Link href="/charts">
          <span className="hover:underline cursor-pointer">Grafice</span>
        </Link>
        <Link href="/export">
          <span className="hover:underline cursor-pointer">Export date</span>
        </Link>
      </div>
    </nav>
  );
}
