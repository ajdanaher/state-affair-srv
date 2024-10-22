import bunyan from 'bunyan';
import serverDefination from '../../serverConfigurations.js';

const log = bunyan.createLogger({
  name: serverDefination.appName,
  level: "debug",
  streams: [{
    path: serverDefination.logFile
  }]
});

export default log;