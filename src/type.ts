export interface RawFactor {
  id: string;
  scope: string;
  activity: string;
  category: string;
  subcategory: string;
  unit: string;
  type: string;
  subtype: string;
  ghg: string;
  conversionFactor: number;
}

export interface Multiplier {
  id: string;
  activity: string;
  co2: number;
  co2e: number;
}
export interface MultiplierResult extends Multiplier {
  value: number;
}

export interface EmissionResult {
  inputAmount: number;
  unit: string;
  co2e: number;
  co2?: number;
  ch4?: number;
  n2o?: number;
}
