
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertCircle, Target } from "lucide-react";
import { Transaction, Budget } from "@/types/transaction";

interface SpendingInsightsProps {
  transactions: Transaction[];
  budgets: Budget[];
}

const SpendingInsights = ({ transactions, budgets }: SpendingInsightsProps) => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7);

  // Current month expenses
  const currentMonthExpenses = transactions
    .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
    .reduce((sum, t) => sum + t.amount, 0);

  // Last month expenses
  const lastMonthExpenses = transactions
    .filter(t => t.type === 'expense' && t.date.startsWith(lastMonth))
    .reduce((sum, t) => sum + t.amount, 0);

  // Month-over-month change
  const monthlyChange = lastMonthExpenses > 0 
    ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 
    : 0;

  // Top spending category this month
  const categorySpending = transactions
    .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const topCategory = Object.entries(categorySpending)
    .sort(([,a], [,b]) => b - a)[0];

  // Budget warnings
  const budgetWarnings = budgets
    .map(budget => {
      const spent = transactions
        .filter(t => 
          t.type === 'expense' && 
          t.category === budget.category && 
          t.date.startsWith(budget.month)
        )
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        ...budget,
        spent,
        percentage: (spent / budget.monthlyLimit) * 100
      };
    })
    .filter(b => b.percentage >= 80);

  // Average transaction amount
  const avgTransaction = transactions.length > 0
    ? transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0) / transactions.filter(t => t.type === 'expense').length
    : 0;

  // Days since last transaction
  const lastTransaction = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  
  const daysSinceLastTransaction = lastTransaction
    ? Math.floor((new Date().getTime() - new Date(lastTransaction.date).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Monthly Trend */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {monthlyChange >= 0 ? (
                <TrendingUp className="h-4 w-4 text-red-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-500" />
              )}
              Monthly Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {monthlyChange >= 0 ? '+' : ''}{monthlyChange.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              vs last month (${lastMonthExpenses.toFixed(2)})
            </p>
          </CardContent>
        </Card>

        {/* Top Category */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              Top Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {topCategory ? topCategory[0] : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ${topCategory ? topCategory[1].toFixed(2) : '0.00'} this month
            </p>
          </CardContent>
        </Card>

        {/* Average Transaction */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Avg Transaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${avgTransaction.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {daysSinceLastTransaction} days since last
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Warnings */}
      {budgetWarnings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Budget Alerts
            </CardTitle>
            <CardDescription>
              Categories approaching or exceeding budget limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {budgetWarnings.map(warning => (
                <div key={warning.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium">{warning.category}</p>
                    <p className="text-sm text-muted-foreground">
                      ${warning.spent.toFixed(2)} of ${warning.monthlyLimit.toFixed(2)}
                    </p>
                  </div>
                  <Badge variant={warning.percentage >= 100 ? 'destructive' : 'secondary'}>
                    {warning.percentage.toFixed(0)}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">💡 Smart Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {monthlyChange > 20 && (
              <p className="text-orange-600">• Your spending increased significantly this month. Consider reviewing your expenses.</p>
            )}
            {topCategory && topCategory[1] > currentMonthExpenses * 0.4 && (
              <p className="text-blue-600">• {topCategory[0]} represents a large portion of your spending. Look for optimization opportunities.</p>
            )}
            {budgetWarnings.length === 0 && budgets.length > 0 && (
              <p className="text-green-600">• Great job staying within your budgets!</p>
            )}
            {avgTransaction > 100 && (
              <p className="text-purple-600">• Your average transaction is ${avgTransaction.toFixed(2)}. Consider if this aligns with your goals.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpendingInsights;
