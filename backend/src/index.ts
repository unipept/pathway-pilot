import express from 'express';
import cors from 'cors';

import config from './config/config';
import pathwayRouter from './routes/PathwayRoute';
import mappingRouter from './routes/MappingRoute';

const app = express();

app.use(cors());

app.use('/pathway', pathwayRouter);
app.use('/mapping', mappingRouter);

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});
