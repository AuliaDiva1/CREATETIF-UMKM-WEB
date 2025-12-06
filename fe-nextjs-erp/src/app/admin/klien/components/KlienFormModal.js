'use client';

import React from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const KlienFormModal = ({ isOpen, onClose, onSubmit, klien, mode }) => {
  // Jika modal tidak terbuka, jangan render apapun
  if (!isOpen) return null;

  const isEdit = mode === 'edit';

  // Default values
  const defaultValues = {
    nama: '',
    email: '',
    password: '',
    no_telp: '',
    alamat: '',
  };

  // Menggabungkan data klien jika ada (handling key lowercase/uppercase dari DB)
  const initialValues = klien ? { 
    nama: klien.nama || klien.NAMA || '',
    email: klien.email || klien.EMAIL || '',
    password: '', // Password selalu kosong saat edit
    no_telp: klien.no_telp || klien.NO_TELP || '',
    alamat: klien.alamat || klien.ALAMAT || '',
  } : defaultValues;

  // Schema Validasi
  const validationSchema = Yup.object({
    nama: Yup.string().required('Nama Lengkap/Perusahaan wajib diisi'),
    email: Yup.string().email('Email tidak valid').required('Email wajib diisi'),
    no_telp: Yup.string().required('No. Telepon wajib diisi'),
    alamat: Yup.string().nullable(),
    // Password hanya wajib saat mode Tambah Baru
    password: !isEdit 
      ? Yup.string().required('Password wajib diisi').min(6, 'Password minimal 6 karakter')
      : Yup.string(),
  });

  // Judul Modal Dinamis
  const title = isEdit
    ? `Edit Klien: ${initialValues.nama}`
    : 'Tambah Klien Baru';

  const handleSubmit = (values, actions) => {
    // Payload data yang akan dikirim
    let payload = {
      nama: values.nama,
      email: values.email,
      no_telp: values.no_telp,
      alamat: values.alamat,
    };

    // Sertakan password hanya jika bukan mode edit
    if (!isEdit) {
      payload.password = values.password;
    }
    
    // Panggil fungsi onSubmit dari parent (untuk proses API)
    onSubmit(payload);
    actions.setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="relative bg-white p-6 rounded-lg shadow-xl" style={{ minWidth: '50vw', maxWidth: '600px' }}>
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
        </div>
        
        {/* Body Form */}
        <div className="py-4">
          <Formik 
            initialValues={initialValues}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, isSubmitting }) => (
              <Form>
                {/* Nama */}
                <div className="mt-3">
                  <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama Lengkap / Perusahaan</label>
                  <input
                    id="nama"
                    name="nama"
                    type="text"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={values.nama}
                    onChange={handleChange}
                    placeholder="Contoh: PT Sukses Makmur"
                  />
                  <ErrorMessage name="nama" component="small" className="text-red-500 text-xs mt-1 block" />
                </div>

                {/* Email */}
                <div className="mt-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (Username Login)</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={values.email}
                    onChange={handleChange}
                    placeholder="email@perusahaan.com"
                  />
                  <ErrorMessage name="email" component="small" className="text-red-500 text-xs mt-1 block" />
                </div>

                {/* Password (Hanya untuk Tambah Baru) */}
                {!isEdit && (
                  <div className="mt-3">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={values.password}
                      onChange={handleChange}
                      placeholder="Minimal 6 karakter"
                    />
                    <ErrorMessage name="password" component="small" className="text-red-500 text-xs mt-1 block" />
                    <p className="text-xs text-gray-500 mt-1">Password digunakan untuk login akun klien ini.</p>
                  </div>
                )}

                {/* No. Telepon */}
                <div className="mt-3">
                  <label htmlFor="no_telp" className="block text-sm font-medium text-gray-700">No. Telepon / WhatsApp</label>
                  <input
                    id="no_telp"
                    name="no_telp"
                    type="text"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={values.no_telp}
                    onChange={handleChange}
                    placeholder="08123456789"
                  />
                  <ErrorMessage name="no_telp" component="small" className="text-red-500 text-xs mt-1 block" />
                </div>

                {/* Alamat */}
                <div className="mt-3">
                  <label htmlFor="alamat" className="block text-sm font-medium text-gray-700">Alamat</label>
                  <textarea
                    id="alamat"
                    name="alamat"
                    rows="3"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={values.alamat}
                    onChange={handleChange}
                    placeholder="Alamat lengkap..."
                  />
                  <ErrorMessage name="alamat" component="small" className="text-red-500 text-xs mt-1 block" />
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <button 
                    type="button" 
                    onClick={onClose} 
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-150"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className={`px-4 py-2 text-sm font-medium text-white rounded-md transition duration-150 ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    {isSubmitting ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Tambah Klien')}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default KlienFormModal;