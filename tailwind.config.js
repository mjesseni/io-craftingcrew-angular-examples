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
            minWidth: {
                120: '30rem', // Adds min-w-120
            },
            maxWidth: {
                120: '30rem', // Adds max-w-120
            },
        },
    }, plugins: [require('tailwindcss-primeui')]
}
