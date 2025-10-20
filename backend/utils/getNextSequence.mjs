import Counter from "../models/Counter.mjs";

async function getNextSequenceValue(sequenceName) {
  // `findOneAndUpdate` is the atomic operation.
  const sequenceDocument = await Counter.findOneAndUpdate(
    { _id: sequenceName }, // Find a document with this ID
    { $inc: { sequence_value: 1 } }, // Atomically increment the `sequence_value` field by 1
    {
      new: true, // Return the document AFTER it has been updated
      upsert: true, // If a document with this `_id` doesn't exist, create it
    }
  );
  return sequenceDocument.sequence_value;
}
export default getNextSequenceValue;
