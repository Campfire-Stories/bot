import { client } from "../src/http/client";

const storyChoices = [
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
            name: "story",
            description: "The story ID",
            required: true,
            choices: storyChoices,
          },
        ],
      },
      {
        type: 1,
        name: "info",
        description: "Check a story information",
        options: [
          {
            type: 3,
            name: "story",
            description: "The story ID",
            required: true,
            choices: storyChoices,
          },
        ],
      },
    ],
  },
]).catch(console.log);
