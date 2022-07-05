import homevideo from "../homevideo.mp4"

const HomeApp = () => {
    return (
        <>
            <div className='column p-4'>
                <div className='fs-3 fw-bold'>NOS ENCONTRAS EN...</div>
                <a className="md:ml-8 btn btn-outline-success btn-lg btn-block" href="https://wa.me/595981252022?text=Hola%2C%20como%20estas%3F%20Queria%20saber%20si%20tenes%20un%20repuesto."><i className="bi bi-whatsapp"/> Whatsapp</a>
                <a className="md:ml-8 btn btn-outline-success btn-lg btn-block" href="https://instagram.com/dtodo.japoneses?igshid=YmMyMTA2M2Y="><i className="bi bi-instagram"/> Instagram</a>
                <a className="md:ml-8 btn btn-outline-success btn-lg btn-block" href="https://goo.gl/maps/A45PP7zFEHEtfZPd6"><i className="bi bi-pin-map-fill"/> Google Maps</a>
            </div>
            <div className='row'>
                <video style={{ width: '100%' }} src={homevideo} autoPlay loop muted />
            </div>
        </>
    )
}

export default HomeApp