// Module-level store for the latest selfie data URL.
// Survives SPA navigation without size limits (unlike History API state or sessionStorage).
let _selfie: string | null = null;

export const selfieStore = {
  set: (dataUrl: string) => { _selfie = dataUrl; },
  get: (): string | null => _selfie,
};
