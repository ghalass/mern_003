const prisma = require('../prismaClient')
const xlsx = require("xlsx")

exports.addPanne = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name } = req.body

        // Validation : Check for missing fields
        if (!name) {
            return res.status(400).json({ message: "All fields are required." })
        }
        // Check if site already exist
        const site = await prisma.site.findFirst({ where: { name } })
        if (site) {
            return res.status(400).json({ message: "Site existe déjà." })
        }

        const newSite = await prisma.site.create({ data: { name } });
        res.status(200).json({ message: "Enregistrement ajouté avec succès.", newSite })
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err })
    }
}

exports.getAllPannes = async (req, res) => {
    try {
        const pannes = await prisma.panne.findMany({ orderBy: { createdAt: "desc" } })
        res.status(200).json({ message: "Enregistrements récupérés avec succès.", pannes })

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err })
    }
}

exports.deletePanne = async (req, res) => {
    const { id } = req.params
    try {

        if (isNaN(id) || parseInt(id) != id) {
            return res.status(404).json({ error: "Enregistrement n'est pas trouvé." });
        }

        const site = await prisma.site.findFirst({
            where: { id: parseInt(id) }
        });

        if (!site) {
            return res.status(404).json({ error: "Enregistrement n'existe pas!" })
        }

        await prisma.site.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({ message: "Enregistrement supprimé avec succès.", site })
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err })
    }
}

exports.updatePanne = async (req, res) => {
    const { id } = req.params
    const { name } = req.body

    try {

        if (isNaN(id) || parseInt(id) != id) {
            return res.status(404).json({ error: "Enregistrement n'est pas trouvé." });
        }

        const site = await prisma.site.findFirst({
            where: { id: parseInt(id) }
        });

        // check if name not already exist
        const nameExist = await prisma.site.findFirst({
            where: { name: name, id: { not: parseInt(id) } },

        });
        if (nameExist) {
            return res.status(401).json({ error: "Nom déjà utilisé!" })
        }

        if (!site) {
            return res.status(404).json({ error: "Enregistrement n'existe pas!" })
        }

        const updatedSite = await prisma.site.update({
            where: { id: parseInt(id) },
            data: { name }
        });

        res.status(200).json({ message: "Enregistrement modifié avec succès.", updatedSite })
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err })
    }
}

// backend/controllers/siteController.js
exports.downloadPannesExcel = async (req, res) => {
    try {
        const sites = await prisma.site.findMany();
        const data = sites.map((item) => ({ Site: item.name }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Sites");

        const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

        // Set headers before sending the response
        res.setHeader("Content-Disposition", "attachment; filename=sites_list.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Length", buffer.length);

        res.send(buffer);
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err });
    }
};

