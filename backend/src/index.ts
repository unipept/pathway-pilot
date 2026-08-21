import express from 'express';
import cors from 'cors';

import config from './config/config';
import errorHandler from './middleware/ErrorHandler';
import requestLogger from './middleware/RequestLogger';
import healthRouter from './routes/HealthRoute';
import pathwayRouter from './routes/PathwayRoute';
import mappingRouter from './routes/MappingRoute';

const app = express();

// Deliberately open to any origin. This is an unauthenticated, read-only proxy
// over public KEGG data -- there are no cookies, credentials or user state to
// protect, and the frontend is served from a different host than the API.
// Restricting it would buy nothing and break local development against
// production.
app.use(cors());

app.use(requestLogger);

app.use('/health', healthRouter);
app.use('/pathway', pathwayRouter);
app.use('/mapping', mappingRouter);

// Must come last: Express picks error handlers by their four-argument shape and
// only reaches them via handlers registered before this point.
app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});
