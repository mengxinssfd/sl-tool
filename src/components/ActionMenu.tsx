import { useState, useRef, useEffect, ReactNode } from 'react';

export interface MenuItem {
  icon: ReactNode;
  title: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

interface ActionMenuProps {
  items: MenuItem[];
  className?: string;
}

export function ActionMenu({ items, className = '' }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] rounded-xl hover:bg-[var(--color-border-hover)] hover:text-white transition-all duration-[var(--transition-normal)] border border-transparent hover:border-[var(--color-border)]"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="6" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="18" r="2" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 py-2 bg-[var(--color-bg-secondary)] rounded-xl shadow-[var(--shadow-lg)] border border-[var(--color-border)] z-50 min-w-[180px] animate-scaleIn"
          onMouseLeave={() => setIsOpen(false)}
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                if (!item.disabled) {
                  item.onClick();
                  setIsOpen(false);
                }
              }}
              disabled={item.disabled}
              className={`w-full px-4 py-2.5 flex items-center gap-3 text-left transition-all duration-[var(--transition-fast)] ${
                item.disabled
                  ? 'text-[var(--color-text-muted)] cursor-not-allowed opacity-50'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-white'
              } ${item.className || ''}`}
              title={item.title}
            >
              <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
