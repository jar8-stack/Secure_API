// Ejemplo simple de google-auth.dal.js

// Importar el modelo de usuario de Google (si tienes uno)
const GoogleUser = require('../models/Usuario'); // Asegúrate de ajustar la ruta según tu estructura de carpetas

// Función para registrar un usuario de Google en la base de datos
const registerWithGoogle = async (profile) => {
  try {
    // Verificar si el usuario de Google ya existe en la base de datos
    let user = await GoogleUser.findOne({ GoogleUserID: profile.id });

    if (user) {
      // El usuario ya existe, puedes devolver alguna información adicional si es necesario
      return { failure: true, success: false, user };
    }

    // El usuario no existe, crea un nuevo usuario de Google en la base de datos
    user = new GoogleUser({
      googleId: profile.id,
      displayName: profile.displayName,
      // Otros campos que quieras almacenar
    });

    await user.save();

    // Devuelve información sobre el nuevo usuario registrado
    return { failure: false, success: true, user };
  } catch (error) {
    console.error('Error in registerWithGoogle:', error);
    return { failure: true, success: false, error };
  }
};

module.exports = {
  registerWithGoogle,
  // Otras funciones relacionadas con la autenticación de Google
};
