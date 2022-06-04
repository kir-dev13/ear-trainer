import { useContext, useState, useEffect } from "react";
import { dataContext } from "../../../contexts/context";

import "./LoadAudioFile.sass";

// const fetchFilesList = async () => {
//     await setTimeout(() => {}, 1000);
//     return "список загружен";
// };

// const prepareFileList = async () => {
//     const response = await fetchFilesList();
//     return response;
// };
// const res = prepareFileList();

// console.log(res);

const LoadAudioFile = ({ loadAudioFiles }) => {
    const [filesList, setFilesList] = useState(["список файлов от сервера"]);
    const [state, dispatch] = useContext(dataContext);

    // const s = state?.track ? { height: "56px" } : {};

    const ServerFilesList = () => {
        return (
            <p>
                {filesList.map((item, i) => (
                    <span className="list-item" key={i}>
                        {item}
                    </span>
                ))}
            </p>
        );
    };

    return (
        <div>
            <span>файлы с сервера:</span>
            <ServerFilesList />
        </div>
    );
};

export default LoadAudioFile;
