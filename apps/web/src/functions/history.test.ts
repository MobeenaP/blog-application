import { expect, test } from "vitest";
import { history } from "./history";

test("returns empty array if no history are provides", async () => {
  await expect(await history([])).toEqual([]);
});

test("returns sorted counts by year and month", async () => {
  await expect(
    await history([
      { id: 1, urlId: "1", title: "Test", content: "Test", description: "Test", imageUrl: "Test", category: "Test", views: 0, likes: 0, tags: "Test", date: new Date("01 Jan 2022"), active: true },
      { id: 2, urlId: "2", title: "Test", content: "Test", description: "Test", imageUrl: "Test", category: "Test", views: 0, likes: 0, tags: "Test", date: new Date("08 Jan 2022"), active: true },
      { id: 3, urlId: "3", title: "Test", content: "Test", description: "Test", imageUrl: "Test", category: "Test", views: 0, likes: 0, tags: "Test", date: new Date("07 Jan 2022"), active: true },
      { id: 4, urlId: "4", title: "Test", content: "Test", description: "Test", imageUrl: "Test", category: "Test", views: 0, likes: 0, tags: "Test", date: new Date("07 Mar 2020"), active: true },
      { id: 5, urlId: "5", title: "Test", content: "Test", description: "Test", imageUrl: "Test", category: "Test", views: 0, likes: 0, tags: "Test", date: new Date("07 Apr 2020"), active: true },
      { id: 6, urlId: "6", title: "Test", content: "Test", description: "Test", imageUrl: "Test", category: "Test", views: 0, likes: 0, tags: "Test", date: new Date("07 May 2024"), active: true },
      { id: 7, urlId: "7", title: "Test", content: "Test", description: "Test", imageUrl: "Test", category: "Test", views: 0, likes: 0, tags: "Test", date: new Date("01 Jan 2012"), active: false },
    ]),
  ).toEqual([
    { month: 5, year: 2024, count: 1 },
    { month: 1, year: 2022, count: 3 },
    { month: 4, year: 2020, count: 1 },
    { month: 3, year: 2020, count: 1 },
  ]);
});
