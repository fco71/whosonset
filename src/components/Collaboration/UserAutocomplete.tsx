import React, { useState, useEffect, useRef } from 'react';

export interface UserAutocompleteOption {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  company?: string;
}

interface UserAutocompleteProps {
  value: UserAutocompleteOption[];
  onChange: (users: UserAutocompleteOption[]) => void;
  onSearch: (query: string) => void;
  options: UserAutocompleteOption[];
  loading?: boolean;
  placeholder?: string;
}

const UserAutocomplete: React.FC<UserAutocompleteProps> = ({
  value,
  onChange,
  onSearch,
  options,
  loading = false,
  placeholder = 'Search users...'
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputValue.trim()) {
      onSearch(inputValue);
    }
  }, [inputValue, onSearch]);

  useEffect(() => {
    if (showDropdown && options.length > 0) {
      setHighlightedIndex(0);
    } else {
      setHighlightedIndex(-1);
    }
  }, [showDropdown, options]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % options.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < options.length) {
        handleSelect(options[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowDropdown(true);
  };

  const handleSelect = (user: UserAutocompleteOption) => {
    if (!value.find((u) => u.id === user.id)) {
      onChange([...value, user]);
    }
    setInputValue('');
    setShowDropdown(false);
  };

  const handleRemove = (userId: string) => {
    onChange(value.filter((u) => u.id !== userId));
  };

  return (
    <div className="user-autocomplete" style={{ position: 'relative' }}>
      <div className="selected-users" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
        {value.map((user) => (
          <div key={user.id} className="user-chip" style={{ display: 'flex', alignItems: 'center', background: '#f3f4f6', borderRadius: '16px', padding: '0.25rem 0.75rem', fontSize: '0.85em' }}>
            {user.avatar && <img src={user.avatar} alt={user.name} style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 6 }} />}
            <span>{user.name}</span>
            <button onClick={() => handleRemove(user.id)} style={{ marginLeft: 8, background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.1em' }} title="Remove">×</button>
          </div>
        ))}
      </div>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setShowDropdown(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="form-input"
        style={{ width: '100%' }}
      />
      {showDropdown && (
        <div ref={dropdownRef} className="autocomplete-dropdown" style={{ position: 'absolute', zIndex: 10, background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, width: '100%', marginTop: 2, maxHeight: 220, overflowY: 'auto', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
          {loading ? (
            <div className="autocomplete-loading" style={{ padding: '1rem', textAlign: 'center', color: '#888' }}>Searching...</div>
          ) : options.length === 0 && inputValue.trim() ? (
            <div className="autocomplete-no-results" style={{ padding: '1rem', textAlign: 'center', color: '#888' }}>No results found</div>
          ) : (
            options.map((user, idx) => (
              <div
                key={user.id}
                className={`autocomplete-option${idx === highlightedIndex ? ' highlighted' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.5rem 1rem',
                  background: idx === highlightedIndex ? '#f0f9ff' : 'white',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f3f4f6',
                }}
                onMouseDown={() => handleSelect(user)}
                onMouseEnter={() => setHighlightedIndex(idx)}
              >
                {user.avatar && <img src={user.avatar} alt={user.name} style={{ width: 28, height: 28, borderRadius: '50%', marginRight: 10 }} />}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{user.name}</div>
                  <div style={{ fontSize: '0.85em', color: '#888' }}>{user.email}</div>
                  {user.role && <div style={{ fontSize: '0.8em', color: '#059669' }}>{user.role}</div>}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default UserAutocomplete; 