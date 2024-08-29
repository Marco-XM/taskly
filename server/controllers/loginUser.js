const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password.' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid email or password.' });

    // Check if JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ error: 'JWT secret is not configured.' });
    }

    const token = jwt.sign({ _id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
};
const testBcrypt = async () => {
    const password = 'testPassword';
    const saltRounds = 10;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Hashed Password:', hashedPassword);

    // Compare the password
    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log('Password match:', isMatch);
};



testBcrypt().catch(console.error);
module.exports = {
    loginUser
};