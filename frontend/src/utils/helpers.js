export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email)
}

export const getInitials = (name) => {
    if (!name) return "";

    const words = name.split(" ");
    let initials = "";

    for (let i = 0; i < Math.min(words.length, 2); i++) {
        initials += words[i][0];
    }
    return initials.toUpperCase();
}

export const isTokenExpired = (token) => {
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
