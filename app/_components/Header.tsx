"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Home", href: "/" },
  { label: "Chat", href: "/chat" },
  { label: "Files", href: "/files" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="h-12 border-b border-border w-full flex px-2">
      <nav className="flex w-full h-full items-center gap-2 justify-center">
        {links.map((link) => (
          <Link
            href={link.href}
            key={link.href}
            className="grid place-items-center px-4 h-8 relative"
          >
            {pathname === link.href && (
              <motion.div
                layout
                layoutId="link-bg"
                className="absolute inset-0 h-full w-full bg-primary rounded-full"
              />
            )}
            <span className="relative z-10">{link.label}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
}
