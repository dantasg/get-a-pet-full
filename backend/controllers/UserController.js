const User = require('../models/User');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

// helpers
const createUserToken = require('../helpers/create-user-token');
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');

module.exports = class UserController {
  // Register User
  static async register(req, res) {
    const { name, email, phone, password, confirmpassword } = req.body;

    // Validations
    if (!name) {
      res.status(402).json({ message: 'O nome é obrigatório!' });
      return;
    }

    if (!email) {
      res.status(402).json({ message: 'O email é obrigatório!' });
      return;
    }

    if (!phone) {
      res.status(402).json({ message: 'O telefone é obrigatório!' });
      return;
    }

    if (!password) {
      res.status(402).json({ message: 'A senha é obrigatória!' });
      return;
    }

    if (!confirmpassword) {
      res
        .status(402)
        .json({ message: 'A confirmação de senha é obrigatória!' });
      return;
    }

    if (password !== confirmpassword) {
      res.status(402).json({
        message: 'A senha e a confirmação de senha tem que ser iguais!',
      });
      return;
    }

    // // Check if user exists
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      res.status(422).json({ message: 'Por favor, utilize outro e-mail!' });
      return;
    }

    // create a password
    const salt = await bcrypt.genSaltSync(12);
    const passwordHash = await bcrypt.hashSync(password, salt);

    // create a user
    const user = new User({
      name: name,
      email: email,
      phone: phone,
      password: passwordHash,
    });

    try {
      const newUser = await user.save();

      await createUserToken(newUser, req, res);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Login user
  static async login(req, res) {
    const { email, password } = req.body;

    // Validations
    if (!email) {
      res.status(422).json({ message: 'O e-mail é obrigatório!' });
      return;
    }

    if (!password) {
      res.status(422).json({ message: 'A senha é obrigatória!' });
      return;
    }

    // Login
    const user = await User.findOne({ email: email });
    if (!user) {
      res
        .status(422)
        .json({ message: 'Não há usuário cadastrado com esse e-mail' });
      return;
    }

    // Check if password match with db password
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      res.status(422).json({
        message: 'Senha inválida!',
      });
      return;
    }

    await createUserToken(user, req, res);
  }

  // Check user as authorization
  static async checkUser(req, res) {
    let currentUser;

    if (req.headers.authorization) {
      const token = getToken(req);

      const decoded = jwt.verify(token, 'nossosecret');

      currentUser = await User.findById(decoded.id);

      currentUser.password = undefined;
    } else {
      currentUser = null;
    }

    res.status(200).send(currentUser);
  }

  // Get user by Id and return User
  static async getUserById(req, res) {
    const id = req.params.id;

    const user = await User.findById(id).select('-password');

    if (!user) {
      res.status(422).json({ message: 'Usuário não encontrado!' });
      return;
    }

    res.status(200).json({ user });
  }

  // Edit user by token/id
  static async editUser(req, res) {
    const token = getToken(req);

    const user = await getUserByToken(token);

    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;

    let image = '';

    if (req.file) {
      image = req.file.filename;
    }

    // validations
    if (!name) {
      res.status(422).json({ message: 'O nome é obrigatório!' });
      return;
    }

    user.name = name;

    if (!email) {
      res.status(422).json({ message: 'O e-mail é obrigatório!' });
      return;
    }

    // check if user exists
    const userExists = await User.findOne({ email: email });

    if (user.email !== email && userExists) {
      res.status(422).json({ message: 'Por favor, utilize outro e-mail!' });
      return;
    }

    user.email = email;

    if (image) {
      const imageName = req.file.filename;
      user.image = imageName;
    }

    if (!phone) {
      res.status(422).json({ message: 'O telefone é obrigatório!' });
      return;
    }

    user.phone = phone;

    // check if password match
    if (password != confirmpassword) {
      res.status(422).json({ error: 'As senhas não conferem.' });

      // change password
    } else if (password == confirmpassword && password != null) {
      // creating password
      const salt = await bcrypt.genSalt(12);
      const reqPassword = req.body.password;

      const passwordHash = await bcrypt.hash(reqPassword, salt);

      user.password = passwordHash;
    }

    try {
      // returns updated data
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $set: user },
        { new: true },
      );
      res.json({
        message: 'Usuário atualizado com sucesso!',
        data: updatedUser,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
};
