// Lightweight user-agent parsing — no dependency, just enough to label a login
// as e.g. "Chrome on Windows (Desktop)" or "Safari on iPhone (Mobile)".

function detectBrowser(ua: string): string {
  if (/edg\//i.test(ua)) return "Edge";
  if (/opr\//i.test(ua) || /opera/i.test(ua)) return "Opera";
  if (/chrome|crios/i.test(ua)) return "Chrome";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  if (/safari/i.test(ua)) return "Safari";
  return "Unknown Browser";
}

function detectOS(ua: string): string {
  if (/iphone/i.test(ua)) return "iPhone";
  if (/ipad/i.test(ua)) return "iPad";
  if (/android/i.test(ua)) return "Android";
  if (/windows/i.test(ua)) return "Windows";
  if (/mac os x|macintosh/i.test(ua)) return "Mac";
  if (/linux/i.test(ua)) return "Linux";
  return "Unknown OS";
}

function detectDeviceType(ua: string): "Mobile" | "Tablet" | "Desktop" {
  if (/ipad|tablet/i.test(ua)) return "Tablet";
  if (/mobi|iphone|android/i.test(ua)) return "Mobile";
  return "Desktop";
}

export function describeDevice(userAgent: string | null | undefined): string {
  if (!userAgent) return "Unknown Device";
  const browser = detectBrowser(userAgent);
  const os = detectOS(userAgent);
  const type = detectDeviceType(userAgent);
  return `${browser} on ${os} (${type})`;
}
