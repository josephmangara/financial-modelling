export default function Footer() {
  return (
    <footer className="border-t border-(--border)">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>
          © {new Date().getFullYear()} Joseph Mang'ara
        </p>

        <a
          href="https://creativecommons.org/licenses/by-nc/4.0/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit underline underline-offset-4 transition-opacity hover:opacity-70"
        >
          CC BY-NC 4.0 License
        </a>
      </div>
    </footer>
  );
}