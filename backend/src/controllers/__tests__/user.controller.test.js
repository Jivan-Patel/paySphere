const { googleAuth } = require('../user.controller');
const User = require('../../models/user.model');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');
jest.mock('google-auth-library', () => {
  return {
    OAuth2Client: jest.fn().mockImplementation(() => {
      return {
        verifyIdToken: jest.fn().mockResolvedValue({
          getPayload: () => ({
            sub: 'google123',
            email: 'newuser@example.com',
            name: 'New User',
            picture: 'avatar.png',
          }),
        }),
      };
    }),
  };
});

jest.mock('../../models/user.model', () => {
  const mockConstructor = jest.fn().mockImplementation((data) => {
    return {
      ...data,
      save: jest.fn().mockResolvedValue({}),
    };
  });
  mockConstructor.findOne = jest.fn();
  return mockConstructor;
});

describe('Google Authentication Controller tests', () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: {
        credential: 'dummy_id_token',
        companyName: 'Test Company',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jwt.sign.mockReturnValue('dummy_jwt_token');
  });

  test("should return 'Account created successfully' for a new Google sign-up", async () => {
    User.findOne.mockResolvedValueOnce(null);

    await googleAuth(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'newuser@example.com' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: 'dummy_jwt_token',
      companyName: 'Test Company',
      message: 'Account created successfully',
    });
  });

  test("should return 'Logged in successfully' for an existing user logging in", async () => {
    const existingUser = {
      _id: 'user123',
      email: 'newuser@example.com',
      companyName: 'Test Company',
      googleId: 'google123',
      save: jest.fn().mockResolvedValue({}),
    };

    User.findOne.mockResolvedValueOnce(existingUser);

    await googleAuth(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'newuser@example.com' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: 'dummy_jwt_token',
      companyName: 'Test Company',
      message: 'Logged in successfully',
    });
  });
});
