const loginIdValidator = new FieldValidator('txtLoginId', async function (val) {
  if (!val) {
    return '请填写账号';
  }
  const resp = await API.exists(val);
  if (resp.data) {
    return '该账号已被占用，请重新选择一个账号名';
  }
});

const nicknameValidator = new FieldValidator('txtNickname', async function (val) {
  if (!val) {
    return '请填写昵称';
  }
});

const loginPwdValidator = new FieldValidator('txtLoginPwd', async function (val) {
  if (!val) {
    return '请填写密码';
  }
});

const loginPwdConfirmValidator = new FieldValidator('txtLoginPwdConfirm', async function (val) {
  if (!val) {
    return '请填写确认密码';
  }
  if (val !== loginPwdValidator.input.value) {
    return '两次密码不一致';
  }
});

const form = $('.user-form');
form.onsubmit = async function (e) {
  e.preventDefault();
  const results = await FieldValidator.validate(
    loginIdValidator,
    nicknameValidator,
    loginPwdValidator,
    loginPwdConfirmValidator);
  if (!results) {
    return;
  }
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  const resp = await API.reg(data);

  if (resp.code === 0) {
    alert('注册成功，点击确定，跳转到登录页');
    location.href = './login.html';
  }
}