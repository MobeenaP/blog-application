'use client';

import type { PropsWithChildren } from "react";

export function LinkList(props: PropsWithChildren<{ title: string }>) {
  return (
    <div className="space-y-4">
      <h2 className="px-3 text-lg font-semibold text-gray-900 dark:text-white">{props.title}</h2>
      <div className="space-y-1">
        {props.children}
      </div>
    </div>
  );
}
