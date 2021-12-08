import API from './API';
import ChatApp from './chat';
import loginUser from './modals';

const url = 'https://ahj-8-chat.herokuapp.com/users';
const api = new API(url);
let submitUser = null;
const messenger = document.querySelector('.container');
const login = loginUser();

function init() {
  document.body.appendChild(login);
  submitUser = login.querySelector('.nickname-submit');
}

init();

submitUser.addEventListener('click', async (event) => {
  event.preventDefault();

  const user = login.querySelector('.nickname-input').value;

  if (user) {
    const response = await api.load();
    const users = await response.json();

    if (users.findIndex((item) => item.name === user) === -1) {
      const userName = {
        name: user,
      };
      await api.add(userName);

      document.body.removeChild(login);
      messenger.classList.remove('hidden');

      const chat = new ChatApp(user);
      chat.init();
    }
  }
});
