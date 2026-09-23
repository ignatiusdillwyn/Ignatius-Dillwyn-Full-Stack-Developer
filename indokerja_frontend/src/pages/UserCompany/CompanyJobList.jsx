import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllJobsByCompanyUserId } from '../../services/jobAPI';

const JOB_TYPE_STYLES = {
  'Full-time':  'bg-green-100 text-green-700 border-green-200',
  'Part-time':  'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Contract':   'bg-blue-100 text-blue-700 border-blue-200',
  'Internship': 'bg-purple-100 text-purple-700 border-purple-200',
  'Freelance':  'bg-pink-100 text-pink-700 border-pink-200',
  'Remote':     'bg-indigo-100 text-indigo-700 border-indigo-200',
};

const CompanyJobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        const response = await fetchAllJobsByCompanyUserId(token);
        setJobs(response.data || []);
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          'Gagal memuat daftar lowongan';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  const formatSalary = (value) => {
    if (!value) return '-';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return '-';
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Hari ini';
    if (days === 1) return '1 hari lalu';
    if (days < 30) return `${days} hari lalu`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} bulan lalu`;
    return `${Math.floor(months / 12)} tahun lalu`;
  };

  const uniqueTypes = ['All', ...new Set(jobs.map((j) => j.job_type).filter(Boolean))];

  const filteredJobs = jobs.filter((job) => {
    const matchType = filterType === 'All' || job.job_type === filterType;
    const matchSearch =
      !search ||
      job.job_title?.toLowerCase().includes(search.toLowerCase()) ||
      job.location?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Daftar Lowongan</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {jobs.length} lowongan aktif di perusahaanmu
          </p>
        </div>
        <Link
          to="/company/add-job"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:from-blue-600 hover:to-purple-600 transition shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Lowongan
        </Link>
      </div>

      {/* Toolbar (hanya muncul kalau ada job) */}
      {!loading && !error && jobs.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Search */}
            <div className="relative sm:col-span-2">
              <svg
                className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari judul atau lokasi..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Filter type */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
            >
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'All' ? 'Semua Tipe' : type}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <svg className="animate-spin w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <p className="text-sm text-gray-500">Memuat data...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && jobs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-gray-700 font-medium mb-1">Belum ada lowongan</h3>
          <p className="text-sm text-gray-500 mb-4">Mulai posting lowongan pertamamu</p>
          <Link
            to="/company/add-job"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Lowongan
          </Link>
        </div>
      )}

      {/* No result (setelah filter) */}
      {!loading && !error && jobs.length > 0 && filteredJobs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-gray-700 font-medium mb-1">Tidak ada hasil</h3>
          <p className="text-sm text-gray-500">Coba ubah kata kunci atau filter</p>
        </div>
      )}

      {/* Job List */}
      {!loading && !error && filteredJobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition flex flex-col"
            >
              {/* Header: Company + time */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  {job.company?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 truncate">{job.company}</p>
                  <p className="text-xs text-gray-400">{timeAgo(job.createdAt)}</p>
                </div>
              </div>

              {/* Job Title */}
              <h3 className="text-base font-semibold text-gray-800 mb-3 line-clamp-2">
                {job.job_title}
              </h3>

              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{job.location}</span>
              </div>

              {/* Job Type Badge */}
              <div className="mb-4">
                <span
                  className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${JOB_TYPE_STYLES[job.job_type] || 'bg-gray-100 text-gray-700 border-gray-200'}`}
                >
                  {job.job_type}
                </span>
              </div>

              {/* Footer */}
              <div className="mt-auto border-t border-gray-100 pt-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">
                  {formatSalary(job.salary)}
                </span>
                <Link
                  to="/company/application-list"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Lihat Pelamar →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyJobList;