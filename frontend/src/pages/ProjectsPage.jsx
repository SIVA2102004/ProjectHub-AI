import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProjectCard from '../components/ProjectCard';
import api from '../api/axios';

export default function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    difficulty: searchParams.get('difficulty') || '',
    is_free: searchParams.get('is_free') || '',
    sort: searchParams.get('sort') || 'created_at',
    order: searchParams.get('order') || 'desc',
  });
  const [page, setPage] = useState(1);

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  const sortOptions = [
    { value: 'created_at-desc', label: 'Newest First' },
    { value: 'created_at-asc', label: 'Oldest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'download_count-desc', label: 'Most Downloaded' },
  ];

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [filters, page]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page, limit: 12,
        ...(search && { search }),
        ...(filters.category && { category: filters.category }),
        ...(filters.difficulty && { difficulty: filters.difficulty }),
        ...(filters.is_free && { is_free: filters.is_free }),
        sort: filters.sort,
        order: filters.order,
      });
      const res = await api.get(`/projects?${params}`);
      setProjects(res.data.projects);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProjects();
  };

  const handleFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setFilters({ category: '', difficulty: '', is_free: '', sort: 'created_at', order: 'desc' });
    setPage(1);
  };

  const hasActiveFilters = filters.category || filters.difficulty || filters.is_free || search;

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <div className="pt-24 pb-10 px-4 bg-dark-800/30 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Browse <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-gray-400 text-lg">
            {pagination.total || 0} projects across {categories.length} categories
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search projects, tech stack, topics..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-11"
            />
          </div>
          <button type="submit" className="btn-primary px-6">Search</button>
        </form>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="glass-card p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-semibold">Filters</h3>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs text-primary-400 hover:text-primary-300">Clear All</button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="text-gray-400 text-xs font-semibold uppercase mb-3">Category</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => handleFilter('category', '')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!filters.category ? 'bg-primary-600/20 text-primary-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  >
                    All Categories
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleFilter('category', cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                        filters.category === cat.slug ? 'bg-primary-600/20 text-primary-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span className="flex-1">{cat.name}</span>
                      <span className="text-xs text-gray-500">{cat.project_count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div className="mb-6">
                <h4 className="text-gray-400 text-xs font-semibold uppercase mb-3">Difficulty</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => handleFilter('difficulty', '')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!filters.difficulty ? 'bg-primary-600/20 text-primary-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  >
                    All Levels
                  </button>
                  {difficulties.map(d => (
                    <button key={d} onClick={() => handleFilter('difficulty', d)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filters.difficulty === d ? 'bg-primary-600/20 text-primary-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="text-gray-400 text-xs font-semibold uppercase mb-3">Price</h4>
                <div className="space-y-1">
                  {[['', 'All Projects'], ['false', 'Paid Projects'], ['true', 'Free Projects']].map(([val, label]) => (
                    <button key={val} onClick={() => handleFilter('is_free', val)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filters.is_free === val ? 'bg-primary-600/20 text-primary-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Projects Grid */}
          <div className="flex-1">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-gray-400 text-sm">
                Showing {projects.length} of {pagination.total || 0} projects
              </span>
              <select
                value={`${filters.sort}-${filters.order}`}
                onChange={e => {
                  const [sort, order] = e.target.value.split('-');
                  setFilters(prev => ({ ...prev, sort, order }));
                }}
                className="input-field w-auto py-2 text-sm"
              >
                {sortOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="glass-card h-80 animate-pulse">
                    <div className="h-44 bg-dark-700 rounded-t-2xl" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-dark-600 rounded w-3/4" />
                      <div className="h-3 bg-dark-600 rounded w-full" />
                      <div className="h-3 bg-dark-600 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-24 glass-card">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-white mb-2">No projects found</h3>
                <p className="text-gray-400">Try adjusting your filters or search query</p>
                <button onClick={clearFilters} className="btn-primary mt-6">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {projects.map(p => <ProjectCard key={p.id} project={p} />)}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                      className="btn-secondary text-sm py-2 px-4 disabled:opacity-40">← Prev</button>
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${page === p ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-white/5'}`}>
                        {p}
                      </button>
                    ))}
                    <button disabled={page === pagination.totalPages} onClick={() => setPage(p => p + 1)}
                      className="btn-secondary text-sm py-2 px-4 disabled:opacity-40">Next →</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
