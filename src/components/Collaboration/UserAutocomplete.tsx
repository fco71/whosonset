import React, { useState, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';

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
    // Debounce search to avoid jitter
    const debouncedSearch = debounce((val: string) => {
      if (val.trim()) {
        onSearch(val);
      }
    }, 250);
    debouncedSearch(inputValue);
    return () => debouncedSearch.cancel();
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
    // Keep dropdown open and refocus input for quick multi-add
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setShowDropdown(true);
  };

  const handleRemove = (userId: string) => {
    onChange(value.filter((u) => u.id !== userId));
  };

  return (
    <div className="user-autocomplete" style={{ position: 'relative' }}>
      <div className="selected-users" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
        {value.map((user) => (
          <span
            key={user.id}
            className="user-chip-modern"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: '#f3f6fa',
              borderRadius: '999px',
              padding: '0.25rem 0.75rem 0.25rem 0.5rem',
              margin: '0 0.25rem 0.25rem 0',
              fontSize: '0.95em',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              border: '1px solid #e0e6ed',
            }}
          >
            {user.avatar && (
              <img src={user.avatar} alt={user.name} style={{ width: 22, height: 22, borderRadius: '50%', marginRight: 6 }} />
            )}
            <span style={{ fontWeight: 500, color: '#222' }}>{user.name}</span>
            <button
              onClick={() => handleRemove(user.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#888',
                marginLeft: 8,
                fontSize: '1.1em',
                cursor: 'pointer',
                lineHeight: 1,
                padding: 0,
              }}
              aria-label={`Remove ${user.name}`}
            >
              &times;
            </button>
          </span>
        ))}
      </div>
      <input
        ref={inputRef}
        className="form-input user-autocomplete-input"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setShowDropdown(true)}
        placeholder={placeholder}
        style={{
          minWidth: 220,
          maxWidth: 340,
          border: '1.5px solid #d0d7e2',
          borderRadius: 8,
          padding: '0.5rem 0.75rem',
          fontSize: '1em',
          background: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
        }}
      />
      {showDropdown && (
        <div
          className="autocomplete-dropdown-modern"
          style={{
            position: 'absolute',
            zIndex: 10,
            background: '#fff',
            border: '1.5px solid #d0d7e2',
            borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            marginTop: 4,
            minWidth: 220,
            maxWidth: 340,
            maxHeight: 220,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {loading ? (
            <div className="autocomplete-loading" style={{ padding: '1rem', textAlign: 'center', color: '#888' }}>Searching...</div>
          ) : options.length === 0 && inputValue.trim() ? (
            <div className="autocomplete-no-results" style={{ padding: '1rem', textAlign: 'center', color: '#888' }}>No results found</div>
          ) : (
            options.map((user, idx) => (
              <div
                key={user.id}
                className={`autocomplete-option-modern${highlightedIndex === idx ? ' highlighted' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  background: highlightedIndex === idx ? '#f0f6ff' : '#fff',
                  fontWeight: 500,
                  color: '#222',
                  borderBottom: idx !== options.length - 1 ? '1px solid #f3f6fa' : 'none',
                }}
                onMouseDown={() => handleSelect(user)}
                onMouseEnter={() => setHighlightedIndex(idx)}
              >
                {user.avatar && (
                  <img src={user.avatar} alt={user.name} style={{ width: 22, height: 22, borderRadius: '50%', marginRight: 10 }} />
                )}
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