const { OAuth2Client } = require('google-auth-library');

/**
 * Take a google token and return informations include in
 *
 * @param {string} token
 * @returns {object}
 */

async function checkGoogleToken(token) {
  const uri = process.env.GOOGLE_CLIENT_ID;

  try {
    const client = new OAuth2Client(uri);
    const { payload } = await client.verifyIdToken({
      idToken: token,
      audience: uri,
    });

    return {
      isValid: true,
      user: {
        email: payload.email,
        fullname: payload.name,
        provider: 'google',
        pseudo: payload.given_name + String(Number(new Date())).slice(0, 3), //generate a random pseudo based on firstname
      },
    };
  } catch (error) {
    return {
      isValid: false,
      user: null,
    };
  }
}

module.exports = checkGoogleToken;
