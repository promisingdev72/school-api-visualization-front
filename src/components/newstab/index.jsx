import * as React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { HOST_API } from "../../config";

const NewsWrap = styled("div")(() => ({
  padding: "50px",
}));

const TabItemCustome = (props) => {
  const { title, imageUrl, date, blurb } = props;
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          textAlign: "left",
        }}
      >
        <Box>
          <Typography fontSize={10}>{date}</Typography>
          <Typography>{title}</Typography>
          <Typography fontSize={10}>{blurb}</Typography>
        </Box>
        <Box
          component="img"
          src={imageUrl}
          sx={{ width: "50px", height: "50px", marginLeft: "10px" }}
        />
      </Box>
    </>
  );
};

TabItemCustome.prototype = {
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  blurb: PropTypes.string.isRequired,
};

function NewsPanel(props) {
  const { children, value, index, title, date, article, ...other } = props;
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      sx={{ width: "100%" }}
      {...other}
    >
      {value === index && (
        <>
          <Box sx={{ p: 3, display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography sx={{color:'#006db0'}}>{title.toUpperCase()}</Typography>
              <Typography>{date}</Typography>
            </Box>
          </Box>
          <Box>
            <div dangerouslySetInnerHTML={ { __html: article}} ></div>

          </Box>
        </>
      )}
    </Box>
  );
}

NewsPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  imageUrl: PropTypes.string.isRequired,
  article: PropTypes.string.isRequired,

};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function VerticalTabs() {
  const [value, setValue] = React.useState(0);
  const [feed, setFeed] = React.useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log("This",newValue);
  };

  React.useEffect(() => {
    let resArray = [];
    axios({
      url: `${HOST_API}/api/getnewsfeed`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if(res.data.length !== 0){
        resArray = res.data;
        resArray.sort((resArray,b)=>{
          return new Date(b.publishAt.json) - new Date(resArray.publishAt.json)
        })
        console.log("This is res data",resArray);
        setFeed(resArray);
      }
    });
  }, []);

  return (
    <NewsWrap>
      <Box sx={{display:'flex',justifyContent:'start',alignItems:'center'}}>
        <Box
          component={"img"}
          src="/logo.png"
          sx={{ width: "100px", height: "100px",marginRight:'30px'}}
        />
        <Typography variant="h4" gutterBottom component="div" sx={{color:'#006db0'}}>CH@LK News</Typography>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: "flex",
          height: "800px",
        }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="News Tabs"
          sx={{ borderRight: 1, borderColor: "divider", width: "500px" }}
        >
          {feed.map((feed,index) =>{
            return(
              <Tab
                label={
                  <TabItemCustome
                    key={feed.id}
                    title={feed.title}
                    imageUrl={feed.featureImage && `https://chalk.loreto.nsw.edu.au/storage/image.php?hash=${feed.featureImage.hash}`}
                    date={feed.publishAt.long}
                    blurb={feed.blurb}
                    {...a11yProps(index)}
                  />
                }
              />
            )
          })}
        </Tabs>
        <Box
          sx={{ width: "100px"}}
        />
        {
          feed.map((feed,index)=>{
            return(
              <NewsPanel
                key={feed.id}
                value={value}
                index={index}
                title={feed.title}
                date={feed.publishAt.long}
                article={feed.article}
              />
            )
          })
        }

      </Box>
    </NewsWrap>
  );
}
