import { useEffect, useState, useContext } from "react";
import { settingsContext } from "../../../contexts/context";

import { createAndConnectFilters } from "../../../logic/createFilters";

import { Slider, Typography } from "@mui/material";
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

    const handleReset = () => {
        wavesurfer.filters.forEach((filter) => (filter.gain.value = 0));
        setEqSliders((prevState) => {
            const newState = prevState.map((slider) => ({
                ...slider,
                initialGain: 0,
            }));
            return newState;
        });
    };

    const onHandleChange = (e, newValue) => {
        const currentFilter = wavesurfer.filters.filter(
            (filter) => filter.frequency.value === +e.target.name
        );
        currentFilter[0].gain.value = ~~newValue;

        const arr = eqSliders.map((item) =>
            item.f === +e.target.name
                ? { ...item, initialGain: ~~newValue }
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
                    <Stack
                        sx={{ height: 150 }}
                        // spacing={1}
                        direction="row"
                        className="eq-container"
                    >
                        {eqSliders.map((slider, i) => {
                            return (
                                <div key={i} className="eq-slider">
                                    <Slider
                                        sx={{
                                            '& input[type="range"]': {
                                                WebkitAppearance:
                                                    "slider-vertical",
                                            },
                                            height: "150px",
                                        }}
                                        valueLabelDisplay="auto"
                                        orientation="vertical"
                                        max={12}
                                        min={-12}
                                        name={`${slider.f}`}
                                        value={slider.initialGain}
                                        onChange={onHandleChange}
                                        aria-label={`${slider.f}`}
                                    />
                                    <Typography>{slider.f}</Typography>
                                </div>
                            );
                        })}
                    </Stack>
                </DialogContent>
                <DialogActions
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Button onClick={handleReset}>Сбросить эквалайзер</Button>
                    <Button onClick={handleCloseEq}>Закрыть</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ModalEq;
