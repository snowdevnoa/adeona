import MessageService from "../services/message-service.js";

// Define controllers as a express request handler, not a async function

const message = new MessageService();

export const getMessage = async (req, res) =>{
  try{
    const result = await message.getMessage();
    // res.status(200).send(`${result}`)
    // use res.json instead to serve frontend better
    res.status(200).json({ message: result });

  }
  catch(err){
     console.error("Controller error:", err.message);
    res.status(500).send("Internal Server Error");
  }
}