import dotenv from 'dotenv';

dotenv.config();
module.exports = {
  apps: [
    {
      name: 'conformity-new-api',
      script: 'dist/main.js',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        SELF_SIGNED_KEY_PATH: process.env.SELF_SIGNED_KEY_PATH,
        SELF_SIGNED_CRT_PATH: process.env.SELF_SIGNED_CRT_PATH,
      },
    },
  ],
};
