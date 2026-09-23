import { Navigate } from 'react-router-dom';

const JobSeekerUserMiddleware = ({ children }) => {
    const token = localStorage.getItem('token');
    // console.log('middleware: token =', token);
    if (!token) {
        return <Navigate to="/user-jobseeker/login" replace />;
    }

    return <>{children}</>;
};

export default JobSeekerUserMiddleware;