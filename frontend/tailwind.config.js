module.exports = {
    content: [
      "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // adjust paths to your files
    ],
    theme: {
      extend: {},
    },
    plugins: [
        require('@tailwindcss/forms'),
      ],
  };