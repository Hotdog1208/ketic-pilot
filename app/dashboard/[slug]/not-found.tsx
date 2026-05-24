export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-12 text-center">
      <div className="text-label uppercase text-text-muted">404</div>
      <h1 className="mt-4 text-title text-text-primary">Property not found</h1>
      <p className="mt-3 text-body text-text-muted">
        This dashboard link is invalid or has been retired.
      </p>
    </main>
  );
}
