const { prisma } = require('../utils/prisma');

const createCompetition = async (req, res) => {
    const { title, competitors } = req.body;

    const id = req.user.id;
    const createdCompetition = await prisma.competition.create({
        data: {
            title: title,
            admin: {
                connect: {
                    id: Number(id)
                }
            },
            competitors: {
                createMany: {
                    data: competitors
                }
            }
        }
    });

    return res.json({ data: createdCompetition });
}

const updateCompetitionTitle = async (req, res) => {
    const { title, id } = req.body;
    const updatedCompetition = await prisma.competition.create({
        where: {
            id: Number(id)
        },
        data: {
            title: title,
        }
    });

    return res.json({ data: updatedCompetition });
}

const deleteCompetitionById = async (req, res) => {
    const { id } = req.body;
    const deletedCompetition = await prisma.competition.delete({
        where: {
            id: Number(id)
        }
    })

    return res.json({ data: deletedCompetition });
}

const getCompetitionById = async (req, res) => {
    const id = req.user.id;
    const competitions = await prisma.competition.findMany({
        where: {
            adminId: Number(id)
        },
        include: {
            admin: true,
            competitors: true,
            seasons: {
                include: {
                    teams: {
                        include: {
                            participants: {
                                include: {
                                    placements: true
                                }
                            }
                        }
                    },
                    rounds: {
                        include: {
                            placements: true
                        }
                    },
                    participants: {
                        include: {
                            placements: true,
                            competitor: true
                        }
                    },
                    positionMappings: true
                }
            },
        }
    })

    return res.json({ data: competitions });
}

const getAllCompetitions = async (req, res) => {
    const competitions = await prisma.competition.findMany({
        include: {
            admin: true,
            competitors: true,
            seasons: {
                include: {
                    teams: {
                        include: {
                            participants: {
                                include: {
                                    placements: true
                                }
                            }
                        }
                    },
                    rounds: {
                        include: {
                            placements: true
                        }
                    },
                    positionMappings: true
                }
            },
        }
    });

    return res.json({ data: competitions });
}

module.exports = {
    getAllCompetitions,
    createCompetition,
    getCompetitionById,
    updateCompetitionTitle,
    deleteCompetitionById
}