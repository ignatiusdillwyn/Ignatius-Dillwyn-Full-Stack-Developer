import { Navigate } from 'react-router-dom';

const CompanyUserMiddleware = ({ children }) => {
    const token = localStorage.getItem('token');
    // console.log('middleware: token =', token);
    if (!token) {
        return <Navigate to="/user-company/login" replace />;
    }

    return <>{children}</>;
};

export default CompanyUserMiddleware;