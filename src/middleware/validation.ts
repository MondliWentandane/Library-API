import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export const validateAuthor = (req: Request, res: Response, next: NextFunction) => {
  const { name, birthYear } = req.body;

  if (req.method === 'POST' || req.method === 'PUT') {
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Author name is required'
      });
    }

    if (birthYear && (birthYear < 1000 || birthYear > new Date().getFullYear())) {
      return res.status(400).json({
        success: false,
        error: 'Birth year must be a valid year'
      });
    }

    if (name) req.body.name = name.trim();
    if (req.body.bio) req.body.bio = req.body.bio.trim();
    if (req.body.nationality) req.body.nationality = req.body.nationality.trim();
  }

  next();
};

export const validateBook = (req: Request, res: Response, next: NextFunction) => {
  const { title, authorId, publicationYear, isbn } = req.body;

  if (req.method === 'POST' || req.method === 'PUT') {
    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Book title is required'
      });
    }

    if (!authorId) {
      return res.status(400).json({
        success: false,
        error: 'Author ID is required'
      });
    }

    if (!publicationYear || publicationYear < 1000 || publicationYear > new Date().getFullYear()) {
      return res.status(400).json({
        success: false,
        error: 'Publication year must be a valid year'
      });
    }

    if (isbn && isbn.length > 20) {
      return res.status(400).json({
        success: false,
        error: 'ISBN must be 20 characters or less'
      });
    }

    if (title) req.body.title = title.trim();
    if (req.body.genre) req.body.genre = req.body.genre.trim();
    if (req.body.description) req.body.description = req.body.description.trim();
    if (isbn) req.body.isbn = isbn.trim();
  }

  next();
};