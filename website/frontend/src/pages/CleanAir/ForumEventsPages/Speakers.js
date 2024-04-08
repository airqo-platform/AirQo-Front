import React, { useState } from 'react';
import Profile from 'components/Profile';
import { useTranslation, Trans } from 'react-i18next';

const ITEMS_PER_PAGE = 6;

const Speakers = ({ speakers }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedSpeakers = isExpanded ? speakers : speakers?.slice(0, ITEMS_PER_PAGE);
  return (
    <>
      {speakers && speakers.length > 0 && (
        <>
          <div className="separator" />
          <section className="speakers">
            <h2 style={{ marginBottom: '20px' }} className="section_title">
              {t('cleanAirSite.Forum.sections.speakers.title')}
            </h2>
            <p>
              <Trans i18nKey="cleanAirSite.Forum.sections.speakers.subText" />
            </p>
            <div className="AboutUsPage__pictorial">
              {displayedSpeakers.map((profile) => (
                <div key={profile.id}>
                  <Profile
                    name={profile.name}
                    title={profile.title}
                    ImgPath={profile.picture}
                    htmlBio={profile.bio_html}
                    readBioBtn={true}
                  />
                </div>
              ))}
              {speakers.length > ITEMS_PER_PAGE && (
                <div className="showMoreLessBtn">
                  <button onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? 'Show Less' : 'Show More'}
                  </button>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* if both are empty */}
      {speakers && speakers.length === 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh'
          }}>
          No content available
        </div>
      )}
    </>
  );
};

export default Speakers;
