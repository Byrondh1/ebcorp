'use client'

import { useState, useEffect } from 'react'

const REPO   = 'Byrondh1/ebcorp'
const BRANCH = 'claude/design-website-architecture-cTk5D'
const IMAGE_EXTS = /\.(jpg|jpeg|png|webp|gif|avif)$/i

interface GHFile {
  name: string
  type: string
  download_url: string | null
}

/**
 * Fetches the list of images in `lumos-website/public/images/{folder}` from
 * the GitHub Contents API at runtime. Returns an array of direct image URLs.
 * Falls back to `fallback` if the API call fails or returns nothing.
 */
export function useGitHubImages(folder: string, fallback: string[] = []): string[] {
  const [images, setImages] = useState<string[]>(fallback)

  useEffect(() => {
    const url =
      `https://api.github.com/repos/${REPO}/contents/` +
      `lumos-website/public/images/${folder}?ref=${BRANCH}`

    fetch(url, { headers: { Accept: 'application/vnd.github+json' } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: GHFile[]) => {
        const imgs = data
          .filter((f) => f.type === 'file' && IMAGE_EXTS.test(f.name) && f.download_url)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((f) => f.download_url as string)
        if (imgs.length > 0) setImages(imgs)
      })
      .catch(() => {
        /* keep fallback */
      })
  }, [folder])

  return images
}

/** Converts a filename to a display label: "about-rosas.jpg" → "About Rosas" */
export function fileLabel(downloadUrl: string): string {
  const filename = downloadUrl.split('/').pop() ?? ''
  return filename
    .replace(/\.[^.]+$/, '')           // remove extension
    .replace(/[-_]+/g, ' ')            // dashes/underscores → spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()) // title case
}
