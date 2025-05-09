const httpStatus = require("http-status");
const bcrypt = require("bcryptjs");
const { User, contactUS, Review, Partner, Customer } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken!");
  }
  const user = await User.create(userBody);
  return user;
};

const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const getUserByPhoneNumber = async (phoneNo) => {
  return User.findOne({ phoneNo });
};

const checkEmail = async (email) => {
  if (await User.isEmailTaken(email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  return true;
};

const checkPhoneNumber = async (phone) => {
  if (await User.isPhoneNoTaken(phone)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Phone Number already taken");
  }
  return true;
};
/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const getUserByEmailOrNumber = async (emailOrNumber, updateBody) => {
  const filter = {
    $or: [{ email: emailOrNumber }, { phoneNo: emailOrNumber }],
  };

  const updatedUser = await User.findOne(filter);
  if (!updatedUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }
  return updatedUser;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  user.isDeleted = true;
  await user.save();
  return user;
};

const googleLogin = async (userData) => {
  const user = await getUserByEmail(userData.email);
  if (user) {
    return user;
  }
  const newUser = await createUser(userData);
  return newUser;
};
const changePassword = async (userId, data) => {
  const user = await User.findById(userId);
  try {
    const res = await bcrypt.compare(data.oldPassword, user.password);
    if (res) {
      Object.assign(user, { password: data.newPassword });
      await user.save();
    } else throw new ApiError(httpStatus[422], "Old password didn't match");
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
const updateUserByEmailOrNumber = async (emailOrNumber, updateBody) => {
  const filter = {
    $or: [{ email: emailOrNumber }, { phoneNo: emailOrNumber }],
  };

  const updatedUser = await User.findOneAndUpdate(filter, updateBody, {
    new: true,
  });
  if (!updatedUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }
  return updatedUser;
};

module.exports = {
  checkPhoneNumber,
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  checkEmail,
  googleLogin,
  changePassword,
  getUserByPhoneNumber,
  getUserByEmailOrNumber,
  updateUserByEmailOrNumber,
};
