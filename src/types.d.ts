export enum ValidatorType {
  forbid,
  confirm,
}

export interface ValidatorRule {
  name: string;
  type: keyof typeof ValidatorType;
  regex: RegExp;
  msg: string;
  files: (`*.${string}` | `*`)[];
}

export interface ValidatorResult {
  validator: string;
  path: string;
  msg: string;
}

export interface ValidMsg {
  validator: ValidatorRule;
  path: string;
  msg?: string;
}

export interface ThreadResult {
  // diff: string
  threadId: number
  validMsg: ValidMsg[]
}