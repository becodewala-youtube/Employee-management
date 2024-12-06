import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
}

export function Card({ title, value, icon, className }: CardProps) {
  return (
    <div className={clsx("bg-white rounded-lg shadow-sm p-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="p-3 bg-indigo-50 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );
}