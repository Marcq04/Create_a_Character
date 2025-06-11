import { useQuery, gql, useApolloClient } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Element } from 'react-scroll';
import Navbar from '../../components/navbarLayout/Navbar';
import Footer from '../../components/Footer';
import { BountyGallery, SubmissionGallery } from '../../components/galleryLayout/Gallery';
import { GET_BOUNTIES, GET_ACCEPTED_SUBMISSIONS, GET_ACCEPTED_SUBMISSIONS_BY_USER, ME } from '../../graphql/queries';
import './Home.css';

const Home = () => {
    const { data: bountiesData, loading: loadingBounties } = useQuery(GET_BOUNTIES);
    const { data: submissionsData, loading: loadingSubmissions } = useQuery(GET_ACCEPTED_SUBMISSIONS);
    const { data: meData } = useQuery(ME);
    const { data: userAcceptedData } = useQuery(GET_ACCEPTED_SUBMISSIONS_BY_USER, { skip: !meData, variables: { userId: meData?.me.id } });
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
                {userAcceptedData && userAcceptedData.getAcceptedSubmissionsByUser.length > 0 && (
                    <div className="congrats-banner">
                        <h3>🏆 Congratulations!</h3>
                        {userAcceptedData.getAcceptedSubmissionsByUser.map(submission => (
                            <p key={submission.id}>
                                Your artwork for <strong>{submission.bounty.character.name}</strong> was chosen as the winner! (+1 Honor)
                            </p>
                        ))}
                    </div>
                )}

                <h2>Featured Bounties</h2>
                {!loadingBounties && bountiesData && (
                    <BountyGallery bounties={bountiesData.getBounties} />
                )}

                <h2>Recent Submissions</h2>
                {!loadingSubmissions && submissionsData && (
                    <SubmissionGallery submissions={submissionsData.getAcceptedSubmissions} />
                )}
            </Element>
            <Footer />
        </>
    );
};


export default Home;

