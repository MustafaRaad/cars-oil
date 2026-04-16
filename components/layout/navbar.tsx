export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 text-foreground shadow-sm backdrop-blur-md supports-backdrop-filter:bg-background/65">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/25">
            <span
              className="h-4 w-4 rounded-sm bg-primary"
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
