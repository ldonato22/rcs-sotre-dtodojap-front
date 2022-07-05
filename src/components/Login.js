import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    return <button className='md:ml-8 btn btn-primary btn-md' style={{ width: "100px" }} onClick={ () => loginWithRedirect() }>INGRESAR</button>
}