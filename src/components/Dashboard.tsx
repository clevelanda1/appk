import React, { useState } from 'react';
import CardScreen from './CardScreen';
import ProcessingScreen from './ProcessingScreen';
import ConfirmationScreen from './ConfirmationScreen';
import { useTransactions } from '../hooks/useTransactions';

interface DashboardProps {
  isPremium: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isPremium }) => {
  const [currentScreen, setCurrentScreen] = useState('card');
  const [paymentAmount, setPaymentAmount] = useState(100);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [isRequestFlow, setIsRequestFlow] = useState(false);
  const { 
    transactions, 
    addTransaction, 
    refundTransaction, 
    clearTransactions,
    getBalance,
    resetBalance,
    lastTransactionContact 
  } = useTransactions();
  
  const handlePayButtonPress = async () => {
    setIsRequestFlow(true);
    await addTransaction(selectedContact || "Unknown", paymentAmount);
    setCurrentScreen('processing');
  };
  
  const handleDone = () => {
    setCurrentScreen('card');
    setIsRequestFlow(false);
  };
  
  const handleReset = () => {
    setSelectedContact(null);
    setPaymentAmount(100);
    resetBalance();
  };

  const handleRefund = async (transactionId: string) => {
    await refundTransaction(transactionId);
  };

  const handleClearTransactions = async () => {
    await clearTransactions();
  };

  const handleSendRequest = () => {
    setCurrentScreen('card');
  };

  const handleMenuClick = () => {
    setIsRequestFlow(false);
    setCurrentScreen('confirmation');
  };

  return (
    <div className="h-screen w-full overflow-hidden font-sans">
      {currentScreen === 'card' && (
        <CardScreen 
          onPayButtonPress={handlePayButtonPress}
          paymentAmount={paymentAmount}
          setPaymentAmount={setPaymentAmount}
          isPremium={isPremium}
          onReset={handleReset}
          totalAmount={getBalance()}
          selectedContact={selectedContact}
          onContactSelect={setSelectedContact}
          onMenuClick={handleMenuClick}
        />
      )}
      
      {currentScreen === 'processing' && (
        <ProcessingScreen 
          onComplete={() => setCurrentScreen('confirmation')}
          paymentAmount={paymentAmount}
          contactName={selectedContact}
        />
      )}
      
      {currentScreen === 'confirmation' && (
        <ConfirmationScreen 
          amount={getBalance()}
          selectedContact={selectedContact}
          onDone={handleDone}
          transactions={transactions}
          paymentAmount={isRequestFlow ? paymentAmount : undefined}
          onRefund={handleRefund}
          onClearTransactions={handleClearTransactions}
          onSendRequest={handleSendRequest}
        />
      )}
    </div>
  );
};

export default Dashboard;