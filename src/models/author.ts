import { Author, CreateAuthorRequest, UpdateAuthorRequest } from '../types';
import { NotFoundError, ConflictError } from '../middleware/errorHandler';
import { getBooksByAuthor } from './book';

let authors: Author[] = [];
let authorNextId = 1;

export const getAuthors = (): Author[] => {
  return authors;
};

export const getAuthorById = (id: string): Author => {
  const author = authors.find(a => a.id === id);
  if (!author) {
    throw new NotFoundError(`Author with ID ${id} not found`);
  }
  return author;
};

export const createAuthor = (authorData: CreateAuthorRequest): Author => {
  const existingAuthor = authors.find(
    a => a.name.toLowerCase() === authorData.name.toLowerCase()
  );
  
  if (existingAuthor) {
    throw new ConflictError(`Author with name '${authorData.name}' already exists`);
  }

  const newAuthor: Author = {
    id: authorNextId.toString(),
    name: authorData.name,
    bio: authorData.bio,
    nationality: authorData.nationality,
    birthYear: authorData.birthYear,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  authors.push(newAuthor);
  authorNextId++;
  return newAuthor;
};

export const updateAuthor = (id: string, updates: UpdateAuthorRequest): Author => {
  const authorIndex = authors.findIndex(a => a.id === id);
  
  if (authorIndex === -1) {
    throw new NotFoundError(`Author with ID ${id} not found`);
  }

  // Check for duplicate name if name is being updated
  if (updates.name) {
    const existingAuthor = authors.find(
      a => a.id !== id && a.name.toLowerCase() === updates.name!.toLowerCase()
    );
    
    if (existingAuthor) {
      throw new ConflictError(`Author with name '${updates.name}' already exists`);
    }
  }

  authors[authorIndex] = {
    ...authors[authorIndex],
    ...updates,
    updatedAt: new Date()
  };
  
  return authors[authorIndex];
};

export const deleteAuthor = (id: string): void => {
  const authorIndex = authors.findIndex(a => a.id === id);
  
  if (authorIndex === -1) {
    throw new NotFoundError(`Author with ID ${id} not found`);
  }

  authors.splice(authorIndex, 1);
};

// Get authors with search and pagination
export const searchAuthors = (query?: string, page: number = 1, limit: number = 10) => {
  let filteredAuthors = authors;

  if (query) {
    const searchTerm = query.toLowerCase();
    filteredAuthors = authors.filter(author =>
      author.name.toLowerCase().includes(searchTerm) ||
      author.bio?.toLowerCase().includes(searchTerm) ||
      author.nationality?.toLowerCase().includes(searchTerm)
    );
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedAuthors = filteredAuthors.slice(startIndex, endIndex);

  return {
    data: paginatedAuthors,
    pagination: {
      page,
      limit,
      total: filteredAuthors.length,
      totalPages: Math.ceil(filteredAuthors.length / limit)
    }
  };
};


export { getBooksByAuthor } from './book';