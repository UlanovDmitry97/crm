import { render } from './render.js';
import { getClientList } from './add-data.js';

const clientsList = await getClientList();

// Рендер приложения
await render(clientsList);

