
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, TrendingUp, DollarSign, Calendar, PieChart, Target } from "lucide-react";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import MonthlyChart from "@/components/MonthlyChart";
import CategoryPieChart from "@/components/CategoryPieChart";
import BudgetManager from "@/components/BudgetManager";
import BudgetComparisonChart from "@/components/BudgetComparisonChart";
import SpendingInsights from "@/components/SpendingInsights";
import { Transaction, Budget } from "@/types/transaction";

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedTransactions = localStorage.getItem('finance-transactions');
    const storedBudgets = localStorage.getItem('finance-budgets');
    
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
    if (storedBudgets) {
      setBudgets(JSON.parse(storedBudgets));
    }
  }, []);

  // Save transactions to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('finance-transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Save budgets to localStorage whenever budgets change
  useEffect(() => {
    localStorage.setItem('finance-budgets', JSON.stringify(budgets));
  }, [budgets]);

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

  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString()
    };
    setBudgets(prev => [...prev, newBudget]);
  };

  const deleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  // Calculate summary statistics
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  // Category breakdown for current month
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthExpenses = transactions
    .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth));

  const categoryBreakdown = currentMonthExpenses
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryBreakdown)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Personal Finance Tracker
          </h1>
          <p className="text-slate-600">
            Complete financial management with budgeting and insights
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Budgets</CardTitle>
              <Target className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{budgets.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Category Summary */}
        {topCategories.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Top Categories This Month</CardTitle>
              <CardDescription>Your highest spending categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topCategories.map(([category, amount], index) => (
                  <div key={category} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">{category}</p>
                      <p className="text-sm text-slate-600">#{index + 1} category</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${amount.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Expenses Trend</CardTitle>
                  <CardDescription>Your spending patterns over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <MonthlyChart transactions={transactions} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Latest financial activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                        <div>
                          <p className="font-medium text-sm">{transaction.description}</p>
                          <p className="text-xs text-slate-600">{transaction.category}</p>
                        </div>
                        <span className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                    {transactions.length === 0 && (
                      <p className="text-slate-500 text-center py-4">No transactions yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>All Transactions</CardTitle>
                      <CardDescription>Manage your income and expenses</CardDescription>
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
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Expense Categories
                  </CardTitle>
                  <CardDescription>Breakdown of your spending by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <CategoryPieChart transactions={transactions} type="expense" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Income Categories
                  </CardTitle>
                  <CardDescription>Breakdown of your income by source</CardDescription>
                </CardHeader>
                <CardContent>
                  <CategoryPieChart transactions={transactions} type="income" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Budgets Tab */}
          <TabsContent value="budgets" className="space-y-6">
            <BudgetManager 
              transactions={transactions}
              budgets={budgets}
              onAddBudget={addBudget}
              onDeleteBudget={deleteBudget}
            />

            <Card>
              <CardHeader>
                <CardTitle>Budget vs Actual Comparison</CardTitle>
                <CardDescription>See how your spending compares to your budgets</CardDescription>
              </CardHeader>
              <CardContent>
                <BudgetComparisonChart budgets={budgets} transactions={transactions} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights">
            <SpendingInsights transactions={transactions} budgets={budgets} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
