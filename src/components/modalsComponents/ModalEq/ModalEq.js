import { useEffect, useState, useContext } from "react";
import { settingsContext } from "../../../contexts/context";

import { createAndConnectFilters } from "../../../logic/createFilters";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Stack } from "@mui/material";

import "./modalEq.sass";

const ModalEq = ({ wavesurfer }) => {
    const [openEq, setOpenEq] = useState(false);
    const [settings, setSettings] = useContext(settingsContext);

    const [throwaway, ...filters] = settings.filtersList;
    const [eqSliders, setEqSliders] = useState(filters);

    useEffect(() => {
        setSettings({
            ...settings,
            filtersList: [
                { f: 0, type: "peaking", difficult: "common", initialGain: 0 },
                ...eqSliders,
            ],
        });
    }, [eqSliders]);

    const handleOpenEq = () => {
        setOpenEq(true);
    };

    const handleCloseEq = () => {
        if (wavesurfer) {
            createAndConnectFilters(wavesurfer, [
                { f: 0, type: "peaking", difficult: "common", initialGain: 0 },
                ...eqSliders,
            ]);
        }
        setOpenEq(false);
    };

    const onHandleChange = (e, slider) => {
        const currentFilter = wavesurfer.filters.filter(
            (filter) => filter.frequency.value === slider.f
        );
        currentFilter[0].gain.value = e.target.value;

        const arr = eqSliders.map((item) =>
            item.f === slider.f
                ? { ...item, initialGain: ~~e.target.value }
                : item
        );

        setEqSliders(arr);
    };
    return (
        <div>
            <IconButton
                color="primary"
                disabled={!!!wavesurfer}
                onClick={handleOpenEq}
            >
                <EqualizerIcon className="btn" style={{ fontSize: "30px" }} />
            </IconButton>
            <Dialog className="modal" open={openEq} onClose={handleCloseEq}>
                <DialogContent>
                    <Stack>
                        <div className="eq-container">
                            {eqSliders.map((slider, i) => {
                                return (
                                    <div className="eq-slider" key={i}>
                                        <input
                                            onChange={(e) =>
                                                onHandleChange(e, slider)
                                            }
                                            style={{ display: "inlineBlock" }}
                                            type="range"
                                            min="-12"
                                            max="12"
                                            name={slider.f}
                                            value={slider.initialGain}
                                            orient="vertical"
                                        />
                                        <label htmlFor={slider.f}>
                                            {slider.f}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </Stack>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ModalEq;
