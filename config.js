module.exports = (ENV) => {
  const configs = {
    NIXDEV: {
      port: '/home/head/sockets/kandy.sock',
      psqlPort: 32782
    },
    'NIXDEV-DEV': {
      port: '/home/head/sockets/kandy-dev.sock',
      psqlPort: 32782
    },
    development: {
      port: 3000,
      db: {
        "username": "postgres",
        "password": "123456",
        "database": "postgres",
        "host": "127.0.0.1",
        "port": 5433,
        "dialect": "postgres",
        "pool": {
          "max": 10,
          "min": 0,
          "idle": 10000
        },
      }
    }
  };

  return configs[ENV];
};