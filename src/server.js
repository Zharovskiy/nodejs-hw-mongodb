import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import { ENV_VARS } from './constants/index.js';
import { notFoundMiddleware } from './middlewares/notFoundMiddleware.js';
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware.js';
import { getAllContacts, getContactById } from './services/contacts.js';

export const setupServer = () => {
  const app = express();

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(cors());

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();
    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    console.log('contact: ', contact);

    if (!contact) {
      return res.status(404).json({
        status: 404,
        message: `Contact with id ${contactId} not found!`,
      });
    }

    res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  });

  app.use('*', notFoundMiddleware);

  app.use(errorHandlerMiddleware);

  const PORT = Number(env(ENV_VARS.PORT, '3000'));

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
