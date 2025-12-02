import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export const dynamic = 'force-dynamic';

const schemaSql = `
CREATE DATABASE IF NOT EXISTS \`rank1city_web\`;
USE \`rank1city_web\`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS \`gangs\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`name\` varchar(255) NOT NULL,
  \`gang_code\` varchar(50) NOT NULL,
  \`leader_discord_id\` varchar(50) NOT NULL,
  \`member_count\` int(11) DEFAULT 0,
  \`max_members\` int(11) DEFAULT 20,
  \`created_at\` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`gang_code\` (\`gang_code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`preregistrations\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`discord_id\` varchar(50) NOT NULL,
  \`discord_name\` varchar(255) NOT NULL,
  \`referral_code\` varchar(50) NOT NULL,
  \`referred_by\` varchar(50) DEFAULT NULL,
  \`gang_id\` int(11) DEFAULT NULL,
  \`invite_count\` int(11) DEFAULT 0,
  \`ticket_count\` int(11) DEFAULT 0,
  \`last_checkin\` datetime DEFAULT NULL,
  \`ip_address\` varchar(45) DEFAULT NULL,
  \`created_at\` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`discord_id\` (\`discord_id\`),
  UNIQUE KEY \`referral_code\` (\`referral_code\`),
  KEY \`gang_id\` (\`gang_id\`),
  CONSTRAINT \`fk_gang\` FOREIGN KEY (\`gang_id\`) REFERENCES \`gangs\` (\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`lucky_draw_history\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`discord_id\` varchar(50) NOT NULL,
  \`item_id\` varchar(50) NOT NULL,
  \`item_name\` varchar(255) NOT NULL,
  \`created_at\` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`),
  KEY \`discord_id\` (\`discord_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`claim_queue\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`discord_id\` varchar(50) NOT NULL,
  \`item_id\` varchar(50) NOT NULL,
  \`item_name\` varchar(255) NOT NULL,
  \`amount\` int(11) DEFAULT 1,
  \`status\` enum('pending','claimed') DEFAULT 'pending',
  \`created_at\` timestamp NULL DEFAULT current_timestamp(),
  \`claimed_at\` datetime DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`discord_id\` (\`discord_id\`),
  KEY \`status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
`;

export async function GET() {
  let logs = [];
  const log = (msg) => logs.push(msg);

  try {
    log('Starting DB Setup...');

    const host = process.env.WEB_DB_HOST || process.env.DB_HOST || 'localhost';
    const port = parseInt(process.env.WEB_DB_PORT || '3307');
    const user = process.env.WEB_DB_USER || process.env.DB_USER || 'root';
    // Fix: Only fallback to DB_PASSWORD if WEB_DB_PASSWORD is strictly undefined.
    // If it is empty string "", we should use empty string.
    const password = process.env.WEB_DB_PASSWORD !== undefined ? process.env.WEB_DB_PASSWORD : (process.env.DB_PASSWORD || '');

    log(`Config: Host=${host}, Port=${port}, User=${user}`);

    // 1. Try connecting without DB selected to create it
    const connection = await mysql.createConnection({
      host, port, user, password,
      multipleStatements: true
    });

    log('Connected to MySQL Server successfully.');

    // 2. Run Schema
    log('Executing Schema...');
    await connection.query(schemaSql);
    log('Schema executed successfully.');

    await connection.end();
    log('Connection closed.');

    return NextResponse.json({ success: true, logs });

  } catch (error) {
    console.error('Setup Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      logs
    }, { status: 500 });
  }
}
