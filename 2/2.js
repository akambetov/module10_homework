/**Задание 2.

Сверстайте кнопку, клик на которую будет выводить данные о размерах экрана с помощью alert.  */
const btn = document.querySelector(".btn");
btn.addEventListener("click", showSize);

function showSize() {
  const width = window.screen.width;
  const height = window.screen.height;
  alert(`Размеры экрана: ${width}х${height}`);
}
