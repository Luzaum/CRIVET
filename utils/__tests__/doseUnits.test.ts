import { convertDose, convertRange } from "../doseUnits";

describe("doseUnits", () => {
  test("1–3 mg/kg/h → 16.67–50 µg/kg/min", () => {
    const r = convertRange({min:1,max:3}, "mg/kg/h", "mcg/kg/min");
    expect(Math.round(r.min*100)/100).toBe(16.67);
    expect(Math.round(r.max)).toBe(50);
  });

  test("60 µg/kg/min → 3.6 mg/kg/h", () => {
    expect(convertDose(60,"mcg/kg/min","mg/kg/h")).toBeCloseTo(3.6, 6);
  });

  test("1000 µg/kg/h → 1 mg/kg/h", () => {
    expect(convertDose(1000,"mcg/kg/h","mg/kg/h")).toBe(1);
  });

  test("1 mg/kg/h → 1000 µg/kg/h", () => {
    expect(convertDose(1,"mg/kg/h","mcg/kg/h")).toBe(1000);
  });

  test("16.67 µg/kg/min → 1 mg/kg/h", () => {
    expect(convertDose(16.67,"mcg/kg/min","mg/kg/h")).toBeCloseTo(1, 2);
  });
});
