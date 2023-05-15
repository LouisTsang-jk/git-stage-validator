import { ValidatorRule } from "./types.js";

export const validators = [
  {
    name: "JSON.stringify",
    type: "confirm",
    regex: /JSON\.stringify\(.+\)/,
    msg: `检测到提交的html文件中有"JSON.stringify"`,
    files: ["*.html"],
  },
  {
    name: "| json",
    type: "confirm",
    regex: /\| json/,
    msg: `检测到提交的ts文件中有"* | json"`,
    files: ["*.html"],
  },
  {
    name: "console.log",
    type: "confirm",
    regex: /console\.log\(.+\)/,
    msg: `检测到提交的ts文件中有"console.log"`,
    files: ["*.ts", "*.js"],
  },
  {
    name: "debugger",
    type: "confirm",
    regex: /debugger/,
    msg: `检测到提交的ts文件中有"debugger"`,
    files: ["*.ts"],
  },
] as ValidatorRule[];

interface ValidateInfo {
  rule: ValidatorRule;
  pathname: string;
  raw: string;
}

class Validator {
  next: Validator | null = null;
  public validInfo = new Map<string, string>();
  constructor(next: Validator | null) {
    this.next = next;
    if (this.next) {
      this.next.validInfo = this.validInfo
    }
  }
  validate = (data: ValidateInfo): Promise<boolean> | boolean => {
    return Promise.resolve(false);
  };
}

export class FilenameExtensionValidator extends Validator {
  override validate = async (data: ValidateInfo) => {
    const { rule, pathname } = data;
    const { files: wildcards } = rule;
    const wildcardList = wildcards.map((wildcard) =>
      wildcard.replace(/\*\.(.+)$/, "$1")
    );
    const regex = new RegExp(`.+\.(${wildcardList.join("|")})$`);
    const matches = pathname.match(regex)
    if (!matches) return false;
    this.validInfo.set('fileExtension', matches?.[0])
    return this.next ? this.next.validate(data) : true;
  };
}

export class FileRawValidator extends Validator {
  override validate = (data: ValidateInfo) => {
    const { rule, raw } = data;
    const { regex } = rule;
    const matches = raw.match(regex)
    if (!matches) return false;
    this.validInfo.set('fileRaw', matches?.[0])
    return this.next ? this.next.validate(data) : true;
  };
}
