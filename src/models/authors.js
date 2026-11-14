import { getDb } from "../db/connect.js";

const getAllAuthors = async () => {
  const db = getDb();
  const collection = db.collection("authors");
  const authors = await collection.find({}).toArray();

  return authors;
};

const getAuthorById = async (authorId) => {
  const db = getDb();
  const collection = db.collection("authors");

  return collection.findOne({ id: authorId });
};

const createAuthor = async (author) => {
  const db = getDb();
  const collection = db.collection("authors");

  await collection.insertOne({ ...author });

  return author;
};

const updateAuthor = async (authorId, changes) => {
  const db = getDb();
  const collection = db.collection("authors");

  return collection.updateOne(
    { id: authorId },
    { $set: changes }
  );
};

const authorHasBooks = async (authorId) => {
  const db = getDb();
  const book = await db.collection("books").findOne({
    authorId: authorId
  });

  return book !== null;
};

const deleteAuthor = async (authorId) => {
  const db = getDb();

  return db.collection("authors").deleteOne({
    id: authorId
  });
};

export {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  authorHasBooks,
  deleteAuthor
};