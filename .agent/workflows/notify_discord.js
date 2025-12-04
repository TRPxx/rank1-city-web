const fs = require('fs');
const { execSync } = require('child_process');
const https = require('https');

let commitMessage = "";
let commitMessageThai = "";
try {
  commitMessage = execSync('git log -1 --pretty=%B').toString().trim();

  // สร้างข้อความภาษาไทยที่ละเอียดจาก commit message
  // วิเคราะห์ commit message และสร้างคำอธิบายภาษาไทย
  // ใช้ข้อความ Commit Message ตามจริงที่ผู้ใช้พิมพ์
  commitMessageThai = "```ansi\n\u001b[1;36m" + commitMessage + "\u001b[0m\n```";

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
