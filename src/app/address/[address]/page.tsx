"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Image,
  Flex,
  Link,
  Skeleton,
  HStack,
  Icon,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import NavBar from "@/components/NavBar";
import ChatButton from "@/components/ChatButton";
import ShareButton from "@/components/ShareButton";
import DonateButton from "@/components/Donation/Donate";

import TransactionFeed from "@/components/TransactionFeed/TransactionFeed";
import PublicDonation from "@/components/Donation/PublicDonation";
import PrivateDonation from "@/components/Donation/PrivateDontation";

function ProfileSkeleton({
  children,
  isLoaded,
}: {
  children: any;
  isLoaded: any;
}) {
  return (
    <Skeleton
      isLoaded={isLoaded}
      startColor="white"
      endColor="gray.300"
      borderRadius="full"
      mb="4"
    >
      {children}
    </Skeleton>
  );
}

function AddressProfile() {
  const [address, setAddress] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>({});
  const [isLoading, setLoading] = useState(true);
  let params = useParams();

  const { address: queryAddress } = params;
  const supabase = useSupabaseClient();

  useEffect(() => {
    async function getProfile(walletAddress: string) {
      try {
        setLoading(true);
        let { data, error, status } = await supabase
          .from("wallet_profiles")
          .select(`username, description, avatar_url`)
          .eq("wallet_address", walletAddress)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          // Download the image if the avatar_url is present
          if (data.avatar_url) {
            const { data: avatarData, error: avatarError } =
              await supabase.storage.from("avatars").download(data.avatar_url);
            if (avatarError) {
              throw avatarError;
            }
            const avatarUrl = URL.createObjectURL(avatarData);
            data.avatar_url = avatarUrl;
          }

          setAddress(walletAddress);
          setProfile({
            avatar: data.avatar_url,
            username: data.username,
            description: data.description,
          });
        }
      } catch (error) {
        console.error("Error loading user data!", error);
      } finally {
        setLoading(false);
      }
    }

    if (queryAddress) {
      getProfile(queryAddress as string);
    }
  }, [queryAddress]);

  const bg = "gray.50";
  const color = "black";

  return (
    <>
      <Box
        minHeight="100vh"
        w="full"
        display="flex"
        alignItems="start"
        gap={8}
        justifyContent="center"
        backgroundColor={bg}
        className=" font-mona"
        p={4}
      >
        <Box
          className="w-full p-4"
          bg={"white"}
          maxW={96}
          rounded={"2xl"}
          h="full"
          minH={"85vh"}
          border={"1px solid #E2E8F0"}
          p={4}
        >
          <Flex direction="column" p={4} w="full" align="center">
            <ProfileSkeleton isLoaded={!isLoading}>
              <Image
                src={
                  profile.avatar ||
                  "https://cdn.discordapp.com/attachments/911669935363752026/1139256377118830662/ETH_Pand.png"
                }
                alt="Avatar"
                boxSize={["96px", "128px", "160px"]}
                rounded="full"
                border={"1px"}
                borderColor={"gray.300"}
              />
            </ProfileSkeleton>

            <h1 className="h-3 mb-4 text-xl font-bold text-center">
              {profile.username || ""}
            </h1>
            <Text
              textAlign="center"
              fontSize={{ base: "xs", md: "sm" }}
              lineHeight={"normal"}
              mb={4}
              className=" font-mona"
            >
              {profile.description || ""}
            </Text>

            <div className="flex gap-8 mt-2 mb-4 md:hidden">
              <ChatButton receiverAddress={address} />
              <ShareButton />
              <DonateButton address={address} name="Donate" />
            </div>
          </Flex>

          <TransactionFeed receiverAddress={address} />
        </Box>
        <Box className="hidden bg-white border border-gray-200 md:flex md:flex-col md:items-start md:justify-start md:h-full md:gap-8 md:max-w-sm rounded-xl">
          <Box mx={4} mb={4} className="">
            <Tabs
              variant="soft-rounded"
              textColor={"black"}
              className="flex-initial flex-shrink-0"
            >
              <TabList
                flex={1}
                flexDirection={"row"}
                justifyContent={"center"}
                className="flex flex-row items-center justify-center flex-initial flex-shrink-0 gap-1 p-1 my-4 bg-gray-100 rounded-full"
              >
                <Tab
                  _selected={{ color: "black", bg: "whiteAlpha.900" }}
                  fontSize={{ base: 12, md: 14 }}
                  height={8}
                  className="text-black shadow-sm "
                  textColor={"black"}
                  w={"full"}
                >
                  Public
                </Tab>
                <Tab
                  _selected={{ color: "black", bg: "whiteAlpha.900" }}
                  fontSize={{ base: 12, md: 14 }}
                  height={8}
                  className="text-black shadow-sm"
                  textColor={"black"}
                  w={"full"}
                >
                  Private
                </Tab>
              </TabList>
              <TabPanels className="w-full">
                <TabPanel className="w-full">
                  <PublicDonation receiverAddress={address} />
                </TabPanel>
                <TabPanel>
                  <PrivateDonation receiverAddress={address} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
          {/* <div className="h-[10vh]">
            <Home receiverAddress={address} />
          </div>*/}
        </Box>
      </Box>
    </>
  );
}

export default AddressProfile;
