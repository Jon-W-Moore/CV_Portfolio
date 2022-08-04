import React from 'react';
import { MdDeleteForever, MdEdit } from 'react-icons/md';

function Exercise({ exercise, onEdit, onDelete }) {
    return (
        <tr>
            <td>{exercise.name}</td>
            <td className="column_center">{exercise.reps}</td>
            <td className="column_center">{exercise.weight}</td>
            <td>{exercise.unit}</td>
            <td className="column_right">{exercise.date}</td>
            <td className="column_center">< MdEdit onClick={() => onEdit(exercise)} /></td>
            <td className="column_center">< MdDeleteForever onClick={() => onDelete(exercise._id)} /></td>
        </tr>
    );
}

export default Exercise;