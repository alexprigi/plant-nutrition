import type { MetadataRoute } from 'next'
import { IS_PRODUCTION_SITE, SITE_URL } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  if (!IS_PRODUCTION_SITE) return { rules: { userAgent: '*', disallow: '/' } }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
