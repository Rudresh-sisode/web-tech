
import sound from '../../assets/sound.svg';
import ellipse from '../../assets/Ellipse 5.svg';
import polygone1 from '../../assets/Polygon 1.svg';
import polygone2 from '../../assets/Polygon 2.svg';
import star1 from '../../assets/Star 1.svg';
import star2 from '../../assets/Star 2.svg';

import Vapi from '@vapi-ai/web';

import {  useRef, useState } from 'react';
import Lottie from "lottie-react";

import siriAnim from '../../lotties/siri-anim.json';

let i = 0;

const vapi = new Vapi(import.meta.env.VITE_REACT_APP_VAPI_PUBLIC_API as string); // Vapi public key

enum CALLSTATUS {
  VOID,
  CONNECTING,
  LISTENING,
  SPEAKING,
  CALLSTOP
}

const AssistanceName = "Aavani";

export default function MeeraAssistance() {

  const [isListening, setIsListening] = useState(CALLSTATUS.VOID);
  const lottieRefs:any = useRef();


 
  
  const startCall = () => {
    debugger;
    try {
         vapi.start(import.meta.env.VITE_REACT_APP_VAPI_ASSISTANCE_ID as string); // assistance ID
    setIsListening(CALLSTATUS.CONNECTING);
    }
    catch (e: any) {
      debugger;
      alert("Error: " + e.message);
    }
 
  };


  const stopCall = () => {
   
    vapi.stop();
    setIsListening(CALLSTATUS.CALLSTOP);
  };



  vapi.on("error", (e) => {
    i++;
    console.error('error count\t',i);
    console.error('your error\t',e);

   
    vapi.stop();
    setIsListening(CALLSTATUS.CALLSTOP);
    throw new Error(e);
  });

  vapi.on("call-end", () => {
    vapi.stop();
    console.log("Call has ended.");
    setIsListening(CALLSTATUS.CALLSTOP);
  });

  vapi.on("speech-start", () => {
    setIsListening(CALLSTATUS.SPEAKING);
    console.log("Assistant speech has started.");
  });

  vapi.on("speech-end", () => {
    setIsListening(CALLSTATUS.LISTENING);
    console.log("Assistant speech has ended.");
  });

  vapi.on("call-start", () => {

    setIsListening(CALLSTATUS.CONNECTING);

    console.log("Call has started.");
  });

  return (
    <div className='assistance-Wrapper'>
      <img src={ellipse} alt='ellipse' className='ellipse' width={20} height={20} />
      <img src={polygone1} alt='polygone' className='polygone1' width={20} height={20} />
      <img src={polygone2} alt='polygone' className='polygone2' width={20} height={20} />
      <img src={star1} alt='star' className='star1' width={20} height={20} />
      <img src={star2} alt='star' className='star2' width={20} height={20} />
      <div className='header'>
        <div className='logo'>Creole's Assistant</div>
        <button onClick={() => {
          throw new Error('This is a test error');
        }}>Profile</button>
      </div>
      <div className='assistance-content'>
        <div className='assistance-container'>
          <div className='title-header'>
            <h2>Aavani AI</h2>
          </div>
          <div className='assistance-controler'>
            <div className='assistance-img'>
              {/* <img src={assistanceImg} alt='assistanceImg' width={224} height={213} /> */}
              <div className='lottie-wrapper'>
                <Lottie
                  loop={true}
                 lottieRef={lottieRefs}
                animationData={siriAnim}
                height={80}
                width={80}
              />
              </div>
            </div>
            <h2>
              {
                isListening == CALLSTATUS.VOID ? `I'm ${AssistanceName}, you can call me!` : 
                  isListening == CALLSTATUS.CONNECTING ?  `Calling to ${AssistanceName}...` :
                    isListening == CALLSTATUS.SPEAKING ? `${AssistanceName} is speaking...` :
                      isListening == CALLSTATUS.LISTENING ? `${AssistanceName} is listening...` :
                        isListening == CALLSTATUS.CALLSTOP ? "Call Ended!" : ""
              }
           
            </h2>
            <div className='btn-wrapper'>
              <button onClick={startCall}> <img src={sound} alt='sound' width={24} height={24} /> Start Call</button>
              <button onClick={stopCall}>  <img src={sound} alt='sound' width={24} height={24} /> End Call</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
