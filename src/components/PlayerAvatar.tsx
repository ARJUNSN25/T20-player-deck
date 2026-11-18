import { useState } from 'react';
import { Contingent } from '../types/player';

interface PlayerAvatarProps {
  name: string;
  imagePath: string;
  contingent: Contingent;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<PlayerAvatarProps['size']>, string> = {
  sm: 'w-9 h-9 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-20 h-20 text-lg',
  xl: 'w-full aspect-[4/4.3] text-3xl',
};

export function PlayerAvatar({
  name,
  imagePath,
  contingent,
  size = 'md',
  className = '',
}: PlayerAvatarProps) {
  const [hasError, setHasError] = useState(false);

  const initials = name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const fallbackBg =
    contingent === 'batsman'
      ? 'bg-gradient-to-br from-blue-950 via-blue-900 to-slate-800 text-white'
      : 'bg-gradient-to-br from-slate-900 via-amber-950 to-slate-800 text-amber-100';

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={`${name} portrait placeholder`}
        className={`flex items-center justify-center font-display font-bold select-none ${SIZE_CLASSES[size]} ${fallbackBg} ${className}`}
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden bg-slate-100 border border-slate-200/80 ${SIZE_CLASSES[size]} ${className}`}
    >
      <img
        src={imagePath}
        alt={`${name} headshot portrait`}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover object-top"
        loading="lazy"
      />
    </div>
  );
}
