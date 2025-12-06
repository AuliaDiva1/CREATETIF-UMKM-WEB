'use client';

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

// Menggunakan Environment Variable sesuai permintaan
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const KlienForm = ({ isOpen, onClose, data, onSuccess }) => {
  // Jika modal tidak terbuka, jangan render apapun
  if (!isOpen) return null;

  // Cek apakah mode Edit atau Tambah Baru berdasarkan ada/tidaknya data
  const isEditMode = !!data?.KLIEN_ID;

  const initialValues = {
    nama: data?.NAMA || '',
    email: data?.EMAIL || '',
    password: '', // Password kosong saat inisialisasi
    no_telp: data?.NO_TELP || '',
    alamat: data?.ALAMAT || '',
  };

  // Schema Validasi dengan Yup
  const validationSchema = Yup.object({
    nama: Yup.string().required('Nama wajib diisi'),
    email: Yup.string().email('Email tidak valid').required('Email wajib diisi'),
    no_telp: Yup.string().required('No. Telepon wajib diisi'),
    // Password wajib diisi HANYA jika mode Tambah Baru (!isEditMode)
    password: isEditMode 
      ? Yup.string().nullable() 
      : Yup.string().required('Password wajib diisi').min(6, 'Password minimal 6 karakter'),
    alamat: Yup.string().nullable(),
  });

  const handleSubmit = async (values, actions) => {
    try {
      if (isEditMode) {
        // --- LOGIKA EDIT ---
        // Hapus password dari payload update karena controller updateKlien tidak menerima password
        const { password, ...updatePayload } = values;
        
        // Menggunakan API_URL + endpoint '/klien'
        await axios.put(`${API_URL}/klien/${data.KLIEN_ID}`, updatePayload);
        alert('Data klien berhasil diperbarui!');
      } else {
        // --- LOGIKA TAMBAH ---
        await axios.post(`${API_URL}/klien`, values);
        alert('Klien baru berhasil ditambahkan!');
      }

      // Refresh data di parent component
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || "Terjadi kesalahan";
      alert(`Gagal: ${msg}`);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="relative bg-white p-6 rounded-lg shadow-xl" style={{ minWidth: '50vw', maxWidth: '600px' }}>
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditMode ? `Edit Klien: ${data?.NAMA}` : 'Tambah Klien Baru'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
        </div>
        
        {/* Body Form */}
        <div className="py-4">
          <Formik 
            initialValues={initialValues} 
            validationSchema={validationSchema} 
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form>
                {/* Nama */}
                <div className="mb-4">
                  <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama Lengkap / Perusahaan</label>
                  <Field
                    id="nama"
                    name="nama"
                    type="text"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: PT Sukses Makmur"
                  />
                  <ErrorMessage name="nama" component="small" className="text-red-500 text-xs mt-1 block" />
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (Username Login)</label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="email@perusahaan.com"
                  />
                  <ErrorMessage name="email" component="small" className="text-red-500 text-xs mt-1 block" />
                </div>

                {/* Password (Hanya muncul saat Tambah Baru) */}
                {!isEditMode && (
                  <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Minimal 6 karakter"
                    />
                    <ErrorMessage name="password" component="small" className="text-red-500 text-xs mt-1 block" />
                    <p className="text-xs text-gray-500 mt-1">Password digunakan untuk login akun klien ini.</p>
                  </div>
                )}

                {/* No Telp */}
                <div className="mb-4">
                  <label htmlFor="no_telp" className="block text-sm font-medium text-gray-700">No. Telepon / WhatsApp</label>
                  <Field
                    id="no_telp"
                    name="no_telp"
                    type="text"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="08123456789"
                  />
                  <ErrorMessage name="no_telp" component="small" className="text-red-500 text-xs mt-1 block" />
                </div>

                {/* Alamat */}
                <div className="mb-4">
                  <label htmlFor="alamat" className="block text-sm font-medium text-gray-700">Alamat</label>
                  <Field
                    as="textarea"
                    id="alamat"
                    name="alamat"
                    rows="3"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                    {isSubmitting ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Tambah Klien')}
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

export default KlienForm;