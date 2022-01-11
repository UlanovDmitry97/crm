import { createClient, deleteClient, getClientList, getClient, changeClient, searchClients } from './add-data.js';

// Рендер приложения
export async function render(data) {
  const mainContainer = document.querySelector('.main__container');
  const main = document.querySelector('.main');
  const btnAddClient = document.createElement('button');
  const modal = await getModal(true, false);
  const modalDelete = await getModal(false, true);
  const modalChange = await getModal(false, false, true);
  const modalWrapp = document.createElement('div');
  const sortIdBtn = document.getElementById('ID');
  const sortFioBtn = document.getElementById('fio');
  const sortCreateTimeBtn = document.getElementById('CreateTime');
  const sortChangeTimeBtn = document.getElementById('changeTime');
  const searchInput = document.querySelector('.header__search-input');
  let searchClientsInterval;
  const hashId = location.hash;

  btnAddClient.innerHTML = `
  <svg class="btn-add-client__icon">
  <use xlink: href = "img/sprite.svg#addClientIcon"></use>
  </svg > Добавить клиента`;
  btnAddClient.classList.add('btn-add-client');
  modalWrapp.classList.add('modal-wrapp');


  btnAddClient.addEventListener('click', function () {
    modalWrapp.classList.add('modal-wrapp_visable');
    modal.classList.add('modal_visable');
  });

  searchInput.addEventListener('input', function () {
    clearTimeout(searchClientsInterval);
    searchClientsInterval = setTimeout(renderSearchClients, 300);
  });

  searchInput.addEventListener('keydown', function (e) {
    if (e.code == 'ArrowDown') {
      const searchBtn = document.querySelectorAll('.header__search-btn');
      if (searchBtn.length > 0) {
        searchBtn[0].focus();
      }
    }
  })

  sortIdBtn.addEventListener('click', function () {
    const sortingBtns = document.querySelectorAll('.btn-sorting ');
    const sortyngType = this.dataset.sorting;

    sortingBtns.forEach(sortingBtn => sortingBtn.classList.remove('sorting-active'));

    this.classList.toggle('btn-sorting_ascending')

    this.classList.add('sorting-active');

    if (sortyngType === 'ascending') {
      this.dataset.sorting = 'descending';
    }

    if (sortyngType === 'descending') {
      this.dataset.sorting = 'ascending';
    }

    sortingId(sortyngType);
  });

  sortIdBtn.click();

  sortFioBtn.addEventListener('click', function () {
    const sortingBtns = document.querySelectorAll('.btn-sorting ');
    const sortyngType = this.dataset.sorting;

    sortingBtns.forEach(sortingBtn => sortingBtn.classList.remove('sorting-active'));

    this.classList.toggle('btn-sorting_ascending')
    this.classList.add('sorting-active');

    if (sortyngType === 'ascending') {
      this.dataset.sorting = 'descending';
    }

    if (sortyngType === 'descending') {
      this.dataset.sorting = 'ascending';
    }

    sortingFio(sortyngType);
  });

  sortCreateTimeBtn.addEventListener('click', function () {
    const sortingBtns = document.querySelectorAll('.btn-sorting ');
    const sortyngType = this.dataset.sorting;

    sortingBtns.forEach(sortingBtn => sortingBtn.classList.remove('sorting-active'));

    this.classList.toggle('btn-sorting_ascending')
    this.classList.add('sorting-active');

    if (sortyngType === 'ascending') {
      this.dataset.sorting = 'descending';
    }

    if (sortyngType === 'descending') {
      this.dataset.sorting = 'ascending';
    }

    sortTimeCreate(sortyngType);
  });

  sortChangeTimeBtn.addEventListener('click', function () {
    const sortingBtns = document.querySelectorAll('.btn-sorting ');
    const sortyngType = this.dataset.sorting;

    sortingBtns.forEach(sortingBtn => sortingBtn.classList.remove('sorting-active'));

    this.classList.toggle('btn-sorting_ascending')
    this.classList.add('sorting-active');

    if (sortyngType === 'ascending') {
      this.dataset.sorting = 'descending';
    }

    if (sortyngType === 'descending') {
      this.dataset.sorting = 'ascending';
    }

    sortTimeChange(sortyngType);
  });


  modalWrapp.append(modal);
  modalWrapp.append(modalDelete);
  modalWrapp.append(modalChange);
  mainContainer.append(btnAddClient);
  main.append(modalWrapp);

  if (hashId) {
    const changeModalOpen = document.querySelector(`.clients-table__change-btn[data-id="${hashId.slice(1)}"]`)
    changeModalOpen.click();
  }

  const table = document.querySelector('.clients-table');
  const searchDropdown = document.querySelector('.header__search-dropdown');
  // Реализация закрытия и очистки, модального окна при клике вне области окна
  document.addEventListener('click', event => {
    let dontClose = false;
    event.composedPath().forEach(element => {
      if (element === modal || element === btnAddClient || element === modalDelete || element === table || element === modalChange || element === searchDropdown) {
        dontClose = true;
      }
    });
    if (dontClose) return;
    modalWrapp.classList.remove('modal-wrapp_visable');
    modal.classList.remove('modal_visable');
    modalDelete.classList.remove('delete-client_visable');
    modalChange.classList.remove('change-client_visable');
    const clientSearchItem = document.querySelectorAll('.header__search-client');
    clientSearchItem.forEach(client => client.remove());
    document.querySelector('.header__search-input').value = '';
    deletContacts();
  });
}

