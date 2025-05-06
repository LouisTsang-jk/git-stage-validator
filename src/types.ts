export interface ValidatorRule {
  name: string;
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
  threadId: number
  validMsg: ValidMsg[]
}

export interface ThreadData {
  threadId: number
  path: string
  validators: ValidatorRule[]
}