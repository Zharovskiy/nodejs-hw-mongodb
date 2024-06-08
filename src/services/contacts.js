import { Contact } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({ page, perPage }) => {
  const contacts = await Contact.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  return contact;
};

export const createContact = async (payload) => {
  const contact = await Contact.create(payload);
  return contact;
};

export const updateContact = async (id, payload) => {
  const contact = await Contact.findByIdAndUpdate(id, payload, { new: true });
  return contact;
};

export const deleteContact = async (id) => {
  const contact = await Contact.findOneAndDelete({
    _id: id,
  });
  return contact;
};
