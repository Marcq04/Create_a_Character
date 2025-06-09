import { useQuery, gql, useApolloClient } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Element } from 'react-scroll';
import Navbar from '../../components/navbarLayout/Navbar';
import Footer from '../../components/Footer';
import { BountyGallery, SubmissionGallery } from '../../components/galleryLayout/Gallery';
import { GET_BOUNTIES, GET_ACCEPTED_SUBMISSIONS } from '../../graphql/queries';
import './Home.css';

const Home = () => {
    const { data: bountiesData, loading: loadingBounties } = useQuery(GET_BOUNTIES);
    const { data: submissionsData, loading: loadingSubmissions } = useQuery(GET_ACCEPTED_SUBMISSIONS);
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
                {!loadingSubmissions && submissionsData && (
                    <SubmissionGallery submissions={submissionsData.getSubmissions} />
                )}
            </Element>
            <Footer />
        </>
    );
};


export default Home;

