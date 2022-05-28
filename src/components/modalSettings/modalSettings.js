import { useState, useContext } from "react";

import { defaultFiltersList } from "../../logic/defaultSettings";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";

import Typography from "@mui/material/Typography";

import Slider from "@mui/material/Slider";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";

import { settingsContext } from "../../contexts/context";
import { Stack } from "@mui/material";
import "./modalSettings.sass";

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

    const handleChangeFilters = (e) => {
        setModalSettings({
            ...modalSettings,
            difficult: e.target.value,
        });
    };

    const handleSaveChange = () => {
        const newFiltersList =
            modalSettings.difficult === "common"
                ? defaultFiltersList.filter(
                      (item) => item.difficult === "common"
                  )
                : defaultFiltersList;
        setSettings({ ...modalSettings, filtersList: newFiltersList });
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
                                marginBottom: "40px",
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
                                alignSelf: "baseline",
                                width: "10px",
                            }}
                        >
                            {modalSettings.timeQuestion / 1000}
                        </span>
                        <FormControl
                            sx={{
                                flexBasis: "100%",
                            }}
                        >
                            <FormLabel id="demo-radio-buttons-group-label">
                                Набор фильтров
                            </FormLabel>
                            <RadioGroup
                                value={modalSettings.difficult}
                                name="radio-buttons-group"
                                onChange={handleChangeFilters}
                            >
                                <FormControlLabel
                                    value="common"
                                    control={<Radio />}
                                    label="основной"
                                />
                                <FormControlLabel
                                    value="advanced"
                                    control={<Radio />}
                                    label="расширенный"
                                />
                            </RadioGroup>
                        </FormControl>
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
