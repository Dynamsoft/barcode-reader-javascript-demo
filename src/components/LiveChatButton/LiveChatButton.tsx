import { forwardRef, useImperativeHandle } from "react";
import "./LiveChatButton.css";

// function LiveChatButton() {
//   const openLiveChat = (event: React.MouseEvent<HTMLDivElement>)=>{
//     event.stopPropagation();

//     (window as any).Comm100API.do('livechat.button.click');
//   };

//   return (
//     <div className="div-live-chat-button" onClick={openLiveChat}>
//     </div>
//   );
// }

const LiveChatButton = forwardRef(function MyInput(props, ref) {
  const openLiveChat = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    (window as any).Comm100API.do("livechat.button.click");
  };

  useImperativeHandle(
    ref,
    () => {
      return {
        openLiveChat
      };
    },
    []
  );

  return (
    <div className="div-live-chat-button" onClick={openLiveChat}>
    </div>
  );
});

export default LiveChatButton;
