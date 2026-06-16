const express = require('express');
function makeHealthRouter() {
const router = express.Router();
router.get('/health', (_req, res) => {
res.json({
status: 'ok',
uptime: process.uptime(),
timestamp: new Date().toISOString(),
memory: process.memoryUsage().heapUsed,
});
});
return router;
}
module.exports = makeHealthRouter;