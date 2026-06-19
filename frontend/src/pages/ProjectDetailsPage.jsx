/**
 * Project Details Page
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/api.js';

export function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data.data);
    } catch (error) {
      console.error('Failed to fetch project:', error);
    }
    setIsLoading(false);
  };

  const handleBuyProject = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsProcessing(true);

    try {
      // Create order
      const orderResponse = await api.post('/orders', { projectId: id });
      const order = orderResponse.data.data;

      if (!project.isFree) {
        // Process payment
        await api.post('/payments', {
          orderId: order.id,
          amount: project.price,
        });
      }

      alert('Project purchased successfully!');
      fetchProject();
    } catch (error) {
      console.error('Failed to purchase project:', error);
      alert(error.response?.data?.message || 'Failed to purchase project');
    }

    setIsProcessing(false);
  };

  const handleDownload = async (fileType) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      // Record download
      await api.post('/orders/downloads', {
        projectId: id,
        fileType,
      });

      // In a real app, this would trigger a file download
      alert(`Download started for ${fileType}!`);
    } catch (error) {
      console.error('Failed to download:', error);
      alert(error.response?.data?.message || 'Failed to download');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white text-lg">Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white text-lg">Project not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image */}
            {project.imageUrl && (
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-96 object-cover rounded-lg mb-8"
              />
            )}

            {/* Project Info */}
            <div className="mb-8">
              <div className="flex gap-3 mb-4">
                <span className="badge">{project.categoryName}</span>
                <span className="badge bg-yellow-500/20 text-yellow-300">{project.difficulty}</span>
              </div>
              <h1 className="text-5xl font-bold text-white mb-4">{project.title}</h1>
              <p className="text-xl text-slate-300 mb-8">{project.description}</p>
            </div>

            {/* Tech Stack */}
            {project.techStack && (
              <div className="card mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Tech Stack</h3>
                <div className="flex flex-wrap gap-3">
                  {project.techStack.split(',').map((tech, index) => (
                    <span key={index} className="badge bg-purple-500/20 text-purple-300">
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Downloads */}
            <div className="card">
              <h3 className="text-2xl font-bold text-white mb-6">Downloads Included</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'Source Code', type: 'sourcecode', icon: '💻' },
                  { name: 'Reports', type: 'report', icon: '📄' },
                  { name: 'PPTs', type: 'ppt', icon: '📊' },
                  { name: 'Viva Questions', type: 'viva', icon: '❓' },
                  { name: 'Abstracts', type: 'abstract', icon: '📝' },
                ].map((file) => (
                  <button
                    key={file.type}
                    onClick={() => handleDownload(file.type)}
                    disabled={!isAuthenticated}
                    className="card hover:border-primary transition text-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="text-3xl mb-2">{file.icon}</div>
                    <p className="text-white font-semibold">{file.name}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Price Card */}
            <div className="card sticky top-20 mb-6">
              <div className="text-4xl font-bold text-white mb-4">
                {project.isFree ? (
                  <span className="text-green-400">Free</span>
                ) : (
                  <>₹{project.price}</>
                )}
              </div>

              {isAuthenticated ? (
                <>
                  {project.isFree ? (
                    <button
                      onClick={handleBuyProject}
                      disabled={isProcessing}
                      className="btn-primary w-full mb-3 disabled:opacity-50"
                    >
                      {isProcessing ? 'Processing...' : 'Access Project'}
                    </button>
                  ) : (
                    <button
                      onClick={handleBuyProject}
                      disabled={isProcessing}
                      className="btn-primary w-full mb-3 disabled:opacity-50"
                    >
                      {isProcessing ? 'Processing...' : 'Buy Now'}
                    </button>
                  )}
                </>
              ) : (
                <button onClick={() => navigate('/login')} className="btn-primary w-full mb-3">
                  Login to Purchase
                </button>
              )}

              <button className="btn-outline w-full">Request Custom Version</button>

              {/* Stats */}
              <div className="border-t border-slate-700 mt-6 pt-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-slate-400 text-sm">Downloads</p>
                    <p className="text-2xl font-bold text-white">{project.downloadCount}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Created</p>
                    <p className="text-white">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Share */}
            <div className="card">
              <h4 className="text-white font-bold mb-4">Share</h4>
              <div className="flex gap-3">
                <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition">
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailsPage;
