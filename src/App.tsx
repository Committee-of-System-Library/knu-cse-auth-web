import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Router } from './Router';
import './global.css';

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Router />
            </AuthProvider>
        </BrowserRouter>
    );
}