// Функция которая в зависимости от переданого пораметра возвращает модальное окно
async function getModal(addModal = false, deleteModal = false, changeModal = false) {
  const modal = document.createElement('div');
  const form = document.createElement('form');
  const fieldsetFullName = document.createElement('fieldset');
  const legend = document.createElement('legend');
  const inputSurname = getInput('Фамилия', true, 'surname');
  const inputName = getInput('Имя', true, 'name');
  const inputPatronymic = getInput('Отчество', false, 'lastName');
  const exit = document.createElement('button');
  const fieldsetContacts = document.createElement('div');
  const contactWrapp = document.createElement('div');
  const addContactBtn = document.createElement('btn');
  const saveBtn = document.createElement('button');
  const resetBtn = document.createElement('button');

  if (addModal) {
    const massageWrapp = document.createElement('div');
    modal.classList.add('modal');
    form.classList.add('modal__form');
    fieldsetFullName.classList.add('modal__full-name');
    legend.classList.add('modal__legend');
    exit.classList.add('modal__close');
    fieldsetContacts.classList.add('modal__contacts');
    addContactBtn.classList.add('modal__contact-action');
    saveBtn.classList.add('modal__save');
    resetBtn.classList.add('modal__reset');
    massageWrapp.classList.add('modal__massage-error');


    legend.innerText = 'Новый клиент';
    addContactBtn.innerText = 'Добавить контакт';
    saveBtn.innerText = 'Сохранить';
    saveBtn.type = 'submit';
    resetBtn.innerText = 'Отмена';
    resetBtn.type = 'button';
    form.name = 'addContact'

    inputName.addEventListener('input', function () {
      form.name.classList.remove('modal__input_arror');
    });

    inputSurname.addEventListener('input', function () {
      form.surname.classList.remove('modal__input_arror');
    });


    resetBtn.addEventListener('click', () => {
      form.reset();
      const placeholdersText = document.querySelectorAll('.placeholder-box__text');
      const contacts = document.querySelectorAll('.contact');
      const contactsWrapp = document.querySelector('.modal__contacts');
      const modalInputs = document.querySelectorAll('.modal__input');
      const massageError = document.querySelector('.modal__massage-error');

      massageError.classList.remove('modal__massage-error_active');
      massageError.innerText = '';

      modalInputs.forEach(input => {
        input.classList.remove('modal__input_arror');
      });

      placeholdersText.forEach(placeholder => {
        if (!placeholder.classList.contains('placeholder-box__text_down')) {
          placeholder.classList.add('placeholder-box__text_down');
        }

        if (contacts) {
          contacts.forEach(contact => {
            contact.remove();
            contactsWrapp.classList.remove('modal__contacts-active');
          })
        }
      })
    });


    addContactBtn.addEventListener('click', function () {
      const contactArr = document.querySelectorAll('.contact');

      if (contactArr.length == 9) {
        this.classList.add('modal__contact-action_not-active')

        const contact = getContact();

        fieldsetContacts.classList.add('modal__contacts-active');
        contactWrapp.append(contact);
      }

      else {
        const contact = getContact();
        fieldsetContacts.classList.add('modal__contacts-active');
        contactWrapp.append(contact);
      }
    });

    exit.addEventListener('click', function () {
      const modalWrap = document.querySelector('.modal-wrapp');
      const modalAddClient = document.querySelector('.modal');
      const modalInputs = document.querySelectorAll('.modal__input');
      const massageError = document.querySelector('.modal__massage-error');
      const contacts = document.querySelectorAll('.contact');
      const contactsWrapp = document.querySelectorAll('.modal__contacts-active');

      massageError.classList.remove('modal__massage-error_active');
      massageError.innerText = '';

      modalInputs.forEach(input => {
        input.classList.remove('modal__input_arror');
      });

      contacts.forEach(client => {
        client.remove();
      });

      contactsWrapp.forEach(clientWrapp => {
        clientWrapp.classList.remove('.modal__contacts-active');
      });

      modalWrap.classList.remove('modal-wrapp_visable');
      modalAddClient.classList.remove('modal_visable');
    });
    // В этом слушателе события отправка нового клиента на сервер и валидация полей формы
    saveBtn.addEventListener('click', async function (event) {
      event.preventDefault();
      const loader = document.createElement('div');
      loader.classList.add('modal__loader');
      modal.append(loader);

      const contacts = document.querySelectorAll('.contact__input');
      const modalWrapp = this.parentNode.parentNode.parentNode;
      const modalAddClient = this.parentNode.parentNode;


      const requestBody = {};
      const contactsArr = [];



      const formAddContact = document.forms.addContact;

      if (formAddContact.name.value.length < 2) {
        massageWrapp.innerHTML = 'Поле "Имя" должно быть заполнено!';
        massageWrapp.classList.add('modal__massage-error_active');
        formAddContact.name.classList.add('modal__input_arror');
        loader.remove();
        return;
      }

      if (formAddContact.surname.value < 2) {
        massageWrapp.innerHTML = 'Поле "Фамилия" должно быть заполнено!';
        massageWrapp.classList.add('modal__massage-error_active');
        formAddContact.surname.classList.add('modal__input_arror');
        loader.remove();
        return;
      }

      requestBody.name = formAddContact.name.value;
      requestBody.surname = formAddContact.surname.value;
      requestBody.lastName = formAddContact.lastName.value;



      if (document.querySelector('.contact')) {
        contacts.forEach(contact => {
          const contactObject = {};
          if (contact.type == 'tel') {
            const phone = contact.inputmask.unmaskedvalue();

            if (phone.length == 10) {
              contactObject.type = contact.name;
              contactObject.value = contact.value;
              contactsArr.push(contactObject)
            }
          }

          if (contact.value && contact.type !== 'tel') {
            contactObject.type = contact.name;
            contactObject.value = contact.value;

            contactsArr.push(contactObject)
          }
        })
      }

      requestBody.contacts = contactsArr;

      if (contactsArr.length !== document.querySelectorAll('.contact').length) {
        const contacts = document.querySelectorAll('.contact__input');
        contacts.forEach(contact => {
          if (contact.value.length === 0 && contact.type !== 'tel' && contact.type !== 'additionalPhone') {
            contact.classList.add('contact__input_error');
          }

          if (contact.type === 'tel' || contact.type === 'additionalPhone') {
            const phone = contact.inputmask.unmaskedvalue();
            if (phone.length !== 10) {
              contact.classList.add('contact__input_error');
            }
          }
        })
        massageWrapp.innerHTML = 'Заполните поля "Контакты" полностью!';
        massageWrapp.classList.add('modal__massage-error_active');
        loader.remove();
        return;
      }

      const response = await createClient(requestBody);

      if (response.message) {
        massageWrapp.classList.add('modal__massage-error_active')
        massageWrapp.innerText = `Ошибка: ${response.message}`;
        loader.remove();
        return;
      }

      modalWrapp.classList.remove('modal-wrapp_visable');
      modalAddClient.classList.remove('modal_visable');
      loader.remove();
      document.querySelector('.modal__reset').click();

      const id = document.querySelector('.sorting-active').id;
      let sortyngType = document.querySelector('.sorting-active').dataset.sorting;

      if (sortyngType === 'descending') {
        sortyngType = 'ascending';
      }

      if (sortyngType === 'ascending') {
        sortyngType = 'descending';
      }

      if (id === 'ID') {
        sortingId(sortyngType);
      }

      if (id === 'fio') {
        sortingFio(sortyngType);
      }

      if (id === 'CreateTime') {
        sortTimeCreate(sortyngType);
      }

      if (id === 'changeTime') {
        sortTimeChange(sortyngType);
      }
    });

    fieldsetFullName.append(legend);
    fieldsetFullName.append(inputSurname);
    fieldsetFullName.append(inputName);
    fieldsetFullName.append(inputPatronymic);
    fieldsetContacts.prepend(contactWrapp);
    fieldsetContacts.append(addContactBtn);
    form.append(fieldsetFullName);
    form.append(fieldsetContacts);
    form.append(saveBtn);
    form.append(resetBtn);
    modal.append(form);
    modal.append(exit);
    saveBtn.before(massageWrapp);
  }

  if (deleteModal) {
    const title = document.createElement('h2');
    const description = document.createElement('p');

    title.classList.add('delete-client__title');
    description.classList.add('delete-client__description');
    modal.classList.add('delete-client');
    saveBtn.classList.add('delete-client__delete-btn');
    resetBtn.classList.add('modal__reset');
    exit.classList.add('modal__close');

    title.innerText = 'Удалить клиента';
    description.innerText = 'Вы действительно хотите удалить данного клиента?';
    saveBtn.innerText = 'Удалить';
    resetBtn.innerText = 'Отмена';

    resetBtn.addEventListener('click', function () {
      modal.classList.remove('delete-client_visable');
      modal.parentNode.classList.remove('modal-wrapp_visable');
    });

    exit.addEventListener('click', function () {
      modal.classList.remove('delete-client_visable');
      modal.parentNode.classList.remove('modal-wrapp_visable');
    });

    saveBtn.addEventListener('click', async function () {
      await deleteClient(modal.dataset.id);

      const id = document.querySelector('.sorting-active').id;
      let sortyngType = document.querySelector('.sorting-active').dataset.sorting;

      if (sortyngType === 'descending') {
        sortyngType = 'ascending';
      }

      if (sortyngType === 'ascending') {
        sortyngType = 'descending';
      }

      if (id === 'ID') {
        sortingId(sortyngType);
      }

      if (id === 'fio') {
        sortingFio(sortyngType);
      }

      if (id === 'CreateTime') {
        sortTimeCreate(sortyngType);
      }

      if (id === 'changeTime') {
        sortTimeChange(sortyngType);
      }

      exit.click();
    });

    modal.append(title);
    modal.append(description);
    modal.append(saveBtn);
    modal.append(resetBtn);
    modal.append(exit);
  }

  if (changeModal) {
    const massageWrapp = document.createElement('div');
    modal.classList.add('change-client');
    form.classList.add('modal__form');
    fieldsetFullName.classList.add('modal__full-name');
    legend.classList.add('modal__legend');
    exit.classList.add('modal__close');
    fieldsetContacts.classList.add('modal__contacts');
    addContactBtn.classList.add('modal__contact-action', 'modal__change-contact');
    saveBtn.classList.add('modal__save', 'modal__save_disabled');
    saveBtn.id = 'changeClient';
    resetBtn.classList.add('modal__reset', 'modal__reset_disabled');
    resetBtn.id = 'resetChange';
    const idText = document.createElement('span');
    idText.classList.add('modal__client-id');
    massageWrapp.classList.add('modal__massage-error');


    legend.innerText = 'Изменить данные';
    addContactBtn.innerText = 'Добавить контакт';
    saveBtn.innerText = 'Сохранить';
    saveBtn.type = 'submit';
    resetBtn.innerText = 'Удалить клиента';
    resetBtn.type = 'button';
    form.name = 'changeClient';

    inputName.addEventListener('input', function () {
      form.name.classList.remove('modal__input_arror');
    });

    inputSurname.addEventListener('input', function () {
      form.surname.classList.remove('modal__input_arror');
    });


    resetBtn.addEventListener('click', async () => {
      form.reset();
      const placeholdersText = document.querySelectorAll('.placeholder-box__text');
      const contacts = document.querySelectorAll('.contact');
      const contactsWrapp = document.querySelector('.modal__contacts');
      placeholdersText.forEach(placeholder => {
        if (!placeholder.classList.contains('placeholder-box__text_down')) {
          placeholder.classList.add('placeholder-box__text_down');
        }

        if (contacts) {
          contacts.forEach(contact => {
            contact.remove();
            contactsWrapp.classList.remove('modal__contacts-active');
          })
        }
      })

      await deleteClient(modal.dataset.id);
      exit.click();

      const id = document.querySelector('.sorting-active').id;
      let sortyngType = document.querySelector('.sorting-active').dataset.sorting;

      if (sortyngType === 'descending') {
        sortyngType = 'ascending';
      }

      if (sortyngType === 'ascending') {
        sortyngType = 'descending';
      }

      if (id === 'ID') {
        sortingId(sortyngType);
      }

      if (id === 'fio') {
        sortingFio(sortyngType);
      }

      if (id === 'CreateTime') {
        sortTimeCreate(sortyngType);
      }

      if (id === 'changeTime') {
        sortTimeChange(sortyngType);
      }

      deletContacts();
    });


    addContactBtn.addEventListener('click', function () {
      const contactArr = document.querySelectorAll('.contact');

      if (contactArr.length == 9) {
        this.classList.add('modal__contact-action_not-active');

        const contact = getContact();

        fieldsetContacts.classList.add('modal__contacts-active');
        contactWrapp.append(contact);
      }

      else {
        const contact = getContact();
        fieldsetContacts.classList.add('modal__contacts-active');
        contactWrapp.append(contact);
      }
    });

    exit.addEventListener('click', function () {
      const modalWrap = document.querySelector('.modal-wrapp');

      modalWrap.classList.remove('modal-wrapp_visable');
      modal.classList.remove('change-client_visable');
      deletContacts();
    });
    // В этом слушателе события отправка изменений клиента на сервер и валидация полей формы
    saveBtn.addEventListener('click', async function (event) {
      event.preventDefault();

      const loader = document.createElement('div');
      loader.classList.add('modal__loader');
      modal.append(loader);

      const contacts = document.querySelectorAll('.contact__input')
      const modalWrapp = this.parentNode.parentNode.parentNode;
      const modalAddClient = this.parentNode.parentNode;

      const requestBody = {};
      const contactsArr = [];

      const formChageContact = document.forms.changeClient;

      if (formChageContact.name.value.length < 2) {
        massageWrapp.innerHTML = 'Поле "Имя" должно быть заполнено!';
        massageWrapp.classList.add('modal__massage-error_active');
        formChageContact.name.classList.add('modal__input_arror');
        loader.remove();
        return;
      }

      if (formChageContact.surname.value < 2) {
        massageWrapp.innerHTML = 'Поле "Фамилия" должно быть заполнено!';
        massageWrapp.classList.add('modal__massage-error_active');
        formChageContact.surname.classList.add('modal__input_arror');
        loader.remove();
        return;
      }

      requestBody.name = formChageContact.name.value;
      requestBody.surname = formChageContact.surname.value;
      requestBody.lastName = formChageContact.lastName.value;



      if (document.querySelector('.contact')) {
        contacts.forEach(contact => {
          const contactObject = {};
          if (contact.type == 'tel') {
            const phone = contact.inputmask.unmaskedvalue();

            if (phone.length == 10) {
              contactObject.type = contact.name;
              contactObject.value = contact.value;
              contactsArr.push(contactObject)
            }
          }

          if (contact.value && contact.type !== 'tel') {
            contactObject.type = contact.name;
            contactObject.value = contact.value;

            contactsArr.push(contactObject)
          }
        })
      }
      requestBody.contacts = contactsArr;

      if (contactsArr.length !== document.querySelectorAll('.contact').length) {
        const contacts = document.querySelectorAll('.contact__input');
        contacts.forEach(contact => {
          if (contact.value.length === 0 && contact.type !== 'tel' && contact.type !== 'additionalPhone') {
            contact.classList.add('contact__input_error');
          }

          if (contact.type === 'tel' || contact.type === 'additionalPhone') {
            const phone = contact.inputmask.unmaskedvalue();
            if (phone.length !== 10) {
              contact.classList.add('contact__input_error');
            }
          }
        })
        massageWrapp.innerHTML = 'Заполните поля "Контакты" полностью!';
        massageWrapp.classList.add('modal__massage-error_active');
        loader.remove();
        return;
      }

      loader.remove();
      modalWrapp.classList.remove('modal-wrapp_visable');
      modalAddClient.classList.remove('modal_visable');
      const response = await changeClient(modal.dataset.id, requestBody);

      if (response.message) {
        massageWrapp.classList.add('modal__massage-error_active')
        massageWrapp.innerText = `Ошибка: ${response.message}`;
        return;
      }

      const id = document.querySelector('.sorting-active').id;
      let sortyngType = document.querySelector('.sorting-active').dataset.sorting;

      if (sortyngType === 'descending') {
        sortyngType = 'ascending';
      }

      if (sortyngType === 'ascending') {
        sortyngType = 'descending';
      }

      if (id === 'ID') {
        sortingId(sortyngType);
      }

      if (id === 'fio') {
        sortingFio(sortyngType);
      }

      if (id === 'CreateTime') {
        sortTimeCreate(sortyngType);
      }

      if (id === 'changeTime') {
        sortTimeChange(sortyngType);
      }

      modal.classList.remove('change-client_visable');
      deletContacts();
    });

    legend.append(idText);
    fieldsetFullName.append(legend);
    fieldsetFullName.append(inputSurname);
    fieldsetFullName.append(inputName);
    fieldsetFullName.append(inputPatronymic);
    fieldsetContacts.prepend(contactWrapp);
    fieldsetContacts.append(addContactBtn);
    form.append(fieldsetFullName);
    form.append(fieldsetContacts);
    form.append(saveBtn);
    form.append(resetBtn);
    modal.append(form);
    modal.append(exit);
    saveBtn.before(massageWrapp);
  }

  return modal;
}

