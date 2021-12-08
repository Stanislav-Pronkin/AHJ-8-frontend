import API from './API';

const url = 'https://ahj-8-chat.herokuapp.com/users';
const api = new API(url);

function formatDate(value) {
  const returnValue = value < 10 ? `0${value}` : value;

  return returnValue;
}

export default class ChatApp {
  constructor(userName) {
    this.name = userName;
    this.url = 'wss://ahj-8-chat.herokuapp.com/ws';
    this.usersList = document.querySelector('.users');
    this.messageList = document.querySelector('.message-list');
    this.messageInput = document.querySelector('.message-input');
  }

  init() {
    this.ws = new WebSocket(this.url);

    this.ws.addEventListener('open', () => {
      console.log('connected');
    });
    this.ws.addEventListener('message', (event) => {
      this.addMessage(event);
    });
    this.ws.addEventListener('close', (event) => {
      console.log('connection close', event);
    });
    this.ws.addEventListener('error', () => {
      console.log('Error');
    });
    this.usersList.innerHTML = '';
    this.addUsers();

    this.messageInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter' && this.messageInput.value) {
        this.sendMessage(this.messageInput.value);
        this.messageInput.value = '';
      }
    });

    window.addEventListener('beforeunload', () => {
      this.ws.close(1000, 'work end');
      api.remove(this.name);
      this.addUsers();
    });
  }

  async addUsers() {
    const response = await api.load();
    const users = await response.json();

    this.usersList.innerHTML = '';

    for (const item of users) {
      const user = document.createElement('div');
      let currentName = item.name;

      if (this.name === item.name) {
        currentName = 'You';
      }

      user.className = 'user';
      user.innerHTML = `<div class="user-image"></div>
            <div class="user-name">${currentName}</div>`;

      this.usersList.appendChild(user);
    }
  }

  addMessage(message) {
    const {
      type, name, msg, date,
    } = JSON.parse(message.data);

    if (type === 'message') {
      const messageText = document.createElement('li');
      let sender = '';
      let senderName = name;

      if (this.name === name) {
        sender = 'own';
        senderName = 'You';
      }

      messageText.className = `message ${sender}`;
      messageText.innerHTML = `<span class="message-name">${senderName}, ${date}</span>
            <p class="message-text">${msg}</p>`;

      this.messageList.appendChild(messageText);
    } else if (type === 'add user' || type === 'del user') {
      this.addUsers();
    }
  }

  sendMessage(text) {
    if (this.ws.readyState === WebSocket.OPEN) {
      const itemDate = new Date();
      const date = formatDate(itemDate.getDate());
      const month = formatDate(itemDate.getMonth() + 1);
      const year = formatDate(itemDate.getFullYear());
      const hours = formatDate(itemDate.getHours());
      const min = formatDate(itemDate.getMinutes());
      const created = `${date}.${month}.${year} ${hours}:${min}`;
      const newMessage = {
        type: 'message',
        name: this.name,
        msg: text,
        date: created,
      };

      this.ws.send(JSON.stringify(newMessage));
    } else {
      this.ws = new WebSocket(this.url);
    }
  }
}
