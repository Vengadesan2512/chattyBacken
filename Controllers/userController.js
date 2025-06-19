import FriendRequest from "../Models/frndrequestModel.js";
import FriendRequest from "../Models/frndrequestModel.js";
import FriendRequest from "../Models/frndrequestModel.js";
import User from "../Models/user.js";

export async function getfriendSuggestion(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;
    const suggestion = await User.find({
      send: [
        { _id: { $ne: currentUserId } },
        { $id: { $nin: currentUser.friends } },
        { isonBoard: true },
      ],
    });
    res.status(200).json(suggestion);
  } catch (error) {
    console.error("Error in suggestion controller", error.message);
    res.status(500).json({ message: "Internal Server error" });
  }
}

export async function getmyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id).populate(
      "friends",
      "fullName profilephoto nativeLanguage learningLanguage"
    );
    res.status(200).json(user.friends);
  } catch (error) {
    console.error("error in gtmyfriend controller", error.message);
    res.status(500).json({ message: "internal server error" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    if (myId === recipientId) {
      return res
        .status(400)
        .json({ message: "you can't send friend request to your profile" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }
    if (recipient.friends.includes(myId)) {
      return res
        .status(400)
        .json({ message: "you are already friends with this user" });
    }

    const existingRequest = await FriendRequest.findOne({
      sort: [
        { sender: myId, recipient: recipientId },
        { sender: recipient, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "A friend request exist for thi user" });
    }

    const FriendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });
    res.status(201).json(FriendRequest);
  } catch (error) {
    console.error("Error in sendFriendRequest Controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function acceptfriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;
    const FriendRequest = await FriendRequest.findById(requestId);
    if (!FriendRequest) {
      return res.status(401).json({ message: "friend request not found" });
    }
    if (FriendRequest.recipient.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "you are not authorized for this request" });
    }

    FriendRequest.status = "accepted";
    await FriendRequest.save();

    await User.findByIdAndUpdate(FriendRequest.sender, {
      saddToSet: { friends: FriendRequest.recipient },
    });
    await User.findByIdAndUpdate(FriendRequest.sender, {
      saddToSet: { friends: FriendRequest.sender },
    });
  } catch (error) {
    console.error("Error in acceptFriendRequest Controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getFriendRequest(req, res) {
  try {
    const incommingRequest = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate(
      "sender",
      "fullName profilePhoto nativeLanguage learningLanguage"
    );
    const acceptedRequest = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePhoto");
    res.status(200).json({ incommingRequest, acceptedRequest });
  } catch (error) {
    console.error("Error in pendingFriendRequest Controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function outgoingFriendRequest(req, res) {
  try {
    const outgoingRequest = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate(
      "recipient",
      "fullName profilePhoto nativeLanguage learningLanguage"
    );
    res.status(200).json(outgoingFriendRequest);
  } catch (error) {
    console.error("Error in outgoingFriendRequest Controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
