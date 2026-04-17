/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './public/**/*.html'],
    theme: {
        extend: {
            fontSize: {
                xs: ['0.75rem', { lineHeight: '1.25', letterSpacing: '0.02em', fontWeight: '400' }],
                sm: ['0.875rem', { lineHeight: '1.375', letterSpacing: '0.03em', fontWeight: '400' }],
                base: ['1rem', { lineHeight: '1.5', letterSpacing: '0.03em', fontWeight: '400' }],
                lg: ['1.125rem', { lineHeight: '1.625', letterSpacing: '0.04em', fontWeight: '500' }],
                xl: ['1.25rem', { lineHeight: '1.75', letterSpacing: '0.04em', fontWeight: '500' }],
                '2xl': ['1.5rem', { lineHeight: '1.875', letterSpacing: '0.05em', fontWeight: '600' }],
                '3xl': ['1.875rem', { lineHeight: '2', letterSpacing: '0.05em', fontWeight: '600' }],
                '4xl': ['2.25rem', { lineHeight: '2.25', letterSpacing: '0.06em', fontWeight: '700' }],
                '5xl': ['3rem', { lineHeight: '1', letterSpacing: '0.06em', fontWeight: '700' }],
                '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '0.07em', fontWeight: '700' }],
                '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '0.07em', fontWeight: '700' }],
                '8xl': ['6rem', { lineHeight: '1', letterSpacing: '0.08em', fontWeight: '700' }],
                '9xl': ['8rem', { lineHeight: '1', letterSpacing: '0.08em', fontWeight: '700' }],
            },
            fontFamily: {
                heading: ["Satoshi", "Inter", "syne", "sans-serif"],
                paragraph: ["Inter", "space grotesk", "sans-serif"],
                "azeret-mono-black": ["azeret-mono-black", "azeret mono", "monospace"]
            },
            colors: {
                destructive: '#EF4444',
                'destructive-foreground': '#FFFFFF',
                'accent-teal': '#39FF14',
                'neon-pink': '#FF006E',
                'neon-purple': '#A100F2',
                'neon-cyan': '#00D9FF',
                'neon-blue': '#0099FF',
                'electric-pink': '#FF3399',
                'soft-shadow-gray': '#1E2A3A',
                background: '#0a0a0f',
                secondary: '#00D9FF',
                foreground: '#F0F0F0',
                'secondary-foreground': '#0A192F',
                'primary-foreground': '#FFFFFF',
                primary: '#0A192F'
            },
            boxShadow: {
                'neon-cyan': '0 0 15px rgba(0, 217, 255, 0.4)',
                'neon-purple': '0 0 15px rgba(123, 97, 255, 0.4)',
                'glow-sm': '0 0 5px rgba(255, 255, 255, 0.2)',
                'glow-md': '0 0 15px rgba(255, 255, 255, 0.1)',
                'glow-lg': '0 0 30px rgba(0, 217, 255, 0.15)',
                'soft-depth': '0 20px 40px -15px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 217, 255, 0.05)',
                'glass-inner': 'inset 0 1px 1px rgba(255, 255, 255, 0.1)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            },
            backgroundImage: {
                'gradient-neon': 'linear-gradient(135deg, #00D9FF 0%, #0099FF 50%, #A100F2 100%)',
                'gradient-neon-pink': 'linear-gradient(135deg, #FF006E 0%, #FF3399 50%, #A100F2 100%)',
                'gradient-glow': 'radial-gradient(circle at 50% 50%, rgba(0, 217, 255, 0.15), transparent)',
                'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            },
            keyframes: {
                'glow-pulse': {
                    '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 5px rgba(0, 217, 255, 0.3))' },
                    '50%': { opacity: '0.8', filter: 'drop-shadow(0 0 15px rgba(0, 217, 255, 0.6))' },
                },
                'fade-in': {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'slide-up': {
                    '0%': { opacity: '0', transform: 'translateY(40px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'background-pan': {
                    '0%': { backgroundPosition: '0% center' },
                    '100%': { backgroundPosition: '-200% center' },
                },
                'mesh-panning': {
                    '0%, 100%': { backgroundPosition: '0% 0%' },
                    '50%': { backgroundPosition: '100% 100%' },
                },
                'text-shimmer': {
                    '0%, 100%': { backgroundPosition: '-100% 0' },
                    '50%': { backgroundPosition: '100% 0' },
                },
                'scanner': {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(400%)' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'lens-flare': {
                    '0%': { left: '-100%', top: '0%' },
                    '100%': { left: '200%', top: '100%' },
                },
                'neon-border': {
                    '0%, 100%': { borderColor: 'rgba(0, 217, 255, 0.5)' },
                    '50%': { borderColor: 'rgba(0, 217, 255, 0.2)' },
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                }
            },
            animation: {
                'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
                'fade-in': 'fade-in 0.6s ease-out forwards',
                'slide-up': 'slide-up 0.8s ease-out forwards',
                'background-pan': 'background-pan 12s linear infinite',
                'mesh-panning': 'mesh-panning 20s ease-in-out infinite',
                'text-shimmer': 'text-shimmer 3s ease-in-out infinite',
                'scanner': 'scanner 4s linear infinite',
                'float': 'float 6s ease-in-out infinite',
                'lens-flare': 'lens-flare 5s ease-in-out infinite',
                'neon-border': 'neon-border 2s ease-in-out infinite',
                'shimmer': 'shimmer 8s infinite',
            },
        },
    },
    filter: {
        'blur-20': 'blur(20px)',
    },
    future: {
        hoverOnlyWhenSupported: true,
    },
    plugins: [],
}
