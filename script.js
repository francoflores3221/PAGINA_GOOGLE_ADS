document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cotizacionForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Mostrar loader mientras se procesa
        const swalInstance = Swal.fire({
            title: 'Procesando tu solicitud',
            html: 'Por favor espera un momento...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        try {
            const formData = new FormData(this);
            const nombre = document.getElementById('nombre').value;
            
            // Para debug: mostrar los datos que se enviarán
            console.log('Datos del formulario:');
            for (let [key, value] of formData.entries()) {
                console.log(key + ': ' + value);
            }
            
            // Enviar datos al servidor con timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout
            
            const response = await fetch('guardar_datos.php', {
                method: 'POST',
                body: formData,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Respuesta del servidor:', data);
            
            // Cerrar el loader
            await swalInstance.close();
            
            if(data.success) {
                const result = await Swal.fire({
                    title: `¡Solicitud recibida con éxito, ${nombre.split(' ')[0]}!`,
                    html: `
                        <p>Tu solicitud de cotización ha sido procesada correctamente.</p>
                        <p style="margin-top: 15px;"><strong>¿Deseas agendar una llamada con uno de nuestros asesores?</strong></p>
                    `,
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonColor: '#0069d9',
                    cancelButtonColor: '#4a5568',
                    confirmButtonText: 'Sí, agendar ahora',
                    cancelButtonText: 'Prefiero esperar',
                    backdrop: `
                        rgba(0,0,0,0.7)
                        url("https://i.gifer.com/ZZ5H.gif")
                        center top
                        no-repeat
                    `
                });
                
                // Resetear el formulario solo después de que el usuario interactúe
                this.reset();
                
                if (result.isConfirmed) {
                    await Swal.fire(
                        'Perfecto',
                        'Te llamaremos en los próximos 30 minutos',
                        'info'
                    );
                }
            } else {
                throw new Error(data.message || 'Error desconocido del servidor');
            }
        } catch (error) {
            await swalInstance.close();
            
            let errorMessage = 'Hubo un problema al enviar tu solicitud. Por favor intenta nuevamente.';
            
            if (error.name === 'AbortError') {
                errorMessage = 'La solicitud tardó demasiado. Por favor verifica tu conexión e intenta nuevamente.';
            }
            
            await Swal.fire({
                title: 'Error',
                text: errorMessage,
                icon: 'error',
                confirmButtonColor: '#0069d9'
            });
            
            console.error('Error en el formulario:', error);
        }
    });
});