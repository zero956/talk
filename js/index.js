(async function () {
  const resp = await API.profile();
  const user = resp.data;
  if (!user) {
    alert("账号未登录");
    location.href = './login.html';
    return;
  }

  const doms = {
    aside: {
      nickname: $('#nickname'),
      loginId: $('#loginId'),
    },
    close: $('.close'),
    chatContainer: $('.chat-container'),
    txtMsg: $('#txtMsg'),
    msgContainer: $('.msg-container'),
  };

  setUserInfo();

  doms.close.onclick = () => {
    API.loginOut();
    location.href = './login.html';
  }

  function addChat(chatInfo) {
    const div = $$$('div');
    div.classList.add('chat-item');
    if (chatInfo.from) {
      div.classList.add('me');
    }
    const img = $$$('img');
    img.className = 'chat-avatar';
    img.src = chatInfo.from ? './asset/avatar.png' : './asset/robot-avatar.jpg';

    const content = $$$('div');
    content.className = 'chat-content';
    content.innerText = chatInfo.content;

    const date = $$$('div');
    date.className = 'chat-date';
    date.innerText = formatDate(chatInfo.createdAt);

    div.appendChild(img);
    div.appendChild(content);
    div.appendChild(date);

    doms.chatContainer.appendChild(div);
  }

  await loadHistory();
  async function loadHistory() {
    const resp = await API.getHistory();
    for (const item of resp.data) {
      addChat(item);
    }
    scrollBottom();
  }

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  // addChat({
  //   content:"你是猪",
  //   to: user.loginId,
  //   from: null,
  //   createdAt: Date.now(),
  // });

  async function sendChat() {
    const content = doms.txtMsg.value.trim();
    if (!content) {
      return;
    }
    addChat({
      content,
      from: user.loginId,
      to: null,
      createdAt: Date.now(),
    });
    doms.txtMsg.value = '';
    scrollBottom();
    const resp = await API.sendChat(content);
    addChat({
      to: user.loginId,
      from: null,
      ...resp.data
    });
    scrollBottom();
  }

  doms.msgContainer.onsubmit = function (e) {
    e.preventDefault();
    sendChat();
  };

  function scrollBottom() {
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
  }

  function setUserInfo() {
    doms.aside.nickname.innerText = user.nickname;
    doms.aside.loginId.innerText = user.loginId;
  }
})(); 
