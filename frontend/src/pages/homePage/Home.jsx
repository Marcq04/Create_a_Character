import { useQuery, gql, useApolloClient } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Element } from 'react-scroll';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { BountyGallery, SubmissionGallery } from '../../components/Gallery';
import { GET_BOUNTIES, GET_SUBMISSIONS } from '../../graphql/queries';
import './Home.css';

const Home = () => {
    const { data: bountiesData, loading: loadingBounties } = useQuery(GET_BOUNTIES);
    const client = useApolloClient();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        client.resetStore();
        navigate('/login');
    };

    return (
        <>
            <Navbar />
            <button onClick={handleLogout}>Logout</button>
            <Element name="home" className="home">
                <h2>Featured Bounties</h2>
                {!loadingBounties && bountiesData && (
                    <BountyGallery bounties={bountiesData.getBounties} />
                )}

                <h2>Recent Submissions</h2>
                {/* You can also map recent submissions across bounties here */}
                {/* <SubmissionGallery submissions={...} /> */}
            </Element>
            <Footer />
        </>
    );
};


export default Home;

