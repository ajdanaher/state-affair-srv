import { default as CODES } from "../helpers/statusCodes.js";
import { ping } from "../helpers/DBHelper.js";
import log from "../helpers/Logger.js";

const getAppPing = (_, res) => {
  res.status(CODES.OK).json({ message: "Success" });
};

const getDBPing = async (req, res) => {
  const corr_id = req.headers["X-Correlation-Id"];
  try {
    await ping(corr_id);
    res.status(CODES.OK).json({ message: "Success" });
  } catch (e) {
    log.error(`Error in Database Connection. ${e}`);
    res
      .status(CODES.INTERNAL_SERVER_ERROR)
      .json({ message: "Database Connection Error" });
  }
};

export default {
  getAppPing,
  getDBPing,
};
