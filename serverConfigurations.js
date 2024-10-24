const serverConfigurations = {
  port: 8080,
  appName: "state-affair-srv",
  logFile: "./logs/application.log",
  db: {
    username: "XXX",
    password: "XXX",
    url: "cluster0.1w9kv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    database: "mytestdata",
    newsCollection: "news",
  },
  newsAPI: "https://newsapi.org/v2/everything",
  newsApikey: "XXX",
  cache: {
    cacheRoute: "http://localhost:8080/v1/cache/",
    stdTTL: 3600,
    checkperiod: 3600,
    maxKeys: 100,
  },
};

export default serverConfigurations;
