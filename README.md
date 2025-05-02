# SENAGROL

SENAGROL es una plataforma web diseñada para que los agricultores tengan una conexión más directa, rápida y fácil con los consumidores. A pesar de los avances tecnológicos y la disponibilidad de herramientas en línea, los agricultores siguen enfrentando numerosos desafíos al intentar llegar a los consumidores finales y garantizar la rentabilidad de sus cultivos, lo que a menudo resulta en pérdidas económicas tanto para los agricultores como para los consumidores. 

Aunque este software está dirigido especialmente a agricultores, tendrá una inclusión a todo tipo de productos con el fin de facilitar la venta de todo tipo de productos, enfocado principalmente en los productos agrícolas.

## Estructura del Proyecto

- **Config/**  
  Contiene archivos de configuración que permiten establecer parámetros de conexión a la base de datos y otras configuraciones necesarias para la aplicación.

- **Controllers/**  
  Controladores responsables de recibir las solicitudes del cliente, procesarlas y devolver las respuestas adecuadas.

- **DB/**  
  Archivos relacionados con la base de datos.

- **Dto/**  
  Objetos de transferencia de datos (Data Transfer Objects) utilizados para transferir datos entre las diferentes capas de la aplicación.

- **Helpers/**  
  Funciones utilitarias que pueden ser utilizadas en diferentes partes de la aplicación para evitar la duplicación de código.

- **Middleware/**  
  Funciones que se ejecutan durante el ciclo de vida de una solicitud HTTP, permitiendo realizar tareas como autenticación y validación.

- **Node_modules/**  
  Carpeta generada automáticamente que contiene todas las dependencias del proyecto.

- **Repositories/**  
  Contiene los repositorios que encapsulan la lógica de acceso a datos. Cada repositorio se encarga de interactuar con una entidad específica (por ejemplo, usuarios, productos) y proporciona métodos para realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar).

- **Routes/**  
  Define las rutas de la aplicación, configura middleware y asocia las URL a los controladores correspondientes.

- **Services/**  
  Servicios que contienen la lógica de negocio de la aplicación. Utilizan los repositorios para acceder a los datos y realizar operaciones más complejas que pueden involucrar múltiples repositorios.

- **.gitignore**  
  Archivo que especifica qué archivos o carpetas deben ser ignorados por Git.

- **app.ts**  
  Archivo principal que inicializa la aplicación, rutas y otros componentes necesarios.

- **package-lock.json**  
  Archivo que asegura que las mismas versiones de las dependencias se instalen en diferentes entornos.

- **package.json**  
  Archivo que contiene la configuración de npm, incluyendo dependencias y scripts.

- **README.md**  
  Documentación del proyecto.

- **tsconfig.json**  
  Archivo de configuración de TypeScript.

## Integrantes del Proyecto
1. Kevin Esneider Ocampo Osorio (Scrum Master)
2. Samuel Torres Ospina (Product Owner)
3. Luisa Fernanda Vargas Barrera
4. Valerie Calle Loaiza
5. Mariana Cardenas Rendon

## Anexos
- [Repositorio FrontEnd](https://github.com/kelvinocampo/SENAGROL_Client)