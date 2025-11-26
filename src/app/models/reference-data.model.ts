export interface Currency {
  code: string;
  name: string;
}

export interface UnitOfMeasure {
  code: string;
  name: string;
}

// Common ISO 4217 Currency Codes
export const CURRENCIES: Currency[] = [
  { code: 'EUR', name: 'Euro' },
  { code: 'USD', name: 'US Dollar' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'BRL', name: 'Brazilian Real' },
  { code: 'MXN', name: 'Mexican Peso' },
  { code: 'ZAR', name: 'South African Rand' },
  { code: 'SEK', name: 'Swedish Krona' },
  { code: 'NOK', name: 'Norwegian Krone' },
  { code: 'DKK', name: 'Danish Krone' },
  { code: 'PLN', name: 'Polish Zloty' },
  { code: 'RUB', name: 'Russian Ruble' },
  { code: 'SGD', name: 'Singapore Dollar' },
  { code: 'HKD', name: 'Hong Kong Dollar' },
  { code: 'KRW', name: 'South Korean Won' },
  { code: 'TRY', name: 'Turkish Lira' },
  { code: 'AED', name: 'UAE Dirham' },
  { code: 'SAR', name: 'Saudi Riyal' },
  { code: 'ILS', name: 'Israeli Shekel' },
  { code: 'THB', name: 'Thai Baht' },
  { code: 'MYR', name: 'Malaysian Ringgit' },
  { code: 'IDR', name: 'Indonesian Rupiah' },
  { code: 'NZD', name: 'New Zealand Dollar' },
  { code: 'PHP', name: 'Philippine Peso' },
  { code: 'IQD', name: 'Iraqi Dinar' }
];

// Common Units of Measure
export const UNITS_OF_MEASURE: UnitOfMeasure[] = [
  // Quantity
  { code: 'EA', name: 'Each' },
  { code: 'PC', name: 'Piece' },
  { code: 'SET', name: 'Set' },
  { code: 'PAA', name: 'Pair' },
  { code: 'DZN', name: 'Dozen' },
  { code: 'GRO', name: 'Gross' },
  
  // Weight
  { code: 'KGM', name: 'Kilogram' },
  { code: 'GRM', name: 'Gram' },
  { code: 'MGM', name: 'Milligram' },
  { code: 'TNE', name: 'Metric Ton' },
  { code: 'LBR', name: 'Pound' },
  { code: 'ONZ', name: 'Ounce' },
  
  // Length
  { code: 'MTR', name: 'Meter' },
  { code: 'CMT', name: 'Centimeter' },
  { code: 'MMT', name: 'Millimeter' },
  { code: 'KMT', name: 'Kilometer' },
  { code: 'FOT', name: 'Foot' },
  { code: 'INH', name: 'Inch' },
  { code: 'YRD', name: 'Yard' },
  { code: 'SMI', name: 'Mile' },
  
  // Area
  { code: 'MTK', name: 'Square Meter' },
  { code: 'CMK', name: 'Square Centimeter' },
  { code: 'KMK', name: 'Square Kilometer' },
  { code: 'FTK', name: 'Square Foot' },
  { code: 'INK', name: 'Square Inch' },
  { code: 'YDK', name: 'Square Yard' },
  { code: 'ACR', name: 'Acre' },
  { code: 'HAR', name: 'Hectare' },
  
  // Volume
  { code: 'LTR', name: 'Liter' },
  { code: 'MLT', name: 'Milliliter' },
  { code: 'MTQ', name: 'Cubic Meter' },
  { code: 'CMQ', name: 'Cubic Centimeter' },
  { code: 'DMQ', name: 'Cubic Decimeter' },
  { code: 'FTQ', name: 'Cubic Foot' },
  { code: 'INQ', name: 'Cubic Inch' },
  { code: 'GLL', name: 'Gallon (US)' },
  { code: 'GLI', name: 'Gallon (UK)' },
  { code: 'PT', name: 'Pint' },
  { code: 'QT', name: 'Quart' },
  
  // Time
  { code: 'SEC', name: 'Second' },
  { code: 'MIN', name: 'Minute' },
  { code: 'HUR', name: 'Hour' },
  { code: 'DAY', name: 'Day' },
  { code: 'WEE', name: 'Week' },
  { code: 'MON', name: 'Month' },
  { code: 'ANN', name: 'Year' },
  
  // Other common codes
  { code: '5B', name: 'Batch' },
  { code: 'XCR', name: 'Carton' },
  { code: 'BX', name: 'Box' },
  { code: 'CS', name: 'Case' },
  { code: 'CT', name: 'Container' },
  { code: 'PK', name: 'Package' },
  { code: 'PA', name: 'Packet' },
  { code: 'RL', name: 'Roll' },
  { code: 'BG', name: 'Bag' },
  { code: 'BO', name: 'Bottle' },
  { code: 'CA', name: 'Can' },
  { code: 'TU', name: 'Tube' },
  { code: 'DR', name: 'Drum' }
];
