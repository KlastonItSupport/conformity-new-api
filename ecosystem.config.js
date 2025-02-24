// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
module.exports = {
  apps: [
    {
      name: 'conformity-new-api',
      script: 'dist/main.js',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
        SELF_SIGNED_KEY_PATH: process.env.SELF_SIGNED_KEY_PATH,
        SELF_SIGNED_CRT_PATH: process.env.SELF_SIGNED_CRT_PATH,
      },
    },
  ],
};
