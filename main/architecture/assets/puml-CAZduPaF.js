function n(i){switch(i){case"cliComponents":return`@startuml
title "Components / CLI Internals"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<SkillAuthor>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam person<<SkillConsumer>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<ClaudeCode>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<SkillsignCliSigningEngine>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<SkillsignCliVerificationEngine>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<SkillsignCliAuthHandler>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<SkillsignCliManifestReader>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<Fulcio>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<SkillsignCliCanonicalProcessor>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<SkillsignCliPolicyEngine>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<SkillsignCliSidecarManager>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<SkillsignCliTufClient>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<SkillsignCliRekorClient>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<Github>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<SigstoreDex>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam database<<SkillsignSkillFiles>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<Tuf>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam database<<SkillsignTufCache>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<Rekor>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
person "==Skill Author\\n\\nA developer who creates and signs SKILL.md files for distribution" <<SkillAuthor>> as SkillAuthor
person "==Skill Consumer\\n\\nA developer who installs and uses signed skills in Claude Code" <<SkillConsumer>> as SkillConsumer
rectangle "==Claude Code\\n\\nAnthropic CLI that loads and executes SKILL.md files as instructions" <<ClaudeCode>> as ClaudeCode
rectangle "SkillSign CLI" <<SkillsignCli>> as SkillsignCli {
  skinparam RectangleBorderColor<<SkillsignCli>> #3b82f6
  skinparam RectangleFontColor<<SkillsignCli>> #3b82f6
  skinparam RectangleBorderStyle<<SkillsignCli>> dashed

  rectangle "==Signing Engine\\n<size:10>[ECDSA P-256, X.509]</size>\\n\\nOrchestrates the signing protocol via Sigstore SDK: reads manifest, canonicalizes SKILL.md, computes digest, obtains OIDC identity token, invokes SigningContext.signer() which generates ephemeral keypair, obtains Fulcio certificate, signs digest, and submits to Rekor. Extracts signer identity from certificate SAN (URI for GitHub Actions OIDC, email for personal OAuth via Dex). Returns assembled sidecar dict; sidecar writing is delegated to the CLI layer." <<SkillsignCliSigningEngine>> as SkillsignCliSigningEngine
  rectangle "==Verification Engine\\n<size:10>[ECDSA P-256, X.509]</size>\\n\\nOrchestrates verification: reads sidecar via SidecarManager, recomputes digest, verifies ECDSA P-256 signature using certificate public key, validates cert chain against Fulcio root via TUF TrustedRoot and pyOpenSSL, checks EKU id-kp-codeSigning OID, verifies SAN identity match (URI or email), checks temporal binding (rekor_timestamp within cert validity), and checks SKILL_ID_MISMATCH owner-path consistency (skipped for email signers). In --strict mode, delegates live Rekor queries to rekorClient to confirm log entry existence and digest match. Phase 2: SET cryptographic verification against Rekor public key." <<SkillsignCliVerificationEngine>> as SkillsignCliVerificationEngine
  rectangle "==Auth Handler\\n<size:10>[OIDC]</size>\\n\\nObtains OIDC identity token for signing. Detects ambient CI credentials first (GitHub Actions OIDC via detect_credential(\\"sigstore\\") with client ID _SIGSTORE_CLIENT_ID=\\"sigstore\\"). Falls back to interactive browser-based flow via Sigstore OAuth issuer (oauth2.sigstore.dev/auth). Returns IdentityToken for use with Sigstore SigningContext." <<SkillsignCliAuthHandler>> as SkillsignCliAuthHandler
  rectangle "==Manifest Reader\\n<size:10>[YAML 1.2]</size>\\n\\nReads skillsign.yaml to extract skill_id and skill_version at signing time, with same strict YAML parsing restrictions as the sidecar (Section 7.3)" <<SkillsignCliManifestReader>> as SkillsignCliManifestReader
  rectangle "==Canonical Form Processor\\n<size:10>[UTF-8, SHA-256]</size>\\n\\nImplemented across canonical.py and digest.py. canonical.py: 8-step normalization (BOM strip, CRLF normalization, trailing whitespace trim, single trailing newline, UTF-8 encode, null-byte rejection). digest.py: domain-separated SHA-256 over \\"skillsign:v1\\" + x00 + canonical + x00 + skill_id + x00 + skill_version. Also validates skill_id and skill_version format." <<SkillsignCliCanonicalProcessor>> as SkillsignCliCanonicalProcessor
  rectangle "==Policy Engine\\n<size:10>[YAML 1.2]</size>\\n\\n[Phase 2, not yet implemented] Evaluates trust policies with first-match-wins rule evaluation, signer_org matching with lowercase normalization, and max_age_days enforcement against verified rekor_timestamp" <<SkillsignCliPolicyEngine>> as SkillsignCliPolicyEngine
  rectangle "==Sidecar Manager\\n<size:10>[YAML 1.2]</size>\\n\\nImplemented as a single sidecar.py module combining reader and writer. Writer: assembles canonical field-ordered YAML (PEM fields as literal block scalars) and writes atomically via temp file rename. Reader: parses with strictyaml (enforces no duplicates/anchors/aliases/tags), validates all fields (digest sha256:hex, signer as URL or email, base64 SET, PEM cert), max 64KB." <<SkillsignCliSidecarManager>> as SkillsignCliSidecarManager
  rectangle "==TUF Client\\n<size:10>[TUF, HTTPS]</size>\\n\\nWraps Sigstore SDK TrustedRoot via infra/tuf.py. Fetches production TUF root metadata including Fulcio root certificates and Rekor public key. Falls back to cached metadata when offline. Used by verification engine for cert chain validation." <<SkillsignCliTufClient>> as SkillsignCliTufClient
  rectangle "==Rekor Client\\n<size:10>[HTTPS, JSON]</size>\\n\\nWraps Rekor transparency log queries via infra/rekor.py. Fetches log entries by log ID using the Rekor search API (/api/v1/log/entries/retrieve). Used by verification engine in --strict mode to confirm the log entry exists and the digest and cert match." <<SkillsignCliRekorClient>> as SkillsignCliRekorClient
}
rectangle "==Fulcio CA\\n\\nSigstore certificate authority that issues short-lived certificates binding a verified GitHub identity to a signer-generated ephemeral public key" <<Fulcio>> as Fulcio
rectangle "==GitHub Actions OIDC\\n\\nCI identity provider: GitHub Actions runtime issues OIDC tokens encoding the exact repo, workflow, and branch. Fulcio verifies these tokens and issues certificates with URI SANs (e.g., https://github.com/{org}/{repo}/.github/workflows/...). The signer cannot forge the token — only code running in the actual workflow receives it." <<Github>> as Github
rectangle "==Sigstore Dex (OAuth)\\n\\nInteractive identity provider: Sigstore-hosted Dex instance (oauth2.sigstore.dev/auth) that federates to Google, GitHub, and Microsoft OAuth. Fulcio verifies the Dex-issued token and issues certificates with email SANs (e.g., user@gmail.com). The email proves account ownership but says nothing about which repo or org the signer belongs to." <<SigstoreDex>> as SigstoreDex
database "==Skill File Store\\n<size:10>[Local File System]</size>\\n\\nSKILL.md files, skillsign.yaml manifests, .skillsign sidecars, and .skillsign-policy.yaml trust policies on disk" <<SkillsignSkillFiles>> as SkillsignSkillFiles
rectangle "==TUF Root\\n\\nThe Update Framework root of trust distributing Sigstore public keys" <<Tuf>> as Tuf
database "==TUF Root Cache\\n<size:10>[Local File System]</size>\\n\\nLocal cache of bundled and fetched Sigstore TUF root metadata and Fulcio root certificates" <<SkillsignTufCache>> as SkillsignTufCache
rectangle "==Rekor Transparency Log\\n\\nAppend-only, publicly auditable log recording signatures, certificates, and digests" <<Rekor>> as Rekor

SkillAuthor .[#8D8D8D,thickness=2].> SkillsignCliSigningEngine : "<color:#8D8D8D>Signs SKILL.md files via CLI<color:#8D8D8D>"
SkillConsumer .[#8D8D8D,thickness=2].> SkillsignCliVerificationEngine : "<color:#8D8D8D>Verifies skill signatures via CLI<color:#8D8D8D>"
ClaudeCode .[#8D8D8D,thickness=2].> SkillsignCliVerificationEngine : "<color:#8D8D8D>Invokes verification before loading skills<color:#8D8D8D>"
SkillsignCliSigningEngine .[#8D8D8D,thickness=2].> SkillsignCliAuthHandler : "<color:#8D8D8D>Gets OIDC identity token from<color:#8D8D8D>"
SkillsignCliSigningEngine .[#8D8D8D,thickness=2].> SkillsignCliCanonicalProcessor : "<color:#8D8D8D>Gets SHA-256 digest from<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignCliCanonicalProcessor : "<color:#8D8D8D>Recomputes digest via<color:#8D8D8D>"
SkillsignCliSigningEngine .[#8D8D8D,thickness=2].> SkillsignCliManifestReader : "<color:#8D8D8D>Reads skill_id and skill_version from<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignCliPolicyEngine : "<color:#8D8D8D>Passes verified signer identity, rekor_timestamp, and skill_id for policy evaluation [Phase 2]<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignCliSidecarManager : "<color:#8D8D8D>Reads sidecar fields via<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignCliTufClient : "<color:#8D8D8D>Gets trusted Fulcio root certificates and Rekor public key from<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignCliRekorClient : "<color:#8D8D8D>Queries Rekor log entries for strict mode verification<color:#8D8D8D>"
SkillsignCliAuthHandler .[#8D8D8D,thickness=2].> Github : "<color:#8D8D8D>Detects ambient OIDC token from GitHub Actions runtime (CI path)<color:#8D8D8D>"
SkillsignCliAuthHandler .[#8D8D8D,thickness=2].> SigstoreDex : "<color:#8D8D8D>Opens browser for OAuth login via Dex — user picks Google, GitHub, or Microsoft (interactive path)<color:#8D8D8D>"
SkillsignCliSigningEngine .[#8D8D8D,thickness=2].> Fulcio : "<color:#8D8D8D>Submits ephemeral public key and OIDC token via Sigstore SDK, receives short-lived X.509 certificate<color:#8D8D8D>"
SkillsignCliSigningEngine .[#8D8D8D,thickness=2].> Rekor : "<color:#8D8D8D>Submits signature, certificate, and digest as hashedrekord/v0.0.1 entry via Sigstore SDK<color:#8D8D8D>"
SkillsignCliSigningEngine .[#8D8D8D,thickness=2].> SkillsignSkillFiles : "<color:#8D8D8D>Checks for existing .skillsign sidecar before signing<color:#8D8D8D>"
SkillsignCliPolicyEngine .[#8D8D8D,thickness=2].> SkillsignSkillFiles : "<color:#8D8D8D>Reads .skillsign-policy.yaml trust policies [Phase 2]<color:#8D8D8D>"
SkillsignCliSidecarManager .[#8D8D8D,thickness=2].> SkillsignSkillFiles : "<color:#8D8D8D>Reads and writes .skillsign sidecar files<color:#8D8D8D>"
SkillsignCliManifestReader .[#8D8D8D,thickness=2].> SkillsignSkillFiles : "<color:#8D8D8D>Reads skillsign.yaml manifests<color:#8D8D8D>"
SkillsignCliTufClient .[#8D8D8D,thickness=2].> Tuf : "<color:#8D8D8D>Fetches current TUF root metadata via HTTPS<color:#8D8D8D>"
SkillsignCliTufClient .[#8D8D8D,thickness=2].> SkillsignTufCache : "<color:#8D8D8D>Reads and writes cached TUF metadata via local filesystem<color:#8D8D8D>"
SkillsignCliRekorClient .[#8D8D8D,thickness=2].> Rekor : "<color:#8D8D8D>Queries transparency log entries via HTTPS/JSON<color:#8D8D8D>"
@enduml
`;case"skillsignContainers":return`@startuml
title "Containers / SkillSign Containers"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<SkillAuthor>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam person<<SkillConsumer>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<ClaudeCode>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<SkillsignCli>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam database<<SkillsignSkillFiles>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam database<<SkillsignTufCache>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<Github>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<SigstoreDex>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<Fulcio>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<Rekor>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<Tuf>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
person "==Skill Author\\n\\nA developer who creates and signs SKILL.md files for distribution" <<SkillAuthor>> as SkillAuthor
person "==Skill Consumer\\n\\nA developer who installs and uses signed skills in Claude Code" <<SkillConsumer>> as SkillConsumer
rectangle "==Claude Code\\n\\nAnthropic CLI that loads and executes SKILL.md files as instructions" <<ClaudeCode>> as ClaudeCode
rectangle "SkillSign" <<Skillsign>> as Skillsign {
  skinparam RectangleBorderColor<<Skillsign>> #0284c7
  skinparam RectangleFontColor<<Skillsign>> #0284c7
  skinparam RectangleBorderStyle<<Skillsign>> dashed

  rectangle "==SkillSign CLI\\n<size:10>[Python, Click]</size>\\n\\nCommand-line tool for signing and verifying SKILL.md files. Also provides auth status, inspect, and unsign subcommands (Section 9.1)" <<SkillsignCli>> as SkillsignCli
  database "==Skill File Store\\n<size:10>[Local File System]</size>\\n\\nSKILL.md files, skillsign.yaml manifests, .skillsign sidecars, and .skillsign-policy.yaml trust policies on disk" <<SkillsignSkillFiles>> as SkillsignSkillFiles
  database "==TUF Root Cache\\n<size:10>[Local File System]</size>\\n\\nLocal cache of bundled and fetched Sigstore TUF root metadata and Fulcio root certificates" <<SkillsignTufCache>> as SkillsignTufCache
}
rectangle "==GitHub Actions OIDC\\n\\nCI identity provider: GitHub Actions runtime issues OIDC tokens encoding the exact repo, workflow, and branch. Fulcio verifies these tokens and issues certificates with URI SANs (e.g., https://github.com/{org}/{repo}/.github/workflows/...). The signer cannot forge the token — only code running in the actual workflow receives it." <<Github>> as Github
rectangle "==Sigstore Dex (OAuth)\\n\\nInteractive identity provider: Sigstore-hosted Dex instance (oauth2.sigstore.dev/auth) that federates to Google, GitHub, and Microsoft OAuth. Fulcio verifies the Dex-issued token and issues certificates with email SANs (e.g., user@gmail.com). The email proves account ownership but says nothing about which repo or org the signer belongs to." <<SigstoreDex>> as SigstoreDex
rectangle "==Fulcio CA\\n\\nSigstore certificate authority that issues short-lived certificates binding a verified GitHub identity to a signer-generated ephemeral public key" <<Fulcio>> as Fulcio
rectangle "==Rekor Transparency Log\\n\\nAppend-only, publicly auditable log recording signatures, certificates, and digests" <<Rekor>> as Rekor
rectangle "==TUF Root\\n\\nThe Update Framework root of trust distributing Sigstore public keys" <<Tuf>> as Tuf

SkillsignCli .[#8D8D8D,thickness=2].> SkillsignSkillFiles : "<color:#8D8D8D>Reads and writes SKILL.md files, manifests, sidecars, and policies<color:#8D8D8D>"
SkillsignCli .[#8D8D8D,thickness=2].> SkillsignTufCache : "<color:#8D8D8D>Reads and writes cached TUF metadata<color:#8D8D8D>"
SkillAuthor .[#8D8D8D,thickness=2].> SkillsignCli : "<color:#8D8D8D>Signs SKILL.md files via CLI<color:#8D8D8D>"
SkillConsumer .[#8D8D8D,thickness=2].> SkillsignCli : "<color:#8D8D8D>Verifies skill signatures via CLI<color:#8D8D8D>"
ClaudeCode .[#8D8D8D,thickness=2].> SkillsignCli : "<color:#8D8D8D>Invokes verification before loading skills<color:#8D8D8D>"
SkillsignCli .[#8D8D8D,thickness=2].> Github : "<color:#8D8D8D>Authenticates CI workflows via OIDC/HTTPS<color:#8D8D8D>"
SkillsignCli .[#8D8D8D,thickness=2].> SigstoreDex : "<color:#8D8D8D>Authenticates developers via browser-based OAuth/HTTPS<color:#8D8D8D>"
SkillsignCli .[#8D8D8D,thickness=2].> Fulcio : "<color:#8D8D8D>Obtains short-lived signing certificates via HTTPS<color:#8D8D8D>"
SkillsignCli .[#8D8D8D,thickness=2].> Rekor : "<color:#8D8D8D>Submits and queries transparency log entries via HTTPS<color:#8D8D8D>"
SkillsignCli .[#8D8D8D,thickness=2].> Tuf : "<color:#8D8D8D>Fetches TUF root metadata via HTTPS<color:#8D8D8D>"
@enduml
`;case"index":return`@startuml
title "Context / System Context"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<SkillAuthor>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam person<<SkillConsumer>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<ClaudeCode>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<Skillsign>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<Github>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<SigstoreDex>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<Fulcio>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<Rekor>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<Tuf>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
person "==Skill Author\\n\\nA developer who creates and signs SKILL.md files for distribution" <<SkillAuthor>> as SkillAuthor
person "==Skill Consumer\\n\\nA developer who installs and uses signed skills in Claude Code" <<SkillConsumer>> as SkillConsumer
rectangle "==Claude Code\\n\\nAnthropic CLI that loads and executes SKILL.md files as instructions" <<ClaudeCode>> as ClaudeCode
rectangle "==SkillSign\\n\\nCryptographic signing and verification system for Claude Code SKILL.md files using Sigstore keyless signing" <<Skillsign>> as Skillsign
rectangle "==GitHub Actions OIDC\\n\\nCI identity provider: GitHub Actions runtime issues OIDC tokens encoding the exact repo, workflow, and branch. Fulcio verifies these tokens and issues certificates with URI SANs (e.g., https://github.com/{org}/{repo}/.github/workflows/...). The signer cannot forge the token — only code running in the actual workflow receives it." <<Github>> as Github
rectangle "==Sigstore Dex (OAuth)\\n\\nInteractive identity provider: Sigstore-hosted Dex instance (oauth2.sigstore.dev/auth) that federates to Google, GitHub, and Microsoft OAuth. Fulcio verifies the Dex-issued token and issues certificates with email SANs (e.g., user@gmail.com). The email proves account ownership but says nothing about which repo or org the signer belongs to." <<SigstoreDex>> as SigstoreDex
rectangle "==Fulcio CA\\n\\nSigstore certificate authority that issues short-lived certificates binding a verified GitHub identity to a signer-generated ephemeral public key" <<Fulcio>> as Fulcio
rectangle "==Rekor Transparency Log\\n\\nAppend-only, publicly auditable log recording signatures, certificates, and digests" <<Rekor>> as Rekor
rectangle "==TUF Root\\n\\nThe Update Framework root of trust distributing Sigstore public keys" <<Tuf>> as Tuf

SkillAuthor .[#8D8D8D,thickness=2].> Skillsign : "<color:#8D8D8D>Signs skill files for distribution<color:#8D8D8D>"
SkillConsumer .[#8D8D8D,thickness=2].> Skillsign : "<color:#8D8D8D>Verifies skill file authenticity<color:#8D8D8D>"
ClaudeCode .[#8D8D8D,thickness=2].> Skillsign : "<color:#8D8D8D>Verifies skills before loading<color:#8D8D8D>"
Skillsign .[#8D8D8D,thickness=2].> Github : "<color:#8D8D8D>Authenticates CI workflows via OIDC tokens<color:#8D8D8D>"
Skillsign .[#8D8D8D,thickness=2].> SigstoreDex : "<color:#8D8D8D>Authenticates developers via browser-based OAuth<color:#8D8D8D>"
Skillsign .[#8D8D8D,thickness=2].> Fulcio : "<color:#8D8D8D>Obtains signing certificates<color:#8D8D8D>"
Skillsign .[#8D8D8D,thickness=2].> Rekor : "<color:#8D8D8D>Records and queries signed artifacts<color:#8D8D8D>"
Skillsign .[#8D8D8D,thickness=2].> Tuf : "<color:#8D8D8D>Retrieves trusted signing keys<color:#8D8D8D>"
@enduml
`;case"errorInvalidManifest":return`@startuml
title "Flows / Skill Author / INVALID_MANIFEST — Invalid Manifest"
left to right direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<SkillAuthor>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<SkillsignCliSigningEngine>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<SkillsignCliManifestReader>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam database<<SkillsignSkillFiles>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
person "==Skill Author\\n\\nA developer who creates and signs SKILL.md files for distribution" <<SkillAuthor>> as SkillAuthor
rectangle "==Signing Engine\\n<size:10>[ECDSA P-256, X.509]</size>\\n\\nOrchestrates the signing protocol via Sigstore SDK: reads manifest, canonicalizes SKILL.md, computes digest, obtains OIDC identity token, invokes SigningContext.signer() which generates ephemeral keypair, obtains Fulcio certificate, signs digest, and submits to Rekor. Extracts signer identity from certificate SAN (URI for GitHub Actions OIDC, email for personal OAuth via Dex). Returns assembled sidecar dict; sidecar writing is delegated to the CLI layer." <<SkillsignCliSigningEngine>> as SkillsignCliSigningEngine
rectangle "==Manifest Reader\\n<size:10>[YAML 1.2]</size>\\n\\nReads skillsign.yaml to extract skill_id and skill_version at signing time, with same strict YAML parsing restrictions as the sidecar (Section 7.3)" <<SkillsignCliManifestReader>> as SkillsignCliManifestReader
database "==Skill File Store\\n<size:10>[Local File System]</size>\\n\\nSKILL.md files, skillsign.yaml manifests, .skillsign sidecars, and .skillsign-policy.yaml trust policies on disk" <<SkillsignSkillFiles>> as SkillsignSkillFiles

SkillAuthor .[#8D8D8D,thickness=2].> SkillsignCliSigningEngine : "<color:#8D8D8D>Runs: skillsign sign ./SKILL.md<color:#8D8D8D>"
SkillsignCliSigningEngine .[#8D8D8D,thickness=2].> SkillsignCliManifestReader : "<color:#8D8D8D>Reads and validates manifest<color:#8D8D8D>"
SkillsignCliManifestReader .[#8D8D8D,thickness=2].> SkillsignSkillFiles : "<color:#8D8D8D>Reads skillsign.yaml — fails<color:#8D8D8D>"
SkillsignCliSigningEngine .[#8D8D8D,thickness=2].> SkillAuthor : "<color:#8D8D8D>CLI error — exit code 10<color:#8D8D8D>"
@enduml
`;case"errorInvalidSkillFile":return`@startuml
title "Flows / Skill Author / INVALID_SKILL_FILE — Invalid SKILL.md"
left to right direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<SkillAuthor>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<SkillsignCliSigningEngine>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<SkillsignCliManifestReader>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam database<<SkillsignSkillFiles>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SkillsignCliCanonicalProcessor>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
person "==Skill Author\\n\\nA developer who creates and signs SKILL.md files for distribution" <<SkillAuthor>> as SkillAuthor
rectangle "==Signing Engine\\n<size:10>[ECDSA P-256, X.509]</size>\\n\\nOrchestrates the signing protocol via Sigstore SDK: reads manifest, canonicalizes SKILL.md, computes digest, obtains OIDC identity token, invokes SigningContext.signer() which generates ephemeral keypair, obtains Fulcio certificate, signs digest, and submits to Rekor. Extracts signer identity from certificate SAN (URI for GitHub Actions OIDC, email for personal OAuth via Dex). Returns assembled sidecar dict; sidecar writing is delegated to the CLI layer." <<SkillsignCliSigningEngine>> as SkillsignCliSigningEngine
rectangle "==Manifest Reader\\n<size:10>[YAML 1.2]</size>\\n\\nReads skillsign.yaml to extract skill_id and skill_version at signing time, with same strict YAML parsing restrictions as the sidecar (Section 7.3)" <<SkillsignCliManifestReader>> as SkillsignCliManifestReader
database "==Skill File Store\\n<size:10>[Local File System]</size>\\n\\nSKILL.md files, skillsign.yaml manifests, .skillsign sidecars, and .skillsign-policy.yaml trust policies on disk" <<SkillsignSkillFiles>> as SkillsignSkillFiles
rectangle "==Canonical Form Processor\\n<size:10>[UTF-8, SHA-256]</size>\\n\\nImplemented across canonical.py and digest.py. canonical.py: 8-step normalization (BOM strip, CRLF normalization, trailing whitespace trim, single trailing newline, UTF-8 encode, null-byte rejection). digest.py: domain-separated SHA-256 over \\"skillsign:v1\\" + x00 + canonical + x00 + skill_id + x00 + skill_version. Also validates skill_id and skill_version format." <<SkillsignCliCanonicalProcessor>> as SkillsignCliCanonicalProcessor

SkillAuthor .[#8D8D8D,thickness=2].> SkillsignCliSigningEngine : "<color:#8D8D8D>Runs: skillsign sign ./SKILL.md<color:#8D8D8D>"
SkillsignCliSigningEngine .[#8D8D8D,thickness=2].> SkillsignCliManifestReader : "<color:#8D8D8D>Reads and validates manifest<color:#8D8D8D>"
SkillsignCliManifestReader .[#8D8D8D,thickness=2].> SkillsignSkillFiles : "<color:#8D8D8D>Reads skillsign.yaml — OK<color:#8D8D8D>"
SkillsignCliSigningEngine .[#8D8D8D,thickness=2].> SkillsignSkillFiles : "<color:#8D8D8D>Checks for existing .skillsign sidecar — none found, OK<color:#8D8D8D>"
SkillsignCliSigningEngine .[#8D8D8D,thickness=2].> SkillsignCliCanonicalProcessor : "<color:#8D8D8D>Requests canonical form and digest<color:#8D8D8D>"
SkillsignCliSigningEngine .[#8D8D8D,thickness=2].> SkillsignSkillFiles : "<color:#8D8D8D>Reads SKILL.md file bytes<color:#8D8D8D>"
SkillsignCliSigningEngine .[#8D8D8D,thickness=2].> SkillAuthor : "<color:#8D8D8D>Canonical form normalization fails — exit code 10<color:#8D8D8D>"
@enduml
`;case"errorSidecarExists":return`@startuml
title "Flows / Skill Author / SIDECAR_EXISTS — Sidecar Already Exists"
left to right direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<SkillAuthor>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<SkillsignCliSigningEngine>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<SkillsignCliManifestReader>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam database<<SkillsignSkillFiles>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
person "==Skill Author\\n\\nA developer who creates and signs SKILL.md files for distribution" <<SkillAuthor>> as SkillAuthor
rectangle "==Signing Engine\\n<size:10>[ECDSA P-256, X.509]</size>\\n\\nOrchestrates the signing protocol via Sigstore SDK: reads manifest, canonicalizes SKILL.md, computes digest, obtains OIDC identity token, invokes SigningContext.signer() which generates ephemeral keypair, obtains Fulcio certificate, signs digest, and submits to Rekor. Extracts signer identity from certificate SAN (URI for GitHub Actions OIDC, email for personal OAuth via Dex). Returns assembled sidecar dict; sidecar writing is delegated to the CLI layer." <<SkillsignCliSigningEngine>> as SkillsignCliSigningEngine
rectangle "==Manifest Reader\\n<size:10>[YAML 1.2]</size>\\n\\nReads skillsign.yaml to extract skill_id and skill_version at signing time, with same strict YAML parsing restrictions as the sidecar (Section 7.3)" <<SkillsignCliManifestReader>> as SkillsignCliManifestReader
database "==Skill File Store\\n<size:10>[Local File System]</size>\\n\\nSKILL.md files, skillsign.yaml manifests, .skillsign sidecars, and .skillsign-policy.yaml trust policies on disk" <<SkillsignSkillFiles>> as SkillsignSkillFiles

SkillAuthor .[#8D8D8D,thickness=2].> SkillsignCliSigningEngine : "<color:#8D8D8D>Runs: skillsign sign ./SKILL.md<color:#8D8D8D>"
SkillsignCliSigningEngine .[#8D8D8D,thickness=2].> SkillsignCliManifestReader : "<color:#8D8D8D>Reads and validates manifest<color:#8D8D8D>"
SkillsignCliManifestReader .[#8D8D8D,thickness=2].> SkillsignSkillFiles : "<color:#8D8D8D>Reads skillsign.yaml — OK<color:#8D8D8D>"
SkillsignCliSigningEngine .[#8D8D8D,thickness=2].> SkillsignSkillFiles : "<color:#8D8D8D>Checks for existing sidecar (step 3)<color:#8D8D8D>"
SkillsignCliSigningEngine .[#8D8D8D,thickness=2].> SkillAuthor : "<color:#8D8D8D>Sidecar already exists — exit code 10<color:#8D8D8D>"
@enduml
`;case"errorSigningInfra":return`@startuml
title "Flows / Skill Author / SIGNING_INFRA — Signing Infrastructure Failure"
left to right direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<SkillAuthor>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<SkillsignCliSigningEngine>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<SkillsignCliAuthHandler>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<Fulcio>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<Rekor>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
person "==Skill Author\\n\\nA developer who creates and signs SKILL.md files for distribution" <<SkillAuthor>> as SkillAuthor
rectangle "==Signing Engine\\n<size:10>[ECDSA P-256, X.509]</size>\\n\\nOrchestrates the signing protocol via Sigstore SDK: reads manifest, canonicalizes SKILL.md, computes digest, obtains OIDC identity token, invokes SigningContext.signer() which generates ephemeral keypair, obtains Fulcio certificate, signs digest, and submits to Rekor. Extracts signer identity from certificate SAN (URI for GitHub Actions OIDC, email for personal OAuth via Dex). Returns assembled sidecar dict; sidecar writing is delegated to the CLI layer." <<SkillsignCliSigningEngine>> as SkillsignCliSigningEngine
rectangle "==Auth Handler\\n<size:10>[OIDC]</size>\\n\\nObtains OIDC identity token for signing. Detects ambient CI credentials first (GitHub Actions OIDC via detect_credential(\\"sigstore\\") with client ID _SIGSTORE_CLIENT_ID=\\"sigstore\\"). Falls back to interactive browser-based flow via Sigstore OAuth issuer (oauth2.sigstore.dev/auth). Returns IdentityToken for use with Sigstore SigningContext." <<SkillsignCliAuthHandler>> as SkillsignCliAuthHandler
rectangle "==Fulcio CA\\n\\nSigstore certificate authority that issues short-lived certificates binding a verified GitHub identity to a signer-generated ephemeral public key" <<Fulcio>> as Fulcio
rectangle "==Rekor Transparency Log\\n\\nAppend-only, publicly auditable log recording signatures, certificates, and digests" <<Rekor>> as Rekor

SkillAuthor .[#8D8D8D,thickness=2].> SkillsignCliSigningEngine : "<color:#8D8D8D>Manifest and canonical form valid, begins signing<color:#8D8D8D>"
SkillsignCliSigningEngine .[#8D8D8D,thickness=2].> SkillsignCliAuthHandler : "<color:#8D8D8D>Requests OIDC authentication<color:#8D8D8D>"
SkillsignCliAuthHandler .[#8D8D8D,thickness=2].> SkillsignCliAuthHandler : "<color:#8D8D8D>OIDC authentication fails — exit code 10<color:#8D8D8D>"
SkillsignCliSigningEngine .[#8D8D8D,thickness=2].> Fulcio : "<color:#8D8D8D>Certificate issuance fails — exit code 10<color:#8D8D8D>"
SkillsignCliSigningEngine .[#8D8D8D,thickness=2].> SkillsignCliSigningEngine : "<color:#8D8D8D>Local ECDSA signing fails — exit code 10<color:#8D8D8D>"
SkillsignCliSigningEngine .[#8D8D8D,thickness=2].> Rekor : "<color:#8D8D8D>Rekor submission fails — exit code 10<color:#8D8D8D>"
SkillsignCliSigningEngine .[#8D8D8D,thickness=2].> SkillAuthor : "<color:#8D8D8D>Signing infrastructure failure — exit code 10<color:#8D8D8D>"
@enduml
`;case"signingFlow":return`@startuml
title "Flows / Skill Author / Signing"
left to right direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<SkillAuthor>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<SkillsignCliSigningEngine>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<SkillsignCliManifestReader>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<SkillsignCliSidecarManager>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam database<<SkillsignSkillFiles>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SkillsignCliCanonicalProcessor>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<SkillsignCliAuthHandler>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<Github>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<SigstoreDex>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<Fulcio>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<Rekor>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
person "==Skill Author\\n\\nA developer who creates and signs SKILL.md files for distribution" <<SkillAuthor>> as SkillAuthor
rectangle "==Signing Engine\\n<size:10>[ECDSA P-256, X.509]</size>\\n\\nOrchestrates the signing protocol via Sigstore SDK: reads manifest, canonicalizes SKILL.md, computes digest, obtains OIDC identity token, invokes SigningContext.signer() which generates ephemeral keypair, obtains Fulcio certificate, signs digest, and submits to Rekor. Extracts signer identity from certificate SAN (URI for GitHub Actions OIDC, email for personal OAuth via Dex). Returns assembled sidecar dict; sidecar writing is delegated to the CLI layer." <<SkillsignCliSigningEngine>> as SkillsignCliSigningEngine
rectangle "==Manifest Reader\\n<size:10>[YAML 1.2]</size>\\n\\nReads skillsign.yaml to extract skill_id and skill_version at signing time, with same strict YAML parsing restrictions as the sidecar (Section 7.3)" <<SkillsignCliManifestReader>> as SkillsignCliManifestReader
rectangle "==Sidecar Manager\\n<size:10>[YAML 1.2]</size>\\n\\nImplemented as a single sidecar.py module combining reader and writer. Writer: assembles canonical field-ordered YAML (PEM fields as literal block scalars) and writes atomically via temp file rename. Reader: parses with strictyaml (enforces no duplicates/anchors/aliases/tags), validates all fields (digest sha256:hex, signer as URL or email, base64 SET, PEM cert), max 64KB." <<SkillsignCliSidecarManager>> as SkillsignCliSidecarManager
database "==Skill File Store\\n<size:10>[Local File System]</size>\\n\\nSKILL.md files, skillsign.yaml manifests, .skillsign sidecars, and .skillsign-policy.yaml trust policies on disk" <<SkillsignSkillFiles>> as SkillsignSkillFiles
rectangle "==Canonical Form Processor\\n<size:10>[UTF-8, SHA-256]</size>\\n\\nImplemented across canonical.py and digest.py. canonical.py: 8-step normalization (BOM strip, CRLF normalization, trailing whitespace trim, single trailing newline, UTF-8 encode, null-byte rejection). digest.py: domain-separated SHA-256 over \\"skillsign:v1\\" + x00 + canonical + x00 + skill_id + x00 + skill_version. Also validates skill_id and skill_version format." <<SkillsignCliCanonicalProcessor>> as SkillsignCliCanonicalProcessor
rectangle "==Auth Handler\\n<size:10>[OIDC]</size>\\n\\nObtains OIDC identity token for signing. Detects ambient CI credentials first (GitHub Actions OIDC via detect_credential(\\"sigstore\\") with client ID _SIGSTORE_CLIENT_ID=\\"sigstore\\"). Falls back to interactive browser-based flow via Sigstore OAuth issuer (oauth2.sigstore.dev/auth). Returns IdentityToken for use with Sigstore SigningContext." <<SkillsignCliAuthHandler>> as SkillsignCliAuthHandler
rectangle "==GitHub Actions OIDC\\n\\nCI identity provider: GitHub Actions runtime issues OIDC tokens encoding the exact repo, workflow, and branch. Fulcio verifies these tokens and issues certificates with URI SANs (e.g., https://github.com/{org}/{repo}/.github/workflows/...). The signer cannot forge the token — only code running in the actual workflow receives it." <<Github>> as Github
rectangle "==Sigstore Dex (OAuth)\\n\\nInteractive identity provider: Sigstore-hosted Dex instance (oauth2.sigstore.dev/auth) that federates to Google, GitHub, and Microsoft OAuth. Fulcio verifies the Dex-issued token and issues certificates with email SANs (e.g., user@gmail.com). The email proves account ownership but says nothing about which repo or org the signer belongs to." <<SigstoreDex>> as SigstoreDex
rectangle "==Fulcio CA\\n\\nSigstore certificate authority that issues short-lived certificates binding a verified GitHub identity to a signer-generated ephemeral public key" <<Fulcio>> as Fulcio
rectangle "==Rekor Transparency Log\\n\\nAppend-only, publicly auditable log recording signatures, certificates, and digests" <<Rekor>> as Rekor

SkillAuthor .[#8D8D8D,thickness=2].> SkillsignCliSigningEngine : "<color:#8D8D8D>Runs: skillsign sign ./SKILL.md<color:#8D8D8D>"
SkillsignCliSigningEngine .[#8D8D8D,thickness=2].> SkillsignCliManifestReader : "<color:#8D8D8D>Reads and validates manifest<color:#8D8D8D>"
SkillsignCliManifestReader .[#8D8D8D,thickness=2].> SkillsignSkillFiles : "<color:#8D8D8D>Reads skillsign.yaml manifest<color:#8D8D8D>"
SkillsignCliSigningEngine .[#8D8D8D,thickness=2].> SkillsignSkillFiles : "<color:#8D8D8D>Checks for existing sidecar (step 3)<color:#8D8D8D>"
SkillsignCliSigningEngine .[#8D8D8D,thickness=2].> SkillsignCliCanonicalProcessor : "<color:#8D8D8D>Requests canonical form and digest (steps 4-5)<color:#8D8D8D>"
SkillsignCliSigningEngine .[#8D8D8D,thickness=2].> SkillsignSkillFiles : "<color:#8D8D8D>Reads SKILL.md file bytes (step 4)<color:#8D8D8D>"
SkillsignCliSigningEngine .[#8D8D8D,thickness=2].> SkillsignCliAuthHandler : "<color:#8D8D8D>Requests OIDC authentication (step 6)<color:#8D8D8D>"
SkillsignCliAuthHandler .[#8D8D8D,thickness=2].> SkillsignCliAuthHandler : "<color:#8D8D8D>Detects authentication mode<color:#8D8D8D>"
SkillsignCliAuthHandler .[#8D8D8D,thickness=2].> Github : "<color:#8D8D8D>CI path: ambient OIDC token from GitHub Actions<color:#8D8D8D>"
SkillsignCliAuthHandler .[#8D8D8D,thickness=2].> SigstoreDex : "<color:#8D8D8D>Interactive path: browser-based OAuth via Sigstore Dex<color:#8D8D8D>"
SkillsignCliSigningEngine .[#8D8D8D,thickness=2].> Fulcio : "<color:#8D8D8D>Submits OIDC token and ephemeral public key via Sigstore SDK (steps 7-8)<color:#8D8D8D>"
SkillsignCliSigningEngine .[#8D8D8D,thickness=2].> SkillsignCliSigningEngine : "<color:#8D8D8D>Signs digest with ephemeral ECDSA P-256 key (step 8, inside SDK)<color:#8D8D8D>"
SkillsignCliSigningEngine .[#8D8D8D,thickness=2].> Rekor : "<color:#8D8D8D>Submits signature, certificate, and digest as hashedrekord/v0.0.1 entry via Sigstore SDK (step 9)<color:#8D8D8D>"
SkillsignCliSigningEngine .[#8D8D8D,thickness=2].> SkillsignCliSigningEngine : "<color:#8D8D8D>Assembles sidecar dict from Sigstore Bundle fields (step 10)<color:#8D8D8D>"
SkillsignCliSidecarManager .[#8D8D8D,thickness=2].> SkillsignSkillFiles : "<color:#8D8D8D>Writes SKILL.md.skillsign sidecar atomically via temp file rename (step 11)<color:#8D8D8D>"
SkillsignCliSigningEngine .[#8D8D8D,thickness=2].> SkillAuthor : "<color:#8D8D8D>Signing complete — exit code 0<color:#8D8D8D>"
@enduml
`;case"errorIdentityMismatch":return`@startuml
title "Flows / Skill Consumer / IDENTITY_MISMATCH — Certificate SAN Does Not Match Signer"
left to right direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<SkillConsumer>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<SkillsignCliVerificationEngine>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<SkillsignCliSidecarManager>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam database<<SkillsignSkillFiles>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SkillsignCliCanonicalProcessor>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
person "==Skill Consumer\\n\\nA developer who installs and uses signed skills in Claude Code" <<SkillConsumer>> as SkillConsumer
rectangle "==Verification Engine\\n<size:10>[ECDSA P-256, X.509]</size>\\n\\nOrchestrates verification: reads sidecar via SidecarManager, recomputes digest, verifies ECDSA P-256 signature using certificate public key, validates cert chain against Fulcio root via TUF TrustedRoot and pyOpenSSL, checks EKU id-kp-codeSigning OID, verifies SAN identity match (URI or email), checks temporal binding (rekor_timestamp within cert validity), and checks SKILL_ID_MISMATCH owner-path consistency (skipped for email signers). In --strict mode, delegates live Rekor queries to rekorClient to confirm log entry existence and digest match. Phase 2: SET cryptographic verification against Rekor public key." <<SkillsignCliVerificationEngine>> as SkillsignCliVerificationEngine
rectangle "==Sidecar Manager\\n<size:10>[YAML 1.2]</size>\\n\\nImplemented as a single sidecar.py module combining reader and writer. Writer: assembles canonical field-ordered YAML (PEM fields as literal block scalars) and writes atomically via temp file rename. Reader: parses with strictyaml (enforces no duplicates/anchors/aliases/tags), validates all fields (digest sha256:hex, signer as URL or email, base64 SET, PEM cert), max 64KB." <<SkillsignCliSidecarManager>> as SkillsignCliSidecarManager
database "==Skill File Store\\n<size:10>[Local File System]</size>\\n\\nSKILL.md files, skillsign.yaml manifests, .skillsign sidecars, and .skillsign-policy.yaml trust policies on disk" <<SkillsignSkillFiles>> as SkillsignSkillFiles
rectangle "==Canonical Form Processor\\n<size:10>[UTF-8, SHA-256]</size>\\n\\nImplemented across canonical.py and digest.py. canonical.py: 8-step normalization (BOM strip, CRLF normalization, trailing whitespace trim, single trailing newline, UTF-8 encode, null-byte rejection). digest.py: domain-separated SHA-256 over \\"skillsign:v1\\" + x00 + canonical + x00 + skill_id + x00 + skill_version. Also validates skill_id and skill_version format." <<SkillsignCliCanonicalProcessor>> as SkillsignCliCanonicalProcessor

SkillConsumer .[#8D8D8D,thickness=2].> SkillsignCliVerificationEngine : "<color:#8D8D8D>Runs: skillsign verify ./SKILL.md<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignCliSidecarManager : "<color:#8D8D8D>Reads and parses sidecar — OK<color:#8D8D8D>"
SkillsignCliSidecarManager .[#8D8D8D,thickness=2].> SkillsignSkillFiles : "<color:#8D8D8D>Reads .skillsign sidecar<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignCliCanonicalProcessor : "<color:#8D8D8D>Recomputes canonical form and digest — matches<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignSkillFiles : "<color:#8D8D8D>Reads SKILL.md file bytes<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignCliVerificationEngine : "<color:#8D8D8D>ECDSA signature and certificate checks pass (steps 6-8 partial)<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignCliVerificationEngine : "<color:#8D8D8D>SAN identity match fails<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillConsumer : "<color:#8D8D8D>IDENTITY_MISMATCH — exit code 1<color:#8D8D8D>"
@enduml
`;case"errorInvalidCert":return`@startuml
title "Flows / Skill Consumer / INVALID_CERT — Certificate or SET Verification Failed"
left to right direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<SkillConsumer>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<SkillsignCliVerificationEngine>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<SkillsignCliSidecarManager>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam database<<SkillsignSkillFiles>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SkillsignCliCanonicalProcessor>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<SkillsignCliTufClient>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<Tuf>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam database<<SkillsignTufCache>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
person "==Skill Consumer\\n\\nA developer who installs and uses signed skills in Claude Code" <<SkillConsumer>> as SkillConsumer
rectangle "==Verification Engine\\n<size:10>[ECDSA P-256, X.509]</size>\\n\\nOrchestrates verification: reads sidecar via SidecarManager, recomputes digest, verifies ECDSA P-256 signature using certificate public key, validates cert chain against Fulcio root via TUF TrustedRoot and pyOpenSSL, checks EKU id-kp-codeSigning OID, verifies SAN identity match (URI or email), checks temporal binding (rekor_timestamp within cert validity), and checks SKILL_ID_MISMATCH owner-path consistency (skipped for email signers). In --strict mode, delegates live Rekor queries to rekorClient to confirm log entry existence and digest match. Phase 2: SET cryptographic verification against Rekor public key." <<SkillsignCliVerificationEngine>> as SkillsignCliVerificationEngine
rectangle "==Sidecar Manager\\n<size:10>[YAML 1.2]</size>\\n\\nImplemented as a single sidecar.py module combining reader and writer. Writer: assembles canonical field-ordered YAML (PEM fields as literal block scalars) and writes atomically via temp file rename. Reader: parses with strictyaml (enforces no duplicates/anchors/aliases/tags), validates all fields (digest sha256:hex, signer as URL or email, base64 SET, PEM cert), max 64KB." <<SkillsignCliSidecarManager>> as SkillsignCliSidecarManager
database "==Skill File Store\\n<size:10>[Local File System]</size>\\n\\nSKILL.md files, skillsign.yaml manifests, .skillsign sidecars, and .skillsign-policy.yaml trust policies on disk" <<SkillsignSkillFiles>> as SkillsignSkillFiles
rectangle "==Canonical Form Processor\\n<size:10>[UTF-8, SHA-256]</size>\\n\\nImplemented across canonical.py and digest.py. canonical.py: 8-step normalization (BOM strip, CRLF normalization, trailing whitespace trim, single trailing newline, UTF-8 encode, null-byte rejection). digest.py: domain-separated SHA-256 over \\"skillsign:v1\\" + x00 + canonical + x00 + skill_id + x00 + skill_version. Also validates skill_id and skill_version format." <<SkillsignCliCanonicalProcessor>> as SkillsignCliCanonicalProcessor
rectangle "==TUF Client\\n<size:10>[TUF, HTTPS]</size>\\n\\nWraps Sigstore SDK TrustedRoot via infra/tuf.py. Fetches production TUF root metadata including Fulcio root certificates and Rekor public key. Falls back to cached metadata when offline. Used by verification engine for cert chain validation." <<SkillsignCliTufClient>> as SkillsignCliTufClient
rectangle "==TUF Root\\n\\nThe Update Framework root of trust distributing Sigstore public keys" <<Tuf>> as Tuf
database "==TUF Root Cache\\n<size:10>[Local File System]</size>\\n\\nLocal cache of bundled and fetched Sigstore TUF root metadata and Fulcio root certificates" <<SkillsignTufCache>> as SkillsignTufCache

SkillConsumer .[#8D8D8D,thickness=2].> SkillsignCliVerificationEngine : "<color:#8D8D8D>Runs: skillsign verify ./SKILL.md<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignCliSidecarManager : "<color:#8D8D8D>Reads and parses sidecar — OK<color:#8D8D8D>"
SkillsignCliSidecarManager .[#8D8D8D,thickness=2].> SkillsignSkillFiles : "<color:#8D8D8D>Reads .skillsign sidecar<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignCliCanonicalProcessor : "<color:#8D8D8D>Recomputes canonical form and digest — matches<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignSkillFiles : "<color:#8D8D8D>Reads SKILL.md file bytes<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignCliVerificationEngine : "<color:#8D8D8D>ECDSA signature verification passes (step 6)<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignCliTufClient : "<color:#8D8D8D>Requests trusted Fulcio root certificates and Rekor public key<color:#8D8D8D>"
SkillsignCliTufClient .[#8D8D8D,thickness=2].> Tuf : "<color:#8D8D8D>Fetches current TUF root metadata<color:#8D8D8D>"
SkillsignCliTufClient .[#8D8D8D,thickness=2].> SkillsignTufCache : "<color:#8D8D8D>Reads/writes cached TUF metadata<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignCliVerificationEngine : "<color:#8D8D8D>Temporal binding and SET verification (step 9)<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillConsumer : "<color:#8D8D8D>INVALID_CERT — exit code 1<color:#8D8D8D>"
@enduml
`;case"errorMalformedSidecar":return`@startuml
title "Flows / Skill Consumer / MALFORMED_SIDECAR — Invalid Sidecar"
left to right direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<SkillConsumer>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<SkillsignCliVerificationEngine>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<SkillsignCliSidecarManager>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam database<<SkillsignSkillFiles>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
person "==Skill Consumer\\n\\nA developer who installs and uses signed skills in Claude Code" <<SkillConsumer>> as SkillConsumer
rectangle "==Verification Engine\\n<size:10>[ECDSA P-256, X.509]</size>\\n\\nOrchestrates verification: reads sidecar via SidecarManager, recomputes digest, verifies ECDSA P-256 signature using certificate public key, validates cert chain against Fulcio root via TUF TrustedRoot and pyOpenSSL, checks EKU id-kp-codeSigning OID, verifies SAN identity match (URI or email), checks temporal binding (rekor_timestamp within cert validity), and checks SKILL_ID_MISMATCH owner-path consistency (skipped for email signers). In --strict mode, delegates live Rekor queries to rekorClient to confirm log entry existence and digest match. Phase 2: SET cryptographic verification against Rekor public key." <<SkillsignCliVerificationEngine>> as SkillsignCliVerificationEngine
rectangle "==Sidecar Manager\\n<size:10>[YAML 1.2]</size>\\n\\nImplemented as a single sidecar.py module combining reader and writer. Writer: assembles canonical field-ordered YAML (PEM fields as literal block scalars) and writes atomically via temp file rename. Reader: parses with strictyaml (enforces no duplicates/anchors/aliases/tags), validates all fields (digest sha256:hex, signer as URL or email, base64 SET, PEM cert), max 64KB." <<SkillsignCliSidecarManager>> as SkillsignCliSidecarManager
database "==Skill File Store\\n<size:10>[Local File System]</size>\\n\\nSKILL.md files, skillsign.yaml manifests, .skillsign sidecars, and .skillsign-policy.yaml trust policies on disk" <<SkillsignSkillFiles>> as SkillsignSkillFiles

SkillConsumer .[#8D8D8D,thickness=2].> SkillsignCliVerificationEngine : "<color:#8D8D8D>Runs: skillsign verify ./SKILL.md<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignCliSidecarManager : "<color:#8D8D8D>Reads and parses sidecar<color:#8D8D8D>"
SkillsignCliSidecarManager .[#8D8D8D,thickness=2].> SkillsignSkillFiles : "<color:#8D8D8D>Reads .skillsign sidecar file<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillConsumer : "<color:#8D8D8D>MALFORMED_SIDECAR — exit code 1<color:#8D8D8D>"
@enduml
`;case"errorPolicyFail":return`@startuml
title "Flows / Skill Consumer / POLICY_FAIL — Trust Policy Not Satisfied"
left to right direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<SkillConsumer>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<SkillsignCliVerificationEngine>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<SkillsignCliPolicyEngine>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam database<<SkillsignSkillFiles>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
person "==Skill Consumer\\n\\nA developer who installs and uses signed skills in Claude Code" <<SkillConsumer>> as SkillConsumer
rectangle "==Verification Engine\\n<size:10>[ECDSA P-256, X.509]</size>\\n\\nOrchestrates verification: reads sidecar via SidecarManager, recomputes digest, verifies ECDSA P-256 signature using certificate public key, validates cert chain against Fulcio root via TUF TrustedRoot and pyOpenSSL, checks EKU id-kp-codeSigning OID, verifies SAN identity match (URI or email), checks temporal binding (rekor_timestamp within cert validity), and checks SKILL_ID_MISMATCH owner-path consistency (skipped for email signers). In --strict mode, delegates live Rekor queries to rekorClient to confirm log entry existence and digest match. Phase 2: SET cryptographic verification against Rekor public key." <<SkillsignCliVerificationEngine>> as SkillsignCliVerificationEngine
rectangle "==Policy Engine\\n<size:10>[YAML 1.2]</size>\\n\\n[Phase 2, not yet implemented] Evaluates trust policies with first-match-wins rule evaluation, signer_org matching with lowercase normalization, and max_age_days enforcement against verified rekor_timestamp" <<SkillsignCliPolicyEngine>> as SkillsignCliPolicyEngine
database "==Skill File Store\\n<size:10>[Local File System]</size>\\n\\nSKILL.md files, skillsign.yaml manifests, .skillsign sidecars, and .skillsign-policy.yaml trust policies on disk" <<SkillsignSkillFiles>> as SkillsignSkillFiles

SkillConsumer .[#8D8D8D,thickness=2].> SkillsignCliVerificationEngine : "<color:#8D8D8D>Runs: skillsign verify --policy .skillsign-policy.yaml ./SKILL.md<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignCliPolicyEngine : "<color:#8D8D8D>Passes verified signer identity, rekor_timestamp, and skill_id [Phase 2]<color:#8D8D8D>"
SkillsignCliPolicyEngine .[#8D8D8D,thickness=2].> SkillsignSkillFiles : "<color:#8D8D8D>Reads .skillsign-policy.yaml trust policy [Phase 2]<color:#8D8D8D>"
SkillsignCliPolicyEngine .[#8D8D8D,thickness=2].> SkillsignCliVerificationEngine : "<color:#8D8D8D>Returns deny result<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillConsumer : "<color:#8D8D8D>POLICY_FAIL — exit code 3<color:#8D8D8D>"
@enduml
`;case"errorSkillIdMismatch":return`@startuml
title "Flows / Skill Consumer / SKILL_ID_MISMATCH — Owner Path Inconsistency"
left to right direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<SkillConsumer>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<SkillsignCliVerificationEngine>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
person "==Skill Consumer\\n\\nA developer who installs and uses signed skills in Claude Code" <<SkillConsumer>> as SkillConsumer
rectangle "==Verification Engine\\n<size:10>[ECDSA P-256, X.509]</size>\\n\\nOrchestrates verification: reads sidecar via SidecarManager, recomputes digest, verifies ECDSA P-256 signature using certificate public key, validates cert chain against Fulcio root via TUF TrustedRoot and pyOpenSSL, checks EKU id-kp-codeSigning OID, verifies SAN identity match (URI or email), checks temporal binding (rekor_timestamp within cert validity), and checks SKILL_ID_MISMATCH owner-path consistency (skipped for email signers). In --strict mode, delegates live Rekor queries to rekorClient to confirm log entry existence and digest match. Phase 2: SET cryptographic verification against Rekor public key." <<SkillsignCliVerificationEngine>> as SkillsignCliVerificationEngine

SkillConsumer .[#8D8D8D,thickness=2].> SkillsignCliVerificationEngine : "<color:#8D8D8D>Runs: skillsign verify ./SKILL.md — all crypto checks pass<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignCliVerificationEngine : "<color:#8D8D8D>Owner-path consistency check fails<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillConsumer : "<color:#8D8D8D>SKILL_ID_MISMATCH — exit code 1<color:#8D8D8D>"
@enduml
`;case"errorTampered":return`@startuml
title "Flows / Skill Consumer / TAMPERED — File Modified After Signing"
left to right direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<SkillConsumer>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<SkillsignCliVerificationEngine>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<SkillsignCliSidecarManager>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam database<<SkillsignSkillFiles>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SkillsignCliCanonicalProcessor>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
person "==Skill Consumer\\n\\nA developer who installs and uses signed skills in Claude Code" <<SkillConsumer>> as SkillConsumer
rectangle "==Verification Engine\\n<size:10>[ECDSA P-256, X.509]</size>\\n\\nOrchestrates verification: reads sidecar via SidecarManager, recomputes digest, verifies ECDSA P-256 signature using certificate public key, validates cert chain against Fulcio root via TUF TrustedRoot and pyOpenSSL, checks EKU id-kp-codeSigning OID, verifies SAN identity match (URI or email), checks temporal binding (rekor_timestamp within cert validity), and checks SKILL_ID_MISMATCH owner-path consistency (skipped for email signers). In --strict mode, delegates live Rekor queries to rekorClient to confirm log entry existence and digest match. Phase 2: SET cryptographic verification against Rekor public key." <<SkillsignCliVerificationEngine>> as SkillsignCliVerificationEngine
rectangle "==Sidecar Manager\\n<size:10>[YAML 1.2]</size>\\n\\nImplemented as a single sidecar.py module combining reader and writer. Writer: assembles canonical field-ordered YAML (PEM fields as literal block scalars) and writes atomically via temp file rename. Reader: parses with strictyaml (enforces no duplicates/anchors/aliases/tags), validates all fields (digest sha256:hex, signer as URL or email, base64 SET, PEM cert), max 64KB." <<SkillsignCliSidecarManager>> as SkillsignCliSidecarManager
database "==Skill File Store\\n<size:10>[Local File System]</size>\\n\\nSKILL.md files, skillsign.yaml manifests, .skillsign sidecars, and .skillsign-policy.yaml trust policies on disk" <<SkillsignSkillFiles>> as SkillsignSkillFiles
rectangle "==Canonical Form Processor\\n<size:10>[UTF-8, SHA-256]</size>\\n\\nImplemented across canonical.py and digest.py. canonical.py: 8-step normalization (BOM strip, CRLF normalization, trailing whitespace trim, single trailing newline, UTF-8 encode, null-byte rejection). digest.py: domain-separated SHA-256 over \\"skillsign:v1\\" + x00 + canonical + x00 + skill_id + x00 + skill_version. Also validates skill_id and skill_version format." <<SkillsignCliCanonicalProcessor>> as SkillsignCliCanonicalProcessor

SkillConsumer .[#8D8D8D,thickness=2].> SkillsignCliVerificationEngine : "<color:#8D8D8D>Runs: skillsign verify ./SKILL.md<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignCliSidecarManager : "<color:#8D8D8D>Reads and parses sidecar — OK<color:#8D8D8D>"
SkillsignCliSidecarManager .[#8D8D8D,thickness=2].> SkillsignSkillFiles : "<color:#8D8D8D>Reads .skillsign sidecar<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignCliCanonicalProcessor : "<color:#8D8D8D>Recomputes canonical form and digest<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignSkillFiles : "<color:#8D8D8D>Reads SKILL.md file bytes<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillConsumer : "<color:#8D8D8D>TAMPERED — exit code 1<color:#8D8D8D>"
@enduml
`;case"errorUnsigned":return`@startuml
title "Flows / Skill Consumer / UNSIGNED — No Sidecar Found"
left to right direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<SkillConsumer>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<SkillsignCliVerificationEngine>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<SkillsignCliSidecarManager>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam database<<SkillsignSkillFiles>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
person "==Skill Consumer\\n\\nA developer who installs and uses signed skills in Claude Code" <<SkillConsumer>> as SkillConsumer
rectangle "==Verification Engine\\n<size:10>[ECDSA P-256, X.509]</size>\\n\\nOrchestrates verification: reads sidecar via SidecarManager, recomputes digest, verifies ECDSA P-256 signature using certificate public key, validates cert chain against Fulcio root via TUF TrustedRoot and pyOpenSSL, checks EKU id-kp-codeSigning OID, verifies SAN identity match (URI or email), checks temporal binding (rekor_timestamp within cert validity), and checks SKILL_ID_MISMATCH owner-path consistency (skipped for email signers). In --strict mode, delegates live Rekor queries to rekorClient to confirm log entry existence and digest match. Phase 2: SET cryptographic verification against Rekor public key." <<SkillsignCliVerificationEngine>> as SkillsignCliVerificationEngine
rectangle "==Sidecar Manager\\n<size:10>[YAML 1.2]</size>\\n\\nImplemented as a single sidecar.py module combining reader and writer. Writer: assembles canonical field-ordered YAML (PEM fields as literal block scalars) and writes atomically via temp file rename. Reader: parses with strictyaml (enforces no duplicates/anchors/aliases/tags), validates all fields (digest sha256:hex, signer as URL or email, base64 SET, PEM cert), max 64KB." <<SkillsignCliSidecarManager>> as SkillsignCliSidecarManager
database "==Skill File Store\\n<size:10>[Local File System]</size>\\n\\nSKILL.md files, skillsign.yaml manifests, .skillsign sidecars, and .skillsign-policy.yaml trust policies on disk" <<SkillsignSkillFiles>> as SkillsignSkillFiles

SkillConsumer .[#8D8D8D,thickness=2].> SkillsignCliVerificationEngine : "<color:#8D8D8D>Runs: skillsign verify ./SKILL.md<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignCliSidecarManager : "<color:#8D8D8D>Reads and parses sidecar<color:#8D8D8D>"
SkillsignCliSidecarManager .[#8D8D8D,thickness=2].> SkillsignSkillFiles : "<color:#8D8D8D>Looks for SKILL.md.skillsign — file not found<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillConsumer : "<color:#8D8D8D>UNSIGNED — exit code 2<color:#8D8D8D>"
@enduml
`;case"policyVerificationFlow":return`@startuml
title "Flows / Skill Consumer / Policy Verification"
left to right direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<SkillConsumer>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<SkillsignCliVerificationEngine>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<SkillsignCliRekorClient>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<Rekor>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<SkillsignCliPolicyEngine>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam database<<SkillsignSkillFiles>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
person "==Skill Consumer\\n\\nA developer who installs and uses signed skills in Claude Code" <<SkillConsumer>> as SkillConsumer
rectangle "==Verification Engine\\n<size:10>[ECDSA P-256, X.509]</size>\\n\\nOrchestrates verification: reads sidecar via SidecarManager, recomputes digest, verifies ECDSA P-256 signature using certificate public key, validates cert chain against Fulcio root via TUF TrustedRoot and pyOpenSSL, checks EKU id-kp-codeSigning OID, verifies SAN identity match (URI or email), checks temporal binding (rekor_timestamp within cert validity), and checks SKILL_ID_MISMATCH owner-path consistency (skipped for email signers). In --strict mode, delegates live Rekor queries to rekorClient to confirm log entry existence and digest match. Phase 2: SET cryptographic verification against Rekor public key." <<SkillsignCliVerificationEngine>> as SkillsignCliVerificationEngine
rectangle "==Rekor Client\\n<size:10>[HTTPS, JSON]</size>\\n\\nWraps Rekor transparency log queries via infra/rekor.py. Fetches log entries by log ID using the Rekor search API (/api/v1/log/entries/retrieve). Used by verification engine in --strict mode to confirm the log entry exists and the digest and cert match." <<SkillsignCliRekorClient>> as SkillsignCliRekorClient
rectangle "==Rekor Transparency Log\\n\\nAppend-only, publicly auditable log recording signatures, certificates, and digests" <<Rekor>> as Rekor
rectangle "==Policy Engine\\n<size:10>[YAML 1.2]</size>\\n\\n[Phase 2, not yet implemented] Evaluates trust policies with first-match-wins rule evaluation, signer_org matching with lowercase normalization, and max_age_days enforcement against verified rekor_timestamp" <<SkillsignCliPolicyEngine>> as SkillsignCliPolicyEngine
database "==Skill File Store\\n<size:10>[Local File System]</size>\\n\\nSKILL.md files, skillsign.yaml manifests, .skillsign sidecars, and .skillsign-policy.yaml trust policies on disk" <<SkillsignSkillFiles>> as SkillsignSkillFiles

SkillConsumer .[#8D8D8D,thickness=2].> SkillsignCliVerificationEngine : "<color:#8D8D8D>Runs: skillsign verify --policy .skillsign-policy.yaml --strict ./SKILL.md<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignCliVerificationEngine : "<color:#8D8D8D>Completes full cryptographic verification<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignCliRekorClient : "<color:#8D8D8D>Delegates live Rekor query for strict mode verification<color:#8D8D8D>"
SkillsignCliRekorClient .[#8D8D8D,thickness=2].> Rekor : "<color:#8D8D8D>Queries log entry by rekor_log_id, confirms digest match and timestamp validity via HTTPS/JSON<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignCliPolicyEngine : "<color:#8D8D8D>Passes verified signer identity, rekor_timestamp, and skill_id [Phase 2]<color:#8D8D8D>"
SkillsignCliPolicyEngine .[#8D8D8D,thickness=2].> SkillsignSkillFiles : "<color:#8D8D8D>Reads .skillsign-policy.yaml trust policy<color:#8D8D8D>"
SkillsignCliPolicyEngine .[#8D8D8D,thickness=2].> SkillsignCliVerificationEngine : "<color:#8D8D8D>Returns policy evaluation result<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillConsumer : "<color:#8D8D8D>Returns VERIFIED (0), POLICY_FAIL (3), or verification failure (1)<color:#8D8D8D>"
@enduml
`;case"verificationFlow":return`@startuml
title "Flows / Skill Consumer / Verification"
left to right direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<SkillConsumer>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<SkillsignCliVerificationEngine>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<SkillsignCliSidecarManager>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam database<<SkillsignSkillFiles>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SkillsignCliCanonicalProcessor>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<SkillsignCliTufClient>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<Tuf>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam database<<SkillsignTufCache>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
person "==Skill Consumer\\n\\nA developer who installs and uses signed skills in Claude Code" <<SkillConsumer>> as SkillConsumer
rectangle "==Verification Engine\\n<size:10>[ECDSA P-256, X.509]</size>\\n\\nOrchestrates verification: reads sidecar via SidecarManager, recomputes digest, verifies ECDSA P-256 signature using certificate public key, validates cert chain against Fulcio root via TUF TrustedRoot and pyOpenSSL, checks EKU id-kp-codeSigning OID, verifies SAN identity match (URI or email), checks temporal binding (rekor_timestamp within cert validity), and checks SKILL_ID_MISMATCH owner-path consistency (skipped for email signers). In --strict mode, delegates live Rekor queries to rekorClient to confirm log entry existence and digest match. Phase 2: SET cryptographic verification against Rekor public key." <<SkillsignCliVerificationEngine>> as SkillsignCliVerificationEngine
rectangle "==Sidecar Manager\\n<size:10>[YAML 1.2]</size>\\n\\nImplemented as a single sidecar.py module combining reader and writer. Writer: assembles canonical field-ordered YAML (PEM fields as literal block scalars) and writes atomically via temp file rename. Reader: parses with strictyaml (enforces no duplicates/anchors/aliases/tags), validates all fields (digest sha256:hex, signer as URL or email, base64 SET, PEM cert), max 64KB." <<SkillsignCliSidecarManager>> as SkillsignCliSidecarManager
database "==Skill File Store\\n<size:10>[Local File System]</size>\\n\\nSKILL.md files, skillsign.yaml manifests, .skillsign sidecars, and .skillsign-policy.yaml trust policies on disk" <<SkillsignSkillFiles>> as SkillsignSkillFiles
rectangle "==Canonical Form Processor\\n<size:10>[UTF-8, SHA-256]</size>\\n\\nImplemented across canonical.py and digest.py. canonical.py: 8-step normalization (BOM strip, CRLF normalization, trailing whitespace trim, single trailing newline, UTF-8 encode, null-byte rejection). digest.py: domain-separated SHA-256 over \\"skillsign:v1\\" + x00 + canonical + x00 + skill_id + x00 + skill_version. Also validates skill_id and skill_version format." <<SkillsignCliCanonicalProcessor>> as SkillsignCliCanonicalProcessor
rectangle "==TUF Client\\n<size:10>[TUF, HTTPS]</size>\\n\\nWraps Sigstore SDK TrustedRoot via infra/tuf.py. Fetches production TUF root metadata including Fulcio root certificates and Rekor public key. Falls back to cached metadata when offline. Used by verification engine for cert chain validation." <<SkillsignCliTufClient>> as SkillsignCliTufClient
rectangle "==TUF Root\\n\\nThe Update Framework root of trust distributing Sigstore public keys" <<Tuf>> as Tuf
database "==TUF Root Cache\\n<size:10>[Local File System]</size>\\n\\nLocal cache of bundled and fetched Sigstore TUF root metadata and Fulcio root certificates" <<SkillsignTufCache>> as SkillsignTufCache

SkillConsumer .[#8D8D8D,thickness=2].> SkillsignCliVerificationEngine : "<color:#8D8D8D>Runs: skillsign verify ./SKILL.md<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignCliSidecarManager : "<color:#8D8D8D>Reads and parses sidecar (steps 1-2)<color:#8D8D8D>"
SkillsignCliSidecarManager .[#8D8D8D,thickness=2].> SkillsignSkillFiles : "<color:#8D8D8D>Reads .skillsign sidecar with strict YAML 1.2 parsing<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignCliCanonicalProcessor : "<color:#8D8D8D>Recomputes canonical form and digest (steps 3-5)<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignSkillFiles : "<color:#8D8D8D>Reads SKILL.md file bytes<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignCliVerificationEngine : "<color:#8D8D8D>Cryptographic verification (steps 6-8)<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignCliTufClient : "<color:#8D8D8D>Requests trusted Fulcio root certificates and Rekor public key (step 7)<color:#8D8D8D>"
SkillsignCliTufClient .[#8D8D8D,thickness=2].> Tuf : "<color:#8D8D8D>Fetches current TUF root metadata<color:#8D8D8D>"
SkillsignCliTufClient .[#8D8D8D,thickness=2].> SkillsignTufCache : "<color:#8D8D8D>Reads/writes cached TUF metadata<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignCliVerificationEngine : "<color:#8D8D8D>Temporal binding and SET verification (step 9)<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillsignCliVerificationEngine : "<color:#8D8D8D>SKILL_ID_MISMATCH owner-path check (step 11)<color:#8D8D8D>"
SkillsignCliVerificationEngine .[#8D8D8D,thickness=2].> SkillConsumer : "<color:#8D8D8D>Returns VERIFIED (exit 0) or failure with specific exit code<color:#8D8D8D>"
@enduml
`;default:throw new Error("Unknown viewId: "+i)}}export{n as pumlSource};
