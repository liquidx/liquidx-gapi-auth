const fs = require('fs');
const { google } = require('googleapis');

class FileTokenStorage {
  constructor(filename) {
    this.tokenFilename = filename;
  }

  readToken() {
    return fs.promises.readFile(this.tokenFilename).then((body) => JSON.parse(body));
  }

  writeToken(token) {
    return fs.promises.writeFile(this.tokenFilename, JSON.stringify(token));
  }
}

const authenticatedClient = (credentialsFile, clientScopes, storage, authCode) => {
  // Load client secrets from a local file.
  return fs.promises
    .readFile(credentialsFile)
    .then((content) => {
      return JSON.parse(content);
    })
    .then((credentials) => {
      const { client_secret, client_id, redirect_uris } = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

      return storage
        .readToken()
        .then((token) => {
          // TODO: Check scopes == clientScopes before reusing this.
          oAuth2Client.setCredentials(token);
          return { client: oAuth2Client };
        })
        .catch((err) => {
          console.log(authCode);
          if (authCode) {
            // Supply the auth code and get the token.
            return oAuth2Client.getToken(authCode).then(({ tokens }) => {
              storage.writeToken(tokens);
              oAuth2Client.setCredentials(tokens);
              return { client: oAuth2Client };
            });
          } else {
            // return the URL
            const authUrl = oAuth2Client.generateAuthUrl({
              access_type: 'offline',
              scope: clientScopes,
            });
            return { client: oAuth2Client, authUrl: authUrl };
          }
        });
    });
};

module.exports = {
  authenticatedClient,
  FileTokenStorage,
};
