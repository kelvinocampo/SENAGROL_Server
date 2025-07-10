export const Info = {
    "Introduccion del proyecto": `
        SENAGROL es un aplicativo web diseñado para conectar de manera directa, eficiente y accesible a los agricultores con los consumidores, abordando uno de los principales retos del sector agroalimentario: la comercialización rentable de los cultivos. A pesar de la disponibilidad de herramientas tecnológicas en el mercado, muchos productores aún enfrentan barreras significativas para llegar al consumidor, lo que provoca una excesiva intermediación, pérdidas económicas y una menor disponibilidad de productos frescos y locales para la población.
        Este proyecto busca cerrar esa brecha, facilitando la venta directa de productos agrícolas. Así, SENAGROL incrementa la rentabilidad de los agricultores y mejora la oferta para los consumidores, promoviendo un comercio más justo y eficiente.
        Además, la plataforma integrará a transportadores locales, quienes podrán ofrecer sus servicios para optimizar la distribución en zonas rurales, donde el acceso al transporte es limitado. De esta forma, SENAGROL no solo impulsa la economía local, sino que también mejora la logística y el acceso a alimentos en comunidades apartadas.
        Con un enfoque en la sostenibilidad y la innovación social, SENAGROL pretende transformar las dinámicas del sector agroalimentario, generando impacto positivo para todos los actores involucrados.
        Inicialmente, el proyecto se enfocará principalmente en el municipio de Circasia, en el departamento del Quindío, aprovechando sus características agrícolas, su potencial productivo y el compromiso de su comunidad con el desarrollo rural. Esta localidad servirá como punto de partida para validar el modelo y escalarlo posteriormente a otras regiones del país.
    `,
    "Funciones del asistente de IA": `
        El asistente de IA de SENAGROL está diseñado para mejorar la experiencia del usuario y optimizar la gestión de la plataforma. Sus principales funciones incluyen:
        Navegacion por la plataforma: Ayuda a los usuario a navegar por las diferentes secciones de la plataforma, proporcionando información sobre cómo acceder a las funcionalidades disponibles.
        Informacion sobre productos: Proporciona detalles sobre los productos disponibles, incluyendo descripciones, precios y disponibilidad, facilitando la toma de decisiones de compra, esto para cualquier usuario incluso sin rol...
        Informacion sobre compras para los roles que participan en estas como compradores transportadores y vendedores
    `,
    "Peticiones de rol": `
        Desde el apartado de Perfil se puede realizar la Peticion de Vendedor para indicar que se quiere ser vendedor, ademas de poder rellenar 
        el Formulario para transportador rellenando la siguiente informacion: Licencia de conduccion, SOAT vigente, tarjeta de propiedad del vehiculo, tipo de vehiculo, peso del vehiculo y de 2 a 5 imagenes del vehiculo.
        Luego de enviar la peticion de alguno de los dos roles, se puede contactar algun administrador para la activacion del rol para el usuario.
    `,
    "Funciones del rol vendedor": `
        Desde el desplegable que aparece al presionar o pasar el puntero o presionar perfil en la barra de navegacion superior, 
        se presiona Mis Productos o que llevara al usuario al apartado para la gestion de productos que contiene lo siguiente:
        - se veran los productos del vendedor, ademas de las opciones para editar y eliminar.
        - se puede crear producto presionando Crear Producto ingresando la siguiente informacion: Imagen, nombre, descripcion, cantidad, cantidad minima de compra, 
        precio por unidad, descuento porcentual y la ubicacion en la que el producto puede ser recogido por un transportador.
        - se puede ver la lista de las ventas del vendedor con las opciones para generar QR y codigo de 5 digitos para que el transportador inicie transporte ingresandolo o escaneandolo.
    `,
    "Funciones del rol transportador": `
        Desde el desplegable que aparece al presionar o pasar el puntero o presionar perfil en la barra de navegacion superior, 
        se presiona Mis Transportes o que llevara al usuario al apartado de los transportes del usuario que contiene lo siguiente:
        - Se puede ver la lista de los transportes del transportador con las opciones para escanear QR o ingresar codigo de 5 digitos que le otorga el vendedor de dicho producto para iniciar el transporte, 
        ademas de al momento de entregar el producto al comprador realizar lo mismo para finalizarlo.
        - Se puede cancelar un transporte en estado de Asignada indicando que este no se ha iniciado, en caso de que el transportador no este de acuerdo con el comprador.
    `,
    "Funciones del rol comprador": `
        El usuario puede realizar compra de producto en el inicio del sistema presionando comprar en la tarjeta del producto o dentro del producto presionando ver mas en la tarjeta del proyecto
        Desde el desplegable que aparece al presionar o pasar el puntero o presionar perfil en la barra de navegacion superior, 
        se presiona Mis Compras o que llevara al usuario al apartado de las compras del usuario que contiene lo siguiente:
        - Se puede ver la lista de las compras del usuario con las opciones para asignar transportador a una compra en estado de Pendiente, 
        para una compra en estado de En Proceso generar un QR o un codigo de 5 digitos para que el transportador finalize transporte ingresandolo o escaneandolo.
        - Se puede cancelar el transporte de una compra en estado de Asignada indicando que este no se ha iniciado, en caso de que el comprador no este de acuerdo podra cancelar el transporte.
    `,
}