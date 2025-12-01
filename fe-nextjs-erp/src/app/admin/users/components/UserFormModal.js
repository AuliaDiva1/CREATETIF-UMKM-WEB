'use client';

import React from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
// axios (jika digunakan untuk onSubmit) tidak diimpor di sini, tetapi di komponen induk

// 🔄 Daftar Role yang Disisakan
const roles = [
  { label: 'ADMIN', value: 'ADMIN' },
  { label: 'USER', value: 'USER' },
];

const UserFormModal = ({ isOpen, onClose, onSubmit, user, mode }) => {
  // Jika modal tidak terbuka, jangan render apapun
  if (!isOpen) return null;

  const isEdit = mode === 'edit';
  const isLengkapi = mode === 'lengkapi';

  const defaultValues = {
    name: '',
    email: '',
    role: 'USER', // Default role diset ke USER
    password: '',
  };

  const initialValues = user ? { ...defaultValues, ...user } : defaultValues;

  const validationSchema = Yup.object({
    name: Yup.string().required('Nama wajib diisi'),
    email: Yup.string().email('Email tidak valid').required('Email wajib diisi'),
    role: Yup.string().required('Role wajib dipilih'),
    // Password hanya wajib saat mode Tambah User
    password: !isEdit && !isLengkapi ? Yup.string().required('Password wajib diisi') : Yup.string(),
  });

  const title = isEdit
    ? `Edit User: ${user?.name || ''}`
    : isLengkapi
    ? `Lengkapi Data Diri: ${user?.name || ''}`
    : 'Tambah User';

  const handleSubmit = (values, actions) => {
    // Payload hanya mencakup field dasar
    let payload = {
      name: values.name,
      email: values.email,
      role: values.role,
    };

    if (!isEdit && !isLengkapi) {
      payload.password = values.password;
    }
    
    // Panggil fungsi onSubmit yang diteruskan dari komponen induk (misalnya untuk memanggil API)
    onSubmit(payload);
    actions.setSubmitting(false);
  };


  // 📝 Pengganti komponen Dialog PrimeReact dengan modal native/Tailwind-like
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="relative bg-white p-6 rounded-lg shadow-xl" style={{ minWidth: '50vw' }}>
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        
        {/* Body Form */}
        <div className="py-4">
          <Formik 
            initialValues={initialValues}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, setFieldValue, isSubmitting }) => (
              <Form>
                {/* Nama */}
                <div className="mt-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={values.name}
                    onChange={handleChange}
                  />
                  <ErrorMessage name="name" component="small" className="text-red-500 text-xs mt-1 block" />
                </div>

                {/* Email */}
                <div className="mt-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={values.email}
                    onChange={handleChange}
                  />
                  <ErrorMessage name="email" component="small" className="text-red-500 text-xs mt-1 block" />
                </div>

                {/* Password (Hanya untuk Tambah User) */}
                {!isEdit && !isLengkapi && (
                  <div className="mt-3">
                    <label htmlFor="password">Password</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={values.password}
                      onChange={handleChange}
                    />
                    <ErrorMessage name="password" component="small" className="text-red-500 text-xs mt-1 block" />
                  </div>
                )}

                {/* Role Dropdown */}
                <div className="mt-3">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    id="role"
                    name="role"
                    value={values.role}
                    onChange={(e) => setFieldValue('role', e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Select Role"
                    // Menonaktifkan Dropdown jika ini mode 'Lengkapi' dan role sudah ditentukan
                    disabled={isLengkapi && user?.role}
                  >
                    {/* Opsi default kosong dihilangkan jika Anda ingin role selalu terpilih */}
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                  <ErrorMessage name="role" component="small" className="text-red-500 text-xs mt-1 block" />
                </div>

                {/* 🗑️ Dynamic Fields telah dihapus */}

                {/* Footer Buttons */}
                <div className="flex justify-end gap-2 mt-5 pt-3 border-t">
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
                    className={`px-4 py-2 text-sm font-medium text-white rounded-md transition duration-150 ${isSubmitting ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'}`}
                  >
                    {isEdit ? 'Update' : isLengkapi ? 'Simpan Data' : 'Simpan'}
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

export default UserFormModal;