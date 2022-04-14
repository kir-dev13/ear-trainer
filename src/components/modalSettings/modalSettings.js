import { useState, useContext } from "react";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";

import Typography from "@mui/material/Typography";

import Slider from "@mui/material/Slider";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import "./modalSettings.sass";
import { settingsContext } from "../../contexts/context";
import { Stack } from "@mui/material";

function ModalSettings(props) {
    const [openSettings, setOpenSettings] = useState(false);
    const [settings, setSettings] = useContext(settingsContext);
    const [modalSettings, setModalSettings] = useState(settings);

    const handleOpenSettings = () => {
        setOpenSettings(true);
    };

    const handleCloseSettings = () => {
        setOpenSettings(false);
    };

    const handleSaveChange = () => {
        setSettings(modalSettings);
        setOpenSettings(false);
    };

    return (
        <div>
            <IconButton color="primary" onClick={handleOpenSettings}>
                <SettingsIcon className="btn" style={{ fontSize: "40px" }} />
            </IconButton>
            <Dialog
                className="modal"
                open={openSettings}
                onClose={handleCloseSettings}
                style={{}}
            >
                <DialogTitle>Settings</DialogTitle>
                <DialogContent>
                    <Stack
                        sx={{
                            margin: "30px auto",
                            width: "80%",
                            display: "flex",
                            justifyContent: "space-around",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            alignContent: "center",
                        }}
                    >
                        <Typography
                            gutterBottom
                            sx={{
                                flexBasis: "100%",
                                marginBottom: "15px",
                                textAlign: "center",
                            }}
                        >
                            gain
                        </Typography>
                        <Slider
                            sx={{
                                width: "60%",
                                marginBottom: "35px",
                            }}
                            max={12}
                            min={1}
                            name="gain"
                            value={modalSettings.gain}
                            valueLabelDisplay="off"
                            onChange={(e) => {
                                setModalSettings({
                                    ...modalSettings,
                                    gain: e.target.value,
                                });
                            }}
                        />
                        <span
                            style={{
                                // width: "5%",
                                // padding: "10px",
                                alignSelf: "baseline",
                                width: "10px",
                            }}
                        >
                            {modalSettings.gain}
                        </span>
                        <Typography
                            gutterBottom
                            sx={{
                                flexBasis: "100%",
                                marginBottom: "15px",
                                textAlign: "center",
                            }}
                        >
                            время вопроса
                        </Typography>
                        <Slider
                            sx={{
                                width: "60%",
                            }}
                            max={12}
                            min={1}
                            name="timeQuestion"
                            value={modalSettings.timeQuestion / 1000}
                            valueLabelDisplay="off"
                            onChange={(e) => {
                                setModalSettings({
                                    ...modalSettings,
                                    timeQuestion: e.target.value * 1000,
                                });
                            }}
                        />
                        <span
                            style={{
                                // width: "5%",
                                // padding: "10px",
                                alignSelf: "baseline",
                                width: "10px",
                            }}
                        >
                            {modalSettings.timeQuestion / 1000}
                        </span>
                    </Stack>
                </DialogContent>
                <DialogActions
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Button onClick={handleCloseSettings}>Cancel</Button>
                    <Button onClick={handleSaveChange}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ModalSettings;
