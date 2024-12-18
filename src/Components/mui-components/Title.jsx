/* eslint-disable react/prop-types */
import Typography from '@mui/material/Typography';

const Title = ({ children }) => {
  return (
    <Typography
      variant="h2"
      gutterBottom
      sx={{
        mx: 9,
        display: "flex",
        fontSize: "2.5rem",
        fontWeight: "800",
        color: "#2c3e50",
        padding: "20px 0",
        borderBottom: "3px solid #ffa500",
        marginBottom: "30px",
        position: "relative",
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: "-3px",
          left: 0,
          width: "60px",
          height: "3px",
        },
        "&:hover": {
          color: "#ffa500",
          transition: "color 0.3s ease-in-out",
        },
      }}
    >
      {children}
    </Typography>
  );
};

export default Title;
