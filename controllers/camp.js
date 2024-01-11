const Camp = require('../models/camp');
const { cloudinary } = require('../cloudinary')


module.exports.index = async (req, res) => {
    const camp = await Camp.find({});
    res.render('camp/campground', { camp })
}
module.exports.newCampform = (req, res) => {
    res.render('camp/create')
}
module.exports.home = (req,res) => {
    res.render('camp/home')
}
module.exports.createCamp = async (req, res) => {
    console.log(req.body)
    const image = req.files.map(f => ({ url: f.path, filename: f.filename }))
    const camp = new Camp(req.body);
    camp.img = image;
    camp.author = req.user._id;
    console.log(camp)
    await camp.save();

    req.flash('success', 'Successfully created new Camp!!')
    res.redirect(`/camp/${camp._id}`)
}
module.exports.showCamp = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Camp.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author');
    if (!camp) {
        req.flash('error', 'This Camp was not found. It might have been deleted')
        res.redirect('/camp')
    }
    res.render('camp/show', { camp })
}
module.exports.editCamp = async (req, res) => {
    const { id } = req.params;
    const camp = await Camp.findById(id)
    await camp.save();
    if (!camp) {
        req.flash('error', 'This Camp was not found. It might have been deleted')
        return res.redirect('/camp')
    }
    res.render('camp/edit', { camp });
}
module.exports.updateCamp = async (req, res) => {
    const { id } = req.params;
    const { name, location, price } = req.body;
    const camp = await Camp.findByIdAndUpdate(id, { name: name, location: location, price: price })
    const image = req.files.map(f => ({ url: f.path, filename: f.filename }))
    camp.img.push(...image);

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename, function (error, result) {
                console.log(result, error)
            })
        }
        await camp.updateOne({ $pull: { img: { filename: { $in: req.body.deleteImages } } } })
        console.log(camp)
    }
    await camp.save();
    req.flash('success', 'successfully updated the camp')
    res.redirect(`/camp/${id}`)
}
module.exports.deleteCamp = async (req, res) => {
    const { id } = req.params;
    const camp = await Camp.findById(id)
    camp.img.forEach( async(img) => {
        await cloudinary.uploader.destroy(img.filename, function (error, result) {
            console.log(result, error)
        })
    });

    await Camp.findByIdAndDelete(id)
    req.flash('success', 'Camp was deleted successfully')
    res.redirect('/camp')
}