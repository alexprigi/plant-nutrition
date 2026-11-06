# Guide: How to Set Up Live Chat (Tawk.to)

> **Status: not active.** The site currently uses the internal pattern-matching chatbot in `src/components/ChatWidget.tsx` (see [CHATBOT-GUIDE.md](CHATBOT-GUIDE.md)). This guide is kept in case we decide to add Tawk.to as a live chat with a human.
> If Tawk.to is enabled, the privacy policy (`messages/*.json`, `cond-lista`) already lists it as a provider. The cookie banner/consent must also cover the Tawk.to script.

## Option 1: Tawk.to (RECOMMENDED - Free and GDPR compliant)

### Advantages:
- ✅ **Completely free** (no chat limit)
- ✅ **GDPR compliant** (EU servers available)
- ✅ **Mobile app** to reply anywhere
- ✅ **Color and position customization**
- ✅ **Widget language** configurable (the site is available in Italian, German and English)
- ✅ **Chat history** and analytics

### Tawk.to Setup (5 minutes):

1. **Sign up at [https://www.tawk.to/](https://www.tawk.to/)**
   - Create a free account
   - Enter site name: "Viva Plant Nutrition"

2. **Get the Widget Code**
   - Dashboard → Administration → Property Settings
   - Copy the **Property ID** and **Widget ID**
   - Example: `https://embed.tawk.to/YOUR_PROPERTY_ID/YOUR_WIDGET_ID`

3. **Configure on the Site**
   The current `ChatWidget.tsx` has no external script. To add Tawk.to, load the script client-side (only after cookie consent) in a component rendered by `src/app/[locale]/layout.tsx`:
   ```tsx
   const script = document.createElement('script');
   script.async = true;
   script.src = 'https://embed.tawk.to/YOUR_PROPERTY_ID/YOUR_WIDGET_ID';
   document.body.appendChild(script);
   ```
   Decide whether it replaces the internal chatbot or runs alongside it (two chat bubbles would overlap).

4. **Customize Widget**
   - Dashboard → Appearance
   - Change main color: `#4A5D23` (brand green)
   - Position: Bottom Right
