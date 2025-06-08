
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

interface Activity {
  id: string;
  tripId: string;
  title: string;
  date: string;
  time: string;
  category: 'Adventure' | 'Food' | 'Sightseeing' | 'Other';
  estimatedCost: number;
  notes?: string;
  createdBy: string;
  votes: string[];
}

interface BudgetOverviewProps {
  activities: Activity[];
  totalBudget?: number;
}

const BudgetOverview = ({ activities, totalBudget }: BudgetOverviewProps) => {
  const totalSpent = activities.reduce((sum, activity) => sum + activity.estimatedCost, 0);
  const remainingBudget = totalBudget ? totalBudget - totalSpent : null;
  const budgetUsedPercent = totalBudget ? (totalSpent / totalBudget) * 100 : 0;

  const categoryTotals = activities.reduce((acc, activity) => {
    acc[activity.category] = (acc[activity.category] || 0) + activity.estimatedCost;
    return acc;
  }, {} as Record<string, number>);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Adventure':
        return 'bg-orange-500';
      case 'Food':
        return 'bg-green-500';
      case 'Sightseeing':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Budget Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Estimated Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              ${totalSpent.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        {totalBudget && (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Remaining Budget
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${remainingBudget! < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ${Math.abs(remainingBudget!).toFixed(2)}
                  {remainingBudget! < 0 && ' over'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Budget Used
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {budgetUsedPercent.toFixed(1)}%
                </div>
                <Progress 
                  value={Math.min(budgetUsedPercent, 100)} 
                  className="h-2"
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(categoryTotals).length === 0 ? (
            <p className="text-gray-500 text-center py-8">No activities added yet</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(categoryTotals)
                .sort(([,a], [,b]) => b - a)
                .map(([category, amount]) => {
                  const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)}`} />
                          <span className="font-medium">{category}</span>
                        </div>
                        <span className="text-gray-600">${amount.toFixed(2)}</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <div className="text-sm text-gray-500 text-right">
                        {percentage.toFixed(1)}% of total
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity List */}
      <Card>
        <CardHeader>
          <CardTitle>All Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No activities added yet</p>
          ) : (
            <div className="space-y-3">
              {activities
                .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())
                .map(activity => (
                  <div key={activity.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <div className="font-medium">{activity.title}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(activity.date).toLocaleDateString()} at {new Date(`2000-01-01T${activity.time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${activity.estimatedCost.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">{activity.category}</div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetOverview;
