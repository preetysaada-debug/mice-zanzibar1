const crypto = require('crypto');

// Base secret from env (recommended to set in production)
const baseSecret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// Runtime salt changes each server start so tokens issued before a restart
// become invalid — this helps force logout when the server restarts/stops.
const runtimeSalt = crypto.randomBytes(16).toString('hex');

const jwtSecret = `${baseSecret}::${runtimeSalt}`;

module.exports = {
  jwtSecret,
};
