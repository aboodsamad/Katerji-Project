import { useState, useEffect } from "react";
import { placesAPI } from "../services/placesApi";
import CustomDropdown from "./CustomDropdown";

export default function DataTable() {
  const rowsPerPage = 10;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "location", direction: "asc" });
  const [filters, setFilters] = useState({});
  const [selectedPlace, setSelectedPlace] = useState(null);
  
  // API data
  const [rows, setRows] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    countries: [],
    categories: [],
    accommodations: []
  });

  // Columns to display in table
  const displayColumns = [
    { key: "location", label: "Location" },
    { key: "country", label: "Country" },
    { key: "category", label: "Category" },
    { key: "visitors", label: "Visitors" },
    { key: "rating", label: "Rating" },
    { key: "accommodation_available", label: "Accommodation" },
    { key: "address", label: "Address" },
  ];

  // Columns to show as filters (subset of displayColumns)
  const filterColumns = [
    { key: "country", label: "Country", filterKey: "countries" },
    { key: "category", label: "Category", filterKey: "categories" },
    { key: "accommodation_available", label: "Accommodation", filterKey: "accommodations" },
  ];

  // Fetch filter options on mount
  useEffect(() => {
    async function loadFilters() {
      try {
        const result = await placesAPI.getFilters();
        setFilterOptions({
          countries: result.filters.countries,
          categories: result.filters.categories,
          accommodations: result.filters.accommodations
        });
      } catch (err) {
        console.error("Error loading filters:", err);
      }
    }
    loadFilters();
  }, []);

  // Fetch data whenever filters/page/sort changes
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const result = await placesAPI.getPlaces({
          page,
          limit: rowsPerPage,
          country: filters.country || undefined,
          category: filters.category || undefined,
          accommodation_available: filters.accommodation_available || undefined,
          search: search || undefined,
          sortBy: sortConfig.key,
          sortOrder: sortConfig.direction
        });

        setRows(result.data);
        setTotalPages(result.pagination.totalPages);
        setTotalRecords(result.pagination.totalRecords);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    }

    fetchData();
  }, [page, filters, search, sortConfig]);

  // SORTING
  const handleSort = (col) => {
    let dir = "asc";
    if (sortConfig.key === col && sortConfig.direction === "asc") {
      dir = "desc";
    }
    setSortConfig({ key: col, direction: dir });
    setPage(1); // Reset to first page on sort
  };

  const handlePrev = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages));

  // RATING STARS
  const renderStars = (rating) => {
    if (rating == null || rating === "") return "-";
    const val = Number(rating);
    if (Number.isNaN(val)) return rating;

    const stars = Math.max(0, Math.min(5, Math.round(val)));
    return (
      <span style={{ fontSize: 16 }}>
        <span style={{ color: "#fbbf24" }}>{"★".repeat(stars)}</span>
        <span style={{ color: "#d1d5db" }}>{"★".repeat(5 - stars)}</span>
        <span style={{ marginLeft: 6, fontSize: 12, color: "#6b7280" }}>
          {val.toFixed(1)}
        </span>
      </span>
    );
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #e0f2fe, #eef2ff)",
        minHeight: "100vh",
        padding: "32px 24px",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* HEADER CARD */}
        <section
          style={{
            background: "linear-gradient(135deg, #4f46e5, #9333ea)",
            borderRadius: 28,
            padding: "26px 30px",
            marginBottom: 30,
            color: "white",
            boxShadow: "0 18px 40px rgba(15,23,42,0.35)",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ fontSize: 14, opacity: 0.9 }}>
            🌍 Lebanon Travel Insights
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>
            Lebanon Places Explorer
          </h1>
          <p style={{ margin: 0, fontSize: 14, opacity: 0.95, maxWidth: 520 }}>
            Browse locations, filter by city and category, and quickly open
            any place on the map.
          </p>
        </section>

        {/* SEARCH + FILTERS CARD */}
        <section
          style={{
            background: "white",
            borderRadius: 22,
            padding: "20px 22px",
            marginBottom: 26,
            boxShadow: "0 10px 26px rgba(15,23,42,0.15)",
          }}
        >
          {/* Search */}
          <div style={{ marginBottom: 18 }}>
            <input
              type="text"
              placeholder="Search places, cities, or categories"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              style={{
                padding: "12px 16px",
                borderRadius: 999,
                border: "1px solid #cbd5e1",
                boxShadow: "0 2px 6px rgba(15,23,42,0.06)",
                width: "100%",
                maxWidth: "500px",
                outline: "none",
                fontSize: 14,
              }}
            />
          </div>

          {/* Filters row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
  {filterColumns.map((col) => {

    // If this is the country column → replace label to CITY
    const label = col.key === "country" ? "CITY" : col.label.toUpperCase();

    return (
      <div key={col.key} style={{ minWidth: 150, flex: "1 1 180px" }}>
        <CustomDropdown
          label={label}
          value={filters[col.key] || ""}
          options={filterOptions[col.filterKey] || []}
          onChange={(val) => {
            setPage(1);
            setFilters((prev) => ({ ...prev, [col.key]: val || null }));
          }}
        />
      </div>
    );
  })}
</div>


          {/* Clear Filters Button */}
          {Object.values(filters).some(v => v) && (
            <div style={{ marginTop: 18 }}>
              <button
                onClick={() => {
                  setFilters({});
                  setPage(1);
                }}
                style={{
                  padding: "10px 20px",
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: 999,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </section>

        {/* TABLE CARD */}
        <section
          style={{
            borderRadius: 22,
            background: "white",
            boxShadow: "0 14px 32px rgba(15,23,42,0.18)",
            overflow: "hidden",
          }}
        >
          {loading && (
            <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
              ⏳ Loading data...
            </div>
          )}

          {!loading && (
            <>
              <div style={{ overflowX: "auto" }}>
                <table
                  width="100%"
                  cellPadding="12"
                  style={{ borderCollapse: "collapse", minWidth: "100%" }}
                >
                  <thead>
                    <tr
                      style={{
                        background: "#f1f5f9",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      {displayColumns.map((col) => (
                        <th
                          key={col.key}
                          onClick={() => handleSort(col.key)}
                          style={{
                            padding: 14,
                            cursor: "pointer",
                            userSelect: "none",
                            borderBottom: "2px solid #e2e8f0",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {col.label}{" "}
                          {sortConfig.key === col.key
                            ? sortConfig.direction === "asc"
                              ? "▲"
                              : "▼"
                            : ""}
                        </th>
                      ))}
                      <th
                        style={{
                          padding: 14,
                          borderBottom: "2px solid #e2e8f0",
                          whiteSpace: "nowrap",
                        }}
                      >
                        View
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((r, i) => (
                      <tr
                        key={i}
                        style={{
                          backgroundColor: i % 2 === 0 ? "#ffffff" : "#f8fafc",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        {displayColumns.map((col) => (
                          <td
                            key={col.key}
                            style={{
                              padding: 12,
                              verticalAlign: "middle",
                              fontSize: 14,
                              maxWidth: col.key === "address" ? "200px" : "auto",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: col.key === "address" ? "nowrap" : "normal"
                            }}
                          >
                            {col.key === "rating"
                              ? renderStars(r[col.key])
                              : r[col.key]}
                          </td>
                        ))}

                        <td style={{ padding: 12 }}>
                          <button
                            onClick={async () => {
                        const resp = await fetch(
                          `http://localhost:5000/api/places/place-url?placeid=${r.placeid}`
                        );
                        const data = await resp.json();

                        if (data.url) {
                          window.open(data.url, "_blank");
                        } else {
                          alert("Google Maps URL not found for this place.");
                        }
                      }}


                            style={{
                              background: "#6366f1",
                              color: "white",
                              padding: "8px 16px",
                              borderRadius: 999,
                              fontSize: 13,
                              border: "none",
                              cursor: "pointer",
                              fontWeight: 500,
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}

                    {rows.length === 0 && (
                      <tr>
                        <td
                          colSpan={displayColumns.length + 1}
                          style={{
                            padding: 18,
                            textAlign: "center",
                            color: "#6b7280",
                            fontSize: 14,
                          }}
                        >
                          No results match your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div
                style={{
                  padding: "16px 18px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem",
                  background: "#f9fafb",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ fontSize: 13, color: "#6b7280" }}>
                  Showing {rows.length > 0 ? ((page - 1) * rowsPerPage) + 1 : 0} - {Math.min(page * rowsPerPage, totalRecords)} of {totalRecords.toLocaleString()} places
                </div>

                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <button
                    onClick={handlePrev}
                    disabled={page === 1}
                    style={{
                      padding: "8px 14px",
                      background: page === 1 ? "#cbd5e1" : "#6366f1",
                      color: "white",
                      border: "none",
                      borderRadius: 999,
                      cursor: page === 1 ? "not-allowed" : "pointer",
                      fontSize: 13,
                    }}
                  >
                    ◀ Prev
                  </button>

                  <span style={{ fontSize: 14, fontWeight: 600 }}>
                    Page {page} of {totalPages}
                  </span>

                  <button
                    onClick={handleNext}
                    disabled={page === totalPages}
                    style={{
                      padding: "8px 14px",
                      background: page === totalPages ? "#cbd5e1" : "#6366f1",
                      color: "white",
                      border: "none",
                      borderRadius: 999,
                      cursor: page === totalPages ? "not-allowed" : "pointer",
                      fontSize: 13,
                    }}
                  >
                    Next ▶
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      {/* Maps modal */}
      {selectedPlace && (
        <div
          onClick={() => setSelectedPlace(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "80%",
              height: "80%",
              maxWidth: "1000px",
              background: "white",
              borderRadius: 24,
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 20px 45px rgba(15,23,42,0.6)",
            }}
          >
            <button
              onClick={() => setSelectedPlace(null)}
              style={{
                position: "absolute",
                right: 20,
                top: 20,
                background: "#ef4444",
                color: "white",
                border: "none",
                padding: "8px 14px",
                borderRadius: 999,
                cursor: "pointer",
                fontWeight: 600,
                zIndex: 10,
                fontSize: 13,
              }}
            >
              Close
            </button>

            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps?q=${selectedPlace.lat},${selectedPlace.lng}&hl=en&z=17&output=embed`}
            />
          </div>
        </div>
      )}
    </div>
  );
}