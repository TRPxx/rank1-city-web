import config from './preregister-config.json';

export const PREREGISTER_CONFIG = {
    ...config,
    discord: {
        ...config.discord,
        guild_id: process.env.DISCORD_GUILD_ID,
        webhook_urls: {
            register: process.env.DISCORD_WEBHOOK_REGISTER,
            gang: process.env.DISCORD_WEBHOOK_GANG,
            luckyDraw: process.env.DISCORD_WEBHOOK_LUCKYDRAW,
        },
    }
};
