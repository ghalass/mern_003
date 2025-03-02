const prisma = require('../prismaClient')

exports.getSaisieHrm = async (req, res) => {
    try {
        const { du, enginId } = req.body
        // Vérification des champs obligatoires
        const missingFields = ["du", "enginId"].filter((field) => !req.body[field]);
        if (missingFields.length > 0) {
            return res
                .status(400)
                .json({ error: "Veuillez remplir tous les champs!", missingFields });
        }

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
            },
            orderBy: { du: 'desc' },
        });
        return res.status(200).json(saisiehrm)
    } catch (error) {
        console.log(error);
    }
};

exports.addPanneHim = async (req, res) => {
    try {
        const { panneId, him, ni, saisiehrmId } = req.body
        // Vérification des champs obligatoires
        const missingFields = ["panneId", "him", "ni", "saisiehrmId"].filter((field) => !req.body[field]);
        if (missingFields.length > 0) {
            return res
                .status(400)
                .json({ error: "Veuillez remplir tous les champs!", missingFields });
        }

        if (isNaN(panneId) || parseInt(panneId) != panneId) {
            return res.status(404).json({ error: "Panne n'est pas trouvé." });
        }
        if (isNaN(saisiehrmId) || parseInt(saisiehrmId) != saisiehrmId) {
            return res.status(404).json({ error: "Saisie HRM n'est pas trouvé." });
        }
        if (!await prisma.saisiehrm.findFirst({ where: { id: parseInt(saisiehrmId) } })) {
            return res.status(404).json({ error: "Sauvegarder la Saisie HRM d'abord." });
        }
        if (await prisma.saisiehim.findFirst({ where: { panneId: parseInt(panneId), saisiehrmId: parseInt(saisiehrmId) } })) {
            return res.status(404).json({ error: "Cette panne est dèjà saisie pour cet engin à cette date." });
        }
        if (isNaN(him) || parseFloat(him) != him) {
            return res.status(404).json({ error: "HIM doit être un nombre." });
        }
        if (isNaN(ni) || parseInt(ni) != ni) {
            return res.status(404).json({ error: "NI doit être un nombre." });
        }
        const saisiehimNew = await prisma.saisiehim.create({ data: { panneId: parseInt(panneId), him: parseFloat(him), ni: parseInt(ni), saisiehrmId: parseInt(saisiehrmId) } })
        return res.status(200).json(saisiehimNew)

    } catch (error) {
        console.log(error);
    }
};

exports.deletePanneHim = async (req, res) => {
    const { id } = req.params
    try {
        // return res.status(200).json({ id: id })
        if (isNaN(id) || parseInt(id) != id) {
            return res.status(404).json({ error: "Enregistrement n'est pas trouvé." });
        }

        const saisiehimPanne = await prisma.saisiehim.findFirst({
            where: { id: parseInt(id) }
        });

        if (!saisiehimPanne) {
            return res.status(404).json({ error: "Enregistrement n'existe pas!" })
        }

        await prisma.saisiehim.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({ message: "Enregistrement supprimé avec succès.", saisiehimPanne })
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err })
    }
}