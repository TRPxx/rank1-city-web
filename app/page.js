import fs from 'fs/promises';
import path from 'path';
import HomeClient from '@/components/HomeClient';

async function getFeatures() {
  try {
    const filePath = path.join(process.cwd(), 'lib', 'features.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Failed to load features:", error);
    return [];
  }
}

async function getSiteConfig() {
  try {
    const filePath = path.join(process.cwd(), 'lib', 'config.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Failed to load config:", error);
    return {};
  }
}

export default async function Page() {
  const [features, siteConfig] = await Promise.all([
    getFeatures(),
    getSiteConfig()
  ]);

  return <HomeClient initialFeatures={features} siteConfig={siteConfig} />;
}
