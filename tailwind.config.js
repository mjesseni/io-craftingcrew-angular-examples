/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,ts}",],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                custom: ['Poppins', 'sans-serif'],
            },
            screens: {
                'xl2': '1960px', // Custom breakpoint
            },
        },
    }, plugins: [require('tailwindcss-primeui')]
}
