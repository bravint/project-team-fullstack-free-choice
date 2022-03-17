import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CardTag } from './card/CardTag';
import { PodiumParticipant } from './card/PodiumParticipant';

import { StoreContext } from '../utils/store';

import './styling/card.css';

export const CompetitionCard = (props) => {
  const { competition } = props;

  const { state } = useContext(StoreContext);

  const { user } = state;

  const [podium, setPodium] = useState([]);

  const navigate = useNavigate();

  // find competitors with the 3 highest scores
  // (competitionId > many competitors > many participants > many placements > calculate and sum positionMapping)

  const calculateTotalScore = (season) => {
    const { participants, positionMappings } = season;

    const scoresForSeason = [];

    for (let i = 0; i < participants.length; i++) {
      const initialScore = 0;

      const participantScore = {
        competitor: participants[i].competitor,
        score: initialScore,
      };

      for (let j = 0; j < participants[j].placements.length; j++) {
        for (let k = 0; k < positionMappings.length; k++) {
          if (positionMappings[k].position === participants[i].placements[j].position) {
            participantScore.score = participantScore.score + positionMappings[k].mapping;
          }
        }
      }

      scoresForSeason.push(participantScore);
      scoresForSeason.sort(compareScores);
    }

    return scoresForSeason;
  };

  const setZeroTotalScores = (competitors) => {
    const scores = competitors.map((competitor) => {
      return {
        competitor: competitor,
        score: 0,
      };
    });
    return scores;
  };

  const compareScores = (firstEl, secondEl) => {
    if (firstEl.score > secondEl.score) {
      return -1;
    }
    if (firstEl.score < secondEl.score) {
      return 1;
    }
    return 0;
  };

  useEffect(() => {
    if (!competition) {
      return;
    }
    if (competition.seasons.length > 0) {
      const scores = calculateTotalScore(competition.seasons[competition.seasons.length - 1]);
      setPodium([scores[0], scores[1], scores[2]]);
    }
    if (!competition.seasons.length) {
      const scores = setZeroTotalScores(competition.competitors);
      scores.length > 2 ? setPodium([scores[0], scores[1], scores[2]]) : setPodium([...scores]);
    }
  }, []);

  const handleClick = () => navigate(`/${user}/${competition.id}`);

  return (
    <div className="card competition-card">
      <CardTag title={competition.title} handleClick={handleClick} />
      <div className="card-display">
        <h3>Top 3</h3>
        {podium &&
          podium.map((participant, index) => {
            return (
              <div key={index} className="podium competition-podium">
                <PodiumParticipant participant={participant.competitor} index={index} />
                <div className="participant-score">{participant.score}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
