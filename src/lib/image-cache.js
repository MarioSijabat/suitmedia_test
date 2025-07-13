import fs from 'fs';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), 'public', 'image-cache');
const META_FILE = path.join(CACHE_DIR, 'cached-images.json');

function initializeCache() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(META_FILE)) {
    fs.writeFileSync(META_FILE, '{}', 'utf-8');
  }
}

initializeCache();

function getFilenameFromUrl(url) {
  return Buffer.from(url).toString('base64url') + '.cache';
}

export async function checkCache(url) {
  try {
    const rawData = fs.readFileSync(META_FILE, 'utf-8');
    const meta = rawData ? JSON.parse(rawData) : {};
    const filename = getFilenameFromUrl(url);
    const filePath = path.join(CACHE_DIR, filename);
    
    if (meta[url] && fs.existsSync(filePath)) {
      return {
        buffer: fs.readFileSync(filePath),
        contentType: meta[url].contentType,
        timestamp: meta[url].timestamp
      };
    }
    return null;
  } catch (error) {
    console.error('Cache check error:', error);
    return null;
  }
}

export async function saveToCache(url, buffer, contentType) {
  try {
    const rawData = fs.readFileSync(META_FILE, 'utf-8');
    const meta = rawData ? JSON.parse(rawData) : {};
    const filename = getFilenameFromUrl(url);
    
    fs.writeFileSync(path.join(CACHE_DIR, filename), buffer);
    meta[url] = {
      contentType,
      timestamp: Date.now()
    };
    
    fs.writeFileSync(META_FILE, JSON.stringify(meta, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Cache save error:', error);
    return false;
  }
}