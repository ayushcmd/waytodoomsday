# Community documentation review — November 28, 2026

Prepared for [Issue #11](https://github.com/ayushcmd/waytodoomsday/issues/11) against
fetched main `ee06a36d3f4f43ae289a9b122bd0b074f660ecb4`. Application behavior,
assets, existing agent instructions and editorial guides are unchanged.

## Decisions approved by the owner

- Reuse PR #2's standard MIT license for original code with copyright attribution
  “2026 Ayush Raj”, excluding third-party content. PR #2 was closed/unmerged when
  reviewed; its notice is expanded rather than treated as existing policy.
- Use **ayush_24a12res897@iitp.ac.in** for private security and conduct reports
  (owner corrected the initially supplied domain). The existing website contact
  is unchanged; no message has been sent to either address.

GitHub's public private-vulnerability-reporting endpoint returned `enabled: false`
on November 28. SECURITY.md therefore provides the approved email fallback and
explains the GitHub route if later enabled. No repository security setting was
changed. There is no guaranteed response SLA or promised bounty.

## Decisions still requiring review

1. **Media rights:** repository provenance does not establish redistribution
   permission for posters, footage, branding, icons or screenshots. Review the
   [third-party inventory](../THIRD_PARTY_NOTICES.md) and obtain permission, document
   another valid basis, or remove/replace material in a separately scoped change.
   Non-commercial status, MIT code licensing and attribution are insufficient alone.
2. **External catalogue links:** `movies.json` includes Drive and non-studio
   watch/redirect destinations. Their authorization is not verified. The existing
   privacy page's statement that links point solely to official/authorized
   platforms cannot be repeated as fact. Owner review is required.
3. **Privacy wording:** the October 2026 privacy page says no personal data is
   collected and describes local storage, but the enquiry widget submits user
   messages to Formspree; messages may contain personal information. Google Fonts,
   TMDB image/logo requests and host/provider processing also need accurate
   disclosure. The page's blanket fair-use statement is not a verified rights
   determination. Reconcile the public policy with deployed behavior in a
   separately reviewed application/content change; this docs-only PR does not
   change the privacy route or guarantee provider retention/security practices.
4. **Distribution notices:** direct package licenses were checked against the
   lockfile. Review transitive licenses and actual bundled output, retaining
   required license/NOTICE files before redistribution. This is not a complete
   legal clearance of the website.
5. **Existing dependencies:** `npm ci` and a read-only `npm audit` reported ten
   advisories in the unchanged lockfile (one critical, eight high, one moderate),
   including Astro and transitive build dependencies. Assess applicability and
   remediation in a dependency-focused change; this documentation PR does not run
   `npm audit fix` or alter the lockfile. Audit counts can change with provider data.

No maintainer roster, funding account, release version, private encryption key or
security-response deadline has been invented. These notes identify unresolved
work for review rather than silently changing policy or application features.

## Validation

- `npm ci` completed with the unchanged lockfile; audit findings are recorded above.
- `node --test tests/*.test.js`: 18 passed. `npm run build`: seven routes built.
- Thirteen Markdown files parsed; 101 links/anchors checked, including local
  targets for future main-branch policy links. Existing guide links remain valid.
  Three issue-template front matters and chooser YAML parsed successfully.
- External documentation/source links returned HTTP 200 except GitHub's commit
  history page, which rate-limited the automated check (HTTP 429). Its repository
  history was verified locally; this is not a missing-target result.
- Background dev start/status/logs/stop commands ran successfully. Static preview
  served home, a character route and privacy route with HTTP 200, then was stopped.
- LICENSE matches PR #2's reviewed text exactly. Source, assets, package/lockfile,
  tests, existing agent instructions and prior editorial guides remain unchanged.

GitHub template syntax and Markdown were checked locally; the live issue chooser
will pick up these files after merging into the default branch. No application
UI or design changes are included, so no new visual QA screenshots are needed.
