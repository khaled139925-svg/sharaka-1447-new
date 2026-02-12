import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const LOGO_URL = 'https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663333045223/sbAbhoRnZZJtbbxK.png?Expires=1802412272&Signature=TD8nd1FdHrkqTkCCxY-ZVhHyATSQtPAzuY-8zMApcpr3U9DoydyTZmQEqpV6HpBzGAE-cEWp52ssRVXttra5Wk0tukbavZchGFT~uH4cv0AUyuSDEhvALRh-1MYxb1aGdizSy7Ao4jj2RK-iCDlbOaZLv45AnC2srGd5nzJjHn0T4JJ7h0UXgboUkeiGg-vXsFoomH5Jz0Xh~~fRRUR~5o3e3wTUgleUkY0knQFtx4y-DYDdb1l5yBh9WsO~GQuK3AAkU~hp7EkE3mmd0ITu5JWpQ4WDbEKxsws7lRE13upZLEp7iLrohTOLV0AAMqSUw34dSFUdM8UgoBkFuUSC-Q__&Key-Pair-Id=K2HSFNDJXOU9YS';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => scrollToSection('hero')}>
            <img src={LOGO_URL} alt="Sharaka Logo" className="h-12 w-12 object-contain" />
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-lg text-primary">شراكة</span>
              <span className="text-xs text-accent">شريك نجاحك</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('consultants')} className="text-foreground hover:text-primary transition-colors font-medium">
              المستشارون
            </button>
            <button onClick={() => scrollToSection('services')} className="text-foreground hover:text-primary transition-colors font-medium">
              الخدمات
            </button>
            <button onClick={() => scrollToSection('marketplace')} className="text-foreground hover:text-primary transition-colors font-medium">
              السوق
            </button>
            <button onClick={() => scrollToSection('points')} className="text-foreground hover:text-primary transition-colors font-medium">
              النقاط والرصيد
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-foreground hover:text-primary transition-colors font-medium">
              تواصل معنا
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-3 animate-in fade-in duration-200">
            <button onClick={() => scrollToSection('consultants')} className="text-right py-2 text-foreground hover:text-primary transition-colors font-medium">
              المستشارون
            </button>
            <button onClick={() => scrollToSection('services')} className="text-right py-2 text-foreground hover:text-primary transition-colors font-medium">
              الخدمات
            </button>
            <button onClick={() => scrollToSection('marketplace')} className="text-right py-2 text-foreground hover:text-primary transition-colors font-medium">
              السوق
            </button>
            <button onClick={() => scrollToSection('points')} className="text-right py-2 text-foreground hover:text-primary transition-colors font-medium">
              النقاط والرصيد
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-right py-2 text-foreground hover:text-primary transition-colors font-medium">
              تواصل معنا
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
