import mongoose from 'mongoose';

import User from '../models/users.js';
import { resolve } from 'path';

export const getUsers = async (req, res) => {
    const { page } = req.query;
    try {
        const LIMIT = 100;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page

        const total = await User.countDocuments({});
        const users = await User.find().sort({_id:-1}).limit(LIMIT).skip(startIndex);

        res.json({ data: users, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
        } catch (err) {
            res.status(500).json(err);
      }
}

export const getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);

        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message});
    }
}



export const createUser = async (req, res) => {
    try {
        const result = await User.create({ 
            email: req.body.email,
            password: req.body.password
        });

        res.status(201).json(result);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, password } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No blog with id: ${id}`);

    const UpdateUser = { email, password, _id: id };

    await User.findByIdAndUpdate(id, UpdateUser, { new: true });

    res.json(UpdateUser);
}
