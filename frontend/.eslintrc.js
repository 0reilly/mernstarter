module.exports = {
  extends: [
    "react-app",
    "react-app/jest"
  ],
  plugins: [
    "react-hooks"
  ],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}; 