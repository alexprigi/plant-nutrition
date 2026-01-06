# Guide: How to Set Up Live Chat

## Option 1: Tawk.to (RECOMMENDED - Free and GDPR compliant)

### Advantages:
- ✅ **Completely free** (no chat limit)
- ✅ **GDPR compliant** (EU servers available)
- ✅ **Mobile app** to reply anywhere
- ✅ **Color and position customization**
- ✅ **Widget in Italian**
- ✅ **Chat history** and analytics

### Tawk.to Setup (5 minutes):

1. **Sign up at [https://www.tawk.to/](https://www.tawk.to/)**
   - Create a free account
   - Enter site name: "Pura Essenza Vegetale"

2. **Get the Widget Code**
   - Dashboard → Administration → Property Settings
   - Copy the **Property ID** and **Widget ID**
   - Example: `https://embed.tawk.to/YOUR_PROPERTY_ID/YOUR_WIDGET_ID`

3. **Configure on the Site**
   Open: `/src/components/ChatWidget.tsx`
   
   Replace this line:
   ```tsx
   script.src = 'https://embed.tawk.to/YOUR_PROPERTY_ID/YOUR_WIDGET_ID';
   ```
   
   With your IDs:
   ```tsx
   script.src = 'https://embed.tawk.to/67a1b2c3d4e5f6g7h8i9/1jk2lm3no4pq5rs';
   ```

4. **Customize Widget**
   - Dashboard → Appearance
   - Change main color: `#4A5D23` (brand green)
   - Position: Bottom Right
