import React, { useState } from 'react';
import { Leaf, Cpu, BarChart3, BookOpen, Menu, X, ShieldCheck } from 'lucide-react';
import { ModelStatusBadge } from './ModelStatusBadge';
import { ModelStatus } from '../services/onnxModelService';

export type ActivePage = 'home' | 'predict' | 'results' | 'diseases';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  modelStatus: ModelStatus;
  modelMessage: string;
  modelError: string | null;
  onRetryModelLoad: () => void;
  hasResults: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  modelStatus,
  modelMessage,
  modelError,
  onRetryModelLoad,
  hasResults,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: Cpu },
    { id: 'predict', label: 'Disease Prediction', icon: Leaf },
    { id: 'results', label: 'Prediction Results', icon: BarChart3, disabled: !hasResults },
    { id: 'diseases', label: 'Disease Guide', icon: BookOpen },
  ];

  const handleNavClick = (pageId: string, disabled?: boolean) => {
    if (disabled) return;
    setActivePage(pageId as ActivePage);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            onClick={() => setActivePage('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <Leaf className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight group-hover:text-emerald-700 transition-colors">
                  MangoVision <span className="text-emerald-600">AI</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-emerald-100 text-emerald-800 rounded-md">
                  VGG16 ONNX
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                Mango Leaf Disease Classification System
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  disabled={item.disabled}
                  onClick={() => handleNavClick(item.id, item.disabled)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                    item.disabled
                      ? 'text-slate-300 cursor-not-allowed opacity-60'
                      : isActive
                      ? 'bg-emerald-50 text-emerald-800 shadow-xs ring-1 ring-emerald-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 cursor-pointer'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action / Status Badge */}
          <div className="hidden lg:flex items-center gap-3">
            <ModelStatusBadge
              status={modelStatus}
              message={modelMessage}
              error={modelError}
              onRetry={onRetryModelLoad}
            />
            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md" title="Zero Backend: All inference runs client-side in your browser">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Client-Side</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <ModelStatusBadge
              status={modelStatus}
              message="Loading..."
              error={modelError}
              onRetry={onRetryModelLoad}
            />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-100 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                disabled={item.disabled}
                onClick={() => handleNavClick(item.id, item.disabled)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  item.disabled
                    ? 'text-slate-300 cursor-not-allowed'
                    : isActive
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.disabled && (
                  <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded">
                    Requires Image
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

