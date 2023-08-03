import React, { useState } from "react";
import styles from "./Chat.module.css";
import { useAddress } from "@thirdweb-dev/react";
import { BiCheckDouble } from "react-icons/bi";

function Chat({ client, messageHistory, conversation }) {
  const address = useAddress();
  const [inputValue, setInputValue] = useState("");

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
      <ul className="messageList">
        {messages.map((message, index) => (
          <li
            key={message.id}
            className="flex flex-col gap-1 items-start my-2"
            title="Click to log this message to the console"
          >
            <strong className="text-sm mr-2">
              {message.senderAddress === address ? "You" : "Bot"}
            </strong>
            <span className="text-md p-2 bg-[#05C756] text-white rounded-xl">
              {message.content}
            </span>
            <div className="flex gap-3">
              <span onClick={() => console.log(message)}>
                <BiCheckDouble />
              </span>
              <span className="text-xs">
                {" "}
                {message.sent.toLocaleTimeString()}
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
      <div className={styles.inputContainer}>
        <input
          type="text"
          className={styles.inputField}
          onKeyPress={handleInputChange}
          onChange={handleInputChange}
          value={inputValue}
          placeholder="Type your text here "
        />
        <button className={styles.sendButton} onClick={handleSend}>
          &#128073;
        </button>
      </div>
    </div>
  );
}

export default Chat;
