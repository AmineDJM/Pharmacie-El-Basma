import * as React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'white' | 'whatsapp' | 'danger';
type Size = 'sm' | 'md' | 'lg' | 'icon';

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-primary-foreground shadow-soft hover:bg-primary-600 hover:shadow-glow active:scale-[0.98]',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-accent active:scale-[0.98]',
  outline:
    'border border-border bg-card text-foreground hover:border-primary/40 hover:bg-accent active:scale-[0.98]',
  ghost: 'text-foreground hover:bg-accent active:scale-[0.98]',
  white: 'bg-white text-primary-700 shadow-soft hover:bg-white/90 active:scale-[0.98]',
  whatsapp: 'bg-[#25D366] text-white shadow-soft hover:brightness-105 active:scale-[0.98]',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5 rounded-lg',
  md: 'h-11 px-5 text-sm gap-2 rounded-xl',
  lg: 'h-13 px-7 text-base gap-2.5 rounded-xl py-3.5',
  icon: 'h-11 w-11 rounded-xl',
};

export function buttonVariants({
  variant = 'primary',
  size = 'md',
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(
    'inline-flex select-none items-center justify-center whitespace-nowrap font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  );
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={buttonVariants({ variant, size, className })} {...props} />
  ),
);
Button.displayName = 'Button';
