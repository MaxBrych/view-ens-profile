import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

import styles from "./Chat.module.css";
import { useAddress } from "@thirdweb-dev/react";
import { BiCheckDouble } from "react-icons/bi";
import { FiSend } from "react-icons/fi";
import PrivateDonation from "../Donation/PrivateDontation";
import Donate from "../Donation/Donate";
const ethersDynamic = import("ethers");

function Chat({ client, messageHistory, conversation }) {
  const [provider, setProvider] = useState(null);

  const [address, setAddress] = useState(null);
  const wallet = useAddress();
  const [inputValue, setInputValue] = useState("");

  const router = useRouter();
  const { ensName } = router.query;

  const [ensRecords, setEnsRecords] = useState({});
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    ethersDynamic.then((ethers) => {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_PROVIDER_URL
      );
      setProvider(provider);
    });
  }, []);

  useEffect(() => {
    const getAllRecords = async (ensName) => {
      setLoading(true);
      const client = new ApolloClient({
        uri: "https://api.thegraph.com/subgraphs/name/ensdomains/ens",
        cache: new InMemoryCache(),
      });

      const query = gql`
      {
        domains(where:{name:"${ensName}"}) {
          id
          name
          resolver {
            texts
            coinTypes
          }
        }
      }
      `;

      if (ensName && provider) {
        const address = await provider.resolveName(ensName);
        setAddress(address);

        const result = await client.query({ query });

        if (result.data && result.data.domains.length > 0) {
          const resolver = await provider.getResolver(ensName);

          // Check if texts are defined and not empty before mapping
          if (result.data.domains[0].resolver.texts) {
            const textRecords = await Promise.all(
              result.data.domains[0].resolver.texts.map((key) =>
                resolver.getText(key)
              )
            );

            // Store the results in the component's state.
            const newRecords = {};
            result.data.domains[0].resolver.texts.forEach((text, index) => {
              newRecords[text] = textRecords[index];
            });
            setEnsRecords(newRecords);
          }
          setLoading(false);
        }
      }
    };

    if (ensName && provider) {
      getAllRecords(ensName);
    }
  }, [ensName, provider]);

  // Function to handle sending a message
  const handleSend = async () => {
    if (inputValue) {
      await onSendMessage(inputValue);
      setInputValue("");
    }
  };

  // Function to handle sending a text message
  const onSendMessage = async (value) => {
    return conversation.send(value);
  };

  // MessageList component to render the list of messages
  const MessageList = ({ messages }) => {
    // Filter messages by unique id
    messages = messages.filter(
      (v, i, a) => a.findIndex((t) => t.id === v.id) === i
    );

    return (
      <ul className="flex flex-col justify-end w-full">
        {messages.map((message, index) => (
          <li
            key={message.id}
            className={`flex flex-col ${
              message.senderAddress === wallet ? "items-end" : "items-start"
            } justify-end w-full gap-1 my-2`}
            title="Click to log this message to the console"
          >
            <strong className="mr-2 text-xs leading-3">
              {message.senderAddress === wallet ? "You" : "Fren"}
            </strong>
            <span
              className={`text-md p-2 rounded-xl ${
                message.senderAddress === wallet
                  ? "bg-[#05C756] text-white"
                  : "text-black "
              }`}
            >
              {message.content}
            </span>
            <div className="flex gap-3">
              <span className="text-xs">
                {" "}
                {message.sent.toLocaleTimeString()}
              </span>
              <span onClick={() => console.log(message)}>
                <BiCheckDouble />
              </span>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  // Function to handle input change (keypress or change event)
  const handleInputChange = (event) => {
    if (event.key === "Enter") {
      handleSend();
    } else {
      setInputValue(event.target.value);
    }
  };
  return (
    <div className={styles.Chat}>
      <div className={styles.messageContainer}>
        <MessageList messages={messageHistory} />
      </div>
      <div className="flex items-center gap-2 py-3 border-t-gray-300">
        <Donate address={address} />
        <input
          type="text"
          className="w-full h-12 p-3 text-gray-500 bg-white border border-gray-300 rounded-full outline-none text-md"
          onKeyPress={handleInputChange}
          onChange={handleInputChange}
          value={inputValue}
          placeholder="Type your text here "
        />
        <span
          className="rounded-full outline-none bg-[#05C756] flex flex-col justify-center items-center cursor-pointer text-white flex-shrink-0 h-12 w-12 hover:bg-[#04B950]"
          onClick={handleSend}
        >
          <FiSend />
        </span>
      </div>
    </div>
  );
}

export default Chat;
