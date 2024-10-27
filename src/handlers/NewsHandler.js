import serverConfigurations from "../../serverConfigurations.js";
import { default as CODES } from "../helpers/statusCodes.js";
import log from "../helpers/Logger.js";
import validate from "../helpers/RequestValidator.js";
import { createDB, queryDB, queryByID } from "../helpers/DBHelper.js";
import { fetchRemoteNews } from "../helpers/http.js";
import crypto from "crypto";
import { getFromCache, setIntoCache } from "../helpers/http.js";
import myCache from "../helpers/CacheServer.js";

const getNews = async (req, res) => {
  const corr_id = req.headers["X-Correlation-Id"];
  const { db } = serverConfigurations;
  const { state, topic, search: searchString, title, _id } = req.query;
  const q = {};
  if (state) {
    q.state = state;
  }
  if (topic) {
    q.topic = topic;
  }
  if (title) {
    q.title = title;
  }
  if (_id) {
    q._id = _id;
  }
  try {
    let results = null;
    let fallBack = false;
    try {
      if (state && topic && title) {
        const hash = crypto
          .createHash("sha256")
          .update(`${state}#${topic}#${title}`)
          .digest("hex");
        results = await getFromCache(hash);
        if (results.message === "No Data Found") {
          fallBack = true;
        } else {
          return res.status(CODES.OK).json(results);
        }
      } else {
        fallBack = true;
      }
    } catch (e) {
      log.error(`Error in getting Cached Data. ${e}`);
      fallBack = true;
    }
    //Fall Back
    if (fallBack === true) {
      if (_id) {
        results = await queryByID(db.database, db.newsCollection, _id, corr_id);
        fallBack = false;
      } else {
        results = await queryDB(db.database, db.newsCollection, q, corr_id);
      }
    }

    if (searchString && results.length > 0) {
      const finalResults = results.filter((result) => {
        const re = new RegExp(searchString);
        return result.title.search(re) !== -1;
      });
      res.status(CODES.OK).json(finalResults);
    } else {
      res.status(CODES.OK).json(results);
    }
    fallBack &&
      results.forEach((result) => {
        const hash = crypto
          .createHash("sha256")
          .update(`${result.state}#${result.topic}#${result.title}`)
          .digest("hex");
        myCache.set(hash, result);
      });
  } catch (e) {
    log.error(`${e}, corr_id=${corr_id}`);
    res.status(CODES.INTERNAL_SERVER_ERROR).json({ message: e });
  }
};

const updateDB = (key, value, corr_id) =>
  new Promise((resolve, reject) => {
    const { db } = serverConfigurations;
    Promise.all([
      setIntoCache(key, value),
      createDB(db.database, db.newsCollection, value, corr_id),
    ])
      .then((result) => {
        resolve(result);
      })
      .catch((e) => {
        reject(e);
      });
  });

const postNews = async (req, res) => {
  const body = req.body;
  const corr_id = req.headers["X-Correlation-Id"];
  let step = 1;
  try {
    await validate(body, corr_id);
  } catch (e) {
    return res.status(CODES.BAD_REQUEST).json({ message: e });
  }

  const hash = crypto
    .createHash("sha256")
    .update(`${body.state}#${body.topic}#${body.title}`)
    .digest("hex");
  try {
    await updateDB(hash, body, corr_id);
    res.status(CODES.OK).json({ message: "OK" });
  } catch (e) {
    log.error(`Error in update DB, ${e}, corr_id=${corr_id}`);
    res.status(CODES.INTERNAL_SERVER_ERROR).json({ message: e });
  }
};

const fetchNews = async (req, res) => {
  const { q } = req.body;
  const corr_id = req.headers["X-Correlation-Id"];
  let step = 1;
  if (!q) {
    return res
      .status(CODES.BAD_REQUEST)
      .json({ message: "Please provide topic." });
  }
  try {
    const news = await fetchRemoteNews(q);
    for (let i = 0; i < news.length; ++i) {
      await validate(news[i]);
      const key = crypto
        .createHash("sha256")
        .update(`${news[i].state}#${news[i].topic}#${news[i].title}`)
        .digest("hex");
      await updateDB(key, news[i], corr_id);
    }
    res.status(CODES.OK).json(news);
  } catch (e) {
    log.error(`step ${step}, ${e}, corr_id=${corr_id}`);
    if (step === 1) {
      res.status(CODES.BAD_REQUEST).json({ message: e });
    } else {
      res.status(CODES.INTERNAL_SERVER_ERROR).json({ message: e });
    }
  }
};

export { getNews, postNews, fetchNews };
