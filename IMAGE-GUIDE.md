# 📸 Guide to Adding Real Images

## Image positions on the site

### 1. Hero Section (Main fullscreen image)
**Location**: `src/app/page.tsx` - line ~35
**File to upload**: `/public/images/nutritionist-hero.jpg`
**Recommended size**: 1920x1080px (landscape)
**Subject**: Arianna in studio or professional work environment

**How to replace**:
```tsx
{/* Remove the placeholder and uncomment this line: */}
<img 
  src="/images/nutritionist-hero.jpg" 
  alt="Arianna Ciervo Nutritionist" 
  className="w-full h-full object-cover" 
/>
```

### 2. Studio/Kitchen Section
**Location**: `src/app/page.tsx` - line ~208
**File to upload**: `/public/images/studio-kitchen.jpg`
**Recommended size**: 800x600px (4:3)
**Subject**: Home studio with plants, professional setup, consulting environment

**How to replace**:
```tsx
{/* Remove the placeholder and uncomment this line: */}
<img 
  src="/images/studio-kitchen.jpg" 
  alt="Studio with plants" 
  className="w-full h-full object-cover" 
/>
```

## Photo tips

### Hero Photo (main)
- ✅ Plenty of natural light
