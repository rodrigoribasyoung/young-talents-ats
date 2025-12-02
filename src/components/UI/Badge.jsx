import React from 'react';

export default function Badge({ children, colorClass }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${colorClass}`}>
      {children}
    </span>
  );
}