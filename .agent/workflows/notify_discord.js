const fs = require('fs');
const { execSync } = require('child_process');
const https = require('https');

let commitMessage = "";
let commitMessageThai = "";
try {
  commitMessage = execSync('git log -1 --pretty=%B').toString().trim();

  // สร้างข้อความภาษาไทยที่ละเอียดจาก commit message
  // วิเคราะห์ commit message และสร้างคำอธิบายภาษาไทย
  if (commitMessage.includes('Leaderboard') || commitMessage.includes('leaderboard')) {
    commitMessageThai = "```ansi\n";
    commitMessageThai += "\u001b[1;35m✨ เพิ่มฟีเจอร์ใหม่: ระบบอันดับผู้เล่น (Leaderboard)\u001b[0m\n\n";
    commitMessageThai += "\u001b[1;36m📊 รายละเอียด:\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m• เพิ่ม Tab อันดับใหม่ใน Admin Dashboard\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m• แสดง Top 50 ผู้ครอบครองตั๋วเยอะที่สุด (พร้อม Avatar + สีพิเศษสำหรับ Top 3)\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m• แสดง Top 50 ผู้ใช้งานเยอะที่สุด (นับจากจำนวนครั้งสุ่มกาชา)\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m• ใช้ Icon มงกุฎ 👑 และเหรียญ 🥈🥉 สำหรับอันดับ 1-3\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m• Responsive Design - ทำงานได้ทั้ง Desktop และ Mobile\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m• API Endpoint ใหม่: /api/admin?type=leaderboard\u001b[0m\n\n";

    if (commitMessage.includes('QA')) {
      commitMessageThai += "\u001b[1;33m📝 เพิ่มเติม:\u001b[0m\n";
      commitMessageThai += "\u001b[0;33m• QA Simulation Report - รายงานทดสอบระบบ 5,000 ผู้ใช้พร้อมกัน\u001b[0m\n";
      commitMessageThai += "\u001b[0;33m• ระบุ bugs และ race conditions ที่พบ\u001b[0m\n";
      commitMessageThai += "\u001b[0;33m• แนะนำการแก้ไขปัญหา performance และ security\u001b[0m\n";
    }
    commitMessageThai += "```";
  } else if (commitMessage.includes('Redesign') || commitMessage.includes('UI')) {
    commitMessageThai = "```ansi\n";
    commitMessageThai += "\u001b[1;35m🎨 อัปเดตดีไซน์ใหม่: Premium UI Redesign\u001b[0m\n\n";

    commitMessageThai += "\u001b[1;36m✨ รายละเอียดการปรับปรุง:\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m• 💎 Glassmorphism Design - ดีไซน์กระจกสุดหรู\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m• 🎬 Animations - เพิ่ม Effect การเคลื่อนไหวด้วย Framer Motion\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m• 🌈 Gradients - ปรับโทนสีให้ดูพรีเมียมขึ้น\u001b[0m\n";
    commitMessageThai += "\u001b[0;33m  • Gang: Amber/Gold Theme (สีทองหรูหรา)\u001b[0m\n";
    commitMessageThai += "\u001b[0;33m  • Family: Rose/Pink Theme (สีชมพูอบอุ่น)\u001b[0m\n\n";

    commitMessageThai += "\u001b[1;36m📱 หน้าที่ปรับปรุง:\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m• GangManager.js - หน้าจัดการแก๊ง\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m• FamilyManager.js - หน้าจัดการครอบครัว\u001b[0m\n\n";

    commitMessageThai += "\u001b[1;36m💡 Features:\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m✅ Card Layout แบบใหม่ ดูง่ายขึ้น\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m✅ Loading States ที่สวยงาม\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m✅ Responsive Design รองรับมือถือสมบูรณ์แบบ\u001b[0m\n";
    commitMessageThai += "```";
  } else if (commitMessage.includes('Gang Members') || commitMessage.includes('gang members')) {
    commitMessageThai = "```ansi\n";
    commitMessageThai += "\u001b[1;35m🎉 เพิ่มฟีเจอร์ใหม่: รายชื่อสมาชิกแก๊ง (Gang Members List)\u001b[0m\n\n";
    commitMessageThai += "\u001b[1;36m1️⃣ API Endpoint ใหม่:\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m• Endpoint: GET /api/gang/members?gangCode=GANG-XXXX\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m• ดึงรายชื่อสมาชิกทั้งหมดจาก gang_code\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m• เรียงลำดับหัวหน้าไว้ข้างบนสุด\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m• แสดงข้อมูล: Discord ID, Name, Avatar, วันที่เข้าร่วม, is_leader\u001b[0m\n\n";

    commitMessageThai += "\u001b[1;36m2️⃣ Component Update:\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m• เพิ่ม members state และ isMembersLoading\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m• เพิ่ม fetchMembers() function\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m• Auto-fetch สมาชิกเมื่อมีข้อมูลแก๊ง\u001b[0m\n\n";

    commitMessageThai += "\u001b[1;36m3️⃣ UI Features:\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m✅ แสดงรายชื่อสมาชิกพร้อม:\u001b[0m\n";
    commitMessageThai += "\u001b[0;33m  • หมายเลขลำดับ (#1, #2, ...)\u001b[0m\n";
    commitMessageThai += "\u001b[0;33m  • Avatar (หรือ placeholder ถ้าไม่มี)\u001b[0m\n";
    commitMessageThai += "\u001b[0;33m  • ชื่อ Discord + Discord ID\u001b[0m\n";
    commitMessageThai += "\u001b[0;33m  • Badge \"หัวหน้า\" 👑 สีทอง สำหรับหัวหน้าแก๊ง\u001b[0m\n";
    commitMessageThai += "\u001b[0;33m  • วันที่เข้าร่วม (รูปแบบไทย)\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m✅ Loading State - แสดง spinner ขณะโหลดข้อมูล\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m✅ Empty State - แสดงข้อความเมื่อยังไม่มีสมาชิก\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m✅ Scrollable - รายชื่อเลื่อนได้ถ้าสมาชิกเยอะ\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m✅ Hover Effect - รายการสมาชิกเปลี่ยนสีเมื่อเอาเมาส์ชี้\u001b[0m\n";
    commitMessageThai += "```";
  } else if (commitMessage.includes('Family') || commitMessage.includes('family')) {
    commitMessageThai = "```ansi\n";
    commitMessageThai += "\u001b[1;35m👨‍👩‍👧‍👦 เพิ่มฟีเจอร์ใหม่: ระบบครอบครัว (Family System)\u001b[0m\n\n";

    commitMessageThai += "\u001b[1;36m1️⃣ API Endpoints ใหม่:\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m• POST /api/family - สร้าง/เข้าร่วมครอบครัว\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m• GET /api/family - ดูข้อมูลครอบครัว\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m• GET /api/family/members - รายชื่อสมาชิก\u001b[0m\n";
    commitMessageThai += "\u001b[0;33m• รหัสครอบครัว: FAM-XXXX\u001b[0m\n\n";

    commitMessageThai += "\u001b[1;36m2️⃣ Component ใหม่:\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m• FamilyManager.js - โคลนจาก GangManager\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m• เปลี่ยน emoji เป็น 👨‍👩‍👧‍👦 (ครอบครัว)\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m• UI เหมือนแก๊ง แต่เป็นครอบครัว\u001b[0m\n\n";

    commitMessageThai += "\u001b[1;36m3️⃣ ⚠️ เงื่อนไข Exclusive (สำคัญ!):\u001b[0m\n";
    commitMessageThai += "\u001b[1;31m• ห้ามมีทั้งแก๊งและครอบครัวพร้อมกัน\u001b[0m\n";
    commitMessageThai += "\u001b[0;33m  • มีแก๊ง → ไม่สามารถเข้าครอบครัว\u001b[0m\n";
    commitMessageThai += "\u001b[0;33m  • มีครอบครัว → ไม่สามารถเข้าแก๊ง\u001b[0m\n\n";

    commitMessageThai += "\u001b[1;36m4️⃣ การแก้ไข Gang API:\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m• เช็ค family_id ก่อนสร้าง/เข้าร่วมแก๊ง\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m• Query: SELECT gang_id, family_id FROM preregistrations\u001b[0m\n\n";

    commitMessageThai += "\u001b[1;36m5️⃣ UI Features:\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m✅ รายชื่อสมาชิกพร้อม Avatar\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m✅ Badge \"หัวหน้า\" สำหรับหัวหน้าครอบครัว\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m✅ Responsive Design + Loading/Empty States\u001b[0m\n";
    commitMessageThai += "\u001b[0;32m✅ Scrollable Member List\u001b[0m\n";
    commitMessageThai += "```";
  } else {
    commitMessageThai = commitMessage;
  }

} catch (e) {
  commitMessage = "Manual Update (No commit message found)";
  commitMessageThai = "อัปเดตระบบด้วยตนเอง (ไม่พบข้อความ commit)";
}

