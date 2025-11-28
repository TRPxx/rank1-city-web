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
            // COMMON (60%)
            { id: 'starter_food', name: 'Starter Food Pack', chance: 20, rarity: 'COMMON', image: '/images/rewards/starter.png' },
            { id: 'small_money', name: 'Small Money Bag ($1,000)', chance: 20, rarity: 'COMMON', image: '/images/rewards/money.png' },
            { id: 'bandage', name: 'Bandage Box', chance: 20, rarity: 'COMMON', image: '/images/rewards/starter.png' },

            // RARE (30%)
            { id: 'iron_sword', name: 'Iron Sword', chance: 10, rarity: 'RARE', image: '/images/rewards/fantasy_sword.png' },
            { id: 'fashion_shirt', name: 'Trendy Shirt', chance: 10, rarity: 'RARE', image: '/images/rewards/shirt.png' },
            { id: 'gold_bar', name: 'Gold Bar (10g)', chance: 5, rarity: 'RARE', image: '/images/rewards/money.png' },
            { id: 'gacha_ticket', name: 'Premium Gacha Ticket', chance: 5, rarity: 'RARE', image: '/images/rewards/ticket.png' },

            // EPIC (9%)
            { id: 'golden_sword', name: 'Golden Guardian Sword', chance: 3, rarity: 'EPIC', image: '/images/rewards/fantasy_sword.png' },
            { id: 'gang_van_key', name: 'Gang Van Key', chance: 3, rarity: 'EPIC', image: '/images/rewards/gang_van.png' },
            { id: 'house_deed', name: 'Small House Deed', chance: 3, rarity: 'EPIC', image: '/images/rewards/gang_house.png' },

            // LEGENDARY (1%)
            { id: 'god_sword', name: 'God Slayer Sword', chance: 0.4, rarity: 'LEGENDARY', image: '/images/rewards/fantasy_sword.png' },
            { id: 'mansion_key', name: 'Luxury Mansion Key', chance: 0.3, rarity: 'LEGENDARY', image: '/images/rewards/gang_house.png' },
            { id: 'supercar_key', name: 'Supercar Key (GTR)', chance: 0.3, rarity: 'LEGENDARY', image: '/images/rewards/gang_van.png' },
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
