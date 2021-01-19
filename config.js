let config;

if (process.env.NODE_ENV === 'production') {
  config = {
    urlCore: 'http://138.68.85.134/api',
  };
} else {
  config = {
    urlCore: 'https://localhost:44389/api',
  };
}

export { config };
