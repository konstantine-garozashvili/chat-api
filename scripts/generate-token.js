const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Generate a JWT token for testing purposes
 * @param {string} userId - The user ID to generate token for
 * @param {number} expiresIn - Token expiration in days (default: 30)
 */
function generateToken(userId, expiresIn = 30) {
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: `${expiresIn}d` }
  );
  
  return token;
}

// If running directly (not imported)
if (require.main === module) {
  const userId = process.argv[2];
  const days = process.argv[3];

  if (!userId) {
    console.error('Please provide a user ID');
    console.log('Usage: node generate-token.js <userId> [days]');
    process.exit(1);
  }

  const token = generateToken(userId, days);
  console.log('\nGenerated Token:');
  console.log(token);
  console.log('\nUse this token in the Authorization header:');
  console.log(`Authorization: Bearer ${token}\n`);
}

module.exports = generateToken; 