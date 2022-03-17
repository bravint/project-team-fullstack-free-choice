import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { StoreContext } from '../utils/store';
import { API_URL, HTTP_METHOD, LOCAL_STORAGE } from '../config';

import { TitleForm } from './seasonform/TitleForm';
import { CompetitorForm } from './seasonform/CompetitorForm';
import { TeamForm } from './seasonform/TeamForm';
import { ParticipantForm } from './seasonform/ParticipantForm';
import { MappingForm } from './seasonform/MappingForm';

import './styling/create-season.css';

export const CreateSeason = () => {
    const { state } = useContext(StoreContext);

    const navigate = useNavigate();

    const competitionId = state.selectedCompetition[0].id;
    const formTotalSteps = 5;

    const token = localStorage.getItem(LOCAL_STORAGE.TOKEN);

    const [form, setForm] = useState({
        competitionId: competitionId,
        title: '',
        participants: [],
        teams: [],
        positionMappings: [],
    });
    const [formStep, setFormStep] = useState(1);

    useEffect(() => {
        const completedForm = formStep > formTotalSteps;

        if (completedForm) postForm();
    }, [formStep]);

    const [competitors, setCompetitors] = useState([]);

    useEffect(async () => {
        const getCompetitions = async () => {
            const response = await fetch(API_URL.COMPETITION_GET, {
                method: HTTP_METHOD.GET,
                headers: {
                    Authorization: token,
                },
            });
            const results = await response.json();
            return results.data[0].competitors;
        };

        const competitors = await getCompetitions();
        setCompetitors([...competitors]);
    }, []);

    const postForm = async () => {
        const fetchConfig = {
            method: HTTP_METHOD.POST,
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
            body: JSON.stringify(form),
        };
        const result = await fetch(API_URL.SEASON_POST, fetchConfig);

        if (!result || result.error) {
            console.log('ERROR', result);
            setFormStep(1);
        }

        navigate(`/${state.user}/${competitionId}`, {replace: true});
    };

    const scrollerStyling = {
        transform: `translate(${800 * -(formStep - 1)}px, 0)`,
    };

    const progressStyling = {
        width: `${(formStep * 800) / 6}px`,
    };

    return (
        <div className="create-season">
            <div className="season-form-bar">
                <div style={progressStyling} className="season-form-progress"></div>
            </div>

            <div className="create-season-form">
                <div className="season-form-scroller" style={scrollerStyling}>
                    <TitleForm form={form} setForm={setForm} formStep={formStep} setFormStep={setFormStep} />
                    <CompetitorForm form={form} setForm={setForm} formStep={formStep} setFormStep={setFormStep} competitors={competitors} />
                    <TeamForm form={form} setForm={setForm} formStep={formStep} setFormStep={setFormStep} />
                    <ParticipantForm form={form} setForm={setForm} formStep={formStep} setFormStep={setFormStep} />
                    <MappingForm form={form} setForm={setForm} formStep={formStep} setFormStep={setFormStep} />
                </div>
            </div>
        </div>
    );
};
