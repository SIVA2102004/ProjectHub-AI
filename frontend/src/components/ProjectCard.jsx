import React from 'react';
import { Link } from 'react-router-dom';

const difficultyColors = {
  Beginner: 'text-green-400 bg-green-400/10 border-green-400/20',
  Intermediate: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  Advanced: 'text-red-400 bg-red-400/10 border-red-400/20',
};

export default function ProjectCard({ project }) {
  const includes = [
    project.includes_source && { icon: '💻', label: 'Source Code' },
    project.includes_report && { icon: '📄', label: 'Report' },
    project.includes_ppt && { icon: '📊', label: 'PPT' },
    project.includes_abstract && { icon: '📋', label: 'Abstract' },
    project.includes_viva && { icon: '🎤', label: 'Viva Q&A' },
  ].filter(Boolean);

  return (
    <Link to={`/projects/${project.slug}`} className="block">
      <div className="project-card overflow-hidden h-full flex flex-col">
        {/* Image / Placeholder */}
        <div className="relative h-44 bg-gradient-to-br from-dark-700 to-dark-800 overflow-hidden flex-shrink-0">
          {project.image_url ? (
            <img
              src={`http://localhost:5000/uploads/${project.image_url}`}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-5xl opacity-30">{project.category_icon || '💡'}</div>
              <div className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, ${project.category_color || '#3b82f6'}15, transparent)` }}
              />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {project.is_free ? (
              <span className="badge bg-green-500/20 text-green-400 border border-green-500/30">FREE</span>
            ) : (
              <span className="badge bg-primary-500/20 text-primary-400 border border-primary-500/30">PREMIUM</span>
            )}
            {project.is_featured && (
              <span className="badge bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">⭐ FEATURED</span>
            )}
          </div>

          {/* Category */}
          <div className="absolute top-3 right-3">
            <span className="badge text-xs font-medium px-2 py-1 rounded-lg"
              style={{ background: `${project.category_color}20`, color: project.category_color, border: `1px solid ${project.category_color}30` }}>
              {project.category_icon} {project.category_name}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-white font-semibold text-base leading-snug line-clamp-2 flex-1">
              {project.title}
            </h3>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
            {project.short_description || project.description}
          </p>

          {/* Tech stack tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tech_stack?.split(',').slice(0, 3).map((tech, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded-md bg-dark-600 text-gray-300 border border-white/5">
                {tech.trim()}
              </span>
            ))}
          </div>

          {/* Difficulty */}
          <div className="flex items-center justify-between mb-4">
            <span className={`badge border text-xs ${difficultyColors[project.difficulty] || difficultyColors.Intermediate}`}>
              {project.difficulty}
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>⬇</span>
              <span>{project.download_count || 0} downloads</span>
            </div>
          </div>

          {/* Includes */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {includes.slice(0, 4).map((item, i) => (
              <span key={i} className="text-xs text-gray-400 flex items-center gap-1">
                <span>{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </span>
            ))}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
            <div>
              {project.is_free ? (
                <span className="text-green-400 font-bold text-lg">Free</span>
              ) : (
                <span className="text-white font-bold text-xl">₹{project.price}</span>
              )}
            </div>
            <span className="text-xs text-primary-400 font-medium">View Details →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
