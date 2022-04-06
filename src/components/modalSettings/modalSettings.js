import { useState, useContext } from "react";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";

import Typography from "@mui/material/Typography";

import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import "./modalSettings.sass";
import { settingsContext } from "../../contexts/context";

export default function ModalSettings(props) {
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
                    <Typography gutterBottom>gain</Typography>
                    <Slider
                        max={12}
                        min={1}
                        name="gain"
                        sx={{ margin: "30px auto", width: "70%" }}
                        value={modalSettings.gain}
                        valueLabelDisplay="auto"
                        onChange={(e) => {
                            setModalSettings({
                                ...modalSettings,
                                gain: e.target.value,
                            });
                        }}
                    />
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
