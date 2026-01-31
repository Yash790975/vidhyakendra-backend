


require('dotenv').config();
const connectDB  = require('./config/database');
const app = require('./app');

const PORT = process.env.PORT || 4000;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[server] running on http://localhost:${PORT}`);
  });
})().catch((err) => {
  console.error('[server] failed to start:', err);
  process.exit(1);
});
