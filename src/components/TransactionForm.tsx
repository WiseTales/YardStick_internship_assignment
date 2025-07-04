
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Transaction } from "@/types/transaction";

interface TransactionFormProps {
  transaction?: Transaction | null;
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
}

const TransactionForm = ({ transaction, onSubmit, onCancel }: TransactionFormProps) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: '',
    type: 'expense' as 'income' | 'expense'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount.toString(),
        description: transaction.description,
        date: transaction.date,
        type: transaction.type
      });
    } else {
      // Set default date to today
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, date: today }));
    }
  }, [transaction]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit({
      amount: parseFloat(formData.amount),
      description: formData.description.trim(),
      date: formData.date,
      type: formData.type
    });

    // Reset form if not editing
    if (!transaction) {
      setFormData({
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        type: 'expense'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select 
          value={formData.type} 
          onValueChange={(value: 'income' | 'expense') => 
            setFormData(prev => ({ ...prev, type: value }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount ($)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={formData.amount}
          onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
          className={errors.amount ? 'border-red-500' : ''}
        />
        {errors.amount && (
          <p className="text-sm text-red-600">{errors.amount}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter transaction description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className={errors.description ? 'border-red-500' : ''}
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          className={errors.date ? 'border-red-500' : ''}
        />
        {errors.date && (
          <p className="text-sm text-red-600">{errors.date}</p>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
          {transaction ? 'Update' : 'Add'} Transaction
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
