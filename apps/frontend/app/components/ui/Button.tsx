import React from 'react';

interface ButtonProps {
  text: string;
  classname?: string;
  onClick?: () => void;
}

export function Button({ text, classname = '', onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-6 py-3 rounded-lg font-semibold transition-all duration-300 
        transform hover:scale-105 active:scale-95 focus:outline-none 
        focus:ring-2 focus:ring-offset-2 focus:ring-red-500
        ${classname}
      `}
    >
      {text}
    </button>
  );
}