import express from 'express';
import authorsRouter from './routes/authors';
import booksRouter from './routes/books';
import { logger } from './middleware/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/authors', authorsRouter);
app.use('/books', booksRouter);

app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Library API is running', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.use('*', notFoundHandler);

app.use(errorHandler);

export default app;