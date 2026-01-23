// Check if text contains Persian/Arabic characters (RTL)
export function isRTL(text: string): boolean {
  if (!text) return false;

  // Persian/Arabic Unicode ranges
  const rtlRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return rtlRegex.test(text);
}

// Get appropriate font family based on text direction
export function getFontFamily(text: string): string {
  return isRTL(text)
    ? 'Vazirmatn, "Segoe UI", sans-serif'
    : '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
}

// Get text direction
export function getTextDirection(text: string): 'rtl' | 'ltr' {
  return isRTL(text) ? 'rtl' : 'ltr';
}
