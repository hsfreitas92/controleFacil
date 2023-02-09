import { createContext, useEffect, useState, useContext } from 'react';
import { toast } from 'react-toastify';

import { db } from '../services/firebaseConnection'
import {
  addDoc,
  getDocs,
  collection,
  orderBy,
  query,
  doc,
  getDoc,
  deleteDoc
} from 'firebase/firestore'

export const TransactionsContext = createContext();

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([])

  async function loadTransactions() {
    const transactionsRef = collection(db, 'transactions')
    const queryRef = query(transactionsRef, orderBy('createdAt', 'asc'))
    getDocs(queryRef)
      .then((snapshot) => {
        let lista = []

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            title: doc.data().title,
            type: doc.data().type,
            amount: doc.data().amount,
            category: doc.data().category,
            createdAt: doc.data().createdAt
          })
        })
        setTransactions(lista);
      })
      .catch((error) => {
        console.log('Erro ao carregar transações: ' + error)
        toast.error('Ops, erro ao carregar o transações!')
      })
  }

  async function createTransaction(transactionInput) {
    addDoc(collection(db, 'transactions'), {
      title: transactionInput.title,
      type: transactionInput.type,
      amount: transactionInput.amount,
      category: transactionInput.category,
      createdAt: Date.now(),
    })
      .then(() => {
        loadTransactions()
        toast.success('Transação registrada com sucesso!')
      })
      .catch((error) => {
        console.log('Erro ao registrar transação: ' + error)
        toast.error('Ops, erro ao salvar o link!')
      })
  }

  async function removeTransaction(transactionId) {
    const docRef = doc(db, 'transactions', transactionId)
    await deleteDoc(docRef)
      .then(() => {
        loadTransactions();
        toast.success('Transação removida com succeso!')
      })
      .catch((error) => {
        console.log('Erro ao remover transação: ' + error)
        toast.error('Ops, erro na remoção da transação!')
      })
  }

  useEffect(() => {
    loadTransactions();
  }, [])

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