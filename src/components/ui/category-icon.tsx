import {
  Sparkles,
  Hand,
  Wind,
  Baby,
  Pill,
  Sun,
  Droplets,
  Palette,
  User,
  Stethoscope,
  Leaf,
  Activity,
  Heart,
  ShoppingBag,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  Sparkles,
  Hand,
  Wind,
  Baby,
  Pill,
  Sun,
  Droplets,
  Palette,
  User,
  Stethoscope,
  Leaf,
  Activity,
  Heart,
  ShoppingBag,
};

export function CategoryIcon({ name, className }: { name?: string | null; className?: string }) {
  const Icon = (name && ICONS[name]) || ShoppingBag;
  return <Icon className={className} aria-hidden />;
}
