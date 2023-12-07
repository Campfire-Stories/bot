import type { ButtonStyle } from "discord-api-types/v10";

export interface PageVar {
  key: string;
  condition: string;
  value: string;
};

export interface PageChoice {
  style: ButtonStyle;
  label: string;

  isVisibleCondition: string;
  gotos: PageChoiceGoto[];
}

export interface PageChoiceGoto {
  condition: string;
  pageId: number;
}