// Функция собирает и возвращает div с input в зависимости от переданых параметров
function getInput(placeholder, required, name) {
  const labelPlaceholderBox = document.createElement('label');
  const input = document.createElement('input');
  const placeholderText = document.createElement('div');
  const necessarily = document.createElement('strong');

  labelPlaceholderBox.classList.add('placeholder-box');
  input.classList.add('modal__input');
  placeholderText.classList.add('placeholder-box__text', 'placeholder-box__text_down');

  placeholderText.innerText = placeholder;
  input.type = 'text';
  input.name = name;

  labelPlaceholderBox.append(input);

  if (required) {
    necessarily.classList.add('placeholder-box__necessarily');
    necessarily.innerText = '*';
    input.required = 'true';
    input.setAttribute('minlength', '2');

    placeholderText.append(necessarily);
  }

  input.addEventListener('focusin', function () {
    placeholderText.classList.remove('placeholder-box__text_down');
  });

  input.addEventListener('blur', function () {
    if (!input.value) {
      if (!placeholderText.classList.contains('placeholder-box__text_down'))
        placeholderText.classList.add('placeholder-box__text_down');
    }

    else {
      placeholderText.classList.remove('placeholder-box__text_down');
    }
  });

  labelPlaceholderBox.append(placeholderText);

  return labelPlaceholderBox;
}

