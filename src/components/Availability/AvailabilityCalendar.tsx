import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { CrewAvailability, AvailabilityCalendar } from '../../types/Availability';
import './AvailabilityCalendar.scss';

interface AvailabilityCalendarProps {
  crewMemberId?: string; // If not provided, uses current user
  readOnly?: boolean;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ 
  crewMemberId, 
  readOnly = false 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availability, setAvailability] = useState<CrewAvailability[]>([]);
  const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAvailability, setNewAvailability] = useState({
    status: 'unavailable' as 'available' | 'unavailable' | 'partially_available',
    reason: '',
    location: '',
    notes: ''
  });

  const currentUser = auth.currentUser;
  const targetUserId = crewMemberId || currentUser?.uid;

  useEffect(() => {
    if (targetUserId) {
      loadAvailability();
    }
  }, [targetUserId, currentDate]);

  const loadAvailability = async () => {
    if (!targetUserId) return;

    setIsLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      const availabilityQuery = query(
        collection(db, 'crewAvailability'),
        where('crewMemberId', '==', targetUserId)
      );

      const snapshot = await getDocs(availabilityQuery);
      const availabilityData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as CrewAvailability));

      setAvailability(availabilityData);
    } catch (error) {
      console.error('Error loading availability:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addAvailability = async () => {
    if (!targetUserId || !selectedDates.start || !selectedDates.end) return;

    setIsLoading(true);
    try {
      const availabilityData: Omit<CrewAvailability, 'id'> = {
        crewMemberId: targetUserId,
        startDate: selectedDates.start.toISOString().split('T')[0],
        endDate: selectedDates.end.toISOString().split('T')[0],
        status: newAvailability.status,
        reason: newAvailability.reason,
        location: newAvailability.location,
        notes: newAvailability.notes,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await addDoc(collection(db, 'crewAvailability'), availabilityData);
      
      setShowAddModal(false);
      setSelectedDates({ start: null, end: null });
      setNewAvailability({
        status: 'unavailable',
        reason: '',
        location: '',
        notes: ''
      });
      
      loadAvailability();
    } catch (error) {
      console.error('Error adding availability:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAvailability = async (availabilityId: string) => {
    if (!readOnly) {
      try {
        await deleteDoc(doc(db, 'crewAvailability', availabilityId));
        loadAvailability();
      } catch (error) {
        console.error('Error deleting availability:', error);
      }
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getAvailabilityForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return availability.find(av => 
      dateString >= av.startDate && dateString <= av.endDate
    );
  };

  const handleDateClick = (date: Date) => {
    if (readOnly) return;

    if (!selectedDates.start) {
      setSelectedDates({ start: date, end: date });
    } else if (!selectedDates.end) {
      if (date >= selectedDates.start) {
        setSelectedDates({ start: selectedDates.start, end: date });
        setShowAddModal(true);
      } else {
        setSelectedDates({ start: date, end: selectedDates.start });
        setShowAddModal(true);
      }
    } else {
      setSelectedDates({ start: date, end: null });
    }
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDates.start) return false;
    if (!selectedDates.end) return date.getTime() === selectedDates.start.getTime();
    return date >= selectedDates.start && date <= selectedDates.end;
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available': return '#6BCF7F';
      case 'unavailable': return '#FF6B6B';
      case 'partially_available': return '#FFD93D';
      default: return '#999';
    }
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const days = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const availability = getAvailabilityForDate(date);
    const isSelected = isDateSelected(date);
    const isToday = date.toDateString() === new Date().toDateString();

    days.push(
      <div
        key={day}
        className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
        onClick={() => handleDateClick(date)}
        style={{
          backgroundColor: availability ? getAvailabilityColor(availability.status) : undefined,
          opacity: availability ? 0.8 : undefined
        }}
      >
        <span className="day-number">{day}</span>
        {availability && (
          <div className="availability-indicator" title={availability.reason}>
            {availability.status === 'available' && '✓'}
            {availability.status === 'unavailable' && '✗'}
            {availability.status === 'partially_available' && '~'}
          </div>
        )}
      </div>
    );
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="availability-calendar">
      <div className="calendar-header">
        <button onClick={previousMonth} className="nav-button">‹</button>
        <h3>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
        <button onClick={nextMonth} className="nav-button">›</button>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        <div className="calendar-days">
          {days}
        </div>
      </div>

      <div className="availability-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#6BCF7F' }}></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#FF6B6B' }}></div>
          <span>Unavailable</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#FFD93D' }}></div>
          <span>Partially Available</span>
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Availability</h3>
            <div className="modal-content">
              <div className="form-group">
                <label>Status:</label>
                <select
                  value={newAvailability.status}
                  onChange={(e) => setNewAvailability({
                    ...newAvailability,
                    status: e.target.value as 'available' | 'unavailable' | 'partially_available'
                  })}
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                  <option value="partially_available">Partially Available</option>
                </select>
              </div>

              <div className="form-group">
                <label>Reason:</label>
                <input
                  type="text"
                  value={newAvailability.reason}
                  onChange={(e) => setNewAvailability({
                    ...newAvailability,
                    reason: e.target.value
                  })}
                  placeholder="e.g., Vacation, Other project, etc."
                />
              </div>

              <div className="form-group">
                <label>Location:</label>
                <input
                  type="text"
                  value={newAvailability.location}
                  onChange={(e) => setNewAvailability({
                    ...newAvailability,
                    location: e.target.value
                  })}
                  placeholder="e.g., New York, Remote, etc."
                />
              </div>

              <div className="form-group">
                <label>Notes:</label>
                <textarea
                  value={newAvailability.notes}
                  onChange={(e) => setNewAvailability({
                    ...newAvailability,
                    notes: e.target.value
                  })}
                  placeholder="Additional notes..."
                />
              </div>

              <div className="modal-actions">
                <button onClick={() => setShowAddModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button onClick={addAvailability} className="save-btn" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar; 