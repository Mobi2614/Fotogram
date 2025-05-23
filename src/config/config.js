const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description("Mongo DB url"),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ISSUER: Joi.string().required().description("JWT issuer"),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minutes after which reset password token expires")
      .required(),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .required()
      .default(10)
      .description("minutes after which verify email token expires"),
    RESET_PASSWORD_INTERVAL: Joi.number()
      .default(10)
      .description("minutes after which password reset request could be sent")
      .required(),
    RESET_PASSWORD_TRIES: Joi.number()
      .default(10)
      .description("Reset Password Retries")
      .required(),
    RESET_PASSWORD_INTERVAL: Joi.number()
      .default(10)
      .description("minutes after which password reset request could be sent")
      .required(),
    RESET_PASSWORD_TRIES: Joi.number()
      .default(10)
      .description("Reset Password Retries")
      .required(),
    SMTP_HOST: Joi.string()
      .description("server that will send the emails")
      .required(),
    SMTP_PORT: Joi.number()
      .description("port to connect to the email server")
      .required(),
    SMTP_USERNAME: Joi.string()
      .description("username for email server")
      .required(),
    SMTP_PASSWORD: Joi.string()
      .description("password for email server")
      .required(),
    EMAIL_FROM: Joi.string()
      .description("the from field in the emails sent by the app")
      .required(),
    EMAIL_TO: Joi.string()
      .description("the TO field in the emails receiver by the app")
      .required(),
    CLIENT_URL: Joi.string().description("Client side url").required(),
    BACKEND_URL: Joi.string().description("Backend url").required(),
    CLIENT_USER_URL: Joi.string().description("Client user url").required(),
    AZURE_CONN_STRING: Joi.string()
      .description("Azure connection string")
      .required(),
    SUPPORT_EMAIL: Joi.string()
      .description("Support Email required")
      .required(),
    SUPPORT_PHONE_NUMBER: Joi.string()
      .description("Support Phone Number required")
      .required(),
    REMINDER_JOB_INTERVAL: Joi.string()
      .description("Reminder Job Interval Required")
      .required(),
    ENCRYPTION_KEY: Joi.string()
      .description("Encryption key Required")
      .required(),
  })

  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  clientUrl: envVars.CLIENT_URL,
  backendUrl: envVars.BACKEND_URL,
  clientUserUrl: envVars.CLIENT_USER_URL,
  totalDBSIze: envVars.DB_STORAGE_SIZE_IN_GB,
  port: envVars.PORT,
  sms_api_key: envVars.SMS_API_KEY,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === "test" ? "-test" : ""),
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    issuer: envVars.JWT_ISSUER,
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    passwordResetInterval: envVars.RESET_PASSWORD_INTERVAL,
    resetPasswordRetries: envVars.RESET_PASSWORD_TRIES,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },

    from: envVars.EMAIL_FROM,
    to: envVars.EMAIL_TO,
    support_email: envVars.SUPPORT_EMAIL,
    support_phone_number: envVars.SUPPORT_PHONE_NUMBER,
  },
  azure: { connectionString: envVars.AZURE_CONN_STRING },
  reminder_job_interval: envVars.REMINDER_JOB_INTERVAL,
  encryptionKey: envVars.ENCRYPTION_KEY,
};
