import Image from "next/image";
import Link from "next/link";

const links = [
  { label: "Home", href: "/" },
  { label: "Chat", href: "/chat" },
  { label: "Files", href: "/files" },
  { label: "About", href: "/about" },
];

export default function Header() {
  return (
    <header className="h-12 border-b border-border w-full flex px-2">
      <nav className="flex h-full">
        <Image
          src="/logo.png"
          height={30}
          width={40}
          alt="ask my docs logo"
          className="aspect-square rounded-md"
        />
        {links.map((link) => (
          <Link
            href={link.href}
            key={link.href}
            className="h-full grid place-items-center px-4"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
