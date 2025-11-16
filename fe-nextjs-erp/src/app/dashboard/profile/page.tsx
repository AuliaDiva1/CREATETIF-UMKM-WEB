"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";

const ProfilePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Client");
  const [userEmail, setUserEmail] = useState("client@example.com");

  // Cek Token & ambil data (misalnya dari localStorage)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("USER_NAME");
    // Asumsi email juga tersimpan atau didapat dari API
    // const storedEmail = localStorage.getItem("USER_EMAIL");

    if (!token) {
      router.push("/signin");
    } else {
      if (storedName) setUserName(storedName);
      // if (storedEmail) setUserEmail(storedEmail);
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center pt-[120px]">
        Loading Profile...
      </div>
    );
  }

  return (
    <>
      <Breadcrumb
        pageName="My Profile"
        description="Kelola informasi akun dan ganti password Anda."
      />

      <section className="pb-16 md:pb-20 lg:pb-28">
        <div className="container">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            
            {/* --- KARTU PROFILE INFORMATION --- */}
            <div className="rounded-md border border-stroke bg-white p-8 shadow-three dark:border-transparent dark:bg-[#2C303B] dark:shadow-two">
              <h3 className="mb-6 text-2xl font-bold text-black dark:text-white">
                Profile Information
              </h3>
              <form>
                <div className="mb-6">
                  <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your Full Name"
                    className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-md border bg-[#f8f8f8] px-6 py-3 text-base outline-none transition-all duration-300 dark:border-transparent dark:bg-dark-2 dark:focus:shadow-none"
                  />
                </div>
                <div className="mb-6">
                  <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    disabled
                    className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-md border bg-gray-light px-6 py-3 text-base outline-none transition-all duration-300 dark:border-transparent dark:bg-dark-2 dark:focus:shadow-none"
                  />
                  <p className="mt-2 text-xs text-body-color">
                    Email cannot be changed.
                  </p>
                </div>
                <button
                  type="submit"
                  className="shadow-submit dark:shadow-submit-dark rounded-md bg-primary px-9 py-3 text-base font-medium text-white duration-300 hover:bg-primary/90"
                >
                  Save Changes
                </button>
              </form>
            </div>

            {/* --- KARTU CHANGE PASSWORD --- */}
            <div className="rounded-md border border-stroke bg-white p-8 shadow-three dark:border-transparent dark:bg-[#2C303B] dark:shadow-two">
              <h3 className="mb-6 text-2xl font-bold text-black dark:text-white">
                Change Password
              </h3>
              <form>
                <div className="mb-6">
                  <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter Current Password"
                    className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-md border bg-[#f8f8f8] px-6 py-3 text-base outline-none transition-all duration-300 dark:border-transparent dark:bg-dark-2 dark:focus:shadow-none"
                  />
                </div>
                <div className="mb-6">
                  <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter New Password"
                    className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-md border bg-[#f8f8f8] px-6 py-3 text-base outline-none transition-all duration-300 dark:border-transparent dark:bg-dark-2 dark:focus:shadow-none"
                  />
                </div>
                <div className="mb-6">
                  <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-md border bg-[#f8f8f8] px-6 py-3 text-base outline-none transition-all duration-300 dark:border-transparent dark:bg-dark-2 dark:focus:shadow-none"
                  />
                </div>
                <button
                  type="submit"
                  className="shadow-submit dark:shadow-submit-dark rounded-md bg-primary px-9 py-3 text-base font-medium text-white duration-300 hover:bg-primary/90"
                >
                  Change Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfilePage;