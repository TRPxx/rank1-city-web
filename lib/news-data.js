export const categories = [
  {
    id: 'all',
    label: 'ทั้งหมด',
    color: 'bg-slate-600 dark:bg-slate-500',
    textColor: 'text-white'
  },
  {
    id: 'promotion',
    label: 'โปรโมชั่น',
    color: 'bg-amber-500 dark:bg-yellow-400',
    textColor: 'text-white dark:text-black'
  },
  {
    id: 'event',
    label: 'กิจกรรม',
    color: 'bg-red-600 dark:bg-red-500',
    textColor: 'text-white'
  },
  {
    id: 'news',
    label: 'ข่าวสาร',
    color: 'bg-blue-600 dark:bg-blue-500',
    textColor: 'text-white'
  },
  {
    id: 'update',
    label: 'อัปเดต',
    color: 'bg-emerald-600 dark:bg-green-400',
    textColor: 'text-white dark:text-black'
  },
];

export const newsData = [
  {
    id: '1',
    title: 'ต้อนรับ Season 2 แจกไอเทมยกเซิร์ฟ!',
    category: 'event',
    date: '2024-01-15',
    excerpt: 'กิจกรรมต้อนรับการกลับมาอย่างยิ่งใหญ่ เพียงแค่ล็อกอินเข้าเกมก็รับของรางวัลทันที',
    image: 'https://placehold.co/600x400/ef4444/ffffff?text=Season+2+Event',
    content: `
      <p>ยินดีต้อนรับเข้าสู่ Rank1 City Season 2!</p>
      <p>เพื่อเป็นการเฉลิมฉลองการเปิดตัวซีซั่นใหม่ เราได้เตรียมกิจกรรมพิเศษไว้สำหรับผู้เล่นทุกคน เพียงแค่ล็อกอินเข้าเกมในช่วงเวลากิจกรรม รับไปเลย:</p>
      <ul>
        <li>- Starter Pack Season 2</li>
        <li>- เงินในเกม $50,000</li>
        <li>- รถยนต์ Limited Edition (7 วัน)</li>
      </ul>
      <p>ระยะเวลากิจกรรม: 15 - 31 มกราคม 2024</p>
    `
  },
  {
    id: '2',
    title: 'โปรโมชั่นเติมเงินคูณ 2 ต้อนรับปีใหม่',
    category: 'promotion',
    date: '2024-01-10',
    excerpt: 'คุ้มที่สุดแห่งปี! เติมเงินผ่านทุกช่องทางรับ Point x2 ทันที ไม่มีขั้นต่ำ',
    image: 'https://placehold.co/600x400/eab308/ffffff?text=Topup+x2',
    content: `
      <p>โปรโมชั่นสุดคุ้มต้อนรับปีใหม่มาแล้ว!</p>
      <p>เพียงเติมเงินผ่านช่องทางใดก็ได้ (TrueMoney, PromptPay, Credit Card) รับ Point คูณ 2 ทันทีทุกยอดเติมเงิน</p>
      <p>พิเศษ! เติมครบ 1,000 บาท รับสิทธิ์ลุ้นรับรถกาชาปองฟรี 1 สิทธิ์</p>
    `
  },
  {
    id: '3',
    title: 'Patch Note v2.0.1 - ปรับสมดุลอาวุธ',
    category: 'update',
    date: '2024-01-20',
    excerpt: 'รายละเอียดการปรับปรุงระบบอาวุธและแก้ไขบั๊กต่างๆ ในเวอร์ชัน 2.0.1',
    image: 'https://placehold.co/600x400/22c55e/ffffff?text=Patch+v2.0.1',
    content: `
      <h3>รายการอัปเดต v2.0.1</h3>
      <ul>
        <li>ปรับดาเมจอาวุธ Pistol Mk2 ลดลง 10%</li>
        <li>เพิ่มระยะหวังผลของ Assault Rifle</li>
        <li>แก้ไขบั๊กตัวละครติดอนิเมชั่นเมื่อลงรถ</li>
        <li>เพิ่มจุดตกปลาใหม่ 3 จุด</li>
      </ul>
    `
  },
  {
    id: '4',
    title: 'ประกาศเปิดรับสมัครทีมงาน Support รุ่นที่ 5',
    category: 'news',
    date: '2024-01-05',
    excerpt: 'โอกาสดีสำหรับผู้ที่อยากร่วมงานกับเรา เปิดรับสมัครทีมงานดูแลผู้เล่นจำนวนมาก',
    image: 'https://placehold.co/600x400/3b82f6/ffffff?text=Recruitment',
    content: `
      <p>Rank1 City กำลังมองหาทีมงานรุ่นใหม่ไฟแรง!</p>
      <p>หากคุณเป็นคนที่มีใจรักในการบริการ มีความรับผิดชอบ และเข้าใจระบบเกม FiveM เป็นอย่างดี อย่ารอช้า สมัครเลย!</p>
      <p>คุณสมบัติ:</p>
      <ul>
        <li>อายุ 18 ปีขึ้นไป</li>
        <li>มีเวลาออนไลน์อย่างน้อยวันละ 4-6 ชั่วโมง</li>
        <li>มีไมโครโฟนที่ชัดเจน</li>
      </ul>
    `
  },
  {
    id: '5',
    title: 'ระบบโรงพยาบาลแบบใหม่ เร็วๆ นี้',
    category: 'update',
    date: '2024-01-25',
    excerpt: 'พรีวิวระบบหมอและโรงพยาบาลใหม่ ที่สมจริงและสนุกกว่าเดิม',
    image: 'https://placehold.co/600x400/22c55e/ffffff?text=New+Hospital',
    content: `
      <p>เตรียมพบกับระบบการรักษาแบบใหม่ ที่จะทำให้บทบาทหมอมีความสำคัญมากขึ้น</p>
      <p>ระบบใหม่จะมีการวินิจฉัยโรค การผ่าตัด และการพักฟื้นที่สมจริง รวมถึงอุปกรณ์ทางการแพทย์ใหม่ๆ อีกมากมาย</p>
    `
  },
  {
    id: '6',
    title: 'Flash Sale! กล่องสุ่มแฟชั่นลด 50%',
    category: 'promotion',
    date: '2024-01-28',
    excerpt: 'ลดกระหน่ำ 24 ชั่วโมงเท่านั้น กับกล่องสุ่มชุดแฟชั่นระดับ Rare',
    image: 'https://placehold.co/600x400/eab308/ffffff?text=Flash+Sale',
    content: `
      <p>Flash Sale มาแล้ว!</p>
      <p>กล่องสุ่ม Fashion Box A ลดราคา 50% เหลือเพียง 500 Point (จากปกติ 1,000 Point)</p>
      <p>ระยะเวลา: 28 ม.ค. 00:00 - 23:59 น. เท่านั้น</p>
    `
  }
];
