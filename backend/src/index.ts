import express from 'express';

import config from './config/config';
import pathwayRouter from './routes/PathwayRoute';

const app = express();

app.use('/pathway', pathwayRouter);

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});
