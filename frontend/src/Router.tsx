import { createBrowserRouter, Navigate } from 'react-router-dom'
import Shell from './components/Shell.tsx'
import { HomePage } from './components/HomePage.tsx'
import { BreakfastPage } from './components/BreakfastPage.tsx'

export const router = () => {
    return createBrowserRouter([
        {
            element: <Shell></Shell>,
            children: [
                {
                    path: '/home',
                    element: <HomePage />
                },
                {
                    path: '/breakfast',
                    element: <BreakfastPage />
                },
                {
                    path: '*',
                    element: <Navigate to="/home" />
                }
            ]
        }
    ])
}
