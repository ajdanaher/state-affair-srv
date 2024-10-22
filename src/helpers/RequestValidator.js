import Joi from "joi";
import log from "./Logger.js";

const Schema = Joi.object({
  topic: Joi.string().not("").required(),
  title: Joi.string().not("").min(3).max(200).required(),
  publishedAt: Joi.date().iso().required(),
  state: Joi.string().not("").length(2).required(),
  description: Joi.string().not("").min(3).max(500).required(),
  url: Joi.string().not(""),
  content: Joi.string().not("").optional().max(10240),
});

const validate = (data, corr_id = "") =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await Schema.validateAsync(data);
      resolve(result);
    } catch (e) {
      const error = `Validation Error. ${e.message}`;
      log.error(`${error} corr_id=${corr_id}`);
      reject(error);
    }
  });

export default validate;
