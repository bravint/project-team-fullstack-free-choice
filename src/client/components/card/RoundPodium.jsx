import React from 'react';

import { PodiumParticipant } from './PodiumParticipant';

export const RoundPodium = (props) => {
    const { index, element, season, round } = props;

    const { participant } = element;
    const { teams, positionMappings } = season;

    const findTeam = () => {
        let teamName;
        teams.forEach((team) => {
            if (team.id === participant.teamId) {
                teamName = team.name;
            }
        });
        return teamName;
    };

    const calcPoints = (index) => positionMappings[index].mapping;

    const calculateTeamPoints = () => {
        const teamScores = teams.map((team) => {
            let teamObj = { team: team, score: [] };

            season.participants.forEach((participant) => {
                if (team.id === participant.teamId) {
                    round[0].placements.forEach((placement) => {
                        if (placement.participantId === participant.id) {
                            let score = calcPoints(placement.position - 1);

                            teamObj.score.push(score);
                        }
                    });
                }
            });

            return teamObj;
        });

        const totalScore = teamScores.map((score) => {
            if (score.team.id === participant.teamId) {
                const initialValue = 0;
                return score.score.reduce((previousValue, currentValue) => previousValue + currentValue, initialValue);
            }
        });

        return totalScore;
    };

    return (
        <div className="podium round-podium" key={index}>
            <PodiumParticipant participant={participant.competitor} index={index} />

            <h4 className="team-score">{findTeam()}</h4>
            <h4 className="team-score">{calculateTeamPoints()}</h4>

            <div className="participant-score">
                <h3>{calcPoints(index)}</h3>
            </div>
        </div>
    );
};
