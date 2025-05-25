
export function applyInitialTheme() {
  const userTheme = localStorage.theme;
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const shouldUseDark = userTheme === "dark" || (!userTheme && systemPrefersDark);

  document.documentElement.classList.toggle("dark", shouldUseDark);
}
