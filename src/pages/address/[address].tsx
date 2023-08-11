import { useRouter } from "next/router";
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
} from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import DonateButton from "@/components/Donation/Donate";
import ChatButton from "@/components/ChatButton";
import ShareButton from "@/components/ShareButton";
import TransactionFeed from "@/components/TransactionFeed/TransactionFeed";
import NavBar from "@/components/NavBar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

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
  const router = useRouter();
  const { address: queryAddress } = router.query;
  const supabase = useSupabaseClient();

  useEffect(() => {
    async function getProfile(walletAddress: string) {
      try {
        setLoading(true);
        let { data, error, status } = await supabase
          .from("wallet_profiles")
          .select(`username, avatar_url`)
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
            data.avatar_url = avatarUrl; // Replacing the URL with the actual downloaded URL
          }

          setAddress(walletAddress);
          setProfile({
            avatar: data.avatar_url,
            description: data.username,
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
  const color = "gray.700";

  return (
    <>
      <NavBar />
      <Box
        minHeight="100vh"
        w="full"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        color={color}
        backgroundColor={bg}
        className={` ${inter.className}`}
        p={4}
      >
        <Box
          className="w-full p-4 mt-16"
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

            <Heading
              as="h1"
              fontSize={"lg"}
              h={"10px"}
              mb={4}
              textAlign="center"
            >
              {profile.description || ""}
            </Heading>

            <HStack mt={2} spacing={8} mb={4} rowGap={8}>
              <ChatButton receiverAddress={address} />
              <ShareButton />
              <DonateButton address={address} name="Donate" />
            </HStack>
          </Flex>

          <TransactionFeed receiverAddress={address} />
        </Box>
      </Box>
    </>
  );
}

export default AddressProfile;
