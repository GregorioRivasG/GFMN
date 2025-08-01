import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/PerfilDetallePage.css';
const PerfilDetallePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [perfil, setPerfil] = useState(null);
    useEffect(() => {
        const perfiles = JSON.parse(localStorage.getItem('perfiles') || '[]');
        const encontrado = perfiles.find((p) => p.id === id);
        if (encontrado) {
            setPerfil(encontrado);
        }
        else {
            alert('Perfil no encontrado');
            navigate('/usuario');
        }
    }, [id, navigate]);
    if (!perfil)
        return null;
    return (<div className="perfil-detalle-container">
      <Navbar />
      
      <div className="perfil-detalle-box">
        {perfil.fotoUrl ? (<img src={perfil.fotoUrl} alt="perfil" className="perfil-img"/>) : (<div className="perfil-icono">👤</div>)}
        <div><br /><br /><br /><br /></div>
        <h2>{perfil.nombre}</h2>
        <p><strong>Correo:</strong> {perfil.correo}</p>
        <p><strong>Contraseña:</strong> ******</p>
        <button onClick={() => navigate('/usuario')}>Volver</button>
      </div>
    </div>);
};
export default PerfilDetallePage;
