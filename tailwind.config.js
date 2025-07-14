/** @type {import('tailwindcss').Config} */
export default {
 content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
   
  theme: {
    extend: {
      colors: {
       customPurple: 'rgb(230, 220, 250)'
,    // your light background color
         // your bright button color
      },
       fontFamily: {
       poppins: ['Poppins', 'sans-serif'],
  mont: ['Montserrat', 'sans-serif'],
  roboto: ['Roboto', 'sans-serif'],
  inter: ['Inter', 'sans-serif'],
  urbanist: ['Urbanist', 'sans-serif'],
  playfair: ['Playfair Display', 'serif'],
      },
       animation: {
    'spin-slow': 'spin 3s linear infinite',
  },
    },
  },
  plugins: [],
}

