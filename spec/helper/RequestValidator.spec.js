import validate from "../../src/helpers/RequestValidator.js";

describe("Data Validation for insertion", () => {
  const obj = {
    topic: "Sports",
    title: "Baltimore has been rolling on offense.",
    publishedAt: "2024-10-01T16:46:43Z",
    state: "CA",
    description: "this is my description",
    url: "https://removed.com",
    content:
      "The Baltimore Ravens have been a buzzsaw over the past month of the season during a four-game win streak, and in Week 7, they're headed to Tampa Bay to take on a 4-2 Buccaneers team that is looking to stay ahead of the Atlanta Falcons in the NFC South. The Buccaneers are averaging 38 points per game over the last three weeks.",
  };

  test("checking positive case validation", async () => {
    expect(validate).not.toBeNull();
    expect(validate).not.toBeUndefined();
    try {
      const result = await validate(obj);
      expect(result.state).toBe("CA");
      expect(result.topic).toBe("Sports");
    } catch (e) {
      console.log(e);
      expect(1).toBe(2);
    }
  });

  test("title is null", async () => {
    try {
      var clone = Object.assign({}, obj);
      delete clone.title;
      await validate(clone);
    } catch (e) {
      expect(e).toBe('Validation Error. "title" is required');
    }
  });

  test("state is null", async () => {
    try {
      var clone = Object.assign({}, obj);
      delete clone.state;
      await validate(clone);
    } catch (e) {
      expect(e).toBe('Validation Error. "state" is required');
    }
  });
});
