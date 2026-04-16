export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-primary/30 bg-primary text-primary-foreground shadow-lg shadow-primary/20">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-foreground/15 ring-1 ring-primary-foreground/25 backdrop-blur-sm">
            <span
              className="h-4 w-4 rounded-sm bg-primary-foreground"
              aria-hidden="true"
            />
          </div>
          <span className="text-base font-semibold tracking-wide sm:text-lg">
            شركة الأسد لتجارة الزيوت والفلاتر
          </span>
        </div>
      </div>
    </header>
  );
}
