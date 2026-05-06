import { Outlet } from 'react-router-dom';
import React from 'react';

export function AppLayout() {
  return (
    <main>
      {/*header*/}
      {/*asider*/}
      {/*main*/}
      <React.Suspense>
        <Outlet />
      </React.Suspense>
    </main>
  );
}
