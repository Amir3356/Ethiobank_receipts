import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT 
  nodeEnv: process.env.NODE_ENV || 'development',
  supportedBanks: ['cbe', 'dashen', 'awash', 'boa', 'zemen', 'tele']
};

export default config;
