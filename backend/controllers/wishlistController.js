const Wishlist = require('../models/Wishlist');

exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    res.json(wishlist.products);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });

    const index = wishlist.products.indexOf(productId);
    if (index === -1) {
      wishlist.products.push(productId);
      await wishlist.save();
      res.json({ message: 'Added to wishlist', isWishlisted: true });
    } else {
      wishlist.products.splice(index, 1);
      await wishlist.save();
      res.json({ message: 'Removed from wishlist', isWishlisted: false });
    }
  } catch (err) { res.status(500).json({ message: err.message }); }
};
