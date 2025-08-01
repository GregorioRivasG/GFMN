// frontend/src/pages/UsuarioPage.tsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/UsuarioPage.css';
import Swal from 'sweetalert2';
import { FiUser, FiShield, FiEdit2, FiTrash2, FiPlusCircle, FiXCircle, FiSave, FiUserCheck } from 'react-icons/fi';
const UsuarioPage = () => {
    const [perfiles, setPerfiles] = useState([]);
    const [mostrarPerfilForm, setMostrarPerfilForm] = useState(false);
    const [editarId, setEditarId] = useState(null);
    const [nuevoPerfil, setNuevoPerfil] = useState({
        nombre: '',
        correo: '',
        password: '',
        role: 'employee'
    });
    useEffect(() => {
        fetchUsuarios();
    }, []);
    const fetchUsuarios = async () => {
        try {
            const res = await fetch(' http://45.174.90.242:5000/api/users');
            if (!res.ok) {
                throw new Error('Error al obtener usuarios');
            }
            const data = await res.json();
            setPerfiles(data);
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al obtener usuarios';
            Swal.fire('Error', errorMessage, 'error');
            console.error('Error al obtener usuarios:', err);
        }
    };
    const eliminarUsuario = async (id) => {
        const result = await Swal.fire({
            title: '¿Seguro que quieres eliminar este usuario?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });
        if (!result.isConfirmed)
            return;
        try {
            const res = await fetch(` http://45.174.90.242:5000/api/users/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Error al eliminar usuario');
            }
            const data = await res.json();
            setPerfiles(perfiles.filter(usuario => usuario._id !== id));
            await Swal.fire('Eliminado', data.message, 'success');
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al eliminar usuario';
            Swal.fire('Error', errorMessage, 'error');
        }
    };
    const abrirFormularioEdicion = (usuario) => {
        setEditarId(usuario._id);
        setNuevoPerfil({
            nombre: usuario.nombre,
            correo: usuario.correo,
            password: '',
            role: usuario.role
        });
        setMostrarPerfilForm(true);
    };
    const guardarPerfil = async () => {
        const { nombre, correo, password } = nuevoPerfil;
        if (!nombre || !correo || (!editarId && !password)) {
            await Swal.fire('Atención', 'Por favor completa todos los campos requeridos.', 'warning');
            return;
        }
        try {
            const res = await fetch(` http://45.174.90.242:5000/api/users${editarId ? `/${editarId}` : ''}`, {
                method: editarId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevoPerfil),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Error al guardar usuario');
            }
            const data = await res.json();
            fetchUsuarios();
            setMostrarPerfilForm(false);
            setEditarId(null);
            setNuevoPerfil({ nombre: '', correo: '', password: '', role: 'employee' });
            await Swal.fire('Éxito', data.message || 'Usuario guardado exitosamente', 'success');
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al guardar usuario';
            Swal.fire('Error', errorMessage, 'error');
        }
    };
    return (<div className="usuario-container">
      <Navbar />

      <div className="titulo-con-boton">
        <h2>Usuarios registrados</h2>
        <button className="btn-agregar-top" onClick={() => {
            setEditarId(null);
            setNuevoPerfil({ nombre: '', correo: '', password: '', role: 'employee' });
            setMostrarPerfilForm(true);
        }} title="Agregar usuario">
          <FiPlusCircle size={20} style={{ marginRight: '6px' }}/>
          Añadir usuario
        </button>
      </div>

      <ul>
        {perfiles.map((p) => (<li key={p._id}>
            <span className="rol-icon" title={p.role === 'admin' ? 'Administrador' : 'Empleado'}>
              {p.role === 'admin' ? <FiShield size={18}/> : <FiUser size={18}/>}
            </span>
            <div className="usuario-info">{p.nombre} ({p.correo})</div>
            <div className="acciones-usuario">
              <button className="btn-actualizar" onClick={() => abrirFormularioEdicion(p)} title="Actualizar usuario">
                <FiEdit2 size={18}/>
              </button>
              <button className="btn-eliminar" onClick={() => eliminarUsuario(p._id)} title="Eliminar usuario">
                <FiTrash2 size={18}/>
              </button>
            </div>
          </li>))}
      </ul>

      {mostrarPerfilForm && (<div className="modal-fondo">
          <div className="form-popup">
            <h3>{editarId ? 'Editar usuario' : 'Nuevo usuario'}</h3>
            <input type="text" placeholder="Nombre" value={nuevoPerfil.nombre} onChange={e => setNuevoPerfil({ ...nuevoPerfil, nombre: e.target.value })}/>
            <input type="email" placeholder="Correo" value={nuevoPerfil.correo} onChange={e => setNuevoPerfil({ ...nuevoPerfil, correo: e.target.value })}/>
            <input type="password" placeholder="Contraseña" value={nuevoPerfil.password} onChange={e => setNuevoPerfil({ ...nuevoPerfil, password: e.target.value })}/>
            <select value={nuevoPerfil.role} onChange={e => setNuevoPerfil({
                ...nuevoPerfil,
                role: e.target.value
            })}>
              <option value="employee">Empleado</option>
              <option value="admin">Administrador</option>
            </select>
            <button onClick={guardarPerfil} title={editarId ? 'Guardar cambios' : 'Crear usuario'}>
              {editarId ? (<>
                  <FiSave size={16} style={{ marginRight: '6px' }}/> Guardar cambios
                </>) : (<>
                  <FiUserCheck size={16} style={{ marginRight: '6px' }}/> Crear usuario
                </>)}
            </button>
            <button className="cerrar-btn" onClick={() => setMostrarPerfilForm(false)} title="Cancelar">
              <FiXCircle size={18}/>
              Cancelar
            </button>
          </div>
        </div>)}
    </div>);
};
export default UsuarioPage;
