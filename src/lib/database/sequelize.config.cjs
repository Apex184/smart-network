require('dotenv/config');

const isDev = process.env.NODE_ENV === 'development';
const isStaging = process.env.NODE_ENV === 'staging';

const shouldUseSsl = process.env.SSL_CERT;

const config = {
  dialect: 'postgres',
  url: process.env.DATABASE_URL,
  define: {
    timestamps: true,
    freezeTableName: true,
  },
  logQueryParameters: true,
  logging: isDev || isStaging,
  ...(shouldUseSsl && {
    dialectOptions: {
      ssl: {
        require: true,
        ca: process.env.SSL_CERT,
      },
    },
  }),
};



module.exports = {
  development: {
    ...config,
  },
  test: {
    ...config,
  },
  staging: {
    ...config,
  },
  production: {
    ...config,
  },
};
