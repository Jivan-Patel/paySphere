const { googleAuth, deleteAccount } = require('../user.controller');
const User = require('../../models/user.model');
const Employee = require('../../models/employee.model');
const PayrollUpdate = require('../../models/payroll.model');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

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
  mockConstructor.findById = jest.fn();
  mockConstructor.findByIdAndDelete = jest.fn();
  return mockConstructor;
});

jest.mock('../../models/employee.model', () => {
  return {
    deleteMany: jest.fn(),
  };
});

jest.mock('../../models/payroll.model', () => {
  return {
    deleteMany: jest.fn(),
  };
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

describe('Delete Account Controller tests', () => {
  let req;
  let res;
  let next;
  let mockSession;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { userId: 'user123' };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };
    jest.spyOn(mongoose, 'startSession').mockResolvedValue(mockSession);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should delete account atomically within a transaction', async () => {
    User.findById.mockResolvedValue({ _id: 'user123' });
    Employee.deleteMany.mockReturnValue({ session: jest.fn().mockResolvedValue({}) });
    PayrollUpdate.deleteMany.mockReturnValue({ session: jest.fn().mockResolvedValue({}) });
    User.findByIdAndDelete.mockReturnValue({ session: jest.fn().mockResolvedValue({}) });

    await deleteAccount(req, res, next);

    expect(mongoose.startSession).toHaveBeenCalled();
    expect(mockSession.startTransaction).toHaveBeenCalled();
    expect(mockSession.commitTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Account and associated data deleted successfully.' });
  });

  test('should return 404 if user not found', async () => {
    User.findById.mockResolvedValue(null);

    await deleteAccount(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    expect(mongoose.startSession).not.toHaveBeenCalled();
  });

  test('should abort transaction and call next(error) on failure', async () => {
    const error = new Error('Database failure');
    User.findById.mockResolvedValue({ _id: 'user123' });
    Employee.deleteMany.mockImplementation(() => { throw error; });

    await deleteAccount(req, res, next);

    expect(mockSession.abortTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
  });

  test('should fall back to non-transactional delete when transactions are not supported', async () => {
    jest.spyOn(mongoose, 'startSession').mockRejectedValue(new Error('Transactions not supported'));

    User.findById.mockResolvedValue({ _id: 'user123' });
    Employee.deleteMany.mockResolvedValue({ deletedCount: 3 });
    PayrollUpdate.deleteMany.mockResolvedValue({ deletedCount: 5 });
    User.findByIdAndDelete.mockResolvedValue({ deletedCount: 1 });

    await deleteAccount(req, res, next);

    expect(Employee.deleteMany).toHaveBeenCalledWith({ createdBy: 'user123' }, {});
    expect(PayrollUpdate.deleteMany).toHaveBeenCalledWith({ createdBy: 'user123' }, {});
    expect(User.findByIdAndDelete).toHaveBeenCalledWith('user123', {});
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Account and associated data deleted successfully.' });
  });
});
