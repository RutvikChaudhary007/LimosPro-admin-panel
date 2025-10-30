export default {
  extends: ["@commitlint/config-conventional"],

  rules: {
    // --- Type rules ---
    "type-enum": [
      2,
      "always",
      [
        "feat",     // new feature
        "fix",      // bug fix
        "chore",    // maintenance, build, deps
        "docs",     // documentation only
        "style",    // code style / formatting
        "refactor", // code change that neither fixes nor adds
        "perf",     // performance improvement
        "test",     // adding or updating tests
        "revert",   // reverting a commit
        "ci",       // CI/CD configuration
        "build",    // build system or dependency change
      ],
    ],

    // --- Scope rules ---
    "scope-empty": [0], // ✅ scope is optional now
    "scope-case": [2, "always", "kebab-case"],

    // --- Subject rules ---
    "subject-case": [0],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],

    // --- Body rules ---
    "body-leading-blank": [1, "always"],
    "body-max-line-length": [1, "always", 100],

    // --- Footer rules ---
    "footer-leading-blank": [1, "always"],

    // --- Header rules ---
    "header-max-length": [2, "always", 100],
  },
};