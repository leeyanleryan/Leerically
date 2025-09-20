import Head from 'next/head';

const NotFound: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Leerically | 404 - Page Not Found</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="hero-section darkest">
        <div className="hero-container direction-normal">
          <div className="text center">
            <h1>404 - Not Found</h1>
            <p>
              The page you are looking for does not exist.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
