import { Contact } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({ 
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId,
  }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = Contact.find();

  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').in(filter.isFavourite);
  }
  if (filter.type) {
    contactsQuery.where('contactType').in(filter.type);
  }

  contactsQuery.where('userId').in(userId);

  const contactsCount = await Contact.find().merge(contactsQuery).countDocuments();

  const contacts = await contactsQuery.skip(skip).limit(limit).sort({ [sortBy]: sortOrder }).exec();

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({_id: contactId, userId,});
  return contact;
};

export const createContact = async ( userId, payload, photoUrl ) => {
  const contact = await Contact.create({ photo: photoUrl, userId, ...payload});
  return contact;
};

export const updateContact = async (photoUrl, contactId, userId, payload) => {
  const contact = await Contact.findOneAndUpdate({ _id: contactId, userId}, {payload, photo: photoUrl}, { new: true });
  return contact;
};

export const deleteContact = async (contactId, userId) => {
  const contact = await Contact.findOneAndDelete({
    _id: contactId, 
    userId,
  });
  return contact;
};
