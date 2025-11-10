export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "subject-case": [2, "never", ["sentence-case", "start-case", "pascal-case", "upper-case"]],
    "body-max-line-length": [1, "always", 100],
    "footer-leading-blank": [1, "always"],
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "chore", "docs", "style", "refactor", "perf", "test", "ci", "build", "revert"],
    ],
  },
};
