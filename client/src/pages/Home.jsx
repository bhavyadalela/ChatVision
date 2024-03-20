import Sidenav from '../components/Sidenav';
import ChattingArea from '../components/ChattingArea';
import { useContext } from 'react';
import { ChatContext } from "../context/ChatProvider";


const Home = () => {
    const {isCalling, setIscalling} = useContext(ChatContext);
    return (
        <div className="flex h-full bg-[#152639]">
            {!isCalling && <Sidenav />}
            <ChattingArea />
        </div>
    )
}

export default Home;
