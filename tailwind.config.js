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
        customOrange: 'rgb(255, 155, 69)',    // your bright button color
      },
       fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        mont: ['Montserrat', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

