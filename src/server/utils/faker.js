const { faker } = require('@faker-js/faker');


const createFakeAdmin = () => {
    const username = faker.internet.userName();
    const password = faker.internet.password();
    const email = faker.internet.email(username);

    return { username, password, email }
}

const createFakeCompetition = () => {
    const title = faker.lorem.sentence();

    return { title, }
}

const createFakeSeasons = (maxSeasons) => {
    const fakeSeasons = [];
    for (let i = 0; i < maxSeasons; i++) {
        const title = faker.lorem.sentence();
        const season = { title };
        fakeSeasons.push(season);
    }
    return fakeSeasons
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const createFakeRound = () => {
    const title = faker.lorem.sentence();
    const startsAt = randomDate(new Date(2021, 0, 1), new Date())

    return { title, startsAt }
}

const createFakeCompetitors = (maxCompetitors) => {
    const fakeCompetitors = [];
    for (let i = 0; i < maxCompetitors; i++) {
        const name = faker.name.firstName();
        const nationality = faker.address.country();
        const email = faker.internet.email();
        const competitorImageUrl = faker.internet.avatar();
        const competitor = { name, nationality, email, competitorImageUrl }
        fakeCompetitors.push(competitor);
    }
    return fakeCompetitors
}
const createFakePositionMapping = (position, mapping) => {
    //temporary
    return { position, mapping }
}

const createFakeTeam = () => {

    const name = faker.lorem.word();


    return { name }
}

const createFakePlacement = (availablePositions) => {
    const position = faker.datatype.number({ max: availablePositions.length });

    return { position }
}

//console.log(createFakePlacement([1, 2, 3, 4, 5]));

module.exports = {
    createFakeAdmin,
    createFakeCompetition,
    createFakeSeasons,
    createFakeRound,
    createFakeCompetitors,
    createFakeTeam,
    createFakePositionMapping,
    createFakePlacement
}