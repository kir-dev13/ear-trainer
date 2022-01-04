import { useState } from "react";
import InputAudioFile from "./components/inputAudioFile/inputAudioFile";
import "./App.css";
import "./App.sass";

function App() {
    const [tracks, setTracks] = useState([]);

    function checkInputFiles(data, finalData, dataType) {
        const resultFiles = [];
        for (let file of data) {
            if (finalData.length + resultFiles.length < 5) {
                if (dataType.test(file.type)) {
                    resultFiles.push(file);
                } else {
                    console.log("не аудио!");
                }
            } else {
                console.log("попытались загрузить больше файлов");
            }
        }
        return resultFiles;
    }

    function loadAudioFiles(e) {
        const audioType =
            /audio\/mpeg|audio\/mp3|audio\/mp4|audio\/ogg|audio\/x+|wav/;
        const audioFiles = checkInputFiles(e.target.files, tracks, audioType);
        // const files = [];
        // console.log("загруженные файлы: ", e.target.files);
        // for (let file of e.target.files) {
        //     if (tracks.length + files.length < 5) {
        //         //когда 4, то добавляется ещё один, пятый, file
        //         if (
        //             /audio\/mpeg|audio\/mp3|audio\/mp4|audio\/ogg|audio\/x+|wav/.test(
        //                 file.type
        //             )
        //         ) {
        //             files.push(file);
        //         } else {
        //             console.log("не аудио!");
        //         }
        //     } else {
        //         console.log("попытались загрузить больше файлов или не аудио");
        //     }
        // }

        audioFiles.length > 0
            ? setTracks([...tracks, ...audioFiles])
            : console.log("ни одного аудио файла не было загружено");

        e.target.value = "";
    }

    return (
        <>
            <InputAudioFile loadAudioFiles={loadAudioFiles} />
            <button
                onClick={() => {
                    // playMusic();
                    console.log(tracks);
                    console.log(tracks.length);
                }}
            >
                Play
            </button>
        </>
    );
}

export default App;
