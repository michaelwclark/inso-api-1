const envVars = {
  MONGO_CONNECTION_STRING:
    process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27017/inso',
  SENDGRID_KEY: process.env.SENDGRID_KEY || 'SENDGRID_KEY',
  PORT: process.env.PORT || 3000,
  SECRET: process.env.SECRET || 'SECRET',
  SSO_REDIRECT: process.env.SSO_REDIRECT || 'SSO_REDIRECT',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'GOOGLE_CLIENT_ID',
  GOOGLE_SECRET: process.env.GOOGLE_SECRET || 'GOOGLE_SECRET',
  GOOGLE_CALLBACK: process.env.GOOGLE_CALLBACK || 'GOOGLE_CALLBACK',
  OTA_SECRET: process.env.OTA_SECRET || 'OTA_SECRET',
  OTA_CODE_REPLACER: process.env.OTA_CODE_REPLACER || 'OTA_CODE_REPLACER',
  TOKEN_REPLACEMENT: process.env.TOKEN_REPLACEMENT || 'TOKEN_REPLACEMENT',
  DISCUSSION_REDIRECT: process.env.DISCUSSION_REDIRECT || 'DISCUSSION_REDIRECT',
  AWS_EVENTBRIDGE_ACCESS_KEY_ID:
    process.env.AWS_EVENTBRIDGE_ACCESS_KEY_ID ||
    'AWS_EVENTBRIDGE_ACCESS_KEY_ID',
  AWS_EVENTBRIDGE_SECRET:
    process.env.AWS_EVENTBRIDGE_SECRET || 'AWS_EVENTBRIDGE_SECRET',
  AWS_REGION: process.env.AWS_REGION || 'AWS_REGION',
  AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY || 'AWS_S3_ACCESS_KEY',
  AWS_S3_KEY_SECRET: process.env.AWS_S3_KEY_SECRET || 'AWS_S3_KEY_SECRET',
  BUCKET_NAME: process.env.BUCKET_NAME || 'BUCKET_NAME',
  PASSWORD_RESET_PAGE: process.env.PASSWORD_RESET_PAGE || 'PASSWORD_RESET_PAGE',
  VERIFIED_REDIRECT: process.env.VERIFIED_REDIRECT || 'VERIFIED_REDIRECT',
  EMAIL_VERIFICATION_REDIRECT:
    process.env.EMAIL_VERIFICATION_REDIRECT || 'EMAIL_VERIFICATION_REDIRECT',
  PASSWORD_RESET_REDIRECT:
    process.env.PASSWORD_RESET_REDIRECT || 'PASSWORD_RESET_REDIRECT',
  JWT_SECRET: process.env.JWT_SECRET || 'JWT_SECRET',
};

export default envVars;
