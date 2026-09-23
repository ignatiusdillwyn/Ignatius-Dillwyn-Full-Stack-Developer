import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchJobById } from '../../services/jobAPI';
import { addApplication } from '../../services/applicationAPI';

const JOB_TYPE_STYLES = {
  'Full-time':  'bg-green-100 text-green-700 border-green-200',
  'Part-time':  'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Contract':   'bg-blue-100 text-blue-700 border-blue-200',
  'Internship': 'bg-purple-100 text-purple-700 border-purple-200',
  'Freelance':  'bg-pink-100 text-pink-700 border-pink-200',
  'Remote':     'bg-indigo-100 text-indigo-700 border-indigo-200',
};

const JobSeekerJobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        const response = await fetchJobById(id, token);
        setJob(response.data);
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          'Gagal memuat detail lowongan';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadJob();
  }, [id]);

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

  const handleApply = async () => {
    setApplyError('');

    try {
      setApplying(true);

      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      const payload = {
        job_id: Number(job.id),
        user_jobseeker_id: user.id,
        status: 'Applied',
      };

      await addApplication(payload, token);

      setApplySuccess(true);
      setShowConfirm(false);

      // Auto-redirect ke history setelah 2 detik
      setTimeout(() => {
        navigate('/jobseeker/application-history');
      }, 2000);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Gagal melamar pekerjaan ini';
      setApplyError(message);
      setShowConfirm(false);
    } finally {
      setApplying(false);
    }
  };

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-purple-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <p className="text-sm text-gray-500">Memuat detail lowongan...</p>
        </div>
      </div>
    );
  }

  /* ---------- Error ---------- */
  if (error || !job) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-4">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error || 'Lowongan tidak ditemukan'}</span>
          </div>
          <Link
            to="/jobseeker/job-list"
            className="inline-flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Daftar Lowongan
          </Link>
        </div>
      </div>
    );
  }

  /* ---------- Main Content ---------- */
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <Link
          to="/jobseeker/job-list"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Daftar Lowongan
        </Link>

        {/* Success Alert */}
        {applySuccess && (
          <div className="mb-5 flex items-start gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              Lamaran berhasil dikirim! Mengalihkan ke riwayat lamaran...
            </span>
          </div>
        )}

        {/* Apply Error */}
        {applyError && (
          <div className="mb-5 flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{applyError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ============ LEFT: Main Info ============ */}
          <div className="lg:col-span-2 space-y-5">
            {/* Header Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                  {job.company?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl font-bold text-gray-800 mb-1">
                    {job.job_title}
                  </h1>
                  <p className="text-sm text-gray-500">{job.company}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${JOB_TYPE_STYLES[job.job_type] || 'bg-gray-100 text-gray-700 border-gray-200'}`}
                >
                  {job.job_type}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {job.location}
                </span>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Gaji</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {formatSalary(job.salary)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Diposting</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {formatDate(job.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Deskripsi Pekerjaan
              </h2>
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line leading-relaxed">
                {job.job_description}
              </div>
            </div>
          </div>

          {/* ============ RIGHT: Sticky Sidebar ============ */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6 space-y-4">
              {/* Apply Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <p className="text-xs text-gray-500 mb-1">Gaji yang ditawarkan</p>
                <p className="text-xl font-bold text-gray-800 mb-4">
                  {formatSalary(job.salary)}
                </p>

                <button
                  onClick={() => setShowConfirm(true)}
                  disabled={applySuccess || applying}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-sm"
                >
                  {applySuccess ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Sudah Dilamar
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Lamar Sekarang
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center mt-3">
                  Pastikan profilmu sudah lengkap sebelum melamar
                </p>
              </div>

              {/* Company Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Tentang Perusahaan
                </h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                    {job.company?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{job.company}</p>
                    <p className="text-xs text-gray-500">Perusahaan</p>
                  </div>
                </div>
              </div>

              {/* Share (opsional) */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Bagikan Lowongan
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ Confirm Modal ============ */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={() => !applying && setShowConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-1">
                  Lamar pekerjaan ini?
                </h3>
                <p className="text-sm text-gray-500">
                  Kamu akan melamar posisi <span className="font-medium text-gray-700">{job.job_title}</span> di <span className="font-medium text-gray-700">{job.company}</span>.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={applying}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 transition"
              >
                Batal
              </button>
              <button
                onClick={handleApply}
                disabled={applying}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-60 transition"
              >
                {applying ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Mengirim...
                  </>
                ) : (
                  'Ya, Lamar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSeekerJobDetail;