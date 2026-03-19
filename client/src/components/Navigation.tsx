import { useLocation } from "wouter";
import { Link } from "wouter";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation() {
  const [location] = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { label: t('nav.home'), href: "/" },
    { label: t('nav.portfolio'), href: "/portfolio" },
    { label: t('nav.lab'), href: "/lab" },
    { label: t('nav.blog'), href: "/blog" },
    { label: t('nav.about'), href: "/about" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-8 pointer-events-none">
      <div className="pointer-events-auto">
        <div className="text-xs font-bold tracking-widest font-mono text-text-main">
          KINETIC_PORTFOLIO // 01
        </div>
      </div>

      <div className="flex gap-8 items-center pointer-events-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-link ${
              location === item.href ? "text-accent-lava" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
        <LanguageSwitcher />
      </div>
    </nav>
  );
}
