export default function loginUser() {
  const modal = document.createElement('div');

  modal.className = 'login-modal';
  modal.innerHTML = `<h2>Выберите псевдоним</h2>
    <input type="text" class="nickname-input" value="">
    <button class="button nickname-submit">Продолжить</button>`;

  return modal;
}
