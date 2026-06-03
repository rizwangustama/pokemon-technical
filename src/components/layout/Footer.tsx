import Image from 'next/image';

const SOCIAL_LINKS = [
  {
    href: 'https://www.linkedin.com/in/rizwangustama/',
    src: '/icon-linkedin.svg',
    alt: 'LinkedIn',
  },
  {
    href: 'https://api.whatsapp.com/send/?phone=6285523951105',
    src: '/icon-wa.svg',
    alt: 'WhatsApp',
  },
  {
    href: 'https://github.com/rizwangustama',
    src: '/icon-github.svg',
    alt: 'GitHub',
  },
];

export default function Footer() {
  return (
    <footer className="bg-primary mt-12 lg:mt-20">
      <div className="container py-16 flex flex-col gap-4 items-center">
        <div className="flex gap-5">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.alt}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-80 hover:opacity-100 transition-opacity duration-200"
              aria-label={link.alt}
            >
              <Image src={link.src} alt={link.alt} width={24} height={24} />
            </a>
          ))}
        </div>
        <p className="text-white/80 text-sm text-center">
          © {new Date().getFullYear()} Rizwan Gustama. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
