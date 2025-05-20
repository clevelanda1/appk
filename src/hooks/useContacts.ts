import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export interface Contact {
  id: string;
  name: string;
  created_at?: string;
}

export interface LastSelectedContact {
  id: string;
  name: string | null;
}

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSelected, setLastSelected] = useState<LastSelectedContact | null>(null);

  // Load last selected contact from localStorage
  useEffect(() => {
    const savedContact = localStorage.getItem('lastSelectedContact');
    if (savedContact) {
      setLastSelected(JSON.parse(savedContact));
    }
  }, []);

  // Save last selected contact to localStorage
  const updateLastSelected = (contact: LastSelectedContact | null) => {
    setLastSelected(contact);
    if (contact) {
      localStorage.setItem('lastSelectedContact', JSON.stringify(contact));
    } else {
      localStorage.removeItem('lastSelectedContact');
    }
  };

  // Fetch contacts on mount and auth state change
  useEffect(() => {
    fetchContacts();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        fetchContacts();
        updateLastSelected(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        setContacts([]);
        return;
      }

      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setContacts(data || []);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (name: string): Promise<Contact | null> => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('No authenticated user');
      }

      const { data, error } = await supabase
        .from('contacts')
        .insert([{ 
          name,
          user_id: session.session.user.id 
        }])
        .select()
        .single();

      if (error) throw error;

      setContacts(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error adding contact:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setContacts(prev => prev.filter(contact => contact.id !== id));
      
      if (lastSelected?.id === id) {
        updateLastSelected(null);
      }
    } catch (err) {
      console.error('Error deleting contact:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return {
    contacts,
    loading,
    error,
    addContact,
    deleteContact,
    refreshContacts: fetchContacts,
    lastSelected,
    updateLastSelected
  };
}