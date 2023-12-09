import { client } from "../src/http/client";

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
            name: "new",
            description: "The story ID",
            required: true,
            choices: [
              { name: "Default", value: "default" },
            ],
          },
        ],
      },
    ],
  },
]).catch(console.log);
