// Official myPaisaa contact + download destinations (from mypaisaa.com).
export const WHATSAPP_NUMBER = "919100007724";
export const SUPPORT_PHONE = "+91-7795 665 154";
export const SUPPORT_EMAIL = "info@mypaisaa.com";
export const LICENSE_URL = "https://www.mypaisaa.com/license.html";
export const TCHITS_URL = "https://tchits.telangana.gov.in/";
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.mypaisaa.app";
export const APP_STORE_URL =
  "https://apps.apple.com/in/app/mypaisaa/id1538162542";

export function waLink(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export const WA_GENERIC = waLink(
  "I'm interested in investing with myPaisaa.",
);

export function waPlanEnquiry(planName: string, monthly: number, months: number): string {
  return waLink(
    `Hi myPaisaa, I'd like to join the ${planName} — ₹${new Intl.NumberFormat("en-IN").format(monthly)}/month for ${months} months. Please share the next steps.`,
  );
}
