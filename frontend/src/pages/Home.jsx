import { Element } from "react-scroll";
import Navbar from "../components/Navbar"; 

const Home = () => {
    return (
        <>
            <Navbar />
            <Element name="home" className="home">
                <h1>Home</h1>
                {/* Add more content like featured art, leaderboard preview, etc. */}
            </Element>
        </>
    );
};

export default Home;
