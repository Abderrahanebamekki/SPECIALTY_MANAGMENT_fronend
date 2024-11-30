import { Outlet } from "react-router-dom";
import Appbar from "./mui-components/Appbar";
import MyDrawer from "./mui-components/MyDrawer";
import Box from "@mui/material/Box";
const drawerWidth = 240;

function Root() {
    return (
        <div>
            <Appbar drawerWidth={drawerWidth} />
            <MyDrawer drawerWidth={drawerWidth} />
            <Box component="main" sx={{ ml: `${drawerWidth}px` }}>
                <Outlet />
            </Box>
        </div>
    );
}

export default Root;
