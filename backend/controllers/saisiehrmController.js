const prisma = require('../prismaClient');
const { dateFormatter, dateNextDay } = require('../utils/helpers');

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

exports.updateSaisieHrm = async (req, res) => {
    try {
        const { id } = req.params
        const { hrm } = req.body
        // Vérification des champs obligatoires
        const missingFields = ["hrm"].filter((field) => !req.body[field]);
        if (missingFields.length > 0) {
            return res
                .status(400)
                .json({ error: "Veuillez remplir tous les champs!", missingFields });
        }

        if (isNaN(id) || parseInt(id) != id) {
            return res.status(404).json({ error: "Saisie n'est pas trouvé." });
        }
        if (isNaN(hrm) || parseFloat(hrm) != hrm) {
            return res.status(400).json({ error: "HRM doit être un nombre." });
        }
        if (hrm > 24 || hrm < 0) {
            return res.status(400).json({ error: "HRM doit être un nombre positif inférieur à 24." });
        }

        const existingSaisiehrm = await prisma.saisiehrm.findFirst({
            where: { id: parseInt(id) }
        })
        if (!existingSaisiehrm) {
            return res.status(404).json({ error: "Saisie n'existe pas!" })
        }

        const totalHim = await prisma.saisiehim.aggregate({
            _sum: { him: true }, where: { saisiehrmId: parseInt(existingSaisiehrm?.id) }
        });
        if ((Number(totalHim?._sum?.him) ?? 0) + (Number(hrm) ?? 0) > 24) {
            return res.status(400).json({
                error: `HRM: ${hrm} + HIMs: ${totalHim?._sum?.him} = ${(Number(hrm) ?? 0) + (Number(totalHim?._sum?.him) ?? 0)} > 24, ce qui n'est pas possible.`
            });
        }

        const saisiehrmUpdated = await prisma.saisiehrm.update({
            where: { id: parseInt(id) },
            data: { hrm: parseFloat(hrm) }
        })
        return res.status(200).json(saisiehrmUpdated)

    } catch (error) {
        console.log(error);
    }
};

exports.addSaisieHrm = async (req, res) => {
    try {
        const { du, enginId, siteId, hrm } = req.body
        // Vérification des champs obligatoires
        const missingFields = ["du", "enginId", "siteId", "hrm"].filter((field) => !req.body[field]);
        if (missingFields.length > 0) {
            return res
                .status(400)
                .json({ error: "Veuillez remplir tous les champs!", missingFields });
        }

        if (isNaN(enginId) || parseInt(enginId) != enginId) {
            return res.status(404).json({ error: "Engin n'existe pas." });
        }
        if (isNaN(siteId) || parseInt(siteId) != siteId) {
            return res.status(404).json({ error: "Site n'existe pas." });
        }
        if (isNaN(hrm) || parseFloat(hrm) != hrm) {
            return res.status(400).json({ error: "HRM doit être un nombre." });
        }
        if (hrm > 24 || hrm < 0) {
            return res.status(400).json({ error: "HRM doit être un nombre positif inférieur à 24." });
        }

        const startDate = new Date(du);
        startDate.setHours(0, 0, 0, 0); // Set time to 00:00:00

        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1); // Move to next day to exclude time part

        if (await prisma.saisiehrm.findFirst({
            where: {
                du: {
                    gte: startDate,
                    lt: endDate // Limits results to the same day
                },
                enginId: parseInt(enginId)
            }
        })) {
            return res.status(400).json({ error: "Saisie dèjà faite, pour cet engin à cette date." })
        }

        const saisiehrmNew = await prisma.saisiehrm.create({
            data: {
                du: new Date(du),
                enginId: parseInt(enginId),
                siteId: parseInt(siteId),
                hrm: parseFloat(hrm)
            }
        })
        return res.status(200).json(saisiehrmNew)

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
        const existingSaisiehim = await prisma.saisiehrm.findFirst({ where: { id: parseInt(saisiehrmId) } });
        if (!existingSaisiehim) {
            return res.status(400).json({ error: "Sauvegarder la Saisie HRM d'abord." });
        }
        if (await prisma.saisiehim.findFirst({ where: { panneId: parseInt(panneId), saisiehrmId: parseInt(saisiehrmId) } })) {
            return res.status(400).json({ error: "Cette panne est dèjà saisie pour cet engin à cette date." });
        }
        if (isNaN(him) || parseFloat(him) != him) {
            return res.status(400).json({ error: "HIM doit être un nombre." });
        }
        if (isNaN(ni) || parseInt(ni) != ni) {
            return res.status(400).json({ error: "NI doit être un nombre." });
        }

        const existingSaisiehrm = await prisma.saisiehrm.findFirst({
            where: { id: parseInt(saisiehrmId) }
        })
        const totalHim = await prisma.saisiehim.aggregate({
            _sum: { him: true }, where: { saisiehrmId: parseInt(existingSaisiehrm?.id) }
        });
        const HRM = Number(existingSaisiehrm?.hrm) ?? 0;
        const HIM = Number(totalHim?._sum?.him) ?? 0;
        const totalHIM = (Number(HIM) + Number(him)) ?? 0;
        if ((totalHIM + HRM) > 24) {
            return res.status(400).json({
                error: `HRM(${HRM}) + HIMs(${HIM}) + HIM(${him}) = ${(totalHIM + HRM)} > 24, ce qui n'est pas possible.`
            });
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
