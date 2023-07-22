import mongoose from 'mongoose';

import Page from '../models/pageheader.js';


export const getPages = async (req, res) => {
    const { page } = req.query;
    try {
        const LIMIT = 100;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
    
        const total = await Page.countDocuments({});
        const pages = await Page.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        res.json({ data: pages, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
      } catch (err) {
        res.status(500).json(err);
      }
}

export const getPagesBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;

    try {
        const title = new RegExp(searchQuery, "i");

        const pages = await Page.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ]});

        res.json({ data: pages });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const getPage = async (req, res) => { 
    const { id } = req.params;

    try {
        const page = await Page.findById(id);
        
        res.status(200).json(page);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPage = async (req, res) => {
    // console.log(req.body)
    const uploadImage = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    setBaseImage(base64);
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
    try {
        const result = await Page.create({ 
            title: req.body.title,
            img: req.body.img
        });

        res.status(201).json(result);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePage = async (req, res) => {
    const { id } = req.params;
    const { title, desc, img } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No blog with id: ${id}`);

    const UpdatePage = { title, desc, img, _id: id };

    await Page.findByIdAndUpdate(id, UpdatePage, { new: true });

    res.json(UpdatePage);
}

export const deletePage = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No blog with id: ${id}`);

    await Page.findByIdAndRemove(id);

    res.json({ message: "Page deleted successfully." });
}
