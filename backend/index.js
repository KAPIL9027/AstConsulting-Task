const TelegramBot = require('node-telegram-bot-api')
const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')
const Subscription = require('./models/User')
const Settings = require('./models/Settings')
const cron = require('node-cron');
const express = require('express');
const cors  = require('cors');
const app = express();

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELBOT_API_KEY;
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});


app.use(express.urlencoded({extended: true}));
app.use(express.json({extended: true}));
app.use(cors());

mongoose.connect(process.env.DB_URL).then(()=>{
console.log("Database connected!!!");
}).catch((e)=>{
    console.log(e.message);
})

cron.schedule('8 16 * * *', async ()=>{
  console.log('cron job started');
  
const subscribers = await Subscription.find({subscription: "active"});
subscribers.forEach(async (subscriber)=>{
const res = await axios(`https://api.openweathermap.org/data/2.5/weather?q=${subscriber?.city}&appid=${process.env.OPEN_WEATHER_API_KEY}&units=metric`);
  const data = res.data;
bot.sendMessage(subscriber.chatId, `Your Daily Weather Update is here:\nCity: ${data?.name}\nCountry: ${data.sys.country}\nCondition: ${data?.weather[0].main}\nTemperature: ${data?.main?.temp}°C\nFeels Like: ${data?.main?.feels_like}°C\nMinimum Temp: ${data?.main?.temp_min}°C\nMaximum Temp: ${data?.main?.temp_max}°C\n`);
})

});

// Matches "/echo [whatever]"
bot.onText(/\/subscribe (.+)/, async (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  console.log(msg);
  const chatId = msg.chat.id;
  const name = msg.chat.first_name;
  try{
    console.log(resp);
    const res = await axios(`https://api.openweathermap.org/data/2.5/weather?q=${resp}&appid=${process.env.OPEN_WEATHER_API_KEY}&units=metric`);
    const data = res.data;
    console.log(data);
   
    const currentUser = await Subscription.findOne({chatId});
    console.log(currentUser);
    if(!currentUser)
    {
        const user = await Subscription.create({name,chatId,city: resp,subscription: "active"});
        console.log(user);
    }
    else
    {
        const updateUser = await Subscription.updateOne(currentUser,{city:resp});
        console.log(updateUser);
        
    }
    bot.sendMessage(chatId, `City: ${data?.name}\nCountry: ${data.sys.country}\nCondition: ${data?.weather[0].main}\nTemperature: ${data?.main?.temp}°C\nFeels Like: ${data?.main?.feels_like}°C\nMinimum Temp: ${data?.main?.temp_min}°C\nMaximum Temp: ${data?.main?.temp_max}°C\n`);
  }
  catch(e)
  {
    console.log(e.message);
    bot.sendMessage(chatId,'Please write the command in the format of /subscribe [cityname]')
   
  }
});


bot.onText(/\/weather (.+)/, async (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message
  
    
    const resp = match[1]; // the captured "whatever"
  
    // send back the matched "whatever" to the chat
    const chatId = msg.chat.id;
    try{
      console.log(resp);
      const res = await axios(`https://api.openweathermap.org/data/2.5/weather?q=${resp}&appid=${process.env.OPEN_WEATHER_API_KEY}&units=metric`);
      const data = res.data;
      console.log(data);
      bot.sendMessage(chatId, `City: ${data?.name}\nCountry: ${data.sys.country}\nCondition: ${data?.weather[0].main}\nTemperature: ${data?.main?.temp}°C\nFeels Like: ${data?.main?.feels_like}°C\nMinimum Temp: ${data?.main?.temp_min}°C\nMaximum Temp: ${data?.main?.temp_max}°C\n`);
    }
    catch(e)
    {
      console.log(e.message);
      bot.sendMessage(chatId,'Please write the command in the format of /weather [cityname]')
     
    }
  });



  /*Rest Api which will be used by the admin portal*/


  // to get all the subscribed users from the database
  app.get('/users',async (req,res)=>{
  const users = await Subscription.find({});
  res.status(200).json(users);
  })
  
  // to block/unblock a user 
  app.put('/block/:id',async (req,res)=>{
  const id = req.params.id;
  const user = await Subscription.findById({_id: id});
  user.subscription  = user.subscription === 'active' ? 'blocked' : 'active';
  await user.save();
  console.log(user);
  res.status(200).json({msg: "Success!!!"});
  
  })

  // to delete a user
  app.delete('/delete/:id',async (req,res)=>{
  const id = req.params.id;
  await Subscription.deleteOne({_id: id});
  res.status(200).json({msg: "Succesfully deleted!!!"});
  })


  // to get all the bot settings
  app.get('/bot',async (req,res)=>{
    const settings = await Settings.findOne({});
    res.status(200).json(settings);
  })

  app.put('/bot/update/:id',async(req,res)=>{
    const settings = req.body;
    const id = req.params.id;
    const curSetting = await Settings.findById({_id: id});
    const updated = await Settings.updateOne(curSetting,settings);
    console.log(updated);
    res.status(200).json({msg: "successfull!!!"});
  })

  app.listen('3000',async ()=>{
    console.log("Server Listening on port 3000");
  })

  
  
