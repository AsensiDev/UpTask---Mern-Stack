import { Link } from "react-router-dom";

export default function ConfirmAccountView() {


  return (
    <>
      <h1 className="text-5xl font-black text-white">Confirma tu Cuenta</h1>
      <p className="text-2xl font-light text-white mt-5">
        Ingresa el código que recibiste {''}
        <span className=" text-fuchsia-500 font-bold"> por e-mail</span>
      </p>
      <form
        className="space-y-8 p-10 bg-white mt-10"
      >
        <label
          className="font-normal text-2xl text-center block"
        >Código de 6 dígitos</label>

      </form>

      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to='/auth/new-code'
          className="text-center text-gray-300 font-normal"
        >
          Solicitar un nuevo Código
        </Link>
      </nav>

    </>
  )
}