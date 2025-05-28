import { expect, test } from "vitest";
import { tags } from "./tags";

test("returns empty array if no posts are provides", async () => {
  expect(await tags([])).toEqual([]);
});

test("returns tags with count", async () => {
  expect(
    await tags([
      {
        tags: "A,B", active: true,
        id: 0,
        urlId: "",
        title: "",
        content: "",
        description: "",
        imageUrl: "",
        date: new Date(),
        category: "",
        views: 0,
        likes: 0
      },
      {
        tags: "A,C", active: true,
        id: 0,
        urlId: "",
        title: "",
        content: "",
        description: "",
        imageUrl: "",
        date: new Date(),
        category: "",
        views: 0,
        likes: 0
      },
      {
        tags: "C", active: true,
        id: 0,
        urlId: "",
        title: "",
        content: "",
        description: "",
        imageUrl: "",
        date: new Date(),
        category: "",
        views: 0,
        likes: 0
      },
      {
        tags: "D",
        active: false,
        id: 0,
        urlId: "",
        title: "",
        content: "",
        description: "",
        imageUrl: "",
        date: new Date(),
        category: "",
        views: 0,
        likes: 0
      },
    ])
  ).toEqual([
    { name: "A", count: 2 },
    { name: "B", count: 1 },
    { name: "C", count: 2 },
  ]);
});