// Функция возвращает поле с вводом контактов клиента
function getContact() {
  const contact = document.createElement('div');
  const dropdown = document.createElement('div');
  const selected = document.createElement('div');
  const select = document.createElement('span');
  const dropdownMenu = document.createElement('ul');
  const additionalPhone = document.createElement('li');
  const email = document.createElement('li');
  const vk = document.createElement('li');
  const facebook = document.createElement('li');
  const twitter = document.createElement('li');
  const telegram = document.createElement('li');
  const contactInput = document.createElement('input');
  const removeBtn = document.createElement('button');

  contact.classList.add('modal__contact', 'contact');
  selected.classList.add('contact__selected');
  dropdown.classList.add('contact__dropdown');
  dropdownMenu.classList.add('contact__dropdown-menu');;
  contactInput.classList.add('contact__input');
  removeBtn.classList.add('contact__remove');
  additionalPhone.classList.add('contact__dropdown-item');
  email.classList.add('contact__dropdown-item');
  vk.classList.add('contact__dropdown-item');
  facebook.classList.add('contact__dropdown-item');
  twitter.classList.add('contact__dropdown-item');
  telegram.classList.add('contact__dropdown-item');

  select.innerText = 'Телефон';
  select.dataset.type = 'tel';
  additionalPhone.innerText = 'Доп. телефон';
  additionalPhone.dataset.type = 'additionalPhone';
  email.innerText = 'Email';
  email.dataset.type = 'email';
  vk.innerText = 'VK';
  vk.dataset.type = 'VK';
  facebook.innerText = 'Facebook';
  facebook.dataset.type = 'Facebook';
  twitter.innerText = 'Twitter';
  twitter.dataset.type = 'Twitter';
  telegram.innerText = 'Telegram';
  telegram.dataset.type = 'Telegram';
  contactInput.placeholder = 'Введите данные контакта';
  contactInput.name = 'Телефон';
  contactInput.type = 'tel';
  contactInput.required = true;
  removeBtn.type = 'button';

  // Использована библиотека инпутмаск для шаблонизации полей ввода типа tel
  const im = new Inputmask("+7 (999)-999-99-99");
  im.mask(contactInput);


  removeBtn.addEventListener('click', function () {
    const contactArr = document.querySelectorAll('.contact');
    const contacts = document.querySelector('.modal__contacts');

    contact.remove();

    if (contactArr.length == 1) {
      contacts.classList.remove('modal__contacts-active');
    }

    if (contactArr.length == 10) {
      const addContactBtn = document.querySelector('.modal__contact-action');

      addContactBtn.classList.remove('modal__contact-action_not-active');
    }
  });

  contactInput.addEventListener('blur', function () {
    if (this.value) {
      removeBtn.classList.add('contact__remove-visible');
    }

    else {
      removeBtn.classList.remove('contact__remove-visible');
    }
  });

  if (contactInput.type === 'additionalPhone' || contactInput.type === 'tel') {
    contactInput.addEventListener('click', function () {
      contactInput.classList.remove('contact__input_error');
    });
  }

  contactInput.addEventListener('input', function () {
    contactInput.classList.remove('contact__input_error');
  });

  selected.addEventListener('click', function () {
    this.classList.toggle('contact__selected_active');
    dropdownMenu.classList.toggle('contact__dropdown-menu_active')
  });


  additionalPhone.addEventListener('click', function () {
    inputTypeChange(this);
    dropdownMenu.classList.remove('contact__dropdown-menu_active');
  });

  email.addEventListener('click', function () {
    inputTypeChange(this);
    dropdownMenu.classList.remove('contact__dropdown-menu_active');
  });

  vk.addEventListener('click', function () {
    inputTypeChange(this);
    dropdownMenu.classList.remove('contact__dropdown-menu_active');
  });

  facebook.addEventListener('click', function () {
    inputTypeChange(this);
    dropdownMenu.classList.remove('contact__dropdown-menu_active');
  });

  twitter.addEventListener('click', function () {
    inputTypeChange(this);
    dropdownMenu.classList.remove('contact__dropdown-menu_active');
  });

  telegram.addEventListener('click', function () {
    inputTypeChange(this);
    dropdownMenu.classList.remove('contact__dropdown-menu_active');
  });

  // Функция которая меняет тип input в зависимости от выбраного типа в выподающем списке (контакт)
  function inputTypeChange(element) {
    const selectText = select.innerText;
    const selectType = select.dataset.type;

    checkType(element.dataset.type);

    select.innerText = element.innerText;
    select.dataset.type = element.dataset.type;
    element.innerText = selectText;
    element.dataset.type = selectType;
  };

  // Функция проверяющая тип выбраного элемента в выподающем списке (контакт)
  function checkType(type) {
    contactInput.type = type;
    contactInput.value = '';

    if (type == 'tel') {
      im.mask(contactInput);
      contactInput.name = 'Телефон';
    }

    if (type == 'additionalPhone') {
      im.mask(contactInput);
      contactInput.name = 'Доп. Телефон';
    }

    if (type == 'email') {
      $(contactInput).inputmask('remove');
      contactInput.name = 'email';
    }

    if (type == 'Telegram') {
      $(contactInput).inputmask('remove');
      contactInput.name = type;
      contactInput.type = 'text';
    }

    if (type == 'Twitter') {
      $(contactInput).inputmask('remove');
      contactInput.name = type;
      contactInput.type = 'text';
    }

    if (type == 'VK') {
      $(contactInput).inputmask('remove');
      contactInput.name = type;
      contactInput.type = 'text';
    }

    if (type == 'Facebook') {
      $(contactInput).inputmask('remove');
      contactInput.name = type;
      contactInput.type = 'text';
    }
  };

  document.addEventListener('click', event => {
    let dontClose = false;
    event.composedPath().forEach(element => {
      if (element === dropdown) {
        dontClose = true;
      }
    });
    if (dontClose) return;
    dropdownMenu.classList.remove('contact__dropdown-menu_active');
  });

  selected.append(select);
  dropdown.append(selected);
  dropdownMenu.append(additionalPhone);
  dropdownMenu.append(email);
  dropdownMenu.append(vk);
  dropdownMenu.append(facebook);
  dropdownMenu.append(twitter);
  dropdownMenu.append(telegram);
  dropdown.append(dropdownMenu);
  contact.append(dropdown);
  contact.append(contactInput);
  contact.append(removeBtn);

  return contact;
}

