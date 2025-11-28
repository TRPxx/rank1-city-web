const siteConfig = {
    // ข้อมูลทั่วไปของเว็บไซต์
    name: "Rank1 City",
    description: "The Ultimate FiveM Experience. Roleplay, Action, and Community.",

    // ลิงก์ Social Media และช่องทางติดต่อ
    links: {
        discord: "https://discord.gg/your-invite-link", // ใส่ลิงก์ Discord ของคุณ
        facebook: "https://facebook.com/your-page",
        youtube: "https://youtube.com/your-channel",
        tiktok: "https://tiktok.com/@your-account",
        download: "#", // ลิงก์ดาวน์โหลด Launcher หรือไฟล์เกม
        topup: "#",    // ลิงก์หน้าเติมเงิน
    },

    // เมนูนำทาง (Navbar)
    navItems: [
        { label: "สมัครสมาชิก", href: "#" },
        { label: "ดาวน์โหลด", href: "#" },
        { label: "เติมเงิน", href: "#" },
        { label: "ข่าวสาร", href: "/news" },
    ],

    // ข้อมูล Footer
    footer: {
        copyright: "© 2024 Published by RANK1 Development Co., Ltd. All Rights Reserved.",
        developer: {
            name: "RANK1",
            sub: "DEVELOPMENT"
        }
    }
};

export default siteConfig;
