
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, DollarSign, Calendar } from "lucide-react";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import MonthlyChart from "@/components/MonthlyChart";
import { Transaction } from "@/types/transaction";

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Load transactions from localStorage on component mount
  useEffect(() => {
    const stored = localStorage.getItem('finance-transactions');
    if (stored) {
      setTransactions(JSON.parse(stored));
    }
  }, []);

  // Save transactions to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('finance-transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setShowForm(false);
  };

  const updateTransaction = (id: string, updatedTransaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev => 
      prev.map(t => t.id === id ? { ...updatedTransaction, id } : t)
    );
    setEditingTransaction(null);
    setShowForm(false);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  // Calculate summary statistics
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Personal Finance Tracker
          </h1>
          <p className="text-slate-600">
            Take control of your finances with smart tracking and insights
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalIncome.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <DollarSign className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-r ${netBalance >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} text-white border-0`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
              <Calendar className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${netBalance.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Section */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Expenses Overview</CardTitle>
              <CardDescription>
                Track your spending patterns over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MonthlyChart transactions={transactions} />
            </CardContent>
          </Card>
        </div>

        {/* Transactions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    Manage your income and expenses
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
              </CardHeader>
              <CardContent>
                <TransactionList 
                  transactions={transactions}
                  onEdit={handleEdit}
                  onDelete={deleteTransaction}
                />
              </CardContent>
            </Card>
          </div>

          {/* Transaction Form */}
          {showForm && (
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingTransaction ? 'Edit Transaction' : 'New Transaction'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TransactionForm
                    transaction={editingTransaction}
                    onSubmit={editingTransaction 
                      ? (data) => updateTransaction(editingTransaction.id, data)
                      : addTransaction
                    }
                    onCancel={handleCloseForm}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
