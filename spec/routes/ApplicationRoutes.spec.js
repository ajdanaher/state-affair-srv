import NewsRouts from "../../src/routes/NewsRoutes";

describe("Route Test Cases", () => {
  test("testing routes", () => {
    expect(NewsRouts).not.toBeNull();
    expect(NewsRouts).not.toBeUndefined();
  });
});
