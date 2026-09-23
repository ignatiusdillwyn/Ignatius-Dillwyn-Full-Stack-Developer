import { createBrowserRouter } from "react-router-dom";
// Layout
import AuthLayout from "../layouts/AuthLayout";
import MainUserCompanyLayout from "../layouts/MainUserCompanyLayout";
import MainUserJobSeekerLayout from "../layouts/MainUserJobSeekerLayout";

//Middleware
import CompanyUserMiddleware from "./CompanyUserMiddleware";
import JobSeekerUserMiddleware from "./JobSeekerUserMiddleware";

//Pages
import CompanyAddJob from "../pages/UserCompany/CompanyAddJob";
import CompanyApplicationList from "../pages/UserCompany/CompanyApplicationList";
import CompanyApplicationListDetail from "../pages/UserCompany/CompanyApplicationListDetail";
import CompanyJobList from "../pages/UserCompany/CompanyJobList";
import CompanyLogin from "../pages/UserCompany/CompanyLogin";
import CompanyRegister from "../pages/UserCompany/CompanyRegister";

import JobSeekerApplicationHistory from "../pages/UserJobSeeker/JobSeekerApplicationHistory";
import JobSeekerJobDetail from "../pages/UserJobSeeker/JobSeekerJobDetail";
import JobSeekerJobList from "../pages/UserJobSeeker/JobSeekerJobList";
import JobSeekerLogin from "../pages/UserJobSeeker/JobSeekerLogin";
import JobSeekerRegister from "../pages/UserJobSeeker/JobSeekerRegister";

const router = createBrowserRouter([
    {
        element: (
            <CompanyUserMiddleware>
                <MainUserCompanyLayout />
            </CompanyUserMiddleware>
        ),
        children: [
            {
                path: "/company/add-job",
                element: <CompanyAddJob />
            },
            {
                path: "/company/home",
                element: <CompanyJobList />
            },
            {
                path: "/company/application-list",
                element: <CompanyApplicationList />
            },
            {
                path: "/company/application-list-detail/:id",
                element: <CompanyApplicationListDetail />
            },
        ],
    },
    {
        element: (
            <JobSeekerUserMiddleware>
                <MainUserJobSeekerLayout />
            </JobSeekerUserMiddleware>
        ),
        children: [
            {
                path: "/jobseeker/job-list",
                element: <JobSeekerJobList />
            },
            {
                path: "/jobseeker/job-detail/:id",
                element: <JobSeekerJobDetail />
            },
            {
                path: "/jobseeker/application-history",
                element: <JobSeekerApplicationHistory />
            },
        ],
    },
    {
        element: <AuthLayout />,
        children: [
            {
                path: "/company/login",
                element: <CompanyLogin />
            },
            {
                path: "/company/register",
                element: <CompanyRegister />
            },
            {
                path: "/jobseeker/login",
                element: <JobSeekerLogin />
            },
            {
                path: "/jobseeker/register",
                element: <JobSeekerRegister />
            },
        ]
    }
],
    // --- PERUBAHAN ADA DI BAGIAN BAWAH INI (KOMA DAN OBJEK KONFIGURASI) ---
    {
        basename: '/'
    }
    // ---------------------------------------------------------------------
)

export default router;