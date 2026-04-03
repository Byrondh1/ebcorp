import { MetadataRoute } from 'next'

const SITE_URL = 'https://byrondh1.github.io/lumos-paola'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
