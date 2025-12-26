/**
 * Static translations for common property types
 * These don't need API calls since they're standard terms
 */
export const propertyTypeTranslations: Record<string, Record<string, string>> = {
  en: {
    "Single Family": "Single Family",
    "Condo": "Condo",
    "Townhouse": "Townhouse",
    "Villa": "Villa",
    "Multi-Family": "Multi-Family",
    "Land": "Land",
    "Commercial": "Commercial",
    "For Sale": "For Sale",
    "Active": "Active",
    "Pending": "Pending",
    "Sold": "Sold",
    "Waterfront": "Waterfront",
  },
  es: {
    "Single Family": "Casa Unifamiliar",
    "Condo": "Condominio",
    "Townhouse": "Casa Adosada",
    "Villa": "Villa",
    "Multi-Family": "Multifamiliar",
    "Land": "Terreno",
    "Commercial": "Comercial",
    "For Sale": "En Venta",
    "Active": "Activo",
    "Pending": "Pendiente",
    "Sold": "Vendido",
    "Waterfront": "Frente al Agua",
  },
};

export function translatePropertyType(
  type: string,
  locale: "en" | "es"
): string {
  return propertyTypeTranslations[locale]?.[type] || type;
}

export function translateStatus(
  status: string,
  locale: "en" | "es"
): string {
  return propertyTypeTranslations[locale]?.[status] || status;
}
