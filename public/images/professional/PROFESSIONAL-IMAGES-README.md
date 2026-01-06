# Professional Images Folder

This folder contains professional photos of nutritionist Arianna Ciervo to be used on the website.

## Recommended structure:

### `/professional/`
Photos of the nutritionist for different sections of the site:

- `arianna-hero.jpg` - Main photo for homepage (high quality, 1920x1080px)
- `arianna-portrait.jpg` - Professional portrait for "About Me" page (800x800px)
- `arianna-pregnant.jpg` - Photo during pregnancy (for connection with pregnant clients)
- `arianna-studio.jpg` - Photo in the studio/work environment
- `arianna-consultation.jpg` - Photo during a consultation (client facing away for privacy)
- `arianna-pregnant-consultation.jpg` - Photo with pregnant client (client facing away/blurred)

### `/testimonials/`
Client photos for testimonials (with privacy consent):

- Use initials for file names: `giulia-m.jpg`, `marco-s.jpg`
- If real photos are not available, the component uses automatic placeholders
- Recommended size: 200x200px, square format

### `/recipes/`
Vegan recipe photos:

- Name with recipe slug: `protein-bowl.jpg`, `chickpea-burger.jpg`
- Recommended size: 800x600px (4:3)
- High quality for visual appeal

## Image Optimization

Before uploading images:

1. **Resize** to recommended dimensions
2. **Compress** with tools like TinyPNG or Squoosh
3. **Convert to WebP** for better performance (Next.js does this automatically with the Image component)

## File Naming Format
