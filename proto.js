const appContainer = document.getElementById('app');
let accordion = null;
//             функции создания дом элементов

// заголовок
const createAppTitle = (container) => {
  const appTitle = document.createElement('h1');
  appTitle.classList.add('main-title');
  appTitle.textContent = 'Цепочка прототипов';

  container.append(appTitle);
};

//список для прототипов
const createProtoChainList = (container) => {
  const protoList = document.createElement('ol');
  protoList.classList.add('proto-list');
  container.append(protoList);
};

//форма с полем и кнопкой
const createAppForm = (container, handler) => {
  const form = document.createElement('form');
  const input = document.createElement('input');
  const button = document.createElement('button');
  const messageElem = document.createElement('span');


  form.action = '#';
  input.type = 'text';
  button.type = 'submit';

  form.classList.add('form');
  input.classList.add('form__input');
  button.classList.add('form__btn');
  messageElem.classList.add('error-message');


  input.placeholder = 'Введите название класса';
  button.textContent = 'Показать цепочку прототипов';

  input.addEventListener('input', () => {
    if (form.classList.contains('error')) {
      form.classList.remove('error');
      messageElem.textContent = '';
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!input.value) {
      form.classList.add('error');
      showErrorMessage('Введите название класса, функции или модуля');
      return;
    }
    const inputValue = input.value.trim();
    handler(inputValue, e.currentTarget);
  });

  form.append(input, button, messageElem);
  container.append(form);
  return form;
}

// элемент списка прототипов
const createAccordionListItem = (title, content) => {
  const listItem = document.createElement('li');
  const itemButton = document.createElement('button');
  const itemTitle = document.createElement('span');
  const itemIcon = document.createElement('span');
  const itemContent = document.createElement('div');

  listItem.classList.add('accordion');
  itemButton.classList.add('accordion__control');
  itemTitle.classList.add('accordion__title');
  itemIcon.classList.add('accordion__icon');
  itemContent.classList.add('accordion__content');

  itemButton.setAttribute('aria-expanded', false);
  itemContent.setAttribute('aria-j-hidden', true);

  itemTitle.textContent = title;

  itemButton.append(itemTitle, itemIcon);
  itemContent.append(content);
  listItem.append(itemButton, itemContent);
  return listItem;
}

// список перечисляемых свойств
const createPropertiesList = (proto) => {
  const properties = Object.getOwnPropertyDescriptors(proto);
  const propertiesAmout = Object.keys(properties).length;
  if (propertiesAmout) {
    const propertiesList = document.createElement('ol');
    Object.entries(properties).map(([key, value]) => {
      const propertiesItem = document.createElement('li');
      propertiesItem.textContent = `Название: ${key}. Тип: ${
        value.get ? typeof value.get : typeof value.value
      } `;
      propertiesList.append(propertiesItem);
    });
    return propertiesList;
  } else {
    const propertiesListPlug = document.createElement('span');
    propertiesListPlug.textContent = 'Отсутсвуют перечисляемые свойства';
    return propertiesListPlug;
  }
}

// показ сообщения об ошибке
const showErrorMessage = (message) => {
  const messageElem = document.querySelector('.error-message');
  messageElem.textContent = message;
};
//             обработка данных
// получение первого прототипа
const showFirstPrototype = (className) => {
  let protoList = document.querySelector('.proto-list');
  protoList.textContent = '';
  let classProto = window[className].prototype;
  let currentProtoString = '';
  if (!classProto) {
    classProto = window[className];
    currentProtoString = className;
  } else {
    currentProtoString = classProto.constructor
      ? classProto.constructor.name
      : 'Без названия';
  }
  protoList.append(
    createAccordionListItem(currentProtoString, createPropertiesList(classProto))
  );
  showPrototypeChain(classProto);
}

// получение всех следующих прототипов
const showPrototypeChain = async (classProto) => {
  let protoList = document.querySelector('.proto-list');
  if (Object.getPrototypeOf(classProto) !== null) {
    const objProrto = Object.getPrototypeOf(classProto);

    const objPrortoString = objProrto.constructor
      ? objProrto.constructor.name
      : 'Без названия';

    protoList.append(
      createAccordionListItem(objPrortoString, createPropertiesList(objProrto))
    );
    showPrototypeChain(objProrto);
  } else {
    if (!accordion) {
      await import('./accordion.js').then((module) => {
        accordion = module.default;
      });
    }
    accordion();
  }
}

// обработка загруженного модуля
const moduleClassHandler = (module) => {
  const defaultModuleClass = module.default;
  if (!defaultModuleClass) {
    throw new Error('default не является классом');
  }
  let protoList = document.querySelector('.proto-list');
  protoList.textContent = '';
  protoList.append(
    createAccordionListItem(
      defaultModuleClass.name,
      createPropertiesList(defaultModuleClass)
    )
  );
  showPrototypeChain(defaultModuleClass);
};

// обработка класса или функции
const windowClassHandler = (Class) => {
  const form = document.querySelector('.form');
  try {
    if (Class in window || typeof window[Class] === 'function') {
      showFirstPrototype(Class);
    } else {
      throw new Error('Введено неверное название для класса или функции')
    }
  }
  catch(error) {
    form.classList.add('error');
    showErrorMessage(error.message);
  }
};

// обработка введенного значения
const inputValueHandler = async (value, form) => {
  try {
    if (value.endsWith('.js')) {
      await import(value).then((module) => {
        moduleClassHandler(module);
      });
    } else {
      windowClassHandler(value);
    }
  } catch (error) {
    if (error.name === 'TypeError') {
      error.message =
        'Не удалось загрузить модуль, проверьте введенное значение';
    }
    form.classList.add('error');
    showErrorMessage(error.message);
  }
};

// функция запуска
const init = () => {
  createAppTitle(appContainer);
  const form = createAppForm(appContainer, inputValueHandler);
  createProtoChainList(appContainer);
};

init();
