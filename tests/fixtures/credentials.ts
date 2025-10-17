// Centralized credentials helper
export const getCredentials = () => {
  const EMAIL = process.env.TEST_USER;
  const PASSWORD = process.env.TEST_PASSWORD;

  if (!EMAIL || !PASSWORD) {
    throw new Error("TEST_USER / TEST_PASSWORD environment variables are not set");
  }

  return { email: EMAIL, password: PASSWORD };
};