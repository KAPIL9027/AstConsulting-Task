const TelegramBot = require('node-telegram-bot-api')
const axios = require('axios')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const Subscription = require('./models/User')
dotenv.config()
// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELBOT_API_KEY;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

mongoose.connect(process.env.DB_URL).then(()=>{
console.log("Database connected!!!");
}).catch((e)=>{
    console.log(e.message);
})


// Matches "/echo [whatever]"
bot.onText(/\/subscribe (.+)/, async (msg, match) => {
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
    const currentUser = await Subscription.find({chatId});
    
    if(!currentUser)
    {
        const user = await Subscription.create({chatId,city: resp});
        console.log(user);
    }
    else
    {
        console.log("Already exists");
        console.log(currentUser);
        
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
  
