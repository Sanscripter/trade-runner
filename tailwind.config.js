/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      spacing: {
        sidebar: "16.666667%",
      },
    },
  },
  mode: "jit",
  purge: {
    enabled: true,
    content: ["./src/**/*.{html,ts}"],
  },
  plugins: [
    require("postcss-import"),
    require("tailwindcss"),
    require("autoprefixer"),
  ],
  content: ["../src/**/*.html"],
};
