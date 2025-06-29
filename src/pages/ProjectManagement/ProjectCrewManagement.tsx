import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { ProjectCrew } from '../../types/ProjectManagement';

interface ProjectCrewManagementProps {
  projectId: string;
  crew: ProjectCrew[];
  onCrewUpdate: () => void;
}

interface CrewFormData {
  crewMemberId: string;
  role: string;
  department: string;
  startDate: string;
  endDate: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  salary?: number;
  notes?: string;
}

const ProjectCrewManagement: React.FC<ProjectCrewManagementProps> = ({
  projectId,
  crew,
  onCrewUpdate
}) => {
  const [isAddingCrew, setIsAddingCrew] = useState(false);
  const [isEditingCrew, setIsEditingCrew] = useState<string | null>(null);
  const [availableCrew, setAvailableCrew] = useState<any[]>([]);
  const [formData, setFormData] = useState<CrewFormData>({
    crewMemberId: '',
    role: '',
    department: '',
    startDate: '',
    endDate: '',
    status: 'pending',
    salary: undefined,
    notes: ''
  });

  const currentUser = auth.currentUser;

  useEffect(() => {
    loadAvailableCrew();
  }, []);

  const loadAvailableCrew = async () => {
    try {
      const crewQuery = query(collection(db, 'users'), where('userType', '==', 'crew'));
      const crewSnapshot = await getDocs(crewQuery);
      const crewData = crewSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAvailableCrew(crewData);
    } catch (error) {
      console.error('Error loading available crew:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const crewData = {
        projectId,
        ...formData,
        addedBy: currentUser.uid,
        addedAt: new Date()
      };

      if (isEditingCrew) {
        await updateDoc(doc(db, 'projectCrew', isEditingCrew), crewData);
      } else {
        await addDoc(collection(db, 'projectCrew'), crewData);
      }

      setFormData({
        crewMemberId: '',
        role: '',
        department: '',
        startDate: '',
        endDate: '',
        status: 'pending',
        salary: undefined,
        notes: ''
      });
      setIsAddingCrew(false);
      setIsEditingCrew(null);
      onCrewUpdate();
    } catch (error) {
      console.error('Error saving crew member:', error);
    }
  };

  const handleEdit = (member: ProjectCrew) => {
    setFormData({
      crewMemberId: member.crewMemberId,
      role: member.role,
      department: member.department,
      startDate: member.startDate,
      endDate: member.endDate || '',
      status: member.status,
      salary: member.salary,
      notes: member.notes || ''
    });
    setIsEditingCrew(member.id);
  };

  const handleDelete = async (memberId: string) => {
    if (window.confirm('Are you sure you want to remove this crew member?')) {
      try {
        await deleteDoc(doc(db, 'projectCrew', memberId));
        onCrewUpdate();
      } catch (error) {
        console.error('Error deleting crew member:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDepartmentColor = (department: string) => {
    const colors = [
      'bg-purple-100 text-purple-800',
      'bg-indigo-100 text-indigo-800',
      'bg-pink-100 text-pink-800',
      'bg-orange-100 text-orange-800',
      'bg-teal-100 text-teal-800'
    ];
    const index = department.length % colors.length;
    return colors[index];
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-light text-gray-900 mb-2">Project Crew</h3>
          <p className="text-gray-600">Manage crew members and their roles for this project</p>
        </div>
        <button
          onClick={() => setIsAddingCrew(true)}
          className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 font-medium"
        >
          Add Crew Member
        </button>
      </div>

      {/* Add/Edit Crew Form */}
      {(isAddingCrew || isEditingCrew) && (
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            {isEditingCrew ? 'Edit Crew Member' : 'Add New Crew Member'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crew Member
                </label>
                <select
                  value={formData.crewMemberId}
                  onChange={(e) => setFormData({...formData, crewMemberId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  required
                >
                  <option value="">Select a crew member</option>
                  {availableCrew.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.displayName || member.email}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="e.g., Director of Photography"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  required
                >
                  <option value="">Select department</option>
                  <option value="Camera">Camera</option>
                  <option value="Sound">Sound</option>
                  <option value="Lighting">Lighting</option>
                  <option value="Art">Art</option>
                  <option value="Costume">Costume</option>
                  <option value="Makeup">Makeup</option>
                  <option value="Production">Production</option>
                  <option value="Post-Production">Post-Production</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary (optional)
                </label>
                <input
                  type="number"
                  value={formData.salary || ''}
                  onChange={(e) => setFormData({...formData, salary: e.target.value ? Number(e.target.value) : undefined})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Enter salary amount"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                rows={3}
                placeholder="Additional notes about this crew member..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-300 font-medium"
              >
                {isEditingCrew ? 'Update Crew Member' : 'Add Crew Member'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingCrew(false);
                  setIsEditingCrew(null);
                  setFormData({
                    crewMemberId: '',
                    role: '',
                    department: '',
                    startDate: '',
                    endDate: '',
                    status: 'pending',
                    salary: undefined,
                    notes: ''
                  });
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-300 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Crew Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crew.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No crew members yet</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first crew member to the project.</p>
            <button
              onClick={() => setIsAddingCrew(true)}
              className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 font-medium"
            >
              Add First Crew Member
            </button>
          </div>
        ) : (
          crew.map((member) => (
            <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900 mb-1">
                    {member.crewMemberId}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">{member.role}</p>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDepartmentColor(member.department)}`}>
                      {member.department}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                      {member.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Date:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(member.startDate).toLocaleDateString()}
                  </span>
                </div>
                {member.endDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">End Date:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(member.endDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {member.salary && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Salary:</span>
                    <span className="font-medium text-gray-900">
                      ${member.salary.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {member.notes && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">{member.notes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectCrewManagement; 