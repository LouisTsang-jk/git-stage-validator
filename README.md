# git-stage-validator
Validate staged code before committing
> Windows PowerShell does not support `< /dev/tty`. It is recommended to use WSL or configure pre-commit without using `< /dev/tty`.
## Install
```
npm install git-stage-validator -D
```
## Usage
1. Install the package.
2. Customize validation rules (.stagerc.js).
3. Set up git-stage-validator to run during pre-commit.
---
It is recommended to use husky and the following is an example of using husky for pre-commit:
```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

os_type=$(uname)
# Windows
if [[ "$OSTYPE" == "msys" ]]; then
  npx git-stage-validator
else
  npx git-stage-validator < /dev/tty
fi

```
> If no configuration file is provided, it will be automatically generated.
## Documentation
- Validation Rules
```
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
```
- Customizing Prompt Messages
.stagerc.js
```
tipsText: {
  includesConfirmContent: "",
  includesForbiddenContent: "",
  confirmText: ""
}
```

<!-- ## Q&A -->

## License
MIT

