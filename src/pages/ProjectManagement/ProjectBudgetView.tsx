import React, { useState } from 'react';
import { ProjectBudget } from '../../types/ProjectManagement';

interface ProjectBudgetViewProps {
  projectId: string;
  budget: ProjectBudget | null;
  onBudgetUpdate: () => void;
}

const ProjectBudgetView: React.FC<ProjectBudgetViewProps> = ({
  projectId,
  budget,
  onBudgetUpdate
}) => {
  const [isEditingBudget, setIsEditingBudget] = useState(false);

  if (!budget) {
    return (
      <div className="budget-section">
        <div className="section-header">
          <h3>Project Budget</h3>
          <button 
            className="create-budget"
            onClick={() => setIsEditingBudget(true)}
          >
            Create Budget
          </button>
        </div>
        <div className="empty-state">
          <p>No budget has been set up for this project yet.</p>
          <button 
            className="setup-budget"
            onClick={() => setIsEditingBudget(true)}
          >
            Set Up Budget
          </button>
        </div>
      </div>
    );
  }

  const totalBudgeted = Object.values(budget.categories).reduce((sum, cat) => sum + cat.budgeted, 0);
  const totalSpent = Object.values(budget.categories).reduce((sum, cat) => sum + cat.spent, 0);
  const remainingBudget = totalBudgeted - totalSpent;
  const spendingPercentage = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

  return (
    <div className="budget-section">
      <div className="section-header">
        <h3>Project Budget</h3>
        <button 
          className="edit-budget"
          onClick={() => setIsEditingBudget(true)}
        >
          Edit Budget
        </button>
      </div>
      
      <div className="budget-overview">
        <div className="budget-item">
          <div className="budget-label">Total Budget</div>
          <div className="budget-amount">{budget.currency}{totalBudgeted.toLocaleString()}</div>
        </div>
        <div className="budget-item">
          <div className="budget-label">Spent</div>
          <div className="budget-amount">{budget.currency}{totalSpent.toLocaleString()}</div>
        </div>
        <div className="budget-item">
          <div className="budget-label">Remaining</div>
          <div className="budget-amount">{budget.currency}{remainingBudget.toLocaleString()}</div>
        </div>
        <div className="budget-item">
          <div className="budget-label">Spent %</div>
          <div className="budget-amount">{spendingPercentage.toFixed(1)}%</div>
        </div>
      </div>

      <div className="budget-categories">
        <h4>Budget Categories</h4>
        <div className="categories-list">
          {Object.entries(budget.categories).map(([category, data]) => (
            <div key={category} className="category-item">
              <div className="category-header">
                <span className="category-name">{category}</span>
                <span className="category-total">
                  {budget.currency}{data.budgeted.toLocaleString()}
                </span>
              </div>
              <div className="category-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${data.budgeted > 0 ? (data.spent / data.budgeted) * 100 : 0}%`,
                      backgroundColor: data.spent > data.budgeted ? '#dc2626' : '#10b981'
                    }}
                  ></div>
                </div>
                <span className="spent-amount">
                  {budget.currency}{data.spent.toLocaleString()} / {budget.currency}{data.budgeted.toLocaleString()}
                </span>
              </div>
              {data.notes && (
                <div className="category-notes">
                  <p>{data.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectBudgetView; 