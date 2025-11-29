'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Menu, X } from 'lucide-react';

// Z-index scale for consistent layering
export const zIndex = {
  overlay: 'z-40',
  sidebar: 'z-50',
  header: 'z-10',
} as const;

// Sidebar context for state management
interface SidebarContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

// Provider component
interface SidebarProviderProps {
  children: ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return (
    <SidebarContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

// Mobile overlay (backdrop)
export function SidebarOverlay() {
  const { isOpen, close } = useSidebar();

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 ${zIndex.overlay} bg-black/50 md:hidden`}
      onClick={close}
      aria-hidden="true"
    />
  );
}

// Sidebar container with slide animation
interface SidebarContainerProps {
  children: ReactNode;
  className?: string;
}

export function SidebarContainer({ children, className = '' }: SidebarContainerProps) {
  const { isOpen } = useSidebar();

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 ${zIndex.sidebar} w-72 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:w-64 md:flex-shrink-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${className}
      `}
    >
      {children}
    </aside>
  );
}

// Sidebar header with close button (mobile only)
interface SidebarHeaderProps {
  children?: ReactNode;
}

export function SidebarHeader({ children }: SidebarHeaderProps) {
  const { close } = useSidebar();

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 md:hidden">
      {children || <span className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Files</span>}
      <button
        onClick={close}
        className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-gray-100"
        aria-label="Close sidebar"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

// Mobile header bar with hamburger menu
interface MobileHeaderProps {
  title: string;
  sticky?: boolean;
}

export function MobileHeader({ title, sticky = false }: MobileHeaderProps) {
  const { open } = useSidebar();

  return (
    <div className={`flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white md:hidden ${sticky ? `sticky top-0 ${zIndex.header}` : ''}`}>
      <button
        onClick={open}
        className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>
      <span className="font-medium text-gray-900 truncate">{title}</span>
    </div>
  );
}

