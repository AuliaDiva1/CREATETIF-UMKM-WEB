"use client";

import React, { useEffect, useState } from "react";
import {
  CircleDollarSign,
  ListChecks,
  CheckCircle,
  Clock,
  ChevronRight,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const useRouter = () => ({
  push: (path) => {
    console.warn(`Redirect to: ${path}`);
  },
});

const SectionTitle = ({ title, paragraph, center, mb }) => (
  <div
    className={`w-full ${center ? "mx-auto text-center" : "text-left"} ${
      mb || "mb-10"
    }`}
  >
    <h2 className="mb-3 text-3xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
      {title}
    </h2>
    <p className="text-base text-gray-500">{paragraph}</p>
  </div>
);

const SkeletonCard = () => (
  <div className="rounded-xl border bg-white p-6 shadow-sm h-full animate-pulse">
    <div className="flex items-center space-x-5">
      <div className="h-12 w-12 rounded bg-gray-200"></div>
      <div>
        <div className="h-4 w-28 bg-gray-200 rounded mb-3"></div>
        <div className="h-6 w-36 bg-gray-300 rounded"></div>
      </div>
    </div>
  </div>
);

const SkeletonProjectRow = () => (
  <div className="rounded-xl border bg-white p-6 shadow-sm animate-pulse">
    <div className="h-6 w-2/3 bg-gray-200 rounded mb-4"></div>
    <div className="h-3 w-full bg-gray-200 rounded mb-3"></div>
    <div className="h-10 w-40 bg-gray-300 rounded"></div>
  </div>
);

const getStatusClasses = (progress) => {
  if (progress === 100) {
    return {
      text: "bg-green-100 text-green-700",
      border: "border-l-green-500",
      bar: "bg-green-500",
    };
  }
  if (progress >= 80) {
    return {
      text: "bg-indigo-100 text-indigo-700",
      border: "border-l-indigo-500",
      bar: "bg-indigo-500",
    };
  }
  return {
    text: "bg-yellow-100 text-yellow-700",
    border: "border-l-yellow-500",
    bar: "bg-yellow-500",
  };
};

const SummaryCard = ({ icon: Icon, title, value, className }) => (
  <div className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md">
    <div className="flex items-center space-x-5">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded ${className}`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase">
          {title}
        </p>
        <p className="text-2xl font-semibold text-gray-900 mt-1">
          {value}
        </p>
      </div>
    </div>
  </div>
);

const DashboardPage = () => {
  const router = useRouter();

  const [userName, setUserName] = useState("Client");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [activeProjects, setActiveProjects] = useState([]);

  const fetchDashboardData = async (username, token) => {
    const apiUrl = `${API_BASE_URL}/dashboard-klien/klien/username/${username}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      router.push("/signin");
      return null;
    }

    if (!response.ok) {
      throw new Error("Gagal mengambil data dashboard");
    }

    const result = await response.json();
    return result.data;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("USER_NAME");

    if (!token || !storedName) {
      router.push("/signin");
      return;
    }

    setUserName(storedName);

    const loadData = async () => {
      try {
        const data = await fetchDashboardData(storedName, token);
        if (data) {
          setSummary(data.summary);
          setActiveProjects(data.activeProjects || []);
          setError(null);
        }
      } catch (err) {
        setError("Dashboard data could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const dashSummary = summary || {
    totalProjek: 0,
    totalNilaiProjek: "Rp0",
    proyekSelesai: 0,
    proyekInProgress: 0,
  };

  const cards = [
    {
      icon: ListChecks,
      title: "Total Projects",
      value: dashSummary.totalProjek,
      className: "bg-indigo-600",
    },
    {
      icon: CircleDollarSign,
      title: "Total Project Value",
      value: dashSummary.totalNilaiProjek,
      className: "bg-teal-600",
    },
    {
      icon: CheckCircle,
      title: "Completed Projects",
      value: dashSummary.proyekSelesai,
      className: "bg-green-600",
    },
    {
      icon: Clock,
      title: "Projects In Progress",
      value: dashSummary.proyekInProgress,
      className: "bg-amber-500",
    },
  ];

  return (
    <section className="pt-24 pb-16 px-6">

      <div className="mb-10">
        <div className="rounded-xl bg-slate-800 p-8 text-white shadow-sm">
          <h1 className="text-3xl font-semibold">Welcome, {userName}</h1>
          <p className="mt-2 text-base text-slate-300">
            Client project monitoring dashboard.
          </p>
        </div>
      </div>

      <SectionTitle
        title="Account Summary"
        paragraph={`Overview as of ${new Date().toLocaleDateString("id-ID")}`} center={undefined} mb={undefined}      />

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4 mb-12">
        {loading
          ? [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
          : cards.map((card, index) => (
              <SummaryCard key={index} {...card} />
            ))}
      </div>

      <SectionTitle
        title="Active Projects"
        paragraph="Ongoing project execution and progress status." center={undefined} mb={undefined}      />

      <div className="flex flex-col gap-6">
        {loading ? (
          [1, 2, 3].map((i) => <SkeletonProjectRow key={i} />)
        ) : error ? (
          <div className="p-6 rounded border bg-red-50 text-base text-red-600">
            {error}
          </div>
        ) : activeProjects.length > 0 ? (
          activeProjects.map((project) => {
            const progressValue = parseInt(
              project.progress.replace("%", ""),
              10
            );
            const { text, border, bar } =
              getStatusClasses(progressValue);

            return (
              <div
                key={project.id}
                className={`rounded-xl border border-l-4 ${border} bg-white p-6 shadow-sm`}
              >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {project.nama}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className={`rounded px-3 py-1 ${text}`}>
                        {progressValue === 100
                          ? "Completed"
                          : "In Progress"}
                      </span>

                      <span className="text-teal-600 font-medium">
                        Value: {project.nilai}
                      </span>

                      <span>
                        Due Date:{" "}
                        <span className="font-medium text-gray-900">
                          {project.targetSelesai}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="w-full sm:w-1/3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">
                        Progress
                      </span>
                      <span className="font-semibold text-indigo-600">
                        {project.progress}
                      </span>
                    </div>

                    <div className="h-3 w-full rounded-full bg-gray-200 mb-4">
                      <div
                        className={`h-3 rounded-full ${bar}`}
                        style={{ width: project.progress }}
                      ></div>
                    </div>

                    <a
                      href={`/dashboard/projects/${project.id}`}
                      className="inline-flex w-full items-center justify-center rounded bg-indigo-600 px-4 py-2 text-base font-medium text-white hover:bg-indigo-700"
                    >
                      View Details
                      <ChevronRight className="w-5 h-5 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 rounded-lg border bg-gray-50 text-base text-gray-500">
            No active projects available.
          </div>
        )}
      </div>
    </section>
  );
};

export default DashboardPage;
