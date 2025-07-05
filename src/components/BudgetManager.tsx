
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash, AlertTriangle } from "lucide-react";
import { Budget, Transaction, EXPENSE_CATEGORIES } from "@/types/transaction";

interface BudgetManagerProps {
  transactions: Transaction[];
  budgets: Budget[];
  onAddBudget: (budget: Omit<Budget, 'id'>) => void;
  onDeleteBudget: (id: string) => void;
}

const BudgetManager = ({ transactions, budgets, onAddBudget, onDeleteBudget }: BudgetManagerProps) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    monthlyLimit: '',
    month: ''
  });

  useEffect(() => {
    // Set default month to current month
    const currentMonth = new Date().toISOString().slice(0, 7);
    setFormData(prev => ({ ...prev, month: currentMonth }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.monthlyLimit || !formData.month) return;

    onAddBudget({
      category: formData.category,
      monthlyLimit: parseFloat(formData.monthlyLimit),
      month: formData.month
    });

    setFormData({ category: '', monthlyLimit: '', month: formData.month });
    setShowForm(false);
  };

  const getCurrentMonthSpending = (category: string, month: string) => {
    return transactions
      .filter(t => 
        t.type === 'expense' && 
        t.category === category && 
        t.date.startsWith(month)
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getBudgetStatus = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return { status: 'over', color: 'destructive' };
    if (percentage >= 80) return { status: 'warning', color: 'warning' };
    return { status: 'good', color: 'default' };
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Budget Management</CardTitle>
          <CardDescription>Set and track monthly spending limits</CardDescription>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Budget
        </Button>
      </CardHeader>
      <CardContent>
        {showForm && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPENSE_CATEGORIES.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="limit">Monthly Limit ($)</Label>
                    <Input
                      id="limit"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.monthlyLimit}
                      onChange={(e) => setFormData(prev => ({ ...prev, monthlyLimit: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="month">Month</Label>
                    <Input
                      id="month"
                      type="month"
                      value={formData.month}
                      onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Add Budget
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {budgets.map(budget => {
            const spent = getCurrentMonthSpending(budget.category, budget.month);
            const { status, color } = getBudgetStatus(spent, budget.monthlyLimit);
            const percentage = Math.min((spent / budget.monthlyLimit) * 100, 100);

            return (
              <div key={budget.id} className="p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{budget.category}</h3>
                    <Badge variant={color as any}>
                      {status === 'over' && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {status === 'over' ? 'Over Budget' : status === 'warning' ? 'Near Limit' : 'On Track'}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteBudget(budget.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Spent: ${spent.toFixed(2)}</span>
                    <span>Budget: ${budget.monthlyLimit.toFixed(2)}</span>
                  </div>
                  <Progress value={percentage} className="h-3" />
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>{percentage.toFixed(1)}% used</span>
                    <span>${(budget.monthlyLimit - spent).toFixed(2)} remaining</span>
                  </div>
                </div>
              </div>
            );
          })}

          {budgets.length === 0 && !showForm && (
            <div className="text-center py-8">
              <p className="text-slate-500">No budgets set yet. Add your first budget to start tracking!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetManager;
