import type { APIEmbed, ButtonStyle } from "discord-api-types/v10";

export interface TransformedVariables { [key: string]: number }

export interface Page {
  bookId: number;
  pageId: number;
  
  embeds: APIEmbed[],

  vars: PageVar[],
  choices: PageChoice[],
}

export interface PageVar {
  name: string;
  condition: string;
  value: string;
};

export interface PageChoice {
  style: ButtonStyle;
  emoji: { id?: string, name?: string };
  label: string;

  isVisibleCondition: string;
  gotos: PageChoiceGoto[];
}

export interface PageChoiceGoto {
  condition: string;
  pageId: number;
}
