
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/types/transaction";
import { Trash, Calendar, Search } from "lucide-react";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionList = ({ transactions, onEdit, onDelete }: TransactionListProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-700 mb-2">No transactions yet</h3>
        <p className="text-slate-500">Add your first transaction to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <Input
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Transaction List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            onClick={() => onEdit(transaction)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge 
                  variant={transaction.type === 'income' ? 'default' : 'destructive'}
                  className={transaction.type === 'income' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}
                >
                  {transaction.type}
                </Badge>
                <span className="text-sm text-slate-500">
                  {formatDate(transaction.date)}
                </span>
              </div>
              <p className="font-medium text-slate-900 truncate">
                {transaction.description}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={`font-bold text-lg ${
                transaction.type === 'income' 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(transaction.id);
                }}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredTransactions.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <p className="text-slate-500">No transactions match your search.</p>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
