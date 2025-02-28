const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const prisma = require('../prismaClient')

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" })
}

exports.registerUser = async (req, res) => {
    const { name, email, password, profileImageUrl } = req.body

    // Validation: Check for missing fields
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Tous les champs sont obligatoires." })
    }

    try {
        // Check if email already exists
        const existingUser = await prisma.user.findFirst({
            where: { email }
        })
        if (existingUser) {
            return res.status(400).json({ message: "E-mail déjà utilisé." })
        }

        // hashing the password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt)
        // Create the user
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword, profileImageUrl }
        });

        // Supprimer le mot de passe avant d'envoyer l'objet utilisateur
        const { password: _, ...userWithoutPassword } = user;

        res.status(200).json({
            id: user.id,
            user: userWithoutPassword, // Renvoie l'utilisateur sans le mot de passe
            token: generateToken(user.id),
        });
    } catch (err) {
        res.status(500).json({ message: 'Error registring user', error: err.message })
    }
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body

    // Validation: Check for missing fields
    if (!email || !password) {
        return res.status(400).json({ message: "Tous les champs sont obligatoires." })
    }

    try {
        const user = await prisma.user.findFirst({
            where: { email }
        })
        if (!user || !(await bcryptjs.compare(password, user.password))) {
            return res.status(400).json({ message: "Email ou mot de passe incorrecte." })
        }

        // Supprimer le mot de passe avant d'envoyer l'objet utilisateur
        const { password: _, ...userWithoutPassword } = user;

        res.status(200).json({
            id: user.id,
            user: userWithoutPassword, // Renvoie l'utilisateur sans le mot de passe
            token: generateToken(user.id),
        });
    } catch (err) {
        res.status(500).json({ message: 'Error login user', error: err.message })
    }
}

exports.getUserInfo = async (req, res) => {
    try {
        const user = await prisma.user.findFirst({
            where: { id: req.user.id },
            omit: { password: true }
        })
        if (!user) {
            return res.status(404).json({ message: "User not found." })
        }

        // Supprimer le mot de passe avant d'envoyer l'objet utilisateur
        const { password: _, ...userWithoutPassword } = user;

        res.status(200).json({
            user: userWithoutPassword, // Renvoie l'utilisateur sans le mot de passe
        });

    } catch (err) {
        res.status(500).json({ message: 'Error getting user info', error: err.message })
    }
}
