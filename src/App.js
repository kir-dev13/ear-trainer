import InputAudioFile from "./components/inputAudioFile/inputAudioFile";

import "./App.css";

function App() {
    return (
        <>
            <InputAudioFile />
            <button
                onClick={() => {
                    // playMusic();
                }}
            >
                Play
            </button>
        </>
    );
}

export default App;
