import { StreamChat } from "stream-chat";
import dotenv from "dotenv";

dotenv.config();

const streamapiKey = process.env.STREAM_KEY;
const streamapiScrete = process.env.STREAM_SCRETE;

if (!streamapiKey || !streamapiScrete) {
  console.error("Missing of API KEY or SECRETE KEY");
}

const streamClient = StreamChat.getInstance(streamapiKey, streamapiScrete);

export const upsertstreamUSer = async (userData) => {
  try {
    await streamClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.error("error in createStreamuser", error);
  }
};

export const generatestreamToken = (userId) => {};
