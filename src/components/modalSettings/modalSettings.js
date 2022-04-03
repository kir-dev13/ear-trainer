import { useState } from "react";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

export default function ModalSettings() {
    const [openSettings, setOpenSettings] = useState(false);

    const handleOpenSettings = () => {
        setOpenSettings(true);
    };

    const handleCloseSettings = () => {
        setOpenSettings(false);
    };

    return (
        <div>
            <IconButton color="primary" onClick={handleOpenSettings}>
                <SettingsIcon className="btn" style={{ fontSize: "40px" }} />
            </IconButton>
            <Dialog open={openSettings} onClose={handleCloseSettings}>
                <DialogTitle>Settings</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSettings}>Cancel</Button>
                    <Button onClick={handleCloseSettings}>Subscribe</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
