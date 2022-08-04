import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { MdSave } from 'react-icons/md';

export const EditExercise = ({exerciseToEdit}) => {

    const [name, setName] = useState(exerciseToEdit.name);
    const [reps, setReps] = useState(exerciseToEdit.reps);
    const [weight, setWeight] = useState(exerciseToEdit.weight);
    const [unit, setUnit] = useState(exerciseToEdit.unit);
    const [date, setDate] = useState(exerciseToEdit.date);

    const history = useHistory();

    // body needs to be JSON, so we use stringify to make the body JSON.
    // We also need to tell the server the body is JSON, so we include
    // a header property to show content-type is json.
    const editExercise = async () => {
        const editedExercise = {name, reps, weight, unit, date};
        const response = await fetch(`/exercises/${exerciseToEdit._id}`, {
            method: 'PUT',
            body: JSON.stringify(editedExercise),
            headers: {
                'Content-Type': 'application/json',
            }
        });       
        if (response.status === 200){
            alert("Successfully edited the exercise");
        } else {
            alert(`Failed to edit exercise, status code = ${response.status}`);
        }
        // Take user back to home page.
        // When home page loads, it will pull all exercises from database
        history.push("/");
    };

    return (
        <div>
            <h1>Edit Exercise</h1>
            <div className = "App-table">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Reps</th>
                        <th>Weight</th>
                        <th>Unit</th>
                        <th>Date</th>
                        <th>Save</th>
                    </tr>
                </thead>
                    <tbody>
                        <tr>
                            <td>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)} />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    className = "number-input"
                                    size="5"
                                    value={reps}
                                    onChange={e => setReps(e.target.value)} />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    className = "number-input"
                                    size="8"
                                    value={weight}
                                    onChange={e => setWeight(e.target.value)} />
                            </td>
                            <td>
                                <select
                                    value={unit}
                                    onChange={e => setUnit(e.target.value)} >
                                    <option value="lbs">lbs</option>
                                    <option value="kg">kg</option>
                                </select>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    size="8"
                                    value={date}
                                    onChange={e => setDate(e.target.value)} />
                            </td>
                            <td>< MdSave onClick={editExercise} /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default EditExercise;