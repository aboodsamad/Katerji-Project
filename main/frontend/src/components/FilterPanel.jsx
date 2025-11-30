import CustomDropdown from "./CustomDropdown.jsx";

export default function FilterPanel({
  data,
  country,
  setCountry,
  category,
  setCategory,
  onClearFilters,
}) {
  // Handle data being either an array (old) or object with countries/categories (new)
  const countries = data.countries || (Array.isArray(data) ? Array.from(new Set(data.map((d) => d.Country || d.country))).sort() : []);
  const categories = data.categories || (Array.isArray(data) ? Array.from(new Set(data.map((d) => d.Category || d.category))).sort() : []);
  
  const hasActiveFilters = country || category;

  return (
    <div className="filter-panel">
      <h3>Filters</h3>
      <div className="filter-group">
        <CustomDropdown
          label="City"
          value={country}
          onChange={setCountry}
          options={countries}
        />
      </div>
      <div className="filter-group">
        <CustomDropdown
          label="Category"
          value={category}
          onChange={setCategory}
          options={categories}
        />
      </div>
      {hasActiveFilters && (
        <>
          <button className="clear-filters-btn" onClick={onClearFilters}>
            Clear All Filters
          </button>
          
          <div className="active-filters">
            <div className="active-filters-title">Active Filters:</div>
            {country && <span className="filter-badge">📍 {country}</span>}
            {category && <span className="filter-badge">🏷️ {category}</span>}
          </div>
        </>
      )}
    </div>
  );
}