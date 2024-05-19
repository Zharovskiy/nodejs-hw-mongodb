import fs from 'node:fs/promises';
import { PATH_DB } from '../constants/contacts.js';

export const thanos = async () => {
  try {
    let contacts = [];
    try {
      const buffer = await fs.readFile(PATH_DB);
      contacts = JSON.parse(buffer.toString());
    } catch (readError) {
      throw new Error('Помилка читання файлу: ' + readError.message);
    }

    const remainingContacts = contacts.filter(() => Math.random() >= 0.5);

    await fs.writeFile(
      PATH_DB,
      JSON.stringify(remainingContacts, null, 2),
      'utf-8',
    );
  } catch (err) {
    throw new Error('Помилка обробки контактів:' + err);
  }
};

await thanos();
