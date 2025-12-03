const fs = require('fs');
const { execSync } = require('child_process');
const https = require('https');

// Custom message provided by user, wrapped in code block for "black background" style
const customMessage = `\`\`\`markdown
🚀 Admin Dashboard: Full Data Simulation

จำลองข้อมูลครบวงจรสำหรับทดสอบ Dashboard!

[Simulated Data]
- 🏢 Gangs: สร้าง 15 แก๊ง (Red Dragons, Blue Sharks, etc.)
- 👥 Users: สร้าง 1,000 ผู้ใช้งาน
  - สุ่มวันที่สมัคร (30 วันย้อนหลัง)
  - สุ่มสังกัดแก๊ง (30%)
  - สุ่มจำนวนตั๋วและแต้ม
  - สุ่มการแนะนำเพื่อน (Referral System)
- 🎰 Spins: เพิ่มประวัติการสุ่มกาชา 500 รายการ (2 วันย้อนหลัง)
- 📊 Stats: อัปเดตจำนวนสมาชิกแก๊งและยอดเชิญเพื่อนให้ตรงตามจริง

Dashboard พร้อมใช้งานเต็มรูปแบบแล้ว!
\`\`\``;

const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
const shortHash = execSync('git rev-parse --short HEAD').toString().trim();
const fullHash = execSync('git rev-parse HEAD').toString().trim();
const commitUrl = "https://github.com/TRPxx/rank1-city-web/commit/" + fullHash;
const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
let stats = "";
try {
    stats = execSync('git diff --shortstat HEAD^ HEAD').toString().trim();
} catch (e) {
    stats = "Initial commit or no changes";
}

// Parse line numbers from git diff
let diffOutput = [];
try {
    diffOutput = execSync('git diff --unified=0 HEAD^ HEAD').toString().split('\n');
} catch (e) {
    diffOutput = [];
}

let fileDetails = [];
let currentFile = "";
let lines = [];

diffOutput.forEach(line => {
    if (line.match(/^\+\+\+ b\/(.*)/)) {
        if (currentFile !== "") {
            let lineStr = lines.join(", ");
            if (lineStr) { fileDetails.push("**" + currentFile + "**: " + lineStr); }
            else { fileDetails.push("**" + currentFile + "**"); }
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
            if (start === end) { lines.push("L" + start); } else { lines.push("L" + start + "-" + end); }
        }
    }
});
if (currentFile !== "") {
    let lineStr = lines.join(", ");
    if (lineStr) { fileDetails.push("**" + currentFile + "**: " + lineStr); }
    else { fileDetails.push("**" + currentFile + "**"); }
}

let detailedChanges = fileDetails.join("\n");
if (detailedChanges.length > 1000) { detailedChanges = detailedChanges.substring(0, 990) + "... (truncated)"; }
if (!detailedChanges) { detailedChanges = "No content changes (maybe binary files or renames)."; }
if (!stats) { stats = "Initial commit or no changes"; }

const payload = {
    username: "Rank1 City Deploy Bot",
    avatar_url: "https://rank1city.com/favicon.svg",
    embeds: [{
        title: "🚀 จำลองข้อมูล Dashboard (Full Simulation)",
        description: customMessage, // Using the code-blocked message
        color: 10181046, // Purple
        fields: [
            { name: "ผู้แก้ไข (Author)", value: "Bear", inline: true },
            { name: "สาขา (Branch)", value: branch, inline: true },
            { name: "รหัส (Hash)", value: "[" + shortHash + "](" + commitUrl + ")", inline: true },
            { name: "สถิติ (Stats)", value: stats, inline: true },
            { name: "เวลา (Timestamp)", value: timestamp, inline: true },
            { name: "📂 ไฟล์ที่แก้ไข (Files Changed)", value: "```yaml\n" + detailedChanges + "\n```", inline: false }
        ],
        footer: { text: "Rank1 City Web System • " + shortHash }
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
