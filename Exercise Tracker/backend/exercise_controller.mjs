import * as exercises from './exercise_model.mjs';
import express from 'express';
const app = express();

const PORT = 3000;


app.use(express.json());


app.post('/exercises', (req, res) => {
    exercises.createExercise(
        req.body.name, 
        req.body.reps, 
        req.body.weight, 
        req.body.unit, 
        req.body.date
    )
        .then(exercise => {
            res.status(201).json(exercise);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ Error: 'Request failed' });
        });
});


app.get('/exercises', (_, res) => {
    exercises.findExercises({}, '', 0)
        .then(exercise => { res.json(exercise) })
        .catch(error => { 
            console.error(error) 
            res.status(404).json( { Error: 'Request failed' } )
    });
});


app.put('/exercises/:_id', (req, res) => {
    exercises.replaceExercise(
        req.params._id, 
        req.body.name, 
        req.body.reps, 
        req.body.weight, 
        req.body.unit, 
        req.body.date
        )

        .then(updateCount => {
            if (updateCount === 1) {
                res.json({
                    _id: req.params._id, 
                    name: req.body.name, 
                    reps: req.body.reps, 
                    weight: req.body.weight, 
                    unit: req.body.unit, 
                    date: req.body.date 
                })
            } else {
                res.status(404).json({ Error: 'Resource not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ Error: 'Request failed' });
        });
});


app.delete('/exercises/:id', (req, res) => {
    exercises.deleteById(req.params.id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'Resource not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ error: 'Request failed' });
        });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});