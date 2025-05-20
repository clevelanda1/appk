import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export interface Transaction {
  id: string;
  contact_name: string;
  amount: number;
  status: string;
  created_at: string;
  is_phone_number: boolean;
  is_merchant: boolean;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [lastTransactionContact, setLastTransactionContact] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('No authenticated user');
      }

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      setTransactions(data || []);
      
      // Calculate initial balance from transactions
      const initialBalance = (data || [])
        .filter(t => t.status !== 'Refunded')
        .reduce((total, t) => total + t.amount, 0);
      setBalance(Math.max(0, initialBalance));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (
    contactName: string,
    amount: number,
    isPhoneNumber: boolean = false,
    isMerchant: boolean = false
  ) => {
    try {
      if (lastTransactionContact !== contactName) {
        setLastTransactionContact(contactName);
      }

      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('No authenticated user');
      }

      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          contact_name: contactName,
          amount,
          user_id: session.session.user.id,
          is_phone_number: isPhoneNumber,
          is_merchant: isMerchant
        }])
        .select()
        .single();

      if (error) throw error;

      setTransactions(prev => [data, ...prev].slice(0, 20));
      setBalance(prev => Math.max(0, prev + amount));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  };

  const refundTransaction = async (transactionId: string) => {
    try {
      const transaction = transactions.find(t => t.id === transactionId);
      if (!transaction || transaction.status === 'Refunded') return null;

      const { error } = await supabase
        .from('transactions')
        .update({ 
          status: 'Refunded',
          created_at: new Date().toISOString()
        })
        .eq('id', transactionId);

      if (error) throw error;

      setTransactions(prev => 
        prev.map(t => t.id === transactionId ? {...t, status: 'Refunded', created_at: new Date().toISOString()} : t)
      );
      setBalance(prev => Math.max(0, prev - transaction.amount));

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  };

  const clearTransactions = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('No authenticated user');
      }

      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('user_id', session.session.user.id);

      if (error) throw error;

      setTransactions([]);
      setLastTransactionContact(null);
      setSelectedTransaction(null);
      setBalance(0);
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  };

  const resetBalance = () => {
    setBalance(0);
  };

  const getBalance = () => {
    return Math.max(0, balance);
  };

  return {
    transactions,
    loading,
    error,
    addTransaction,
    refundTransaction,
    clearTransactions,
    refreshTransactions: fetchTransactions,
    selectedTransaction,
    setSelectedTransaction,
    getBalance,
    resetBalance,
    lastTransactionContact
  };
}