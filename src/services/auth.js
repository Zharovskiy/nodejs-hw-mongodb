import createHttpError from "http-errors";
import { Users } from "../db/models/user.js";
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { Sessions } from "../db/models/session.js";
import { FIFTEEN_MINUTES, THIRTY_DAYS } from "../constants/index.js";

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

