const { prisma } = require('../utils/prisma');
const { seasonCreateSchema } = require('../utils/joi');

const { HTTP_RESPONSE } = require('../config');

const createSeason = async (req, res) => {
    const { error } = seasonCreateSchema.validate(req.body);

    if (error) {
        return res.status(HTTP_RESPONSE.BAD_REQUEST.CODE).json({ error: error.details[0] });
    }

    const { title, competitionId, participants, teams, positionMappings } = req.body;

    const createdSeason = await prisma.season.create({
        data: {
            title: title,
            competitionId: Number(competitionId),
        },
    });

    const seasonId = createdSeason.id;

    const createdTeams = [];

    for (let i = 0; i < teams.length; i++) {
        const createdTeam = await prisma.team.create({
            data: {
                name: teams[i].name,
                seasonId: seasonId,
            },
        });
        createdTeams.push(createdTeam);
    }

    const findTeamId = (participant) => {
        const selectedTeam = createdTeams.filter((team) => team.name === participant.team);

        return selectedTeam[0].id;
    };

    for (let i = 0; i < participants.length; i++) {
        await prisma.participant.create({
            data: {
                season: {
                    connect: {
                        id: seasonId,
                    },
                },
                competitor: {
                    connect: {
                        id: Number(participants[i].competitorId),
                    },
                },
                team: {
                    connect: {
                        id: findTeamId(participants[i]),
                    },
                },
            },
        });
    }

    for (let i = 0; i < positionMappings.length; i++) {
        await prisma.positionMapping.create({
            data: {
                position: i + 1,
                mapping: Number(positionMappings[i]),
                season: {
                    connect: {
                        id: seasonId,
                    },
                },
            },
        });
    }

    const selectedSeason = await getSeasonById(seasonId);

    return res.status(HTTP_RESPONSE.OK.CODE).json({ data: selectedSeason });
};

const getSeasonById = async (id) => {
    const selectedSeason = await prisma.season.findUnique({
        where: {
            id: id,
        },
        include: {
            participants: {
                include: {
                    competitor: true,
                },
            },
            positionMappings: true,
            teams: true,
        },
    });

    return selectedSeason;
};

const getSeasonsByCompetition = async (req, res) => {
    let competitionId = req.params.id;

    const selectedSeasons = await prisma.season.findMany({
        where: {
            competitionId: Number(competitionId),
        },
    });

    return res.status(HTTP_RESPONSE.CREATED.CODE).json({ data: selectedSeasons });
};

module.exports = {
    createSeason,
    getSeasonById,
    getSeasonsByCompetition,
};
