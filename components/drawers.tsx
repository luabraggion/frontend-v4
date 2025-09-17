'use client';

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string; // Adicionando a prop description como opcional
  children?: ReactNode;
  className?: string;
  actions?: ReactNode;
}

export default function Drawer({
  open = false,
  onClose,
  title = 'Panel title',
  description, // Adicionando a prop description
  children,
  className = '',
  actions,
}: DrawerProps) {
  return (
    <Dialog open={open} onClose={onClose} className={`relative z-10 ${className}`}>
      <div className="fixed inset-0" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-xl transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
            >
              <div className="relative flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl dark:bg-gray-800 dark:after:absolute dark:after:inset-y-0 dark:after:left-0 dark:after:w-px dark:after:bg-white/10">
                <div className="px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1.5">
                      <DialogTitle className="text-base font-semibold text-gray-900 dark:text-white">
                        {title}
                      </DialogTitle>
                      {description && (
                        <p className="text-muted-foreground text-sm">{description}</p>
                      )}
                    </div>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={onClose}
                        className="relative rounded-md text-gray-400 hover:text-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:hover:text-white dark:focus-visible:outline-indigo-500"
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <X aria-hidden="true" className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative mt-10 flex-1 px-4 sm:px-6">{children}</div>
                {actions && <div className="px-4 sm:px-6 mt-4">{actions}</div>}
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
