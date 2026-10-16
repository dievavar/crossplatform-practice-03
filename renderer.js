
const showButton = document.getElementById('show-directory');
const chooseButton = document.getElementById('choose-directory');
const fileList = document.getElementById('file-list');
const selectedPath = document.getElementById('selected-path');

// Функция отображения файлов и папок
function displayFiles(entries) {
  fileList.replaceChildren();

  if (entries.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'Каталог пуст';
    fileList.appendChild(li);
    return;
  }

  entries.forEach(entry => {
    const li = document.createElement('li');

    if (entry.isDir) {
      li.textContent = '📁 ' + entry.name;
      li.classList.add('directory');
    } else {
      li.textContent = '📄 ' + entry.name;
      li.classList.add('file');
    }

    fileList.appendChild(li);
  });
}

// Отображение ошибки
function showError(error) {
  fileList.replaceChildren();

  const li = document.createElement('li');
  li.textContent = 'Ошибка: ' + error.message;
  fileList.appendChild(li);

  console.error(error);
}

// Задание 3: показать рабочий каталог
showButton.addEventListener('click', async () => {
  try {
    const entries = await window.api.listDir('.');
    selectedPath.textContent = 'Рабочий каталог: .';
    displayFiles(entries);
  } catch (error) {
    showError(error);
  }
});

// Задание 4: выбрать каталог через Finder
chooseButton.addEventListener('click', async () => {
  try {
    const result = await window.api.chooseDir();

    if (result.canceled) {
      return;
    }

    selectedPath.textContent =
      'Выбранный каталог: ' + result.path;

    displayFiles(result.entries);
  } catch (error) {
    showError(error);
  }
});
