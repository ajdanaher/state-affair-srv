import fetch from "node-fetch";
import serverConfigurations from "../../serverConfigurations.js";
import log from "./Logger.js";

export function getFromCache(q) {
  return new Promise(async (resolve, reject) => {
    const url = `${serverConfigurations.cache.cacheRoute}get?key=${q}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      resolve(data);
    } catch (e) {
      const error = `Error in get Cache data. ${e}`;
      log.error(error);
      reject(error);
    }
  });
}

export function setIntoCache(key, value) {
  const url = `${serverConfigurations.cache.cacheRoute}set`;
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ key, value }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      resolve(data);
    } catch (e) {
      const error = `Error in set Cache data. ${e}`;
      log.error(error);
      reject(error);
    }
  });
}

export function fetchRemoteNews(q) {
  return new Promise(async (resolve, reject) => {
    const url = `${serverConfigurations.newsAPI}?q=${q}&apiKey=${serverConfigurations.newsApikey}&pageSize=5`;
    try {
      const response = await fetch(url);
      const news = await response.json();
      if (news && news.articles) {
        const result = news.articles
          .map((article) => {
            const { title, publishedAt, url, description, content } = article;
            return {
              title,
              publishedAt,
              url,
              description,
              content,
              topic: q,
              state: "CA",
            };
          })
          .filter(
            (article) =>
              article.tile !== "[Removed]" &&
              article.description !== "[Removed]" &&
              article.content !== "[Removed]"
          );
        resolve(result);
      } else {
        resolve([]);
      }
    } catch (e) {
      const error = "Error in fatching remote news.";
      log.error(`${error}. ${e}`);
      reject(error);
    }
  });
}
