
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction } from "@/types/transaction";

interface CategoryPieChartProps {
  transactions: Transaction[];
  type: 'income' | 'expense';
}

const CategoryPieChart = ({ transactions, type }: CategoryPieChartProps) => {
  // Group transactions by category
  const categoryData = transactions
    .filter(t => t.type === type)
    .reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = {
          category,
          amount: 0,
          count: 0
        };
      }
      acc[category].amount += transaction.amount;
      acc[category].count += 1;
      return acc;
    }, {} as Record<string, { category: string; amount: number; count: number }>);

  const chartData = Object.values(categoryData)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8); // Show top 8 categories

  const COLORS = [
    '#ef4444', '#f97316', '#eab308', '#22c55e',
    '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-800">{data.category}</p>
          <p className={type === 'expense' ? 'text-red-600' : 'text-green-600'}>
            Amount: ${data.amount.toFixed(2)}
          </p>
          <p className="text-slate-600 text-sm">
            {data.count} transaction{data.count !== 1 ? 's' : ''}
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
          <p className="text-lg font-medium mb-2">No {type} data available</p>
          <p className="text-sm">Add some {type} transactions to see category breakdown</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="amount"
            label={({ category, percent }) => 
              percent > 0.05 ? `${category} ${(percent * 100).toFixed(0)}%` : ''
            }
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPieChart;
