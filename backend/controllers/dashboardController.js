const prisma = require('../prismaClient')

exports.getDashboardData = async (req, res) => {
    try {
        const totalSites = await prisma.site.count();
        const lastThreeSites = await prisma.site.findMany({
            take: 3,
            orderBy: {
                createdAt: 'desc',
            },
        })

        const totalUsers = await prisma.user.count();
        const lastThreeUsers = await prisma.user.findMany({
            take: 3,
            orderBy: {
                createdAt: 'desc',
            },
        })

        res.json({
            sites: {
                total: totalSites,
                lastThreeSites,
            },
            users: {
                total: totalUsers,
                lastThreeUsers,
            }
        })
    } catch (err) {
        res.status(500).json({ message: 'Error getting dashboard data', error: err.message })
    }
}
