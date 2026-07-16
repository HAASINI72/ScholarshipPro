import React from 'react';
import ScholarshipCard from './ScholarshipCard';
import { Search } from 'lucide-react';

const ResultsList = ({ results, onSave, onApply, savedIds = [], applications = [] }) => {
  const [activeFilter, setActiveFilter] = React.useState('All');
  const [searchQuery, setSearchQuery] = React.useState('');
  
  if (!results || results.length === 0) return null;

  const typeFilters = ['All', 'Merit-based', 'Need-based', 'Research'];
  const statusFilters = ['Saved', 'Applied', 'Awarded'];
  
  const appliedIds = applications.map(a => a.name);
  const awardedIds = applications.filter(a => a.status === 'Awarded').map(a => a.name);

  const filteredResults = results.filter(item => {
    let matchesFilter = false;
    
    if (activeFilter === 'All') {
      matchesFilter = true;
    } else if (typeFilters.includes(activeFilter)) {
      matchesFilter = item.type === activeFilter;
    } else if (activeFilter === 'Applied') {
      matchesFilter = appliedIds.includes(item.name);
    } else if (activeFilter === 'Saved') {
      matchesFilter = savedIds.includes(item.name);
    } else if (activeFilter === 'Awarded') {
      matchesFilter = awardedIds.includes(item.name);
    }

    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-full max-w-5xl mx-auto py-24 px-6">
      <div className="flex flex-col items-center mb-16 text-center">
        <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-[var(--muted-color)] mb-4">Analysis Result</span>
        <h2 className="text-5xl font-serif font-bold mb-10 text-[var(--text-color)]">Curated <span className="italic font-normal">opportunities</span> for you.</h2>
        
        <div className="w-full max-w-xl mb-12 relative">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search size={16} className="text-[var(--muted-color)]" />
          </div>
          <input 
            type="text"
            placeholder="Search by keywords (e.g. STEM, Harvard, merit)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--text-color)]/5 border border-[var(--text-color)]/10 rounded-full py-4 pl-14 pr-8 text-sm font-light focus:outline-none focus:border-[var(--text-color)]/30 transition-all text-[var(--text-color)]"
          />
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap justify-center gap-3">
            <span className="w-full text-[9px] uppercase tracking-widest font-bold text-[var(--muted-color)]/50 mb-1">Scholarship Type</span>
            {typeFilters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-6 py-2.5 rounded-full text-[10px] uppercase font-bold tracking-widest transition-all ${
                  activeFilter === f 
                    ? 'bg-[var(--text-color)] text-[var(--bg-color)] shadow-lg' 
                    : 'bg-[var(--card-bg)] border border-[var(--text-color)]/5 text-[var(--muted-color)] hover:border-[var(--text-color)]/20'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <span className="w-full text-[9px] uppercase tracking-widest font-bold text-[var(--muted-color)]/50 mb-1">Status</span>
            {statusFilters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-6 py-2.5 rounded-full text-[10px] uppercase font-bold tracking-widest transition-all ${
                  activeFilter === f 
                    ? 'bg-[var(--text-color)] text-[var(--bg-color)] shadow-lg' 
                    : 'bg-[var(--card-bg)] border border-[var(--text-color)]/5 text-[var(--muted-color)] hover:border-[var(--text-color)]/20'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredResults.length > 0 ? (
          filteredResults.map((item, i) => (
            <ScholarshipCard 
              key={i}
              item={item}
              index={i}
              onSave={onSave}
              onApply={onApply}
              isSaved={savedIds.includes(item.name)}
              hasApplied={appliedIds.includes(item.name)}
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-[var(--muted-color)] font-light">No scholarships found matching your search criteria.</p>
          </div>
        )}
      </div>

      <div className="mt-20 text-center">
        <button className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)] border-b border-[var(--text-color)]/20 pb-1 hover:text-[var(--text-color)] hover:border-[var(--text-color)] transition-all">
          View more in our full engine
        </button>
      </div>
    </div>
  );
};

export default ResultsList;
