import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} from "../models/books.js";

import { getAuthorById } from "../models/authors.js";

const getBooksHandler = async (req, res) => {
  try {
    const books = await getAllBooks();
    return res.status(200).json(books);
  } catch (error) {
    console.error("GET /books failed:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getBookByIdHandler = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await getBookById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(book);
  } catch (error) {
    console.error("GET /books/:id failed:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const createBookHandler = async (req, res) => {
  try {
    const { id, authorId, title, publicationDate } = req.body ?? {};

    if (
      typeof id !== "string" || !id.trim() ||
      typeof authorId !== "string" || !authorId.trim() ||
      typeof title !== "string" || !title.trim() ||
      typeof publicationDate !== "string" || !publicationDate.trim()
    ) {
      return res.status(400).json({
        message: "Valid id, authorId, title, and publicationDate are required"
      });
    }

    const existingBook = await getBookById(id.trim());

    if (existingBook) {
      return res.status(400).json({
        message: "Book ID already exists"
      });
    }

    const author = await getAuthorById(authorId.trim());

    if (!author) {
      return res.status(400).json({
        message: "Author ID does not exist"
      });
    }

    const newBook = {
      id: id.trim(),
      authorId: authorId.trim(),
      title: title.trim(),
      publicationDate: publicationDate.trim()
    };

    const createdBook = await createBook(newBook);

    return res.status(201).json(createdBook);
  } catch (error) {
    console.error("POST /books failed:", error.message);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Book ID already exists"
      });
    }

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

const updateBookHandler = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { authorId, title, publicationDate } = req.body ?? {};

    if (
      typeof authorId !== "string" || !authorId.trim() ||
      typeof title !== "string" || !title.trim() ||
      typeof publicationDate !== "string" || !publicationDate.trim()
    ) {
      return res.status(400).json({
        message: "Valid authorId, title, and publicationDate are required"
      });
    }

    const author = await getAuthorById(authorId.trim());

    if (!author) {
      return res.status(400).json({
        message: "Author ID does not exist"
      });
    }

    const result = await updateBook(bookId, {
      authorId: authorId.trim(),
      title: title.trim(),
      publicationDate: publicationDate.trim()
    });

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    const updatedBook = await getBookById(bookId);

    return res.status(200).json(updatedBook);
  } catch (error) {
    console.error("PUT /books/:id failed:", error.message);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

const deleteBookHandler = async (req, res) => {
  try {
    const bookId = req.params.id;

    const result = await deleteBook(bookId);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("DELETE /books/:id failed:", error.message);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

export {
  getBooksHandler,
  getBookByIdHandler,
  createBookHandler,
  updateBookHandler,
  deleteBookHandler
};
