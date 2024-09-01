import React from 'react';

function Filter({
  categories,
  brands,
  selectedFilterType,
  setSelectedFilterType,
  selectedFilterValue,
  setSelectedFilterValue,
  showFilterTypeDropdown,
  setShowFilterTypeDropdown,
  showFilterValueDropdown,
  setShowFilterValueDropdown,
  searchQuery,
  setSearchQuery,
  handleInputChange,
  handleSearch,
  handleKeyDown,
  suggestions,
  setSuggestions
}) {
  return (
    <div className="filters">
      <div className="filter">
        <button 
          className="filter-input" 
          onClick={() => setShowFilterTypeDropdown(!showFilterTypeDropdown)}
        >
          {selectedFilterType ? `Filter by ${selectedFilterType}` : 'Select Filter'}
        </button>
        {showFilterTypeDropdown && (
          <ul className="dropdown">
            <li onClick={() => { setSelectedFilterType('category'); setShowFilterTypeDropdown(false); setShowFilterValueDropdown(true); }}>
              Category
            </li>
            <li onClick={() => { setSelectedFilterType('brand'); setShowFilterTypeDropdown(false); setShowFilterValueDropdown(true); }}>
              Brand
            </li>
            <li onClick={() => { setSelectedFilterType(''); setSelectedFilterValue(''); setShowFilterTypeDropdown(false); }}>
              Clear Filter
            </li>
          </ul>
        )}
      </div>
      {selectedFilterType && showFilterValueDropdown && (
        <div className="filter">
          <button 
            className="filter-input"
            onClick={() => setShowFilterValueDropdown(!showFilterValueDropdown)}
          >
            {selectedFilterValue || `Select ${selectedFilterType}`}
          </button>
          {showFilterValueDropdown && (
            <ul className="dropdown">
              <li onClick={() => { setSelectedFilterValue(''); setShowFilterValueDropdown(false); }}>All</li>
              {(selectedFilterType === 'category' ? categories : brands).map(value => (
                <li key={value} onClick={() => { setSelectedFilterValue(value); setShowFilterValueDropdown(false); }}>
                  {value}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div className="filter">
        <input 
          type="text"
          className="filter-input" 
          placeholder="Search products..." 
          value={searchQuery}
          onChange={handleInputChange} 
          onKeyDown={handleKeyDown}  
        />
        <button 
          className="filter-input"
          onClick={handleSearch}
        >
          Search
        </button>
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li 
                key={index} 
                onClick={() => {
                  setSearchQuery(suggestion);
                  setSuggestions([]);
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Filter;