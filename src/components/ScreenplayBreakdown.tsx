import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { BreakdownElement, ProjectDocument } from '../types/ProjectManagement';
import toast from 'react-hot-toast';
import BreakdownReports from './BreakdownReports';

interface ScreenplayBreakdownProps {
  document?: ProjectDocument;
  projectId?: string;
  onBreakdownUpdate?: () => void;
}

const ScreenplayBreakdown: React.FC<ScreenplayBreakdownProps> = ({
  document,
  projectId,
  onBreakdownUpdate
}) => {
  const [breakdownElements, setBreakdownElements] = useState<BreakdownElement[]>([]);
  const [isAddingElement, setIsAddingElement] = useState(false);
  const [editingElement, setEditingElement] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'breakdown' | 'reports'>('breakdown');
  const [formData, setFormData] = useState({
    elementType: 'prop' as 'prop' | 'cast' | 'location' | 'costume' | 'vehicle' | 'equipment' | 'sound' | 'effect',
    name: '',
    description: '',
    scene: '',
    pageNumber: '',
    lineNumber: '',
    context: '',
    notes: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    status: 'identified' as 'identified' | 'acquired' | 'in_progress' | 'completed',
    assignedTo: '',
    estimatedCost: '',
    tags: [] as string[]
  });
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    loadBreakdownElements();
  }, [document?.id]);

  const loadBreakdownElements = async () => {
    try {
      const q = query(
        collection(db, 'breakdownElements'),
        where('documentId', '==', document?.id)
      );
      const querySnapshot = await getDocs(q);
      const elements = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BreakdownElement[];
      setBreakdownElements(elements);
    } catch (error) {
      console.error('Error loading breakdown elements:', error);
      toast.error('Failed to load breakdown elements');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    try {
      const elementData = {
        ...formData,
        documentId: document?.id,
        pageNumber: formData.pageNumber ? parseInt(formData.pageNumber) : undefined,
        lineNumber: formData.lineNumber ? parseInt(formData.lineNumber) : undefined,
        estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost) : undefined,
        createdBy: auth.currentUser.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (editingElement) {
        await updateDoc(doc(db, 'breakdownElements', editingElement), {
          ...elementData,
          updatedAt: new Date()
        });
        setEditingElement(null);
        toast.success('Breakdown element updated');
      } else {
        await addDoc(collection(db, 'breakdownElements'), elementData);
        toast.success('Breakdown element added');
      }

      setFormData({
        elementType: 'prop' as 'prop' | 'cast' | 'location' | 'costume' | 'vehicle' | 'equipment' | 'sound' | 'effect',
        name: '',
        description: '',
        scene: '',
        pageNumber: '',
        lineNumber: '',
        context: '',
        notes: '',
        priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
        status: 'identified' as 'identified' | 'acquired' | 'in_progress' | 'completed',
        assignedTo: '',
        estimatedCost: '',
        tags: []
      });
      setIsAddingElement(false);
      loadBreakdownElements();
      onBreakdownUpdate?.();
    } catch (error) {
      console.error('Error saving breakdown element:', error);
      toast.error('Failed to save breakdown element');
    }
  };

  const handleDelete = async (elementId: string) => {
    if (!confirm('Are you sure you want to delete this breakdown element?')) return;

    try {
      await deleteDoc(doc(db, 'breakdownElements', elementId));
      toast.success('Breakdown element deleted');
      loadBreakdownElements();
      onBreakdownUpdate?.();
    } catch (error) {
      console.error('Error deleting breakdown element:', error);
      toast.error('Failed to delete breakdown element');
    }
  };

  const handleEdit = (element: BreakdownElement) => {
    setEditingElement(element.id);
    setFormData({
      elementType: element.elementType,
      name: element.name,
      description: element.description || '',
      scene: element.scene || '',
      pageNumber: element.pageNumber?.toString() || '',
      lineNumber: element.lineNumber?.toString() || '',
      context: element.context || '',
      notes: element.notes || '',
      priority: element.priority,
      status: element.status,
      assignedTo: element.assignedTo || '',
      estimatedCost: element.estimatedCost?.toString() || '',
      tags: element.tags || []
    });
    setIsAddingElement(true);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const getElementTypeColor = (type: string) => {
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  const groupedElements = breakdownElements.reduce((acc, element) => {
    if (!acc[element.elementType]) {
      acc[element.elementType] = [];
    }
    acc[element.elementType].push(element);
    return acc;
  }, {} as Record<string, BreakdownElement[]>);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('breakdown')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'breakdown' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Breakdown Elements
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'reports' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Reports
        </button>
      </div>

      {activeTab === 'breakdown' && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Screenplay Breakdown</h3>
            <button
              onClick={() => setIsAddingElement(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Element
            </button>
          </div>

          {/* Breakdown Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900">Total Elements</h4>
              <p className="text-2xl font-bold text-blue-600">{breakdownElements.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900">Completed</h4>
              <p className="text-2xl font-bold text-green-600">
                {breakdownElements.filter(e => e.status === 'completed').length}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-900">In Progress</h4>
              <p className="text-2xl font-bold text-orange-600">
                {breakdownElements.filter(e => e.status === 'in_progress').length}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900">Categories</h4>
              <p className="text-2xl font-bold text-purple-600">{Object.keys(groupedElements).length}</p>
            </div>
          </div>

          {/* Add/Edit Form */}
          {isAddingElement && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h4 className="text-lg font-semibold mb-4">
                {editingElement ? 'Edit Breakdown Element' : 'Add Breakdown Element'}
              </h4>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Element Type
                    </label>
                    <select
                      value={formData.elementType}
                      onChange={(e) => setFormData(prev => ({ ...prev, elementType: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="prop">Prop</option>
                      <option value="cast">Cast</option>
                      <option value="location">Location</option>
                      <option value="costume">Costume</option>
                      <option value="vehicle">Vehicle</option>
                      <option value="equipment">Equipment</option>
                      <option value="sound">Sound</option>
                      <option value="effect">Effect</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Scene
                    </label>
                    <input
                      type="text"
                      value={formData.scene}
                      onChange={(e) => setFormData(prev => ({ ...prev, scene: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Page Number
                    </label>
                    <input
                      type="number"
                      value={formData.pageNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, pageNumber: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Line Number
                    </label>
                    <input
                      type="number"
                      value={formData.lineNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, lineNumber: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="identified">Identified</option>
                      <option value="acquired">Acquired</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Cost
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.estimatedCost}
                      onChange={(e) => setFormData(prev => ({ ...prev, estimatedCost: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {editingElement ? 'Update' : 'Add'} Element
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingElement(false);
                      setEditingElement(null);
                      setFormData({
                        elementType: 'prop' as 'prop' | 'cast' | 'location' | 'costume' | 'vehicle' | 'equipment' | 'sound' | 'effect',
                        name: '',
                        description: '',
                        scene: '',
                        pageNumber: '',
                        lineNumber: '',
                        context: '',
                        notes: '',
                        priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
                        status: 'identified' as 'identified' | 'acquired' | 'in_progress' | 'completed',
                        assignedTo: '',
                        estimatedCost: '',
                        tags: []
                      });
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Breakdown Elements by Category */}
          {Object.keys(groupedElements).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedElements).map(([type, elements]) => (
                <div key={type} className="border border-gray-200 rounded-lg">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-900 capitalize">
                      {type} ({elements.length})
                    </h4>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {elements.map((element) => (
                        <div key={element.id} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-semibold text-gray-900">{element.name}</h5>
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleEdit(element)}
                                className="text-gray-600 hover:text-gray-800 p-1"
                                title="Edit"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(element.id)}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Delete"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          
                          {element.description && (
                            <p className="text-sm text-gray-600 mb-2">{element.description}</p>
                          )}
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getElementTypeColor(element.elementType)}`}>
                              {element.elementType}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(element.priority)}`}>
                              {element.priority}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(element.status)}`}>
                              {element.status}
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-500 space-y-1">
                            {element.scene && <div>Scene: {element.scene}</div>}
                            {element.pageNumber && <div>Page: {element.pageNumber}</div>}
                            {element.estimatedCost && <div>Est. Cost: ${element.estimatedCost}</div>}
                          </div>
                          
                          {element.tags.length > 0 && (
                            <div className="mt-3">
                              <div className="flex flex-wrap gap-1">
                                {element.tags.map((tag, index) => (
                                  <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No breakdown elements added yet.</p>
              <p className="text-sm">Click "Add Element" to start tagging your screenplay.</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'reports' && document && (
        <BreakdownReports document={document} projectId={projectId} />
      )}
      {activeTab === 'reports' && !document && (
        <div className="text-center py-8 text-gray-500">
          <p>No screenplay document available for reports.</p>
          <p className="text-sm">Upload a screenplay first to generate reports.</p>
        </div>
      )}
    </div>
  );
};

export default ScreenplayBreakdown; 