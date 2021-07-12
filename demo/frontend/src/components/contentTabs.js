import React, { useState } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import ExhibitTable from "./exhibitTable";
import MetaTable from "./metaTable";
import { useContentTabStyles } from "./styles";

/** Used in movingLine component to switch content and format original data */

const a11yProps = (index) => ({
  tid: `tab-${index}`,
  "aria-controls": `tabpanel-${index}`,
});

const ContentTabs = (props) => {
  const classes = useContentTabStyles();
  const [tabIndex, setTabIndex] = useState(0);
  function handleChange(event, newValue) {
    setTabIndex(newValue);
  }
  return (
    <>
      <Tabs
        value={tabIndex}
        onChange={handleChange}
        aria-label="Content Tab"
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="Result List" {...a11yProps(0)} />
        <Tab label="Meta-data" {...a11yProps(1)} />
      </Tabs>
      <Box
        role="tabpanel"
        index={0}
        hidden={tabIndex !== 0}
        tid="tabpanel-0"
        aria-labelledby="tab-0"
        className={classes.flexContainer}
      >
        <ExhibitTable {...props} />
      </Box>
      <Box
        role="tabpanel"
        index={1}
        hidden={tabIndex !== 1}
        tid="tabpanel-1"
        aria-labelledby="tab-1"
        className={classes.flexContainer}
      >
        <MetaTable data={props.data} />
      </Box>
    </>
  );
};

export default ContentTabs;
