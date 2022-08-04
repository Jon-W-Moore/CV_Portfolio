import React from 'react';
import Exercise from './row';

function ExerciseTable({ exercises, onDelete, onEdit }) {
    return (
        <table id="exercises">
            <thead>
                <tr>
                    <th>exercise</th>
                    <th>reps</th>
                    <th>weight</th>
                    <th>unit</th>
                    <th>date</th>
                    <th>edit</th>
                    <th>delete</th>
                </tr>
            </thead>
            <tbody>
                {exercises.map((exercise, i) => <Exercise exercise={exercise}
                    onDelete = {onDelete}
                    onEdit = {onEdit}
                    key={i} />)}
            </tbody>
        </table>
    );
}

export default ExerciseTable;