const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
const shortHash = execSync('git rev-parse --short HEAD').toString().trim();
const fullHash = execSync('git rev-parse HEAD').toString().trim();
const commitUrl = "https://github.com/TRPxx/rank1-city-web/commit/" + fullHash;
const thaiTime = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' (GMT+7)';

let stats = "";
let statsThai = "";
try {
  stats = execSync('git diff --shortstat HEAD^ HEAD').toString().trim();

  // แปลง stats เป็นภาษาไทย
  const insertMatch = stats.match(/(\d+) insertion/);
  const deleteMatch = stats.match(/(\d+) deletion/);
  const filesMatch = stats.match(/(\d+) file/);

  if (filesMatch) {
    const filesCount = filesMatch[1];
    const insertCount = insertMatch ? insertMatch[1] : '0';
    const deleteCount = deleteMatch ? deleteMatch[1] : '0';
    statsThai = `📝 ${filesCount} ไฟล์ | ➕ ${insertCount} บรรทัด | ➖ ${deleteCount} บรรทัด`;
  } else {
    statsThai = stats;
  }
} catch (e) {
  stats = "Initial commit or no changes";
  statsThai = "Commit แรก หรือไม่มีการเปลี่ยนแปลง";
}

// Parse detailed file changes with diff stats
let diffOutput = [];
let numstatOutput = [];
try {
  diffOutput = execSync('git diff --unified=0 HEAD^ HEAD').toString().split('\n');
  numstatOutput = execSync('git diff --numstat HEAD^ HEAD').toString().trim().split('\n');
} catch (e) {
  diffOutput = [];
  numstatOutput = [];
}

