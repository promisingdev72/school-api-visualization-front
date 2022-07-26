import * as React from "react";
import axios from "axios";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { HOST_API } from "../../config";

export default function CalendarsAccordions() {
  const [expanded, setExpanded] = React.useState(false);
  const [calendars, setCalendars] = React.useState([]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  

  React.useEffect(() => {
    let resArray = [];
    axios({
      url: `${HOST_API}/api/getcalendars`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if(res.data.length !== 0){
        resArray = res.data;
        setCalendars(resArray);
      }
    });
  }, []);

  // React.useEffect(()=>{
  //   console.log('calendars',calendars);
  // },[calendars])

  return (
    <div style={{ padding: "50px" }}>
      <Typography sx={{ marginBottom: "30px" }}>CALENDAR EVENTS</Typography>
      {
        calendars.map((calendar,index1)=>{
          return(
            <Box key={index1}>
            <Typography fontSize={16} textAlign='right' sx={{mr:'10px'}}>{new Date(calendars[index1][0].dtstart.value).toDateString().slice(0,3)}</Typography>
              {
                calendar.map((calendardata,index2)=>{
                  return(
                    <>
                        <Accordion
                          expanded={expanded === `panel${index1+1}${index2+1}`}
                          onChange={handleChange(`panel${index1+1}${index2+1}`)}
                          key={`${index1+1}${index2+1}`}
                          sx={{my:'10px'}}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel${index1+1}${index2+1}bh-content`}
                            id={`panel${index1+1}${index2+1}bh-header`}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                                paddingX: "10px",
                              }}
                            >
                              <Box>
                                <Typography fontSize={12}>{new Date(calendardata.dtstart.value).toDateString()}</Typography>
                                <Typography>{calendardata.summary.value}</Typography>
                                <Typography fontSize={12}>{calendardata.location.value}</Typography>
                              </Box>
                              {
                                calendardata.type === 'senior'? (
                                  <span
                                    style={{
                                      width: "15px",
                                      height: "15px",
                                      background:'#006db0',
                                      borderRadius: "15px",
                                    }}
                                  />
                                ):(
                                  <span
                                    style={{
                                      width: "15px",
                                      height: "15px",
                                      background: '#ffd13f',
                                      borderRadius: "15px",
                                    }}
                                  />
                                )
                              }
                              
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>
                              {calendardata.summary.value}
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                    </>
                      
                  )
                })
              }
            </Box>
          )
        })
      }
    </div>
  );
}
