import express from 'express';

const router = express.Router({ mergeParams: true });
import PingHandler from '../handlers/PingHandler.js';

router.route('/app').get(PingHandler.getAppPing);
router.route('/db').get(PingHandler.getDBPing);

export default router;
