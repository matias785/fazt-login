const express = require('express');
const router = express.Router();

const Note = require('../models/Note')

router.get('/notes/add', (req, res) => {
    res.render('notes/new-note');
});

router.post('/notes/new-note', async (req, res) => {
    const { title, description } = req.body;
    const errors = [];
    if (!title) {
        errors.push({ text: 'Please Write a Title' });
    }
    if (!description) {
        errors.push({ text: 'Please Write a Description' })
    }
    if (errors.length > 0) {
        res.render('notes/new-note', {
            errors,
            title,
            description
        })
    } else {
        const newNote = new Note({ title, description })
        await newNote.save();
        res.redirect('/notes');
    }
});

router.get('/notes', async (req, res) => {
    const notes = await Note.find().sort({ date: 'desc' })
        .then(documentos => {
            const contexto = {
                notes: documentos.map(documento => {
                    return {
                        title: documento.title,
                        _id: documento._id,
                        description: documento.description
                    }
                })
            }
            res.render('notes/all-notes', {
                notes: contexto.notes
            })
        })
});


router.get('/notes/edit/:id', async(req, res) => {
    const note = await Note.findById(req.params.id)
    res.render('notes/edit-note', { note });
})

module.exports = router;