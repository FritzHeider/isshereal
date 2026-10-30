import type { Metadata } from 'next';
import React from 'react';
import { CaseFile } from '@/components/cases/CaseFile';
import { PriceCheck } from '@/components/cases/PriceCheck';

const DESCRIPTION =
  'How to look at a second-hand seller before any money moves: the signs that a listing isn’t what it seems, a quick price check, and how to pay safely.';

export const metadata: Metadata = {
  title: 'Marketplace buyers',
  description: DESCRIPTION,
  alternates: { canonical: '/use-cases/marketplace-buyers' },
  openGraph: {
    title: 'Marketplace buyers · Is the seller behind the bargain real?',
    description: DESCRIPTION,
    url: '/use-cases/marketplace-buyers',
    type: 'article',
  },
};

export default function MarketplaceBuyersPage() {
  return (
    <CaseFile
      code="MK"
      slug="marketplace-buyers"
      crumb="Marketplace buyers"
      glyph="marketplace"
      gentle
      opening={{
        title: (
          <>
            Is the seller behind the bargain <span className="safe">real?</span>
          </>
        ),
        lede: (
          <>
            <p>
              Most second-hand sales go fine: a stranger, a fair price, a thing that works. When one goes wrong, it tends
              to go wrong in the same few ways.
            </p>
            <p>
              Here is how to look at a seller before any money moves, and how to pay so that if something does go wrong,
              you can get it back.
            </p>
          </>
        ),
        aside: (
          <dl className="specs case-tag">
            <dt>Pay</dt>
            <dd>On the platform, or cash once you’ve seen it working</dd>
            <dt>Meet</dt>
            <dd>Somewhere public, with cameras</dd>
            <dt>Gift cards</dt>
            <dd>Never. No real seller asks for them</dd>
          </dl>
        ),
      }}
      example={{
        reportId: 'quickdeals',
        kicker: 'Worked example · MK-0307 · fictional',
        title: (
          <>
            QuickDeals <span className="ghost">barely came up.</span>
          </>
        ),
        body: (
          <>
            <p>
              QuickDeals is invented, but the shape is real: a shop-sized seller that appeared three days ago with
              expensive electronics at a fraction of the usual price.
            </p>
            <p>
              Very little about the account developed. The parts that stayed ghost are all about one thing: getting your
              money somewhere it can’t be brought back.
            </p>
          </>
        ),
        alt: 'Shop logo for “QuickDeals”: a shopping trolley full of price tags with a lightning bolt',
        ghostNotes: [
          'Zelle, wire transfers and crypto can’t be pulled back once sent. A seller who insists on them is asking you to give up your protection first.',
          'A three-day-old account with a shop’s worth of expensive stock. New sellers are normal. New sellers with twenty luxury listings on day one are not.',
          'The platform’s checkout is the one thing standing between you and a lost payment. Refusing it is reason enough to walk away.',
        ],
        developedNotes: [
          'An email address was confirmed by an automated check. Anyone can make one in a minute. It tells you the account exists and little more.',
        ],
      }}
      flags={{
        title: (
          <>
            Seven signs the listing <span className="ghost">won’t develop</span>
          </>
        ),
        lede: (
          <p>
            A single flag can have an innocent explanation: people do sell things cheaply when they move house. Several
            together, especially anything about how you pay, are your cue to slow down.
          </p>
        ),
        items: [
          {
            flag: 'The price is far below everyone else’s for the same item.',
            action:
              'Look up recent sold prices, not asking prices. A third off something in demand needs a reason you can check. The price check below does the sum.',
          },
          {
            flag: 'Insists on Zelle, Cash App, wire transfer, crypto, gift cards or PayPal Friends and Family.',
            action: 'Keep payment on the platform, or pay cash in person once you’ve seen the item working.',
          },
          {
            flag: 'Sends a link to an outside “escrow” service or a courier page that wants a fee.',
            action:
              'Don’t pay through it. Real couriers don’t charge you to release a parcel, and real escrow is chosen by the buyer, not the seller.',
          },
          {
            flag: 'The listing photos appear somewhere else, often on an old sold listing.',
            action:
              'Reverse image search the photos. Ask for one new picture with today’s date written on paper next to the item.',
          },
          {
            flag: 'The account is brand new, or very old but suddenly selling things it never sold before.',
            action:
              'Scroll back through the profile. Old accounts do get taken over; a twelve-year-old profile that only began selling phones this week deserves a few questions.',
          },
          {
            flag: 'Can’t meet and won’t video: “I’m away, a relative will post it.”',
            action:
              'For anything you can’t afford to lose, buy where you can collect, or where the platform covers delivery.',
          },
          {
            flag: 'Pressure: other buyers waiting, a deposit needed today.',
            action: 'Let it go. A real bargain will still be a real bargain tomorrow morning.',
          },
        ],
        memo: {
          re: 'Handing over money',
          title: 'At the handover',
          steps: [
            'Meet in a public place with cameras. Many police stations have a marked spot for exactly this.',
            'Bring someone along for anything expensive.',
            'Switch it on and try it before paying. Check serial numbers match the box.',
            'Pay on the platform or in cash at the handover. Never send money ahead for something you haven’t seen.',
            'Never pay with gift cards.',
            'Keep messages on the platform so there’s a record if you need to claim.',
          ],
          sign: 'Filed under MK · keep for reference',
        },
      }}
      extra={<PriceCheck slug="marketplace-buyers" />}
      intake={{
        title: 'Look at the seller',
        lede: (
          <p>
            If the seller has an Instagram, TikTok or shop handle, paste it here. It’s often linked from the listing or
            their profile. We read what’s public and nobody is told.
          </p>
        ),
        label: 'Seller’s handle or profile link',
        placeholder: '@quickdeals_store',
        hint: 'Marketplace profiles that need a login can’t be read directly. On the next page you can type in the numbers you can see instead.',
      }}
      limits={{
        title: 'A good print isn’t a receipt',
        body: (
          <p>
            A print describes an account: its audience, its age, its history. It can’t see the item, the parcel or the
            person holding it. Even a seller who comes through cleanly should be paid in a way you can reverse.
          </p>
        ),
        questions: [
          {
            q: 'Does a good score mean it’s safe to pay?',
            a: (
              <p>
                No. It means the account looks like a real, established one. Accounts can be borrowed or taken over, so
                keep the payment protected whatever the print shows.
              </p>
            ),
          },
          {
            q: 'Why can’t you read the marketplace listing itself?',
            a: (
              <p>
                Most marketplaces keep seller pages behind a login, and we don’t log in as anyone. Social handles and shop
                pages are public, so those are what we develop.
              </p>
            ),
          },
          {
            q: 'I’ve already paid. What now?',
            a: (
              <p>
                Contact your bank or card provider today and ask about a chargeback or recall. Report the listing to the
                platform and keep every message. Card and platform payments are the easiest to recover, which is why
                they’re worth insisting on next time.
              </p>
            ),
          },
        ],
      }}
    />
  );
}
