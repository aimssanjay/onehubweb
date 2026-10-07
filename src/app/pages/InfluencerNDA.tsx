import { FileText, Printer, Mail, Phone, MapPin } from 'lucide-react';

// Content of "OneHub-Influencer-NDA" (Agreement Ref. 07TO2026), kept word for word.
const AGREEMENT_REFERENCE = '07TO2026';
const EFFECTIVE_DATE = '05/10/2026';

const sections: { title: string; body: string; critical?: boolean }[] = [
  {
    title: 'Parties',
    body: 'This Agreement is between One Hub (operated by Rewind Production), a UAE company (“Agency”), and the Influencer named in the signature block below. The end Client is exclusively the Agency’s client, is NOT a party to this Agreement, and bears no financial or contractual obligation to the Influencer. All payment, communication, and approval flows solely through the Agency.',
  },
  {
    title: 'Confidentiality',
    body: 'The Influencer must keep confidential: the Client’s identity and business details, campaign budgets and commercial terms, creative/digital assets, and the existence and terms of this Agreement itself. Confidential Information may be used only to fulfill the Deliverables and must not be shared with any third party.',
  },
  {
    title: 'Non-Circumvention (Critical Clause)',
    critical: true,
    body: 'The Influencer shall NEVER contact, approach, solicit, or transact directly with the Client for payment, future work, or any other purpose — without prior written Agency approval. All Client interactions must go through the Agency. This obligation survives termination for 6-12 months. Breach triggers immediate penalties (see Clause 6 below).',
  },
  {
    title: 'Influencer License & Compliance',
    body: 'Payment is conditional on the Influencer holding a valid UAE Influencer/e-Media Activity License at all times, provided to the Agency on signing and renewal. No license = no payment, with no exceptions. The Influencer must comply with UAE cybercrime, data protection, and NMC advertising-disclosure laws, and clearly disclose all paid/sponsored content.',
  },
  {
    title: 'Deliverables, Ownership & Payment',
    body: 'Deliverables (one collaboration reel + stories) are specified in writing before work begins and require Agency approval before publishing. Payment is due only once: Deliverables are completed and Client-approved, a valid license is on file, the Influencer is not in breach, and an invoice is submitted paid within 14–20 working days of Client approval, in AED, by bank transfer. Rejected Deliverables receive no payment.',
  },
  {
    title: 'Penalties for Breach',
    body: 'Any breach especially direct Client contact, license failure, or unauthorized disclosure allows the Agency to: withhold all payments; impose a penalty of AED 10,000 or the full project fee (whichever is higher); charge 100% of any circumvented transaction value; terminate and blacklist the Influencer; and pursue legal action in the Dubai courts to recover damages and costs.',
  },
  {
    title: 'Non-Solicitation & Term',
    body: 'For 6-12 months after this Agreement ends, the Influencer may not solicit or work directly with any Client introduced via the Agency. This Agreement runs for the duration of the engagement and may be terminated immediately by the Agency for breach, license failure, unauthorized Client contact, or Client withdrawal of approval.',
  },
  {
    title: 'Governing Law',
    body: 'This Agreement is governed by UAE and Dubai law. Disputes go to good-faith negotiation first, then the exclusive jurisdiction of the Dubai courts. The prevailing party recovers reasonable legal costs.',
  },
];

export function InfluencerNDA() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 print:bg-white print:py-0">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">

        {/* Toolbar */}
        <div className="mb-4 flex items-center justify-between print:hidden">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700">
            <FileText className="h-4 w-4 text-primary" /> Influencer Agreement
          </span>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            <Printer className="h-4 w-4" /> Print / Save as PDF
          </button>
        </div>

        <article className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-10 print:border-0 print:p-0">

          {/* Document header */}
          <header className="border-b border-gray-200 pb-6 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-900">
              Strictly Confidential | For Influencer Use Only
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-500">
              <span>Agreement Reference No.: <strong className="text-gray-700">{AGREEMENT_REFERENCE}</strong></span>
              <span>Effective Date: <strong className="text-gray-700">{EFFECTIVE_DATE}</strong></span>
            </div>

            <div className="mx-auto mt-4 max-w-xl rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold uppercase leading-relaxed text-red-700">
              This is a legally binding document under the laws of the United Arab Emirates.
              <br />
              Read all terms carefully before signing.
            </div>

            <p className="mt-6 text-sm font-semibold text-primary">ONE HUB (operated by Rewind Production)</p>
            <h1 className="mt-1 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
              Non-Disclosure, Non-Circumvention &amp; Influencer Engagement Agreement
            </h1>
          </header>

          {/* Clauses */}
          <ol className="mt-6 space-y-5">
            {sections.map((section, index) => (
              <li
                key={section.title}
                className={section.critical ? 'rounded-xl border border-amber-200 bg-amber-50/60 p-4' : ''}
              >
                <h2 className="flex items-baseline gap-2 text-base font-bold text-gray-900">
                  <span className="text-primary">{index + 1}.</span>
                  {section.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-700">{section.body}</p>
              </li>
            ))}
          </ol>

          <p className="mt-8 border-t border-gray-200 pt-5 text-sm italic text-gray-500">
            This is a condensed summary of the full Agreement. By signing, both Parties confirm they have read and
            understood the complete terms.
          </p>

          {/* Signature block */}
          <section className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 p-4">
              <h3 className="text-sm font-bold text-gray-900">For the Agency — One Hub (Rewind Production)</h3>
              <dl className="mt-3 space-y-3 text-sm">
                <div><dt className="text-gray-500">Name</dt><dd className="font-medium text-gray-900">Sudip Chatterjee</dd></div>
                <div><dt className="text-gray-500">Signature</dt><dd className="mt-5 border-b border-gray-300" /></div>
                <div><dt className="text-gray-500">Date</dt><dd className="mt-5 border-b border-gray-300" /></div>
              </dl>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <h3 className="text-sm font-bold text-gray-900">For the Influencer</h3>
              <dl className="mt-3 space-y-3 text-sm">
                <div><dt className="text-gray-500">Name</dt><dd className="mt-5 border-b border-gray-300" /></div>
                <div><dt className="text-gray-500">Signature</dt><dd className="mt-5 border-b border-gray-300" /></div>
                <div><dt className="text-gray-500">Emirates ID / License No.</dt><dd className="mt-5 border-b border-gray-300" /></div>
              </dl>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-gray-200 pt-5 text-xs text-gray-500">
            <span className="font-semibold text-gray-700">One Hub (Rewind Production)</span>
            <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Dubai, UAE</span>
            <a href="mailto:info@onehub.ae" className="inline-flex items-center gap-1 hover:text-primary">
              <Mail className="h-3.5 w-3.5" /> info@onehub.ae
            </a>
            <a href="tel:+971524063000" className="inline-flex items-center gap-1 hover:text-primary">
              <Phone className="h-3.5 w-3.5" /> +971 52 406 3000
            </a>
            <span>— Confidential</span>
          </footer>
        </article>
      </div>
    </div>
  );
}
