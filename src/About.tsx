import './About.css';

const About: React.FC = () => {
  return (
    <div className="home-bg">
      <div className="about-container">
        <h1>Purpose</h1>
        <div className="about-box">
          <p>
            Leerically is a free platform designed to help you understand song lyrics of various languages. 
            Whether you're a music lover, language learner, or just curious about the meaning behind your favorite tracks, 
            Leerically makes it easy to search for lyrics, view translations, and explore interpretations in multiple languages.
            Other than providing translations, Leerically also offers detailed breakdowns of words and phrases,
            helping you learn new vocabulary and understand cultural nuances.
            Additionally, you can take unlimited language tests extracted from the lyrics to reinforce your learning.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;