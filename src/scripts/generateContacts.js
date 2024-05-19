import fs from 'node:fs/promises';
import { PATH_DB } from '../constants/contacts.js';
import { createFakeContact } from '../utils/createFakeContact.js';

const generateContacts = async (number) => {
  try {
    let contacts = [];
    try {
      const buffer = await fs.readFile(PATH_DB);
      contacts = JSON.parse(buffer.toString());
    } catch (readError) {
      throw new Error('Помилка читання файлу: ' + readError.message);
    }
    for (let i = 0; i < number; i += 1) {
      contacts.push(createFakeContact());
    }
    await fs.writeFile(PATH_DB, JSON.stringify(contacts, null, 2), 'utf-8');
  } catch (err) {
    throw new Error('Помилка запису контактів:' + err);
  }
};

await generateContacts(5);
