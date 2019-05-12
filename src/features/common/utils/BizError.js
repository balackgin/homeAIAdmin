import ExtensibleError from './ExtensibleError';

export default class BizError extends ExtensibleError {
  constructor(code, msg) {
    super(msg);
    this.code = code;
  }
}