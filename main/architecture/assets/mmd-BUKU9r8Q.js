function n(i){switch(i){case"cliComponents":return`---
title: "Components / CLI Internals"
---
graph TB
  SkillAuthor[fa:fa-user Skill Author]
  SkillConsumer[fa:fa-user Skill Consumer]
  ClaudeCode[Claude Code]
  subgraph SkillsignCli["SkillSign CLI"]
    SkillsignCli.SigningEngine[Signing Engine]
    SkillsignCli.VerificationEngine[Verification Engine]
    SkillsignCli.AuthHandler[Auth Handler]
    SkillsignCli.ManifestReader[Manifest Reader]
    SkillsignCli.CanonicalProcessor[Canonical Form Processor]
    SkillsignCli.PolicyEngine[Policy Engine]
    SkillsignCli.SidecarManager[Sidecar Manager]
    SkillsignCli.TufClient[TUF Client]
  end
  Fulcio[Fulcio CA]
  Rekor[Rekor Transparency Log]
  Github[GitHub Actions OIDC]
  SigstoreDex[Sigstore Dex (OAuth)]
  SkillsignSkillFiles([Skill File Store])
  Tuf[TUF Root]
  SkillsignTufCache([TUF Root Cache])
  SkillAuthor -. "Signs SKILL.md files via CLI" .-> SkillsignCli.SigningEngine
  SkillConsumer -. "Verifies skill signatures via CLI" .-> SkillsignCli.VerificationEngine
  ClaudeCode -. "Invokes verification before loading skills" .-> SkillsignCli.VerificationEngine
  SkillsignCli.SigningEngine -. "Gets OIDC identity token from" .-> SkillsignCli.AuthHandler
  SkillsignCli.SigningEngine -. "Gets SHA-256 digest from" .-> SkillsignCli.CanonicalProcessor
  SkillsignCli.VerificationEngine -. "Recomputes digest via" .-> SkillsignCli.CanonicalProcessor
  SkillsignCli.SigningEngine -. "Reads skill_id and skill_version from" .-> SkillsignCli.ManifestReader
  SkillsignCli.VerificationEngine -. "Passes verified signer identity, rekor_timestamp, and skill_id for policy evaluation [Phase 2]" .-> SkillsignCli.PolicyEngine
  SkillsignCli.VerificationEngine -. "Reads sidecar fields via" .-> SkillsignCli.SidecarManager
  SkillsignCli.VerificationEngine -. "Gets trusted Fulcio root certificates and Rekor public key from" .-> SkillsignCli.TufClient
  SkillsignCli.AuthHandler -. "Detects ambient OIDC token from GitHub Actions runtime (CI path)" .-> Github
  SkillsignCli.AuthHandler -. "Opens browser for OAuth login via Dex — user picks Google, GitHub, or Microsoft (interactive path)" .-> SigstoreDex
  SkillsignCli.SigningEngine -. "Submits ephemeral public key and OIDC token via Sigstore SDK, receives short-lived X.509 certificate" .-> Fulcio
  SkillsignCli.SigningEngine -. "Submits signature, certificate, and digest as hashedrekord/v0.0.1 entry via Sigstore SDK" .-> Rekor
  SkillsignCli.SigningEngine -. "Checks for existing .skillsign sidecar before signing" .-> SkillsignSkillFiles
  SkillsignCli.VerificationEngine -. "Confirms log entry exists and digest matches in --strict mode" .-> Rekor
  SkillsignCli.PolicyEngine -. "Reads .skillsign-policy.yaml trust policies [Phase 2]" .-> SkillsignSkillFiles
  SkillsignCli.SidecarManager -. "Reads and writes .skillsign sidecar files" .-> SkillsignSkillFiles
  SkillsignCli.ManifestReader -. "Reads skillsign.yaml manifests" .-> SkillsignSkillFiles
  SkillsignCli.TufClient -. "Fetches current TUF root metadata via HTTPS" .-> Tuf
  SkillsignCli.TufClient -. "Reads and writes cached TUF metadata via local filesystem" .-> SkillsignTufCache
`;case"skillsignContainers":return`---
title: "Containers / SkillSign Containers"
---
graph TB
  SkillAuthor[fa:fa-user Skill Author]
  SkillConsumer[fa:fa-user Skill Consumer]
  ClaudeCode[Claude Code]
  subgraph Skillsign["SkillSign"]
    Skillsign.Cli[SkillSign CLI]
    Skillsign.SkillFiles([Skill File Store])
    Skillsign.TufCache([TUF Root Cache])
  end
  Github[GitHub Actions OIDC]
  SigstoreDex[Sigstore Dex (OAuth)]
  Fulcio[Fulcio CA]
  Rekor[Rekor Transparency Log]
  Tuf[TUF Root]
  Skillsign.Cli -. "Reads and writes SKILL.md files, manifests, sidecars, and policies" .-> Skillsign.SkillFiles
  Skillsign.Cli -. "Reads and writes cached TUF metadata" .-> Skillsign.TufCache
  SkillAuthor -. "Signs SKILL.md files via CLI" .-> Skillsign.Cli
  SkillConsumer -. "Verifies skill signatures via CLI" .-> Skillsign.Cli
  ClaudeCode -. "Invokes verification before loading skills" .-> Skillsign.Cli
  Skillsign.Cli -. "Authenticates CI workflows via OIDC/HTTPS" .-> Github
  Skillsign.Cli -. "Opens browser for OAuth login via Dex — user picks Google, GitHub, or Microsoft (interactive path)" .-> SigstoreDex
  Skillsign.Cli -. "Obtains short-lived signing certificates via HTTPS" .-> Fulcio
  Skillsign.Cli -. "Submits and queries transparency log entries via HTTPS" .-> Rekor
  Skillsign.Cli -. "Fetches TUF root metadata via HTTPS" .-> Tuf
`;case"index":return`---
title: "Context / System Context"
---
graph TB
  SkillAuthor[fa:fa-user Skill Author]
  SkillConsumer[fa:fa-user Skill Consumer]
  ClaudeCode[Claude Code]
  Skillsign[SkillSign]
  Github[GitHub Actions OIDC]
  SigstoreDex[Sigstore Dex (OAuth)]
  Fulcio[Fulcio CA]
  Rekor[Rekor Transparency Log]
  Tuf[TUF Root]
  SkillAuthor -. "Signs skill files for distribution" .-> Skillsign
  SkillConsumer -. "Verifies skill file authenticity" .-> Skillsign
  ClaudeCode -. "Verifies skills before loading" .-> Skillsign
  Skillsign -. "Authenticates CI workflows via OIDC tokens" .-> Github
  Skillsign -. "Authenticates developers via browser-based OAuth" .-> SigstoreDex
  Skillsign -. "Obtains signing certificates" .-> Fulcio
  Skillsign -. "Records and queries signed artifacts" .-> Rekor
  Skillsign -. "Retrieves trusted signing keys" .-> Tuf
`;case"errorInvalidManifest":return`---
title: "Flows / Skill Author / INVALID_MANIFEST — Invalid Manifest"
---
graph LR
  SkillAuthor[fa:fa-user Skill Author]
  SkillsignCliSigningEngine[Signing Engine]
  SkillsignCliManifestReader[Manifest Reader]
  SkillsignSkillFiles([Skill File Store])
  SkillAuthor -. "Runs: skillsign sign ./SKILL.md" .-> SkillsignCliSigningEngine
  SkillsignCliSigningEngine -. "Reads and validates manifest" .-> SkillsignCliManifestReader
  SkillsignCliManifestReader -. "Reads skillsign.yaml — fails" .-> SkillsignSkillFiles
  SkillsignCliSigningEngine -. "CLI error — exit code 10" .-> SkillAuthor
`;case"errorInvalidSkillFile":return`---
title: "Flows / Skill Author / INVALID_SKILL_FILE — Invalid SKILL.md"
---
graph LR
  SkillAuthor[fa:fa-user Skill Author]
  SkillsignCliSigningEngine[Signing Engine]
  SkillsignCliManifestReader[Manifest Reader]
  SkillsignSkillFiles([Skill File Store])
  SkillsignCliCanonicalProcessor[Canonical Form Processor]
  SkillAuthor -. "Runs: skillsign sign ./SKILL.md" .-> SkillsignCliSigningEngine
  SkillsignCliSigningEngine -. "Reads and validates manifest" .-> SkillsignCliManifestReader
  SkillsignCliManifestReader -. "Reads skillsign.yaml — OK" .-> SkillsignSkillFiles
  SkillsignCliSigningEngine -. "Checks for existing .skillsign sidecar — none found, OK" .-> SkillsignSkillFiles
  SkillsignCliSigningEngine -. "Requests canonical form and digest" .-> SkillsignCliCanonicalProcessor
  SkillsignCliSigningEngine -. "Reads SKILL.md file bytes" .-> SkillsignSkillFiles
  SkillsignCliSigningEngine -. "Canonical form normalization fails — exit code 10" .-> SkillAuthor
`;case"errorSidecarExists":return`---
title: "Flows / Skill Author / SIDECAR_EXISTS — Sidecar Already Exists"
---
graph LR
  SkillAuthor[fa:fa-user Skill Author]
  SkillsignCliSigningEngine[Signing Engine]
  SkillsignCliManifestReader[Manifest Reader]
  SkillsignSkillFiles([Skill File Store])
  SkillAuthor -. "Runs: skillsign sign ./SKILL.md" .-> SkillsignCliSigningEngine
  SkillsignCliSigningEngine -. "Reads and validates manifest" .-> SkillsignCliManifestReader
  SkillsignCliManifestReader -. "Reads skillsign.yaml — OK" .-> SkillsignSkillFiles
  SkillsignCliSigningEngine -. "Checks for existing sidecar (step 3)" .-> SkillsignSkillFiles
  SkillsignCliSigningEngine -. "Sidecar already exists — exit code 10" .-> SkillAuthor
`;case"errorSigningInfra":return`---
title: "Flows / Skill Author / SIGNING_INFRA — Signing Infrastructure Failure"
---
graph LR
  SkillAuthor[fa:fa-user Skill Author]
  SkillsignCliSigningEngine[Signing Engine]
  SkillsignCliAuthHandler[Auth Handler]
  Fulcio[Fulcio CA]
  Rekor[Rekor Transparency Log]
  SkillAuthor -. "Manifest and canonical form valid, begins signing" .-> SkillsignCliSigningEngine
  SkillsignCliSigningEngine -. "Requests OIDC authentication" .-> SkillsignCliAuthHandler
  SkillsignCliAuthHandler -. "OIDC authentication fails — exit code 10" .-> SkillsignCliAuthHandler
  SkillsignCliSigningEngine -. "Certificate issuance fails — exit code 10" .-> Fulcio
  SkillsignCliSigningEngine -. "Local ECDSA signing fails — exit code 10" .-> SkillsignCliSigningEngine
  SkillsignCliSigningEngine -. "Rekor submission fails — exit code 10" .-> Rekor
  SkillsignCliSigningEngine -. "Signing infrastructure failure — exit code 10" .-> SkillAuthor
`;case"signingFlow":return`---
title: "Flows / Skill Author / Signing"
---
graph LR
  SkillAuthor[fa:fa-user Skill Author]
  SkillsignCliSigningEngine[Signing Engine]
  SkillsignCliManifestReader[Manifest Reader]
  SkillsignCliSidecarManager[Sidecar Manager]
  SkillsignSkillFiles([Skill File Store])
  SkillsignCliCanonicalProcessor[Canonical Form Processor]
  SkillsignCliAuthHandler[Auth Handler]
  Github[GitHub Actions OIDC]
  SigstoreDex[Sigstore Dex (OAuth)]
  Fulcio[Fulcio CA]
  Rekor[Rekor Transparency Log]
  SkillAuthor -. "Runs: skillsign sign ./SKILL.md" .-> SkillsignCliSigningEngine
  SkillsignCliSigningEngine -. "Reads and validates manifest" .-> SkillsignCliManifestReader
  SkillsignCliManifestReader -. "Reads skillsign.yaml manifest" .-> SkillsignSkillFiles
  SkillsignCliSigningEngine -. "Checks for existing sidecar (step 3)" .-> SkillsignSkillFiles
  SkillsignCliSigningEngine -. "Requests canonical form and digest (steps 4-5)" .-> SkillsignCliCanonicalProcessor
  SkillsignCliSigningEngine -. "Reads SKILL.md file bytes (step 4)" .-> SkillsignSkillFiles
  SkillsignCliSigningEngine -. "Requests OIDC authentication (step 6)" .-> SkillsignCliAuthHandler
  SkillsignCliAuthHandler -. "Detects authentication mode" .-> SkillsignCliAuthHandler
  SkillsignCliAuthHandler -. "CI path: ambient OIDC token from GitHub Actions" .-> Github
  SkillsignCliAuthHandler -. "Interactive path: browser-based OAuth via Sigstore Dex" .-> SigstoreDex
  SkillsignCliSigningEngine -. "Submits OIDC token and ephemeral public key via Sigstore SDK (steps 7-8)" .-> Fulcio
  SkillsignCliSigningEngine -. "Signs digest with ephemeral ECDSA P-256 key (step 8, inside SDK)" .-> SkillsignCliSigningEngine
  SkillsignCliSigningEngine -. "Submits signature, certificate, and digest as hashedrekord/v0.0.1 entry via Sigstore SDK (step 9)" .-> Rekor
  SkillsignCliSigningEngine -. "Assembles sidecar dict from Sigstore Bundle fields (step 10)" .-> SkillsignCliSigningEngine
  SkillsignCliSidecarManager -. "Writes SKILL.md.skillsign sidecar atomically via temp file rename (step 11)" .-> SkillsignSkillFiles
  SkillsignCliSigningEngine -. "Signing complete — exit code 0" .-> SkillAuthor
`;case"errorIdentityMismatch":return`---
title: "Flows / Skill Consumer / IDENTITY_MISMATCH — Certificate SAN Does Not Match Signer"
---
graph LR
  SkillConsumer[fa:fa-user Skill Consumer]
  SkillsignCliVerificationEngine[Verification Engine]
  SkillsignCliSidecarManager[Sidecar Manager]
  SkillsignSkillFiles([Skill File Store])
  SkillsignCliCanonicalProcessor[Canonical Form Processor]
  SkillConsumer -. "Runs: skillsign verify ./SKILL.md" .-> SkillsignCliVerificationEngine
  SkillsignCliVerificationEngine -. "Reads and parses sidecar — OK" .-> SkillsignCliSidecarManager
  SkillsignCliSidecarManager -. "Reads .skillsign sidecar" .-> SkillsignSkillFiles
  SkillsignCliVerificationEngine -. "Recomputes canonical form and digest — matches" .-> SkillsignCliCanonicalProcessor
  SkillsignCliVerificationEngine -. "Reads SKILL.md file bytes" .-> SkillsignSkillFiles
  SkillsignCliVerificationEngine -. "ECDSA signature and certificate checks pass (steps 6-8 partial)" .-> SkillsignCliVerificationEngine
  SkillsignCliVerificationEngine -. "SAN identity match fails" .-> SkillsignCliVerificationEngine
  SkillsignCliVerificationEngine -. "IDENTITY_MISMATCH — exit code 1" .-> SkillConsumer
`;case"errorInvalidCert":return`---
title: "Flows / Skill Consumer / INVALID_CERT — Certificate or SET Verification Failed"
---
graph LR
  SkillConsumer[fa:fa-user Skill Consumer]
  SkillsignCliVerificationEngine[Verification Engine]
  SkillsignCliSidecarManager[Sidecar Manager]
  SkillsignSkillFiles([Skill File Store])
  SkillsignCliCanonicalProcessor[Canonical Form Processor]
  SkillsignCliTufClient[TUF Client]
  Tuf[TUF Root]
  SkillsignTufCache([TUF Root Cache])
  SkillConsumer -. "Runs: skillsign verify ./SKILL.md" .-> SkillsignCliVerificationEngine
  SkillsignCliVerificationEngine -. "Reads and parses sidecar — OK" .-> SkillsignCliSidecarManager
  SkillsignCliSidecarManager -. "Reads .skillsign sidecar" .-> SkillsignSkillFiles
  SkillsignCliVerificationEngine -. "Recomputes canonical form and digest — matches" .-> SkillsignCliCanonicalProcessor
  SkillsignCliVerificationEngine -. "Reads SKILL.md file bytes" .-> SkillsignSkillFiles
  SkillsignCliVerificationEngine -. "ECDSA signature verification passes (step 6)" .-> SkillsignCliVerificationEngine
  SkillsignCliVerificationEngine -. "Requests trusted Fulcio root certificates and Rekor public key" .-> SkillsignCliTufClient
  SkillsignCliTufClient -. "Fetches current TUF root metadata" .-> Tuf
  SkillsignCliTufClient -. "Reads/writes cached TUF metadata" .-> SkillsignTufCache
  SkillsignCliVerificationEngine -. "Temporal binding and SET verification (step 9)" .-> SkillsignCliVerificationEngine
  SkillsignCliVerificationEngine -. "INVALID_CERT — exit code 1" .-> SkillConsumer
`;case"errorMalformedSidecar":return`---
title: "Flows / Skill Consumer / MALFORMED_SIDECAR — Invalid Sidecar"
---
graph LR
  SkillConsumer[fa:fa-user Skill Consumer]
  SkillsignCliVerificationEngine[Verification Engine]
  SkillsignCliSidecarManager[Sidecar Manager]
  SkillsignSkillFiles([Skill File Store])
  SkillConsumer -. "Runs: skillsign verify ./SKILL.md" .-> SkillsignCliVerificationEngine
  SkillsignCliVerificationEngine -. "Reads and parses sidecar" .-> SkillsignCliSidecarManager
  SkillsignCliSidecarManager -. "Reads .skillsign sidecar file" .-> SkillsignSkillFiles
  SkillsignCliVerificationEngine -. "MALFORMED_SIDECAR — exit code 1" .-> SkillConsumer
`;case"errorPolicyFail":return`---
title: "Flows / Skill Consumer / POLICY_FAIL — Trust Policy Not Satisfied"
---
graph LR
  SkillConsumer[fa:fa-user Skill Consumer]
  SkillsignCliVerificationEngine[Verification Engine]
  SkillsignCliPolicyEngine[Policy Engine]
  SkillsignSkillFiles([Skill File Store])
  SkillConsumer -. "Runs: skillsign verify --policy .skillsign-policy.yaml ./SKILL.md" .-> SkillsignCliVerificationEngine
  SkillsignCliVerificationEngine -. "Passes verified signer identity, rekor_timestamp, and skill_id [Phase 2]" .-> SkillsignCliPolicyEngine
  SkillsignCliPolicyEngine -. "Reads .skillsign-policy.yaml trust policy [Phase 2]" .-> SkillsignSkillFiles
  SkillsignCliPolicyEngine -. "Returns deny result" .-> SkillsignCliVerificationEngine
  SkillsignCliVerificationEngine -. "POLICY_FAIL — exit code 3" .-> SkillConsumer
`;case"errorSkillIdMismatch":return`---
title: "Flows / Skill Consumer / SKILL_ID_MISMATCH — Owner Path Inconsistency"
---
graph LR
  SkillConsumer[fa:fa-user Skill Consumer]
  SkillsignCliVerificationEngine[Verification Engine]
  SkillConsumer -. "Runs: skillsign verify ./SKILL.md — all crypto checks pass" .-> SkillsignCliVerificationEngine
  SkillsignCliVerificationEngine -. "Owner-path consistency check fails" .-> SkillsignCliVerificationEngine
  SkillsignCliVerificationEngine -. "SKILL_ID_MISMATCH — exit code 1" .-> SkillConsumer
`;case"errorTampered":return`---
title: "Flows / Skill Consumer / TAMPERED — File Modified After Signing"
---
graph LR
  SkillConsumer[fa:fa-user Skill Consumer]
  SkillsignCliVerificationEngine[Verification Engine]
  SkillsignCliSidecarManager[Sidecar Manager]
  SkillsignSkillFiles([Skill File Store])
  SkillsignCliCanonicalProcessor[Canonical Form Processor]
  SkillConsumer -. "Runs: skillsign verify ./SKILL.md" .-> SkillsignCliVerificationEngine
  SkillsignCliVerificationEngine -. "Reads and parses sidecar — OK" .-> SkillsignCliSidecarManager
  SkillsignCliSidecarManager -. "Reads .skillsign sidecar" .-> SkillsignSkillFiles
  SkillsignCliVerificationEngine -. "Recomputes canonical form and digest" .-> SkillsignCliCanonicalProcessor
  SkillsignCliVerificationEngine -. "Reads SKILL.md file bytes" .-> SkillsignSkillFiles
  SkillsignCliVerificationEngine -. "TAMPERED — exit code 1" .-> SkillConsumer
`;case"errorUnsigned":return`---
title: "Flows / Skill Consumer / UNSIGNED — No Sidecar Found"
---
graph LR
  SkillConsumer[fa:fa-user Skill Consumer]
  SkillsignCliVerificationEngine[Verification Engine]
  SkillsignCliSidecarManager[Sidecar Manager]
  SkillsignSkillFiles([Skill File Store])
  SkillConsumer -. "Runs: skillsign verify ./SKILL.md" .-> SkillsignCliVerificationEngine
  SkillsignCliVerificationEngine -. "Reads and parses sidecar" .-> SkillsignCliSidecarManager
  SkillsignCliSidecarManager -. "Looks for SKILL.md.skillsign — file not found" .-> SkillsignSkillFiles
  SkillsignCliVerificationEngine -. "UNSIGNED — exit code 2" .-> SkillConsumer
`;case"policyVerificationFlow":return`---
title: "Flows / Skill Consumer / Policy Verification"
---
graph LR
  SkillConsumer[fa:fa-user Skill Consumer]
  SkillsignCliVerificationEngine[Verification Engine]
  Rekor[Rekor Transparency Log]
  SkillsignCliPolicyEngine[Policy Engine]
  SkillsignSkillFiles([Skill File Store])
  SkillConsumer -. "Runs: skillsign verify --policy .skillsign-policy.yaml --strict ./SKILL.md" .-> SkillsignCliVerificationEngine
  SkillsignCliVerificationEngine -. "Completes full cryptographic verification" .-> SkillsignCliVerificationEngine
  SkillsignCliVerificationEngine -. "Confirms rekor_log_id exists, digest matches, and timestamp valid (--strict mode)" .-> Rekor
  SkillsignCliVerificationEngine -. "Passes verified signer identity, rekor_timestamp, and skill_id [Phase 2]" .-> SkillsignCliPolicyEngine
  SkillsignCliPolicyEngine -. "Reads .skillsign-policy.yaml trust policy" .-> SkillsignSkillFiles
  SkillsignCliPolicyEngine -. "Returns policy evaluation result" .-> SkillsignCliVerificationEngine
  SkillsignCliVerificationEngine -. "Returns VERIFIED (0), POLICY_FAIL (3), or verification failure (1)" .-> SkillConsumer
`;case"verificationFlow":return`---
title: "Flows / Skill Consumer / Verification"
---
graph LR
  SkillConsumer[fa:fa-user Skill Consumer]
  SkillsignCliVerificationEngine[Verification Engine]
  SkillsignCliSidecarManager[Sidecar Manager]
  SkillsignSkillFiles([Skill File Store])
  SkillsignCliCanonicalProcessor[Canonical Form Processor]
  SkillsignCliTufClient[TUF Client]
  Tuf[TUF Root]
  SkillsignTufCache([TUF Root Cache])
  SkillConsumer -. "Runs: skillsign verify ./SKILL.md" .-> SkillsignCliVerificationEngine
  SkillsignCliVerificationEngine -. "Reads and parses sidecar (steps 1-2)" .-> SkillsignCliSidecarManager
  SkillsignCliSidecarManager -. "Reads .skillsign sidecar with strict YAML 1.2 parsing" .-> SkillsignSkillFiles
  SkillsignCliVerificationEngine -. "Recomputes canonical form and digest (steps 3-5)" .-> SkillsignCliCanonicalProcessor
  SkillsignCliVerificationEngine -. "Reads SKILL.md file bytes" .-> SkillsignSkillFiles
  SkillsignCliVerificationEngine -. "Cryptographic verification (steps 6-8)" .-> SkillsignCliVerificationEngine
  SkillsignCliVerificationEngine -. "Requests trusted Fulcio root certificates and Rekor public key (step 7)" .-> SkillsignCliTufClient
  SkillsignCliTufClient -. "Fetches current TUF root metadata" .-> Tuf
  SkillsignCliTufClient -. "Reads/writes cached TUF metadata" .-> SkillsignTufCache
  SkillsignCliVerificationEngine -. "Temporal binding and SET verification (step 9)" .-> SkillsignCliVerificationEngine
  SkillsignCliVerificationEngine -. "SKILL_ID_MISMATCH owner-path check (step 11)" .-> SkillsignCliVerificationEngine
  SkillsignCliVerificationEngine -. "Returns VERIFIED (exit 0) or failure with specific exit code" .-> SkillConsumer
`;default:throw new Error("Unknown viewId: "+i)}}export{n as mmdSource};
