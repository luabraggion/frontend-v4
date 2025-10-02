'use client';

import { cn } from '@/lib/ui';
import React from 'react';

interface IPhoneMockupProps {
  children?: React.ReactNode;
  className?: string;
  color?: 'black' | 'white' | 'blue' | 'purple' | 'red';
  orientation?: 'portrait' | 'landscape';
  variant?: 'simple' | 'with-buttons';
}

export default function IPhoneMockup({
  children,
  className,
  color = 'black',
  orientation = 'portrait',
  variant = 'simple',
}: IPhoneMockupProps) {
  // Configurações de cores baseadas no parâmetro color
  const colorStyles = {
    black: {
      device: 'bg-gray-900',
      buttons: 'bg-gray-800',
      shadow: 'shadow-gray-900/20',
    },
    white: {
      device: 'bg-gray-100',
      buttons: 'bg-gray-200',
      shadow: 'shadow-gray-400/20',
    },
    blue: {
      device: 'bg-blue-800',
      buttons: 'bg-blue-900',
      shadow: 'shadow-blue-900/20',
    },
    purple: {
      device: 'bg-purple-800',
      buttons: 'bg-purple-900',
      shadow: 'shadow-purple-900/20',
    },
    red: {
      device: 'bg-red-800',
      buttons: 'bg-red-900',
      shadow: 'shadow-red-900/20',
    },
  };

  const selectedColor = colorStyles[color];

  return (
    <div
      className={cn(
        'relative mx-auto h-[600px] w-[300px] overflow-hidden rounded-[40px]',
        selectedColor.device,
        selectedColor.shadow,
        orientation === 'landscape' && 'h-[300px] w-[600px]',
        className,
      )}
    >
      {/* Notch */}
      <div className="absolute left-1/2 top-0 h-6 w-40 -translate-x-1/2 rounded-b-3xl bg-black"></div>

      {/* Ilha Dinâmica (Dynamic Island) */}
      <div className="absolute left-1/2 top-2 h-8 w-36 -translate-x-1/2 rounded-full bg-black"></div>

      {/* Câmera */}
      <div className="absolute right-32 top-4 h-3 w-3 rounded-full bg-blue-400/80"></div>

      {/* Speaker */}
      <div className="absolute left-32 top-4 h-2 w-12 rounded-full bg-gray-800"></div>

      {/* Botões laterais para variante com botões */}
      {variant === 'with-buttons' && (
        <>
          {/* Volume Up */}
          <div
            className={`absolute -left-1 top-24 h-12 w-1.5 rounded-r-lg ${selectedColor.buttons}`}
          ></div>

          {/* Volume Down */}
          <div
            className={`absolute -left-1 top-40 h-12 w-1.5 rounded-r-lg ${selectedColor.buttons}`}
          ></div>

          {/* Power Button */}
          <div
            className={`absolute -right-1 top-28 h-16 w-1.5 rounded-l-lg ${selectedColor.buttons}`}
          ></div>
        </>
      )}

      {/* Tela */}
      <div className="absolute inset-2 overflow-hidden rounded-[35px] bg-white">
        {/* Barra de status */}
        <div className="h-6 w-full bg-gray-100 flex justify-between items-center px-6 text-xs text-gray-900">
          <span>17:44</span>
          <div className="flex gap-1 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            <div className="ml-1 h-3 w-6 rounded-md bg-gray-900"></div>
          </div>
        </div>

        {/* Conteúdo da tela */}
        <div className="h-[calc(100%-3rem)] overflow-hidden">{children}</div>

        {/* Home indicator */}
        <div className="absolute bottom-1 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-gray-800"></div>
      </div>
    </div>
  );
}
