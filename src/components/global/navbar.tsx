import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
                {/* Logo area */}
                <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-wider uppercase">
            Vestra
          </span>
                </Link>

                {/* Navigation Links - Hidden on mobile for now */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                    <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
                    <Link href="/collections" className="hover:text-foreground transition-colors">Collections</Link>
                    <Link href="/about" className="hover:text-foreground transition-colors">Our Story</Link>
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    {/* We will add a Cart Button here later! */}
                </div>
            </div>
        </header>
    );
}