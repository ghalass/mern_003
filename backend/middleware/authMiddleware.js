const jwt = require('jsonwebtoken')
const prisma = require('../prismaClient')

exports.protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1]
    if (!token) return res.status(401).json({ message: "Not authorized, no token" })

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