export default function manifest() {
    return {
        name: 'Rank1 City',
        short_name: 'Rank1',
        description: 'The best FiveM Roleplay experience in Thailand',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#000000',
        icons: [
            {
                src: '/favicon.svg',
                sizes: 'any',
                type: 'image/svg+xml',
            },
        ],
    }
}

