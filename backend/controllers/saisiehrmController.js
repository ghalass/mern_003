const prisma = require('../prismaClient')

exports.getSaisieHrm = async (req, res) => {
    try {
        const { du, enginId } = req.body
        // return res.status(200).json({ du: new Date(du) })
        // Vérification des champs obligatoires
        const missingFields = ["du", "enginId"].filter((field) => !req.body[field]);
        if (missingFields.length > 0) {
            return res
                .status(400)
                .json({ error: "Veuillez remplir tous les champs!", missingFields });
        }
        // const saisiehrm = await prisma.saisiehrm.findMany({
        //     where: { du: new Date(du), enginId: parseInt(enginId) },
        //     include: {
        //         Saisiehim: { include: { Panne: { include: { Typepanne: true } } } },
        //         Engin: true,
        //         Site: true,
        //     },
        //     orderBy: { du: 'desc' },
        // });
        const startDate = new Date(du);
        startDate.setHours(0, 0, 0, 0); // Set time to 00:00:00

        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1); // Move to next day to exclude time part

        const saisiehrm = await prisma.saisiehrm.findMany({
            where: {
                du: {
                    gte: startDate,
                    lt: endDate // Limits results to the same day
                },
                enginId: parseInt(enginId)
            },
            include: {
                Saisiehim: { include: { Panne: { include: { Typepanne: true } } } },
                Engin: true,
                Site: true,
            },
            orderBy: { du: 'desc' },
        });
        return res.status(200).json(saisiehrm)
    } catch (error) {
        console.log(error);
    }
};
