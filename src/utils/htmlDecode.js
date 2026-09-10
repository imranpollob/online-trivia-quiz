/**
 * Safely decodes HTML entities (e.g. &quot;, &#039;, &eacute;, &amp;)
 * into clean plain text for UI rendering and copying.
 */
export function decodeHtml(html) {
  if (!html || typeof html !== 'string') return '';

  if (typeof DOMParser !== 'undefined') {
    try {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.documentElement.textContent || '';
    } catch {
      // Fallback below
    }
  }

  const parser = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
    '&rsquo;': "'",
    '&lsquo;': "'",
    '&rdquo;': '"',
    '&ldquo;': '"',
    '&ndash;': '–',
    '&mdash;': '—',
    '&hellip;': '…',
    '&eacute;': 'é',
    '&aacute;': 'á',
    '&iacute;': 'í',
    '&oacute;': 'ó',
    '&uacute;': 'ú',
    '&ntilde;': 'ñ',
    '&uuml;': 'ü'
  };

  return html.replace(/&[#\w]+;/g, match => parser[match] || match);
}
