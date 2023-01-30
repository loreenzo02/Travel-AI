import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';
import { useState } from 'react';

const Home = () => {

  const MAX_MONTH_DAYS = 31;
  const ONE = 1;

  
  const [userInput, setUserInput] = useState('');


  const onUserChangedText = (event) => {
    setUserInput(event.target.value);
  }


  const [userAirportInput, setUserAirportInput] = useState('');


  const updateAirportInput = (event) => {
    setUserAirportInput(event.target.value);
  }


  const [userCountryInput, setUserCountryInput] = useState('');


  const updateCountryInput = (event) => {
    setUserCountryInput(event.target.value);
  }


  const [userNumInput, setUserNumInput] = useState(1);


  const onDownClick = async () => {
    if (userNumInput > ONE) {
      setUserNumInput(userNumInput - 1);
    }
  }


  const onUpClick = async () => {
    if (userNumInput < MAX_MONTH_DAYS) {
      setUserNumInput(userNumInput + 1);
    }
  }


  const [apiOutput, setApiOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [averagePrice, setAveragePrice] = useState('')


  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    var destinationsList = userInput + "."
    const response = await fetch('/api/generate', {
      method:'POST',
      headers:{
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ destinationsList, userNumInput, userAirportInput, userCountryInput }),
    });

    const data = await response.json();
    const { output } = data;

    setApiOutput(output);

    setIsGenerating(false);
  }


  return (
    <div className="root">
      <Head>
        <title>GPT-3 Writer | buildspace</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Travel AI</h1>
          </div>
        </div>
        <div className="prompt-container">
          <h2>Introduce where you want to travel.</h2>
          <textarea 
            placeholder="Introduce a list of countries." 
            className="prompt-box" 
            value={userInput}
            onChange={onUserChangedText}
          />
          <h2>Introduce the days you want to travel.</h2>
          <div className="number-promp">
            <input 
              type="number" 
              className="prompt-days"
              name="days" 
              value={userNumInput} 
            />
            <button onClick={onDownClick}>-</button>
            <button className="up-button" onClick={onUpClick}>+</button>
          </div>
          <h2>Introduce the airport name and the country where you want to start the travel.</h2>
          <div className="ubication-box">
            <input 
              type="text"
              placeholder="Introduce the airport." 
              className="airport-prompt" 
              value={userAirportInput}
              onChange={updateAirportInput}
            />
            <input 
              type="text"
              placeholder="Introduce the country." 
              className="country-prompt" 
              value={userCountryInput}
              onChange={updateCountryInput}
            />
          </div>
          <div className="prompt-buttons">
            <a className={isGenerating ? 'generate-button loading' : 'generate-button'}
               onClick={callGenerateEndpoint}
            >
              <div className="generate">
                {isGenerating ? <span className="loader"></span> : <p>Generate</p>}
              </div>
            </a>
          </div>
          {apiOutput && (
            <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3>Output</h3>
                </div>
              </div>
              <div className="output-content">
                <p>{apiOutput}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
