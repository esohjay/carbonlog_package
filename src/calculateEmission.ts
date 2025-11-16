import { RawFactor } from "./type";
import conversionFactors from "../data/conversion_factor_uk_2025.json";
import coicopMultiplier from "../data/coicop_multiplier_22_data.json";
import sicMultiplier from "../data/sic_multiplier_22_data.json";
import { Multiplier } from "./type";

export interface FactorQuery {
  activity: string;
  category?: string;
  subcategory?: string;
  unit: string;
  ghg: string;
  type?: string;
  subtype?: string;
}

export const GHG_LABELS = {
  CO2E: "kg CO2e",
  CO2: "kg CO2e of CO2 per unit",
  CH4: "kg CO2e of CH4 per unit",
  N2O: "kg CO2e of N2O per unit",
} as const;

export function findAllGhgFactors(query: FactorQuery) {
  const factors = (conversionFactors as RawFactor[]).filter(
    (f) =>
      f.activity === query.activity &&
      (!query.category || f.category === query.category) &&
      (!query.subcategory || f.subcategory === query.subcategory) &&
      (!query.type || f.type === query.type) &&
      (!query.subtype || f.subtype === query.subtype) &&
      f.unit === query.unit
  );
  return factors;
}
export function findAllGhgFactorsAndCalculate(
  query: FactorQuery,
  value: number
) {
  const factors = findAllGhgFactors(query);
  const getValue = (ghg: string) =>
    factors.find((f) => f.ghg === ghg)?.conversionFactor ?? 0;

  return {
    co2e: getValue(GHG_LABELS.CO2E) * value,
    co2: getValue(GHG_LABELS.CO2) * value,
    ch4: getValue(GHG_LABELS.CH4) * value,
    n2o: getValue(GHG_LABELS.N2O) * value,
    unit: query.unit,
    inputAmount: value,
    scope: factors[0].scope,
  };
}
export function factorById(id: string) {
  return (conversionFactors as RawFactor[]).find((f) => f.id === id);
}
export function factorByIdAndCalculate(id: string, value: number) {
  const factor = factorById(id);
  if (!factor) {
    throw new Error(`Factor with id ${id} not found`);
  }
  return factor.conversionFactor * value;
}

export function findCoicopMultiplier(activity: string) {
  return (coicopMultiplier as Multiplier[]).find(
    (f) => f.activity?.trim() === activity
  );
}
export function findCoicopMultiplierAndCalculate(
  activity: string,
  value: number
) {
  const multiplier = findCoicopMultiplier(activity);
  if (!multiplier) {
    return {
      co2: null,
      co2e: null,
      value,
      id: null,
      activity: null,
    };
  }
  return {
    co2: multiplier.co2 * value,
    co2e: multiplier.co2e * value,
    value,
    id: multiplier.id,
    activity: multiplier.activity,
  };
}
export function findSicMultiplier(activity: string) {
  return (sicMultiplier as Multiplier[]).find(
    (f) => f.activity?.trim() === activity
  );
}
export function findSicMultiplierAndCalculate(activity: string, value: number) {
  const multiplier = findSicMultiplier(activity);
  if (!multiplier) {
    return {
      co2: null,
      co2e: null,
      value,
      id: null,
      activity: null,
    };
  }

  return {
    co2: multiplier.co2 * value,
    co2e: multiplier.co2e * value,
    value,
    id: multiplier.id,
    activity: multiplier.activity,
  };
}
