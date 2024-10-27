export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

export type StringKeys<T> = {
  [K in keyof T]: K extends string ? K : never;
}[keyof T];

export type AlphabetType =
  | 'alpha'
  | 'alphanumeric'
  | 'numeric'
  | 'lower'
  | 'upper'
  | 'alphanumericLower'
  | 'alphanumericUpper'
  | 'custom';

export type AlphabetOptions = {
  type?: AlphabetType;
  prefix?: string;
  suffix?: string;
  hasSymbols?: boolean;
  alphabet?: string;
};
