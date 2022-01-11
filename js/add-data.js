// Создание клиента на сервере
export async function createClient(client) {
  const response = await fetch('http://localhost:3000/api/clients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: client.name,
      surname: client.surname,
      lastName: client.lastName,
      contacts: client.contacts,
    })
  });

  if (response.status === 404 || response.status === 422 || response.status === 500) {
    const data = await response.json();

    return data;
  }

  const data = await response.json();

  return data;
};

// Получение массива клиентов
export async function getClientList() {
  const response = await fetch('http://localhost:3000/api/clients');
  const data = await response.json();

  return data;
};

// Удаление клиента на сервере
export async function deleteClient(clientId) {
  const response = await fetch(`http://localhost:3000/api/clients/${clientId}`, {
    method: 'DELETE',
  });
  const data = await response.json();
}

// Получение клиента по ID
export async function getClient(id) {
  const response = await fetch(`http://localhost:3000/api/clients/${id}`);
  const data = await response.json();

  return data;
};

// Изменение данных клиента на сервере
export async function changeClient(id, clientData) {
  const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(clientData)
  });
  const data = await response.json();

  if (response.status === 404 || response.status === 422 || response.status === 500) {
    const data = await response.json();

    return data;
  }

  return data;
}

// Поиск клиента по строке
export async function searchClients(string) {
  const response = await fetch(`http://localhost:3000/api/clients/?search=${string}`);
  const data = await response.json();

  return data;
}
