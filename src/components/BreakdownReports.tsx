import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { BreakdownElement, ProjectDocument } from '../types/ProjectManagement';
import toast from 'react-hot-toast';

interface BreakdownReportsProps {
  document?: ProjectDocument;
  projectId?: string;
}

interface ReportData {
  totalElements: number;
  elementsByType: Record<string, number>;
  elementsByStatus: Record<string, number>;
  elementsByPriority: Record<string, number>;
  totalEstimatedCost: number;
  costByType: Record<string, number>;
  elementsByScene: Record<string, BreakdownElement[]>;
  sceneCount: number;
  averageElementsPerScene: number;
}

const BreakdownReports: React.FC<BreakdownReportsProps> = ({ document: projectDocument, projectId }) => {
  const [breakdownElements, setBreakdownElements] = useState<BreakdownElement[]>([]);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<'summary' | 'budget' | 'scene' | 'detailed'>('summary');

  useEffect(() => {
    loadBreakdownElements();
  }, [projectDocument?.id]);

  const loadBreakdownElements = async () => {
    try {
      setLoading(true);
      
      let q;
      
      if (projectDocument?.id) {
        // Query by document ID if available
        q = query(
          collection(db, 'breakdownElements'),
          where('documentId', '==', projectDocument.id)
        );
      } else if (projectId) {
        // Query by project ID if no document
        q = query(
          collection(db, 'breakdownElements'),
          where('projectId', '==', projectId)
        );
      } else {
        // No document or project ID available
        setBreakdownElements([]);
        setLoading(false);
        return;
      }
      
      const querySnapshot = await getDocs(q);
      const elements = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BreakdownElement[];
      
      setBreakdownElements(elements);
      generateReportData(elements);
    } catch (error) {
      console.error('Error loading breakdown elements:', error);
      toast.error('Failed to load breakdown data');
    } finally {
      setLoading(false);
    }
  };

  const generateReportData = (elements: BreakdownElement[]) => {
    const elementsByType: Record<string, number> = {};
    const elementsByStatus: Record<string, number> = {};
    const elementsByPriority: Record<string, number> = {};
    const costByType: Record<string, number> = {};
    const elementsByScene: Record<string, BreakdownElement[]> = {};

    let totalEstimatedCost = 0;

    elements.forEach(element => {
      // Count by type
      elementsByType[element.elementType] = (elementsByType[element.elementType] || 0) + 1;
      
      // Count by status
      elementsByStatus[element.status] = (elementsByStatus[element.status] || 0) + 1;
      
      // Count by priority
      elementsByPriority[element.priority] = (elementsByPriority[element.priority] || 0) + 1;
      
      // Cost tracking
      if (element.estimatedCost) {
        totalEstimatedCost += element.estimatedCost;
        costByType[element.elementType] = (costByType[element.elementType] || 0) + element.estimatedCost;
      }
      
      // Group by scene
      const sceneKey = element.scene || 'Unspecified Scene';
      if (!elementsByScene[sceneKey]) {
        elementsByScene[sceneKey] = [];
      }
      elementsByScene[sceneKey].push(element);
    });

    const sceneCount = Object.keys(elementsByScene).length;
    const averageElementsPerScene = sceneCount > 0 ? elements.length / sceneCount : 0;

    setReportData({
      totalElements: elements.length,
      elementsByType,
      elementsByStatus,
      elementsByPriority,
      totalEstimatedCost,
      costByType,
      elementsByScene,
      sceneCount,
      averageElementsPerScene
    });
  };

  const exportToCSV = () => {
    if (!reportData) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    
    // Add header
    csvContent += 'Element Type,Name,Scene,Page,Priority,Status,Estimated Cost,Description,Tags\n';
    
    // Add data rows
    breakdownElements.forEach(element => {
      const row = [
        element.elementType,
        `"${element.name}"`,
        `"${element.scene || ''}"`,
        element.pageNumber || '',
        element.priority,
        element.status,
        element.estimatedCost || '',
        `"${element.description || ''}"`,
        `"${element.tags.join(', ')}"`
      ].join(',');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${projectDocument?.title}_breakdown_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('CSV report exported successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'acquired': return 'bg-purple-100 text-purple-800';
      case 'identified': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'prop': return 'bg-blue-100 text-blue-800';
      case 'cast': return 'bg-purple-100 text-purple-800';
      case 'location': return 'bg-green-100 text-green-800';
      case 'costume': return 'bg-pink-100 text-pink-800';
      case 'vehicle': return 'bg-orange-100 text-orange-800';
      case 'equipment': return 'bg-gray-100 text-gray-800';
      case 'sound': return 'bg-yellow-100 text-yellow-800';
      case 'effect': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading breakdown data...</span>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8 text-gray-500">
          <p>No breakdown data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Breakdown Reports</h3>
        <button
          onClick={exportToCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Report Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setSelectedReport('summary')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            selectedReport === 'summary' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => setSelectedReport('budget')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            selectedReport === 'budget' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Budget
        </button>
        <button
          onClick={() => setSelectedReport('scene')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            selectedReport === 'scene' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Scene Breakdown
        </button>
        <button
          onClick={() => setSelectedReport('detailed')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            selectedReport === 'detailed' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Detailed List
        </button>
      </div>

      {/* Summary Report */}
      {selectedReport === 'summary' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900">Total Elements</h4>
              <p className="text-2xl font-bold text-blue-600">{reportData.totalElements}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900">Scenes</h4>
              <p className="text-2xl font-bold text-green-600">{reportData.sceneCount}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900">Avg per Scene</h4>
              <p className="text-2xl font-bold text-purple-600">{reportData.averageElementsPerScene.toFixed(1)}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-900">Total Cost</h4>
              <p className="text-2xl font-bold text-orange-600">${reportData.totalEstimatedCost.toLocaleString()}</p>
            </div>
          </div>

          {/* Elements by Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-4">Elements by Type</h4>
              <div className="space-y-2">
                {Object.entries(reportData.elementsByType).map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(type)}`}>
                      {type}
                    </span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-4">Elements by Status</h4>
              <div className="space-y-2">
                {Object.entries(reportData.elementsByStatus).map(([status, count]) => (
                  <div key={status} className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                      {status.replace('_', ' ')}
                    </span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Budget Report */}
      {selectedReport === 'budget' && (
        <div className="space-y-6">
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">Total Estimated Budget</h4>
            <p className="text-3xl font-bold text-yellow-600">${reportData.totalEstimatedCost.toLocaleString()}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-4">Cost by Element Type</h4>
              <div className="space-y-3">
                {Object.entries(reportData.costByType)
                  .sort(([,a], [,b]) => b - a)
                  .map(([type, cost]) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(type)}`}>
                        {type}
                      </span>
                      <span className="font-semibold">${cost.toLocaleString()}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-4">Cost Breakdown Chart</h4>
              <div className="space-y-2">
                {Object.entries(reportData.costByType)
                  .sort(([,a], [,b]) => b - a)
                  .map(([type, cost]) => {
                    const percentage = (cost / reportData.totalEstimatedCost) * 100;
                    return (
                      <div key={type} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{type}</span>
                          <span>${cost.toLocaleString()} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scene Breakdown */}
      {selectedReport === 'scene' && (
        <div className="space-y-6">
          {Object.entries(reportData.elementsByScene)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([scene, elements]) => (
              <div key={scene} className="bg-white border border-gray-200 rounded-lg">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-900">
                    {scene} ({elements.length} elements)
                  </h4>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {elements.map((element) => (
                      <div key={element.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-gray-900 text-sm">{element.name}</h5>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(element.elementType)}`}>
                            {element.elementType}
                          </span>
                        </div>
                        <div className="flex gap-1 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(element.priority)}`}>
                            {element.priority}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(element.status)}`}>
                            {element.status}
                          </span>
                        </div>
                        {element.estimatedCost && (
                          <p className="text-sm text-gray-600">Est. Cost: ${element.estimatedCost}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Detailed List */}
      {selectedReport === 'detailed' && (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Element</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scene</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {breakdownElements.map((element) => (
                  <tr key={element.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-900">{element.name}</div>
                        {element.description && (
                          <div className="text-sm text-gray-500">{element.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(element.elementType)}`}>
                        {element.elementType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{element.scene || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{element.pageNumber || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(element.priority)}`}>
                        {element.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(element.status)}`}>
                        {element.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {element.estimatedCost ? `$${element.estimatedCost}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreakdownReports; 