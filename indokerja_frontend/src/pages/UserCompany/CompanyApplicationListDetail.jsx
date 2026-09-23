import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  fetchApplicationById,
  updateApplicationById,
} from '../../services/applicationAPI';
import { fetchUserJobSeekerById } from '../../services/userJobSeekerAPI';
import { fetchJobById } from '../../services/jobAPI';

const STATUS_STYLES = {
  Applied:     'bg-gray-100 text-gray-700 border-gray-200',
  Reviewing:   'bg-yellow-100 text-yellow-700 border-yellow-200',
  Shortlisted: 'bg-blue-100 text-blue-700 border-blue-200',
  Rejected:    'bg-red-100 text-red-700 border-red-200',
  Accepted:    'bg-green-100 text-green-700 border-green-200',
};

const STATUS_OPTIONS = [
  { value: 'Applied',     label: 'Applied',     desc: 'Lamaran baru masuk',    color: 'gray'   },
  { value: 'Reviewing',   label: 'Reviewing',   desc: 'Sedang ditinjau',       color: 'yellow' },
  { value: 'Shortlisted', label: 'Shortlisted', desc: 'Masuk daftar kandidat', color: 'blue'   },
  { value: 'Accepted',    label: 'Accepted',    desc: 'Diterima',              color: 'green'  },
  { value: 'Rejected',    label: 'Rejected',    desc: 'Ditolak',               color: 'red'    },
];

const CompanyApplicationListDetail = () => {
  const { id } = useParams();

  const [application, setApplication] = useState(null);   // sudah ter-embed job & jobSeeker
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Update status
  const [selectedStatus, setSelectedStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

  /* ---------- Fetch all data ---------- */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');

        // 1. Fetch application by id
        const appRes = await fetchApplicationById(id, token);
        const app = appRes.data;

        // 2. Fetch jobseeker & job secara paralel
        const [seekerRes, jobRes] = await Promise.all([
          fetchUserJobSeekerById(app.user_jobseeker_id, token).catch(() => ({ data: null })),
          fetchJobById(app.job_id, token).catch(() => ({ data: null })),
        ]);

        // 3. Embed jobSeeker & job ke object application
        const enriched = {
          ...app,
          jobSeeker: seekerRes.data,
          job: jobRes.data,
        };

        setApplication(enriched);
        setSelectedStatus(app.status);
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          'Gagal memuat detail lamaran';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadData();
  }, [id]);

  /* ---------- Format helpers ---------- */
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
      month: 'long',
      year: 'numeric',
    });
  };

  const formatDateTime = (value) => {
    if (!value) return '-';
    return new Date(value).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /* ---------- Update status ---------- */
  const handleUpdateStatus = async () => {
    if (selectedStatus === application.status) {
      setUpdateError('Pilih status yang berbeda dulu');
      return;
    }

    setUpdateError('');
    setUpdateSuccess('');

    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      const res = await updateApplicationById(id, { status: selectedStatus }, token);

      // Update state lokal
      const updated = res.application || { ...application, status: selectedStatus };
      setApplication({
        ...application,
        ...updated,
        jobSeeker: application.jobSeeker,   // pertahankan data yang sudah di-embed
        job: application.job,
      });
      setUpdateSuccess(`Status berhasil diubah menjadi "${selectedStatus}"`);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Gagal mengubah status';
      setUpdateError(message);
    } finally {
      setUpdating(false);
    }
  };

  /* ============ LOADING ============ */
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <p className="text-sm text-gray-500">Memuat detail lamaran...</p>
        </div>
      </div>
    );
  }

  /* ============ ERROR ============ */
  if (error || !application) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-4">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error || 'Lamaran tidak ditemukan'}</span>
          </div>
          <Link
            to="/company/application-list"
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Daftar Pelamar
          </Link>
        </div>
      </div>
    );
  }

  const { jobSeeker, job } = application;

  /* ============ MAIN ============ */
  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <Link
          to="/company/application-list"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Daftar Pelamar
        </Link>

        {/* Alerts */}
        {updateSuccess && (
          <div className="mb-5 flex items-start gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{updateSuccess}</span>
          </div>
        )}
        {updateError && (
          <div className="mb-5 flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{updateError}</span>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-5">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start gap-4 min-w-0">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                {jobSeeker?.username?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-gray-800 truncate">
                  {jobSeeker?.username || `Pelamar #${application.user_jobseeker_id}`}
                </h1>
                <p className="text-sm text-gray-500 truncate">
                  {jobSeeker?.email || 'Email tidak tersedia'}
                </p>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${STATUS_STYLES[application.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}
                  >
                    Status saat ini: {application.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 text-xs text-gray-400 md:text-right">
              <p>Dilamar pada</p>
              <p className="font-medium text-gray-600">
                {formatDateTime(application.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* =============== LEFT =============== */}
          <div className="lg:col-span-2 space-y-5">
            {/* Jobseeker Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4">
                Informasi Pelamar
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem label="Nama" value={jobSeeker?.username || '-'} />
                <InfoItem label="Email" value={jobSeeker?.email || '-'} />
                <InfoItem
                  label="Terdaftar Sejak"
                  value={jobSeeker?.createdAt ? formatDate(jobSeeker.createdAt) : '-'}
                />
                <InfoItem label="ID Pelamar" value={`#${application.user_jobseeker_id}`} />
              </div>
            </div>

            {/* Job Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4">
                Lowongan yang Dilamar
              </h2>
              {job ? (
                <>
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {job.company?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-gray-800 truncate">
                        {job.job_title}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">{job.company}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <InfoItem label="Lokasi" value={job.location || '-'} />
                    <InfoItem label="Gaji" value={formatSalary(job.salary)} />
                    <InfoItem label="Tipe Pekerjaan" value={job.job_type || '-'} />
                    <InfoItem
                      label="Diposting"
                      value={job.createdAt ? formatDate(job.createdAt) : '-'}
                    />
                  </div>

                  {job.job_description && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-1.5">Deskripsi</p>
                      <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                        {job.job_description}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-500">
                  Detail lowongan tidak tersedia (mungkin sudah dihapus).
                </p>
              )}
            </div>
          </div>

          {/* =============== RIGHT =============== */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6 bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-1">
                Ubah Status Lamaran
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                Pilih status baru untuk pelamar ini
              </p>

              <div className="space-y-2 mb-5">
                {STATUS_OPTIONS.map((opt) => {
                  const active = selectedStatus === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                        active
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={opt.value}
                        checked={active}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="sr-only"
                      />
                      <div
                        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                          active ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                        }`}
                      >
                        {active && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-gray-800">
                          {opt.label}
                        </div>
                        <div className="text-xs text-gray-500">{opt.desc}</div>
                      </div>
                    </label>
                  );
                })}
              </div>

              <button
                onClick={handleUpdateStatus}
                disabled={updating || selectedStatus === application.status}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {updating ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Simpan Status
                  </>
                )}
              </button>

              {selectedStatus === application.status && (
                <p className="text-xs text-gray-400 text-center mt-3">
                  Status belum diubah
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ----- Small helper ----- */
const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className="text-sm font-medium text-gray-800 break-words">{value}</p>
  </div>
);

export default CompanyApplicationListDetail;