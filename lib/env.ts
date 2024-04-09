const getEnvironmentVariable = (
  environmentVariable: string,
  strict = true,
): string => {
  const unvalidatedEnvironmentVariable = process.env[environmentVariable];
  if (!unvalidatedEnvironmentVariable) {
    if (strict) {
      throw new Error(
        `Couldn't find environment variable: ${environmentVariable}`,
      );
    }
    // also lunch a warning
    // TODO: dont forget this log
    // console.warn(
    //   `WARNING: Couldn't find environment variable: ${environmentVariable}`,
    // );
    return "";
  } else {
    return unvalidatedEnvironmentVariable;
  }
};

const checkNotEmptyEnvVars = (envVars: string[]) => {
  envVars.forEach((envVar) => {
    getEnvironmentVariable(envVar);
  });
};

// env variables
const get = {
  // vercel
  vercelEnv: getEnvironmentVariable("VERCEL_ENV", false),

  // env
  nodeEnv: getEnvironmentVariable("NODE_ENV"),

  // github
  githubClientId: getEnvironmentVariable("GITHUB_CLIENT_ID"),
  githubSecret: getEnvironmentVariable("GITHUB_CLIENT_SECRET"),

  // Google
  googleClientId: getEnvironmentVariable("GOOGLE_CLIENT_ID"),
  googleClientSecret: getEnvironmentVariable("GOOGLE_CLIENT_SECRET"),

  // nextauth
  // authSecret: getEnvironmentVariable("AUTH_SECRET"),
  // authUrl: getEnvironmentVariable("AUTH_URL"),

  // public
  domain: getEnvironmentVariable("DOMAIN"),

  // resend
  resendApiKey: getEnvironmentVariable("RESEND_API_KEY"),
};

export const env = {
  get: get,
  checkNotEmptyEnvVars: checkNotEmptyEnvVars,
};
