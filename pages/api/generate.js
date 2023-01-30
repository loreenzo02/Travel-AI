import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const YES_DOWN = "yes";
const YES_UP = "Yes";

const basePromptPrefix = "Could you organize me a travel with the following travel list?";
const daysPrompt = " I only want to be "
const days = " days."
const airport = " I want to start in "
const destinationsList = ". Please recommend me touristic places and describe it. Moreover, give me details about the means of transport I can use from the country I told.\nDestinations list: ";

const airportComprobation = "Does this airport exists in this country? Airport Name: ";
const country = "\nCountry Name: ";

const averagePricePropmt = "Give me a price range in dollars using the next travel itinerary, only write the price please. Travel itinerary: ";

const generateAction = async (req, res) => {

  const airportCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${airportComprobation}${req.body.userAirportInput}${country}${req.body.userCountryInput}\nYes or No answer: `,
    temperature: 1,
    max_tokens: 3,
  });

  const airportPromptOutput = airportCompletion.data.choices.pop()


  if (airportPromptOutput.text.includes(YES_DOWN) || airportPromptOutput.text.includes(YES_UP)){

    const baseCompletion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${basePromptPrefix}${daysPrompt}${req.body.userNumInput}${days}${destinationsList}${req.body.destinationsList}`,
      temperature: 1,
      max_tokens: 1024,
    });
    
    const basePromptOutput = baseCompletion.data.choices.pop();


    const avPriceCompletion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${averagePricePropmt}${basePromptOutput.text}`,
      temperature: 1,
      max_tokens: 50,
    });

    const avpricePrompOutput = avPriceCompletion.data.choices.pop();

    res.status(200).json({ output: `${basePromptOutput.text} ${avpricePrompOutput.text}` });
  }else{
    res.status(200).json({ output: `Airport Error.` });
  }
};

export default generateAction;