import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import PublicDonation from "./PublicDonation";
import PrivateDonation from "./PrivateDontation";

interface DonateButtonProps {
  address: any;
}

export default function Donate({ address }: DonateButtonProps) {
  return (
    <Tabs variant="enclosed-colored" className="w-full">
      <TabList>
        <Tab>Public</Tab>
        <Tab>Private</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <PublicDonation receiverAddress={address} />
        </TabPanel>
        <TabPanel>
          <PrivateDonation receiverAddress={address} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
