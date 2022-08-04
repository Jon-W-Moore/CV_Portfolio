import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { MdSave } from 'react-icons/md';

export const AddExercise = () => {

    const [name, setName] = useState('');
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const [unit, setUnit] = useState('lbs');
    const [date, setDate] = useState('');

    const history = useHistory();

    const addExercise = async () => {
        const newExercise = {name, reps, weight, unit, date};
        const response = await fetch(`/exercises`, {
            method: 'POST',
            body: JSON.stringify(newExercise),
            headers: {
                'Content-Type': 'application/json',
            }
        });       
        if (response.status === 201){
            alert("Successfully added the exercise");
        } else {
            alert(`Failed to add exercise, status code = ${response.status}`);
        }
        // Take user back to home page.
        // When home page loads, it will pull all exercises from database
        history.push("/");
    };

    return (
        <div>
            <h1>Add Exercise</h1>
            <input
                type="text"
                placeholder="exercise"
                value={name}
                onChange={e => setName(e.target.value)} />
            <input
                type="number"
                size="10"
                value={reps}
                placeholder="# of reps"
                onChange={e => setReps(e.target.value)} />
            <input
                type="number"
                size="15"
                placeholder="weight"
                value={weight}
                onChange={e => setWeight(e.target.value)} />
            <select onChange={e => setUnit(e.target.value)} >
                <option value="lbs">lbs</option>
                <option value="kg">kg</option>
            </select>
            <input
                type="text"
                size="15"
                placeholder="date"
                value={date}
                onChange={e => setDate(e.target.value)} 
            />
            <button onClick={addExercise}> submit </button>
        </div>
    );
}

export default AddExercise;