// Рендер таблицы клиентов
function renderClientList(clientsListData) {
  const loader = document.querySelector('.clients-table__loader-tr');
  const tBody = document.querySelector('.clients-table__tbody');
  const clients = document.querySelectorAll('.clients-table__client');
  const loaderSearch = document.querySelector('.clients-table__loader-search');

  if (loaderSearch) {
    loaderSearch.remove();
  }

  if (clients) {
    clients.forEach(client => {
      client.remove();
    })
  }

  if (loader) {
    loader.remove();
  }

  clientsListData.forEach(clientData => {
    const client = getClientItem(clientData);

    tBody.append(client);
  });
}

// Функция возвращает tr с данными клиента
function getClientItem(clientData) {
  const tr = document.createElement('tr');
  const idTd = document.createElement('td');
  const id = document.createElement('span');
  const fioTd = document.createElement('td');
  const fio = document.createElement('span');
  const dateCreateTd = document.createElement('td');
  const dateCreateYMD = document.createElement('span');
  const dateCreateTime = document.createElement('span');
  const dateUpdateTd = document.createElement('td');
  const dateUpdateYMD = document.createElement('span');
  const dateUpdateTime = document.createElement('span');
  const contactTd = document.createElement('td');
  const dateCreate = new Date(clientData.createdAt);
  const dateUpdate = new Date(clientData.updatedAt);
  const actionsTd = document.createElement('td');
  const changeBtn = document.createElement('button');
  const deleteBtn = document.createElement('button');
  const linkCard = document.createElement('a');

  if (clientData.contacts.length > 0) {
    const contactsList = getContactsList(clientData.contacts);

    contactTd.append(contactsList);
  }

  tr.classList.add('clients-table__client');
  id.classList.add('clients-table__id');
  idTd.classList.add('clients-table__td', 'clients-table__td_id');
  fioTd.classList.add('clients-table__td', 'clients-table__td_fio');
  fio.classList.add('clients-table__fio');
  dateCreateTd.classList.add('clients-table__td', 'clients-table__td_date');
  dateCreateYMD.classList.add('clients-table__date-criate');
  dateCreateTime.classList.add('clients-table__time-criate');
  dateUpdateTd.classList.add('clients-table__td', 'clients-table__td_changes');
  dateUpdateYMD.classList.add('clients-table__date-update');
  dateUpdateTime.classList.add('clients-table__time-update');
  contactTd.classList.add('clients-table__td', 'clients-table__td_contacts');
  actionsTd.classList.add('clients-table__td', 'clients-table__td_actions');
  changeBtn.classList.add('clients-table__change-btn');
  linkCard.classList.add('clients-table__card');
  changeBtn.id = 'changeBtn';
  deleteBtn.classList.add('clients-table__delete-btn');
  deleteBtn.id = 'deleteBtn';
  linkCard.target = "_blank";

  id.textContent = clientData.id.slice(-5);
  id.id = clientData.id;
  changeBtn.dataset.id = clientData.id;
  fio.innerText = `${clientData.surname} ${clientData.name} ${clientData.lastName}`;
  dateCreateYMD.innerText = `${dateCreate.getDate()}.${dateCreate.getMonth()}.${dateCreate.getFullYear()}`;
  dateCreateTime.innerText = `${dateCreate.getHours()}:${dateCreate.getMinutes()}`;
  dateUpdateYMD.innerText = `${dateUpdate.getDate()}.${dateUpdate.getMonth()}.${dateUpdate.getFullYear()}`;
  dateUpdateTime.innerText = `${dateUpdate.getHours()}:${dateUpdate.getMinutes()}`;
  changeBtn.innerHTML = `
    <svg class="clients-table__contact-icon">
      <use xlink:href="img/sprite.svg#changeIcon"></use>
    </svg> Изменить`;
  deleteBtn.innerHTML = `
    <svg class="clients-table__contact-icon">
      <use xlink:href="img/sprite.svg#deleteIcon"></use>
    </svg> Удалить`;
  linkCard.innerText = 'Клиент';

  const idHash = id.id;
  linkCard.href = `#${idHash}`;

  deleteBtn.addEventListener('click', function () {
    const modalDelete = document.querySelector('.delete-client');
    const modalWrapp = document.querySelector('.modal-wrapp');

    modalDelete.classList.add('delete-client_visable');

    modalDelete.dataset.id = id.id;

    modalWrapp.classList.add('modal-wrapp_visable');
  });

  changeBtn.addEventListener('click', function () {
    const modalChange = document.querySelector('.change-client');
    const modalWrapp = document.querySelector('.modal-wrapp');
    document.forms.changeClient.reset();
    const placeholdersText = document.querySelectorAll('.placeholder-box__text');
    const contacts = document.querySelectorAll('.contact');
    const contactsWrapp = document.querySelector('.modal__contacts');
    const addContactBtn = document.querySelector('.modal__change-contact');
    const formChange = document.forms.changeClient;

    formChange.surname.disabled = 'true';
    formChange.name.disabled = 'true';
    formChange.lastName.disabled = 'true';
    addContactBtn.classList.add('modal__contact-action_disabled');

    placeholdersText.forEach(placeholder => {
      if (!placeholder.classList.contains('placeholder-box__text_down')) {
        placeholder.classList.add('placeholder-box__text_down');
      }

      if (contacts) {
        contacts.forEach(contact => {
          contact.remove();
          contactsWrapp.classList.remove('modal__contacts-active');
        })
      }
    })

    modalChange.classList.add('change-client_visable');

    modalChange.dataset.id = id.id;

    addContactDataInModal(modalChange.dataset.id);

    modalWrapp.classList.add('modal-wrapp_visable');
  });



  fioTd.append(fio);
  idTd.append(id);
  dateCreateTd.append(dateCreateYMD, dateCreateTime);
  dateUpdateTd.append(dateUpdateYMD, dateUpdateTime);
  actionsTd.append(changeBtn);
  actionsTd.append(linkCard);
  actionsTd.append(deleteBtn);
  tr.append(idTd);
  tr.append(fioTd);
  tr.append(dateCreateTd);
  tr.append(dateUpdateTd);
  tr.append(contactTd);
  tr.append(actionsTd);
  return tr;
}

