// src/App.jsx
import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// Import your page/layout components
import MainLayout from '@/layout/MainLayout'
import Hero from '@/pages/student/Hero'
import Login from '@/pages/Login'
import Courses from './pages/student/Courses'
import MyLearning from './pages/student/MyLearning'
import Profile from './pages/student/Profile'
import Sidebar from './pages/instructor/Sidebar'
import Dashboard from './pages/instructor/Dashboard'
import CourseTable from './pages/instructor/course/CourseTable'
import CreateCourse from './pages/instructor/course/CreateCourse'
import UpdateCourse from './pages/instructor/course/UpdateCourse'
import CreateLecture from './pages/instructor/lecture/CreateLecture'
import UpdateLecture from './pages/instructor/lecture/UpdateLecture'
import CourseDetails from './pages/student/CourseDetails'
import CourseProgress from './pages/student/CourseProgress'
import SearchPages from './pages/student/SearchPages'
import { AdminRoute, AuthenticatedUser, ProtectedRoutes } from './components/ProtectedRoutes'
import { ProtectedPurchaseRoutes } from './components/ProtectedPurchaseRoutes'
import { ThemeProvider } from './components/ThemeProvider'

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: (
          <>
            <Hero />
            <Courses />

          </>
        )
      },
      {
        path: 'login',
        element: (<AuthenticatedUser><Login /></AuthenticatedUser>)
      },
      {
        path: 'my-learning',
        element: (<ProtectedRoutes><MyLearning /></ProtectedRoutes>)
      },
      {
        path: 'profile',
        element: (<ProtectedRoutes><Profile /></ProtectedRoutes>)
      },
      {
        path: 'course/search',
        element: <SearchPages />
      },
      {
        path: 'course-details/:courseId',
        element: (<ProtectedRoutes><CourseDetails /></ProtectedRoutes>)
      },
      {
        path: 'course-progress/:courseId',
        element: (
          <ProtectedRoutes>
            <ProtectedPurchaseRoutes>
              <CourseProgress />
            </ProtectedPurchaseRoutes>
          </ProtectedRoutes>
        )
      },

      // Admin Routes

      {
        path: "admin",
        element: (<AdminRoute><Sidebar /></AdminRoute>),
        children: [
          {
            path: "dashboard",
            element: <Dashboard />
          },
          {
            path: "course",
            element: <CourseTable />
          },
          {
            path: "course/create",
            element: <CreateCourse />
          },
          {
            path: "course/:courseId",
            element: <UpdateCourse />
          },
          {
            path: "course/:courseId/lecture",
            element: <CreateLecture />
          },
          {
            path: "course/:courseId/lecture/:lectureId",
            element: <UpdateLecture />
          },
        ]
      }
    ],
  }
])

const App = () => {
  return (
    <main>
      <ThemeProvider>
        <RouterProvider router={appRouter} />
      </ThemeProvider>
    </main>
  )
}

export default App
