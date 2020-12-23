module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "p0stgr3s.n0djs.r00t",
    DB: "wscargo2",
    dialect: "postgres",
    PORT:"5432",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };