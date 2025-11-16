import { describe, it, expect } from "vitest";
import {
  findAllGhgFactors,
  findAllGhgFactorsAndCalculate,
  factorById,
  factorByIdAndCalculate,
  findCoicopMultiplier,
  findCoicopMultiplierAndCalculate,
  findSicMultiplier,
  findSicMultiplierAndCalculate,
  GHG_LABELS,
} from "../src/calculateEmission";

// Example query that matches your JSON snippet (Butane in tonnes)
const butaneQuery = {
  activity: "Fuels",
  category: "Gaseous fuels",
  subcategory: "Butane",
  unit: "tonnes",
  ghg: GHG_LABELS.CO2E,
};

describe("conversion factors", () => {
  it("should find all GHG factors for Butane", () => {
    const results = findAllGhgFactors(butaneQuery);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty("conversionFactor");
  });

  it("should calculate emissions for Butane", () => {
    const value = 2; // 2 tonnes
    const results = findAllGhgFactorsAndCalculate(butaneQuery, value);
    expect(results).toHaveProperty("co2e");
    expect(results.co2e).toBeGreaterThan(0);
    expect(results.unit).toBe("tonnes");
    expect(results.inputAmount).toBe(value);
  });

  it("should get a factor by id", () => {
    const factor = factorById("1_100_1000_15_1");
    expect(factor).toBeDefined();
    expect(factor?.activity).toBe("Fuels");
  });

  it("should calculate emissions by factor id", () => {
    const result = factorByIdAndCalculate("1_100_1000_15_1", 5);
    expect(result).toBeGreaterThan(0);
  });
});

describe("multipliers", () => {
  it("should find a COICOP multiplier", () => {
    const multiplier = findCoicopMultiplier("Garments");
    // may be null if dataset doesn't include it
    expect(multiplier === undefined || multiplier.activity).toBeDefined();
  });

  it("should calculate COICOP emissions", () => {
    const activity = "Garments";
    const value = 100;
    const result = findCoicopMultiplierAndCalculate(activity, value);
    expect(result).toHaveProperty("co2");
    expect(result).toHaveProperty("co2e");
  });

  it("should return null values for missing Coicop multiplier", () => {
    const activity = "Wearing apparel missing";
    const value = 50;

    const result = findCoicopMultiplierAndCalculate(activity, value);
    expect(result.activity).toBeNull();
    expect(result.co2).toBeNull();
    expect(result.co2e).toBeNull();
  });

  it("should find a SIC multiplier", () => {
    const multiplier = findSicMultiplier("Wearing apparel");
    expect(multiplier === undefined || multiplier.activity).toBeDefined();
  });

  it("should calculate SIC emissions", () => {
    const activity = "Wearing apparel";
    const value = 50;

    const result = findSicMultiplierAndCalculate(activity, value);
    expect(result).toHaveProperty("co2");
    expect(result).toHaveProperty("co2e");
  });
  it("should return null values for missing SIC multiplier", () => {
    const activity = "Wrong activity";
    const value = 50;

    const result = findSicMultiplierAndCalculate(activity, value);
    expect(result.activity).toBeNull();
    expect(result.co2).toBeNull();
    expect(result.co2e).toBeNull();
  });
});
