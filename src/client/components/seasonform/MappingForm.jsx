import React, { useState, useEffect } from 'react';

export const MappingForm = ({ form, setForm, formStep, setFormStep }) => {
    const currentFormStep = 5;

    const [mappingForm, setMappingForm] = useState([])

    useEffect(() => {
        mappingForm.length = form.participants.length
    },[form])

    const handleChange = e => {
        const updatedMapping = [...mappingForm];
        updatedMapping[e.id] = e.value;
        setMappingForm(updatedMapping)
    }

    const nextStep = () => {
        if (formStep !== currentFormStep || mappingForm.includes(undefined)) return;
        setForm({ ...form, positionMappings: [...mappingForm] })
        setFormStep(currentFormStep + 1)
    }
    const previousStep = () => setFormStep(currentFormStep - 1)

    return (
        <div className="form-mapping">
            <label><h2>Points per placement</h2></label>
            <ul>
            {form.participants.map((participant, index) => {
                    return (
                        <li key={index}>
                            <label>
                                {index + 1}
                                <input
                                    id={index}
                                    onChange={e => handleChange(e.target)}
                                    type="number"
                                />
                            </label>
                        </li>
                    )
                })}
            </ul>

            <div className="season-form-buttons">
                <button onClick={() => previousStep()}>Previous</button>
                <button onClick={() => nextStep()}>Next</button>
            </div>
        </div>
    )
}