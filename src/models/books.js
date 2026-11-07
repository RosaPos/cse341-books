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

export { getAllBooks, getBookById };
