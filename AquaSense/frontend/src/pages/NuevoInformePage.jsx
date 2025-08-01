// frontend/src/pages/NuevoInformePage.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/InformeDetallePage.css';
import html2pdf from 'html2pdf.js';
const InformeDetallePage = () => {
    const { id } = useParams();
    const [informe, setInforme] = useState(null);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [editado, setEditado] = useState({});
    const contenidoRef = useRef(null);
    useEffect(() => {
        const datos = JSON.parse(localStorage.getItem('informes') || '[]');
        const encontrado = datos.find((inf) => inf.id === id);
        setInforme(encontrado);
        setEditado(encontrado);
    }, [id]);
    const guardarCambios = () => {
        if (!editado)
            return;
        const actualizados = JSON.parse(localStorage.getItem('informes') || '[]');
        const nuevos = actualizados.map((inf) => inf.id === id ? { ...inf, ...editado } : inf);
        localStorage.setItem('informes', JSON.stringify(nuevos));
        setInforme(prev => prev ? { ...prev, ...editado } : null);
        setModoEdicion(false);
    };
    const compartirInforme = () => {
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({
                title: informe?.titulo,
                text: 'Consulta el informe semanal de calidad del agua.',
                url,
            }).catch((err) => {
                console.error('Error al compartir:', err);
            });
        }
        else {
            navigator.clipboard.writeText(url)
                .then(() => alert('Enlace copiado al portapapeles 📋'))
                .catch((err) => {
                console.error('Error al copiar al portapapeles:', err);
                alert('No se pudo copiar el enlace');
            });
        }
    };
    const descargarPDF = () => {
        if (!contenidoRef.current || !informe)
            return;
        const element = contenidoRef.current;
        const opt = {
            margin: 10,
            filename: `${informe.titulo}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save()
            .catch((err) => {
            console.error('Error al generar PDF:', err);
            alert('Error al generar el PDF');
        });
    };
    if (!informe)
        return <div className="detalle-informe-container"><Navbar /><p>Cargando informe...</p></div>;
    return (<div className="detalle-informe-container">
      <Navbar />
      <div className="detalle-box" ref={contenidoRef}>
        <img src="/pez-alerta.png" alt="pez"/>
        <h2>{informe.titulo}</h2>
        <p>{informe.fechaInicio} - {informe.fechaFin}</p>

        <div className="botones">
          <button onClick={() => setModoEdicion(true)}>Editar informe</button>
          <button onClick={compartirInforme}>Compartir informe</button>
          <button onClick={descargarPDF}>Descargar</button>
        </div>

        <h3>Rango de fechas</h3>
        <p><strong>Fecha de inicio:</strong> {informe.fechaInicio}</p>
        <p><strong>Fecha de finalización:</strong> {informe.fechaFin}</p>

        <h3>Métricas de la calidad del agua</h3>
        <p><strong>Oxígeno disuelto:</strong> {informe.oxigeno}</p>
        <p><strong>Nivel de pH:</strong> {informe.ph}</p>
        <p><strong>Temperatura:</strong> {informe.temperatura}</p>

        <h3>Resumen del informe</h3>
        <p>{informe.descripcion}</p>
      </div>

      {modoEdicion && (<div className="modal-fondo">
          <div className="form-popup">
            <h3>Editar Informe</h3>
            <input value={editado?.titulo || ''} onChange={e => setEditado({ ...editado, titulo: e.target.value })} placeholder="Título"/>
            <input value={editado?.fechaInicio || ''} type="date" onChange={e => setEditado({ ...editado, fechaInicio: e.target.value })}/>
            <input value={editado?.fechaFin || ''} type="date" onChange={e => setEditado({ ...editado, fechaFin: e.target.value })}/>
            <textarea value={editado?.descripcion || ''} onChange={e => setEditado({ ...editado, descripcion: e.target.value })} placeholder="Descripción"/>
            <input value={editado?.oxigeno || ''} onChange={e => setEditado({ ...editado, oxigeno: e.target.value })} placeholder="Oxígeno disuelto"/>
            <input value={editado?.ph || ''} onChange={e => setEditado({ ...editado, ph: e.target.value })} placeholder="Nivel de pH"/>
            <input value={editado?.temperatura || ''} onChange={e => setEditado({ ...editado, temperatura: e.target.value })} placeholder="Temperatura"/>
            <button onClick={guardarCambios}>Guardar</button>
            <button onClick={() => setModoEdicion(false)}>Cancelar</button>
          </div>
        </div>)}
    </div>);
};
export default InformeDetallePage;
