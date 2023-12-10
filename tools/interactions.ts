import { client } from "../src/http/client";

const bookChoices = [
  { name: "Default", value: "0" },
];

client.setAppCommands([
  {
    name: "story",
    description: "Play a story",
    options: [
      {
        type: 1,
        name: "continue",
        description: "Continue playing a story",
      },
      {
        type: 1,
        name: "new",
        description: "Start a new story",
        options: [
          {
            type: 3,
            name: "book",
            description: "The book ID",
            required: true,
            choices: bookChoices,
          },
        ],
      },
      {
        type: 1,
        name: "info",
        description: "Check a book's information",
        options: [
          {
            type: 3,
            name: "book",
            description: "The book ID",
            required: true,
            choices: bookChoices,
          },
        ],
      },
    ],
  },
]).catch(console.log);
