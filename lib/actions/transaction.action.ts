import pool from "../mysql";

export const createTransaction = async (transactionData: any) => {
    /* const { userId, eventId, amount, paymentMethod } = transactionData;
  const query = `INSERT INTO transactions (userId, eventId, amount, paymentMethod) VALUES (${userId}, ${eventId}, ${amount}, ${paymentMethod})`;
  try {
    await pool.query(query);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  } */
};

export const getTransactions = async (userId: string) => {};
