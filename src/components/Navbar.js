import { useAuth0 } from "@auth0/auth0-react";
import { LoginButton } from "./Login";
import { LogoutButton } from "./Logout";
import logo from "../logo.png";

const Nav = () => {

    const { isAuthenticated, isLoading } = useAuth0();

    let Links =[
        {name:"REPORTE",link:"/report"},
        {name:"INVENTARIO",link:"/inventory"},
        {name:"ENTRADA",link:"/income"},
        {name:"VENTA",link:"/expenses"},
    ];

    if (isLoading) {
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light p-3">
                <div className="container-fluid">
                    <div className="flex-row">
                        <a className="navbar-brand" href="/">
                            <img src={logo} alt="logo"/>
                        </a>
                    </div>
                </div>
                <div className='text-xl text-gray-800 flex-row-reverse'>LOADING...</div>
            </nav>
        )
    }

    return (

    <nav className="navbar navbar-expand-lg navbar-light bg-light p-3">
    <div className="container-fluid">
        <div className="flex-row">
            <a className="navbar-brand" href="/">
                <img src={logo} alt="logo"/>
            </a>
        </div>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse flex-row-reverse" id="navbarSupportedContent">
            <div>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {isAuthenticated ? (
                            <>
                                {Links.map((link)=>(
                                    <li key={link.name} className='nav-item md:ml-8 text-xl md:my-0 my-7'>
                                        <a href={link.link} className='nav-link text-gray-800 hover:text-gray-400 duration-500'>{link.name}</a>
                                    </li>
                                ))}
                                <LogoutButton />
                            </>
                        ) : <LoginButton />
                        }
                </ul>
            </div>
        </div>
    </div>
    </nav>)
}

export default Nav