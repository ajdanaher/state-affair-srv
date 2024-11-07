import serverConfigurations from "../../serverConfigurations.js";
import log from "../helpers/Logger.js";
import { queryDB, createDB } from "../helpers/DBHelper.js";
import { getFromCache, setIntoCache } from "../helpers/http.js";
import { validateComments } from "../helpers/RequestValidator.js";
import { default as CODES } from "../helpers/statusCodes.js";

const getComments = async (req, res) => {
  const corr_id = req.headers["X-Correlation-Id"];
  const { db } = serverConfigurations;
  const { id } = req.params;
  const q = { id };
  try {
    const results = await queryDB(
      db.database,
      db.commentsCollection,
      q,
      corr_id
    );
    results.sort((a, b) => {
      const aDate = new Date(a.publishedAt);
      const bDate = new Date(b.publishedAt);
      return bDate - aDate;
    });
    res.status(CODES.OK).json(results);
  } catch (e) {
    log.error(e);
    res
      .status(CODES.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

const updateCommentsDB = (key, value, corr_id) =>
  new Promise((resolve, reject) => {
    const { db } = serverConfigurations;
    Promise.all([createDB(db.database, db.commentsCollection, value, corr_id)])
      .then((result) => {
        resolve(result);
      })
      .catch((e) => {
        reject(e);
      });
  });

const postComments = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const corr_id = req.headers["X-Correlation-Id"];
  try {
    await validateComments(body, corr_id);
    body.id = id;
    await updateCommentsDB(id, body, corr_id);
    res.status(CODES.OK).json({ message: "OK" });
  } catch (e) {
    log.error(e);
    res
      .status(CODES.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

export { getComments, postComments };