// Функция которая возвращает список контактов клиента
function getContactsList(contactsListData) {
  const contactsList = document.createElement('ul');
  const btnCounter = document.createElement('button');

  contactsList.classList.add('clients-table__contacts-list');
  btnCounter.classList.add('clients-table__add-contacts-btn');

  if (contactsListData.length < 5) {
    contactsListData.forEach(contactData => {
      const contact = document.createElement('li');
      const tooltip = document.createElement('span');

      tooltip.classList.add('clients-table__tooltip');

      if (contactData.type == 'Телефон') {
        contact.innerHTML = `
      <svg class="clients-table__contact-icon">
        <use xlink:href="img/sprite.svg#contactPhone"></use>
      </svg>`
        contact.classList.add('clients-table__contacts-item');
        tooltip.innerText = `${contactData.value}`;
        tooltip.classList.add('clients-table__tooltip-tel');
      }

      if (contactData.type == 'email') {
        const spanValue = document.createElement('span');
        spanValue.classList.add('clients-table__tooltip-value');
        spanValue.innerText = `${contactData.value}`;

        contact.innerHTML = `
      <svg class="clients-table__contact-icon">
        <use xlink:href="img/sprite.svg#contactMail"></use>
      </svg>`
        contact.classList.add('clients-table__contacts-item');
        tooltip.innerText = `${contactData.type}: `;
        tooltip.append(spanValue);
        tooltip.classList.add('clients-table__tooltip-type');
      }

      if (contactData.type == 'Facebook') {
        const spanValue = document.createElement('span');
        spanValue.classList.add('clients-table__tooltip-value');
        spanValue.innerText = `${contactData.value}`;

        contact.innerHTML = `
      <svg class="clients-table__contact-icon">
        <use xlink:href="img/sprite.svg#contactFb"></use>
      </svg>`
        contact.classList.add('clients-table__contacts-item');
        tooltip.innerText = `${contactData.type}: `;
        tooltip.append(spanValue);
        tooltip.classList.add('clients-table__tooltip-type');
      }

      if (contactData.type == 'VK') {
        const spanValue = document.createElement('span');
        spanValue.classList.add('clients-table__tooltip-value');
        spanValue.innerText = `${contactData.value}`;
        contact.innerHTML = `
      <svg class="clients-table__contact-icon">
        <use xlink:href="img/sprite.svg#contactVk"></use>
      </svg>`
        contact.classList.add('clients-table__contacts-item');
        tooltip.innerText = `${contactData.type}: `;
        tooltip.append(spanValue);
        tooltip.classList.add('clients-table__tooltip-type');
      }

      if (contactData.type !== 'Телефон' && contactData.type !== 'email' && contactData.type !== 'Facebook' && contactData.type !== 'VK') {
        const spanValue = document.createElement('span');
        spanValue.classList.add('clients-table__tooltip-value');
        spanValue.innerText = `${contactData.value}`;

        contact.innerHTML = `
      <svg class="clients-table__contact-icon">
        <use xlink:href="img/sprite.svg#contactAdditional"></use>
      </svg>`
        contact.classList.add('clients-table__contacts-item');
        tooltip.innerText = `${contactData.type}: `;
        tooltip.append(spanValue);
        tooltip.classList.add('clients-table__tooltip-type');
      }


      contact.append(tooltip);
      contactsList.append(contact);
    });
  }

  else {
    let counter = 4;

    contactsListData.forEach(contactData => {
      const contact = document.createElement('li');
      const tooltip = document.createElement('span');

      tooltip.classList.add('clients-table__tooltip');

      if (contactData.type == 'Телефон') {
        contact.innerHTML = `
      <svg class="clients-table__contact-icon">
        <use xlink:href="img/sprite.svg#contactPhone"></use>
      </svg>`
        contact.classList.add('clients-table__contacts-item');
        tooltip.innerText = `${contactData.value}`;
        tooltip.classList.add('clients-table__tooltip-tel');

        counter--;

        if (counter < 0) {
          contact.classList.add('clients-table__contacts-item_invisible-4');
        }
      }

      if (contactData.type == 'email') {
        const spanValue = document.createElement('span');
        spanValue.classList.add('clients-table__tooltip-value');
        spanValue.innerText = `${contactData.value}`;

        contact.innerHTML = `
      <svg class="clients-table__contact-icon">
        <use xlink:href="img/sprite.svg#contactMail"></use>
      </svg>`
        contact.classList.add('clients-table__contacts-item');
        tooltip.innerText = `${contactData.type}: `;
        tooltip.append(spanValue);
        tooltip.classList.add('clients-table__tooltip-type');

        counter--;

        if (counter < 0) {
          contact.classList.add('clients-table__contacts-item_invisible-4');
        }
      }

      if (contactData.type == 'Facebook') {
        const spanValue = document.createElement('span');
        spanValue.classList.add('clients-table__tooltip-value');
        spanValue.innerText = `${contactData.value}`;

        contact.innerHTML = `
      <svg class="clients-table__contact-icon">
        <use xlink:href="img/sprite.svg#contactFb"></use>
      </svg>`
        contact.classList.add('clients-table__contacts-item');
        tooltip.innerText = `${contactData.type}: `;
        tooltip.append(spanValue);
        tooltip.classList.add('clients-table__tooltip-type');

        counter--;

        if (counter < 0) {
          contact.classList.add('clients-table__contacts-item_invisible-4');
        }
      }

      if (contactData.type == 'VK') {
        const spanValue = document.createElement('span');
        spanValue.classList.add('clients-table__tooltip-value');
        spanValue.innerText = `${contactData.value}`;
        contact.innerHTML = `
      <svg class="clients-table__contact-icon">
        <use xlink:href="img/sprite.svg#contactVk"></use>
      </svg>`
        contact.classList.add('clients-table__contacts-item');
        tooltip.innerText = `${contactData.type}: `;
        tooltip.append(spanValue);
        tooltip.classList.add('clients-table__tooltip-type');

        counter--;

        if (counter < 0) {
          contact.classList.add('clients-table__contacts-item_invisible-4');
        }
      }

      if (contactData.type !== 'Телефон' && contactData.type !== 'email' && contactData.type !== 'Facebook' && contactData.type !== 'VK') {
        const spanValue = document.createElement('span');
        spanValue.classList.add('clients-table__tooltip-value');
        spanValue.innerText = `${contactData.value}`;

        contact.innerHTML = `
      <svg class="clients-table__contact-icon">
        <use xlink:href="img/sprite.svg#contactAdditional"></use>
      </svg>`
        contact.classList.add('clients-table__contacts-item');
        tooltip.innerText = `${contactData.type}: `;
        tooltip.append(spanValue);
        tooltip.classList.add('clients-table__tooltip-type');

        counter--;

        if (counter < 0) {
          contact.classList.add('clients-table__contacts-item_invisible-4');
        }
      }

      contact.append(tooltip);
      contactsList.append(contact);
    });

    btnCounter.innerText = `+${contactsListData.length - 4}`

    btnCounter.addEventListener('click', function () {
      const contactsArr = this.parentNode.childNodes;
      this.classList.add('clients-table__add-contacts-btn_invisable')

      contactsArr.forEach(contactItem => {
        contactItem.classList.remove('clients-table__contacts-item_invisible', 'clients-table__contacts-item_invisible-4');
      })
    })

    contactsList.append(btnCounter);
  }


  return contactsList;
}

