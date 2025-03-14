import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomeMobile } from './HomeMobile';
import { HeaderMobile } from './HeaderMobile';
import { NewMobile } from './NewMobiles';
import { UsedMobile } from './UsedMobile';
import { DemoMobile } from './DemoMobile';
import { ContactUs1 } from './ContactUs';
import { AllMobileCards } from './AllMobileCards';
import { GiftMobile } from './GiftMobile';
import { BottomMobileinfo } from './BottomStoreInfo';
import { CustomerManagement } from './CustomerManagement';

export function NavigateMobile() {
  return (

    <>

      <Router>
        <HeaderMobile />
        <Routes>
          <Route path="/" element={<HomeMobile />} />
          <Route path="/NewMobile" element={<NewMobile />} />
          <Route path="/UsedMobile" element={<UsedMobile/>} />
          <Route path="/DemoMobile" element={<DemoMobile/>} />
          <Route path="/Gifts" element={<GiftMobile/>} />
          <Route path="/ContactUs" element={<ContactUs1/>} />
          <Route path="/detailwatch/:id" element={<AllMobileCards/>} />
          <Route path="/CustomerManagement" element={<CustomerManagement />} />
        </Routes>
        <BottomMobileinfo/>
      </Router>
    </>
  );
}