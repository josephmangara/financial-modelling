export default function Header() {
  return (
    <header className="border-b border-(--border)">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="/" className="text-lg font-semibold tracking-tight">
          Financial Model
        </a>

        <span className="text-lg">
          2026
        </span>
      </div>

    </header>
  );
}
