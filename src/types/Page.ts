import type { ButtonStyle } from "discord-api-types/v10";

export interface PageVar {
  key: string;
  value: string;
};

export interface PageChoice {
  style: ButtonStyle;
  label: string;

  isVisible: { condition: string; };
  gotos: PageChoiceGoto[];
}

export interface PageChoiceGoto {
  condition: string;
  pageId: number;
}
