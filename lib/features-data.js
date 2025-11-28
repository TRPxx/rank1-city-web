import { Users, Shield, Zap, Car, Briefcase, Home } from 'lucide-react';

export const features = [
    {
        id: "community",
        icon: Users,
        title: "สังคมคุณภาพ",
        description: "พบกับสังคมที่เป็นมิตรและช่วยเหลือกัน เราให้ความสำคัญกับ Roleplay ที่มีคุณภาพและการเคารพกฎ",
        image: "https://placehold.co/800x600/1e293b/ffffff?text=Community+Roleplay",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        stats: [
            { label: "Active Players", value: "500+" },
            { label: "Daily Events", value: "Everyday" }
        ]
    },
    {
        id: "systems",
        icon: Zap,
        title: "ระบบเสถียร",
        description: "Server ของเราใช้เทคโนโลยีล่าสุด รองรับผู้เล่นจำนวนมากโดยไม่มีอาการแลค พร้อมระบบป้องกันโปรแกรมโกง",
        image: "https://placehold.co/800x600/1e293b/ffffff?text=Stable+System",
        color: "text-yellow-500",
        bg: "bg-yellow-500/10",
        stats: [
            { label: "Uptime", value: "99.9%" },
            { label: "FPS", value: "60+" }
        ]
    },
    {
        id: "jobs",
        icon: Briefcase,
        title: "อาชีพหลากหลาย",
        description: "เลือกเส้นทางชีวิตของคุณเองได้ ไม่ว่าจะเป็นตำรวจ หมอ ช่าง หรืออาชีพสุจริตและผิดกฎหมายอื่นๆ อีกมากมาย",
        image: "https://placehold.co/800x600/1e293b/ffffff?text=Various+Jobs",
        color: "text-green-500",
        bg: "bg-green-500/10",
        stats: [
            { label: "Jobs", value: "20+" },
            { label: "Economy", value: "Balanced" }
        ]
    },
    {
        id: "cars",
        icon: Car,
        title: "รถสวยๆ เพียบ",
        description: "เลือกรถในฝันของคุณจากคอลเลกชันรถนำเข้ากว่า 100 คัน พร้อมระบบแต่งรถที่ละเอียดสมจริง",
        image: "https://placehold.co/800x600/1e293b/ffffff?text=Custom+Cars",
        color: "text-red-500",
        bg: "bg-red-500/10",
        stats: [
            { label: "Cars", value: "100+" },
            { label: "Tuning", value: "Full" }
        ]
    },
    {
        id: "housing",
        icon: Home,
        title: "ระบบบ้านและเฟอร์นิเจอร์",
        description: "ซื้อบ้านและตกแต่งได้ตามใจชอบ ด้วยระบบเฟอร์นิเจอร์ที่วางได้อิสระ สร้างพื้นที่ส่วนตัวของคุณเอง",
        image: "https://placehold.co/800x600/1e293b/ffffff?text=Housing+System",
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        stats: [
            { label: "Furniture", value: "500+" },
            { label: "Houses", value: "Unlimited" }
        ]
    },
    {
        id: "protection",
        icon: Shield,
        title: "ความปลอดภัยสูง",
        description: "ทีมงานดูแลตลอด 24 ชั่วโมง พร้อมระบบ Anti-Cheat ที่ทันสมัย เพื่อให้คุณเล่นเกมได้อย่างสบายใจ",
        image: "https://placehold.co/800x600/1e293b/ffffff?text=High+Security",
        color: "text-cyan-500",
        bg: "bg-cyan-500/10",
        stats: [
            { label: "Support", value: "24/7" },
            { label: "Protection", value: "Active" }
        ]
    }
];