// Функция добовляет данные клиента в мадльное окно изменения
async function addContactDataInModal(id) {
  const clientData = await getClient(id);
  const idText = document.querySelector('.modal__client-id');
  const addContactBtn = document.querySelector('.modal__change-contact');
  const chageBtnSave = document.getElementById('changeClient');
  const chngeResetBtn = document.getElementById('resetChange');
  const ChangeForm = document.forms.changeClient;
  const name = ChangeForm.name;
  const surname = ChangeForm.surname;
  const lastName = ChangeForm.lastName;

  surname.disabled = false;
  name.disabled = false;
  lastName.disabled = false;
  addContactBtn.classList.remove('modal__contact-action_disabled');
  chageBtnSave.classList.remove('modal__save_disabled');
  chngeResetBtn.classList.remove('modal__reset_disabled');

  name.value = clientData.name;
  name.nextElementSibling.classList.remove('placeholder-box__text_down');
  surname.value = clientData.surname;
  surname.nextElementSibling.classList.remove('placeholder-box__text_down');
  idText.innerHTML = `ID: ${clientData.id}`;
  if (clientData.lastName) {
    const lastName = ChangeForm.elements.lastName;

    lastName.value = clientData.lastName;
    lastName.nextElementSibling.classList.remove('placeholder-box__text_down');
  }

  if (clientData.contacts) {
    const btnAddContact = document.querySelector('.modal__change-contact');

    clientData.contacts.forEach(contact => {
      btnAddContact.click();
      const btnsReset = document.querySelectorAll('.contact__remove');
      btnsReset[btnsReset.length - 1].classList.add('contact__remove-visible');
      const type = contact.type;

      if (type === 'Телефон') {
        const contactInputs = document.querySelectorAll('.contact__input[type="tel"');
        contactInputs[contactInputs.length - 1].value = contact.value;
        return;
      }

      if (type === 'Доп. Телефон') {
        const contactDropdowns = document.querySelectorAll(`.contact__dropdown-item[data-type="additionalPhone"]`);
        contactDropdowns[contactDropdowns.length - 1].click();
        const contactInputs = document.querySelectorAll('.contact__input[type="additionalPhone"');
        contactInputs[contactInputs - 1].value = contact.value;
        return;
      }

      const contactDropdowns = document.querySelectorAll(`.contact__dropdown-item[data-type="${type}"]`);
      contactDropdowns[contactDropdowns.length - 1].click();
      const contactInputs = document.querySelectorAll(`.contact__input[name="${type}"`);
      contactInputs[contactInputs.length - 1].value = contact.value;
    })
  }

}

