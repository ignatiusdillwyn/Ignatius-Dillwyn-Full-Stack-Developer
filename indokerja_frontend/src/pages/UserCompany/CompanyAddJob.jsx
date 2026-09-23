import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { addJob } from '../../services/jobAPI';

const JOB_TYPE_OPTIONS = [
  { value: 'Full-time', label: 'Full-time', desc: 'Kerja penuh waktu' },
  { value: 'Part-time', label: 'Part-time', desc: 'Paruh waktu' },
  { value: 'Contract', label: 'Contract', desc: 'Kontrak' },
];

const CompanyAddJob = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    job_title: '',
    location: '',
    salary: '',
    job_type: '',
    job_description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const validate = () => {
    if (!form.job_title.trim()) return 'Judul lowongan wajib diisi';
    if (form.job_title.trim().length < 3) return 'Judul lowongan minimal 3 karakter';

    if (!form.location.trim()) return 'Lokasi wajib diisi';

    if (!form.salary) return 'Gaji wajib diisi';
    const salaryNum = Number(form.salary);
    if (isNaN(salaryNum) || salaryNum < 0) return 'Gaji harus berupa angka positif';

    if (!form.job_type) return 'Tipe pekerjaan wajib dipilih';

    if (!form.job_description.trim()) return 'Deskripsi pekerjaan wajib diisi';
    if (form.job_description.trim().length < 10) {
      return 'Deskripsi minimal 10 karakter';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      const payload = {
        job_title: form.job_title.trim(),
        location: form.location.trim(),
        salary: Number(form.salary),
        job_type: form.job_type,
        job_description: form.job_description.trim(),
      };

      await addJob(payload, token);

      setSuccess('Lowongan berhasil ditambahkan!');

      // Redirect ke job list setelah 1.5 detik
      setTimeout(() => {
        navigate('/company/home');
      }, 1500);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Gagal menambahkan lowongan';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      job_title: '',
      location: '',
      salary: '',
      job_type: '',
      job_description: '',
    });
    setError('');
    setSuccess('');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/company/home"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-3 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Daftar Lowongan
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Tambah Lowongan</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Isi detail lowongan kerja yang ingin kamu posting
        </p>
      </div>

      {/* Card Form */}
      <div className="max-w-2xl bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
        {/* Success Alert */}
        {success && (
          <div className="mb-5 flex items-start gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-5 flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Job Title */}
          <div>
            <label htmlFor="job_title" className="block text-sm font-medium text-gray-700 mb-1.5">
              Judul Lowongan <span className="text-red-500">*</span>
            </label>
            <input
              id="job_title"
              name="job_title"
              type="text"
              value={form.job_title}
              onChange={handleChange}
              placeholder="Contoh: Backend Developer"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Location & Salary (2 kolom di layar md) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1.5">
                Lokasi <span className="text-red-500">*</span>
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={form.location}
                onChange={handleChange}
                placeholder="Jakarta"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1.5">
                Gaji (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                id="salary"
                name="salary"
                type="number"
                min="0"
                value={form.salary}
                onChange={handleChange}
                placeholder="8000000"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              {form.salary && !isNaN(Number(form.salary)) && (
                <p className="text-xs text-gray-500 mt-1">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  }).format(Number(form.salary))}
                </p>
              )}
            </div>
          </div>

          {/* Job Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipe Pekerjaan <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {JOB_TYPE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`relative flex items-start gap-3 p-3.5 rounded-lg border-2 cursor-pointer transition ${
                    form.job_type === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="job_type"
                    value={option.value}
                    checked={form.job_type === option.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div
                    className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                      form.job_type === option.value
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {form.job_type === option.value && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{option.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label htmlFor="job_description" className="block text-sm font-medium text-gray-700 mb-1.5">
              Deskripsi Pekerjaan <span className="text-red-500">*</span>
            </label>
            <textarea
              id="job_description"
              name="job_description"
              rows={6}
              value={form.job_description}
              onChange={handleChange}
              placeholder="Jelaskan tanggung jawab, kualifikasi, dan benefit dari posisi ini..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-y"
            />
            <p className="text-xs text-gray-400 mt-1">
              {form.job_description.length} karakter
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading ? (
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
                  Simpan Lowongan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyAddJob;