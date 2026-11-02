import { useRef } from 'react';
import ExternalButton from '../components/ExternalButton.jsx';
import GitHubStat from '../components/GitHubStat.jsx';
import { useReveal } from '../hooks/useReveal.js';

const darkColors = 'title_color=38BDF8&text_color=E6E6F0';
const lightColors = 'title_color=0369A1&text_color=0B1020';

export default function GitHub({ theme }) {
  const sectionRef = useRef(null);
  useReveal(sectionRef, theme);

  return (
    <section id="github" className="container" aria-labelledby="github-title" ref={sectionRef}>
      <p className="eyebrow section-eyebrow reveal">02 / Code & contributions</p>
      <h2 id="github-title" className="reveal">GitHub</h2>
      <p className="section-lead reveal" style={{ '--reveal-delay': '80ms' }}>
        A snapshot of what I am building, how often I contribute, and where you can
        dive deeper into my code.
      </p>
      <div className="github-grid">
        <article className="card github-card reveal">
          <h3>Contribution Activity</h3>
          <p className="github-card__meta">Tracking my commits and pull requests across the past year.</p>
          <GitHubStat
            theme={theme}
            darkSrc="https://github-readme-streak-stats.herokuapp.com?user=SanderNilsen&theme=transparent&hide_border=true&background=00000000&fire=38BDF8&ring=A78BFA&currStreakLabel=38BDF8&sideNums=E6E6F0&currStreakNum=E6E6F0&sideLabels=A7B0C5"
            lightSrc="https://github-readme-streak-stats.herokuapp.com?user=SanderNilsen&theme=transparent&hide_border=true&background=00000000&fire=0369A1&ring=6D28D9&currStreakLabel=0369A1&sideNums=0B1020&currStreakNum=0B1020&sideLabels=475569"
            label="Contribution streak"
            link="https://github.com/SanderNilsen"
            alt="GitHub contribution streak stats for Sander Nilsen"
            width="720"
            height="320"
          />
        </article>

        <article className="card github-card reveal" style={{ '--reveal-delay': '70ms' }}>
          <h3>Languages &amp; Featured Repos</h3>
          <p className="github-card__meta">Quick view of the tech I use most and current focus projects.</p>
          <GitHubStat
            theme={theme}
            darkSrc={`https://github-readme-stats.vercel.app/api/top-langs/?username=SanderNilsen&layout=compact&hide_border=true&bg_color=00000000&${darkColors}`}
            lightSrc={`https://github-readme-stats.vercel.app/api/top-langs/?username=SanderNilsen&layout=compact&hide_border=true&bg_color=00000000&${lightColors}`}
            label="Top languages chart"
            link="https://github.com/SanderNilsen?tab=repositories"
            alt="Top languages used across Sander Nilsen's public repositories"
            width="720"
            height="320"
          />
          <div className="github-pins" role="group" aria-label="Featured repositories">
            <GitHubStat
              theme={theme}
              darkSrc="https://github-readme-stats.vercel.app/api/pin/?username=SanderNilsen&repo=RainyDays&show_owner=false&hide_border=true&bg_color=00000000&title_color=38BDF8&text_color=E6E6F0&icon_color=A78BFA"
              lightSrc="https://github-readme-stats.vercel.app/api/pin/?username=SanderNilsen&repo=RainyDays&show_owner=false&hide_border=true&bg_color=00000000&title_color=0369A1&text_color=0B1020&icon_color=6D28D9"
              label="RainyDays repository card"
              link="https://github.com/SanderNilsen/RainyDays"
              alt="Pinned repository: RainyDays"
              width="450"
              height="180"
            />
            <GitHubStat
              theme={theme}
              darkSrc="https://github-readme-stats.vercel.app/api/pin/?username=SanderNilsen&repo=Semester-Project-2-AuctionHouse&show_owner=false&hide_border=true&bg_color=00000000&title_color=38BDF8&text_color=E6E6F0&icon_color=A78BFA"
              lightSrc="https://github-readme-stats.vercel.app/api/pin/?username=SanderNilsen&repo=Semester-Project-2-AuctionHouse&show_owner=false&hide_border=true&bg_color=00000000&title_color=0369A1&text_color=0B1020&icon_color=6D28D9"
              label="Auction House repository card"
              link="https://github.com/SanderNilsen/Semester-Project-2-AuctionHouse"
              alt="Pinned repository: Semester-Project-2-AuctionHouse"
              width="450"
              height="180"
            />
          </div>
        </article>

        <article className="card github-card github-card--wide reveal">
          <h3>Activity Graph</h3>
          <p className="github-card__meta">Visual timeline of daily commits across my active repositories.</p>
          <GitHubStat
            theme={theme}
            darkSrc="https://github-readme-activity-graph.vercel.app/graph?username=SanderNilsen&bg_color=00000000&color=E6E6F0&line=38BDF870&point=A78BFA&area=true&hide_border=true&radius=12"
            lightSrc="https://github-readme-activity-graph.vercel.app/graph?username=SanderNilsen&bg_color=00000000&color=0B1020&line=0369A1&point=6D28D9&area=true&hide_border=true&radius=12"
            label="Contribution activity graph"
            link="https://github.com/SanderNilsen"
            alt="GitHub activity graph for Sander Nilsen"
            width="720"
            height="320"
          />
        </article>
      </div>

      <div className="github-actions reveal" style={{ '--reveal-delay': '240ms' }}>
        <ExternalButton href="https://github.com/SanderNilsen" icon="fa-brands fa-github">
          Visit my GitHub
        </ExternalButton>
      </div>
    </section>
  );
}
