module.exports.signUpErrors = (err) => {
    let errors = { pseudo: '', email: '', password: '' };

    if (err.message.includes('pseudo'))
        errors.pseudo = "Pseudo incorrect ou déjà pris"

    if (err.message.includes('email'))
        errors.email = "Email incorrect";

    if (err.message.includes('password'))
        errors.password = 'Le mot de passe doit faire plus de 6 caractères'

    if (err.code === 11000 && err.keyValue.pseudo)
        errors.pseudo = "Ce pseudo est déjà enregistré"

    if (err.code === 11000 && err.keyValue.email)
        errors.email = "Cet Email est déjà utilisé"

    return errors;
}

module.exports.signInErrors = (err) => {
    let errors = { email: '', password: '' }

    if (err.message.includes("email"))
        errors.email = "Email inconnu";

    if (err.message.includes('password'))
        errors.password = "Le mot de passe ne correspond pas"

    return errors;
}