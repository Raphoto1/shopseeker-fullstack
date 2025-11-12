export const categories = [
    'Digital','Traditional', 'Photography', 'MixedMedia',
]
//recordar llamar los iconos igual se agregan manualmente en el add!!!
export const shops = [
    'RedBubble', 'Society6','Displate','TeePublic','Spreadshirt', 'Threadless'
]

export const allShopsPath = '/api/design?page='

export const pageBasePath = 'https://shops.creativerafa.com'

export const pageDevPath = 'http://localhost:3000'

// Función para obtener la URL base dependiendo del entorno
export const getApiBasePath = () => {
  if (typeof window !== 'undefined') {
    // En el cliente, detectar si estamos en el mismo dominio o no
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return pageDevPath;
    } else if (window.location.hostname.includes('creativerafa.com')) {
      return pageBasePath;
    }
  }
  return pageBasePath; // Default para servidor
};

export const updateDesignPath = '/api/design'

export const addDesignPath = '/api/design'

// export const contactPath = '/api/contact'
export const contactPath = '/api/contact'

// URLs completas para acceso externo
export const getContactPath = () => `${getApiBasePath()}${contactPath}`

export const testPath = '/api'

export const registerPath = '/api/auth/register'

export const loginPath = '/api/auth/login'


