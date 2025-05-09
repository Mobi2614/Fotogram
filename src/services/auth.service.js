const httpStatus = require("http-status");
const tokenService = require("./token.service");
const userService = require("./user.service");
const ApiError = require("../utils/ApiError");

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  } else if (!user.isEmailVerified) {
    throw new ApiError(httpStatus.UNAUTHORIZED, `Please verify your email!`);
  } else if (!user.isActive) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Your Account has been suspended"
    );
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (userId) => {
  await userService.clearTokens(userId);
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const user = await tokenService.verifyToken(refreshToken);

    if (!user) {
      throw new Error();
    }
    const userData = { id: Object.values(user)[0] };
    return tokenService.generateAuthTokens(userData);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (receiver, newPassword) => {
  try {
    await userService.updateUserById(receiver, {
      password: newPassword,
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      `Password reset failed ${error}`
    );
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    return tokenService.verifyToken(verifyEmailToken);
  } catch (error) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      `Email verification failed ${error}`
    );
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};
