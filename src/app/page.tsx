import { useState } from 'react'
import { Box, Tab, Tabs } from '@mui/material';
import FornitoriTable from './components/tables/FornitoriTable';
import DestinazioniTable from './components/tables/DestinazioniTable';
function Home() {

  const [activeTab, setActiveTab] = useState(0);

    
       
 
  return (
    <><Box sx={{height:'100%' , width:'100%'}}>
      <Tabs
        value={activeTab}
        onChange={(_event, newValue) => setActiveTab(newValue)}
        indicatorColor="primary"
        textColor="primary"
        centered 
       
      >
        <Tab  label="Fornitori" />
        <Tab label="Destinazioni" />
      </Tabs>
      
      {activeTab === 0 && (
        <FornitoriTable/>
      )}
      {activeTab === 1 && (
        <DestinazioniTable/>
      )}</Box>
    </>
  )
}

export {Home as Component};