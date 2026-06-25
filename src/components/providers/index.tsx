'use client';

import { ThemeProvider } from 'next-themes';
import { StoreProvider } from './store-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <StoreProvider>{children}</StoreProvider>
    </ThemeProvider>
  );
}
