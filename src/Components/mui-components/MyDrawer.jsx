import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ArticleIcon from "@mui/icons-material/Article";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import ListItemText from "@mui/material/ListItemText";
import {  useNavigate } from "react-router-dom";
// eslint-disable-next-line react/prop-types
export default function MyDrawer({ drawerWidth }) {
    const navigate = useNavigate();
    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                },
            }}
            variant="permanent"
            anchor="left"
            // @ts-ignore
            open={true}
        >
            <Toolbar />
            <Divider />
            {/* <MyList /> */}
            <List>
                {/* ==========================> Students Paget <================== */}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/")}>
                        <ListItemIcon  >
                            <AccountBoxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Students" />
                    </ListItemButton>
                </ListItem>
                {/* ==========================> Speciality Paget <================== */}
                <ListItem disablePadding>
                    <ListItemButton onClick={()=> navigate("/specialty")}>
                        <ListItemIcon >
                            <ArticleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Specialties" />
                    </ListItemButton>
                </ListItem>
                {/* ==========================> Choice Paget <================== */}

                <ListItem disablePadding>
                    <ListItemButton  onClick={() => navigate("/choice")}>
                        <ListItemIcon>
                            <DownloadDoneIcon />
                        </ListItemIcon>
                        <ListItemText primary="Choices" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
    );
}