// Parse numstat for detailed file stats
let fileStats = {};
numstatOutput.forEach(line => {
  const parts = line.split('\t');
  if (parts.length >= 3) {
    const additions = parts[0] === '-' ? '0' : parts[0];
    const deletions = parts[1] === '-' ? '0' : parts[1];
    const filename = parts[2];
    fileStats[filename] = { additions, deletions };
  }
});

let fileDetails = [];
let currentFile = "";
let lines = [];

diffOutput.forEach(line => {
  if (line.match(/^\+\+\+ b\/(.*)/)) {
    if (currentFile !== "") {
      let lineStr = lines.join(", ");
      const stats = fileStats[currentFile];
      let fileInfo = "📄 `" + currentFile + "`";

      if (stats) {
        fileInfo += `\n   📊 ${stats.additions !== '0' ? '➕ ' + stats.additions : ''} ${stats.deletions !== '0' ? '➖ ' + stats.deletions : ''}`.trim();
      }

      if (lineStr) {
        fileInfo += "\n   📍 บรรทัด: `" + lineStr + "`";
      }

      fileDetails.push(fileInfo);
    }
    currentFile = line.match(/^\+\+\+ b\/(.*)/)[1];
    lines = [];
  }
  else if (line.match(/^@@ .* \+(\d+)(?:,(\d+))? @@/)) {
    const matches = line.match(/^@@ .* \+(\d+)(?:,(\d+))? @@/);
    const start = parseInt(matches[1]);
    const count = matches[2] ? parseInt(matches[2]) : 1;
    if (count > 0) {
      const end = start + count - 1;
      if (start === end) { lines.push(start.toString()); }
      else { lines.push(start + "-" + end); }
    }
  }
});

