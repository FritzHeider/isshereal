import type { Metadata } from 'next';
import React from 'react';
import { CaseFile } from '@/components/cases/CaseFile';
import { Glyph } from '@/components/darkroom/Glyph';

const DESCRIPTION =
  'How to check a dating match’s public footprint quietly, what tends to give a fake profile away, and how to meet someone safely either way.';

export const metadata: Metadata = {
  title: 'Dating safety',
  description: DESCRIPTION,
  alternates: { canonical: '/use-cases/dating-safety' },
  openGraph: {
    title: 'Dating safety · Is the person you’re meeting on Friday real?',
    description: DESCRIPTION,
    url: '/use-cases/dating-safety',
    type: 'article',
  },
};

export default function DatingSafetyPage() {
  return (
    <CaseFile
      code="DT"
      slug="dating-safety"
      crumb="Dating safety"
      glyph="dating"
      gentle
      opening={{
        title: (
          <>
            Is the person you’re meeting on Friday <span className="safe">real?</span>
          </>
        ),
        lede: (
          <>
            <p>
              Almost always, yes. Most people on dating apps are exactly who they say they are, a little nervous and
              hoping you’re real too.
            </p>
            <p>
              This page is for the few who aren’t. It shows how to look at a match’s public footprint without them
              knowing, what tends to give a borrowed face away, and how to meet someone safely whatever the answer.
            </p>
          </>
        ),
        aside: (
          <div className="case-short">
            <p className="label text-2">If you only read one thing</p>
            <ul className="case-short__list" role="list">
              <li>
                <Glyph name="check" size={22} />
                <span>Video call first.</span>
              </li>
              <li>
                <Glyph name="check" size={22} />
                <span>Meet somewhere public.</span>
              </li>
              <li>
                <Glyph name="check" size={22} />
                <span>Never send money.</span>
              </li>
            </ul>
          </div>
        ),
      }}
      example={{
        reportId: 'alex',
        kicker: 'Worked example · DT-0412 · fictional',
        title: (
          <>
            “Alex” came up <span className="ghost">mostly ghost.</span>
          </>
        ),
        body: (
          <>
            <p>
              Alex is made up, but built from a pattern that turns up often. The photographs were real photographs, of a
              catalogue model rather than of Alex. The profile was twelve days old.
            </p>
            <p>
              Here is what developed, what didn’t, and what each line actually means. None of these on its own proves
              anything. Together they make a picture.
            </p>
          </>
        ),
        alt: 'Profile photo for “Alex”: a man in glasses and a leather jacket outside a café, lit like a catalogue shoot',
        ghostNotes: [
          'Apps can spot and stop scam scripts; a private chat can’t. Wanting to move off the app very early is the most common first sign. Plenty of honest people prefer WhatsApp, so it’s the speed that matters.',
          'The photographs belong to someone else. This is the nearest thing to a clear answer you will get, and you can check it yourself in about a minute.',
          'The job and the city changed between conversations. Everyone misremembers now and then. A story that shifts whenever a detail could be checked is different.',
        ],
        developedNotes: [
          'A phone number was confirmed. That counts for something, but numbers are cheap to buy, so on its own it proves very little.',
        ],
      }}
      flags={{
        title: (
          <>
            Seven things that <span className="ghost">don’t develop</span>
          </>
        ),
        lede: (
          <p>
            One flag is usually nothing. Two or three together are worth slowing down for. Every one of them has a calm,
            ordinary response, and none of them requires you to accuse anybody.
          </p>
        ),
        items: [
          {
            flag: 'Video calls keep falling through. The camera is broken, the signal is bad, maybe next week.',
            action:
              'Ask for a short video call before you meet. Two minutes is enough. Someone real will usually find a way within a few days.',
          },
          {
            flag: 'Wants to move to WhatsApp or Telegram within the first few messages.',
            action: 'Stay on the app until you’ve met. You can say it simply: “I keep chats here until we meet.”',
          },
          {
            flag: 'A job that keeps them far away: deployed overseas, on an oil rig, a doctor with an aid agency.',
            action:
              'These jobs are real, and so are the people who borrow them. Ask small, ordinary questions and see whether the answers stay the same.',
          },
          {
            flag: 'Brings up crypto, trading, or an investment “mentor” who has done wonders for them.',
            action:
              'Stop there. No genuine match needs you to open a trading account. Don’t move money and don’t install the app they recommend.',
          },
          {
            flag: 'The photos look like a catalogue shoot, or too smooth to be a real face.',
            action:
              'Run a reverse image search with Google Lens, TinEye or Bing Visual Search. If the pictures belong to someone else, you have your answer.',
          },
          {
            flag: 'Asks for money, gift cards or help with a fee, however small and however sad the reason.',
            action:
              'Don’t send it. Not gift cards, not crypto, not a transfer “just this once”. Report the profile in the app.',
          },
          {
            flag: 'Affection that arrives very fast: pet names and “I’ve never felt this way” within days.',
            action: 'Notice the pace. Being liked is lovely. Being rushed is something else, and it’s fine to slow things down.',
          },
        ],
        memo: {
          re: 'Meeting a match',
          title: 'Before you meet',
          steps: [
            'Meet somewhere public and busy, and get there under your own steam.',
            'Tell a friend where you’ll be and when you expect to be home. Share your location if you like.',
            'Keep your own way home and keep an eye on your drink.',
            'Video-call first. It is the simplest check there is.',
            'You can leave at any point. You don’t owe anyone an explanation.',
            'If something felt wrong, report it to the app, even if nothing happened.',
          ],
          sign: 'Filed under DT · keep for reference',
        },
      }}
      intake={{
        title: 'Check a match quietly',
        lede: (
          <p>
            Paste the Instagram, TikTok or other social handle your match shared. We read what’s public, the same way a
            browser would. Nobody is messaged or notified.
          </p>
        ),
        label: 'Their handle or profile link',
        placeholder: '@alex_travels',
        hint: 'Dating app profiles usually sit behind a login, so use a social handle they gave you or a username you found.',
      }}
      limits={{
        title: 'A thin print isn’t a lie',
        body: (
          <p>
            The print shows how much of an account’s audience and history came through. It can’t see the person, their
            intentions or their heart. Treat it as one piece of evidence next to a video call and your own sense of
            things.
          </p>
        ),
        questions: [
          {
            q: 'Will they know I checked?',
            a: (
              <p>
                No. We only read the public profile. Nothing is sent to them, and you don’t log in to anything of theirs.
              </p>
            ),
          },
          {
            q: 'Can a real person come up mostly ghost?',
            a: (
              <p>
                Yes. New accounts, private people and those who hardly post leave very little to develop. A thin print
                means there is less to go on, not that someone is lying. Pair it with a video call.
              </p>
            ),
          },
          {
            q: 'What if I’ve already sent money?',
            a: (
              <p>
                Stop sending more, keep every message, and call your bank straight away; transfers can sometimes be
                recalled if you’re quick. Report it to the app and to your national fraud line (in the US,{' '}
                <a href="https://reportfraud.ftc.gov" rel="noopener noreferrer" target="_blank">
                  reportfraud.ftc.gov
                </a>
                ). Being taken in by a practised script is not a failing.
              </p>
            ),
          },
        ],
      }}
    />
  );
}
