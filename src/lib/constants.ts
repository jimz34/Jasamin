export const WHATSAPP_NUMBER = '62895392230443';
export const WHATSAPP_BASE_URL = 'https://wa.me';

export function getWhatsAppLink(productName: string): string {
  const message = encodeURIComponent(`Halo JASAMIN, saya ingin membeli: ${productName}`);
  return `${WHATSAPP_BASE_URL}/${WHATSAPP_NUMBER}?text=${message}`;
}

export const CATEGORIES = [
  'Jasa Desain',
  'Top Up',
  'Hosting',
  'Website',
  'Lainnya',
] as const;

export type Category = (typeof CATEGORIES)[number];