if (currentFile !== "") {
  let lineStr = lines.join(", ");
  const stats = fileStats[currentFile];
  let fileInfo = "📄 `" + currentFile + "`";

  if (stats) {
    fileInfo += `\n   📊 ${stats.additions !== '0' ? '➕ ' + stats.additions : ''} ${stats.deletions !== '0' ? '➖ ' + stats.deletions : ''}`.trim();
  }

  if (lineStr) {
    fileInfo += "\n   📍 บรรทัด: `" + lineStr + "`";
  }

  fileDetails.push(fileInfo);
}

let detailedChanges = fileDetails.join("\n\n");
if (detailedChanges.length > 1000) {
  detailedChanges = detailedChanges.substring(0, 990) + "\n... (มีไฟล์เพิ่มเติม)";
}
if (!detailedChanges) {
  detailedChanges = "ไม่มีการเปลี่ยนแปลงเนื้อหา (อาจเป็นไฟล์ binary หรือเปลี่ยนชื่อ)";
}
if (!statsThai) {
  statsThai = "Commit แรก หรือไม่มีการเปลี่ยนแปลง";
}

// สร้างสรุปการเปลี่ยนแปลงแบบละเอียด
let changeSummary = "";
if (Object.keys(fileStats).length > 0) {
  changeSummary = "```diff\n";
  Object.keys(fileStats).forEach(file => {
    const stats = fileStats[file];
    const plus = stats.additions !== '0' ? '+'.repeat(Math.min(parseInt(stats.additions) / 10, 20)) : '';
    const minus = stats.deletions !== '0' ? '-'.repeat(Math.min(parseInt(stats.deletions) / 10, 20)) : '';
    changeSummary += `${file}\n`;
    if (plus) changeSummary += `+ ${stats.additions} lines added ${plus}\n`;
    if (minus) changeSummary += `- ${stats.deletions} lines removed ${minus}\n`;
    changeSummary += "\n";
  });
  changeSummary += "```";
  if (changeSummary.length > 1024) {
    changeSummary = changeSummary.substring(0, 1010) + "\n... (ตัดข้อความ)\n```";
  }
} else {
  changeSummary = "```ไม่มีข้อมูล```";
}

const payload = {
  username: "Rank1 City Deploy Bot",
  avatar_url: "https://rank1city.com/favicon.svg",
  embeds: [{
    title: "🚀 อัปเดตระบบเรียบร้อยแล้ว!",
    description: commitMessageThai,
    color: 5763719,
    fields: [
      { name: "👨‍💻 ผู้แก้ไข", value: "```ansi\n\u001b[1;36mBear (TeeGa)\u001b[0m\n```", inline: true },
      { name: "🌿 สาขา", value: "```ansi\n\u001b[1;32m" + branch + "\u001b[0m\n```", inline: true },
      { name: "🔗 Commit Hash", value: "[`" + shortHash + "`](" + commitUrl + ")", inline: true },
      { name: "📊 สถิติการเปลี่ยนแปลง", value: "```fix\n" + statsThai + "\n```", inline: false },
      { name: "⏰ เวลาที่ Push", value: "```yaml\n" + thaiTime + "\n```", inline: false },
      { name: "📂 ไฟล์ที่แก้ไข (รายละเอียด)", value: detailedChanges, inline: false },
      { name: "📈 สรุปการเปลี่ยนแปลง", value: changeSummary, inline: false },
      { name: "💬 Commit Message (Original)", value: "```ansi\n\u001b[1;33m" + commitMessage + "\u001b[0m\n```", inline: false }
    ],
    footer: { text: "Rank1 City Web System • Deployed Successfully ✅" },
    timestamp: new Date().toISOString()
  }]
};

const data = JSON.stringify(payload);

const options = {
  hostname: 'discord.com',
  port: 443,
  path: '/api/webhooks/1445144998495518821/uHIfO9ZeYt87If-UveTqVaeNP3TikHBwgw5TsAuJrC3tlhkWu6LWNcOTL0aepa3vyUP5',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = https.request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.write(data);
req.end();
