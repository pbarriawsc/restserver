module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "wsc2020",
    DB: "wscargo9",
    dialect: "postgres",
    PORT:"5432",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    }
};