// Функция которая удаляет все контакты из модальных окон, так же очищает сообщение об ошибках валидации
function deletContacts() {
  const contacts = document.querySelectorAll('.contact');
  const errorMassages = document.querySelectorAll('.modal__massage-error');
  const modalInputs = document.querySelectorAll('.modal__input');
  const contactInput = document.querySelectorAll('.contact__input');
  const modalContacts = document.querySelectorAll('.modal__contacts');

  contacts.forEach(contact => {
    contact.remove();
  });

  errorMassages.forEach(errorMassage => {
    errorMassage.innerText = '';
    errorMassage.classList.remove('modal__massage-error_active');
  });

  modalInputs.forEach(input => {
    input.nextSibling.classList.add('placeholder-box__text_down');
    input.value = '';
    input.classList.remove('modal__input_arror');
  });

  contactInput.forEach(input => {
    input.classList.remove('contact__input_error');
  });

  modalContacts.forEach(contactsWrap => {
    contactsWrap.classList.remove('modal__contacts-active');
  })
}

// Сортировка по id
async function sortingId(sortingType) {
  const valueSearch = document.querySelector('.header__search-input').value;
  let clientsList;
  if (valueSearch.length > 0) {
    clientsList = await searchClients(valueSearch);
  }

  else {
    clientsList = await getClientList();
  }

  const arrayID = [];
  const sortingClients = [];

  clientsList.forEach(client => {
    arrayID.push(client.id);
  });

  if (sortingType === 'ascending') {
    arrayID.sort((a, b) => a - b);
  }

  if (sortingType === 'descending') {
    arrayID.sort((a, b) => b - a);
  }

  for (const id of arrayID) {
    const index = clientsList.findIndex(Clientid => Clientid.id === id);
    sortingClients.push(clientsList[index]);
    clientsList.splice(index, 1);
  }

  renderClientList(sortingClients);
}

// Сортировка по ФИО
async function sortingFio(sortingType) {
  const valueSearch = document.querySelector('.header__search-input').value;
  let clientsList;
  if (valueSearch.length > 0) {
    clientsList = await searchClients(valueSearch);
  }

  else {
    clientsList = await getClientList();
  }

  const arrayFio = [];
  const sortingClients = [];

  clientsList.forEach(client => {
    arrayFio.push(`${client.surname}${client.name}${client.lastName}`.toLocaleLowerCase());
  });



  if (sortingType === 'ascending') {
    arrayFio.sort().reverse();
  }

  if (sortingType === 'descending') {
    arrayFio.sort();
  }

  for (const fio of arrayFio) {
    const index = clientsList.findIndex(Clientfio => `${Clientfio.surname}${Clientfio.name}${Clientfio.lastName}`.toLocaleLowerCase() === fio);
    sortingClients.push(clientsList[index]);
    clientsList.splice(index, 1);
  }

  renderClientList(sortingClients);
}

// Сортировка по времени добавления
async function sortTimeCreate(sortingType) {
  const valueSearch = document.querySelector('.header__search-input').value;
  let clientsList;
  if (valueSearch.length > 0) {
    clientsList = await searchClients(valueSearch);
  }

  else {
    clientsList = await getClientList();
  }

  const arrayTime = [];
  const sortingClients = [];

  clientsList.forEach(client => {
    arrayTime.push(new Date(`${client.createdAt}`));
  });

  if (sortingType === 'ascending') {
    arrayTime.sort((a, b) => a - b);
  }

  if (sortingType === 'descending') {
    arrayTime.sort((a, b) => b - a);
  }


  for (const createTime of arrayTime) {
    const index = clientsList.findIndex(ClientCreateTime => new Date(`${ClientCreateTime.createdAt}`).getTime() === createTime.getTime())
    sortingClients.push(clientsList[index]);
    clientsList.splice(index, 1);
  }
  renderClientList(sortingClients);
}

// Сортировка по времени изменения
async function sortTimeChange(sortingType) {
  const valueSearch = document.querySelector('.header__search-input').value;
  let clientsList;
  if (valueSearch.length > 0) {
    clientsList = await searchClients(valueSearch);
  }

  else {
    clientsList = await getClientList();
  }

  const arrayTime = [];
  const sortingClients = [];

  clientsList.forEach(client => {
    arrayTime.push(new Date(`${client.updatedAt}`));
  });

  if (sortingType === 'ascending') {
    arrayTime.sort((a, b) => a - b);
  }

  if (sortingType === 'descending') {
    arrayTime.sort((a, b) => b - a);
  }


  for (const createTime of arrayTime) {
    const index = clientsList.findIndex(ClientCreateTime => new Date(`${ClientCreateTime.updatedAt}`).getTime() === createTime.getTime())
    sortingClients.push(clientsList[index]);
    clientsList.splice(index, 1);
  }
  renderClientList(sortingClients);
}

// Рендер автодополнения к поиску
async function renderSearchClients() {
  const searchString = document.querySelector('.header__search-input').value;
  const searchDropdown = document.querySelector('.header__search-dropdown');
  const clientItem = document.querySelectorAll('.header__search-client')
  clientItem.forEach(client => client.remove());

  const searchClientsList = await searchClients(searchString);

  searchClientsList.forEach(client => {
    const clientItem = document.createElement('li');
    const clientBtn = document.createElement('button');

    clientItem.classList.add('header__search-client');
    clientBtn.classList.add('header__search-btn');
    clientBtn.innerText = `${client.name} ${client.surname}`;
    clientBtn.dataset.id = client.id;
    clientBtn.type = 'button';

    clientBtn.addEventListener('click', function () {
      const id = clientBtn.dataset.id;
      const client = document.getElementById(id).parentNode.parentNode;
      const windowHeight = window.innerHeight;
      if (client.getBoundingClientRect().y > windowHeight) {
        client.scrollIntoView({ behavior: "smooth" });
      }
      client.classList.add('clients-table__client_target');

      setTimeout(() => client.classList.remove('clients-table__client_target'), 500);
    });

    clientBtn.addEventListener('keydown', function (e) {
      if (e.code == 'ArrowDown') {
        if (clientBtn.parentNode.nextSibling) {
          clientBtn.blur();
          clientBtn.parentNode.nextSibling.childNodes[0].focus();
        }
      }

      if (e.code == 'ArrowUp') {
        if (clientBtn.parentNode.previousSibling) {
          clientBtn.blur();
          clientBtn.parentNode.previousSibling.childNodes[0].focus();
        }

        if (!clientBtn.parentNode.previousSibling) {
          clientBtn.blur();
          const input = document.querySelector('.header__search-input');
          input.focus();
        }
      }
    })

    clientItem.append(clientBtn);
    searchDropdown.append(clientItem);
  });

  if (searchString.length === 0) {
    const clientItem = document.querySelectorAll('.header__search-client')
    clientItem.forEach(client => client.remove());
  }
}



