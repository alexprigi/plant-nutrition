/**
 * Regole per i messaggi di commit (stesso schema di apps-tolino, adattato a questo progetto):
 * "tipo: descrizione" in inglese, tipi convenzionali, riga di titolo fino a 72 caratteri, senza punto finale.
 * Qui non si usa lo scope in maiuscolo (id del ticket) né l'iniziale maiuscola del titolo.
 */
module.exports = {
  parserPreset: "conventional-changelog-conventionalcommits",

  plugins: [
    {
      rules: {
        // Regola personale: mai la riga Co-Authored-By né altre attribuzioni a strumenti
        "no-attribution": ({ raw }) => [
          !/co-authored-by|generated with/i.test(raw),
          "i messaggi di commit non devono contenere Co-Authored-By né altre righe di attribuzione",
        ],
      },
    },
  ],

  rules: {
    "no-attribution": [2, "always"],
    "body-leading-blank": [1, "always"],
    "body-max-line-length": [1, "always", 80],
    "footer-leading-blank": [1, "always"],
    "header-max-length": [2, "always", 72],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],
    "type-enum": [
      2,
      "always",
      ["build", "chore", "ci", "docs", "feat", "fix", "hotfix", "perf", "refactor", "revert", "style", "test"],
    ],
  },
};
