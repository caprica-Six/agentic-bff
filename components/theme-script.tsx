import { THEME_STORAGE_KEY } from "@/lib/theme";

const THEME_INIT_SCRIPT = `
(function () {
  const storageKey = ${JSON.stringify(THEME_STORAGE_KEY)};
  const storedTheme = localStorage.getItem(storageKey);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = storedTheme === "light" || storedTheme === "dark"
    ? storedTheme
    : (prefersDark ? "dark" : "light");

  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />;
}
