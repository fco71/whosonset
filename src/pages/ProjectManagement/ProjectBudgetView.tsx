import React, { useState } from 'react';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { ProjectBudget } from '../../types/ProjectManagement';

interface ProjectBudgetViewProps {
  projectId: string;
  budget: ProjectBudget | null;
  onBudgetUpdate: () => void;
}

interface BudgetFormData {
  totalBudget: number;
  currency: string;
  categories: {
    [category: string]: {
      budgeted: number;
      spent: number;
      notes?: string;
    };
  };
}

const ProjectBudgetView: React.FC<ProjectBudgetViewProps> = ({
  projectId,
  budget,
  onBudgetUpdate
}) => {
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [formData, setFormData] = useState<BudgetFormData>({
    totalBudget: budget?.totalBudget || 0,
    currency: budget?.currency || 'USD',
    categories: budget?.categories || {
      'Pre-Production': { budgeted: 0, spent: 0, notes: '' },
      'Production': { budgeted: 0, spent: 0, notes: '' },
      'Post-Production': { budgeted: 0, spent: 0, notes: '' },
      'Equipment': { budgeted: 0, spent: 0, notes: '' },
      'Location': { budgeted: 0, spent: 0, notes: '' },
      'Crew': { budgeted: 0, spent: 0, notes: '' },
      'Marketing': { budgeted: 0, spent: 0, notes: '' },
      'Other': { budgeted: 0, spent: 0, notes: '' }
    }
  });

  const currentUser = auth.currentUser;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const budgetData = {
        projectId,
        totalBudget: formData.totalBudget,
        spentBudget: budget?.spentBudget || 0,
        currency: formData.currency,
        categories: formData.categories,
        lastUpdated: new Date()
      };

      if (budget) {
        await updateDoc(doc(db, 'projectBudget', budget.id), budgetData);
      } else {
        await addDoc(collection(db, 'projectBudget'), budgetData);
      }

      setIsEditingBudget(false);
      onBudgetUpdate();
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const updateCategoryBudget = (category: string, field: 'budgeted' | 'spent' | 'notes', value: string | number) => {
    setFormData(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: {
          ...prev.categories[category],
          [field]: field === 'notes' ? value : Number(value)
        }
      }
    }));
  };

  const calculateTotalBudgeted = () => {
    return Object.values(formData.categories).reduce((sum, cat) => sum + cat.budgeted, 0);
  };

  const calculateTotalSpent = () => {
    return Object.values(formData.categories).reduce((sum, cat) => sum + cat.spent, 0);
  };

  const getSpendingPercentage = (spent: number, budgeted: number) => {
    if (budgeted === 0) return 0;
    return (spent / budgeted) * 100;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (!budget && !isEditingBudget) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No budget set up yet</h3>
          <p className="text-gray-600 mb-4">Create a budget to track your project expenses and spending.</p>
          <button
            onClick={() => setIsEditingBudget(true)}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 font-medium"
          >
            Set Up Budget
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-light text-gray-900 mb-2">Project Budget</h3>
          <p className="text-gray-600">Track and manage your project's financial resources</p>
        </div>
        {budget && (
          <button
            onClick={() => setIsEditingBudget(true)}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 font-medium"
          >
            Edit Budget
          </button>
        )}
      </div>

      {/* Budget Overview Cards */}
      {budget && !isEditingBudget && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-600">Total Budget</h4>
              <span className="text-xs text-gray-400">Planned</span>
            </div>
            <div className="text-2xl font-light text-gray-900">
              {budget.currency}{budget.totalBudget.toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-600">Spent</h4>
              <span className="text-xs text-gray-400">Actual</span>
            </div>
            <div className="text-2xl font-light text-gray-900">
              {budget.currency}{budget.spentBudget.toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-600">Remaining</h4>
              <span className="text-xs text-gray-400">Available</span>
            </div>
            <div className="text-2xl font-light text-gray-900">
              {budget.currency}{(budget.totalBudget - budget.spentBudget).toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-600">Spent %</h4>
              <span className="text-xs text-gray-400">Progress</span>
            </div>
            <div className="text-2xl font-light text-gray-900">
              {budget.totalBudget > 0 ? ((budget.spentBudget / budget.totalBudget) * 100).toFixed(1) : 0}%
            </div>
          </div>
        </div>
      )}

      {/* Budget Form */}
      {isEditingBudget && (
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            {budget ? 'Edit Budget' : 'Create Budget'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Budget
                </label>
                <input
                  type="number"
                  value={formData.totalBudget}
                  onChange={(e) => setFormData({...formData, totalBudget: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Enter total budget"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({...formData, currency: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  required
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD (C$)</option>
                  <option value="AUD">AUD (A$)</option>
                </select>
              </div>
            </div>

            <div>
              <h5 className="text-md font-medium text-gray-900 mb-4">Budget Categories</h5>
              <div className="space-y-4">
                {Object.entries(formData.categories).map(([category, data]) => (
                  <div key={category} className="bg-white rounded-lg p-4 border border-gray-200">
                    <h6 className="font-medium text-gray-900 mb-3">{category}</h6>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Budgeted
                        </label>
                        <input
                          type="number"
                          value={data.budgeted}
                          onChange={(e) => updateCategoryBudget(category, 'budgeted', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Spent
                        </label>
                        <input
                          type="number"
                          value={data.spent}
                          onChange={(e) => updateCategoryBudget(category, 'spent', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Notes
                        </label>
                        <input
                          type="text"
                          value={data.notes || ''}
                          onChange={(e) => updateCategoryBudget(category, 'notes', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                          placeholder="Optional notes"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-300 font-medium"
              >
                {budget ? 'Update Budget' : 'Create Budget'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditingBudget(false)}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-300 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Budget Categories Detail */}
      {budget && !isEditingBudget && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h4 className="text-lg font-medium text-gray-900">Budget Breakdown</h4>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(budget.categories).map(([category, data]) => {
                const percentage = getSpendingPercentage(data.spent, data.budgeted);
                return (
                  <div key={category} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-medium text-gray-900">{category}</h5>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {budget.currency}{data.spent.toLocaleString()} / {budget.currency}{data.budgeted.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600">
                          {percentage.toFixed(1)}% spent
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(percentage)}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                    
                    {data.notes && (
                      <p className="text-sm text-gray-600 mt-2">{data.notes}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectBudgetView; 