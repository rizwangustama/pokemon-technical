import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="absolute top-0 left-0 w-full z-20">
      <div className="container">
        <div className="flex justify-between items-center py-4 md:py-7">
          <Link href="/" aria-label="Pokemon Home">
            <Image
              src="/logo.svg"
              alt="Pokémon Logo"
              width={80}
              height={46}
              priority
              className="drop-shadow-md md:w-[100px] md:h-auto"
            />
          </Link>
          <nav>
            <span className="text-xs text-white/80 font-medium tracking-wide hidden sm:inline">
              Pokédex — Rizwan Gustama
            </span>
          </nav>
        </div>
      </div>
    </header>
  );
}
