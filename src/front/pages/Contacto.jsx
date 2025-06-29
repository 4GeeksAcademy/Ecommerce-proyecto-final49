import React, { useState } from 'react';

export const Contacto = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  // Inicializa submitMessage como null o un objeto con type/text para evitar errores
  const [submitMessage, setSubmitMessage] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitMessage(null); 

    const url = import.meta.env.VITE_BACKEND_URL;

    try {
      console.log('Enviando datos del formulario:', formData);

      const response = await fetch(`${url}/contact-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json(); 

      if (response.ok) { 
        setSubmitMessage({ type: 'success', text: data.msg || '¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.' });
        setFormData({ name: '', email: '', message: '' }); 
      } else {
        setSubmitMessage({ type: 'error', text: data.msg || 'Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo.' });
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setSubmitMessage({ type: 'error', text: 'Error de conexión. Asegúrate de que el servidor esté funcionando y las configuraciones de CORS sean correctas.' });
    }
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center py-5" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div className="card shadow-lg rounded-lg p-4 p-md-5 w-100" style={{ maxWidth: '960px' }}>
        <div className="row g-4"> 
          <div className="col-md-6 d-flex flex-column justify-content-between p-3">
            <div className="mb-4"> 
              <h2 className="display-5 fw-bold text-dark text-center text-md-start">
                Contáctanos
              </h2>
              <p className="lead text-muted text-center text-md-start">
                ¿Tienes alguna pregunta o comentario? ¡Nos encantaría escucharte!
              </p>

              <div className="mt-4 space-y-3"> 
                <div className="d-flex align-items-center gap-3">
                  <i class="fa-regular fa-envelope"></i><p className="text-secondary mb-0">info@tudominio.com</p>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <i class="fa-solid fa-phone"></i>
                  <p className="text-secondary mb-0">+1 (555) 123-4567</p>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <i class="fa-solid fa-location-dot"></i>
                  <p className="text-secondary mb-0">Calle Falsa 123, Ciudad, País</p>
                </div>
                <iframe src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d809.9750302530585!2d139.55708796954121!3d35.70407538731993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzXCsDQyJzE0LjciTiAxMznCsDMzJzI3LjgiRQ!5e0!3m2!1ses-419!2sco!4v1751151241041!5m2!1ses-419!2sco" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
              </div>
            </div>
            <div className="mt-4 text-center text-md-start">
              <p className="text-sm text-muted">Horario de atención: Lunes - Viernes, 9 AM - 5 PM</p>
            </div>
          </div>
          <div className="col-md-6 p-3">
            <form className="row g-3" onSubmit={handleSubmit}> 
              <div className="col-12">
                <label htmlFor="name" className="form-label">
                  Nombre
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control rounded shadow-sm"
                />
              </div>

              <div className="col-12">
                <label htmlFor="email" className="form-label">
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control rounded shadow-sm"
                />
              </div>

              <div className="col-12">
                <label htmlFor="message" className="form-label">
                  Tu Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="form-control rounded shadow-sm"
                ></textarea>
              </div>
              {submitMessage && (
                <div
                  className={`alert ${
                    submitMessage.type === 'success'
                      ? 'alert-success'
                      : 'alert-danger'
                  } rounded`}
                  role="alert"
                >
                  {submitMessage.text}
                </div>
              )}

              <div className="col-12">
                <button
                  type="submit"
                  className="btn btn-primary w-100 rounded shadow-sm py-2"
                >
                  Enviar Mensaje
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    )}

