import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import {Routes, Route} from 'react-router-dom'
import AddAns from './admin/addAns.jsx'
import RootLayout from './components/RootLayout.jsx'
import AddSub from './admin/addSub.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<RootLayout />} >
        <Route index element={<App />} />
        <Route path="profile" element={<App />} />
        <Route path="add-ans" element={<AddAns />} />
        <Route path="add-sub" element={<AddSub />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
