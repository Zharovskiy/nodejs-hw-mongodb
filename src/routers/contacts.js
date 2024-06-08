import { Router } from 'express';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';
// import { validateBody } from '../middlewares/validateBody.js';
// import { createStudentSchema } from '../validation/createContact.js';
// import { updateStudentSchema } from '../validation/updateContact.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const contactsRouter = Router();

contactsRouter.get('/contacts', ctrlWrapper(getContactsController));

contactsRouter.get(
  '/contacts/:contactId',
  ctrlWrapper(getContactByIdController),
);

contactsRouter.post('/contacts', ctrlWrapper(createContactController));

contactsRouter.patch(
  '/contacts/:contactId', ctrlWrapper(updateContactController),
);

contactsRouter.delete(
  '/contacts/:contactId', ctrlWrapper(deleteContactController),
);

export default contactsRouter;
