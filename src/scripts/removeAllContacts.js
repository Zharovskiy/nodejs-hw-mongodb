import fs from 'node:fs/promises';
import { PATH_DB } from '../constants/contacts.js';

export const removeAllContacts = async () => {
  try {
    let contacts = [];
    await fs.writeFile(PATH_DB, JSON.stringify(contacts, null, 2), 'utf-8');
  } catch (err) {
    throw new Error('Помилка видалення контактів:' + err);
  }
};

await removeAllContacts();
