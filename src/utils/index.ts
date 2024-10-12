export const getCanonicalUrl = () => {
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    // We're on a Vercel deployment (production or preview)
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  } else if (process.env.NEXT_PUBLIC_SITE_URL) {
    // We're on a custom domain or another hosting provider
    return process.env.NEXT_PUBLIC_SITE_URL;
  } else {
    // Fallback for local development
    return 'http://localhost:3000';
  }
};