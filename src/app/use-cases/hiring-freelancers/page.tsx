import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { CaseFile } from '@/components/cases/CaseFile';

const DESCRIPTION =
  'How to check a freelancer’s public history before you hand over the keys: borrowed portfolios, traded reviews, proxy interviews, and how to onboard safely.';

export const metadata: Metadata = {
  title: 'Hiring freelancers',
  description: DESCRIPTION,
  alternates: { canonical: '/use-cases/hiring-freelancers' },
  openGraph: {
    title: 'Hiring freelancers · Is the freelancer you interviewed the one doing the work?',
    description: DESCRIPTION,
    url: '/use-cases/hiring-freelancers',
    type: 'article',
  },
};

export default function HiringFreelancersPage() {
  return (
    <CaseFile
      code="FL"
      slug="hiring-freelancers"
      crumb="Hiring freelancers"
      glyph="freelance"
      opening={{
        title: (
          <>
            Is the freelancer you interviewed the one <span className="safe">doing the work?</span>
          </>
        ),
        lede: (
          <>
            <p>
              Usually. Most freelancers are exactly who their profile says, and many are better than their profile
              admits.
            </p>
            <p>
              The trouble cases are specific: a borrowed portfolio, a batch of traded reviews, a polished interviewer who
              passes your job to someone you never met. Each leaves marks in the public record. Check them before you
              hand over the keys.
            </p>
          </>
        ),
        aside: (
          <div className="case-ticket">
            <p className="case-ticket__head label">
              <span>Job ticket</span>
              <span className="tabular">FL-0071</span>
            </p>
            <dl className="specs">
              <dt>Candidate</dt>
              <dd className="tabular">pixel_pro_dev</dd>
              <dt>Platform</dt>
              <dd>Fiverr / Upwork</dd>
              <dt>Print</dt>
              <dd>Partly developed</dd>
              <dt>Next step</dt>
              <dd>Paid trial, live call</dd>
            </dl>
          </div>
        ),
      }}
      example={{
        reportId: 'pixelpro',
        kicker: 'Worked example · FL-0071 · fictional',
        title: (
          <>
            Pixel Pro came through, <span className="amber">mostly.</span>
          </>
        ),
        body: (
          <>
            <p>
              A mixed print, which is the most common kind. The account has a real working history behind it, and a few
              patches that didn’t develop.
            </p>
            <p>
              Mixed doesn’t mean dishonest. It tells you where to ask questions before you sign, and which questions to
              ask.
            </p>
          </>
        ),
        alt: 'Profile photo for “Pixel Pro Dev”: a man in thick-rimmed glasses in front of monitors full of code',
        ghostNotes: [
          'Twelve reviews arrived inside one day. That pattern shows up when freelancers buy small orders from each other to swap reviews. It inflates the count. It doesn’t prove the work is bad.',
          'Some portfolio links lead to public templates. Plenty of good developers start from one. Ask which parts they wrote and have them walk you through a decision they made.',
        ],
        developedNotes: [
          'The platform checked an ID document. That ties the account to a real person, though not necessarily to the person on your call.',
          'Forty orders spread over eighteen months is what a working freelancer looks like. Slow, steady history is the hardest thing to fake.',
          'Platforms award this badge on delivery and dispute records. It is earned over time rather than bought.',
        ],
      }}
      flags={{
        title: (
          <>
            Seven marks <span className="ghost">left in the record</span>
          </>
        ),
        lede: (
          <p>
            None of these is a reason to reject someone outright. Each one has a simple test you can run in the interview
            or the first week, and an honest candidate will pass it without fuss.
          </p>
        ),
        items: [
          {
            flag: 'The camera stays off for the interview, or the picture doesn’t quite keep time with the voice.',
            action:
              'Make a short live video call a condition. If the face and voice don’t line up, end the call politely and move on.',
          },
          {
            flag: 'Code history that appeared all at once: hundreds of commits in one week, or nothing public at all.',
            action:
              'Read the dates, not the green squares. Ask for one repository they’re proud of and a walk-through of one choice they made in it.',
          },
          {
            flag: 'Working hours that don’t match the location on the profile.',
            action:
              'Ask directly. Good freelancers work across time zones all the time. Being vague about it is the flag, not the distance.',
          },
          {
            flag: 'Live coding with long silences followed by finished blocks of code.',
            action: 'Pair for twenty minutes on a small, real task and ask them to talk while they type.',
          },
          {
            flag: 'Portfolio pieces that appear in someone else’s portfolio, or look generated.',
            action:
              'Reverse image search the screenshots. Ask for the live link and a commit or file that carries their name.',
          },
          {
            flag: 'Reviews bunched into a day or two, all five stars, all short.',
            action:
              'Read the oldest reviews rather than the newest. If the platform allows it, message one past client.',
          },
          {
            flag: 'Asks for production access, credentials or admin rights before any work is done.',
            action:
              'Start with a paid trial on a separate branch and the least access the task needs. Rotate anything you shared when the contract ends.',
          },
        ],
        memo: {
          re: 'Onboarding a contractor',
          title: 'The first week',
          steps: [
            'Begin with a small paid trial task with a clear finish line.',
            'Give the least access the task needs: a branch, a staging environment, no production secrets.',
            'Keep payment in platform milestones or escrow until work is delivered.',
            'Put ownership of the work in writing before the first commit.',
            'Keep keys and credentials out of the repository, and rotate them when the contract ends.',
          ],
          sign: 'Filed under FL · keep for reference',
        },
      }}
      intake={{
        title: 'Check the candidate',
        lede: (
          <p>
            Paste whatever they’ve given you: a GitHub username, an X or Instagram handle, a YouTube channel, a portfolio
            link. We read what’s public. The candidate isn’t notified.
          </p>
        ),
        label: 'Candidate’s handle or profile link',
        placeholder: '@pixel_pro_dev',
        hint: 'For freelance platform profiles that need a login, the next page lets you type in the numbers you can see: orders, reviews, member since.',
      }}
      limits={{
        title: 'A print can’t see the keyboard',
        body: (
          <p>
            A print shows an account’s history and audience. It cannot tell you who is typing, how good their code is,
            or whether they’ll hit a deadline. The live call and a paired task do that work; the print tells you where to
            look first.
          </p>
        ),
        questions: [
          {
            q: 'Is a mixed print a reason not to hire?',
            a: (
              <p>
                Not on its own. Most people with years of work behind them have a patch or two that didn’t develop. Read
                the ghost lines and ask about them.
              </p>
            ),
          },
          {
            q: 'Can this tell me if someone is a proxy?',
            a: (
              <p>
                No. Proxy interviewing happens on the call, not in the public record. A live video call with the camera
                on and a short paired task are what catch it.
              </p>
            ),
          },
          {
            q: 'I’m checking a whole agency’s team. Is there a faster way?',
            a: (
              <p>
                The <Link href="/tools/bulk">bulk tool</Link> takes a list of handles and develops each one in turn, then lets
                you export the results.
              </p>
            ),
          },
        ],
      }}
    />
  );
}
