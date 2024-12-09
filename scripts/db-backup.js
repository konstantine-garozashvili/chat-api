const { exec } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

async function backupMongoDB() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, '../backups');
  const backupPath = path.join(backupDir, `backup-${timestamp}`);

  try {
    await fs.mkdir(backupDir, { recursive: true });

    const cmd = `mongodump --uri="${process.env.MONGODB_URI}" --out="${backupPath}"`;
    
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error('Backup failed:', error);
        return;
      }
      console.log('Backup completed successfully');
      console.log('Output:', stdout);
    });
  } catch (error) {
    console.error('Error creating backup directory:', error);
  }
}

if (require.main === module) {
  backupMongoDB();
}

module.exports = backupMongoDB; 