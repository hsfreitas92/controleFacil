import { createContext, useEffect, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';

export const TransactionsContext = createContext();

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    getTransactions()
  }, []);

  async function getTransactions() {
    api.get('/transactions')
      .then(response => setTransactions(response.data))
      .catch((error) => {
        console.log('Erro ao carregar transações: ' + error)
        toast.error('Ops, erro ao carregar transações!')
      })
  }

  async function createTransaction(transactionInput) {
    try {
      await api.post('/transactions', {
        ...transactionInput,
        createdAt: new Date(),
      })

      getTransactions()
    } catch {
      toast.error('Erro na adição da transação');
    }
  }

  async function removeTransaction(transactionId) {
    try {
      const updatedTransaction = [...transactions];
      const transactionIndex = updatedTransaction.findIndex(transaction => transaction.id === transactionId);
  
      if (transactionIndex < 0) {
        throw new Error('Transação nao encontrada!');
      }
  
      updatedTransaction.splice(transactionIndex, 1);
  
      const response = await api.delete(`/transactions/${transactionId}`);
  
      if (!response.data) {
        throw new Error(response.data.message || response.status);
      }
  
      setTransactions(updatedTransaction);
      toast.success('Transação removida com sucesso!');
    } catch (error) {
      console.error(error);
      toast.error('Erro na remoção da transação');
    }
  }

  return (
    <TransactionsContext.Provider value={{ transactions, createTransaction, removeTransaction }}>
      {children}
    </TransactionsContext.Provider>
  )
}

export function useTransactions() {
  const context = useContext(TransactionsContext);

  return context;
}