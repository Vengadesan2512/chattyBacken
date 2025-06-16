import { upsertstreamUSer } from "../DB/stream.js";
import User from "../Models/user.js";
import jwt from "jsonwebtoken";
export async function signup(req, res) {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All Inputs are Required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be least 6 letters" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "This Email is Already Exist" });
    }
    const index = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${index}.png`;
    const newUser = await User.create({
      email,
      fullName,
      password,
      profilephoto: randomAvatar,
    });
    try {
      await upsertstreamUSer({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilephoto || "",
      });
      console.log(`stream user created for ${newUser.fullName}`);
    } catch (error) {
      console.log("error creating stream user", error);
    }

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRETE_KEY,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "Production",
    });
    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ message: "server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All Inputs are Required" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const ispasswordCorrect = await user.matchPassword(password);

    if (!ispasswordCorrect)
      return res.status(401).json({ message: "Invalidd email or password" });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRETE_KEY, {
      expiresIn: "7d",
    });
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "Production",
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in login controller", error);
    res.status(500).json({ message: "server error" });
  }
}

export async function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({ sucess: true, messgae: "logout succesfully" });
}
