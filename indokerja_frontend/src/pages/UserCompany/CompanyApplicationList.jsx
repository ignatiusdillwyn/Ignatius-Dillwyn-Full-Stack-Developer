import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllApplicationsByUserCompanyId } from '../../services/applicationAPI';

const STATUS_STYLES = {
  Applied:     'bg-gray-100 text-gray-700 border-gray-200',
  Reviewing:   'bg-yellow-100 text-yellow-700 border-yellow-200',
  Shortlisted: 'bg-blue-100 text-blue-700 border-blue-200',
  Rejected:    'bg-red-100 text-red-700 border-red-200',
  Accepted:    'bg-green-100 text-green-700 border-green-200',
};

const CompanyApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetchAllApplicationsByUserCompanyId(token);
        setApplications(response.data || []);
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          'Gagal memuat daftar lamaran';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  const formatSalary = (value) => {
    if (!value) return '-';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (value) => {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Filter berdasarkan status & search
  const filtered = applications.filter((app) => {
    const matchStatus = filterStatus === 'All' || app.status === filterStatus;
    const matchSearch =
      !search ||
      app.job_title?.toLowerCase().includes(search.toLowerCase()) ||
      app.company?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Hitung jumlah per status untuk tab counter
  const countByStatus = (status) =>
    status === 'All'
      ? applications.length
      : applications.filter((a) => a.status === status).length;

  const statusTabs = ['All', 'Applied', 'Reviewing', 'Shortlisted', 'Rejected', 'Accepted'];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Daftar Pelamar</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Kelola lamaran yang masuk ke lowongan perusahaan kamu
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Pelamar" value={applications.length} color="blue" />
        <StatCard
          label="Menunggu Review"
          value={applications.filter((a) => a.status === 'Applied' || a.status === 'Reviewing').length}
          color="yellow"
        />
        <StatCard
          label="Shortlisted"
          value={applications.filter((a) => a.status === 'Shortlisted').length}
          color="indigo"
        />
        <StatCard
          label="Diterima"
          value={applications.filter((a) => a.status === 'Accepted').length}
          color="green"
        />
      </div>

      {/* Toolbar: Search + Filter */}
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
            placeholder="Cari berdasarkan judul lowongan atau perusahaan..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
                  ? 'bg-blue-500 text-white'
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

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16 bg-white rounded-xl border border-gray-200">
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

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-gray-700 font-medium mb-1">
            {applications.length === 0 ? 'Belum ada lamaran' : 'Tidak ada hasil'}
          </h3>
          <p className="text-sm text-gray-500">
            {applications.length === 0
              ? 'Lamaran dari pencari kerja akan muncul di sini'
              : 'Coba ubah filter atau kata kunci pencarian'}
          </p>
        </div>
      )}

      {/* Application Cards */}
      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                {/* Left: Job Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="text-base font-semibold text-gray-800 truncate">
                      {app.job_title}
                    </h3>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[app.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-500">
                    <span className="inline-flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {app.location}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatSalary(app.salary)}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {app.job_type}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Dilamar {formatDate(app.createdAt)}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span>Pelamar ID: #{app.user_jobseeker_id}</span>
                  </div>
                </div>

                {/* Right: Action */}
                <div className="flex items-center gap-2 md:flex-shrink-0">
                  <Link
                    to={`/company/application-list-detail/${app.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition"
                  >
                    Lihat Detail
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

// ----- Small helper component -----
const StatCard = ({ label, value, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    green: 'bg-green-50 text-green-600',
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg mb-2 ${colors[color]}`}>
        <span className="text-sm font-bold">{value}</span>
      </div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
};

export default CompanyApplicationList;