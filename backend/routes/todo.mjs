import express from "express";
import passport from "passport";
import User from "../models/Usermodel.mjs";
import Todo from "../models/Todomodel.mjs"
import getNextSequenceValue from "../utils/getNextSequence.mjs";

const router = express.Router();
const ensureAuthenticated = passport.authenticate("jwt", { session: false });
async function getNextInvoiceNumber(userId) {
  const lastTodo= await Todo.findOne({ user: userId }).sort({
    createdAt: -1,
  });
  if (!lastTodo) {
    return "1"; // It's their first invoice
  }
  const nextNumber = parseInt(lastTodo.todoNumber) + 1;
  return nextNumber.toString().padStart(1, "0");
}

router.post("/api/todos", ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const sequenceName = `todo_${userId}`; // 3. Call the function to get the next number.
    const nextNumber = await getNextSequenceValue(sequenceName);

    // 4. Format the number as you wish (e.g., pad with zeros).
    const formattedTodoNumber = nextNumber.toString().padStart(4, "0");

    // 5. Proceed to create and save the invoice with this guaranteed unique number.
    const newTodo = new Todo({
      ...req.body,
      user: userId,
      todoNumber: formattedTodoNumber,
    });

    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating todo", error: error.message });
  }
});
router.get("/api/todos", ensureAuthenticated, async (req, res) => {
  try {
    // Find all invoices where the `userId` matches the logged-in user's ID
    const todo = await Todo.find({ user: req.user.id }).sort({
      createdAt: -1,
    }); // Sort by newest first
    res.json(todo);
  } catch (error) {
    console.error("Error fetching Todos:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/api/todos/:id", ensureAuthenticated, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.id, 
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/api/todos/:id", ensureAuthenticated, async (req, res) => {
  try {
    const updatedData = req.body;

    // Find the invoice and update it. The `{ new: true }` option returns the updated document.
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // Security check
      updatedData,
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({
        message: "Todo not found or you do not have permission to edit it.",
      });
    }
    res.json(updatedTodo);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating Todo", error: error.message });
  }
});
router.delete("/api/todos/:id", ensureAuthenticated, async (req, res) => {
  try {
    const deletedTodo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id, // Security check
    });

    if (!deletedTodo) {
      return res.status(404).json({
        message:
          "Todo not found or you do not have permission to delete it.",
      });
    }
    res.json({ message: "Todo deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
export default router;
