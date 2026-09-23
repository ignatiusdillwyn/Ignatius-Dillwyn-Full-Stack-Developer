import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllJobs } from '../../services/jobAPI';

const JOB_TYPE_STYLES = {
  'Full-time':  'bg-green-100 text-green-700 border-green-200',
  'Part-time':  'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Contract':   'bg-blue-100 text-blue-700 border-blue-200',
  'Internship': 'bg-purple-100 text-purple-700 border-purple-200',
  'Freelance':  'bg-pink-100 text-pink-700 border-pink-200',
  'Remote':     'bg-indigo-100 text-indigo-700 border-indigo-200',
};

const JobSeekerJobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter state
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetchAllJobs(token);
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

  // Format salary ke Rupiah
  const formatSalary = (value) => {
    if (!value) return '-';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      notation: value >= 1_000_000 ? 'compact' : 'standard',
      compactDisplay: 'short',
    }).format(value);
  };

  // Relative time ("2 hari lalu")
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

  // Daftar job_type unik (untuk dropdown filter)
  const uniqueTypes = ['All', ...new Set(jobs.map((j) => j.job_type).filter(Boolean))];
  const uniqueLocations = ['All', ...new Set(jobs.map((j) => j.location).filter(Boolean))];

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const matchSearch =
      !search ||
      job.job_title?.toLowerCase().includes(search.toLowerCase()) ||
      job.company?.toLowerCase().includes(search.toLowerCase()) ||
      job.job_description?.toLowerCase().includes(search.toLowerCase());

    const matchType = filterType === 'All' || job.job_type === filterType;
    const matchLocation = filterLocation === 'All' || job.location === filterLocation;

    return matchSearch && matchType && matchLocation;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Temukan Pekerjaan Impianmu</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {jobs.length} lowongan tersedia dari berbagai perusahaan
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        {/* Search */}
        <div className="relative mb-4">
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
            placeholder="Cari posisi, perusahaan, atau kata kunci..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Tipe Pekerjaan
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-white"
            >
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'All' ? 'Semua Tipe' : type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Lokasi
            </label>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-white"
            >
              {uniqueLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === 'All' ? 'Semua Lokasi' : loc}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <svg className="animate-spin w-8 h-8 text-purple-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <p className="text-sm text-gray-500">Memuat lowongan...</p>
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

      {/* Empty */}
      {!loading && !error && filteredJobs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-gray-700 font-medium mb-1">
            {jobs.length === 0 ? 'Belum ada lowongan' : 'Tidak ada lowongan yang cocok'}
          </h3>
          <p className="text-sm text-gray-500">
            {jobs.length === 0
              ? 'Coba lagi nanti'
              : 'Coba ubah filter atau kata kunci pencarian'}
          </p>
        </div>
      )}

      {/* Job Grid */}
      {!loading && !error && filteredJobs.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              Menampilkan <span className="font-medium text-gray-700">{filteredJobs.length}</span> lowongan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJobs.map((job) => (
              <Link
                key={job.id}
                to={`/jobseeker/job-detail/${job.id}`}
                className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-purple-200 hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
              >
                {/* Company */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {job.company?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 truncate">{job.company}</p>
                      <p className="text-xs text-gray-400">{timeAgo(job.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Job Title */}
                <h3 className="text-base font-semibold text-gray-800 group-hover:text-purple-600 transition mb-3 line-clamp-2">
                  {job.job_title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                  {job.job_description}
                </p>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-gray-500 mb-4">
                  <span className="inline-flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatSalary(job.salary)}
                  </span>
                </div>

                {/* Footer: Badge + CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${JOB_TYPE_STYLES[job.job_type] || 'bg-gray-100 text-gray-700 border-gray-200'}`}
                  >
                    {job.job_type}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-600 group-hover:gap-2 transition-all">
                    Lihat Detail
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default JobSeekerJobList;