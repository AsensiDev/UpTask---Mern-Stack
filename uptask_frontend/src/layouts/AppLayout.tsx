import { Outlet, Link, Navigate } from "react-router-dom"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Logo from "@/components/Logo"
import { useAuth } from "@/hooks/useAuth"
import NavMenu from "@/components/NavMenu"

export default function AppLayout() {

    const { data, isError, isLoading } = useAuth()

    if(isLoading) return 'Cargando...'
    if(isError) {
        return <Navigate to='/auth/login' />
    }

  if(data) return (
    <>
        <header className="bg-gray-800 py-5">
            <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row justify-between items-center ">
                <div className="w-64">
                    <Link to={'/'}>
                        <Logo />
                    </Link>
                </div>
                
                <NavMenu 
                    name={data.name}
                />
            </div>
        </header>

        <section className="max-w-screen-2xl mx-auto mt-10 p-5">
            <Outlet/>
        </section>

        <footer className="py-5">
            <p className="text-center">
                Todos los derechos reservados {new Date().getFullYear()}
            </p>
        </footer>
    
        <ToastContainer />
    </>
    
  )
}
