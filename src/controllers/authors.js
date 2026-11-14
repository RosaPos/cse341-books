import {
  getAllAuthors as getAllAuthorsFromDb,
  getAuthorById,
  createAuthor as createAuthorInDb,
  updateAuthor as updateAuthorInDb,
  authorHasBooks,
  deleteAuthor as deleteAuthorInDb
} from "../models/authors.js";

// GET /authors
const getAllAuthors = async (req, res) => {
  try {
    const authors = await getAllAuthorsFromDb();

    return res.status(200).json(authors);
  } catch (error) {
    console.error("GET /authors failed:", error.message);

    return res.status(500).json({
      message: "Unable to retrieve authors."
    });
  }
};

// GET /authors/:id
const getAuthorByIdHandler = async (req, res) => {
  try {
    const authorId = req.params.id;
    const author = await getAuthorById(authorId);

    if (!author) {
      return res.status(404).json({
        message: "Author not found"
      });
    }

    return res.status(200).json(author);
  } catch (error) {
    console.error("GET /authors/:id failed:", error.message);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

// POST /authors
const createAuthorHandler = async (req, res) => {
  try {
    const { id, name, birthYear } = req.body ?? {};

    if (
      typeof id !== "string" || !id.trim() ||
      typeof name !== "string" || !name.trim() ||
      !Number.isInteger(birthYear)
    ) {
      return res.status(400).json({
        message: "Valid id, name, and birthYear are required"
      });
    }

    const existingAuthor = await getAuthorById(id.trim());

    if (existingAuthor) {
      return res.status(400).json({
        message: "Author ID already exists"
      });
    }

    const newAuthor = {
      id: id.trim(),
      name: name.trim(),
      birthYear
    };

    const createdAuthor = await createAuthorInDb(newAuthor);

    return res.status(201).json(createdAuthor);
  } catch (error) {
    console.error("POST /authors failed:", error.message);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Author ID already exists"
      });
    }

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

const updateAuthorHandler = async (req, res) => {
  try {
    const authorId = req.params.id;
    const { name, birthYear } = req.body ?? {};

    if (
      typeof name !== "string" ||
      !name.trim() ||
      !Number.isInteger(birthYear)
    ) {
      return res.status(400).json({
        message: "Valid name and birthYear are required"
      });
    }

    const result = await updateAuthorInDb(authorId, {
      name: name.trim(),
      birthYear
    });

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Author not found"
      });
    }

    const updatedAuthor = await getAuthorById(authorId);

    return res.status(200).json(updatedAuthor);
  } catch (error) {
    console.error("PUT /authors/:id failed:", error.message);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

const deleteAuthorHandler = async (req, res) => {
  try {
    const authorId = req.params.id;

    const author = await getAuthorById(authorId);

    if (!author) {
      return res.status(404).json({
        message: "Author not found"
      });
    }

    if (await authorHasBooks(authorId)) {
      return res.status(409).json({
        message: "Author has related books"
      });
    }

    const result = await deleteAuthorInDb(authorId);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Author not found"
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("DELETE /authors/:id failed:", error.message);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

export {
  getAllAuthors,
  getAuthorByIdHandler,
  createAuthorHandler,
  updateAuthorHandler,
  deleteAuthorHandler
};
