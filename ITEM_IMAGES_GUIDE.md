# 🎮 Item Images Setup Guide

## 📋 Overview
This guide explains how to sync and optimize item images from your Game Resource to the website.

---

## 🚀 Quick Start

### 1. **Sync Images from Game Resource**
Run this command in PowerShell (from project root):

```powershell
.\sync-items-images.ps1
```

This will copy all item images from:
```
C:\Users\Administrator\Desktop\Rank1 City\cfx-server-data\resources\[-Licence-]\[-Nc-]\nc_inventory\html\img\items
```

To:
```
C:\Websites\rank1-city-web\public\items\
```

---

## 📦 Usage in Your Code

### Basic Usage
```jsx
import ItemImage from '@/components/ItemImage';

export default function Inventory() {
    return (
        <div>
            <ItemImage itemName="water" />
            <ItemImage itemName="bread" />
            <ItemImage itemName="weapon_pistol" />
        </div>
    );
}
```

### Custom Size
```jsx
<ItemImage itemName="water" size={128} />
```

### With Label
```jsx
<ItemImage itemName="bread" size={96} showLabel />
```

### Priority Loading (Above the Fold)
```jsx
<ItemImage itemName="money" priority />
```

### Grid of Items
```jsx
<div className="grid grid-cols-5 gap-4">
    {inventory.map((item) => (
        <ItemImage 
            key={item.name}
            itemName={item.name}
            size={80}
            showLabel
        />
    ))}
</div>
```

---

## ⚡ Performance Features

### 1. **Automatic Optimization**
- Converts to **WebP** format automatically
- Reduces file size by **30-50%**
- Generates responsive sizes

### 2. **Lazy Loading**
- Images load only when visible
- Saves bandwidth and improves initial load

### 3. **Caching**
- Browser caches images for 1 year
- No repeated downloads

### 4. **Placeholder Fallback**
- Shows placeholder if image not found
- No broken image icons

---

## 📊 Expected Performance (2,000 Items)

| Metric | Value |
|--------|-------|
| **Total Images** | ~2,000 |
| **Original Size (PNG)** | ~100 MB |
| **Optimized Size (WebP)** | ~30-40 MB |
| **Initial Load** | ~10-20 images (visible on screen) |
| **Load Time** | <0.5s (with cache) |

---

## 🔄 Update Process

### **On Development Machine:**
1. Run sync script whenever Game Resource updates:
   ```powershell
   .\sync-items-images.ps1
   ```

2. Commit changes (Component only, not images):
   ```bash
   git add components/ItemImage.js
   git commit -m "Update item image component"
   git push
   ```

### **On DDC Server:**
1. Pull latest code:
   ```bash
   git pull
   ```

2. Run sync script to get latest images:
   ```powershell
   .\sync-items-images.ps1
   ```

3. Restart application:
   ```bash
   npm run build
   pm2 restart rank1-web
   ```

---

## 🛠️ Advanced Options

### **Image Optimization (Optional)**
If images are too large, install ImageMagick and uncomment the optimization section in `sync-items-images.ps1`:

```powershell
# Install ImageMagick
winget install ImageMagick.ImageMagick

# Uncomment lines 37-40 in sync-items-images.ps1
```

### **Custom Placeholder**
Replace `public/items/placeholder.png` with your custom placeholder image.

---

## 📁 File Structure

```
rank1-city-web/
├── components/
│   └── ItemImage.js          # Optimized component
├── public/
│   └── items/                # Item images (gitignored)
│       ├── water.png
│       ├── bread.png
│       ├── placeholder.png   # Fallback
│       └── ... (2,000 items)
├── sync-items-images.ps1     # Sync script
└── .gitignore                # Excludes /public/items/
```

---

## ❓ FAQ

**Q: Why are images not in Git?**
A: 2,000 images would make the repository huge. We sync them separately.

**Q: What if an item image is missing?**
A: The component shows a placeholder automatically.

**Q: How to update images?**
A: Just run `.\sync-items-images.ps1` again.

**Q: Can I use CDN?**
A: Yes! Upload to Cloudflare R2 or AWS S3 and change the path in ItemImage.js.

---

## 🎯 Next Steps

1. ✅ Run `.\sync-items-images.ps1` to get images
2. ✅ Use `<ItemImage itemName="..." />` in your code
3. ✅ Test on development: `npm run dev`
4. ✅ Deploy to DDC Server

**Done!** 🎉
