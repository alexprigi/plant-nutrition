// Controlli prima di ogni commit: ESLint solo sui file modificati (un avviso blocca il commit) e controllo dei tipi su tutto il progetto
module.exports = {
  "*.{js,jsx,ts,tsx,mjs}": ["eslint --fix --max-warnings 0"],
  // Funzione: lint-staged non passa i nomi dei file a tsc, che deve guardare l'intero progetto
  "*.{ts,tsx}": () => "tsc --noEmit",
};
