// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       backgroundImage: {
//         'Bajaj_Bg': "url('/src/assets/Bajaj_Bg.png')",
//       }
//     }
//   },
//   plugins: [],
// }


module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './dist/**/*.js',
    './node_modules/roll-up-packaging-library/dist/*.js',
  ],
  theme: {
    extend: {
      // Add custom styles here if needed
      backgroundImage: {
        'Bajaj_Bg': "url('/src/assets/Bajaj_Bg.png')",
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'), // Install and use this plugin for scrollbar hiding
  ],
};
