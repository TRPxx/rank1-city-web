export const PREREGISTER_CONFIG = {
    // ⚙️ General Settings
    features: {
        enableGang: true,
        enableLuckyDraw: true,
        enableDailyCheckin: true,
    },
    dates: {
        start: "2025-12-01T00:00:00Z",
        end: "2025-12-31T23:59:59Z",
    },
    limits: {
        max_gang_members: 20,
        min_account_age_days: 30, // ป้องกันบัญชีไก่ (Discord Account Age)
        max_ip_regis: 3, // จำกัด 1 IP สมัครได้ไม่เกิน 3 ไอดี
    },

    // 🎁 Rewards Configuration
    rewards: {
        individual: [
            { count: 1, name: "Starter Pack (ยา/อาหาร)", image: "/images/rewards/starter.png" },
            { count: 3, name: "Money $5,000", image: "/images/rewards/money.png" },
            { count: 5, name: "Limited Fashion Item", image: "/images/rewards/shirt.png", roleId: "tier1_role_id" },
            { count: 10, name: "Gacha Car Ticket", image: "/images/rewards/ticket.png", roleId: "tier2_role_id" },
        ],
        gang: [
            { count: 10, name: "Gang House (Temporary)", image: "/images/rewards/gang_house.png" },
            { count: 20, name: "Gang Van + $50,000 Fund", image: "/images/rewards/gang_van.png" },
        ],
        global: [
            { count: 100, name: "Starter Pack (ยา/อาหาร)", image: "/images/rewards/starter.png" },
            { count: 500, name: "Money $5,000", image: "/images/rewards/money.png" },
            { count: 1000, name: "Limited Fashion Item", image: "/images/rewards/shirt.png" },
            { count: 2500, name: "Gacha Car Ticket", image: "/images/rewards/ticket.png" },
            { count: 5000, name: "Gang House & Van (สุ่มแจก)", image: "/images/rewards/gang_house.png" },
        ],
    },

    // 🎰 Lucky Draw Pool (Rate: 0-100%)
    luckyDraw: {
        costPerSpin: 1, // ใช้ 1 Ticket ต่อการหมุน
        items: [
            { id: 'starter_pack', name: 'Starter Pack (Money $5000)', chance: 60, rarity: 'COMMON' },
            { id: 'vip_3d', name: 'VIP 3 Days', chance: 30, rarity: 'RARE' },
            { id: 'car_gtr', name: 'Nissan GTR R35', chance: 9, rarity: 'EPIC' },
            { id: 'limited_pet', name: 'Limited Pet: Cyber Dog', chance: 1, rarity: 'LEGENDARY' },
        ],
    },

    // 🤖 Discord Integration & Security
    discord: {
        guild_id: process.env.DISCORD_GUILD_ID,
        admin_ids: ['793410711396024370'], // TeeGa's Discord ID
        webhook_urls: {
            register: process.env.DISCORD_WEBHOOK_REGISTER,
            gang: process.env.DISCORD_WEBHOOK_GANG,
            luckyDraw: process.env.DISCORD_WEBHOOK_LUCKYDRAW,
        },
    },
};
