import React, { useState, useRef, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContacts } from '../hooks/useContacts';
import { useAuth } from '../hooks/useAuth';

interface CardStackProps {
  isVisible: boolean;
  onClose: () => void;
  paymentAmount: number;
  setPaymentAmount: (amount: number) => void;
  onContactSelect?: (contactName: string | null) => void;
  onSignOut?: () => void;
  onBankNameChange?: (name: string) => void;
}

const CardStack: React.FC<CardStackProps> = ({
  isVisible,
  onClose,
  paymentAmount,
  setPaymentAmount,
  onContactSelect,
  onSignOut,
  onBankNameChange
}) => {
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showCustomAmountField, setShowCustomAmountField] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [bankName, setBankName] = useState(() => {
    return localStorage.getItem('bankName') || 'Bank';
  });
  const [isEditingBankName, setIsEditingBankName] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  
  const NONE_OPTION = "none";
  const cardRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bankNameInputRef = useRef<HTMLInputElement>(null);
  const MAX_PAYMENT_AMOUNT = 99999.99;
  
  const { contacts, loading, addContact, deleteContact, lastSelected, updateLastSelected } = useContacts();

  useEffect(() => {
    if (!isVisible) {
      setShowSignOutConfirm(false);
      setIsEditingBankName(false);
      setShowCustomAmountField(false);
      setShowAddContact(false);
      setNewContactName('');
    }
  }, [isVisible]);

  useEffect(() => {
    if (lastSelected) {
      setSelectedContactId(lastSelected.id);
      if (onContactSelect) {
        onContactSelect(lastSelected.name);
      }
    } else {
      setSelectedContactId(NONE_OPTION);
      if (onContactSelect) {
        onContactSelect(null);
      }
    }
  }, [lastSelected, onContactSelect]);

  const handleAmountSelect = (amount: number) => {
    setPaymentAmount(amount);
    onClose();
  };

  const handleCustomAmountSubmit = () => {
    // Parse the input value as a float to handle decimal values properly
    const rawValue = customAmount.replace(/,/g, '');
    const amount = parseFloat(rawValue);
    
    if (!isNaN(amount) && amount > 0 && amount <= MAX_PAYMENT_AMOUNT) {
      // Convert to cents and back to ensure proper decimal handling
      const finalAmount = Math.round(amount * 100) / 100;
      setPaymentAmount(finalAmount);
      setCustomAmount('');
      setShowCustomAmountField(false);
      onClose();
    }
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow only digits and at most one decimal point
    const regex = /^(\d{1,5}(\.\d{0,2})?)?$/;
    
    // Check if the input matches our pattern and is below the max value
    if (regex.test(inputValue)) {
      const numericValue = parseFloat(inputValue || '0');
      if (numericValue <= MAX_PAYMENT_AMOUNT) {
        setCustomAmount(inputValue);
      }
    }
  };
  
  const formatCurrency = (amount: number) => {
    // Ensure the amount doesn't exceed the maximum payment amount
    const limitedAmount = Math.min(amount, MAX_PAYMENT_AMOUNT);
    
    return limitedAmount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  const handleSignOutClick = () => {
    setShowSignOutConfirm(true);
  };
  
  const handleConfirmSignOut = async () => {
    try {
      console.log('CardStack - Signing out...');
      const { error } = await signOut();
      if (error) throw error;
      
      // Clear local storage items
      localStorage.removeItem('lastSelectedContact');
      localStorage.removeItem('bankName');
      localStorage.removeItem('cardLastFour');
      
      setShowSignOutConfirm(false);
      
      if (onSignOut) {
        onSignOut();
      }
      
      // Close the CardStack
      onClose();
      
      // Navigate to home to ensure a fresh state
      navigate('/');
      
      // Reset local state
      setSelectedContactId(NONE_OPTION);
      setShowAddContact(false);
      setShowCustomAmountField(false);
      setCustomAmount('');
      updateLastSelected(null);
      
      console.log('CardStack - Sign out complete');
      
      // Force an explicit re-render
      forceUpdate();
      
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const handleCancelSignOut = () => {
    setShowSignOutConfirm(false);
  };
  
  const handleAddContact = async () => {
    if (contacts.length >= 5) {
      return;
    }
    
    if (newContactName.trim()) {
      const newContact = await addContact(newContactName.trim());
      if (newContact) {
        setNewContactName('');
        setShowAddContact(false);
        handleSelectContact(newContact.id, newContact.name);
      }
    }
  };
  
  const handleDeleteContact = async (contactId: string) => {
    await deleteContact(contactId);
    if (selectedContactId === contactId) {
      handleSelectContact(NONE_OPTION, null);
    }
  };
  
  const handleSelectContact = (contactId: string, contactName: string | null) => {
    setSelectedContactId(contactId);
    if (onContactSelect) {
      onContactSelect(contactName);
    }
    
    if (contactId === NONE_OPTION) {
      updateLastSelected(null);
    } else {
      updateLastSelected({ id: contactId, name: contactName });
    }
  };

  const startEditingBankName = () => {
    setIsEditingBankName(true);
    setTimeout(() => {
      if (bankNameInputRef.current) {
        bankNameInputRef.current.focus();
        bankNameInputRef.current.select();
      }
    }, 10);
  };

  const handleBankNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setBankName(newName);
    if (onBankNameChange) {
      onBankNameChange(newName);
    }
  };

  const finishEditingBankName = () => {
    setIsEditingBankName(false);
    const finalName = bankName.trim() || 'Bank';
    setBankName(finalName);
    localStorage.setItem('bankName', finalName);
    if (onBankNameChange) {
      onBankNameChange(finalName);
    }
  };

  const handleBankNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      finishEditingBankName();
    }
  };

  const buttonBgColor = "bg-gray-800/80";
  const selectedBgColor = "bg-blue-500";
  
  const amountOptions = [20, 50, 100];

  return (
    <div
      ref={cardRef}
      className={`absolute inset-x-0 bottom-0 bg-[#121418] rounded-t-3xl transform transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{
        height: 'auto',
        boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="w-full flex justify-center py-3">
        <div className="w-32 h-1 bg-gray-600 rounded-full opacity-30"></div>
      </div>

      <div className="px-6 pb-8">
        {showSignOutConfirm ? (
          <div className="pt-4 pb-2">
            <div className="flex flex-col items-center justify-center py-6">
              <h2 className="text-white text-xl font-semibold mb-1">Sign Out?</h2>
              <p className="text-gray-400 text-sm text-center mb-8">
                Are you sure you want to sign out of your account?
              </p>
              
              <div className="w-full space-y-3">
                <button
                  onClick={handleConfirmSignOut}
                  className="w-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white py-3.5 px-4 rounded-2xl font-medium focus:outline-none transition-colors duration-200"
                >
                  Sign Out
                </button>
                
                <button
                  onClick={handleCancelSignOut}
                  className={`w-full ${buttonBgColor} text-white py-3.5 px-4 rounded-2xl font-medium focus:outline-none`}
                  style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-4 mb-5 flex justify-center">
              {isEditingBankName ? (
                <div className="relative w-full max-w-xs">
                  <input
                    ref={bankNameInputRef}
                    type="text"
                    value={bankName}
                    onChange={handleBankNameChange}
                    onBlur={finishEditingBankName}
                    onKeyDown={handleBankNameKeyDown}
                    className="w-full bg-gray-800/60 text-white text-center text-xl font-semibold px-4 py-2 rounded-xl focus:outline-none border border-blue-500/50"
                    placeholder="Enter Bank Name"
                    maxLength={20}
                  />
                </div>
              ) : (
                <div 
                  onClick={startEditingBankName}
                  className="cursor-pointer inline-flex items-center gap-3 border-b border-dashed border-gray-600 hover:border-blue-400 transition-colors duration-200 pb-0.5 px-2"
                >
                  <h1 className="text-white text-xl font-semibold">
                    {bankName}
                  </h1>
                  <div className="text-gray-400 text-xs">tap to edit</div>
                </div>
              )}
            </div>

            <div className="mt-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white text-xl font-semibold">Contacts</h2>
                {contacts.length < 5 ? (
                  <button
                    onClick={() => setShowAddContact(!showAddContact)}
                    className="text-blue-400 focus:outline-none px-2 py-1 rounded-md active:bg-gray-800/30"
                  >
                    {showAddContact ? 'Cancel' : '+ Add'}
                  </button>
                ) : (
                  <span className="text-gray-400 text-xs">Max 5 Contacts</span>
                )}
              </div>

              {showAddContact ? (
                <div className="mb-4 flex">
                  <input
                    type="text"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    placeholder="Contact name"
                    className="flex-1 bg-gray-800/60 text-white px-4 py-3 rounded-l-xl focus:outline-none border border-gray-700"
                  />
                  <button
                    onClick={handleAddContact}
                    className="bg-blue-500 text-white px-5 py-3 rounded-r-xl active:bg-blue-600 transition-colors duration-200"
                  >
                    Add
                  </button>
                </div>
              ) : null}

              <div className="space-y-2 pr-1">
                <div
                  onClick={() => handleSelectContact(NONE_OPTION, null)}
                  className={`flex justify-between items-center p-3.5 rounded-xl cursor-pointer transition-colors duration-200 ${
                    selectedContactId === NONE_OPTION
                      ? selectedBgColor
                      : buttonBgColor
                  }`}
                  style={{ 
                    boxShadow: selectedContactId === NONE_OPTION 
                      ? '0 2px 8px rgba(59, 130, 246, 0.3)' 
                      : 'none' 
                  }}
                >
                  <span className="text-white">Unknown</span>
                </div>
                
                {loading ? (
                  <div className="text-gray-400 text-sm p-3">
                    Loading contacts...
                  </div>
                ) : contacts.length === 0 ? (
                  <div className="text-gray-400 text-sm p-3">
                    No contacts yet. Add some to use in your pranks.
                  </div>
                ) : (
                  contacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => handleSelectContact(contact.id, contact.name)}
                      className={`flex justify-between items-center p-3.5 rounded-xl cursor-pointer transition-colors duration-200 ${
                        selectedContactId === contact.id
                          ? selectedBgColor
                          : buttonBgColor
                      }`}
                      style={{ 
                        boxShadow: selectedContactId === contact.id 
                          ? '0 2px 8px rgba(59, 130, 246, 0.3)' 
                          : 'none' 
                      }}
                    >
                      <span className="text-white">{contact.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteContact(contact.id);
                        }}
                        className="text-gray-400 hover:text-red-400 focus:outline-none p-1 rounded-full"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-white text-xl font-semibold">Payment Amount</h2>
                
                <button
                  onClick={() => setShowCustomAmountField(!showCustomAmountField)}
                  className="text-blue-400 focus:outline-none px-2 py-1 rounded-md active:bg-gray-800/30"
                >
                  {showCustomAmountField ? 'Cancel' : 'Custom'}
                </button>
              </div>
              
              {!showCustomAmountField ? (
                <div 
                  ref={scrollContainerRef}
                  className="overflow-x-auto scrollbar-hide pb-2" 
                  style={{ 
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    paddingLeft: '2px',
                    paddingRight: '2px',
                    margin: '0 -2px'
                  }}
                >
                  <div className="inline-flex space-x-3" style={{ minWidth: '100%' }}>
                    {amountOptions.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => handleAmountSelect(amount)}
                        className={`flex-1 min-w-[80px] rounded-xl py-3.5 px-2 text-center font-medium transition-all duration-200 ${
                          paymentAmount === amount 
                            ? 'text-white ' + selectedBgColor
                            : 'text-white ' + buttonBgColor
                        }`}
                        style={{ 
                          boxShadow: paymentAmount === amount 
                            ? '0 2px 8px rgba(59, 130, 246, 0.25)' 
                            : '0 1px 2px rgba(0, 0, 0, 0.1)' 
                        }}
                      >
                        {formatCurrency(amount)}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-lg">$</span>
                    </div>
                    <input
                      type="text"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      placeholder="Enter amount (max $99,999.99)"
                      className="w-full bg-gray-800/60 text-white pl-10 pr-4 py-3 rounded-l-xl focus:outline-none border border-gray-700"
                      inputMode="decimal"
                      autoFocus
                    />
                  </div>
                  <button
                    onClick={handleCustomAmountSubmit}
                    className="bg-blue-500 text-white px-5 py-3 rounded-r-xl active:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:bg-blue-500/70"
                    disabled={!customAmount}
                  >
                    Set
                  </button>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <button
                onClick={onClose}
                className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white py-3.5 px-4 rounded-2xl font-medium focus:outline-none transition-colors duration-200"
                style={{ boxShadow: '0 2px 8px rgba(59, 130, 246, 0.25)' }}
              >
                Done
              </button>
              
              <button
                onClick={handleSignOutClick}
                className="w-full text-gray-400 hover:text-gray-300 text-sm py-2 focus:outline-none transition-colors duration-200"
              >
                More
              </button>
            </div>
          </>
        )}
      </div>
      
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default CardStack;