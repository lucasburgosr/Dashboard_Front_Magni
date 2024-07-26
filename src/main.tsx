import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { AtributosContextProvider } from './context/AtributosContext'
import { EmpresasContextProvider } from './context/EmpresasContext'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { Auth0ProviderWithNavigate } from './componentes/auth0/Auth0ProviderWithNavigate'
import { SucursalesContextProvider } from './context/SucursalesContext'
import { EmpleadoContextProvider } from './context/EmpleadoContext'
import LoaderPage from './componentes/loaderPage/LoaderPage'

ReactDOM.createRoot(document.getElementById('root')!).render(

  <React.StrictMode>
      <Suspense fallback={<LoaderPage></LoaderPage>}>
      <BrowserRouter>
        <Auth0ProviderWithNavigate>
        <EmpresasContextProvider>
        <SucursalesContextProvider>
        <EmpleadoContextProvider>
        <AtributosContextProvider>

          <App />
          
        </AtributosContextProvider>
        </EmpleadoContextProvider>
        </SucursalesContextProvider>
        </EmpresasContextProvider>
        </Auth0ProviderWithNavigate>
      </BrowserRouter>
      </Suspense>
  </React.StrictMode>,
)
