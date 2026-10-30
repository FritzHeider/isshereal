import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { CaseFile } from '@/components/cases/CaseFile';
import { GhostCost } from '@/components/cases/GhostCost';
import { Reading } from '@/components/darkroom/Reading';

const DESCRIPTION =
  'How to see how much of a creator’s audience is real before you pay for a sponsorship: follower bursts, engagement pods, view gaps, and what to ask for.';

export const metadata: Metadata = {
  title: 'Influencer vetting',
  description: DESCRIPTION,
  alternates: { canonical: '/use-cases/influencer-vetting' },
  openGraph: {
    title: 'Influencer vetting · Is the audience you’re paying for real?',
    description: DESCRIPTION,
    url: '/use-cases/influencer-vetting',
    type: 'article',
  },
};

export default function InfluencerVettingPage() {
  return (
    <CaseFile
      code="IV"
      slug="influencer-vetting"
      crumb="Influencer vetting"
      glyph="social"
      opening={{
        title: (
          <>
            Is the audience you’re paying for <span className="safe">real?</span>
          </>
        ),
        lede: (
          <>
            <p>
              A sponsorship buys the attention of real people. Some audiences are padded with bought followers, bots and
              engagement pods, and the follower count looks the same either way.
            </p>
            <p>
              The print shows how much of an audience develops. Look before you send the brief, and price the deal on the
              part that came through.
            </p>
          </>
        ),
        aside: (
          <div className="case-dial">
            <Reading
              value={67}
              label="Ghost · example"
              tone="ghost"
              size="l"
              note="Of a 480,000-follower audience, about 158,000 developed. The rest never came up."
            />
          </div>
        ),
      }}
      example={{
        reportId: 'lucamodels',
        kicker: 'Worked example · IV-0031 · fictional',
        title: (
          <>
            Luca came up <span className="ghost">two-thirds ghost.</span>
          </>
        ),
        body: (
          <>
            <p>
              Luca is fictional, but the shape is common: years of genuine work, good photographs, and a recent burst of
              followers that never developed.
            </p>
            <p>
              Padded audiences often sit on top of real creators. That is why an account can look fine at a glance and
              still deliver very little to a sponsor.
            </p>
          </>
        ),
        alt: 'Profile photo for “Luca”: a young man in an olive jacket, backlit by a low evening sun',
        ghostNotes: [
          'Likes and comments per post measured 0.42%, far lower than accounts this size usually see. Ghost followers don’t like anything, so a padded audience drags the rate down.',
          'About 180,000 followers arrived within 48 hours, mostly accounts with no posts of their own. Audiences don’t grow like that without a viral post to explain it, and there wasn’t one.',
          'The same few emoji, a few minutes after each post. Pods trade comments to game the feed. The accounts are real; the audience isn’t.',
        ],
        developedNotes: [
          'Three years of steady posting is real work, and it developed as such.',
          'The photographs are good and consistent. The quality of the work isn’t in question here. The audience is.',
        ],
      }}
      flags={{
        title: (
          <>
            Six ways an audience <span className="ghost">stays ghost</span>
          </>
        ),
        lede: (
          <p>
            Big accounts attract some bots without trying, so a little ghost is normal. What matters is the size of the
            gap and whether the creator will show you their numbers.
          </p>
        ),
        items: [
          {
            flag: 'Follower jumps of tens of thousands overnight, with no viral post to explain them.',
            action:
              'Ask for a follower-growth screenshot from the platform’s own insights, with dates, and compare it with when their best posts went out.',
          },
          {
            flag: 'Comments that are short, generic and early: “Love this”, a row of fire emoji, within minutes of posting.',
            action: 'Read the comments on three older posts. Real audiences ask questions, disagree and tag friends.',
          },
          {
            flag: 'Views far below follower count: half a million followers, two thousand views a reel.',
            action: 'Pay on views or results rather than followers. Ask for average reach over the last thirty days.',
          },
          {
            flag: 'Followers who themselves follow thousands of accounts and post nothing.',
            action: 'Spot-check twenty followers. Empty profiles following five thousand people aren’t watching anyone.',
          },
          {
            flag: 'An audience location that doesn’t fit the content or the language.',
            action:
              'Ask for the country breakdown from insights. A London food creator whose followers are mostly somewhere unrelated deserves a question.',
          },
          {
            flag: 'Reluctance to share insights screenshots or a dated media kit.',
            action: 'Make it part of the brief. Creators with real audiences usually share without fuss.',
          },
        ],
        memo: {
          re: 'Before the contract',
          title: 'Before you sign',
          steps: [
            'Ask for insights screenshots: reach, audience countries, follower growth, with dates.',
            'Price on views, clicks or sales where you can, rather than on follower count.',
            'Start with one paid post before a long series.',
            'Write the deliverables, dates and usage rights into the agreement.',
            'Re-check the account before the second payment. Audiences change.',
          ],
          sign: 'Filed under IV · keep for reference',
        },
      }}
      extra={<GhostCost slug="influencer-vetting" />}
      intake={{
        title: 'Develop a creator',
        lede: (
          <p>
            Paste an Instagram, TikTok or YouTube handle. The creator isn’t notified, and nothing is posted anywhere. If
            you have a whole roster, the <Link href="/tools/bulk">bulk tool</Link> takes a list.
          </p>
        ),
        label: 'Creator’s handle or profile link',
        placeholder: '@lucamodels',
        hint: 'Instagram, TikTok and YouTube handles or links all work.',
      }}
      limits={{
        title: 'Ghosts aren’t always bought',
        body: (
          <p>
            A ghost is a follower who never developed: no posts, no activity, no sign of a person watching. Some are
            bought. Some are bots that follow large accounts on their own. Some are real people who stopped opening the
            app years ago. The print shows how much of the audience is there, not how the rest got in.
          </p>
        ),
        questions: [
          {
            q: 'Does a high ghost share mean the creator bought followers?',
            a: (
              <p>
                Not necessarily. Bots follow big accounts without being asked, and old audiences go quiet. Ask the creator
                about any spike; many will explain a giveaway or a feature and show you the insights.
              </p>
            ),
          },
          {
            q: 'How much ghost is normal?',
            a: (
              <p>
                Some, always. Every large account picks up drifting bots and abandoned profiles. Compare creators of a
                similar size in the same niche, rather than holding anyone to zero.
              </p>
            ),
          },
          {
            q: 'What should I do with a mixed result?',
            a: (
              <p>
                Talk to the creator. Price the deal on the developed audience and ask for their numbers. A creator who
                won’t share them is telling you something too.
              </p>
            ),
          },
        ],
      }}
    />
  );
}
