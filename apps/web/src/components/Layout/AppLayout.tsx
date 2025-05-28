import { type PropsWithChildren } from "react";
import { LeftMenuWrapper } from "../Menu/LeftMenuWrapper";
import { TopMenu } from "./TopMenu";
import { ThemeContextProvider } from "../Themes/ThemeContext";
import { Suspense } from "react";

function LoadingMenu() {
  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-200 dark:border-gray-800">
        <div className="h-10 w-10 animate-pulse bg-gray-200 rounded-full" />
        <div className="ml-4 h-6 w-32 animate-pulse bg-gray-200 rounded" />
      </div>
      <div className="p-6 space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex space-x-3">
                <div className="h-7 w-7 bg-gray-200 rounded-md animate-pulse" />
                <div className="h-7 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AppLayout({
  children,
  query,
}: PropsWithChildren<{ query?: string }>) {
  return (
    <ThemeContextProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-72 lg:flex-col">
          <Suspense fallback={<LoadingMenu />}>
            <LeftMenuWrapper />
          </Suspense>
        </div>

        {/* Main content */}
        <div className="lg:pl-72">
          <TopMenu query={query} />
          <main className="py-6">
            <div className="px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ThemeContextProvider>
  );
}
