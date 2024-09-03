const { execSync } = require('child_process');
const { fetchAndSetSecrets } = require('./fetchSecrets');

const secretName = 'ishwar-splitter-secret'; // Replace with your actual secret name

async function fetchSecretsAndRunMigrations() {
  try {
    // Fetch and set secrets
    await fetchAndSetSecrets(secretName);

    console.log('Secrets loaded successfully into process.env');

    // Run Prisma migrations
    console.log('Running Prisma migrations...');
    execSync('npx prisma migrate dev', { stdio: 'inherit' });

    console.log('Prisma migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

fetchSecretsAndRunMigrations();
