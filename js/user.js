class FieldValidator {
  constructor(txtId, validatorFun) {
    this.input = $('#' + txtId);
    this.p = this.input.nextElementSibling;
    this.validatorFun = validatorFun;
    this.input.onblur = () => {
      this.validate();
    }
  }

  async validate() {
    const err = await this.validatorFun(this.input.value);
    if (err) {
      this.p.innerText = err;
      return false;
    } else {
      this.p.innerText = '';
      return true;
    }
  }

  static async validate(...validators) {
    const prom = validators.map(v => v.validate());
    const results = await Promise.all(prom);
    return results.every(r => r);
  }
}
