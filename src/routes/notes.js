const express = require('express');
const router = express.Router();

const Note = require('../models/Note')
const { isAuthenticated } = require('../helpers/auth');

router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-note');
});

router.post('/notes/new-note', isAuthenticated, async (req, res) => {
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
        const newNote = new Note({ title, description });
        newNote.user = req.user.id;
        await newNote.save();
        req.flash('success_msg', 'Note Added Successfully');
        res.redirect('/notes');
    }
});

router.get('/notes', isAuthenticated, async (req, res) => {
    const documentos = await Note.find({user: req.user.id}).sort({ date: 'desc' })
    const notes = documentos.map(documento => {
        return {
            title: documento.title,
            _id: documento._id,
            description: documento.description
        };
    });
    const contexto = {
        notes: notes
    }
    res.render('notes/all-notes', {
        notes: contexto.notes
    })
});


router.get('/notes/edit/:id', isAuthenticated, async(req, res) => {
    const documentos = await Note.findById(req.params.id)
    const note = {
        _id: documentos._id,
        title: documentos.title,
        description: documentos.description,
        date: documentos.date
    }
    res.render('notes/edit-note', { note });
})


router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
    const {title, description} = req.body;
    await Note.findByIdAndUpdate(req.params.id, {title, description})
    req.flash('success_msg', 'Note Update Successfully')
    res.redirect('/notes'); 
});

router.delete('/notes/delete/:id', isAuthenticated, async(req, res) => {
    await Note.findByIdAndRemove(req.params.id);
    req.flash('success_msg', 'Note Deleted Successfully')
    res.redirect('/notes');

})

module.exports = router;