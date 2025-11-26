import type { HelmetOptions } from 'helmet';
import { isDevelopment, isProduction } from './env.js';

export const securityConfig: HelmetOptions = {
  contentSecurityPolicy: {
    directives: {
      // Default policy: only allow resources from same origin
      defaultSrc: ["'self'"],

      // Scripts: Where JavaScript can come from
      scriptSrc: [
        "'self'", // Our own scripts
        // Development only: Vite needs inline scripts for HMR (Hot Module replacement)
        ...(isDevelopment ? ["'unsafe-inline'"] : []),
      ],

      // Styles: Where CSS can come from
      styleSrc: [
        "'self'",
        // Tailwind CSS v4 uses inline styles
        // TODO: Replace with nonce-based approach in production
        "'unsafe-inline'",
      ],

      // API calls: Where fetch/axios can connect to
      connectSrc: [
        "'self'", // Same origin (Vite proxy handles this)
        // Development only: Vite dev server WebSocket for HMR
        ...(isDevelopment ? ['ws://localhost:5173'] : []),
      ],

      // Images: Where images can load from
      imgSrc: ["'self'", 'data:', 'blob:'],

      // Fonts: Where fonts can load from
      fontSrc: ["'self'", 'data:'],

      // Forms: Where forms can submit to
      formAction: ["'self'"],

      // Frames: Prevent clickjacking
      frameAncestors: ["'none'"],

      // Base URI: Prevent <base> tag injection
      baseUri: ["'self'"],

      // Upgrade insecure requests in production
      ...(isProduction ? { upgradeInsecureRequests: [] } : {}),
    },
  },

  // other security headers (already configured by helmet())
  crossOriginEmbedderPolicy: false, // Allow image from external sources if needed later
};
