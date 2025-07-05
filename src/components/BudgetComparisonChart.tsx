
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Budget, Transaction } from "@/types/transaction";

interface BudgetComparisonChartProps {
  budgets: Budget[];
  transactions: Transaction[];
}

const BudgetComparisonChart = ({ budgets, transactions }: BudgetComparisonChartProps) => {
  const chartData = budgets.map(budget => {
    const spent = transactions
      .filter(t => 
        t.type === 'expense' && 
        t.category === budget.category && 
        t.date.startsWith(budget.month)
      )
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      category: budget.category,
      budget: budget.monthlyLimit,
      spent: spent,
      remaining: Math.max(0, budget.monthlyLimit - spent)
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-800">{label}</p>
          <p className="text-blue-600">Budget: ${data.budget.toFixed(2)}</p>
          <p className="text-red-600">Spent: ${data.spent.toFixed(2)}</p>
          <p className="text-green-600">Remaining: ${data.remaining.toFixed(2)}</p>
          <p className="text-slate-600 text-sm">
            {((data.spent / data.budget) * 100).toFixed(1)}% used
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500">
        <div className="text-center">
          <p className="text-lg font-medium mb-2">No budget data available</p>
          <p className="text-sm">Set up budgets to see budget vs actual comparison</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="category" 
            stroke="#64748b"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#64748b"
            fontSize={12}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="budget" 
            fill="#3b82f6"
            name="Budget"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="spent" 
            fill="#ef4444"
            name="Spent"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetComparisonChart;
