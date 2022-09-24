const { mkdir } = require('fs');
const path = require('path');
const { S3Client } = require('@aws-sdk/client-s3');
const S3SyncClient = require('s3-sync-client');

const s3Client = new S3Client({ region: 'eu-central-1' });
const { sync } = new S3SyncClient({ client: s3Client });

const soundPath = path.join(__dirname, 'sounds');

async function soundSync() {
  return new Promise(resolve => {
    mkdir(soundPath, { recursive: true }, async () => {
      const abc = await sync('s3://carnagebot-sounds', soundPath);
      console.log('synced!', abc);
      resolve();
    });
  });
}

soundSync();

module.exports = {
  soundSync,
}
