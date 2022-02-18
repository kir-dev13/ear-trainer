import { useState, useEffect, useRef } from "react";
import Player from "./components/Player/Player";

import InputAudioFile from "./components/inputAudioFile/inputAudioFile";
import "./App.css";
import "./App.sass";

function App() {
  const [tracks, setTracks] = useState([]);

  function loadAudioFiles(audioFiles, e) {
    if (audioFiles.length > 0) {
      setTracks([...audioFiles]);
    } else {
      console.log("ни одного аудио файла не было загружено");
    }
    e.target.value = "";
  }

  return (
    <div className="App">
      <InputAudioFile
        trackName={tracks[0]?.name}
        loadAudioFiles={loadAudioFiles}
      />

      <Player selectedTrack={tracks[0]} />
    </div>
  );
}

export default App;
