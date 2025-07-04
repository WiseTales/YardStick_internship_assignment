
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from "@/types/transaction";

interface MonthlyChartProps {
  transactions: Transaction[];
}

const MonthlyChart = ({ transactions }: MonthlyChartProps) => {
  // Group transactions by month
  const monthlyData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const monthKey = date.toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      });
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthKey,
          expenses: 0,
          count: 0
        };
      }
      
      acc[monthKey].expenses += transaction.amount;
      acc[monthKey].count += 1;
      
      return acc;
    }, {} as Record<string, { month: string; expenses: number; count: number }>);

  // Convert to array and sort by date
  const chartData = Object.values(monthlyData)
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
    .slice(-6); // Show last 6 months

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-800">{label}</p>
          <p className="text-red-600">
            Expenses: ${data.expenses.toFixed(2)}
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
          <p className="text-lg font-medium mb-2">No expense data available</p>
          <p className="text-sm">Add some expense transactions to see your monthly spending chart</p>
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
            dataKey="month" 
            stroke="#64748b"
            fontSize={12}
          />
          <YAxis 
            stroke="#64748b"
            fontSize={12}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="expenses" 
            fill="#ef4444"
            radius={[4, 4, 0, 0]}
            className="hover:opacity-80 transition-opacity"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyChart;
