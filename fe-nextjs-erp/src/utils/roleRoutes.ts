// src/utils/roleRoutes.ts

export const roleRoutes: { [key: string]: string } = {
  // Jika role user adalah 'users', arahkan ke dashboard
  user: "/dashboard",
  
  // Anda bisa menambahkan role lain di sini jika nanti sistem berkembang
  admin: "/admin/dashboard",
  superadmin: "/superadmin/dashboard",
};