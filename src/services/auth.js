import createHttpError from "http-errors";
import { Users } from "../db/models/user.js";
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { Sessions } from "../db/models/session.js";
import { ENV_VARS, FIFTEEN_MINUTES, SMTP, TEMPLATES_DIR, THIRTY_DAYS } from "../constants/index.js";
import jwt from 'jsonwebtoken';
import { env } from "../utils/env.js";
import { sendEmail } from "../utils/sendMail.js";
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const createUser = async (payload) => {
    const user = await Users.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');

    const encryptedPassword = await bcrypt.hash(payload.password, 10);

    return await Users.create({
        ...payload,
        password: encryptedPassword,
      });
};

export const loginUser = async (payload) => {
  const user = await Users.findOne({ email: payload.email });

  if (!user) throw createHttpError(404, 'User not found');

  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  const newSession = createSession();

  await Sessions.deleteOne({ userId: user._id });

  return await Sessions.create({
    userId: user._id,
    ...newSession,
  });
};

export const logoutUser = async (sessionId) => {
  await Sessions.deleteOne({ _id: sessionId });
};

export const refreshSession = async ({ sessionId, refreshToken }) => {

  const session = await Sessions.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

    if (isSessionTokenExpired) {
      throw createHttpError(401, 'Session token expired');
    }

    const newSession = createSession();

    await Sessions.deleteOne({ _id: sessionId });
  
    return await Sessions.create({
      userId: session.userId,
      ...newSession,
    });
};

export const requestResetToken = async (email) => {
  const user = await Users.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env(SMTP.JWT_SECRET),
    {
      expiresIn: '5m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env(ENV_VARS.APP_DOMAIN)}/auth/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: env(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (err) {
    if (err instanceof Error) throw createHttpError(500, "Failed to send the email, please try again later.");
    throw err;
  }
  
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env(SMTP.JWT_SECRET));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, "Token is expired or invalid.");
    throw err;
  }

  const user = await Users.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await Users.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );

  await Sessions.deleteOne({ userId: user._id });
};
