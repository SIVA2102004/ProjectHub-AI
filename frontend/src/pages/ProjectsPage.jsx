/**
 * Projects Browsing Page
 * Students can browse, search, and filter projects
 */

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../utils/api.js';

export function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sort: 'newest',
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    currentPage: 1,
  });

  const ITEMS_PER_PAGE = 12;

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch projects
  useEffect(() => {
    fetchProjects();
  }, [filters, pagination.currentPage]);

  const fetchProjects = async () => {
    setIsLoading(true);

    try {
      const params = {
        limit: ITEMS_PER_PAGE,
        offset: (pagination.currentPage - 1) * ITEMS_PER_PAGE,
        sort: filters.sort,
      };

      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;

      const response = await api.get('/projects', { params });
      setProjects(response.data.data);
      setPagination({
        total: response.data.pagination.total,
        pages: response.data.pagination.pages,
        currentPage: pagination.currentPage,
      });
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }

    setIsLoading(false);
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination({ ...pagination, currentPage: 1 });
    setSearchParams({ ...Object.fromEntries(searchParams), [name]: value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, currentPage: 1 });
  };

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Browse Projects</h1>
          <p className="text-xl text-slate-300">Explore our collection of engineering projects and resources</p>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-20">
              <h3 className="text-xl font-bold text-white mb-6">Filters</h3>

              {/* Category Filter */}
              <div className="mb-8">
                <label className="block text-white font-semibold mb-3">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div className="mb-8">
                <label className="block text-white font-semibold mb-3">Sort By</label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="input-field"
                >
                  <option value="newest">Newest</option>
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search projects..."
                  className="input-field flex-1"
                />
                <button type="submit" className="btn-primary">
                  Search
                </button>
              </div>
            </form>

            {/* Projects Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-white text-lg">Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-slate-400 text-lg">No projects found</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects.map((project) => (
                    <Link
                      key={project.id}
                      to={`/projects/${project.id}`}
                      className="card-hover group"
                    >
                      {project.imageUrl && (
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-48 object-cover rounded-lg mb-4 group-hover:opacity-75 transition"
                        />
                      )}
                      <div className="flex gap-2 mb-3">
                        <span className="badge">{project.categoryName}</span>
                        <span className="badge bg-yellow-500/20 text-yellow-300">{project.difficulty}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition">
                        {project.title}
                      </h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex justify-between items-center border-t border-slate-700 pt-4">
                        <div>
                          {project.isFree ? (
                            <span className="text-green-400 font-bold">Free</span>
                          ) : (
                            <span className="text-blue-400 font-bold">₹{project.price}</span>
                          )}
                        </div>
                        <span className="text-slate-400 text-sm">⬇️ {project.downloadCount}</span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center gap-4 mt-12">
                    <button
                      onClick={() =>
                        setPagination({
                          ...pagination,
                          currentPage: Math.max(1, pagination.currentPage - 1),
                        })
                      }
                      disabled={pagination.currentPage === 1}
                      className="btn-outline disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="flex items-center text-white">
                      Page {pagination.currentPage} of {pagination.pages}
                    </span>
                    <button
                      onClick={() =>
                        setPagination({
                          ...pagination,
                          currentPage: Math.min(pagination.pages, pagination.currentPage + 1),
                        })
                      }
                      disabled={pagination.currentPage === pagination.pages}
                      className="btn-outline disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectsPage;
