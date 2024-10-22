import { default as CODES } from "../helpers/statusCodes.js";
import myCache from "../helpers/CacheServer.js";

const getData = async (req, res) => {
  const { key } = req.query;
  const value = myCache.get(key);
  if (value) res.status(CODES.OK).json(value);
  if (!value) res.status(CODES.OK).json({ message: "No Data Found" });
};

const setData = async (req, res) => {
  const { key, value } = req.body;
  myCache.set(key, value);
  res.status(CODES.OK).json({ message: "OK" });
};

export { getData, setData };
