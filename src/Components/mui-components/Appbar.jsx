import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Link from '@mui/material/Link';
// eslint-disable-next-line react/prop-types
function Appbar({drawerWidth}) {
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Link
                        underline="none"
                        color="inherit"
                        href="/"
                        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
                    >
                        My omar
                    </Link>

                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>

        </div>
    );
}

export default Appbar;
