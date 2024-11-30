import { Route, Routes } from "react-router-dom";
import MyDrawer from "./Components/mui-components/MyDrawer";
import Student from "./Components/Pages/Student";
import Choice from "./Components/Pages/Choice";
import Specialty from "./Components/Pages/Specialty";
import Box from "@mui/material/Box";
const drawerWidth = 240;
function App() {
  return (
    <>
      <MyDrawer drawerWidth={drawerWidth} />
      <Box
        component="main"
        sx={{ ml: `${drawerWidth}px`, width: `100% -${drawerWidth}` }}
      >
        {/* <Router> */}
        <Routes>
          <Route path="/" element={<Student />} />
          <Route path="/specialty" element={<Specialty />} />
          <Route path="/choice" element={<Choice />} />
        </Routes>
        {/* </Router> */}
      </Box>
    </>
  );
}

export default App;
