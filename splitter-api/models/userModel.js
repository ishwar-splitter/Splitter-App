const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createUser = async (userData) => {
  if (!prisma) {
    throw new Error('Prisma client is not initialized');
  }
  const { cognitoId, email, name } = userData;
  
  try {
    const result = await prisma.users.create({
      data : {
        id: cognitoId,
        email: email,
        name: name
      },
      
    });
    return result;
  } catch (error) {
    console.error('Error creating user in database:', error);
    throw error;
  }
};

const getCurrentUser = async (cognitoId) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: cognitoId
      }
    });
    return user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

const getUserTransactions = async (userId) => {
  try {
    const transactions = await prisma.transactions.findMany({
      where: { added_by: userId },
      include: {
        users: {
          select: { name: true }
        }
      },
      orderBy: { date: 'desc' }
    });

    return transactions;
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    throw error;
  }
};

const addTransaction = async (transaction) => {
  const { description, amount, date, type, paid_by, participants, added_by } = transaction;
  try {
    const result = await prisma.transactions.create({
      data: {
        description: description,
        amount: amount,
        date: new Date(date),
        type: type,
        paid_by: paid_by,
        participants: parseInt(participants),
        added_by: added_by
      }
    });
    return result;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

module.exports = {
  createUser,
  getCurrentUser,
  getUserTransactions,
  addTransaction,
  
};