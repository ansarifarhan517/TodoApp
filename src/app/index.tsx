import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import '../sass/global.scss'
import { HocForm } from '@components'
import { useTypedSelector } from '@redux/rootReducer'

const LoginApp = lazy(async () => {
  const { LoginApp, options } = await import(/* webpackChunkName: "loginApp" */ './login-app')
  return HocForm(LoginApp, options)
})

const SignupApp = lazy(async () => {
  const { SignupApp, options } = await import(/* webpackChunkName: "loginApp" */ './signup-app')
  return HocForm(SignupApp, options)
})

const BrowseApp = lazy(async () =>
  await import(/* webpackChunkName: "browseApp" */ './browse-app'),
)

const App: React.FC = () => {
  const sessionInfo = useTypedSelector(state => state.App.sessionInfo)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router basename="/">

        <Routes>
          {sessionInfo?.userId ? (
            <>
              {/* Private routes, for logged-in users */}
              <Route path="*" element={<BrowseApp />} />
            </>
          ) : (
            <>
              {/* Public routes for unauthenticated users */}
              <Route path="/login" element={<LoginApp />} />
              <Route path="/signup" element={<SignupApp />} />

              {/* Redirect all other paths to /login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </Router>
    </Suspense>
  )
}

export default App
