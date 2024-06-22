import { Router } from 'express';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema } from '../validation/createContact.js';
import { updateContactSchema } from '../validation/updateContact.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const contactsRouter = Router();

contactsRouter.get('/', 
ctrlWrapper(getContactsController));

contactsRouter.get(
  '/:contactId',
  ctrlWrapper(getContactByIdController),
);

contactsRouter.post('/', 
  validateBody(createContactSchema), 
  ctrlWrapper(createContactController));

contactsRouter.patch(
  '/:contactId', 
  validateBody(updateContactSchema), 
  ctrlWrapper(updateContactController),
);

contactsRouter.delete(
  '/:contactId', 
  ctrlWrapper(deleteContactController),
);

export default contactsRouter;
