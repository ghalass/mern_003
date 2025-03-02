const jwt = require('jsonwebtoken')
const prisma = require('../prismaClient')

exports.protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1]

    if (!token) return res.status(401).json({ message: "Not authorized, no token" })
    if (isTokenExpired(token)) return res.status(401).json({ message: "Token expired" })

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await prisma.user.findFirst({
            where: { id: decoded.id },
            omit: { password: true }
        })
        next()
    } catch (err) {
        res.status(500).json({ message: 'Error login user', error: err.message })
    }
}

const isTokenExpired = (token) => {
    if (!token) return true;

    try {
        const decodedToken = JSON.parse(atob(token.split(".")[1])); // Décoder le payload
        const currentTime = Math.floor(Date.now() / 1000); // Temps actuel en secondes

        // Formatage de la date actuelle en DD-MM-YYYY à HH:mm
        const formattedTime = new Date(currentTime * 1000).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
        // console.log(`Temps actuel : ${formattedTime}`);

        // Formatage de l'expiration du token en DD-MM-YYYY à HH:mm
        const tokenExpiryTime = new Date(decodedToken.exp * 1000).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
        // console.log(`Expiration du token : ${tokenExpiryTime}`);

        return decodedToken.exp < currentTime; // Comparer l'expiration avec le temps actuel
    } catch (error) {
        console.error("Erreur lors de la vérification du token:", error);
        return true; // Si erreur, considérer comme expiré
    }
};