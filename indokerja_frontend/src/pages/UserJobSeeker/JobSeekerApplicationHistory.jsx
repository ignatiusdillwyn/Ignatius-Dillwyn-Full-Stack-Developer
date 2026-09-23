import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllApplicationsByUserJobSeekerId } from '../../services/applicationAPI';
import { fetchJobById } from '../../services/jobAPI';

const STATUS_STYLES = {
  Applied:     'bg-gray-100 text-gray-700 border-gray-200',
  Reviewing:   'bg-yellow-100 text-yellow-700 border-yellow-200',
  Shortlisted: 'bg-blue-100 text-blue-700 border-blue-200',
  Rejected:    'bg-red-100 text-red-700 border-red-200',
  Accepted:    'bg-green-100 text-green-700 border-green-200',
};

const STATUS_ICONS = {
  Applied:     '📤',
  Reviewing:   '🔍',
  Shortlisted: '⭐',
  Rejected:    '❌',
  Accepted:    '✅',
};

const JobSeekerApplicationHistory = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');

        // 1. Fetch semua application milik jobseeker
        const applicationsRes = await fetchAllApplicationsByUserJobSeekerId(token);
        const apps = applicationsRes.data || [];

        // 2. Untuk setiap application, fetch detail job-nya
        //    lalu embed ke object application sebagai `job`
        const enriched = await Promise.all(
          apps.map(async (app) => {
            try {
              const jobRes = await fetchJobById(app.job_id, token);
              return { ...app, job: jobRes.data };
            } catch (err) {
              // Kalau job-nya tidak ditemukan / error, tetap tampilkan application
              // dengan job = null supaya tidak crash
              console.error(`Gagal fetch job ${app.job_id}:`, err);
              return { ...app, job: null };
            }
          })
        );

        console.log('enriched:', enriched);
        setApplications(enriched);
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          'Gagal memuat riwayat lamaran';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatDate = (value) => {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
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

  // Applications sudah ter-enrich, tinggal pakai `applications`
  const enriched = applications;

  // Filter
  const filtered = enriched.filter((app) => {
    const matchStatus = filterStatus === 'All' || app.status === filterStatus;
    const matchSearch =
      !search ||
      app.job?.job_title?.toLowerCase().includes(search.toLowerCase()) ||
      app.job?.company?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const countByStatus = (status) =>
    status === 'All'
      ? enriched.length
      : enriched.filter((a) => a.status === status).length;

  const statusTabs = ['All', 'Applied', 'Reviewing', 'Shortlisted', 'Accepted', 'Rejected'];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Riwayat Lamaran</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Lacak status semua lamaran yang sudah kamu kirim
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Lamaran" value={enriched.length} color="purple" icon="📨" />
        <StatCard
          label="Menunggu"
          value={enriched.filter((a) => a.status === 'Applied' || a.status === 'Reviewing').length}
          color="yellow"
          icon="⏳"
        />
        <StatCard
          label="Shortlisted"
          value={enriched.filter((a) => a.status === 'Shortlisted').length}
          color="blue"
          icon="⭐"
        />
        <StatCard
          label="Diterima"
          value={enriched.filter((a) => a.status === 'Accepted').length}
          color="green"
          icon="🎉"
        />
      </div>

      {/* Toolbar */}
      {enriched.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
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
              placeholder="Cari posisi atau perusahaan..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2">
            {statusTabs.map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  filterStatus === status
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    filterStatus === status
                      ? 'bg-white/20 text-white'
                      : 'bg-white text-gray-500'
                  }`}
                >
                  {countByStatus(status)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="flex flex-col items-center gap-3">
            <svg className="animate-spin w-8 h-8 text-purple-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <p className="text-sm text-gray-500">Memuat riwayat lamaran...</p>
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
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-purple-50 mb-4">
            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-gray-700 font-medium mb-1">
            {enriched.length === 0 ? 'Belum ada lamaran' : 'Tidak ada hasil'}
          </h3>
          <p className="text-sm text-gray-500 mb-4 text-center max-w-sm">
            {enriched.length === 0
              ? 'Mulai lamar pekerjaan impianmu dan lacak statusnya di sini'
              : 'Coba ubah filter atau kata kunci pencarian'}
          </p>
          {enriched.length === 0 && (
            <Link
              to="/jobseeker/job-list"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Cari Lowongan
            </Link>
          )}
        </div>
      )}

      {/* Application List */}
      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-purple-200 transition"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Left: Job Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3">
                    {/* Avatar inisial company */}
                    <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {app.job?.company?.charAt(0)?.toUpperCase() || '?'}
                    </div>

                    <div className="min-w-0 flex-1">
                      {/* Job title + status badge */}
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-base font-semibold text-gray-800 truncate">
                          {app.job?.job_title || `Job #${app.job_id}`}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[app.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}
                        >
                          <span>{STATUS_ICONS[app.status] || ''}</span>
                          {app.status}
                        </span>
                      </div>

                      {/* Company + location */}
                      <p className="text-sm text-gray-500 truncate mb-2">
                        {app.job?.company || 'Perusahaan'}
                        {app.job?.location && ` • ${app.job.location}`}
                      </p>

                      {/* Meta: applied date */}
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="inline-flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Dilamar {formatDate(app.createdAt)}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span>{timeAgo(app.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Action */}
                <div className="flex items-center md:flex-shrink-0">
                  <Link
                    to={`/jobseeker/job-detail/${app.job_id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition"
                  >
                    Lihat Lowongan
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ----- Helper component -----
const StatCard = ({ label, value, color, icon }) => {
  const colors = {
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg mb-2 text-base ${colors[color]}`}>
        {icon}
      </div>
      <div className="text-xl font-bold text-gray-800">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
};

export default JobSeekerApplicationHistory;