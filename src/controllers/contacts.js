import createHttpError from 'http-errors';
import { getAllContacts, getContactById } from '../services/contacts.js';
import { isValidObjectId } from 'mongoose';

export const getContactsController = async (req, res) => {
  const contacts = await getAllContacts();
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const id = req.params.contactId;

  if (!isValidObjectId(id)) {
    next(createHttpError(400, `id ${id} not correct!`));
    return;
  }

  const contact = await getContactById(id);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data: contact,
  });
};
