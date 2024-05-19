import fs from 'node:fs/promises';
import { PATH_DB } from '../constants/contacts.js';

export const getAllContacts = async () => {
  try {
    let contacts = [];
    const buffer = await fs.readFile(PATH_DB);
    contacts = JSON.parse(buffer.toString());
    return contacts;
  } catch (readError) {
    throw new Error('Помилка читання файлу: ' + readError.message);
  }
};

console.log(await getAllContacts());
