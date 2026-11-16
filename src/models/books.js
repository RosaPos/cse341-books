import { getDb } from "../db/connect.js";

const getBookById = async (bookId) => {
  const db = getDb();
  const collection = db.collection("books");
  return collection.findOne({ id: bookId });
};

const getAllBooks = async () => {
  const db = getDb();
  const collection = db.collection("books");
  const books = await collection.find({}).toArray();
  return books;
};

const createBook = async (newBook) => {
  const db = getDb();
  const collection = db.collection("books");

  await collection.insertOne({ ...newBook });

  return newBook;
};

const updateBook = async (bookId, changes) => {
  const db = getDb();
  const collection = db.collection("books");

  return collection.updateOne(
    { id: bookId },
    { $set: changes }
  );
};

const deleteBook = async (bookId) => {
  const db = getDb();
  const collection = db.collection("books");

  return collection.deleteOne({ id: bookId });
};

export {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};
