/**
 * BASE_PATH matches `basePath` in next.config.mjs.
 * All <img src> and CSS url() pointing to public/ files must be prefixed with this.
 * Next.js does NOT automatically prefix static asset paths in plain <img> or CSS.
 */
export const BASE_PATH = '/lumos-paola'

/** Prepend BASE_PATH to a public-folder path, e.g. '/images/hero.jpg' */
export const assetPath = (path: string) => `${BASE_PATH}${path}`
