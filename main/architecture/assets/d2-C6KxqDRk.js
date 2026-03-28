function n(i){switch(i){case"cliComponents":return`direction: down

SkillAuthor: {
  label: "Skill Author"
  shape: person
}
SkillConsumer: {
  label: "Skill Consumer"
  shape: person
}
ClaudeCode: {
  label: "Claude Code"
}
SkillsignCli: {
  label: "SkillSign CLI"

  SigningEngine: {
    label: "Signing Engine"
  }
  VerificationEngine: {
    label: "Verification Engine"
  }
  AuthHandler: {
    label: "Auth Handler"
  }
  ManifestReader: {
    label: "Manifest Reader"
  }
  CanonicalProcessor: {
    label: "Canonical Form Processor"
  }
  PolicyEngine: {
    label: "Policy Engine"
  }
  SidecarManager: {
    label: "Sidecar Manager"
  }
  TufClient: {
    label: "TUF Client"
  }
  RekorClient: {
    label: "Rekor Client"
  }
}
Fulcio: {
  label: "Fulcio CA"
}
Github: {
  label: "GitHub Actions OIDC"
}
SigstoreDex: {
  label: "Sigstore Dex (OAuth)"
}
SkillsignSkillFiles: {
  label: "Skill File Store"
  shape: stored_data
}
Tuf: {
  label: "TUF Root"
}
SkillsignTufCache: {
  label: "TUF Root Cache"
  shape: stored_data
}
Rekor: {
  label: "Rekor Transparency Log"
}

SkillAuthor -> SkillsignCli.SigningEngine: "Signs SKILL.md files via CLI"
SkillConsumer -> SkillsignCli.VerificationEngine: "Verifies skill signatures via CLI"
ClaudeCode -> SkillsignCli.VerificationEngine: "Invokes verification before loading skills"
SkillsignCli.SigningEngine -> SkillsignCli.AuthHandler: "Gets OIDC identity token from"
SkillsignCli.SigningEngine -> SkillsignCli.CanonicalProcessor: "Gets SHA-256 digest from"
SkillsignCli.VerificationEngine -> SkillsignCli.CanonicalProcessor: "Recomputes digest via"
SkillsignCli.SigningEngine -> SkillsignCli.ManifestReader: "Reads skill_id and skill_version from"
SkillsignCli.VerificationEngine -> SkillsignCli.PolicyEngine: "Passes verified signer identity, rekor_timestamp, and skill_id for policy evaluation [Phase 2]"
SkillsignCli.VerificationEngine -> SkillsignCli.SidecarManager: "Reads sidecar fields via"
SkillsignCli.VerificationEngine -> SkillsignCli.TufClient: "Gets trusted Fulcio root certificates and Rekor public key from"
SkillsignCli.VerificationEngine -> SkillsignCli.RekorClient: "Queries Rekor log entries for strict mode verification"
SkillsignCli.AuthHandler -> Github: "Detects ambient OIDC token from GitHub Actions runtime (CI path)"
SkillsignCli.AuthHandler -> SigstoreDex: "Opens browser for OAuth login via Dex — user picks Google, GitHub, or Microsoft (interactive path)"
SkillsignCli.SigningEngine -> Fulcio: "Submits ephemeral public key and OIDC token via Sigstore SDK, receives short-lived X.509 certificate"
SkillsignCli.SigningEngine -> Rekor: "Submits signature, certificate, and digest as hashedrekord/v0.0.1 entry via Sigstore SDK"
SkillsignCli.SigningEngine -> SkillsignSkillFiles: "Checks for existing .skillsign sidecar before signing"
SkillsignCli.PolicyEngine -> SkillsignSkillFiles: "Reads .skillsign-policy.yaml trust policies [Phase 2]"
SkillsignCli.SidecarManager -> SkillsignSkillFiles: "Reads and writes .skillsign sidecar files"
SkillsignCli.ManifestReader -> SkillsignSkillFiles: "Reads skillsign.yaml manifests"
SkillsignCli.TufClient -> Tuf: "Fetches current TUF root metadata via HTTPS"
SkillsignCli.TufClient -> SkillsignTufCache: "Reads and writes cached TUF metadata via local filesystem"
SkillsignCli.RekorClient -> Rekor: "Queries transparency log entries via HTTPS/JSON"
`;case"skillsignContainers":return`direction: down

SkillAuthor: {
  label: "Skill Author"
  shape: person
}
SkillConsumer: {
  label: "Skill Consumer"
  shape: person
}
ClaudeCode: {
  label: "Claude Code"
}
Skillsign: {
  label: "SkillSign"

  Cli: {
    label: "SkillSign CLI"
  }
  SkillFiles: {
    label: "Skill File Store"
    shape: stored_data
  }
  TufCache: {
    label: "TUF Root Cache"
    shape: stored_data
  }
}
Github: {
  label: "GitHub Actions OIDC"
}
SigstoreDex: {
  label: "Sigstore Dex (OAuth)"
}
Fulcio: {
  label: "Fulcio CA"
}
Rekor: {
  label: "Rekor Transparency Log"
}
Tuf: {
  label: "TUF Root"
}

Skillsign.Cli -> Skillsign.SkillFiles: "Reads and writes SKILL.md files, manifests, sidecars, and policies"
Skillsign.Cli -> Skillsign.TufCache: "Reads and writes cached TUF metadata"
SkillAuthor -> Skillsign.Cli: "Signs SKILL.md files via CLI"
SkillConsumer -> Skillsign.Cli: "Verifies skill signatures via CLI"
ClaudeCode -> Skillsign.Cli: "Invokes verification before loading skills"
Skillsign.Cli -> Github: "Authenticates CI workflows via OIDC/HTTPS"
Skillsign.Cli -> SigstoreDex: "Authenticates developers via browser-based OAuth/HTTPS"
Skillsign.Cli -> Fulcio: "Obtains short-lived signing certificates via HTTPS"
Skillsign.Cli -> Rekor: "Submits and queries transparency log entries via HTTPS"
Skillsign.Cli -> Tuf: "Fetches TUF root metadata via HTTPS"
`;case"index":return`direction: down

SkillAuthor: {
  label: "Skill Author"
  shape: person
}
SkillConsumer: {
  label: "Skill Consumer"
  shape: person
}
ClaudeCode: {
  label: "Claude Code"
}
Skillsign: {
  label: "SkillSign"
}
Github: {
  label: "GitHub Actions OIDC"
}
SigstoreDex: {
  label: "Sigstore Dex (OAuth)"
}
Fulcio: {
  label: "Fulcio CA"
}
Rekor: {
  label: "Rekor Transparency Log"
}
Tuf: {
  label: "TUF Root"
}

SkillAuthor -> Skillsign: "Signs skill files for distribution"
SkillConsumer -> Skillsign: "Verifies skill file authenticity"
ClaudeCode -> Skillsign: "Verifies skills before loading"
Skillsign -> Github: "Authenticates CI workflows via OIDC tokens"
Skillsign -> SigstoreDex: "Authenticates developers via browser-based OAuth"
Skillsign -> Fulcio: "Obtains signing certificates"
Skillsign -> Rekor: "Records and queries signed artifacts"
Skillsign -> Tuf: "Retrieves trusted signing keys"
`;case"errorInvalidManifest":return`direction: right

SkillAuthor: {
  label: "Skill Author"
  shape: person
}
SkillsignCliSigningEngine: {
  label: "Signing Engine"
}
SkillsignCliManifestReader: {
  label: "Manifest Reader"
}
SkillsignSkillFiles: {
  label: "Skill File Store"
  shape: stored_data
}

SkillAuthor -> SkillsignCliSigningEngine: "Runs: skillsign sign ./SKILL.md"
SkillsignCliSigningEngine -> SkillsignCliManifestReader: "Reads and validates manifest"
SkillsignCliManifestReader -> SkillsignSkillFiles: "Reads skillsign.yaml — fails"
SkillsignCliSigningEngine -> SkillAuthor: "CLI error — exit code 10"
`;case"errorInvalidSkillFile":return`direction: right

SkillAuthor: {
  label: "Skill Author"
  shape: person
}
SkillsignCliSigningEngine: {
  label: "Signing Engine"
}
SkillsignCliManifestReader: {
  label: "Manifest Reader"
}
SkillsignSkillFiles: {
  label: "Skill File Store"
  shape: stored_data
}
SkillsignCliCanonicalProcessor: {
  label: "Canonical Form Processor"
}

SkillAuthor -> SkillsignCliSigningEngine: "Runs: skillsign sign ./SKILL.md"
SkillsignCliSigningEngine -> SkillsignCliManifestReader: "Reads and validates manifest"
SkillsignCliManifestReader -> SkillsignSkillFiles: "Reads skillsign.yaml — OK"
SkillsignCliSigningEngine -> SkillsignSkillFiles: "Checks for existing .skillsign sidecar — none found, OK"
SkillsignCliSigningEngine -> SkillsignCliCanonicalProcessor: "Requests canonical form and digest"
SkillsignCliSigningEngine -> SkillsignSkillFiles: "Reads SKILL.md file bytes"
SkillsignCliSigningEngine -> SkillAuthor: "Canonical form normalization fails — exit code 10"
`;case"errorSidecarExists":return`direction: right

SkillAuthor: {
  label: "Skill Author"
  shape: person
}
SkillsignCliSigningEngine: {
  label: "Signing Engine"
}
SkillsignCliManifestReader: {
  label: "Manifest Reader"
}
SkillsignSkillFiles: {
  label: "Skill File Store"
  shape: stored_data
}

SkillAuthor -> SkillsignCliSigningEngine: "Runs: skillsign sign ./SKILL.md"
SkillsignCliSigningEngine -> SkillsignCliManifestReader: "Reads and validates manifest"
SkillsignCliManifestReader -> SkillsignSkillFiles: "Reads skillsign.yaml — OK"
SkillsignCliSigningEngine -> SkillsignSkillFiles: "Checks for existing sidecar (step 3)"
SkillsignCliSigningEngine -> SkillAuthor: "Sidecar already exists — exit code 10"
`;case"errorSigningInfra":return`direction: right

SkillAuthor: {
  label: "Skill Author"
  shape: person
}
SkillsignCliSigningEngine: {
  label: "Signing Engine"
}
SkillsignCliAuthHandler: {
  label: "Auth Handler"
}
Fulcio: {
  label: "Fulcio CA"
}
Rekor: {
  label: "Rekor Transparency Log"
}

SkillAuthor -> SkillsignCliSigningEngine: "Manifest and canonical form valid, begins signing"
SkillsignCliSigningEngine -> SkillsignCliAuthHandler: "Requests OIDC authentication"
SkillsignCliAuthHandler -> SkillsignCliAuthHandler: "OIDC authentication fails — exit code 10"
SkillsignCliSigningEngine -> Fulcio: "Certificate issuance fails — exit code 10"
SkillsignCliSigningEngine -> SkillsignCliSigningEngine: "Local ECDSA signing fails — exit code 10"
SkillsignCliSigningEngine -> Rekor: "Rekor submission fails — exit code 10"
SkillsignCliSigningEngine -> SkillAuthor: "Signing infrastructure failure — exit code 10"
`;case"signingFlow":return`direction: right

SkillAuthor: {
  label: "Skill Author"
  shape: person
}
SkillsignCliSigningEngine: {
  label: "Signing Engine"
}
SkillsignCliManifestReader: {
  label: "Manifest Reader"
}
SkillsignCliSidecarManager: {
  label: "Sidecar Manager"
}
SkillsignSkillFiles: {
  label: "Skill File Store"
  shape: stored_data
}
SkillsignCliCanonicalProcessor: {
  label: "Canonical Form Processor"
}
SkillsignCliAuthHandler: {
  label: "Auth Handler"
}
Github: {
  label: "GitHub Actions OIDC"
}
SigstoreDex: {
  label: "Sigstore Dex (OAuth)"
}
Fulcio: {
  label: "Fulcio CA"
}
Rekor: {
  label: "Rekor Transparency Log"
}

SkillAuthor -> SkillsignCliSigningEngine: "Runs: skillsign sign ./SKILL.md"
SkillsignCliSigningEngine -> SkillsignCliManifestReader: "Reads and validates manifest"
SkillsignCliManifestReader -> SkillsignSkillFiles: "Reads skillsign.yaml manifest"
SkillsignCliSigningEngine -> SkillsignSkillFiles: "Checks for existing sidecar (step 3)"
SkillsignCliSigningEngine -> SkillsignCliCanonicalProcessor: "Requests canonical form and digest (steps 4-5)"
SkillsignCliSigningEngine -> SkillsignSkillFiles: "Reads SKILL.md file bytes (step 4)"
SkillsignCliSigningEngine -> SkillsignCliAuthHandler: "Requests OIDC authentication (step 6)"
SkillsignCliAuthHandler -> SkillsignCliAuthHandler: "Detects authentication mode"
SkillsignCliAuthHandler -> Github: "CI path: ambient OIDC token from GitHub Actions"
SkillsignCliAuthHandler -> SigstoreDex: "Interactive path: browser-based OAuth via Sigstore Dex"
SkillsignCliSigningEngine -> Fulcio: "Submits OIDC token and ephemeral public key via Sigstore SDK (steps 7-8)"
SkillsignCliSigningEngine -> SkillsignCliSigningEngine: "Signs digest with ephemeral ECDSA P-256 key (step 8, inside SDK)"
SkillsignCliSigningEngine -> Rekor: "Submits signature, certificate, and digest as hashedrekord/v0.0.1 entry via Sigstore SDK (step 9)"
SkillsignCliSigningEngine -> SkillsignCliSigningEngine: "Assembles sidecar dict from Sigstore Bundle fields (step 10)"
SkillsignCliSidecarManager -> SkillsignSkillFiles: "Writes SKILL.md.skillsign sidecar atomically via temp file rename (step 11)"
SkillsignCliSigningEngine -> SkillAuthor: "Signing complete — exit code 0"
`;case"errorIdentityMismatch":return`direction: right

SkillConsumer: {
  label: "Skill Consumer"
  shape: person
}
SkillsignCliVerificationEngine: {
  label: "Verification Engine"
}
SkillsignCliSidecarManager: {
  label: "Sidecar Manager"
}
SkillsignSkillFiles: {
  label: "Skill File Store"
  shape: stored_data
}
SkillsignCliCanonicalProcessor: {
  label: "Canonical Form Processor"
}

SkillConsumer -> SkillsignCliVerificationEngine: "Runs: skillsign verify ./SKILL.md"
SkillsignCliVerificationEngine -> SkillsignCliSidecarManager: "Reads and parses sidecar — OK"
SkillsignCliSidecarManager -> SkillsignSkillFiles: "Reads .skillsign sidecar"
SkillsignCliVerificationEngine -> SkillsignCliCanonicalProcessor: "Recomputes canonical form and digest — matches"
SkillsignCliVerificationEngine -> SkillsignSkillFiles: "Reads SKILL.md file bytes"
SkillsignCliVerificationEngine -> SkillsignCliVerificationEngine: "ECDSA signature and certificate checks pass (steps 6-8 partial)"
SkillsignCliVerificationEngine -> SkillsignCliVerificationEngine: "SAN identity match fails"
SkillsignCliVerificationEngine -> SkillConsumer: "IDENTITY_MISMATCH — exit code 1"
`;case"errorInvalidCert":return`direction: right

SkillConsumer: {
  label: "Skill Consumer"
  shape: person
}
SkillsignCliVerificationEngine: {
  label: "Verification Engine"
}
SkillsignCliSidecarManager: {
  label: "Sidecar Manager"
}
SkillsignSkillFiles: {
  label: "Skill File Store"
  shape: stored_data
}
SkillsignCliCanonicalProcessor: {
  label: "Canonical Form Processor"
}
SkillsignCliTufClient: {
  label: "TUF Client"
}
Tuf: {
  label: "TUF Root"
}
SkillsignTufCache: {
  label: "TUF Root Cache"
  shape: stored_data
}

SkillConsumer -> SkillsignCliVerificationEngine: "Runs: skillsign verify ./SKILL.md"
SkillsignCliVerificationEngine -> SkillsignCliSidecarManager: "Reads and parses sidecar — OK"
SkillsignCliSidecarManager -> SkillsignSkillFiles: "Reads .skillsign sidecar"
SkillsignCliVerificationEngine -> SkillsignCliCanonicalProcessor: "Recomputes canonical form and digest — matches"
SkillsignCliVerificationEngine -> SkillsignSkillFiles: "Reads SKILL.md file bytes"
SkillsignCliVerificationEngine -> SkillsignCliVerificationEngine: "ECDSA signature verification passes (step 6)"
SkillsignCliVerificationEngine -> SkillsignCliTufClient: "Requests trusted Fulcio root certificates and Rekor public key"
SkillsignCliTufClient -> Tuf: "Fetches current TUF root metadata"
SkillsignCliTufClient -> SkillsignTufCache: "Reads/writes cached TUF metadata"
SkillsignCliVerificationEngine -> SkillsignCliVerificationEngine: "Temporal binding and SET verification (step 9)"
SkillsignCliVerificationEngine -> SkillConsumer: "INVALID_CERT — exit code 1"
`;case"errorMalformedSidecar":return`direction: right

SkillConsumer: {
  label: "Skill Consumer"
  shape: person
}
SkillsignCliVerificationEngine: {
  label: "Verification Engine"
}
SkillsignCliSidecarManager: {
  label: "Sidecar Manager"
}
SkillsignSkillFiles: {
  label: "Skill File Store"
  shape: stored_data
}

SkillConsumer -> SkillsignCliVerificationEngine: "Runs: skillsign verify ./SKILL.md"
SkillsignCliVerificationEngine -> SkillsignCliSidecarManager: "Reads and parses sidecar"
SkillsignCliSidecarManager -> SkillsignSkillFiles: "Reads .skillsign sidecar file"
SkillsignCliVerificationEngine -> SkillConsumer: "MALFORMED_SIDECAR — exit code 1"
`;case"errorPolicyFail":return`direction: right

SkillConsumer: {
  label: "Skill Consumer"
  shape: person
}
SkillsignCliVerificationEngine: {
  label: "Verification Engine"
}
SkillsignCliPolicyEngine: {
  label: "Policy Engine"
}
SkillsignSkillFiles: {
  label: "Skill File Store"
  shape: stored_data
}

SkillConsumer -> SkillsignCliVerificationEngine: "Runs: skillsign verify --policy .skillsign-policy.yaml ./SKILL.md"
SkillsignCliVerificationEngine -> SkillsignCliPolicyEngine: "Passes verified signer identity, rekor_timestamp, and skill_id [Phase 2]"
SkillsignCliPolicyEngine -> SkillsignSkillFiles: "Reads .skillsign-policy.yaml trust policy [Phase 2]"
SkillsignCliPolicyEngine -> SkillsignCliVerificationEngine: "Returns deny result"
SkillsignCliVerificationEngine -> SkillConsumer: "POLICY_FAIL — exit code 3"
`;case"errorSkillIdMismatch":return`direction: right

SkillConsumer: {
  label: "Skill Consumer"
  shape: person
}
SkillsignCliVerificationEngine: {
  label: "Verification Engine"
}

SkillConsumer -> SkillsignCliVerificationEngine: "Runs: skillsign verify ./SKILL.md — all crypto checks pass"
SkillsignCliVerificationEngine -> SkillsignCliVerificationEngine: "Owner-path consistency check fails"
SkillsignCliVerificationEngine -> SkillConsumer: "SKILL_ID_MISMATCH — exit code 1"
`;case"errorTampered":return`direction: right

SkillConsumer: {
  label: "Skill Consumer"
  shape: person
}
SkillsignCliVerificationEngine: {
  label: "Verification Engine"
}
SkillsignCliSidecarManager: {
  label: "Sidecar Manager"
}
SkillsignSkillFiles: {
  label: "Skill File Store"
  shape: stored_data
}
SkillsignCliCanonicalProcessor: {
  label: "Canonical Form Processor"
}

SkillConsumer -> SkillsignCliVerificationEngine: "Runs: skillsign verify ./SKILL.md"
SkillsignCliVerificationEngine -> SkillsignCliSidecarManager: "Reads and parses sidecar — OK"
SkillsignCliSidecarManager -> SkillsignSkillFiles: "Reads .skillsign sidecar"
SkillsignCliVerificationEngine -> SkillsignCliCanonicalProcessor: "Recomputes canonical form and digest"
SkillsignCliVerificationEngine -> SkillsignSkillFiles: "Reads SKILL.md file bytes"
SkillsignCliVerificationEngine -> SkillConsumer: "TAMPERED — exit code 1"
`;case"errorUnsigned":return`direction: right

SkillConsumer: {
  label: "Skill Consumer"
  shape: person
}
SkillsignCliVerificationEngine: {
  label: "Verification Engine"
}
SkillsignCliSidecarManager: {
  label: "Sidecar Manager"
}
SkillsignSkillFiles: {
  label: "Skill File Store"
  shape: stored_data
}

SkillConsumer -> SkillsignCliVerificationEngine: "Runs: skillsign verify ./SKILL.md"
SkillsignCliVerificationEngine -> SkillsignCliSidecarManager: "Reads and parses sidecar"
SkillsignCliSidecarManager -> SkillsignSkillFiles: "Looks for SKILL.md.skillsign — file not found"
SkillsignCliVerificationEngine -> SkillConsumer: "UNSIGNED — exit code 2"
`;case"policyVerificationFlow":return`direction: right

SkillConsumer: {
  label: "Skill Consumer"
  shape: person
}
SkillsignCliVerificationEngine: {
  label: "Verification Engine"
}
SkillsignCliRekorClient: {
  label: "Rekor Client"
}
Rekor: {
  label: "Rekor Transparency Log"
}
SkillsignCliPolicyEngine: {
  label: "Policy Engine"
}
SkillsignSkillFiles: {
  label: "Skill File Store"
  shape: stored_data
}

SkillConsumer -> SkillsignCliVerificationEngine: "Runs: skillsign verify --policy .skillsign-policy.yaml --strict ./SKILL.md"
SkillsignCliVerificationEngine -> SkillsignCliVerificationEngine: "Completes full cryptographic verification"
SkillsignCliVerificationEngine -> SkillsignCliRekorClient: "Delegates live Rekor query for strict mode verification"
SkillsignCliRekorClient -> Rekor: "Queries log entry by rekor_log_id, confirms digest match and timestamp validity via HTTPS/JSON"
SkillsignCliVerificationEngine -> SkillsignCliPolicyEngine: "Passes verified signer identity, rekor_timestamp, and skill_id [Phase 2]"
SkillsignCliPolicyEngine -> SkillsignSkillFiles: "Reads .skillsign-policy.yaml trust policy"
SkillsignCliPolicyEngine -> SkillsignCliVerificationEngine: "Returns policy evaluation result"
SkillsignCliVerificationEngine -> SkillConsumer: "Returns VERIFIED (0), POLICY_FAIL (3), or verification failure (1)"
`;case"verificationFlow":return`direction: right

SkillConsumer: {
  label: "Skill Consumer"
  shape: person
}
SkillsignCliVerificationEngine: {
  label: "Verification Engine"
}
SkillsignCliSidecarManager: {
  label: "Sidecar Manager"
}
SkillsignSkillFiles: {
  label: "Skill File Store"
  shape: stored_data
}
SkillsignCliCanonicalProcessor: {
  label: "Canonical Form Processor"
}
SkillsignCliTufClient: {
  label: "TUF Client"
}
Tuf: {
  label: "TUF Root"
}
SkillsignTufCache: {
  label: "TUF Root Cache"
  shape: stored_data
}

SkillConsumer -> SkillsignCliVerificationEngine: "Runs: skillsign verify ./SKILL.md"
SkillsignCliVerificationEngine -> SkillsignCliSidecarManager: "Reads and parses sidecar (steps 1-2)"
SkillsignCliSidecarManager -> SkillsignSkillFiles: "Reads .skillsign sidecar with strict YAML 1.2 parsing"
SkillsignCliVerificationEngine -> SkillsignCliCanonicalProcessor: "Recomputes canonical form and digest (steps 3-5)"
SkillsignCliVerificationEngine -> SkillsignSkillFiles: "Reads SKILL.md file bytes"
SkillsignCliVerificationEngine -> SkillsignCliVerificationEngine: "Cryptographic verification (steps 6-8)"
SkillsignCliVerificationEngine -> SkillsignCliTufClient: "Requests trusted Fulcio root certificates and Rekor public key (step 7)"
SkillsignCliTufClient -> Tuf: "Fetches current TUF root metadata"
SkillsignCliTufClient -> SkillsignTufCache: "Reads/writes cached TUF metadata"
SkillsignCliVerificationEngine -> SkillsignCliVerificationEngine: "Temporal binding and SET verification (step 9)"
SkillsignCliVerificationEngine -> SkillsignCliVerificationEngine: "SKILL_ID_MISMATCH owner-path check (step 11)"
SkillsignCliVerificationEngine -> SkillConsumer: "Returns VERIFIED (exit 0) or failure with specific exit code"
`;default:throw new Error("Unknown viewId: "+i)}}export{n as d2Source};
