import { useRouteError } from 'react-router-dom';

export function ErrorLayout() {
  const err = useRouteError() as {
    statusText?: string;
    status?: number;
  } & Error;
  return (
    <>
      <strong>Error {err.status || 500}</strong>:{' '}
      {err.statusText ?? err.message}
    </>
  );
}
