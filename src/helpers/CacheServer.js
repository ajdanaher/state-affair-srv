import NodeCache from "node-cache";
import serverConfigurations from "../../serverConfigurations.js";

const { cache } = serverConfigurations;
const myCache = new NodeCache({
  stdTTL: cache.stdTTL,
  checkperiod: cache.checkperiod,
  maxKeys: cache.maxKeys,
});

export default myCache;
