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

export default async function Page() {
  const features = await getFeatures();
  return <HomeClient initialFeatures={features} />;
}
