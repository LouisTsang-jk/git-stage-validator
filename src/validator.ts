import { ValidatorRule } from "./types.js";

export const validators: ValidatorRule[] = [
  {
    name: "JSON.stringify",
    type: "confirm",
    regex: /JSON\.stringify/,
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
    regex: /console\.log/,
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
];

interface ValidateInfo {
  rule: ValidatorRule;
  pathname: string;
  wildcards: string[];
  raw: string;
}

class Validator {
  next!: Validator;
  constructor(next: Validator) {
    this.next = next;
  }
  async validate(data: ValidateInfo): Promise<boolean> {
    return false;
  }
}

export class FilenameExtensionValidator extends Validator {
  override async validate(data: ValidateInfo) {
    const { rule, pathname } = data;
    const { files: wildcards } = rule
    const wildcardList = wildcards.map((wildcard) =>
      wildcard.replace(/\*\.(.+)$/, "$1")
    );
    const regex = new RegExp(`.+\.(${wildcardList.join("|")})$`);
    const isMatch = regex.test(pathname);
    if (!isMatch) return false;
    return this.next ? this.next.validate(data) : true;
  }
}

export class FileRawValidator extends Validator {
  override async validate(data: ValidateInfo) {
    const { rule, raw } = data;
    const { regex } = rule
    const isMatch = regex.test(raw);
    if (!isMatch) return false;
    return this.next ? this.next.validate(data) : true;
  }
}
