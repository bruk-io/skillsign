function t(e){switch(e){case"cliComponents":return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=cliComponents,
        nodesep=1.528,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=TB,
        ranksep=1.667,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2
    ];
    subgraph cluster_cli {
        graph [color="#1b3d88",
            fillcolor="#194b9e",
            label=<<FONT POINT-SIZE="11" COLOR="#bfdbfeb3"><B>SKILLSIGN CLI</B></FONT>>,
            likec4_depth=1,
            likec4_id="skillsign.cli",
            likec4_level=0,
            margin=40,
            style=filled
        ];
        signingengine [color="#4f46e5",
            fillcolor="#6366f1",
            fontcolor="#eef2ff",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Signing Engine</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">ECDSA P-256, X.509</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Orchestrates the signing protocol via<BR/>Sigstore SDK: reads manifest, canonicalizes<BR/>SKILL.md, computes digest, obtains OIDC<BR/>identity token, invokes<BR/>SigningContext.signer() which generates</FONT></TD></TR></TABLE>>,
            likec4_id="skillsign.cli.signingEngine",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        verificationengine [color="#4f46e5",
            fillcolor="#6366f1",
            fontcolor="#eef2ff",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Verification Engine</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">ECDSA P-256, X.509</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Orchestrates verification: reads sidecar via<BR/>SidecarManager, recomputes digest, verifies<BR/>ECDSA P-256 signature using certificate<BR/>public key, validates cert chain against<BR/>Fulcio root via TUF TrustedRoot and</FONT></TD></TR></TABLE>>,
            likec4_id="skillsign.cli.verificationEngine",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        authhandler [color="#4f46e5",
            fillcolor="#6366f1",
            fontcolor="#eef2ff",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Auth Handler</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">OIDC</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Obtains OIDC identity token for signing.<BR/>Detects ambient CI credentials first (GitHub<BR/>Actions OIDC via<BR/>detect_credential("sigstore") with client ID<BR/>_SIGSTORE_CLIENT_ID="sigstore"). Falls back</FONT></TD></TR></TABLE>>,
            likec4_id="skillsign.cli.authHandler",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        manifestreader [color="#4f46e5",
            fillcolor="#6366f1",
            fontcolor="#eef2ff",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Manifest Reader</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">YAML 1.2</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Reads skillsign.yaml to extract skill_id and<BR/>skill_version at signing time, with same<BR/>strict YAML parsing restrictions as the<BR/>sidecar (Section 7.3)</FONT></TD></TR></TABLE>>,
            likec4_id="skillsign.cli.manifestReader",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        canonicalprocessor [color="#4f46e5",
            fillcolor="#6366f1",
            fontcolor="#eef2ff",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Canonical Form Processor</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">UTF-8, SHA-256</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Implemented across canonical.py and<BR/>digest.py. canonical.py: 8-step normalization<BR/>(BOM strip, CRLF normalization, trailing<BR/>whitespace trim, single trailing newline,<BR/>UTF-8 encode, null-byte rejection).</FONT></TD></TR></TABLE>>,
            likec4_id="skillsign.cli.canonicalProcessor",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        policyengine [color="#4f46e5",
            fillcolor="#6366f1",
            fontcolor="#eef2ff",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Policy Engine</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">YAML 1.2</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">[Phase 2, not yet implemented] Evaluates<BR/>trust policies with first-match-wins rule<BR/>evaluation, signer_org matching with<BR/>lowercase normalization, and max_age_days<BR/>enforcement against verified rekor_timestamp</FONT></TD></TR></TABLE>>,
            likec4_id="skillsign.cli.policyEngine",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        sidecarmanager [color="#4f46e5",
            fillcolor="#6366f1",
            fontcolor="#eef2ff",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Sidecar Manager</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">YAML 1.2</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Implemented as a single sidecar.py module<BR/>combining reader and writer. Writer:<BR/>assembles canonical field-ordered YAML (PEM<BR/>fields as literal block scalars) and writes<BR/>atomically via temp file rename. Reader:</FONT></TD></TR></TABLE>>,
            likec4_id="skillsign.cli.sidecarManager",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        tufclient [color="#4f46e5",
            fillcolor="#6366f1",
            fontcolor="#eef2ff",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">TUF Client</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">TUF, HTTPS</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Wraps Sigstore SDK TrustedRoot via<BR/>infra/tuf.py. Fetches production TUF root<BR/>metadata including Fulcio root certificates<BR/>and Rekor public key. Falls back to cached<BR/>metadata when offline. Used by verification</FONT></TD></TR></TABLE>>,
            likec4_id="skillsign.cli.tufClient",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        rekorclient [color="#4f46e5",
            fillcolor="#6366f1",
            fontcolor="#eef2ff",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Rekor Client</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">HTTPS, JSON</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Wraps Rekor transparency log queries via<BR/>infra/rekor.py. Fetches log entries by log ID<BR/>using the Rekor search API<BR/>(/api/v1/log/entries/retrieve). Used by<BR/>verification engine in --strict mode to</FONT></TD></TR></TABLE>>,
            likec4_id="skillsign.cli.rekorClient",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
    }
    skillauthor [color="#7E451D",
        fillcolor="#A35829",
        fontcolor="#FFE0C2",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill Author</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#f9b27c">A developer who creates and signs SKILL.md<BR/>files for distribution</FONT></TD></TR></TABLE>>,
        likec4_id=skillAuthor,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    skillauthor -> signingengine [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Signs SKILL.md files via CLI</FONT></TD></TR></TABLE>>,
        likec4_id=yeyp4n,
        minlen=1,
        style=dashed];
    skillconsumer [color="#7E451D",
        fillcolor="#A35829",
        fontcolor="#FFE0C2",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill Consumer</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#f9b27c">A developer who installs and uses signed<BR/>skills in Claude Code</FONT></TD></TR></TABLE>>,
        likec4_id=skillConsumer,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    skillconsumer -> verificationengine [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Verifies skill signatures via CLI</FONT></TD></TR></TABLE>>,
        likec4_id=w5mnsm,
        minlen=1,
        style=dashed];
    claudecode [color="#475569",
        fillcolor="#64748b",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Claude Code</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">Anthropic CLI that loads and executes<BR/>SKILL.md files as instructions</FONT></TD></TR></TABLE>>,
        likec4_id=claudeCode,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    claudecode -> verificationengine [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Invokes verification before loading<BR/>skills</FONT></TD></TR></TABLE>>,
        likec4_id="1mjxtf2",
        minlen=1,
        style=dashed];
    signingengine -> authhandler [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Gets OIDC identity token from</FONT></TD></TR></TABLE>>,
        likec4_id="3k55mv",
        style=dashed,
        weight=3];
    signingengine -> manifestreader [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Reads skill_id and skill_version from</FONT></TD></TR></TABLE>>,
        likec4_id=au2xrx,
        style=dashed,
        weight=3];
    fulcio [color="#475569",
        fillcolor="#64748b",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Fulcio CA</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">Sigstore certificate authority that issues<BR/>short-lived certificates binding a verified<BR/>GitHub identity to a signer-generated<BR/>ephemeral public key</FONT></TD></TR></TABLE>>,
        likec4_id=fulcio,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    signingengine -> fulcio [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Submits ephemeral public key and OIDC<BR/>token via Sigstore SDK, receives<BR/>short-lived X.509 certificate</FONT></TD></TR></TABLE>>,
        likec4_id="48aevd",
        minlen=1,
        style=dashed];
    signingengine -> canonicalprocessor [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Gets SHA-256 digest from</FONT></TD></TR></TABLE>>,
        likec4_id=hc2fbf,
        style=dashed,
        weight=3];
    skillfiles [height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill File Store</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#bfdbfe">Local File System</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#bfdbfe">SKILL.md files, skillsign.yaml manifests,<BR/>.skillsign sidecars, and<BR/>.skillsign-policy.yaml trust policies on disk</FONT></TD></TR></TABLE>>,
        likec4_id="skillsign.skillFiles",
        likec4_level=0,
        margin="0.223,0",
        penwidth=2,
        shape=cylinder,
        width=4.445];
    signingengine -> skillfiles [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Checks for existing .skillsign sidecar<BR/>before signing</FONT></TD></TR></TABLE>>,
        likec4_id=rb4ce3,
        style=dashed,
        weight=2];
    rekor [color="#475569",
        fillcolor="#64748b",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Rekor Transparency Log</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">Append-only, publicly auditable log recording<BR/>signatures, certificates, and digests</FONT></TD></TR></TABLE>>,
        likec4_id=rekor,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    signingengine -> rekor [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Submits signature, certificate, and<BR/>digest as hashedrekord/v0.0.1 entry via<BR/>Sigstore SDK</FONT></TD></TR></TABLE>>,
        likec4_id="1uh55pu",
        style=dashed];
    verificationengine -> canonicalprocessor [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Recomputes digest via</FONT></TD></TR></TABLE>>,
        likec4_id="1l5jd35",
        style=dashed,
        weight=3];
    verificationengine -> policyengine [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Passes verified signer identity,<BR/>rekor_timestamp, and skill_id for policy<BR/>evaluation [Phase 2]</FONT></TD></TR></TABLE>>,
        likec4_id="16ertsj",
        style=dashed,
        weight=3];
    verificationengine -> sidecarmanager [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Reads sidecar fields via</FONT></TD></TR></TABLE>>,
        likec4_id="12ytpz9",
        style=dashed,
        weight=3];
    verificationengine -> tufclient [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Gets trusted Fulcio root certificates<BR/>and Rekor public key from</FONT></TD></TR></TABLE>>,
        likec4_id=yjyegz,
        style=dashed,
        weight=3];
    verificationengine -> rekorclient [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Queries Rekor log entries for strict<BR/>mode verification</FONT></TD></TR></TABLE>>,
        likec4_id=xcpy79,
        style=dashed,
        weight=3];
    github [color="#475569",
        fillcolor="#64748b",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">GitHub Actions OIDC</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">CI identity provider: GitHub Actions runtime<BR/>issues OIDC tokens encoding the exact repo,<BR/>workflow, and branch. Fulcio verifies these<BR/>tokens and issues certificates with URI SANs<BR/>(e.g.,</FONT></TD></TR></TABLE>>,
        likec4_id=github,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    authhandler -> github [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Detects ambient OIDC token from GitHub<BR/>Actions runtime (CI path)</FONT></TD></TR></TABLE>>,
        likec4_id=wzrfx7,
        minlen=1,
        style=dashed];
    sigstoredex [color="#475569",
        fillcolor="#64748b",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Sigstore Dex (OAuth)</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">Interactive identity provider:<BR/>Sigstore-hosted Dex instance<BR/>(oauth2.sigstore.dev/auth) that federates to<BR/>Google, GitHub, and Microsoft OAuth. Fulcio<BR/>verifies the Dex-issued token and issues</FONT></TD></TR></TABLE>>,
        likec4_id=sigstoreDex,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    authhandler -> sigstoredex [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Opens browser for OAuth login via Dex —<BR/>user picks Google, GitHub, or Microsoft<BR/>(interactive path)</FONT></TD></TR></TABLE>>,
        likec4_id=idhkyt,
        minlen=1,
        style=dashed];
    manifestreader -> skillfiles [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Reads skillsign.yaml manifests</FONT></TD></TR></TABLE>>,
        likec4_id=bt4g98,
        style=dashed];
    policyengine -> skillfiles [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Reads .skillsign-policy.yaml trust<BR/>policies [Phase 2]</FONT></TD></TR></TABLE>>,
        likec4_id="16xnu3s",
        style=dashed];
    sidecarmanager -> skillfiles [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Reads and writes .skillsign sidecar<BR/>files</FONT></TD></TR></TABLE>>,
        likec4_id=xqq2m,
        style=dashed];
    tuf [color="#475569",
        fillcolor="#64748b",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">TUF Root</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">The Update Framework root of trust<BR/>distributing Sigstore public keys</FONT></TD></TR></TABLE>>,
        likec4_id=tuf,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    tufclient -> tuf [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Fetches current TUF root metadata via<BR/>HTTPS</FONT></TD></TR></TABLE>>,
        likec4_id="3zuxcn",
        minlen=1,
        style=dashed];
    tufcache [height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">TUF Root Cache</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#bfdbfe">Local File System</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#bfdbfe">Local cache of bundled and fetched Sigstore<BR/>TUF root metadata and Fulcio root<BR/>certificates</FONT></TD></TR></TABLE>>,
        likec4_id="skillsign.tufCache",
        likec4_level=0,
        margin="0.223,0",
        penwidth=2,
        shape=cylinder,
        width=4.445];
    tufclient -> tufcache [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Reads and writes cached TUF metadata via<BR/>local filesystem</FONT></TD></TR></TABLE>>,
        likec4_id="1b9w9yv",
        minlen=1,
        style=dashed,
        weight=2];
    rekorclient -> rekor [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Queries transparency log entries via<BR/>HTTPS/JSON</FONT></TD></TR></TABLE>>,
        likec4_id="1yk4lsn",
        style=dashed];
}
`;case"skillsignContainers":return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=skillsignContainers,
        nodesep=1.528,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=TB,
        ranksep=1.667,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2
    ];
    subgraph cluster_skillsign {
        graph [color="#0b3c57",
            fillcolor="#0d4b6c",
            label=<<FONT POINT-SIZE="11" COLOR="#b6ecf7b3"><B>SKILLSIGN</B></FONT>>,
            likec4_depth=1,
            likec4_id=skillsign,
            likec4_level=0,
            margin=40,
            style=filled
        ];
        cli [group=skillsign,
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">SkillSign CLI</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#bfdbfe">Python, Click</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#bfdbfe">Command-line tool for signing and verifying<BR/>SKILL.md files. Also provides auth status,<BR/>inspect, and unsign subcommands (Section 9.1)</FONT></TD></TR></TABLE>>,
            likec4_id="skillsign.cli",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        skillfiles [group=skillsign,
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill File Store</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#bfdbfe">Local File System</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#bfdbfe">SKILL.md files, skillsign.yaml manifests,<BR/>.skillsign sidecars, and<BR/>.skillsign-policy.yaml trust policies on disk</FONT></TD></TR></TABLE>>,
            likec4_id="skillsign.skillFiles",
            likec4_level=1,
            margin="0.223,0",
            penwidth=2,
            shape=cylinder,
            width=4.445];
        tufcache [group=skillsign,
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">TUF Root Cache</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#bfdbfe">Local File System</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#bfdbfe">Local cache of bundled and fetched Sigstore<BR/>TUF root metadata and Fulcio root<BR/>certificates</FONT></TD></TR></TABLE>>,
            likec4_id="skillsign.tufCache",
            likec4_level=1,
            margin="0.223,0",
            penwidth=2,
            shape=cylinder,
            width=4.445];
    }
    skillauthor [color="#7E451D",
        fillcolor="#A35829",
        fontcolor="#FFE0C2",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill Author</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#f9b27c">A developer who creates and signs SKILL.md<BR/>files for distribution</FONT></TD></TR></TABLE>>,
        likec4_id=skillAuthor,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    skillauthor -> cli [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Signs SKILL.md files via CLI</FONT></TD></TR></TABLE>>,
        likec4_id="1iil0v8",
        minlen=1,
        style=dashed];
    skillconsumer [color="#7E451D",
        fillcolor="#A35829",
        fontcolor="#FFE0C2",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill Consumer</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#f9b27c">A developer who installs and uses signed<BR/>skills in Claude Code</FONT></TD></TR></TABLE>>,
        likec4_id=skillConsumer,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    skillconsumer -> cli [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Verifies skill signatures via CLI</FONT></TD></TR></TABLE>>,
        likec4_id=nb9f4f,
        minlen=1,
        style=dashed];
    claudecode [color="#475569",
        fillcolor="#64748b",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Claude Code</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">Anthropic CLI that loads and executes<BR/>SKILL.md files as instructions</FONT></TD></TR></TABLE>>,
        likec4_id=claudeCode,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    claudecode -> cli [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Invokes verification before loading<BR/>skills</FONT></TD></TR></TABLE>>,
        likec4_id="1wvrnrr",
        minlen=1,
        style=dashed];
    cli -> skillfiles [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Reads and writes SKILL.md files,<BR/>manifests, sidecars, and policies</FONT></TD></TR></TABLE>>,
        likec4_id=ysfp8o,
        minlen=1,
        style=dashed,
        weight=2];
    cli -> tufcache [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Reads and writes cached TUF metadata</FONT></TD></TR></TABLE>>,
        likec4_id="1vjp0vb",
        minlen=1,
        style=dashed,
        weight=2];
    github [color="#475569",
        fillcolor="#64748b",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">GitHub Actions OIDC</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">CI identity provider: GitHub Actions runtime<BR/>issues OIDC tokens encoding the exact repo,<BR/>workflow, and branch. Fulcio verifies these<BR/>tokens and issues certificates with URI SANs<BR/>(e.g.,</FONT></TD></TR></TABLE>>,
        likec4_id=github,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    cli -> github [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Authenticates CI workflows via<BR/>OIDC/HTTPS</FONT></TD></TR></TABLE>>,
        likec4_id=q4ylol,
        minlen=1,
        style=dashed];
    sigstoredex [color="#475569",
        fillcolor="#64748b",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Sigstore Dex (OAuth)</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">Interactive identity provider:<BR/>Sigstore-hosted Dex instance<BR/>(oauth2.sigstore.dev/auth) that federates to<BR/>Google, GitHub, and Microsoft OAuth. Fulcio<BR/>verifies the Dex-issued token and issues</FONT></TD></TR></TABLE>>,
        likec4_id=sigstoreDex,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    cli -> sigstoredex [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Authenticates developers via<BR/>browser-based OAuth/HTTPS</FONT></TD></TR></TABLE>>,
        likec4_id=p0ypx7,
        minlen=1,
        style=dashed];
    fulcio [color="#475569",
        fillcolor="#64748b",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Fulcio CA</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">Sigstore certificate authority that issues<BR/>short-lived certificates binding a verified<BR/>GitHub identity to a signer-generated<BR/>ephemeral public key</FONT></TD></TR></TABLE>>,
        likec4_id=fulcio,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    cli -> fulcio [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Obtains short-lived signing certificates<BR/>via HTTPS</FONT></TD></TR></TABLE>>,
        likec4_id=lrh2be,
        minlen=1,
        style=dashed];
    rekor [color="#475569",
        fillcolor="#64748b",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Rekor Transparency Log</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">Append-only, publicly auditable log recording<BR/>signatures, certificates, and digests</FONT></TD></TR></TABLE>>,
        likec4_id=rekor,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    cli -> rekor [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Submits and queries transparency log<BR/>entries via HTTPS</FONT></TD></TR></TABLE>>,
        likec4_id="1n0842p",
        minlen=1,
        style=dashed];
    tuf [color="#475569",
        fillcolor="#64748b",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">TUF Root</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">The Update Framework root of trust<BR/>distributing Sigstore public keys</FONT></TD></TR></TABLE>>,
        likec4_id=tuf,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    cli -> tuf [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Fetches TUF root metadata via HTTPS</FONT></TD></TR></TABLE>>,
        likec4_id="17vwa6f",
        minlen=1,
        style=dashed];
}
`;case"index":return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=index,
        nodesep=1.528,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=TB,
        ranksep=1.667,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2
    ];
    skillauthor [color="#7E451D",
        fillcolor="#A35829",
        fontcolor="#FFE0C2",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill Author</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#f9b27c">A developer who creates and signs SKILL.md<BR/>files for distribution</FONT></TD></TR></TABLE>>,
        likec4_id=skillAuthor,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    skillsign [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">SkillSign</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#B6ECF7">Cryptographic signing and verification system<BR/>for Claude Code SKILL.md files using Sigstore<BR/>keyless signing</FONT></TD></TR></TABLE>>,
        likec4_id=skillsign,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    skillauthor -> skillsign [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Signs skill files for distribution</FONT></TD></TR></TABLE>>,
        likec4_id=qk5ay4,
        minlen=1,
        style=dashed];
    skillconsumer [color="#7E451D",
        fillcolor="#A35829",
        fontcolor="#FFE0C2",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill Consumer</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#f9b27c">A developer who installs and uses signed<BR/>skills in Claude Code</FONT></TD></TR></TABLE>>,
        likec4_id=skillConsumer,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    skillconsumer -> skillsign [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Verifies skill file authenticity</FONT></TD></TR></TABLE>>,
        likec4_id=fz387b,
        minlen=1,
        style=dashed];
    claudecode [color="#475569",
        fillcolor="#64748b",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Claude Code</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">Anthropic CLI that loads and executes<BR/>SKILL.md files as instructions</FONT></TD></TR></TABLE>>,
        likec4_id=claudeCode,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    claudecode -> skillsign [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Verifies skills before loading</FONT></TD></TR></TABLE>>,
        likec4_id=sdmgbj,
        minlen=1,
        style=dashed];
    github [color="#475569",
        fillcolor="#64748b",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">GitHub Actions OIDC</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">CI identity provider: GitHub Actions runtime<BR/>issues OIDC tokens encoding the exact repo,<BR/>workflow, and branch. Fulcio verifies these<BR/>tokens and issues certificates with URI SANs<BR/>(e.g.,</FONT></TD></TR></TABLE>>,
        likec4_id=github,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    skillsign -> github [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Authenticates CI workflows via OIDC<BR/>tokens</FONT></TD></TR></TABLE>>,
        likec4_id="1vlysst",
        minlen=1,
        style=dashed];
    sigstoredex [color="#475569",
        fillcolor="#64748b",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Sigstore Dex (OAuth)</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">Interactive identity provider:<BR/>Sigstore-hosted Dex instance<BR/>(oauth2.sigstore.dev/auth) that federates to<BR/>Google, GitHub, and Microsoft OAuth. Fulcio<BR/>verifies the Dex-issued token and issues</FONT></TD></TR></TABLE>>,
        likec4_id=sigstoreDex,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    skillsign -> sigstoredex [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Authenticates developers via<BR/>browser-based OAuth</FONT></TD></TR></TABLE>>,
        likec4_id="1q0ilkj",
        minlen=1,
        style=dashed];
    fulcio [color="#475569",
        fillcolor="#64748b",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Fulcio CA</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">Sigstore certificate authority that issues<BR/>short-lived certificates binding a verified<BR/>GitHub identity to a signer-generated<BR/>ephemeral public key</FONT></TD></TR></TABLE>>,
        likec4_id=fulcio,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    skillsign -> fulcio [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Obtains signing certificates</FONT></TD></TR></TABLE>>,
        likec4_id="1rjf9pu",
        minlen=1,
        style=dashed];
    rekor [color="#475569",
        fillcolor="#64748b",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Rekor Transparency Log</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">Append-only, publicly auditable log recording<BR/>signatures, certificates, and digests</FONT></TD></TR></TABLE>>,
        likec4_id=rekor,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    skillsign -> rekor [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Records and queries signed artifacts</FONT></TD></TR></TABLE>>,
        likec4_id="4b3s89",
        minlen=1,
        style=dashed];
    tuf [color="#475569",
        fillcolor="#64748b",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">TUF Root</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">The Update Framework root of trust<BR/>distributing Sigstore public keys</FONT></TD></TR></TABLE>>,
        likec4_id=tuf,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    skillsign -> tuf [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Retrieves trusted signing keys</FONT></TD></TR></TABLE>>,
        likec4_id=dyn8gf,
        minlen=1,
        style=dashed];
}
`;case"errorIdentityMismatch":return`digraph {
  likec4_viewId = "errorIdentityMismatch";
  bgcolor = "transparent";
  layout = "dot";
  compound = true;
  rankdir = "LR";
  splines = "spline";
  outputorder = "nodesfirst";
  nodesep = 1.528;
  ranksep = 1.667;
  pad = 0.209;
  fontname = "Arial";
  ordering = "in";
  graph [
    fontsize = 20;
    labeljust = "l";
    labelloc = "t";
  ];
  edge [
    arrowsize = 0.75;
    fontname = "Arial";
    fontsize = 14;
    penwidth = 2;
    color = "#8D8D8D";
    fontcolor = "#C9C9C9";
  ];
  node [
    fontname = "Arial";
    shape = "rect";
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    style = "filled";
    penwidth = 0;
  ];
  "skillconsumer" [
    likec4_id = "skillConsumer";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill Consumer</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#f9b27c">A developer who installs and uses signed<BR/>skills in Claude Code</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#A35829";
    fontcolor = "#FFE0C2";
    color = "#7E451D";
  ];
  "verificationengine" [
    likec4_id = "skillsign.cli.verificationEngine";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Verification Engine</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">ECDSA P-256, X.509</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Orchestrates verification: reads sidecar via<BR/>SidecarManager, recomputes digest, verifies<BR/>ECDSA P-256 signature using certificate<BR/>public key, validates cert chain against<BR/>Fulcio root via TUF TrustedRoot and</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "sidecarmanager" [
    likec4_id = "skillsign.cli.sidecarManager";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Sidecar Manager</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">YAML 1.2</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Implemented as a single sidecar.py module<BR/>combining reader and writer. Writer:<BR/>assembles canonical field-ordered YAML (PEM<BR/>fields as literal block scalars) and writes<BR/>atomically via temp file rename. Reader:</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "skillfiles" [
    likec4_id = "skillsign.skillFiles";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill File Store</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#bfdbfe">Local File System</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#bfdbfe">SKILL.md files, skillsign.yaml manifests,<BR/>.skillsign sidecars, and<BR/>.skillsign-policy.yaml trust policies on disk</FONT></TD></TR></TABLE>>;
    margin = "0.223,0";
    width = 4.445;
    height = 2.5;
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    penwidth = 2;
    shape = "cylinder";
  ];
  "canonicalprocessor" [
    likec4_id = "skillsign.cli.canonicalProcessor";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Canonical Form Processor</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">UTF-8, SHA-256</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Implemented across canonical.py and<BR/>digest.py. canonical.py: 8-step normalization<BR/>(BOM strip, CRLF normalization, trailing<BR/>whitespace trim, single trailing newline,<BR/>UTF-8 encode, null-byte rejection).</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "skillconsumer" -> "verificationengine" [
    likec4_id = "step-01";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>1</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Runs: skillsign verify ./SKILL.md</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "verificationengine" -> "sidecarmanager" [
    likec4_id = "step-02";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>2</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Reads and parses sidecar — OK</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "sidecarmanager" -> "skillfiles" [
    likec4_id = "step-03";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>3</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Reads .skillsign sidecar</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "verificationengine" -> "canonicalprocessor" [
    likec4_id = "step-04";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>4</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Recomputes canonical form and digest —<BR/>matches</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "verificationengine" -> "skillfiles" [
    likec4_id = "step-05";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>5</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Reads SKILL.md file bytes</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "verificationengine" -> "verificationengine" [
    likec4_id = "step-06";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>6</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">ECDSA signature and certificate checks<BR/>pass (steps 6-8 partial)</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "verificationengine" -> "verificationengine" [
    likec4_id = "step-07";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>7</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">SAN identity match fails</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "skillconsumer" -> "verificationengine" [
    likec4_id = "step-08";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>8</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">IDENTITY_MISMATCH — exit code 1</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
}`;case"errorInvalidCert":return`digraph {
  likec4_viewId = "errorInvalidCert";
  bgcolor = "transparent";
  layout = "dot";
  compound = true;
  rankdir = "LR";
  splines = "spline";
  outputorder = "nodesfirst";
  nodesep = 1.528;
  ranksep = 1.667;
  pad = 0.209;
  fontname = "Arial";
  ordering = "in";
  graph [
    fontsize = 20;
    labeljust = "l";
    labelloc = "t";
  ];
  edge [
    arrowsize = 0.75;
    fontname = "Arial";
    fontsize = 14;
    penwidth = 2;
    color = "#8D8D8D";
    fontcolor = "#C9C9C9";
  ];
  node [
    fontname = "Arial";
    shape = "rect";
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    style = "filled";
    penwidth = 0;
  ];
  "skillconsumer" [
    likec4_id = "skillConsumer";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill Consumer</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#f9b27c">A developer who installs and uses signed<BR/>skills in Claude Code</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#A35829";
    fontcolor = "#FFE0C2";
    color = "#7E451D";
  ];
  "verificationengine" [
    likec4_id = "skillsign.cli.verificationEngine";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Verification Engine</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">ECDSA P-256, X.509</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Orchestrates verification: reads sidecar via<BR/>SidecarManager, recomputes digest, verifies<BR/>ECDSA P-256 signature using certificate<BR/>public key, validates cert chain against<BR/>Fulcio root via TUF TrustedRoot and</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "sidecarmanager" [
    likec4_id = "skillsign.cli.sidecarManager";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Sidecar Manager</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">YAML 1.2</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Implemented as a single sidecar.py module<BR/>combining reader and writer. Writer:<BR/>assembles canonical field-ordered YAML (PEM<BR/>fields as literal block scalars) and writes<BR/>atomically via temp file rename. Reader:</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "skillfiles" [
    likec4_id = "skillsign.skillFiles";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill File Store</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#bfdbfe">Local File System</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#bfdbfe">SKILL.md files, skillsign.yaml manifests,<BR/>.skillsign sidecars, and<BR/>.skillsign-policy.yaml trust policies on disk</FONT></TD></TR></TABLE>>;
    margin = "0.223,0";
    width = 4.445;
    height = 2.5;
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    penwidth = 2;
    shape = "cylinder";
  ];
  "canonicalprocessor" [
    likec4_id = "skillsign.cli.canonicalProcessor";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Canonical Form Processor</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">UTF-8, SHA-256</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Implemented across canonical.py and<BR/>digest.py. canonical.py: 8-step normalization<BR/>(BOM strip, CRLF normalization, trailing<BR/>whitespace trim, single trailing newline,<BR/>UTF-8 encode, null-byte rejection).</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "tufclient" [
    likec4_id = "skillsign.cli.tufClient";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">TUF Client</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">TUF, HTTPS</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Wraps Sigstore SDK TrustedRoot via<BR/>infra/tuf.py. Fetches production TUF root<BR/>metadata including Fulcio root certificates<BR/>and Rekor public key. Falls back to cached<BR/>metadata when offline. Used by verification</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "tuf" [
    likec4_id = "tuf";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">TUF Root</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">The Update Framework root of trust<BR/>distributing Sigstore public keys</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748b";
    fontcolor = "#f8fafc";
    color = "#475569";
  ];
  "tufcache" [
    likec4_id = "skillsign.tufCache";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">TUF Root Cache</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#bfdbfe">Local File System</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#bfdbfe">Local cache of bundled and fetched Sigstore<BR/>TUF root metadata and Fulcio root<BR/>certificates</FONT></TD></TR></TABLE>>;
    margin = "0.223,0";
    width = 4.445;
    height = 2.5;
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    penwidth = 2;
    shape = "cylinder";
  ];
  "skillconsumer" -> "verificationengine" [
    likec4_id = "step-01";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>1</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Runs: skillsign verify ./SKILL.md</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "verificationengine" -> "sidecarmanager" [
    likec4_id = "step-02";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>2</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Reads and parses sidecar — OK</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "sidecarmanager" -> "skillfiles" [
    likec4_id = "step-03";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>3</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Reads .skillsign sidecar</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "verificationengine" -> "canonicalprocessor" [
    likec4_id = "step-04";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>4</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Recomputes canonical form and digest —<BR/>matches</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "verificationengine" -> "skillfiles" [
    likec4_id = "step-05";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>5</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Reads SKILL.md file bytes</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "verificationengine" -> "verificationengine" [
    likec4_id = "step-06";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>6</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">ECDSA signature verification passes<BR/>(step 6)</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "verificationengine" -> "tufclient" [
    likec4_id = "step-07";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>7</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Requests trusted Fulcio root<BR/>certificates and Rekor public key</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "tufclient" -> "tuf" [
    likec4_id = "step-08.1";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>8.1</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Fetches current TUF root metadata</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "tufclient" -> "tufcache" [
    likec4_id = "step-08.2";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>8.2</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Reads/writes cached TUF metadata</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "verificationengine" -> "verificationengine" [
    likec4_id = "step-09";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>9</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Temporal binding and SET verification<BR/>(step 9)</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "skillconsumer" -> "verificationengine" [
    likec4_id = "step-10";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>10</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">INVALID_CERT — exit code 1</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
}`;case"errorInvalidManifest":return`digraph {
  likec4_viewId = "errorInvalidManifest";
  bgcolor = "transparent";
  layout = "dot";
  compound = true;
  rankdir = "LR";
  splines = "spline";
  outputorder = "nodesfirst";
  nodesep = 1.528;
  ranksep = 1.667;
  pad = 0.209;
  fontname = "Arial";
  ordering = "in";
  graph [
    fontsize = 20;
    labeljust = "l";
    labelloc = "t";
  ];
  edge [
    arrowsize = 0.75;
    fontname = "Arial";
    fontsize = 14;
    penwidth = 2;
    color = "#8D8D8D";
    fontcolor = "#C9C9C9";
  ];
  node [
    fontname = "Arial";
    shape = "rect";
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    style = "filled";
    penwidth = 0;
  ];
  "skillauthor" [
    likec4_id = "skillAuthor";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill Author</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#f9b27c">A developer who creates and signs SKILL.md<BR/>files for distribution</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#A35829";
    fontcolor = "#FFE0C2";
    color = "#7E451D";
  ];
  "signingengine" [
    likec4_id = "skillsign.cli.signingEngine";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Signing Engine</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">ECDSA P-256, X.509</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Orchestrates the signing protocol via<BR/>Sigstore SDK: reads manifest, canonicalizes<BR/>SKILL.md, computes digest, obtains OIDC<BR/>identity token, invokes<BR/>SigningContext.signer() which generates</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "manifestreader" [
    likec4_id = "skillsign.cli.manifestReader";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Manifest Reader</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">YAML 1.2</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Reads skillsign.yaml to extract skill_id and<BR/>skill_version at signing time, with same<BR/>strict YAML parsing restrictions as the<BR/>sidecar (Section 7.3)</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "skillfiles" [
    likec4_id = "skillsign.skillFiles";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill File Store</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#bfdbfe">Local File System</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#bfdbfe">SKILL.md files, skillsign.yaml manifests,<BR/>.skillsign sidecars, and<BR/>.skillsign-policy.yaml trust policies on disk</FONT></TD></TR></TABLE>>;
    margin = "0.223,0";
    width = 4.445;
    height = 2.5;
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    penwidth = 2;
    shape = "cylinder";
  ];
  "skillauthor" -> "signingengine" [
    likec4_id = "step-01";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>1</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Runs: skillsign sign ./SKILL.md</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "signingengine" -> "manifestreader" [
    likec4_id = "step-02";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>2</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Reads and validates manifest</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "manifestreader" -> "skillfiles" [
    likec4_id = "step-03";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>3</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Reads skillsign.yaml — fails</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "skillauthor" -> "signingengine" [
    likec4_id = "step-04";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>4</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">CLI error — exit code 10</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
}`;case"errorInvalidSkillFile":return`digraph {
  likec4_viewId = "errorInvalidSkillFile";
  bgcolor = "transparent";
  layout = "dot";
  compound = true;
  rankdir = "LR";
  splines = "spline";
  outputorder = "nodesfirst";
  nodesep = 1.528;
  ranksep = 1.667;
  pad = 0.209;
  fontname = "Arial";
  ordering = "in";
  graph [
    fontsize = 20;
    labeljust = "l";
    labelloc = "t";
  ];
  edge [
    arrowsize = 0.75;
    fontname = "Arial";
    fontsize = 14;
    penwidth = 2;
    color = "#8D8D8D";
    fontcolor = "#C9C9C9";
  ];
  node [
    fontname = "Arial";
    shape = "rect";
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    style = "filled";
    penwidth = 0;
  ];
  "skillauthor" [
    likec4_id = "skillAuthor";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill Author</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#f9b27c">A developer who creates and signs SKILL.md<BR/>files for distribution</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#A35829";
    fontcolor = "#FFE0C2";
    color = "#7E451D";
  ];
  "signingengine" [
    likec4_id = "skillsign.cli.signingEngine";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Signing Engine</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">ECDSA P-256, X.509</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Orchestrates the signing protocol via<BR/>Sigstore SDK: reads manifest, canonicalizes<BR/>SKILL.md, computes digest, obtains OIDC<BR/>identity token, invokes<BR/>SigningContext.signer() which generates</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "manifestreader" [
    likec4_id = "skillsign.cli.manifestReader";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Manifest Reader</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">YAML 1.2</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Reads skillsign.yaml to extract skill_id and<BR/>skill_version at signing time, with same<BR/>strict YAML parsing restrictions as the<BR/>sidecar (Section 7.3)</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "skillfiles" [
    likec4_id = "skillsign.skillFiles";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill File Store</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#bfdbfe">Local File System</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#bfdbfe">SKILL.md files, skillsign.yaml manifests,<BR/>.skillsign sidecars, and<BR/>.skillsign-policy.yaml trust policies on disk</FONT></TD></TR></TABLE>>;
    margin = "0.223,0";
    width = 4.445;
    height = 2.5;
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    penwidth = 2;
    shape = "cylinder";
  ];
  "canonicalprocessor" [
    likec4_id = "skillsign.cli.canonicalProcessor";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Canonical Form Processor</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">UTF-8, SHA-256</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Implemented across canonical.py and<BR/>digest.py. canonical.py: 8-step normalization<BR/>(BOM strip, CRLF normalization, trailing<BR/>whitespace trim, single trailing newline,<BR/>UTF-8 encode, null-byte rejection).</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "skillauthor" -> "signingengine" [
    likec4_id = "step-01";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>1</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Runs: skillsign sign ./SKILL.md</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "signingengine" -> "manifestreader" [
    likec4_id = "step-02";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>2</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Reads and validates manifest</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "manifestreader" -> "skillfiles" [
    likec4_id = "step-03";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>3</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Reads skillsign.yaml — OK</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "signingengine" -> "skillfiles" [
    likec4_id = "step-04";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>4</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Checks for existing .skillsign sidecar —<BR/>none found, OK</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "signingengine" -> "canonicalprocessor" [
    likec4_id = "step-05";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>5</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Requests canonical form and digest</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "signingengine" -> "skillfiles" [
    likec4_id = "step-06";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>6</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Reads SKILL.md file bytes</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "skillauthor" -> "signingengine" [
    likec4_id = "step-07";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>7</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Canonical form normalization fails —<BR/>exit code 10</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
}`;case"errorMalformedSidecar":return`digraph {
  likec4_viewId = "errorMalformedSidecar";
  bgcolor = "transparent";
  layout = "dot";
  compound = true;
  rankdir = "LR";
  splines = "spline";
  outputorder = "nodesfirst";
  nodesep = 1.528;
  ranksep = 1.667;
  pad = 0.209;
  fontname = "Arial";
  ordering = "in";
  graph [
    fontsize = 20;
    labeljust = "l";
    labelloc = "t";
  ];
  edge [
    arrowsize = 0.75;
    fontname = "Arial";
    fontsize = 14;
    penwidth = 2;
    color = "#8D8D8D";
    fontcolor = "#C9C9C9";
  ];
  node [
    fontname = "Arial";
    shape = "rect";
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    style = "filled";
    penwidth = 0;
  ];
  "skillconsumer" [
    likec4_id = "skillConsumer";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill Consumer</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#f9b27c">A developer who installs and uses signed<BR/>skills in Claude Code</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#A35829";
    fontcolor = "#FFE0C2";
    color = "#7E451D";
  ];
  "verificationengine" [
    likec4_id = "skillsign.cli.verificationEngine";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Verification Engine</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">ECDSA P-256, X.509</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Orchestrates verification: reads sidecar via<BR/>SidecarManager, recomputes digest, verifies<BR/>ECDSA P-256 signature using certificate<BR/>public key, validates cert chain against<BR/>Fulcio root via TUF TrustedRoot and</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "sidecarmanager" [
    likec4_id = "skillsign.cli.sidecarManager";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Sidecar Manager</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">YAML 1.2</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Implemented as a single sidecar.py module<BR/>combining reader and writer. Writer:<BR/>assembles canonical field-ordered YAML (PEM<BR/>fields as literal block scalars) and writes<BR/>atomically via temp file rename. Reader:</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "skillfiles" [
    likec4_id = "skillsign.skillFiles";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill File Store</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#bfdbfe">Local File System</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#bfdbfe">SKILL.md files, skillsign.yaml manifests,<BR/>.skillsign sidecars, and<BR/>.skillsign-policy.yaml trust policies on disk</FONT></TD></TR></TABLE>>;
    margin = "0.223,0";
    width = 4.445;
    height = 2.5;
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    penwidth = 2;
    shape = "cylinder";
  ];
  "skillconsumer" -> "verificationengine" [
    likec4_id = "step-01";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>1</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Runs: skillsign verify ./SKILL.md</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "verificationengine" -> "sidecarmanager" [
    likec4_id = "step-02";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>2</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Reads and parses sidecar</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "sidecarmanager" -> "skillfiles" [
    likec4_id = "step-03";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>3</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Reads .skillsign sidecar file</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "skillconsumer" -> "verificationengine" [
    likec4_id = "step-04";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>4</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">MALFORMED_SIDECAR — exit code 1</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
}`;case"errorPolicyFail":return`digraph {
  likec4_viewId = "errorPolicyFail";
  bgcolor = "transparent";
  layout = "dot";
  compound = true;
  rankdir = "LR";
  splines = "spline";
  outputorder = "nodesfirst";
  nodesep = 1.528;
  ranksep = 1.667;
  pad = 0.209;
  fontname = "Arial";
  ordering = "in";
  graph [
    fontsize = 20;
    labeljust = "l";
    labelloc = "t";
  ];
  edge [
    arrowsize = 0.75;
    fontname = "Arial";
    fontsize = 14;
    penwidth = 2;
    color = "#8D8D8D";
    fontcolor = "#C9C9C9";
  ];
  node [
    fontname = "Arial";
    shape = "rect";
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    style = "filled";
    penwidth = 0;
  ];
  "skillconsumer" [
    likec4_id = "skillConsumer";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill Consumer</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#f9b27c">A developer who installs and uses signed<BR/>skills in Claude Code</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#A35829";
    fontcolor = "#FFE0C2";
    color = "#7E451D";
  ];
  "verificationengine" [
    likec4_id = "skillsign.cli.verificationEngine";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Verification Engine</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">ECDSA P-256, X.509</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Orchestrates verification: reads sidecar via<BR/>SidecarManager, recomputes digest, verifies<BR/>ECDSA P-256 signature using certificate<BR/>public key, validates cert chain against<BR/>Fulcio root via TUF TrustedRoot and</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "policyengine" [
    likec4_id = "skillsign.cli.policyEngine";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Policy Engine</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">YAML 1.2</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">[Phase 2, not yet implemented] Evaluates<BR/>trust policies with first-match-wins rule<BR/>evaluation, signer_org matching with<BR/>lowercase normalization, and max_age_days<BR/>enforcement against verified rekor_timestamp</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "skillfiles" [
    likec4_id = "skillsign.skillFiles";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill File Store</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#bfdbfe">Local File System</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#bfdbfe">SKILL.md files, skillsign.yaml manifests,<BR/>.skillsign sidecars, and<BR/>.skillsign-policy.yaml trust policies on disk</FONT></TD></TR></TABLE>>;
    margin = "0.223,0";
    width = 4.445;
    height = 2.5;
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    penwidth = 2;
    shape = "cylinder";
  ];
  "skillconsumer" -> "verificationengine" [
    likec4_id = "step-01";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>1</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Runs: skillsign verify --policy<BR/>.skillsign-policy.yaml ./SKILL.md</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "verificationengine" -> "policyengine" [
    likec4_id = "step-02";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>2</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Passes verified signer identity,<BR/>rekor_timestamp, and skill_id [Phase 2]</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "policyengine" -> "skillfiles" [
    likec4_id = "step-03";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>3</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Reads .skillsign-policy.yaml trust<BR/>policy [Phase 2]</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "verificationengine" -> "policyengine" [
    likec4_id = "step-04";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>4</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Returns deny result</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
  "skillconsumer" -> "verificationengine" [
    likec4_id = "step-05";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>5</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">POLICY_FAIL — exit code 3</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
}`;case"errorSidecarExists":return`digraph {
  likec4_viewId = "errorSidecarExists";
  bgcolor = "transparent";
  layout = "dot";
  compound = true;
  rankdir = "LR";
  splines = "spline";
  outputorder = "nodesfirst";
  nodesep = 1.528;
  ranksep = 1.667;
  pad = 0.209;
  fontname = "Arial";
  ordering = "in";
  graph [
    fontsize = 20;
    labeljust = "l";
    labelloc = "t";
  ];
  edge [
    arrowsize = 0.75;
    fontname = "Arial";
    fontsize = 14;
    penwidth = 2;
    color = "#8D8D8D";
    fontcolor = "#C9C9C9";
  ];
  node [
    fontname = "Arial";
    shape = "rect";
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    style = "filled";
    penwidth = 0;
  ];
  "skillauthor" [
    likec4_id = "skillAuthor";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill Author</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#f9b27c">A developer who creates and signs SKILL.md<BR/>files for distribution</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#A35829";
    fontcolor = "#FFE0C2";
    color = "#7E451D";
  ];
  "signingengine" [
    likec4_id = "skillsign.cli.signingEngine";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Signing Engine</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">ECDSA P-256, X.509</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Orchestrates the signing protocol via<BR/>Sigstore SDK: reads manifest, canonicalizes<BR/>SKILL.md, computes digest, obtains OIDC<BR/>identity token, invokes<BR/>SigningContext.signer() which generates</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "manifestreader" [
    likec4_id = "skillsign.cli.manifestReader";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Manifest Reader</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">YAML 1.2</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Reads skillsign.yaml to extract skill_id and<BR/>skill_version at signing time, with same<BR/>strict YAML parsing restrictions as the<BR/>sidecar (Section 7.3)</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "skillfiles" [
    likec4_id = "skillsign.skillFiles";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill File Store</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#bfdbfe">Local File System</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#bfdbfe">SKILL.md files, skillsign.yaml manifests,<BR/>.skillsign sidecars, and<BR/>.skillsign-policy.yaml trust policies on disk</FONT></TD></TR></TABLE>>;
    margin = "0.223,0";
    width = 4.445;
    height = 2.5;
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    penwidth = 2;
    shape = "cylinder";
  ];
  "skillauthor" -> "signingengine" [
    likec4_id = "step-01";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>1</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Runs: skillsign sign ./SKILL.md</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "signingengine" -> "manifestreader" [
    likec4_id = "step-02";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>2</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Reads and validates manifest</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "manifestreader" -> "skillfiles" [
    likec4_id = "step-03";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>3</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Reads skillsign.yaml — OK</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "signingengine" -> "skillfiles" [
    likec4_id = "step-04";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>4</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Checks for existing sidecar (step 3)</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "skillauthor" -> "signingengine" [
    likec4_id = "step-05";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>5</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Sidecar already exists — exit code 10</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
}`;case"errorSigningInfra":return`digraph {
  likec4_viewId = "errorSigningInfra";
  bgcolor = "transparent";
  layout = "dot";
  compound = true;
  rankdir = "LR";
  splines = "spline";
  outputorder = "nodesfirst";
  nodesep = 1.528;
  ranksep = 1.667;
  pad = 0.209;
  fontname = "Arial";
  ordering = "in";
  graph [
    fontsize = 20;
    labeljust = "l";
    labelloc = "t";
  ];
  edge [
    arrowsize = 0.75;
    fontname = "Arial";
    fontsize = 14;
    penwidth = 2;
    color = "#8D8D8D";
    fontcolor = "#C9C9C9";
  ];
  node [
    fontname = "Arial";
    shape = "rect";
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    style = "filled";
    penwidth = 0;
  ];
  "skillauthor" [
    likec4_id = "skillAuthor";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill Author</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#f9b27c">A developer who creates and signs SKILL.md<BR/>files for distribution</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#A35829";
    fontcolor = "#FFE0C2";
    color = "#7E451D";
  ];
  "signingengine" [
    likec4_id = "skillsign.cli.signingEngine";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Signing Engine</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">ECDSA P-256, X.509</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Orchestrates the signing protocol via<BR/>Sigstore SDK: reads manifest, canonicalizes<BR/>SKILL.md, computes digest, obtains OIDC<BR/>identity token, invokes<BR/>SigningContext.signer() which generates</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "authhandler" [
    likec4_id = "skillsign.cli.authHandler";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Auth Handler</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">OIDC</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Obtains OIDC identity token for signing.<BR/>Detects ambient CI credentials first (GitHub<BR/>Actions OIDC via<BR/>detect_credential("sigstore") with client ID<BR/>_SIGSTORE_CLIENT_ID="sigstore"). Falls back</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "fulcio" [
    likec4_id = "fulcio";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Fulcio CA</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">Sigstore certificate authority that issues<BR/>short-lived certificates binding a verified<BR/>GitHub identity to a signer-generated<BR/>ephemeral public key</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748b";
    fontcolor = "#f8fafc";
    color = "#475569";
  ];
  "rekor" [
    likec4_id = "rekor";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Rekor Transparency Log</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">Append-only, publicly auditable log recording<BR/>signatures, certificates, and digests</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748b";
    fontcolor = "#f8fafc";
    color = "#475569";
  ];
  "skillauthor" -> "signingengine" [
    likec4_id = "step-01";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>1</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Manifest and canonical form valid,<BR/>begins signing</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "signingengine" -> "authhandler" [
    likec4_id = "step-02";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>2</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Requests OIDC authentication</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "authhandler" -> "authhandler" [
    likec4_id = "step-03";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>3</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">OIDC authentication fails — exit code 10</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "signingengine" -> "fulcio" [
    likec4_id = "step-04";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>4</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Certificate issuance fails — exit code<BR/>10</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "signingengine" -> "signingengine" [
    likec4_id = "step-05";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>5</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Local ECDSA signing fails — exit code 10</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "signingengine" -> "rekor" [
    likec4_id = "step-06";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>6</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Rekor submission fails — exit code 10</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "skillauthor" -> "signingengine" [
    likec4_id = "step-07";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>7</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Signing infrastructure failure — exit<BR/>code 10</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
}`;case"errorSkillIdMismatch":return`digraph {
  likec4_viewId = "errorSkillIdMismatch";
  bgcolor = "transparent";
  layout = "dot";
  compound = true;
  rankdir = "LR";
  splines = "spline";
  outputorder = "nodesfirst";
  nodesep = 1.528;
  ranksep = 1.667;
  pad = 0.209;
  fontname = "Arial";
  ordering = "in";
  graph [
    fontsize = 20;
    labeljust = "l";
    labelloc = "t";
  ];
  edge [
    arrowsize = 0.75;
    fontname = "Arial";
    fontsize = 14;
    penwidth = 2;
    color = "#8D8D8D";
    fontcolor = "#C9C9C9";
  ];
  node [
    fontname = "Arial";
    shape = "rect";
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    style = "filled";
    penwidth = 0;
  ];
  "skillconsumer" [
    likec4_id = "skillConsumer";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill Consumer</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#f9b27c">A developer who installs and uses signed<BR/>skills in Claude Code</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#A35829";
    fontcolor = "#FFE0C2";
    color = "#7E451D";
  ];
  "verificationengine" [
    likec4_id = "skillsign.cli.verificationEngine";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Verification Engine</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">ECDSA P-256, X.509</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Orchestrates verification: reads sidecar via<BR/>SidecarManager, recomputes digest, verifies<BR/>ECDSA P-256 signature using certificate<BR/>public key, validates cert chain against<BR/>Fulcio root via TUF TrustedRoot and</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "skillconsumer" -> "verificationengine" [
    likec4_id = "step-01";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>1</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Runs: skillsign verify ./SKILL.md — all<BR/>crypto checks pass</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "verificationengine" -> "verificationengine" [
    likec4_id = "step-02";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>2</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Owner-path consistency check fails</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "skillconsumer" -> "verificationengine" [
    likec4_id = "step-03";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>3</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">SKILL_ID_MISMATCH — exit code 1</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
}`;case"errorTampered":return`digraph {
  likec4_viewId = "errorTampered";
  bgcolor = "transparent";
  layout = "dot";
  compound = true;
  rankdir = "LR";
  splines = "spline";
  outputorder = "nodesfirst";
  nodesep = 1.528;
  ranksep = 1.667;
  pad = 0.209;
  fontname = "Arial";
  ordering = "in";
  graph [
    fontsize = 20;
    labeljust = "l";
    labelloc = "t";
  ];
  edge [
    arrowsize = 0.75;
    fontname = "Arial";
    fontsize = 14;
    penwidth = 2;
    color = "#8D8D8D";
    fontcolor = "#C9C9C9";
  ];
  node [
    fontname = "Arial";
    shape = "rect";
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    style = "filled";
    penwidth = 0;
  ];
  "skillconsumer" [
    likec4_id = "skillConsumer";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill Consumer</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#f9b27c">A developer who installs and uses signed<BR/>skills in Claude Code</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#A35829";
    fontcolor = "#FFE0C2";
    color = "#7E451D";
  ];
  "verificationengine" [
    likec4_id = "skillsign.cli.verificationEngine";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Verification Engine</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">ECDSA P-256, X.509</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Orchestrates verification: reads sidecar via<BR/>SidecarManager, recomputes digest, verifies<BR/>ECDSA P-256 signature using certificate<BR/>public key, validates cert chain against<BR/>Fulcio root via TUF TrustedRoot and</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "sidecarmanager" [
    likec4_id = "skillsign.cli.sidecarManager";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Sidecar Manager</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">YAML 1.2</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Implemented as a single sidecar.py module<BR/>combining reader and writer. Writer:<BR/>assembles canonical field-ordered YAML (PEM<BR/>fields as literal block scalars) and writes<BR/>atomically via temp file rename. Reader:</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "skillfiles" [
    likec4_id = "skillsign.skillFiles";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill File Store</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#bfdbfe">Local File System</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#bfdbfe">SKILL.md files, skillsign.yaml manifests,<BR/>.skillsign sidecars, and<BR/>.skillsign-policy.yaml trust policies on disk</FONT></TD></TR></TABLE>>;
    margin = "0.223,0";
    width = 4.445;
    height = 2.5;
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    penwidth = 2;
    shape = "cylinder";
  ];
  "canonicalprocessor" [
    likec4_id = "skillsign.cli.canonicalProcessor";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Canonical Form Processor</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">UTF-8, SHA-256</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Implemented across canonical.py and<BR/>digest.py. canonical.py: 8-step normalization<BR/>(BOM strip, CRLF normalization, trailing<BR/>whitespace trim, single trailing newline,<BR/>UTF-8 encode, null-byte rejection).</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "skillconsumer" -> "verificationengine" [
    likec4_id = "step-01";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>1</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Runs: skillsign verify ./SKILL.md</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "verificationengine" -> "sidecarmanager" [
    likec4_id = "step-02";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>2</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Reads and parses sidecar — OK</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "sidecarmanager" -> "skillfiles" [
    likec4_id = "step-03";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>3</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Reads .skillsign sidecar</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "verificationengine" -> "canonicalprocessor" [
    likec4_id = "step-04";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>4</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Recomputes canonical form and digest</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "verificationengine" -> "skillfiles" [
    likec4_id = "step-05";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>5</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Reads SKILL.md file bytes</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "skillconsumer" -> "verificationengine" [
    likec4_id = "step-06";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>6</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">TAMPERED — exit code 1</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
}`;case"errorUnsigned":return`digraph {
  likec4_viewId = "errorUnsigned";
  bgcolor = "transparent";
  layout = "dot";
  compound = true;
  rankdir = "LR";
  splines = "spline";
  outputorder = "nodesfirst";
  nodesep = 1.528;
  ranksep = 1.667;
  pad = 0.209;
  fontname = "Arial";
  ordering = "in";
  graph [
    fontsize = 20;
    labeljust = "l";
    labelloc = "t";
  ];
  edge [
    arrowsize = 0.75;
    fontname = "Arial";
    fontsize = 14;
    penwidth = 2;
    color = "#8D8D8D";
    fontcolor = "#C9C9C9";
  ];
  node [
    fontname = "Arial";
    shape = "rect";
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    style = "filled";
    penwidth = 0;
  ];
  "skillconsumer" [
    likec4_id = "skillConsumer";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill Consumer</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#f9b27c">A developer who installs and uses signed<BR/>skills in Claude Code</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#A35829";
    fontcolor = "#FFE0C2";
    color = "#7E451D";
  ];
  "verificationengine" [
    likec4_id = "skillsign.cli.verificationEngine";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Verification Engine</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">ECDSA P-256, X.509</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Orchestrates verification: reads sidecar via<BR/>SidecarManager, recomputes digest, verifies<BR/>ECDSA P-256 signature using certificate<BR/>public key, validates cert chain against<BR/>Fulcio root via TUF TrustedRoot and</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "sidecarmanager" [
    likec4_id = "skillsign.cli.sidecarManager";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Sidecar Manager</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">YAML 1.2</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Implemented as a single sidecar.py module<BR/>combining reader and writer. Writer:<BR/>assembles canonical field-ordered YAML (PEM<BR/>fields as literal block scalars) and writes<BR/>atomically via temp file rename. Reader:</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "skillfiles" [
    likec4_id = "skillsign.skillFiles";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill File Store</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#bfdbfe">Local File System</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#bfdbfe">SKILL.md files, skillsign.yaml manifests,<BR/>.skillsign sidecars, and<BR/>.skillsign-policy.yaml trust policies on disk</FONT></TD></TR></TABLE>>;
    margin = "0.223,0";
    width = 4.445;
    height = 2.5;
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    penwidth = 2;
    shape = "cylinder";
  ];
  "skillconsumer" -> "verificationengine" [
    likec4_id = "step-01";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>1</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Runs: skillsign verify ./SKILL.md</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "verificationengine" -> "sidecarmanager" [
    likec4_id = "step-02";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>2</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Reads and parses sidecar</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "sidecarmanager" -> "skillfiles" [
    likec4_id = "step-03";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>3</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Looks for SKILL.md.skillsign — file not<BR/>found</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "skillconsumer" -> "verificationengine" [
    likec4_id = "step-04";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>4</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">UNSIGNED — exit code 2</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
}`;case"policyVerificationFlow":return`digraph {
  likec4_viewId = "policyVerificationFlow";
  bgcolor = "transparent";
  layout = "dot";
  compound = true;
  rankdir = "LR";
  splines = "spline";
  outputorder = "nodesfirst";
  nodesep = 1.528;
  ranksep = 1.667;
  pad = 0.209;
  fontname = "Arial";
  ordering = "in";
  graph [
    fontsize = 20;
    labeljust = "l";
    labelloc = "t";
  ];
  edge [
    arrowsize = 0.75;
    fontname = "Arial";
    fontsize = 14;
    penwidth = 2;
    color = "#8D8D8D";
    fontcolor = "#C9C9C9";
  ];
  node [
    fontname = "Arial";
    shape = "rect";
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    style = "filled";
    penwidth = 0;
  ];
  "skillconsumer" [
    likec4_id = "skillConsumer";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill Consumer</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#f9b27c">A developer who installs and uses signed<BR/>skills in Claude Code</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#A35829";
    fontcolor = "#FFE0C2";
    color = "#7E451D";
  ];
  "verificationengine" [
    likec4_id = "skillsign.cli.verificationEngine";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Verification Engine</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">ECDSA P-256, X.509</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Orchestrates verification: reads sidecar via<BR/>SidecarManager, recomputes digest, verifies<BR/>ECDSA P-256 signature using certificate<BR/>public key, validates cert chain against<BR/>Fulcio root via TUF TrustedRoot and</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "rekorclient" [
    likec4_id = "skillsign.cli.rekorClient";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Rekor Client</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">HTTPS, JSON</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Wraps Rekor transparency log queries via<BR/>infra/rekor.py. Fetches log entries by log ID<BR/>using the Rekor search API<BR/>(/api/v1/log/entries/retrieve). Used by<BR/>verification engine in --strict mode to</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "rekor" [
    likec4_id = "rekor";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Rekor Transparency Log</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">Append-only, publicly auditable log recording<BR/>signatures, certificates, and digests</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748b";
    fontcolor = "#f8fafc";
    color = "#475569";
  ];
  "policyengine" [
    likec4_id = "skillsign.cli.policyEngine";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Policy Engine</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">YAML 1.2</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">[Phase 2, not yet implemented] Evaluates<BR/>trust policies with first-match-wins rule<BR/>evaluation, signer_org matching with<BR/>lowercase normalization, and max_age_days<BR/>enforcement against verified rekor_timestamp</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "skillfiles" [
    likec4_id = "skillsign.skillFiles";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill File Store</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#bfdbfe">Local File System</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#bfdbfe">SKILL.md files, skillsign.yaml manifests,<BR/>.skillsign sidecars, and<BR/>.skillsign-policy.yaml trust policies on disk</FONT></TD></TR></TABLE>>;
    margin = "0.223,0";
    width = 4.445;
    height = 2.5;
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    penwidth = 2;
    shape = "cylinder";
  ];
  "skillconsumer" -> "verificationengine" [
    likec4_id = "step-01";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>1</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Runs: skillsign verify --policy<BR/>.skillsign-policy.yaml --strict<BR/>./SKILL.md</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "verificationengine" -> "verificationengine" [
    likec4_id = "step-02";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>2</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Completes full cryptographic<BR/>verification</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "verificationengine" -> "rekorclient" [
    likec4_id = "step-03";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>3</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Delegates live Rekor query for strict<BR/>mode verification</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "rekorclient" -> "rekor" [
    likec4_id = "step-04";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>4</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Queries log entry by rekor_log_id,<BR/>confirms digest match and timestamp<BR/>validity via HTTPS/JSON</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "verificationengine" -> "policyengine" [
    likec4_id = "step-05";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>5</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Passes verified signer identity,<BR/>rekor_timestamp, and skill_id [Phase 2]</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "policyengine" -> "skillfiles" [
    likec4_id = "step-06";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>6</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Reads .skillsign-policy.yaml trust<BR/>policy</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "verificationengine" -> "policyengine" [
    likec4_id = "step-07";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>7</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Returns policy evaluation result</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
  "skillconsumer" -> "verificationengine" [
    likec4_id = "step-08";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>8</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Returns VERIFIED (0), POLICY_FAIL (3),<BR/>or verification failure (1)</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
}`;case"signingFlow":return`digraph {
  likec4_viewId = "signingFlow";
  bgcolor = "transparent";
  layout = "dot";
  compound = true;
  rankdir = "LR";
  splines = "spline";
  outputorder = "nodesfirst";
  nodesep = 1.528;
  ranksep = 1.667;
  pad = 0.209;
  fontname = "Arial";
  ordering = "in";
  graph [
    fontsize = 20;
    labeljust = "l";
    labelloc = "t";
  ];
  edge [
    arrowsize = 0.75;
    fontname = "Arial";
    fontsize = 14;
    penwidth = 2;
    color = "#8D8D8D";
    fontcolor = "#C9C9C9";
  ];
  node [
    fontname = "Arial";
    shape = "rect";
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    style = "filled";
    penwidth = 0;
  ];
  "skillauthor" [
    likec4_id = "skillAuthor";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill Author</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#f9b27c">A developer who creates and signs SKILL.md<BR/>files for distribution</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#A35829";
    fontcolor = "#FFE0C2";
    color = "#7E451D";
  ];
  "signingengine" [
    likec4_id = "skillsign.cli.signingEngine";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Signing Engine</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">ECDSA P-256, X.509</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Orchestrates the signing protocol via<BR/>Sigstore SDK: reads manifest, canonicalizes<BR/>SKILL.md, computes digest, obtains OIDC<BR/>identity token, invokes<BR/>SigningContext.signer() which generates</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "manifestreader" [
    likec4_id = "skillsign.cli.manifestReader";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Manifest Reader</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">YAML 1.2</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Reads skillsign.yaml to extract skill_id and<BR/>skill_version at signing time, with same<BR/>strict YAML parsing restrictions as the<BR/>sidecar (Section 7.3)</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "sidecarmanager" [
    likec4_id = "skillsign.cli.sidecarManager";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Sidecar Manager</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">YAML 1.2</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Implemented as a single sidecar.py module<BR/>combining reader and writer. Writer:<BR/>assembles canonical field-ordered YAML (PEM<BR/>fields as literal block scalars) and writes<BR/>atomically via temp file rename. Reader:</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "skillfiles" [
    likec4_id = "skillsign.skillFiles";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill File Store</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#bfdbfe">Local File System</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#bfdbfe">SKILL.md files, skillsign.yaml manifests,<BR/>.skillsign sidecars, and<BR/>.skillsign-policy.yaml trust policies on disk</FONT></TD></TR></TABLE>>;
    margin = "0.223,0";
    width = 4.445;
    height = 2.5;
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    penwidth = 2;
    shape = "cylinder";
  ];
  "canonicalprocessor" [
    likec4_id = "skillsign.cli.canonicalProcessor";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Canonical Form Processor</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">UTF-8, SHA-256</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Implemented across canonical.py and<BR/>digest.py. canonical.py: 8-step normalization<BR/>(BOM strip, CRLF normalization, trailing<BR/>whitespace trim, single trailing newline,<BR/>UTF-8 encode, null-byte rejection).</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "authhandler" [
    likec4_id = "skillsign.cli.authHandler";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Auth Handler</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">OIDC</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Obtains OIDC identity token for signing.<BR/>Detects ambient CI credentials first (GitHub<BR/>Actions OIDC via<BR/>detect_credential("sigstore") with client ID<BR/>_SIGSTORE_CLIENT_ID="sigstore"). Falls back</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "github" [
    likec4_id = "github";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">GitHub Actions OIDC</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">CI identity provider: GitHub Actions runtime<BR/>issues OIDC tokens encoding the exact repo,<BR/>workflow, and branch. Fulcio verifies these<BR/>tokens and issues certificates with URI SANs<BR/>(e.g.,</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748b";
    fontcolor = "#f8fafc";
    color = "#475569";
  ];
  "sigstoredex" [
    likec4_id = "sigstoreDex";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Sigstore Dex (OAuth)</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">Interactive identity provider:<BR/>Sigstore-hosted Dex instance<BR/>(oauth2.sigstore.dev/auth) that federates to<BR/>Google, GitHub, and Microsoft OAuth. Fulcio<BR/>verifies the Dex-issued token and issues</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748b";
    fontcolor = "#f8fafc";
    color = "#475569";
  ];
  "fulcio" [
    likec4_id = "fulcio";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Fulcio CA</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">Sigstore certificate authority that issues<BR/>short-lived certificates binding a verified<BR/>GitHub identity to a signer-generated<BR/>ephemeral public key</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748b";
    fontcolor = "#f8fafc";
    color = "#475569";
  ];
  "rekor" [
    likec4_id = "rekor";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Rekor Transparency Log</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">Append-only, publicly auditable log recording<BR/>signatures, certificates, and digests</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748b";
    fontcolor = "#f8fafc";
    color = "#475569";
  ];
  "skillauthor" -> "signingengine" [
    likec4_id = "step-01";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>1</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Runs: skillsign sign ./SKILL.md</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "signingengine" -> "manifestreader" [
    likec4_id = "step-02";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>2</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Reads and validates manifest</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "manifestreader" -> "skillfiles" [
    likec4_id = "step-03";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>3</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Reads skillsign.yaml manifest</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "signingengine" -> "skillfiles" [
    likec4_id = "step-04";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>4</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Checks for existing sidecar (step 3)</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "signingengine" -> "canonicalprocessor" [
    likec4_id = "step-05";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>5</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Requests canonical form and digest<BR/>(steps 4-5)</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "signingengine" -> "skillfiles" [
    likec4_id = "step-06";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>6</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Reads SKILL.md file bytes (step 4)</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "signingengine" -> "authhandler" [
    likec4_id = "step-07";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>7</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Requests OIDC authentication (step 6)</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "authhandler" -> "authhandler" [
    likec4_id = "step-08";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>8</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Detects authentication mode</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "authhandler" -> "github" [
    likec4_id = "step-09";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>9</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">CI path: ambient OIDC token from GitHub<BR/>Actions</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "authhandler" -> "sigstoredex" [
    likec4_id = "step-10";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>10</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Interactive path: browser-based OAuth<BR/>via Sigstore Dex</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "signingengine" -> "fulcio" [
    likec4_id = "step-11";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>11</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Submits OIDC token and ephemeral public<BR/>key via Sigstore SDK (steps 7-8)</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "signingengine" -> "signingengine" [
    likec4_id = "step-12";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>12</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Signs digest with ephemeral ECDSA P-256<BR/>key (step 8, inside SDK)</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "signingengine" -> "rekor" [
    likec4_id = "step-13";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>13</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Submits signature, certificate, and<BR/>digest as hashedrekord/v0.0.1 entry via<BR/>Sigstore SDK (step 9)</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "signingengine" -> "signingengine" [
    likec4_id = "step-14";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>14</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Assembles sidecar dict from Sigstore<BR/>Bundle fields (step 10)</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "sidecarmanager" -> "skillfiles" [
    likec4_id = "step-15";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>15</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Writes SKILL.md.skillsign sidecar<BR/>atomically via temp file rename (step<BR/>11)</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "skillauthor" -> "signingengine" [
    likec4_id = "step-16";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>16</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Signing complete — exit code 0</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
}`;case"verificationFlow":return`digraph {
  likec4_viewId = "verificationFlow";
  bgcolor = "transparent";
  layout = "dot";
  compound = true;
  rankdir = "LR";
  splines = "spline";
  outputorder = "nodesfirst";
  nodesep = 1.528;
  ranksep = 1.667;
  pad = 0.209;
  fontname = "Arial";
  ordering = "in";
  graph [
    fontsize = 20;
    labeljust = "l";
    labelloc = "t";
  ];
  edge [
    arrowsize = 0.75;
    fontname = "Arial";
    fontsize = 14;
    penwidth = 2;
    color = "#8D8D8D";
    fontcolor = "#C9C9C9";
  ];
  node [
    fontname = "Arial";
    shape = "rect";
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    style = "filled";
    penwidth = 0;
  ];
  "skillconsumer" [
    likec4_id = "skillConsumer";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill Consumer</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#f9b27c">A developer who installs and uses signed<BR/>skills in Claude Code</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#A35829";
    fontcolor = "#FFE0C2";
    color = "#7E451D";
  ];
  "verificationengine" [
    likec4_id = "skillsign.cli.verificationEngine";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Verification Engine</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">ECDSA P-256, X.509</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Orchestrates verification: reads sidecar via<BR/>SidecarManager, recomputes digest, verifies<BR/>ECDSA P-256 signature using certificate<BR/>public key, validates cert chain against<BR/>Fulcio root via TUF TrustedRoot and</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "sidecarmanager" [
    likec4_id = "skillsign.cli.sidecarManager";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Sidecar Manager</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">YAML 1.2</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Implemented as a single sidecar.py module<BR/>combining reader and writer. Writer:<BR/>assembles canonical field-ordered YAML (PEM<BR/>fields as literal block scalars) and writes<BR/>atomically via temp file rename. Reader:</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "skillfiles" [
    likec4_id = "skillsign.skillFiles";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Skill File Store</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#bfdbfe">Local File System</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#bfdbfe">SKILL.md files, skillsign.yaml manifests,<BR/>.skillsign sidecars, and<BR/>.skillsign-policy.yaml trust policies on disk</FONT></TD></TR></TABLE>>;
    margin = "0.223,0";
    width = 4.445;
    height = 2.5;
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    penwidth = 2;
    shape = "cylinder";
  ];
  "canonicalprocessor" [
    likec4_id = "skillsign.cli.canonicalProcessor";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Canonical Form Processor</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">UTF-8, SHA-256</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Implemented across canonical.py and<BR/>digest.py. canonical.py: 8-step normalization<BR/>(BOM strip, CRLF normalization, trailing<BR/>whitespace trim, single trailing newline,<BR/>UTF-8 encode, null-byte rejection).</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "tufclient" [
    likec4_id = "skillsign.cli.tufClient";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">TUF Client</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">TUF, HTTPS</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Wraps Sigstore SDK TrustedRoot via<BR/>infra/tuf.py. Fetches production TUF root<BR/>metadata including Fulcio root certificates<BR/>and Rekor public key. Falls back to cached<BR/>metadata when offline. Used by verification</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "tuf" [
    likec4_id = "tuf";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">TUF Root</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">The Update Framework root of trust<BR/>distributing Sigstore public keys</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748b";
    fontcolor = "#f8fafc";
    color = "#475569";
  ];
  "tufcache" [
    likec4_id = "skillsign.tufCache";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">TUF Root Cache</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#bfdbfe">Local File System</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#bfdbfe">Local cache of bundled and fetched Sigstore<BR/>TUF root metadata and Fulcio root<BR/>certificates</FONT></TD></TR></TABLE>>;
    margin = "0.223,0";
    width = 4.445;
    height = 2.5;
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    penwidth = 2;
    shape = "cylinder";
  ];
  "skillconsumer" -> "verificationengine" [
    likec4_id = "step-01";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>1</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Runs: skillsign verify ./SKILL.md</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "verificationengine" -> "sidecarmanager" [
    likec4_id = "step-02";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>2</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Reads and parses sidecar (steps 1-2)</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "sidecarmanager" -> "skillfiles" [
    likec4_id = "step-03";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>3</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Reads .skillsign sidecar with strict<BR/>YAML 1.2 parsing</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "verificationengine" -> "canonicalprocessor" [
    likec4_id = "step-04";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>4</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Recomputes canonical form and digest<BR/>(steps 3-5)</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "verificationengine" -> "skillfiles" [
    likec4_id = "step-05";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>5</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Reads SKILL.md file bytes</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "verificationengine" -> "verificationengine" [
    likec4_id = "step-06";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>6</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Cryptographic verification (steps 6-8)</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "verificationengine" -> "tufclient" [
    likec4_id = "step-07";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>7</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Requests trusted Fulcio root<BR/>certificates and Rekor public key (step<BR/>7)</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "tufclient" -> "tuf" [
    likec4_id = "step-08.1";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>8.1</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Fetches current TUF root metadata</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "tufclient" -> "tufcache" [
    likec4_id = "step-08.2";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>8.2</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Reads/writes cached TUF metadata</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "verificationengine" -> "verificationengine" [
    likec4_id = "step-09";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>9</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Temporal binding and SET verification<BR/>(step 9)</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "verificationengine" -> "verificationengine" [
    likec4_id = "step-10";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>10</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">SKILL_ID_MISMATCH owner-path check (step<BR/>11)</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "skillconsumer" -> "verificationengine" [
    likec4_id = "step-11";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>11</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Returns VERIFIED (exit 0) or failure<BR/>with specific exit code</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
}`;default:throw new Error("Unknown viewId: "+e)}}function n(e){switch(e){case"cliComponents":return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 14.0.4 (0)
 -->
<!-- Pages: 1 -->
<svg width="4424pt" height="1272pt"
 viewBox="0.00 0.00 4424.00 1272.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 1256.65)">
<g id="clust1" class="cluster">
<title>cluster_cli</title>
<polygon fill="#194b9e" stroke="#1b3d88" points="720.54,-316.4 720.54,-954 3830.54,-954 3830.54,-316.4 720.54,-316.4"/>
<text xml:space="preserve" text-anchor="start" x="728.54" y="-941.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#bfdbfe" fill-opacity="0.701961">SKILLSIGN CLI</text>
</g>
<!-- signingengine -->
<g id="node1" class="node">
<title>signingengine</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1892.16,-892.8 1556.91,-892.8 1556.91,-712.8 1892.16,-712.8 1892.16,-892.8"/>
<text xml:space="preserve" text-anchor="start" x="1657.26" y="-853.6" font-family="Arial" font-size="20.00" fill="#eef2ff">Signing Engine</text>
<text xml:space="preserve" text-anchor="start" x="1662.39" y="-831.9" font-family="Arial" font-size="13.00" fill="#c7d2fe">ECDSA P&#45;256, X.509</text>
<text xml:space="preserve" text-anchor="start" x="1602.81" y="-810.5" font-family="Arial" font-size="15.00" fill="#c7d2fe">Orchestrates the signing protocol via</text>
<text xml:space="preserve" text-anchor="start" x="1576.97" y="-792.5" font-family="Arial" font-size="15.00" fill="#c7d2fe">Sigstore SDK: reads manifest, canonicalizes</text>
<text xml:space="preserve" text-anchor="start" x="1583.64" y="-774.5" font-family="Arial" font-size="15.00" fill="#c7d2fe">SKILL.md, computes digest, obtains OIDC</text>
<text xml:space="preserve" text-anchor="start" x="1650.74" y="-756.5" font-family="Arial" font-size="15.00" fill="#c7d2fe">identity token, invokes</text>
<text xml:space="preserve" text-anchor="start" x="1589.46" y="-738.5" font-family="Arial" font-size="15.00" fill="#c7d2fe">SigningContext.signer() which generates</text>
</g>
<!-- verificationengine -->
<g id="node2" class="node">
<title>verificationengine</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="2439.99,-892.8 2103.08,-892.8 2103.08,-712.8 2439.99,-712.8 2439.99,-892.8"/>
<text xml:space="preserve" text-anchor="start" x="2188.15" y="-853.6" font-family="Arial" font-size="20.00" fill="#eef2ff">Verification Engine</text>
<text xml:space="preserve" text-anchor="start" x="2209.39" y="-831.9" font-family="Arial" font-size="13.00" fill="#c7d2fe">ECDSA P&#45;256, X.509</text>
<text xml:space="preserve" text-anchor="start" x="2129.81" y="-810.5" font-family="Arial" font-size="15.00" fill="#c7d2fe">Orchestrates verification: reads sidecar via</text>
<text xml:space="preserve" text-anchor="start" x="2123.13" y="-792.5" font-family="Arial" font-size="15.00" fill="#c7d2fe">SidecarManager, recomputes digest, verifies</text>
<text xml:space="preserve" text-anchor="start" x="2136.47" y="-774.5" font-family="Arial" font-size="15.00" fill="#c7d2fe">ECDSA P&#45;256 signature using certificate</text>
<text xml:space="preserve" text-anchor="start" x="2143.55" y="-756.5" font-family="Arial" font-size="15.00" fill="#c7d2fe">public key, validates cert chain against</text>
<text xml:space="preserve" text-anchor="start" x="2150.24" y="-738.5" font-family="Arial" font-size="15.00" fill="#c7d2fe">Fulcio root via TUF TrustedRoot and</text>
</g>
<!-- authhandler -->
<g id="node3" class="node">
<title>authhandler</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="3354.42,-536.4 2990.65,-536.4 2990.65,-356.4 3354.42,-356.4 3354.42,-536.4"/>
<text xml:space="preserve" text-anchor="start" x="3114.17" y="-497.2" font-family="Arial" font-size="20.00" fill="#eef2ff">Auth Handler</text>
<text xml:space="preserve" text-anchor="start" x="3156.29" y="-475.5" font-family="Arial" font-size="13.00" fill="#c7d2fe">OIDC</text>
<text xml:space="preserve" text-anchor="start" x="3040.81" y="-454.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">Obtains OIDC identity token for signing.</text>
<text xml:space="preserve" text-anchor="start" x="3028.32" y="-436.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">Detects ambient CI credentials first (GitHub</text>
<text xml:space="preserve" text-anchor="start" x="3115.44" y="-418.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">Actions OIDC via</text>
<text xml:space="preserve" text-anchor="start" x="3034.24" y="-400.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">detect_credential(&quot;sigstore&quot;) with client ID</text>
<text xml:space="preserve" text-anchor="start" x="3010.7" y="-382.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">_SIGSTORE_CLIENT_ID=&quot;sigstore&quot;). Falls back</text>
</g>
<!-- manifestreader -->
<g id="node4" class="node">
<title>manifestreader</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1080.65,-536.4 760.42,-536.4 760.42,-356.4 1080.65,-356.4 1080.65,-536.4"/>
<text xml:space="preserve" text-anchor="start" x="847.17" y="-488.2" font-family="Arial" font-size="20.00" fill="#eef2ff">Manifest Reader</text>
<text xml:space="preserve" text-anchor="start" x="891.99" y="-466.5" font-family="Arial" font-size="13.00" fill="#c7d2fe">YAML 1.2</text>
<text xml:space="preserve" text-anchor="start" x="780.48" y="-445.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">Reads skillsign.yaml to extract skill_id and</text>
<text xml:space="preserve" text-anchor="start" x="791.32" y="-427.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">skill_version at signing time, with same</text>
<text xml:space="preserve" text-anchor="start" x="794.66" y="-409.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">strict YAML parsing restrictions as the</text>
<text xml:space="preserve" text-anchor="start" x="851.75" y="-391.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">sidecar (Section 7.3)</text>
</g>
<!-- canonicalprocessor -->
<g id="node5" class="node">
<title>canonicalprocessor</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1980.17,-536.4 1644.9,-536.4 1644.9,-356.4 1980.17,-356.4 1980.17,-536.4"/>
<text xml:space="preserve" text-anchor="start" x="1694.16" y="-497.2" font-family="Arial" font-size="20.00" fill="#eef2ff">Canonical Form Processor</text>
<text xml:space="preserve" text-anchor="start" x="1764.13" y="-475.5" font-family="Arial" font-size="13.00" fill="#c7d2fe">UTF&#45;8, SHA&#45;256</text>
<text xml:space="preserve" text-anchor="start" x="1686.63" y="-454.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">Implemented across canonical.py and</text>
<text xml:space="preserve" text-anchor="start" x="1664.96" y="-436.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">digest.py. canonical.py: 8&#45;step normalization</text>
<text xml:space="preserve" text-anchor="start" x="1680" y="-418.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">(BOM strip, CRLF normalization, trailing</text>
<text xml:space="preserve" text-anchor="start" x="1682.89" y="-400.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">whitespace trim, single trailing newline,</text>
<text xml:space="preserve" text-anchor="start" x="1697.07" y="-382.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">UTF&#45;8 encode, null&#45;byte rejection).</text>
</g>
<!-- policyengine -->
<g id="node6" class="node">
<title>policyengine</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1534.74,-536.4 1190.33,-536.4 1190.33,-356.4 1534.74,-356.4 1534.74,-536.4"/>
<text xml:space="preserve" text-anchor="start" x="1301.94" y="-497.2" font-family="Arial" font-size="20.00" fill="#eef2ff">Policy Engine</text>
<text xml:space="preserve" text-anchor="start" x="1333.99" y="-475.5" font-family="Arial" font-size="13.00" fill="#c7d2fe">YAML 1.2</text>
<text xml:space="preserve" text-anchor="start" x="1224.12" y="-454.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">[Phase 2, not yet implemented] Evaluates</text>
<text xml:space="preserve" text-anchor="start" x="1236.26" y="-436.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">trust policies with first&#45;match&#45;wins rule</text>
<text xml:space="preserve" text-anchor="start" x="1240.8" y="-418.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">evaluation, signer_org matching with</text>
<text xml:space="preserve" text-anchor="start" x="1212.45" y="-400.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">lowercase normalization, and max_age_days</text>
<text xml:space="preserve" text-anchor="start" x="1210.38" y="-382.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">enforcement against verified rekor_timestamp</text>
</g>
<!-- sidecarmanager -->
<g id="node7" class="node">
<title>sidecarmanager</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="2444.74,-536.4 2090.33,-536.4 2090.33,-356.4 2444.74,-356.4 2444.74,-536.4"/>
<text xml:space="preserve" text-anchor="start" x="2191.38" y="-497.2" font-family="Arial" font-size="20.00" fill="#eef2ff">Sidecar Manager</text>
<text xml:space="preserve" text-anchor="start" x="2238.99" y="-475.5" font-family="Arial" font-size="13.00" fill="#c7d2fe">YAML 1.2</text>
<text xml:space="preserve" text-anchor="start" x="2123.29" y="-454.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">Implemented as a single sidecar.py module</text>
<text xml:space="preserve" text-anchor="start" x="2148.33" y="-436.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">combining reader and writer. Writer:</text>
<text xml:space="preserve" text-anchor="start" x="2110.38" y="-418.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">assembles canonical field&#45;ordered YAML (PEM</text>
<text xml:space="preserve" text-anchor="start" x="2135.82" y="-400.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">fields as literal block scalars) and writes</text>
<text xml:space="preserve" text-anchor="start" x="2133.73" y="-382.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">atomically via temp file rename. Reader:</text>
</g>
<!-- tufclient -->
<g id="node8" class="node">
<title>tufclient</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="2880.59,-536.4 2554.49,-536.4 2554.49,-356.4 2880.59,-356.4 2880.59,-536.4"/>
<text xml:space="preserve" text-anchor="start" x="2669.75" y="-497.2" font-family="Arial" font-size="20.00" fill="#eef2ff">TUF Client</text>
<text xml:space="preserve" text-anchor="start" x="2679.98" y="-475.5" font-family="Arial" font-size="13.00" fill="#c7d2fe">TUF, HTTPS</text>
<text xml:space="preserve" text-anchor="start" x="2593.74" y="-454.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">Wraps Sigstore SDK TrustedRoot via</text>
<text xml:space="preserve" text-anchor="start" x="2582.89" y="-436.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">infra/tuf.py. Fetches production TUF root</text>
<text xml:space="preserve" text-anchor="start" x="2579.55" y="-418.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">metadata including Fulcio root certificates</text>
<text xml:space="preserve" text-anchor="start" x="2574.96" y="-400.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">and Rekor public key. Falls back to cached</text>
<text xml:space="preserve" text-anchor="start" x="2574.54" y="-382.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">metadata when offline. Used by verification</text>
</g>
<!-- rekorclient -->
<g id="node9" class="node">
<title>rekorclient</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="3790.57,-536.4 3464.5,-536.4 3464.5,-356.4 3790.57,-356.4 3790.57,-536.4"/>
<text xml:space="preserve" text-anchor="start" x="3572.52" y="-497.2" font-family="Arial" font-size="20.00" fill="#eef2ff">Rekor Client</text>
<text xml:space="preserve" text-anchor="start" x="3585.28" y="-475.5" font-family="Arial" font-size="13.00" fill="#c7d2fe">HTTPS, JSON</text>
<text xml:space="preserve" text-anchor="start" x="3487.89" y="-454.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">Wraps Rekor transparency log queries via</text>
<text xml:space="preserve" text-anchor="start" x="3484.56" y="-436.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">infra/rekor.py. Fetches log entries by log ID</text>
<text xml:space="preserve" text-anchor="start" x="3536.24" y="-418.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">using the Rekor search API</text>
<text xml:space="preserve" text-anchor="start" x="3504.98" y="-400.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">(/api/v1/log/entries/retrieve). Used by</text>
<text xml:space="preserve" text-anchor="start" x="3507.07" y="-382.1" font-family="Arial" font-size="15.00" fill="#c7d2fe">verification engine in &#45;&#45;strict mode to</text>
</g>
<!-- skillauthor -->
<g id="node10" class="node">
<title>skillauthor</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="1896.35,-1241.6 1552.73,-1241.6 1552.73,-1061.6 1896.35,-1061.6 1896.35,-1241.6"/>
<text xml:space="preserve" text-anchor="start" x="1673.96" y="-1165.6" font-family="Arial" font-size="20.00" fill="#ffe0c2">Skill Author</text>
<text xml:space="preserve" text-anchor="start" x="1572.78" y="-1142.1" font-family="Arial" font-size="15.00" fill="#f9b27c">A developer who creates and signs SKILL.md</text>
<text xml:space="preserve" text-anchor="start" x="1662.01" y="-1124.1" font-family="Arial" font-size="15.00" fill="#f9b27c">files for distribution</text>
</g>
<!-- skillconsumer -->
<g id="node11" class="node">
<title>skillconsumer</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="2378.56,-1241.6 2058.52,-1241.6 2058.52,-1061.6 2378.56,-1061.6 2378.56,-1241.6"/>
<text xml:space="preserve" text-anchor="start" x="2151.29" y="-1165.6" font-family="Arial" font-size="20.00" fill="#ffe0c2">Skill Consumer</text>
<text xml:space="preserve" text-anchor="start" x="2080.95" y="-1142.1" font-family="Arial" font-size="15.00" fill="#f9b27c">A developer who installs and uses signed</text>
<text xml:space="preserve" text-anchor="start" x="2148.5" y="-1124.1" font-family="Arial" font-size="15.00" fill="#f9b27c">skills in Claude Code</text>
</g>
<!-- claudecode -->
<g id="node12" class="node">
<title>claudecode</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="2808.56,-1241.6 2488.52,-1241.6 2488.52,-1061.6 2808.56,-1061.6 2808.56,-1241.6"/>
<text xml:space="preserve" text-anchor="start" x="2590.16" y="-1165.6" font-family="Arial" font-size="20.00" fill="#f8fafc">Claude Code</text>
<text xml:space="preserve" text-anchor="start" x="2521.79" y="-1142.1" font-family="Arial" font-size="15.00" fill="#cbd5e1">Anthropic CLI that loads and executes</text>
<text xml:space="preserve" text-anchor="start" x="2550.16" y="-1124.1" font-family="Arial" font-size="15.00" fill="#cbd5e1">SKILL.md files as instructions</text>
</g>
<!-- fulcio -->
<g id="node13" class="node">
<title>fulcio</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="650.56,-536.4 330.52,-536.4 330.52,-356.4 650.56,-356.4 650.56,-536.4"/>
<text xml:space="preserve" text-anchor="start" x="447.19" y="-478.4" font-family="Arial" font-size="20.00" fill="#f8fafc">Fulcio CA</text>
<text xml:space="preserve" text-anchor="start" x="360.06" y="-454.9" font-family="Arial" font-size="15.00" fill="#cbd5e1">Sigstore certificate authority that issues</text>
<text xml:space="preserve" text-anchor="start" x="359.22" y="-436.9" font-family="Arial" font-size="15.00" fill="#cbd5e1">short&#45;lived certificates binding a verified</text>
<text xml:space="preserve" text-anchor="start" x="367.96" y="-418.9" font-family="Arial" font-size="15.00" fill="#cbd5e1">GitHub identity to a signer&#45;generated</text>
<text xml:space="preserve" text-anchor="start" x="419.66" y="-400.9" font-family="Arial" font-size="15.00" fill="#cbd5e1">ephemeral public key</text>
</g>
<!-- skillfiles -->
<g id="node14" class="node">
<title>skillfiles</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M1080.56,-163.64C1080.56,-172.67 1008.83,-180 920.54,-180 832.24,-180 760.52,-172.67 760.52,-163.64 760.52,-163.64 760.52,-16.36 760.52,-16.36 760.52,-7.33 832.24,0 920.54,0 1008.83,0 1080.56,-7.33 1080.56,-16.36 1080.56,-16.36 1080.56,-163.64 1080.56,-163.64"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M1080.56,-163.64C1080.56,-154.61 1008.83,-147.27 920.54,-147.27 832.24,-147.27 760.52,-154.61 760.52,-163.64"/>
<text xml:space="preserve" text-anchor="start" x="856.63" y="-122.8" font-family="Arial" font-size="20.00" fill="#eff6ff">Skill File Store</text>
<text xml:space="preserve" text-anchor="start" x="869.24" y="-101.1" font-family="Arial" font-size="13.00" fill="#bfdbfe">Local File System</text>
<text xml:space="preserve" text-anchor="start" x="787.58" y="-79.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">SKILL.md files, skillsign.yaml manifests,</text>
<text xml:space="preserve" text-anchor="start" x="845.5" y="-61.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">.skillsign sidecars, and</text>
<text xml:space="preserve" text-anchor="start" x="782.99" y="-43.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">.skillsign&#45;policy.yaml trust policies on disk</text>
</g>
<!-- rekor -->
<g id="node15" class="node">
<title>rekor</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="4308.86,-180 3970.22,-180 3970.22,0 4308.86,0 4308.86,-180"/>
<text xml:space="preserve" text-anchor="start" x="4029.48" y="-104" font-family="Arial" font-size="20.00" fill="#f8fafc">Rekor Transparency Log</text>
<text xml:space="preserve" text-anchor="start" x="3990.27" y="-80.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">Append&#45;only, publicly auditable log recording</text>
<text xml:space="preserve" text-anchor="start" x="4022.39" y="-62.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">signatures, certificates, and digests</text>
</g>
<!-- github -->
<g id="node16" class="node">
<title>github</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="3337.09,-180 2995.98,-180 2995.98,0 3337.09,0 3337.09,-180"/>
<text xml:space="preserve" text-anchor="start" x="3072.06" y="-131" font-family="Arial" font-size="20.00" fill="#f8fafc">GitHub Actions OIDC</text>
<text xml:space="preserve" text-anchor="start" x="3022.73" y="-107.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">CI identity provider: GitHub Actions runtime</text>
<text xml:space="preserve" text-anchor="start" x="3016.04" y="-89.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">issues OIDC tokens encoding the exact repo,</text>
<text xml:space="preserve" text-anchor="start" x="3025.22" y="-71.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">workflow, and branch. Fulcio verifies these</text>
<text xml:space="preserve" text-anchor="start" x="3016.89" y="-53.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">tokens and issues certificates with URI SANs</text>
<text xml:space="preserve" text-anchor="start" x="3149.44" y="-35.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">(e.g.,</text>
</g>
<!-- sigstoredex -->
<g id="node17" class="node">
<title>sigstoredex</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="3783.99,-180 3447.08,-180 3447.08,0 3783.99,0 3783.99,-180"/>
<text xml:space="preserve" text-anchor="start" x="3520.5" y="-131" font-family="Arial" font-size="20.00" fill="#f8fafc">Sigstore Dex (OAuth)</text>
<text xml:space="preserve" text-anchor="start" x="3523.83" y="-107.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">Interactive identity provider:</text>
<text xml:space="preserve" text-anchor="start" x="3517.57" y="-89.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">Sigstore&#45;hosted Dex instance</text>
<text xml:space="preserve" text-anchor="start" x="3472.11" y="-71.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">(oauth2.sigstore.dev/auth) that federates to</text>
<text xml:space="preserve" text-anchor="start" x="3467.14" y="-53.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">Google, GitHub, and Microsoft OAuth. Fulcio</text>
<text xml:space="preserve" text-anchor="start" x="3481.3" y="-35.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">verifies the Dex&#45;issued token and issues</text>
</g>
<!-- tuf -->
<g id="node18" class="node">
<title>tuf</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="2439.56,-180 2119.52,-180 2119.52,0 2439.56,0 2439.56,-180"/>
<text xml:space="preserve" text-anchor="start" x="2236.2" y="-104" font-family="Arial" font-size="20.00" fill="#f8fafc">TUF Root</text>
<text xml:space="preserve" text-anchor="start" x="2160.74" y="-80.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">The Update Framework root of trust</text>
<text xml:space="preserve" text-anchor="start" x="2174.48" y="-62.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">distributing Sigstore public keys</text>
</g>
<!-- tufcache -->
<g id="node19" class="node">
<title>tufcache</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M2885.61,-163.64C2885.61,-172.67 2810.28,-180 2717.54,-180 2624.79,-180 2549.46,-172.67 2549.46,-163.64 2549.46,-163.64 2549.46,-16.36 2549.46,-16.36 2549.46,-7.33 2624.79,0 2717.54,0 2810.28,0 2885.61,-7.33 2885.61,-16.36 2885.61,-16.36 2885.61,-163.64 2885.61,-163.64"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M2885.61,-163.64C2885.61,-154.61 2810.28,-147.27 2717.54,-147.27 2624.79,-147.27 2549.46,-154.61 2549.46,-163.64"/>
<text xml:space="preserve" text-anchor="start" x="2642.51" y="-122.8" font-family="Arial" font-size="20.00" fill="#eff6ff">TUF Root Cache</text>
<text xml:space="preserve" text-anchor="start" x="2666.24" y="-101.1" font-family="Arial" font-size="13.00" fill="#bfdbfe">Local File System</text>
<text xml:space="preserve" text-anchor="start" x="2569.51" y="-79.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">Local cache of bundled and fetched Sigstore</text>
<text xml:space="preserve" text-anchor="start" x="2602.9" y="-61.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">TUF root metadata and Fulcio root</text>
<text xml:space="preserve" text-anchor="start" x="2681.69" y="-43.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">certificates</text>
</g>
<!-- signingengine&#45;&gt;authhandler -->
<g id="edge4" class="edge">
<title>signingengine&#45;&gt;authhandler</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1891.77,-749.51C1941.76,-735.61 1996.99,-721.94 2048.54,-712.8 2365.58,-656.58 2460.87,-741.05 2770.54,-652.8 2858.54,-627.72 2949.88,-582.79 3023.22,-541.34"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="3024.22,-543.79 3029.44,-537.8 3021.63,-539.23 3024.22,-543.79"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2909.13,-613.2 2909.13,-636 3101.86,-636 3101.86,-613.2 2909.13,-613.2"/>
<text xml:space="preserve" text-anchor="start" x="2912.13" y="-620.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Gets OIDC identity token from</text>
</g>
<!-- signingengine&#45;&gt;manifestreader -->
<g id="edge5" class="edge">
<title>signingengine&#45;&gt;manifestreader</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1556.95,-786.66C1368.05,-766.39 1076.47,-724.42 993.89,-652.8 962.84,-625.87 944.93,-584.85 934.6,-546.52"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="937.15,-545.88 932.76,-539.26 932.06,-547.18 937.15,-545.88"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="993.89,-613.2 993.89,-636 1225.54,-636 1225.54,-613.2 993.89,-613.2"/>
<text xml:space="preserve" text-anchor="start" x="996.89" y="-620.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads skill_id and skill_version from</text>
</g>
<!-- signingengine&#45;&gt;canonicalprocessor -->
<g id="edge7" class="edge">
<title>signingengine&#45;&gt;canonicalprocessor</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1698.69,-712.87C1692.11,-676.08 1689.91,-633.44 1702.14,-596.4 1708.07,-578.44 1717.09,-560.87 1727.47,-544.46"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1729.45,-546.24 1731.36,-538.53 1725.06,-543.36 1729.45,-546.24"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1702.14,-613.2 1702.14,-636 1871.54,-636 1871.54,-613.2 1702.14,-613.2"/>
<text xml:space="preserve" text-anchor="start" x="1705.14" y="-620.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Gets SHA&#45;256 digest from</text>
</g>
<!-- signingengine&#45;&gt;fulcio -->
<g id="edge6" class="edge">
<title>signingengine&#45;&gt;fulcio</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1557.13,-792.59C1298.65,-775.98 816.51,-734.87 666.64,-652.8 620.29,-627.42 580.67,-584.68 550.81,-544.74"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="552.94,-543.2 546.38,-538.71 548.71,-546.31 552.94,-543.2"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="666.64,-596.4 666.64,-652.8 925.54,-652.8 925.54,-596.4 666.64,-596.4"/>
<text xml:space="preserve" text-anchor="start" x="669.64" y="-637.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Submits ephemeral public key and OIDC</text>
<text xml:space="preserve" text-anchor="start" x="669.64" y="-620.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">token via Sigstore SDK, receives</text>
<text xml:space="preserve" text-anchor="start" x="669.64" y="-603.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">short&#45;lived X.509 certificate</text>
</g>
<!-- signingengine&#45;&gt;skillfiles -->
<g id="edge8" class="edge">
<title>signingengine&#45;&gt;skillfiles</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1557.19,-802.39C1170.17,-799.73 232.09,-768.94 45.45,-536.4 -15.75,-460.15 -14.45,-393.68 45.45,-316.4 130.92,-206.13 520.01,-140.28 749.59,-110.36"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="749.62,-113 756.72,-109.44 748.95,-107.8 749.62,-113"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="45.45,-426.6 45.45,-466.2 275.54,-466.2 275.54,-426.6 45.45,-426.6"/>
<text xml:space="preserve" text-anchor="start" x="48.45" y="-450.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">Checks for existing .skillsign sidecar</text>
<text xml:space="preserve" text-anchor="start" x="48.45" y="-433.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">before signing</text>
</g>
<!-- signingengine&#45;&gt;rekor -->
<g id="edge9" class="edge">
<title>signingengine&#45;&gt;rekor</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1891.94,-747.91C1941.81,-734.01 1996.93,-720.74 2048.54,-712.8 2401.08,-658.53 3310.74,-754.81 3652.54,-652.8 3915.08,-574.44 4034.88,-542.39 4155.54,-296.4 4171.41,-264.03 4172.31,-225.31 4167.55,-190.25"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="4170.17,-190 4166.45,-182.98 4164.98,-190.79 4170.17,-190"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="4143.47,-418.2 4143.47,-474.6 4393.83,-474.6 4393.83,-418.2 4143.47,-418.2"/>
<text xml:space="preserve" text-anchor="start" x="4146.47" y="-459" font-family="Arial" font-size="14.00" fill="#c9c9c9">Submits signature, certificate, and</text>
<text xml:space="preserve" text-anchor="start" x="4146.47" y="-442.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">digest as hashedrekord/v0.0.1 entry via</text>
<text xml:space="preserve" text-anchor="start" x="4146.47" y="-425.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Sigstore SDK</text>
</g>
<!-- verificationengine&#45;&gt;canonicalprocessor -->
<g id="edge10" class="edge">
<title>verificationengine&#45;&gt;canonicalprocessor</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2156.3,-712.83C2089.06,-660.91 2004.25,-595.43 1935.7,-542.49"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1937.35,-540.46 1929.81,-537.95 1934.15,-544.61 1937.35,-540.46"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2069.52,-613.2 2069.52,-636 2217.14,-636 2217.14,-613.2 2069.52,-613.2"/>
<text xml:space="preserve" text-anchor="start" x="2072.52" y="-620.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Recomputes digest via</text>
</g>
<!-- verificationengine&#45;&gt;policyengine -->
<g id="edge11" class="edge">
<title>verificationengine&#45;&gt;policyengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2103.29,-750.26C2053.51,-736.47 1998.66,-722.66 1947.54,-712.8 1831.54,-690.42 1509.14,-729.54 1419.33,-652.8 1388.6,-626.55 1373.76,-585.3 1366.84,-546.63"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1369.44,-546.31 1365.65,-539.33 1364.26,-547.15 1369.44,-546.31"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1419.33,-596.4 1419.33,-652.8 1666.54,-652.8 1666.54,-596.4 1419.33,-596.4"/>
<text xml:space="preserve" text-anchor="start" x="1422.33" y="-637.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Passes verified signer identity,</text>
<text xml:space="preserve" text-anchor="start" x="1422.33" y="-620.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">rekor_timestamp, and skill_id for policy</text>
<text xml:space="preserve" text-anchor="start" x="1422.33" y="-603.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">evaluation [Phase 2]</text>
</g>
<!-- verificationengine&#45;&gt;sidecarmanager -->
<g id="edge12" class="edge">
<title>verificationengine&#45;&gt;sidecarmanager</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2270.53,-712.83C2269.96,-662.18 2269.24,-598.61 2268.65,-546.39"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2271.28,-546.6 2268.57,-539.13 2266.03,-546.66 2271.28,-546.6"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2269.78,-613.2 2269.78,-636 2423.62,-636 2423.62,-613.2 2269.78,-613.2"/>
<text xml:space="preserve" text-anchor="start" x="2272.78" y="-620.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads sidecar fields via</text>
</g>
<!-- verificationengine&#45;&gt;tufclient -->
<g id="edge13" class="edge">
<title>verificationengine&#45;&gt;tufclient</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2383.5,-712.83C2448.84,-660.91 2531.25,-595.43 2597.86,-542.49"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2599.3,-544.71 2603.54,-537.99 2596.03,-540.6 2599.3,-544.71"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2521.24,-604.8 2521.24,-644.4 2743.54,-644.4 2743.54,-604.8 2521.24,-604.8"/>
<text xml:space="preserve" text-anchor="start" x="2524.24" y="-628.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">Gets trusted Fulcio root certificates</text>
<text xml:space="preserve" text-anchor="start" x="2524.24" y="-612" font-family="Arial" font-size="14.00" fill="#c9c9c9">and Rekor public key from</text>
</g>
<!-- verificationengine&#45;&gt;rekorclient -->
<g id="edge14" class="edge">
<title>verificationengine&#45;&gt;rekorclient</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2439.56,-797.62C2645.54,-787.92 3002.59,-756.15 3289.54,-652.8 3363.42,-626.19 3438.75,-582.36 3499.49,-542.01"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="3500.67,-544.37 3505.45,-538.02 3497.75,-540.01 3500.67,-544.37"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="3407.38,-604.8 3407.38,-644.4 3625.78,-644.4 3625.78,-604.8 3407.38,-604.8"/>
<text xml:space="preserve" text-anchor="start" x="3410.38" y="-628.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">Queries Rekor log entries for strict</text>
<text xml:space="preserve" text-anchor="start" x="3410.38" y="-612" font-family="Arial" font-size="14.00" fill="#c9c9c9">mode verification</text>
</g>
<!-- authhandler&#45;&gt;github -->
<g id="edge15" class="edge">
<title>authhandler&#45;&gt;github</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M3153.4,-356.74C3149.91,-336.97 3146.8,-316.05 3145,-296.4 3141.83,-261.78 3144.15,-223.91 3148.25,-190.23"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="3150.84,-190.7 3149.2,-182.92 3145.63,-190.03 3150.84,-190.7"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="3145,-248.4 3145,-288 3408.54,-288 3408.54,-248.4 3145,-248.4"/>
<text xml:space="preserve" text-anchor="start" x="3148" y="-272.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Detects ambient OIDC token from GitHub</text>
<text xml:space="preserve" text-anchor="start" x="3148" y="-255.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">Actions runtime (CI path)</text>
</g>
<!-- authhandler&#45;&gt;sigstoredex -->
<g id="edge16" class="edge">
<title>authhandler&#45;&gt;sigstoredex</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M3345.16,-356.42C3375.07,-338.15 3405.04,-317.88 3431.54,-296.4 3470.77,-264.6 3508.92,-224.12 3540.21,-187.53"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="3541.97,-189.51 3544.82,-182.09 3537.97,-186.11 3541.97,-189.51"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="3487.23,-240 3487.23,-296.4 3751.57,-296.4 3751.57,-240 3487.23,-240"/>
<text xml:space="preserve" text-anchor="start" x="3490.23" y="-280.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">Opens browser for OAuth login via Dex —</text>
<text xml:space="preserve" text-anchor="start" x="3490.23" y="-264" font-family="Arial" font-size="14.00" fill="#c9c9c9">user picks Google, GitHub, or Microsoft</text>
<text xml:space="preserve" text-anchor="start" x="3490.23" y="-247.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">(interactive path)</text>
</g>
<!-- manifestreader&#45;&gt;skillfiles -->
<g id="edge17" class="edge">
<title>manifestreader&#45;&gt;skillfiles</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M920.54,-356.43C920.54,-306.16 920.54,-243.18 920.54,-191.18"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="923.16,-191.46 920.54,-183.96 917.91,-191.46 923.16,-191.46"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="920.54,-256.8 920.54,-279.6 1117.16,-279.6 1117.16,-256.8 920.54,-256.8"/>
<text xml:space="preserve" text-anchor="start" x="923.54" y="-264" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads skillsign.yaml manifests</text>
</g>
<!-- policyengine&#45;&gt;skillfiles -->
<g id="edge18" class="edge">
<title>policyengine&#45;&gt;skillfiles</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1274.92,-356.41C1236.3,-318.9 1189.53,-275.74 1144.54,-240 1119.51,-220.12 1091.86,-200.23 1064.78,-181.74"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1066.58,-179.79 1058.9,-177.75 1063.63,-184.14 1066.58,-179.79"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1207.23,-248.4 1207.23,-288 1415.52,-288 1415.52,-248.4 1207.23,-248.4"/>
<text xml:space="preserve" text-anchor="start" x="1210.23" y="-272.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads .skillsign&#45;policy.yaml trust</text>
<text xml:space="preserve" text-anchor="start" x="1210.23" y="-255.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">policies [Phase 2]</text>
</g>
<!-- sidecarmanager&#45;&gt;skillfiles -->
<g id="edge19" class="edge">
<title>sidecarmanager&#45;&gt;skillfiles</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2123.52,-356.42C2095.09,-341.43 2064.94,-327.25 2035.54,-316.4 1713.23,-197.48 1314.12,-136.1 1091.4,-108.97"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1092.02,-106.4 1084.26,-108.11 1091.39,-111.62 1092.02,-106.4"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1977.87,-248.4 1977.87,-288 2197.85,-288 2197.85,-248.4 1977.87,-248.4"/>
<text xml:space="preserve" text-anchor="start" x="1980.87" y="-272.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads and writes .skillsign sidecar</text>
<text xml:space="preserve" text-anchor="start" x="1980.87" y="-255.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">files</text>
</g>
<!-- tufclient&#45;&gt;tuf -->
<g id="edge20" class="edge">
<title>tufclient&#45;&gt;tuf</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2575.97,-356.46C2550.94,-342.24 2524.8,-328.3 2499.54,-316.4 2475.84,-305.24 2465.41,-311.63 2444.11,-296.4 2403.68,-267.49 2367.9,-226.07 2340.12,-187.99"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2342.59,-186.93 2336.08,-182.38 2338.33,-190 2342.59,-186.93"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2444.11,-248.4 2444.11,-288 2690.54,-288 2690.54,-248.4 2444.11,-248.4"/>
<text xml:space="preserve" text-anchor="start" x="2447.11" y="-272.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Fetches current TUF root metadata via</text>
<text xml:space="preserve" text-anchor="start" x="2447.11" y="-255.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">HTTPS</text>
</g>
<!-- tufclient&#45;&gt;tufcache -->
<g id="edge21" class="edge">
<title>tufclient&#45;&gt;tufcache</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2717.54,-356.43C2717.54,-306.16 2717.54,-243.18 2717.54,-191.18"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2720.16,-191.46 2717.54,-183.96 2714.91,-191.46 2720.16,-191.46"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2717.54,-248.4 2717.54,-288 2995.89,-288 2995.89,-248.4 2717.54,-248.4"/>
<text xml:space="preserve" text-anchor="start" x="2720.54" y="-272.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads and writes cached TUF metadata via</text>
<text xml:space="preserve" text-anchor="start" x="2720.54" y="-255.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">local filesystem</text>
</g>
<!-- rekorclient&#45;&gt;rekor -->
<g id="edge22" class="edge">
<title>rekorclient&#45;&gt;rekor</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M3742.06,-356.6C3790.83,-319.63 3848.76,-276.82 3902.43,-240 3928.86,-221.86 3957.4,-203.19 3985.21,-185.45"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="3986.35,-187.84 3991.27,-181.6 3983.53,-183.41 3986.35,-187.84"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="3902.43,-248.4 3902.43,-288 4132.54,-288 4132.54,-248.4 3902.43,-248.4"/>
<text xml:space="preserve" text-anchor="start" x="3905.43" y="-272.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Queries transparency log entries via</text>
<text xml:space="preserve" text-anchor="start" x="3905.43" y="-255.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">HTTPS/JSON</text>
</g>
<!-- skillauthor&#45;&gt;signingengine -->
<g id="edge1" class="edge">
<title>skillauthor&#45;&gt;signingengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1724.54,-1061.74C1724.54,-1013.31 1724.54,-953.23 1724.54,-903.24"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1727.16,-903.26 1724.54,-895.76 1721.91,-903.26 1727.16,-903.26"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1724.54,-970.4 1724.54,-993.2 1907.17,-993.2 1907.17,-970.4 1724.54,-970.4"/>
<text xml:space="preserve" text-anchor="start" x="1727.54" y="-977.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">Signs SKILL.md files via CLI</text>
</g>
<!-- skillconsumer&#45;&gt;verificationengine -->
<g id="edge2" class="edge">
<title>skillconsumer&#45;&gt;verificationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2232.12,-1061.74C2239.53,-1013.21 2248.74,-952.97 2256.39,-902.92"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2258.95,-903.53 2257.49,-895.72 2253.76,-902.74 2258.95,-903.53"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2246.62,-970.4 2246.62,-993.2 2442.47,-993.2 2442.47,-970.4 2246.62,-970.4"/>
<text xml:space="preserve" text-anchor="start" x="2249.62" y="-977.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">Verifies skill signatures via CLI</text>
</g>
<!-- claudecode&#45;&gt;verificationengine -->
<g id="edge3" class="edge">
<title>claudecode&#45;&gt;verificationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2568.96,-1061.77C2538.76,-1029.41 2503.45,-993.14 2469.54,-962 2446.51,-940.85 2421.01,-919.26 2396.18,-899.09"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2397.98,-897.17 2390.5,-894.5 2394.68,-901.25 2397.98,-897.17"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2510.65,-962 2510.65,-1001.6 2728.33,-1001.6 2728.33,-962 2510.65,-962"/>
<text xml:space="preserve" text-anchor="start" x="2513.65" y="-986" font-family="Arial" font-size="14.00" fill="#c9c9c9">Invokes verification before loading</text>
<text xml:space="preserve" text-anchor="start" x="2513.65" y="-969.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">skills</text>
</g>
</g>
</svg>
`;case"skillsignContainers":return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 14.0.4 (0)
 -->
<!-- Pages: 1 -->
<svg width="3107pt" height="946pt"
 viewBox="0.00 0.00 3107.00 946.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 931.45)">
<g id="clust1" class="cluster">
<title>cluster_skillsign</title>
<polygon fill="#0d4b6c" stroke="#0b3c57" points="64.81,-8 64.81,-628.8 910.81,-628.8 910.81,-8 64.81,-8"/>
<text xml:space="preserve" text-anchor="start" x="72.81" y="-615.9" font-family="Arial" font-weight="bold" font-size="11.00" fill="#b6ecf7" fill-opacity="0.701961">SKILLSIGN</text>
</g>
<!-- cli -->
<g id="node1" class="node">
<title>cli</title>
<polygon fill="#3b82f6" stroke="#2563eb" stroke-width="0" points="793.96,-567.6 433.67,-567.6 433.67,-387.6 793.96,-387.6 793.96,-567.6"/>
<text xml:space="preserve" text-anchor="start" x="557.12" y="-510.4" font-family="Arial" font-size="20.00" fill="#eff6ff">SkillSign CLI</text>
<text xml:space="preserve" text-anchor="start" x="575.88" y="-488.7" font-family="Arial" font-size="13.00" fill="#bfdbfe">Python, Click</text>
<text xml:space="preserve" text-anchor="start" x="469.57" y="-467.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">Command&#45;line tool for signing and verifying</text>
<text xml:space="preserve" text-anchor="start" x="475.41" y="-449.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">SKILL.md files. Also provides auth status,</text>
<text xml:space="preserve" text-anchor="start" x="453.72" y="-431.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">inspect, and unsign subcommands (Section 9.1)</text>
</g>
<!-- skillfiles -->
<g id="node2" class="node">
<title>skillfiles</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M424.83,-211.64C424.83,-220.67 353.11,-228 264.81,-228 176.51,-228 104.79,-220.67 104.79,-211.64 104.79,-211.64 104.79,-64.36 104.79,-64.36 104.79,-55.33 176.51,-48 264.81,-48 353.11,-48 424.83,-55.33 424.83,-64.36 424.83,-64.36 424.83,-211.64 424.83,-211.64"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M424.83,-211.64C424.83,-202.61 353.11,-195.27 264.81,-195.27 176.51,-195.27 104.79,-202.61 104.79,-211.64"/>
<text xml:space="preserve" text-anchor="start" x="200.9" y="-170.8" font-family="Arial" font-size="20.00" fill="#eff6ff">Skill File Store</text>
<text xml:space="preserve" text-anchor="start" x="213.51" y="-149.1" font-family="Arial" font-size="13.00" fill="#bfdbfe">Local File System</text>
<text xml:space="preserve" text-anchor="start" x="131.85" y="-127.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">SKILL.md files, skillsign.yaml manifests,</text>
<text xml:space="preserve" text-anchor="start" x="189.78" y="-109.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">.skillsign sidecars, and</text>
<text xml:space="preserve" text-anchor="start" x="127.26" y="-91.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">.skillsign&#45;policy.yaml trust policies on disk</text>
</g>
<!-- tufcache -->
<g id="node3" class="node">
<title>tufcache</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M870.89,-211.64C870.89,-220.67 795.55,-228 702.81,-228 610.07,-228 534.73,-220.67 534.73,-211.64 534.73,-211.64 534.73,-64.36 534.73,-64.36 534.73,-55.33 610.07,-48 702.81,-48 795.55,-48 870.89,-55.33 870.89,-64.36 870.89,-64.36 870.89,-211.64 870.89,-211.64"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M870.89,-211.64C870.89,-202.61 795.55,-195.27 702.81,-195.27 610.07,-195.27 534.73,-202.61 534.73,-211.64"/>
<text xml:space="preserve" text-anchor="start" x="627.79" y="-170.8" font-family="Arial" font-size="20.00" fill="#eff6ff">TUF Root Cache</text>
<text xml:space="preserve" text-anchor="start" x="651.51" y="-149.1" font-family="Arial" font-size="13.00" fill="#bfdbfe">Local File System</text>
<text xml:space="preserve" text-anchor="start" x="554.79" y="-127.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">Local cache of bundled and fetched Sigstore</text>
<text xml:space="preserve" text-anchor="start" x="588.18" y="-109.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">TUF root metadata and Fulcio root</text>
<text xml:space="preserve" text-anchor="start" x="666.97" y="-91.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">certificates</text>
</g>
<!-- skillauthor -->
<g id="node4" class="node">
<title>skillauthor</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="343.62,-916.4 0,-916.4 0,-736.4 343.62,-736.4 343.62,-916.4"/>
<text xml:space="preserve" text-anchor="start" x="121.23" y="-840.4" font-family="Arial" font-size="20.00" fill="#ffe0c2">Skill Author</text>
<text xml:space="preserve" text-anchor="start" x="20.06" y="-816.9" font-family="Arial" font-size="15.00" fill="#f9b27c">A developer who creates and signs SKILL.md</text>
<text xml:space="preserve" text-anchor="start" x="109.28" y="-798.9" font-family="Arial" font-size="15.00" fill="#f9b27c">files for distribution</text>
</g>
<!-- skillconsumer -->
<g id="node5" class="node">
<title>skillconsumer</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="773.83,-916.4 453.79,-916.4 453.79,-736.4 773.83,-736.4 773.83,-916.4"/>
<text xml:space="preserve" text-anchor="start" x="546.57" y="-840.4" font-family="Arial" font-size="20.00" fill="#ffe0c2">Skill Consumer</text>
<text xml:space="preserve" text-anchor="start" x="476.22" y="-816.9" font-family="Arial" font-size="15.00" fill="#f9b27c">A developer who installs and uses signed</text>
<text xml:space="preserve" text-anchor="start" x="543.78" y="-798.9" font-family="Arial" font-size="15.00" fill="#f9b27c">skills in Claude Code</text>
</g>
<!-- claudecode -->
<g id="node6" class="node">
<title>claudecode</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="1203.83,-916.4 883.79,-916.4 883.79,-736.4 1203.83,-736.4 1203.83,-916.4"/>
<text xml:space="preserve" text-anchor="start" x="985.44" y="-840.4" font-family="Arial" font-size="20.00" fill="#f8fafc">Claude Code</text>
<text xml:space="preserve" text-anchor="start" x="917.06" y="-816.9" font-family="Arial" font-size="15.00" fill="#cbd5e1">Anthropic CLI that loads and executes</text>
<text xml:space="preserve" text-anchor="start" x="945.43" y="-798.9" font-family="Arial" font-size="15.00" fill="#cbd5e1">SKILL.md files as instructions</text>
</g>
<!-- github -->
<g id="node7" class="node">
<title>github</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="1322.36,-228 981.26,-228 981.26,-48 1322.36,-48 1322.36,-228"/>
<text xml:space="preserve" text-anchor="start" x="1057.34" y="-179" font-family="Arial" font-size="20.00" fill="#f8fafc">GitHub Actions OIDC</text>
<text xml:space="preserve" text-anchor="start" x="1008" y="-155.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">CI identity provider: GitHub Actions runtime</text>
<text xml:space="preserve" text-anchor="start" x="1001.31" y="-137.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">issues OIDC tokens encoding the exact repo,</text>
<text xml:space="preserve" text-anchor="start" x="1010.5" y="-119.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">workflow, and branch. Fulcio verifies these</text>
<text xml:space="preserve" text-anchor="start" x="1002.17" y="-101.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">tokens and issues certificates with URI SANs</text>
<text xml:space="preserve" text-anchor="start" x="1134.72" y="-83.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">(e.g.,</text>
</g>
<!-- sigstoredex -->
<g id="node8" class="node">
<title>sigstoredex</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="1769.27,-228 1432.35,-228 1432.35,-48 1769.27,-48 1769.27,-228"/>
<text xml:space="preserve" text-anchor="start" x="1505.78" y="-179" font-family="Arial" font-size="20.00" fill="#f8fafc">Sigstore Dex (OAuth)</text>
<text xml:space="preserve" text-anchor="start" x="1509.1" y="-155.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">Interactive identity provider:</text>
<text xml:space="preserve" text-anchor="start" x="1502.84" y="-137.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">Sigstore&#45;hosted Dex instance</text>
<text xml:space="preserve" text-anchor="start" x="1457.39" y="-119.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">(oauth2.sigstore.dev/auth) that federates to</text>
<text xml:space="preserve" text-anchor="start" x="1452.41" y="-101.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">Google, GitHub, and Microsoft OAuth. Fulcio</text>
<text xml:space="preserve" text-anchor="start" x="1466.58" y="-83.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">verifies the Dex&#45;issued token and issues</text>
</g>
<!-- fulcio -->
<g id="node9" class="node">
<title>fulcio</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="2198.83,-228 1878.79,-228 1878.79,-48 2198.83,-48 2198.83,-228"/>
<text xml:space="preserve" text-anchor="start" x="1995.47" y="-170" font-family="Arial" font-size="20.00" fill="#f8fafc">Fulcio CA</text>
<text xml:space="preserve" text-anchor="start" x="1908.33" y="-146.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">Sigstore certificate authority that issues</text>
<text xml:space="preserve" text-anchor="start" x="1907.5" y="-128.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">short&#45;lived certificates binding a verified</text>
<text xml:space="preserve" text-anchor="start" x="1916.24" y="-110.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">GitHub identity to a signer&#45;generated</text>
<text xml:space="preserve" text-anchor="start" x="1967.94" y="-92.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">ephemeral public key</text>
</g>
<!-- rekor -->
<g id="node10" class="node">
<title>rekor</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="2647.13,-228 2308.49,-228 2308.49,-48 2647.13,-48 2647.13,-228"/>
<text xml:space="preserve" text-anchor="start" x="2367.76" y="-152" font-family="Arial" font-size="20.00" fill="#f8fafc">Rekor Transparency Log</text>
<text xml:space="preserve" text-anchor="start" x="2328.55" y="-128.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">Append&#45;only, publicly auditable log recording</text>
<text xml:space="preserve" text-anchor="start" x="2360.67" y="-110.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">signatures, certificates, and digests</text>
</g>
<!-- tuf -->
<g id="node11" class="node">
<title>tuf</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="3076.83,-228 2756.79,-228 2756.79,-48 3076.83,-48 3076.83,-228"/>
<text xml:space="preserve" text-anchor="start" x="2873.47" y="-152" font-family="Arial" font-size="20.00" fill="#f8fafc">TUF Root</text>
<text xml:space="preserve" text-anchor="start" x="2798.01" y="-128.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">The Update Framework root of trust</text>
<text xml:space="preserve" text-anchor="start" x="2811.76" y="-110.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">distributing Sigstore public keys</text>
</g>
<!-- cli&#45;&gt;skillfiles -->
<g id="edge4" class="edge">
<title>cli&#45;&gt;skillfiles</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M486.4,-387.64C462.33,-368.83 438.01,-348.36 416.6,-327.6 388.21,-300.07 360.19,-267.3 336.09,-236.86"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="338.3,-235.41 331.6,-231.14 334.17,-238.66 338.3,-235.41"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="416.6,-288 416.6,-327.6 628.81,-327.6 628.81,-288 416.6,-288"/>
<text xml:space="preserve" text-anchor="start" x="419.6" y="-312" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads and writes SKILL.md files,</text>
<text xml:space="preserve" text-anchor="start" x="419.6" y="-295.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">manifests, sidecars, and policies</text>
</g>
<!-- cli&#45;&gt;tufcache -->
<g id="edge5" class="edge">
<title>cli&#45;&gt;tufcache</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M637.19,-387.9C649.26,-342.12 664.03,-286.11 676.5,-238.82"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="678.97,-239.72 678.35,-231.79 673.9,-238.38 678.97,-239.72"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="660.98,-296.4 660.98,-319.2 917.54,-319.2 917.54,-296.4 660.98,-296.4"/>
<text xml:space="preserve" text-anchor="start" x="663.98" y="-303.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads and writes cached TUF metadata</text>
</g>
<!-- cli&#45;&gt;github -->
<g id="edge6" class="edge">
<title>cli&#45;&gt;github</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M793.61,-408.02C844.24,-385.46 898.19,-358.21 944.81,-327.6 985.05,-301.18 1025.13,-266.99 1059.15,-234.98"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1060.93,-236.91 1064.56,-229.85 1057.32,-233.1 1060.93,-236.91"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="994.25,-288 994.25,-327.6 1190.1,-327.6 1190.1,-288 994.25,-288"/>
<text xml:space="preserve" text-anchor="start" x="997.25" y="-312" font-family="Arial" font-size="14.00" fill="#c9c9c9">Authenticates CI workflows via</text>
<text xml:space="preserve" text-anchor="start" x="997.25" y="-295.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">OIDC/HTTPS</text>
</g>
<!-- cli&#45;&gt;sigstoredex -->
<g id="edge7" class="edge">
<title>cli&#45;&gt;sigstoredex</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M793.91,-442.66C915.36,-417.22 1078.13,-378.13 1216.81,-327.6 1288.63,-301.43 1364.76,-265.83 1430.13,-232.6"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1431.1,-235.05 1436.58,-229.3 1428.71,-230.38 1431.1,-235.05"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1303.66,-288 1303.66,-327.6 1495.62,-327.6 1495.62,-288 1303.66,-288"/>
<text xml:space="preserve" text-anchor="start" x="1306.66" y="-312" font-family="Arial" font-size="14.00" fill="#c9c9c9">Authenticates developers via</text>
<text xml:space="preserve" text-anchor="start" x="1306.66" y="-295.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">browser&#45;based OAuth/HTTPS</text>
</g>
<!-- cli&#45;&gt;fulcio -->
<g id="edge8" class="edge">
<title>cli&#45;&gt;fulcio</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M793.58,-455.61C978.17,-432.08 1272.98,-389.01 1522.81,-327.6 1659.65,-293.97 1691.73,-277.11 1823.81,-228 1838.7,-222.46 1854.1,-216.52 1869.49,-210.44"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1870.25,-212.96 1876.25,-207.75 1868.31,-208.08 1870.25,-212.96"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1660.04,-288 1660.04,-327.6 1901.81,-327.6 1901.81,-288 1660.04,-288"/>
<text xml:space="preserve" text-anchor="start" x="1663.04" y="-312" font-family="Arial" font-size="14.00" fill="#c9c9c9">Obtains short&#45;lived signing certificates</text>
<text xml:space="preserve" text-anchor="start" x="1663.04" y="-295.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">via HTTPS</text>
</g>
<!-- cli&#45;&gt;rekor -->
<g id="edge9" class="edge">
<title>cli&#45;&gt;rekor</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M793.87,-466.75C1048.73,-450.42 1528.27,-410.92 1928.81,-327.6 2055.47,-301.25 2193.14,-253.91 2298.94,-213.25"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2299.88,-215.7 2305.93,-210.55 2297.99,-210.8 2299.88,-215.7"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2067.48,-288 2067.48,-327.6 2308.5,-327.6 2308.5,-288 2067.48,-288"/>
<text xml:space="preserve" text-anchor="start" x="2070.48" y="-312" font-family="Arial" font-size="14.00" fill="#c9c9c9">Submits and queries transparency log</text>
<text xml:space="preserve" text-anchor="start" x="2070.48" y="-295.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">entries via HTTPS</text>
</g>
<!-- cli&#45;&gt;tuf -->
<g id="edge10" class="edge">
<title>cli&#45;&gt;tuf</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M793.68,-471.64C1108.5,-460.61 1778.91,-426.64 2335.81,-327.6 2501.79,-298.08 2542.27,-282.48 2701.81,-228 2716.69,-222.92 2732.02,-217.32 2747.31,-211.49"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2747.94,-214.06 2753.99,-208.92 2746.05,-209.16 2747.94,-214.06"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2515.12,-296.4 2515.12,-319.2 2763.87,-319.2 2763.87,-296.4 2515.12,-296.4"/>
<text xml:space="preserve" text-anchor="start" x="2518.12" y="-303.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">Fetches TUF root metadata via HTTPS</text>
</g>
<!-- skillauthor&#45;&gt;cli -->
<g id="edge1" class="edge">
<title>skillauthor&#45;&gt;cli</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M279.64,-736.57C318.63,-704.79 363.16,-668.91 404.18,-636.8 430.65,-616.08 459.26,-594.18 486.58,-573.49"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="487.81,-575.84 492.21,-569.22 484.65,-571.65 487.81,-575.84"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="404.18,-645.2 404.18,-668 586.81,-668 586.81,-645.2 404.18,-645.2"/>
<text xml:space="preserve" text-anchor="start" x="407.18" y="-652.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Signs SKILL.md files via CLI</text>
</g>
<!-- skillconsumer&#45;&gt;cli -->
<g id="edge2" class="edge">
<title>skillconsumer&#45;&gt;cli</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M613.81,-736.54C613.81,-688.11 613.81,-628.03 613.81,-578.04"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="616.44,-578.06 613.81,-570.56 611.19,-578.06 616.44,-578.06"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="613.81,-645.2 613.81,-668 809.66,-668 809.66,-645.2 613.81,-645.2"/>
<text xml:space="preserve" text-anchor="start" x="616.81" y="-652.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Verifies skill signatures via CLI</text>
</g>
<!-- claudecode&#45;&gt;cli -->
<g id="edge3" class="edge">
<title>claudecode&#45;&gt;cli</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M951.14,-736.53C916.14,-704.16 875.43,-667.9 836.81,-636.8 810.4,-615.53 781.36,-593.81 753.21,-573.55"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="754.99,-571.59 747.37,-569.35 751.93,-575.86 754.99,-571.59"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="883.84,-636.8 883.84,-676.4 1101.52,-676.4 1101.52,-636.8 883.84,-636.8"/>
<text xml:space="preserve" text-anchor="start" x="886.84" y="-660.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">Invokes verification before loading</text>
<text xml:space="preserve" text-anchor="start" x="886.84" y="-644" font-family="Arial" font-size="14.00" fill="#c9c9c9">skills</text>
</g>
</g>
</svg>
`;case"index":return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 14.0.4 (0)
 -->
<!-- Pages: 1 -->
<svg width="2126pt" height="872pt"
 viewBox="0.00 0.00 2126.00 872.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 857.45)">
<!-- skillauthor -->
<g id="node1" class="node">
<title>skillauthor</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="787.36,-842.4 443.74,-842.4 443.74,-662.4 787.36,-662.4 787.36,-842.4"/>
<text xml:space="preserve" text-anchor="start" x="564.98" y="-766.4" font-family="Arial" font-size="20.00" fill="#ffe0c2">Skill Author</text>
<text xml:space="preserve" text-anchor="start" x="463.8" y="-742.9" font-family="Arial" font-size="15.00" fill="#f9b27c">A developer who creates and signs SKILL.md</text>
<text xml:space="preserve" text-anchor="start" x="553.03" y="-724.9" font-family="Arial" font-size="15.00" fill="#f9b27c">files for distribution</text>
</g>
<!-- skillsign -->
<g id="node2" class="node">
<title>skillsign</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="1232.28,-519.6 882.83,-519.6 882.83,-339.6 1232.28,-339.6 1232.28,-519.6"/>
<text xml:space="preserve" text-anchor="start" x="1019.2" y="-452.6" font-family="Arial" font-size="20.00" fill="#f0f9ff">SkillSign</text>
<text xml:space="preserve" text-anchor="start" x="906.65" y="-429.1" font-family="Arial" font-size="15.00" fill="#b6ecf7">Cryptographic signing and verification system</text>
<text xml:space="preserve" text-anchor="start" x="902.89" y="-411.1" font-family="Arial" font-size="15.00" fill="#b6ecf7">for Claude Code SKILL.md files using Sigstore</text>
<text xml:space="preserve" text-anchor="start" x="1006.69" y="-393.1" font-family="Arial" font-size="15.00" fill="#b6ecf7">keyless signing</text>
</g>
<!-- skillconsumer -->
<g id="node3" class="node">
<title>skillconsumer</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="1217.57,-842.4 897.53,-842.4 897.53,-662.4 1217.57,-662.4 1217.57,-842.4"/>
<text xml:space="preserve" text-anchor="start" x="990.31" y="-766.4" font-family="Arial" font-size="20.00" fill="#ffe0c2">Skill Consumer</text>
<text xml:space="preserve" text-anchor="start" x="919.97" y="-742.9" font-family="Arial" font-size="15.00" fill="#f9b27c">A developer who installs and uses signed</text>
<text xml:space="preserve" text-anchor="start" x="987.52" y="-724.9" font-family="Arial" font-size="15.00" fill="#f9b27c">skills in Claude Code</text>
</g>
<!-- claudecode -->
<g id="node4" class="node">
<title>claudecode</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="1647.57,-842.4 1327.53,-842.4 1327.53,-662.4 1647.57,-662.4 1647.57,-842.4"/>
<text xml:space="preserve" text-anchor="start" x="1429.18" y="-766.4" font-family="Arial" font-size="20.00" fill="#f8fafc">Claude Code</text>
<text xml:space="preserve" text-anchor="start" x="1360.81" y="-742.9" font-family="Arial" font-size="15.00" fill="#cbd5e1">Anthropic CLI that loads and executes</text>
<text xml:space="preserve" text-anchor="start" x="1389.18" y="-724.9" font-family="Arial" font-size="15.00" fill="#cbd5e1">SKILL.md files as instructions</text>
</g>
<!-- github -->
<g id="node5" class="node">
<title>github</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="341.11,-180 0,-180 0,0 341.11,0 341.11,-180"/>
<text xml:space="preserve" text-anchor="start" x="76.08" y="-131" font-family="Arial" font-size="20.00" fill="#f8fafc">GitHub Actions OIDC</text>
<text xml:space="preserve" text-anchor="start" x="26.75" y="-107.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">CI identity provider: GitHub Actions runtime</text>
<text xml:space="preserve" text-anchor="start" x="20.06" y="-89.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">issues OIDC tokens encoding the exact repo,</text>
<text xml:space="preserve" text-anchor="start" x="29.24" y="-71.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">workflow, and branch. Fulcio verifies these</text>
<text xml:space="preserve" text-anchor="start" x="20.91" y="-53.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">tokens and issues certificates with URI SANs</text>
<text xml:space="preserve" text-anchor="start" x="153.46" y="-35.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">(e.g.,</text>
</g>
<!-- sigstoredex -->
<g id="node6" class="node">
<title>sigstoredex</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="788.01,-180 451.1,-180 451.1,0 788.01,0 788.01,-180"/>
<text xml:space="preserve" text-anchor="start" x="524.52" y="-131" font-family="Arial" font-size="20.00" fill="#f8fafc">Sigstore Dex (OAuth)</text>
<text xml:space="preserve" text-anchor="start" x="527.84" y="-107.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">Interactive identity provider:</text>
<text xml:space="preserve" text-anchor="start" x="521.59" y="-89.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">Sigstore&#45;hosted Dex instance</text>
<text xml:space="preserve" text-anchor="start" x="476.13" y="-71.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">(oauth2.sigstore.dev/auth) that federates to</text>
<text xml:space="preserve" text-anchor="start" x="471.15" y="-53.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">Google, GitHub, and Microsoft OAuth. Fulcio</text>
<text xml:space="preserve" text-anchor="start" x="485.32" y="-35.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">verifies the Dex&#45;issued token and issues</text>
</g>
<!-- fulcio -->
<g id="node7" class="node">
<title>fulcio</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="1217.57,-180 897.53,-180 897.53,0 1217.57,0 1217.57,-180"/>
<text xml:space="preserve" text-anchor="start" x="1014.21" y="-122" font-family="Arial" font-size="20.00" fill="#f8fafc">Fulcio CA</text>
<text xml:space="preserve" text-anchor="start" x="927.08" y="-98.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">Sigstore certificate authority that issues</text>
<text xml:space="preserve" text-anchor="start" x="926.24" y="-80.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">short&#45;lived certificates binding a verified</text>
<text xml:space="preserve" text-anchor="start" x="934.98" y="-62.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">GitHub identity to a signer&#45;generated</text>
<text xml:space="preserve" text-anchor="start" x="986.68" y="-44.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">ephemeral public key</text>
</g>
<!-- rekor -->
<g id="node8" class="node">
<title>rekor</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="1665.87,-180 1327.23,-180 1327.23,0 1665.87,0 1665.87,-180"/>
<text xml:space="preserve" text-anchor="start" x="1386.5" y="-104" font-family="Arial" font-size="20.00" fill="#f8fafc">Rekor Transparency Log</text>
<text xml:space="preserve" text-anchor="start" x="1347.29" y="-80.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">Append&#45;only, publicly auditable log recording</text>
<text xml:space="preserve" text-anchor="start" x="1379.41" y="-62.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">signatures, certificates, and digests</text>
</g>
<!-- tuf -->
<g id="node9" class="node">
<title>tuf</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="2095.57,-180 1775.53,-180 1775.53,0 2095.57,0 2095.57,-180"/>
<text xml:space="preserve" text-anchor="start" x="1892.21" y="-104" font-family="Arial" font-size="20.00" fill="#f8fafc">TUF Root</text>
<text xml:space="preserve" text-anchor="start" x="1816.76" y="-80.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">The Update Framework root of trust</text>
<text xml:space="preserve" text-anchor="start" x="1830.5" y="-62.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">distributing Sigstore public keys</text>
</g>
<!-- skillauthor&#45;&gt;skillsign -->
<g id="edge1" class="edge">
<title>skillauthor&#45;&gt;skillsign</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M730.43,-662.54C765.86,-635.56 805.17,-606.07 841.71,-579.6 866.22,-561.84 892.56,-543.25 918.13,-525.47"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="919.61,-527.63 924.28,-521.2 916.62,-523.32 919.61,-527.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="841.71,-579.6 841.71,-602.4 1030.55,-602.4 1030.55,-579.6 841.71,-579.6"/>
<text xml:space="preserve" text-anchor="start" x="844.71" y="-586.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">Signs skill files for distribution</text>
</g>
<!-- skillsign&#45;&gt;github -->
<g id="edge4" class="edge">
<title>skillsign&#45;&gt;github</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M883.09,-387.32C781.36,-361.06 651.49,-323.72 539.81,-279.6 471.69,-252.69 399.39,-217.38 336.99,-184.6"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="338.4,-182.37 330.54,-181.19 335.95,-187.01 338.4,-182.37"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="539.81,-240 539.81,-279.6 774.55,-279.6 774.55,-240 539.81,-240"/>
<text xml:space="preserve" text-anchor="start" x="542.81" y="-264" font-family="Arial" font-size="14.00" fill="#c9c9c9">Authenticates CI workflows via OIDC</text>
<text xml:space="preserve" text-anchor="start" x="542.81" y="-247.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">tokens</text>
</g>
<!-- skillsign&#45;&gt;sigstoredex -->
<g id="edge5" class="edge">
<title>skillsign&#45;&gt;sigstoredex</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M927.39,-339.67C900.06,-320.28 871.62,-299.58 845.56,-279.6 807.22,-250.21 766.38,-216.81 730.11,-186.37"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="732.19,-184.69 724.76,-181.87 728.81,-188.71 732.19,-184.69"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="845.56,-240 845.56,-279.6 1030.55,-279.6 1030.55,-240 845.56,-240"/>
<text xml:space="preserve" text-anchor="start" x="848.56" y="-264" font-family="Arial" font-size="14.00" fill="#c9c9c9">Authenticates developers via</text>
<text xml:space="preserve" text-anchor="start" x="848.56" y="-247.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">browser&#45;based OAuth</text>
</g>
<!-- skillsign&#45;&gt;fulcio -->
<g id="edge6" class="edge">
<title>skillsign&#45;&gt;fulcio</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1057.55,-339.9C1057.55,-293.94 1057.55,-237.67 1057.55,-190.27"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1060.18,-190.51 1057.55,-183.01 1054.93,-190.51 1060.18,-190.51"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1057.55,-248.4 1057.55,-271.2 1230.86,-271.2 1230.86,-248.4 1057.55,-248.4"/>
<text xml:space="preserve" text-anchor="start" x="1060.55" y="-255.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">Obtains signing certificates</text>
</g>
<!-- skillsign&#45;&gt;rekor -->
<g id="edge7" class="edge">
<title>skillsign&#45;&gt;rekor</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1178,-339.71C1204.32,-320.05 1231.96,-299.23 1257.55,-279.6 1296.71,-249.57 1339.1,-216.36 1377.14,-186.29"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1378.57,-188.51 1382.82,-181.8 1375.31,-184.39 1378.57,-188.51"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1303.65,-248.4 1303.65,-271.2 1536.88,-271.2 1536.88,-248.4 1303.65,-248.4"/>
<text xml:space="preserve" text-anchor="start" x="1306.65" y="-255.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">Records and queries signed artifacts</text>
</g>
<!-- skillsign&#45;&gt;tuf -->
<g id="edge8" class="edge">
<title>skillsign&#45;&gt;tuf</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1232.05,-385.67C1330.82,-359.29 1455.77,-322.37 1563.55,-279.6 1631.71,-252.55 1704.16,-217.39 1766.83,-184.77"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1767.89,-187.17 1773.33,-181.37 1765.46,-182.52 1767.89,-187.17"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1647.43,-248.4 1647.43,-271.2 1840.18,-271.2 1840.18,-248.4 1647.43,-248.4"/>
<text xml:space="preserve" text-anchor="start" x="1650.43" y="-255.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">Retrieves trusted signing keys</text>
</g>
<!-- skillconsumer&#45;&gt;skillsign -->
<g id="edge2" class="edge">
<title>skillconsumer&#45;&gt;skillsign</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1057.55,-662.47C1057.55,-621.27 1057.55,-572.16 1057.55,-529.77"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1060.18,-529.96 1057.55,-522.46 1054.93,-529.96 1060.18,-529.96"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1057.55,-579.6 1057.55,-602.4 1233.95,-602.4 1233.95,-579.6 1057.55,-579.6"/>
<text xml:space="preserve" text-anchor="start" x="1060.55" y="-586.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">Verifies skill file authenticity</text>
</g>
<!-- claudecode&#45;&gt;skillsign -->
<g id="edge3" class="edge">
<title>claudecode&#45;&gt;skillsign</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1370.86,-662.57C1335.51,-635.79 1296.52,-606.4 1260.55,-579.6 1237.01,-562.05 1211.85,-543.46 1187.54,-525.57"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1189.37,-523.66 1181.77,-521.33 1186.26,-527.89 1189.37,-523.66"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1285.29,-579.6 1285.29,-602.4 1464.82,-602.4 1464.82,-579.6 1285.29,-579.6"/>
<text xml:space="preserve" text-anchor="start" x="1288.29" y="-586.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">Verifies skills before loading</text>
</g>
</g>
</svg>
`;case"errorIdentityMismatch":return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 14.0.4 (0)
 -->
<!-- Pages: 1 -->
<svg width="2476pt" height="779pt"
 viewBox="0.00 0.00 2476.00 779.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 763.85)">
<!-- skillconsumer -->
<g id="node1" class="node">
<title>skillconsumer</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="320.04,-490 0,-490 0,-310 320.04,-310 320.04,-490"/>
<text xml:space="preserve" text-anchor="start" x="92.78" y="-414" font-family="Arial" font-size="20.00" fill="#ffe0c2">Skill Consumer</text>
<text xml:space="preserve" text-anchor="start" x="22.43" y="-390.5" font-family="Arial" font-size="15.00" fill="#f9b27c">A developer who installs and uses signed</text>
<text xml:space="preserve" text-anchor="start" x="89.99" y="-372.5" font-family="Arial" font-size="15.00" fill="#f9b27c">skills in Claude Code</text>
</g>
<!-- verificationengine -->
<g id="node2" class="node">
<title>verificationengine</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1049.34,-490 712.43,-490 712.43,-310 1049.34,-310 1049.34,-490"/>
<text xml:space="preserve" text-anchor="start" x="797.5" y="-450.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Verification Engine</text>
<text xml:space="preserve" text-anchor="start" x="818.74" y="-429.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">ECDSA P&#45;256, X.509</text>
<text xml:space="preserve" text-anchor="start" x="739.16" y="-407.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Orchestrates verification: reads sidecar via</text>
<text xml:space="preserve" text-anchor="start" x="732.48" y="-389.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">SidecarManager, recomputes digest, verifies</text>
<text xml:space="preserve" text-anchor="start" x="745.82" y="-371.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">ECDSA P&#45;256 signature using certificate</text>
<text xml:space="preserve" text-anchor="start" x="752.9" y="-353.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">public key, validates cert chain against</text>
<text xml:space="preserve" text-anchor="start" x="759.59" y="-335.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Fulcio root via TUF TrustedRoot and</text>
</g>
<!-- sidecarmanager -->
<g id="node3" class="node">
<title>sidecarmanager</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1820.34,-729 1465.92,-729 1465.92,-549 1820.34,-549 1820.34,-729"/>
<text xml:space="preserve" text-anchor="start" x="1566.98" y="-689.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Sidecar Manager</text>
<text xml:space="preserve" text-anchor="start" x="1614.59" y="-668.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">YAML 1.2</text>
<text xml:space="preserve" text-anchor="start" x="1498.89" y="-646.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Implemented as a single sidecar.py module</text>
<text xml:space="preserve" text-anchor="start" x="1523.92" y="-628.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">combining reader and writer. Writer:</text>
<text xml:space="preserve" text-anchor="start" x="1485.98" y="-610.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">assembles canonical field&#45;ordered YAML (PEM</text>
<text xml:space="preserve" text-anchor="start" x="1511.42" y="-592.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">fields as literal block scalars) and writes</text>
<text xml:space="preserve" text-anchor="start" x="1509.32" y="-574.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">atomically via temp file rename. Reader:</text>
</g>
<!-- skillfiles -->
<g id="node4" class="node">
<title>skillfiles</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M2445.66,-558.64C2445.66,-567.67 2373.94,-575 2285.64,-575 2197.34,-575 2125.62,-567.67 2125.62,-558.64 2125.62,-558.64 2125.62,-411.36 2125.62,-411.36 2125.62,-402.33 2197.34,-395 2285.64,-395 2373.94,-395 2445.66,-402.33 2445.66,-411.36 2445.66,-411.36 2445.66,-558.64 2445.66,-558.64"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M2445.66,-558.64C2445.66,-549.61 2373.94,-542.27 2285.64,-542.27 2197.34,-542.27 2125.62,-549.61 2125.62,-558.64"/>
<text xml:space="preserve" text-anchor="start" x="2221.73" y="-517.8" font-family="Arial" font-size="20.00" fill="#eff6ff">Skill File Store</text>
<text xml:space="preserve" text-anchor="start" x="2234.35" y="-496.1" font-family="Arial" font-size="13.00" fill="#bfdbfe">Local File System</text>
<text xml:space="preserve" text-anchor="start" x="2152.68" y="-474.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">SKILL.md files, skillsign.yaml manifests,</text>
<text xml:space="preserve" text-anchor="start" x="2210.61" y="-456.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">.skillsign sidecars, and</text>
<text xml:space="preserve" text-anchor="start" x="2148.1" y="-438.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">.skillsign&#45;policy.yaml trust policies on disk</text>
</g>
<!-- canonicalprocessor -->
<g id="node5" class="node">
<title>canonicalprocessor</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1810.77,-180 1475.5,-180 1475.5,0 1810.77,0 1810.77,-180"/>
<text xml:space="preserve" text-anchor="start" x="1524.76" y="-140.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Canonical Form Processor</text>
<text xml:space="preserve" text-anchor="start" x="1594.73" y="-119.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">UTF&#45;8, SHA&#45;256</text>
<text xml:space="preserve" text-anchor="start" x="1517.23" y="-97.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Implemented across canonical.py and</text>
<text xml:space="preserve" text-anchor="start" x="1495.55" y="-79.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">digest.py. canonical.py: 8&#45;step normalization</text>
<text xml:space="preserve" text-anchor="start" x="1510.6" y="-61.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">(BOM strip, CRLF normalization, trailing</text>
<text xml:space="preserve" text-anchor="start" x="1513.49" y="-43.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">whitespace trim, single trailing newline,</text>
<text xml:space="preserve" text-anchor="start" x="1527.66" y="-25.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">UTF&#45;8 encode, null&#45;byte rejection).</text>
</g>
<!-- skillconsumer&#45;&gt;verificationengine -->
<g id="edge1" class="edge">
<title>skillconsumer&#45;&gt;verificationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M319.67,-400C432.75,-400 584.87,-400 702.06,-400"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="702.05,-402.63 709.55,-400 702.05,-397.38 702.05,-402.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="399.75,-403 399.75,-435.8 423.75,-435.8 423.75,-403 399.75,-403"/>
<text xml:space="preserve" text-anchor="start" x="407.86" y="-416.2" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">1</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="426.75,-403 426.75,-435.8 632.71,-435.8 632.71,-403 426.75,-403"/>
<text xml:space="preserve" text-anchor="start" x="429.75" y="-415.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Runs: skillsign verify ./SKILL.md</text>
</g>
<!-- skillconsumer&#45;&gt;verificationengine -->
<g id="edge8" class="edge">
<title>skillconsumer&#45;&gt;verificationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M329.7,-344.02C346.56,-340.03 363.54,-336.63 380.04,-334.2 499.81,-316.6 532.56,-317.21 652.43,-334.2 672.17,-337 692.59,-341.1 712.73,-345.9"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="329.39,-341.39 322.73,-345.72 330.64,-346.49 329.39,-341.39"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="383.04,-337.2 383.04,-370 407.04,-370 407.04,-337.2 383.04,-337.2"/>
<text xml:space="preserve" text-anchor="start" x="391.15" y="-350.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">8</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="410.04,-337.2 410.04,-370 649.43,-370 649.43,-337.2 410.04,-337.2"/>
<text xml:space="preserve" text-anchor="start" x="413.04" y="-349.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">IDENTITY_MISMATCH — exit code 1</text>
</g>
<!-- verificationengine&#45;&gt;verificationengine -->
<g id="edge6" class="edge">
<title>verificationengine&#45;&gt;verificationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M849.18,-489.98C841.38,-546.28 851.95,-600 880.89,-600 908.07,-600 919.04,-552.58 913.8,-500.17"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="916.44,-500.12 912.95,-492.99 911.23,-500.75 916.44,-500.12"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="740.27,-603 740.27,-642.6 764.27,-642.6 764.27,-603 740.27,-603"/>
<text xml:space="preserve" text-anchor="start" x="748.38" y="-619.6" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">6</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="767.27,-603 767.27,-642.6 1021.5,-642.6 1021.5,-603 767.27,-603"/>
<text xml:space="preserve" text-anchor="start" x="770.27" y="-627" font-family="Arial" font-size="14.00" fill="#c9c9c9">ECDSA signature and certificate checks</text>
<text xml:space="preserve" text-anchor="start" x="823.19" y="-610.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">pass (steps 6&#45;8 partial)</text>
</g>
<!-- verificationengine&#45;&gt;verificationengine -->
<g id="edge7" class="edge">
<title>verificationengine&#45;&gt;verificationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M830.42,-489.65C795.16,-591.93 811.98,-710 880.89,-710 947.57,-710 965.48,-599.41 934.6,-499.58"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="937.12,-498.84 932.29,-492.53 932.13,-500.47 937.12,-498.84"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="790.47,-713 790.47,-745.8 814.47,-745.8 814.47,-713 790.47,-713"/>
<text xml:space="preserve" text-anchor="start" x="798.58" y="-726.2" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">7</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="817.47,-713 817.47,-745.8 971.3,-745.8 971.3,-713 817.47,-713"/>
<text xml:space="preserve" text-anchor="start" x="820.47" y="-725.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">SAN identity match fails</text>
</g>
<!-- verificationengine&#45;&gt;sidecarmanager -->
<g id="edge2" class="edge">
<title>verificationengine&#45;&gt;sidecarmanager</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1049.15,-462.43C1069.36,-469.56 1089.78,-476.57 1109.34,-483 1223.78,-520.59 1353.45,-558.65 1456.21,-587.77"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1455.23,-590.22 1463.16,-589.74 1456.66,-585.17 1455.23,-590.22"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1139.97,-574.17 1139.97,-606.97 1163.97,-606.97 1163.97,-574.17 1139.97,-574.17"/>
<text xml:space="preserve" text-anchor="start" x="1148.08" y="-587.37" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">2</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1166.97,-574.17 1166.97,-606.97 1375.3,-606.97 1375.3,-574.17 1166.97,-574.17"/>
<text xml:space="preserve" text-anchor="start" x="1169.97" y="-586.37" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads and parses sidecar — OK</text>
</g>
<!-- verificationengine&#45;&gt;skillfiles -->
<g id="edge5" class="edge">
<title>verificationengine&#45;&gt;skillfiles</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1049.3,-409.58C1237.03,-420.38 1550.54,-438.61 1820.34,-455.2 1917.76,-461.19 2026.67,-468.17 2114.5,-473.86"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2114.16,-476.47 2121.81,-474.34 2114.5,-471.23 2114.16,-476.47"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1544.14,-458.2 1544.14,-491 1568.14,-491 1568.14,-458.2 1544.14,-458.2"/>
<text xml:space="preserve" text-anchor="start" x="1552.25" y="-471.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">5</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1571.14,-458.2 1571.14,-491 1742.12,-491 1742.12,-458.2 1571.14,-458.2"/>
<text xml:space="preserve" text-anchor="start" x="1574.14" y="-470.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads SKILL.md file bytes</text>
</g>
<!-- verificationengine&#45;&gt;canonicalprocessor -->
<g id="edge4" class="edge">
<title>verificationengine&#45;&gt;canonicalprocessor</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1031.87,-310.03C1057.32,-296.27 1083.78,-282.86 1109.34,-271.4 1225.1,-219.52 1360.47,-173.6 1465.79,-140.95"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1466.28,-143.55 1472.67,-138.82 1464.73,-138.53 1466.28,-143.55"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1112.34,-274.4 1112.34,-314 1136.34,-314 1136.34,-274.4 1112.34,-274.4"/>
<text xml:space="preserve" text-anchor="start" x="1120.45" y="-291" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">4</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1139.34,-274.4 1139.34,-314 1402.92,-314 1402.92,-274.4 1139.34,-274.4"/>
<text xml:space="preserve" text-anchor="start" x="1142.34" y="-298.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Recomputes canonical form and digest —</text>
<text xml:space="preserve" text-anchor="start" x="1244.68" y="-281.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">matches</text>
</g>
<!-- sidecarmanager&#45;&gt;skillfiles -->
<g id="edge3" class="edge">
<title>sidecarmanager&#45;&gt;skillfiles</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1820,-596.72C1911.83,-574.64 2023.69,-547.74 2114.64,-525.87"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2115.16,-528.45 2121.84,-524.14 2113.93,-523.34 2115.16,-528.45"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1883.34,-583.32 1883.34,-616.12 1907.34,-616.12 1907.34,-583.32 1883.34,-583.32"/>
<text xml:space="preserve" text-anchor="start" x="1891.45" y="-596.52" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">3</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1910.34,-583.32 1910.34,-616.12 2062.62,-616.12 2062.62,-583.32 1910.34,-583.32"/>
<text xml:space="preserve" text-anchor="start" x="1913.34" y="-595.52" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads .skillsign sidecar</text>
</g>
</g>
</svg>
`;case"errorInvalidCert":return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 14.0.4 (0)
 -->
<!-- Pages: 1 -->
<svg width="2547pt" height="1194pt"
 viewBox="0.00 0.00 2547.00 1194.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 1179.05)">
<!-- skillconsumer -->
<g id="node1" class="node">
<title>skillconsumer</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="320.04,-770 0,-770 0,-590 320.04,-590 320.04,-770"/>
<text xml:space="preserve" text-anchor="start" x="92.78" y="-694" font-family="Arial" font-size="20.00" fill="#ffe0c2">Skill Consumer</text>
<text xml:space="preserve" text-anchor="start" x="22.43" y="-670.5" font-family="Arial" font-size="15.00" fill="#f9b27c">A developer who installs and uses signed</text>
<text xml:space="preserve" text-anchor="start" x="89.99" y="-652.5" font-family="Arial" font-size="15.00" fill="#f9b27c">skills in Claude Code</text>
</g>
<!-- verificationengine -->
<g id="node2" class="node">
<title>verificationengine</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1015.92,-770 679,-770 679,-590 1015.92,-590 1015.92,-770"/>
<text xml:space="preserve" text-anchor="start" x="764.07" y="-730.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Verification Engine</text>
<text xml:space="preserve" text-anchor="start" x="785.31" y="-709.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">ECDSA P&#45;256, X.509</text>
<text xml:space="preserve" text-anchor="start" x="705.73" y="-687.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Orchestrates verification: reads sidecar via</text>
<text xml:space="preserve" text-anchor="start" x="699.05" y="-669.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">SidecarManager, recomputes digest, verifies</text>
<text xml:space="preserve" text-anchor="start" x="712.39" y="-651.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">ECDSA P&#45;256 signature using certificate</text>
<text xml:space="preserve" text-anchor="start" x="719.47" y="-633.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">public key, validates cert chain against</text>
<text xml:space="preserve" text-anchor="start" x="726.16" y="-615.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Fulcio root via TUF TrustedRoot and</text>
</g>
<!-- sidecarmanager -->
<g id="node3" class="node">
<title>sidecarmanager</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1786.91,-1164 1432.49,-1164 1432.49,-984 1786.91,-984 1786.91,-1164"/>
<text xml:space="preserve" text-anchor="start" x="1533.55" y="-1124.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Sidecar Manager</text>
<text xml:space="preserve" text-anchor="start" x="1581.16" y="-1103.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">YAML 1.2</text>
<text xml:space="preserve" text-anchor="start" x="1465.46" y="-1081.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Implemented as a single sidecar.py module</text>
<text xml:space="preserve" text-anchor="start" x="1490.49" y="-1063.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">combining reader and writer. Writer:</text>
<text xml:space="preserve" text-anchor="start" x="1452.55" y="-1045.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">assembles canonical field&#45;ordered YAML (PEM</text>
<text xml:space="preserve" text-anchor="start" x="1477.99" y="-1027.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">fields as literal block scalars) and writes</text>
<text xml:space="preserve" text-anchor="start" x="1475.9" y="-1009.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">atomically via temp file rename. Reader:</text>
</g>
<!-- skillfiles -->
<g id="node4" class="node">
<title>skillfiles</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M2508.79,-1011.64C2508.79,-1020.67 2437.06,-1028 2348.77,-1028 2260.47,-1028 2188.75,-1020.67 2188.75,-1011.64 2188.75,-1011.64 2188.75,-864.36 2188.75,-864.36 2188.75,-855.33 2260.47,-848 2348.77,-848 2437.06,-848 2508.79,-855.33 2508.79,-864.36 2508.79,-864.36 2508.79,-1011.64 2508.79,-1011.64"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M2508.79,-1011.64C2508.79,-1002.61 2437.06,-995.27 2348.77,-995.27 2260.47,-995.27 2188.75,-1002.61 2188.75,-1011.64"/>
<text xml:space="preserve" text-anchor="start" x="2284.86" y="-970.8" font-family="Arial" font-size="20.00" fill="#eff6ff">Skill File Store</text>
<text xml:space="preserve" text-anchor="start" x="2297.47" y="-949.1" font-family="Arial" font-size="13.00" fill="#bfdbfe">Local File System</text>
<text xml:space="preserve" text-anchor="start" x="2215.81" y="-927.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">SKILL.md files, skillsign.yaml manifests,</text>
<text xml:space="preserve" text-anchor="start" x="2273.73" y="-909.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">.skillsign sidecars, and</text>
<text xml:space="preserve" text-anchor="start" x="2211.22" y="-891.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">.skillsign&#45;policy.yaml trust policies on disk</text>
</g>
<!-- canonicalprocessor -->
<g id="node5" class="node">
<title>canonicalprocessor</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1777.34,-615 1442.07,-615 1442.07,-435 1777.34,-435 1777.34,-615"/>
<text xml:space="preserve" text-anchor="start" x="1491.33" y="-575.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Canonical Form Processor</text>
<text xml:space="preserve" text-anchor="start" x="1561.3" y="-554.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">UTF&#45;8, SHA&#45;256</text>
<text xml:space="preserve" text-anchor="start" x="1483.8" y="-532.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Implemented across canonical.py and</text>
<text xml:space="preserve" text-anchor="start" x="1462.12" y="-514.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">digest.py. canonical.py: 8&#45;step normalization</text>
<text xml:space="preserve" text-anchor="start" x="1477.17" y="-496.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">(BOM strip, CRLF normalization, trailing</text>
<text xml:space="preserve" text-anchor="start" x="1480.06" y="-478.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">whitespace trim, single trailing newline,</text>
<text xml:space="preserve" text-anchor="start" x="1494.24" y="-460.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">UTF&#45;8 encode, null&#45;byte rejection).</text>
</g>
<!-- tufclient -->
<g id="node6" class="node">
<title>tufclient</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1772.75,-325 1446.65,-325 1446.65,-145 1772.75,-145 1772.75,-325"/>
<text xml:space="preserve" text-anchor="start" x="1561.92" y="-285.8" font-family="Arial" font-size="20.00" fill="#eef2ff">TUF Client</text>
<text xml:space="preserve" text-anchor="start" x="1572.15" y="-264.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">TUF, HTTPS</text>
<text xml:space="preserve" text-anchor="start" x="1485.91" y="-242.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Wraps Sigstore SDK TrustedRoot via</text>
<text xml:space="preserve" text-anchor="start" x="1475.06" y="-224.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">infra/tuf.py. Fetches production TUF root</text>
<text xml:space="preserve" text-anchor="start" x="1471.72" y="-206.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">metadata including Fulcio root certificates</text>
<text xml:space="preserve" text-anchor="start" x="1467.13" y="-188.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">and Rekor public key. Falls back to cached</text>
<text xml:space="preserve" text-anchor="start" x="1466.71" y="-170.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">metadata when offline. Used by verification</text>
</g>
<!-- tuf -->
<g id="node7" class="node">
<title>tuf</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="2508.79,-470 2188.75,-470 2188.75,-290 2508.79,-290 2508.79,-470"/>
<text xml:space="preserve" text-anchor="start" x="2305.43" y="-394" font-family="Arial" font-size="20.00" fill="#f8fafc">TUF Root</text>
<text xml:space="preserve" text-anchor="start" x="2229.97" y="-370.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">The Update Framework root of trust</text>
<text xml:space="preserve" text-anchor="start" x="2243.72" y="-352.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">distributing Sigstore public keys</text>
</g>
<!-- tufcache -->
<g id="node8" class="node">
<title>tufcache</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M2516.85,-163.64C2516.85,-172.67 2441.51,-180 2348.77,-180 2256.02,-180 2180.69,-172.67 2180.69,-163.64 2180.69,-163.64 2180.69,-16.36 2180.69,-16.36 2180.69,-7.33 2256.02,0 2348.77,0 2441.51,0 2516.85,-7.33 2516.85,-16.36 2516.85,-16.36 2516.85,-163.64 2516.85,-163.64"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M2516.85,-163.64C2516.85,-154.61 2441.51,-147.27 2348.77,-147.27 2256.02,-147.27 2180.69,-154.61 2180.69,-163.64"/>
<text xml:space="preserve" text-anchor="start" x="2273.74" y="-122.8" font-family="Arial" font-size="20.00" fill="#eff6ff">TUF Root Cache</text>
<text xml:space="preserve" text-anchor="start" x="2297.47" y="-101.1" font-family="Arial" font-size="13.00" fill="#bfdbfe">Local File System</text>
<text xml:space="preserve" text-anchor="start" x="2200.75" y="-79.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">Local cache of bundled and fetched Sigstore</text>
<text xml:space="preserve" text-anchor="start" x="2234.13" y="-61.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">TUF root metadata and Fulcio root</text>
<text xml:space="preserve" text-anchor="start" x="2312.92" y="-43.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">certificates</text>
</g>
<!-- skillconsumer&#45;&gt;verificationengine -->
<g id="edge1" class="edge">
<title>skillconsumer&#45;&gt;verificationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M320,-680C424.3,-680 560.84,-680 668.73,-680"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="668.55,-682.63 676.05,-680 668.55,-677.38 668.55,-682.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="383.04,-683 383.04,-715.8 407.04,-715.8 407.04,-683 383.04,-683"/>
<text xml:space="preserve" text-anchor="start" x="391.15" y="-696.2" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">1</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="410.04,-683 410.04,-715.8 616,-715.8 616,-683 410.04,-683"/>
<text xml:space="preserve" text-anchor="start" x="413.04" y="-695.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Runs: skillsign verify ./SKILL.md</text>
</g>
<!-- skillconsumer&#45;&gt;verificationengine -->
<g id="edge11" class="edge">
<title>skillconsumer&#45;&gt;verificationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M329.7,-624.02C346.56,-620.03 363.54,-616.63 380.04,-614.2 485.11,-598.76 513.85,-599.3 619,-614.2 638.74,-617 659.16,-621.1 679.3,-625.9"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="329.39,-621.39 322.73,-625.72 330.64,-626.49 329.39,-621.39"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="385.47,-617.2 385.47,-650 417.05,-650 417.05,-617.2 385.47,-617.2"/>
<text xml:space="preserve" text-anchor="start" x="393.47" y="-630.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">10</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="420.05,-617.2 420.05,-650 613.56,-650 613.56,-617.2 420.05,-617.2"/>
<text xml:space="preserve" text-anchor="start" x="423.05" y="-629.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">INVALID_CERT — exit code 1</text>
</g>
<!-- verificationengine&#45;&gt;verificationengine -->
<g id="edge6" class="edge">
<title>verificationengine&#45;&gt;verificationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M817.21,-769.98C809.77,-826.28 819.85,-880 847.46,-880 873.39,-880 883.86,-832.58 878.87,-780.17"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="881.51,-780.14 878.05,-772.99 876.29,-780.74 881.51,-780.14"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="716.57,-883 716.57,-922.6 740.57,-922.6 740.57,-883 716.57,-883"/>
<text xml:space="preserve" text-anchor="start" x="724.68" y="-899.6" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">6</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="743.57,-883 743.57,-922.6 978.34,-922.6 978.34,-883 743.57,-883"/>
<text xml:space="preserve" text-anchor="start" x="746.57" y="-907" font-family="Arial" font-size="14.00" fill="#c9c9c9">ECDSA signature verification passes</text>
<text xml:space="preserve" text-anchor="start" x="837.23" y="-890.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">(step 6)</text>
</g>
<!-- verificationengine&#45;&gt;verificationengine -->
<g id="edge10" class="edge">
<title>verificationengine&#45;&gt;verificationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M799.3,-769.65C765.66,-871.93 781.71,-990 847.46,-990 911.09,-990 928.17,-879.41 898.71,-779.58"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="901.25,-778.92 896.51,-772.54 896.24,-780.48 901.25,-778.92"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="712.29,-993 712.29,-1032.6 736.29,-1032.6 736.29,-993 712.29,-993"/>
<text xml:space="preserve" text-anchor="start" x="720.39" y="-1009.6" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">9</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="739.29,-993 739.29,-1032.6 982.63,-1032.6 982.63,-993 739.29,-993"/>
<text xml:space="preserve" text-anchor="start" x="742.29" y="-1017" font-family="Arial" font-size="14.00" fill="#c9c9c9">Temporal binding and SET verification</text>
<text xml:space="preserve" text-anchor="start" x="837.23" y="-1000.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">(step 9)</text>
</g>
<!-- verificationengine&#45;&gt;sidecarmanager -->
<g id="edge2" class="edge">
<title>verificationengine&#45;&gt;sidecarmanager</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M914.83,-769.9C956.1,-820.02 1013.17,-879.83 1075.92,-918 1181.62,-982.29 1315.26,-1021.33 1422.26,-1044.27"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1421.69,-1046.84 1429.57,-1045.82 1422.77,-1041.7 1421.69,-1046.84"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1106.54,-1034.79 1106.54,-1067.59 1130.54,-1067.59 1130.54,-1034.79 1106.54,-1034.79"/>
<text xml:space="preserve" text-anchor="start" x="1114.65" y="-1047.99" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">2</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1133.54,-1034.79 1133.54,-1067.59 1341.87,-1067.59 1341.87,-1034.79 1133.54,-1034.79"/>
<text xml:space="preserve" text-anchor="start" x="1136.54" y="-1046.99" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads and parses sidecar — OK</text>
</g>
<!-- verificationengine&#45;&gt;skillfiles -->
<g id="edge5" class="edge">
<title>verificationengine&#45;&gt;skillfiles</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1015.72,-708.78C1303.29,-758.27 1888.32,-858.94 2177.76,-908.75"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2177.11,-911.3 2184.95,-909.98 2178,-906.12 2177.11,-911.3"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1510.72,-841.86 1510.72,-874.66 1534.72,-874.66 1534.72,-841.86 1510.72,-841.86"/>
<text xml:space="preserve" text-anchor="start" x="1518.82" y="-855.06" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">5</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1537.72,-841.86 1537.72,-874.66 1708.69,-874.66 1708.69,-841.86 1537.72,-841.86"/>
<text xml:space="preserve" text-anchor="start" x="1540.72" y="-854.06" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads SKILL.md file bytes</text>
</g>
<!-- verificationengine&#45;&gt;canonicalprocessor -->
<g id="edge4" class="edge">
<title>verificationengine&#45;&gt;canonicalprocessor</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1015.77,-645.89C1139.1,-620.74 1306.54,-586.61 1432.03,-561.02"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1432.34,-563.64 1439.16,-559.57 1431.29,-558.49 1432.34,-563.64"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1078.92,-632.86 1078.92,-672.46 1102.92,-672.46 1102.92,-632.86 1078.92,-632.86"/>
<text xml:space="preserve" text-anchor="start" x="1087.02" y="-649.46" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">4</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1105.92,-632.86 1105.92,-672.46 1369.49,-672.46 1369.49,-632.86 1105.92,-632.86"/>
<text xml:space="preserve" text-anchor="start" x="1108.92" y="-656.86" font-family="Arial" font-size="14.00" fill="#c9c9c9">Recomputes canonical form and digest —</text>
<text xml:space="preserve" text-anchor="start" x="1211.25" y="-640.06" font-family="Arial" font-size="14.00" fill="#c9c9c9">matches</text>
</g>
<!-- verificationengine&#45;&gt;tufclient -->
<g id="edge7" class="edge">
<title>verificationengine&#45;&gt;tufclient</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M954.59,-590.09C991.8,-560.5 1034.63,-528.51 1075.92,-502.4 1191.92,-429.02 1330.74,-359.89 1437.59,-310.32"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1438.4,-312.84 1444.1,-307.3 1436.19,-308.07 1438.4,-312.84"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1106.94,-505.4 1106.94,-545 1130.94,-545 1130.94,-505.4 1106.94,-505.4"/>
<text xml:space="preserve" text-anchor="start" x="1115.04" y="-522" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">7</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1133.94,-505.4 1133.94,-545 1341.47,-545 1341.47,-505.4 1133.94,-505.4"/>
<text xml:space="preserve" text-anchor="start" x="1150.16" y="-529.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Requests trusted Fulcio root</text>
<text xml:space="preserve" text-anchor="start" x="1136.94" y="-512.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">certificates and Rekor public key</text>
</g>
<!-- sidecarmanager&#45;&gt;skillfiles -->
<g id="edge3" class="edge">
<title>sidecarmanager&#45;&gt;skillfiles</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1786.78,-1041.51C1905.23,-1019.66 2060.54,-991 2177.71,-969.38"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2177.98,-972 2184.88,-968.06 2177.02,-966.84 2177.98,-972"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1894.16,-1033.01 1894.16,-1065.81 1918.16,-1065.81 1918.16,-1033.01 1894.16,-1033.01"/>
<text xml:space="preserve" text-anchor="start" x="1902.27" y="-1046.21" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">3</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1921.16,-1033.01 1921.16,-1065.81 2073.44,-1065.81 2073.44,-1033.01 1921.16,-1033.01"/>
<text xml:space="preserve" text-anchor="start" x="1924.16" y="-1045.21" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads .skillsign sidecar</text>
</g>
<!-- tufclient&#45;&gt;tuf -->
<g id="edge8" class="edge">
<title>tufclient&#45;&gt;tuf</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1772.45,-266.82C1892.81,-290.5 2056.67,-322.73 2178.73,-346.75"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2178.09,-349.3 2185.96,-348.17 2179.1,-344.14 2178.09,-349.3"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1852.25,-336.1 1852.25,-368.9 1887.71,-368.9 1887.71,-336.1 1852.25,-336.1"/>
<text xml:space="preserve" text-anchor="start" x="1860.25" y="-349.3" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">8.1</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1890.71,-336.1 1890.71,-368.9 2115.35,-368.9 2115.35,-336.1 1890.71,-336.1"/>
<text xml:space="preserve" text-anchor="start" x="1893.71" y="-348.3" font-family="Arial" font-size="14.00" fill="#c9c9c9">Fetches current TUF root metadata</text>
</g>
<!-- tufclient&#45;&gt;tufcache -->
<g id="edge9" class="edge">
<title>tufclient&#45;&gt;tufcache</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1772.45,-203.18C1889.93,-180.07 2048.84,-148.81 2169.88,-124.99"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2170.18,-127.61 2177.03,-123.59 2169.17,-122.46 2170.18,-127.61"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1849.91,-191.1 1849.91,-223.9 1885.37,-223.9 1885.37,-191.1 1849.91,-191.1"/>
<text xml:space="preserve" text-anchor="start" x="1857.91" y="-204.3" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">8.2</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1888.37,-191.1 1888.37,-223.9 2117.69,-223.9 2117.69,-191.1 1888.37,-191.1"/>
<text xml:space="preserve" text-anchor="start" x="1891.37" y="-203.3" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads/writes cached TUF metadata</text>
</g>
</g>
</svg>
`;case"errorInvalidManifest":return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 14.0.4 (0)
 -->
<!-- Pages: 1 -->
<svg width="2373pt" height="210pt"
 viewBox="0.00 0.00 2373.00 210.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 195.05)">
<!-- skillauthor -->
<g id="node1" class="node">
<title>skillauthor</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="343.62,-180 0,-180 0,0 343.62,0 343.62,-180"/>
<text xml:space="preserve" text-anchor="start" x="121.23" y="-104" font-family="Arial" font-size="20.00" fill="#ffe0c2">Skill Author</text>
<text xml:space="preserve" text-anchor="start" x="20.06" y="-80.5" font-family="Arial" font-size="15.00" fill="#f9b27c">A developer who creates and signs SKILL.md</text>
<text xml:space="preserve" text-anchor="start" x="109.28" y="-62.5" font-family="Arial" font-size="15.00" fill="#f9b27c">files for distribution</text>
</g>
<!-- signingengine -->
<g id="node2" class="node">
<title>signingengine</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1030.06,-180 694.81,-180 694.81,0 1030.06,0 1030.06,-180"/>
<text xml:space="preserve" text-anchor="start" x="795.16" y="-140.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Signing Engine</text>
<text xml:space="preserve" text-anchor="start" x="800.29" y="-119.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">ECDSA P&#45;256, X.509</text>
<text xml:space="preserve" text-anchor="start" x="740.71" y="-97.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Orchestrates the signing protocol via</text>
<text xml:space="preserve" text-anchor="start" x="714.87" y="-79.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Sigstore SDK: reads manifest, canonicalizes</text>
<text xml:space="preserve" text-anchor="start" x="721.54" y="-61.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">SKILL.md, computes digest, obtains OIDC</text>
<text xml:space="preserve" text-anchor="start" x="788.65" y="-43.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">identity token, invokes</text>
<text xml:space="preserve" text-anchor="start" x="727.36" y="-25.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">SigningContext.signer() which generates</text>
</g>
<!-- manifestreader -->
<g id="node3" class="node">
<title>manifestreader</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1692.95,-180 1372.72,-180 1372.72,0 1692.95,0 1692.95,-180"/>
<text xml:space="preserve" text-anchor="start" x="1459.47" y="-131.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Manifest Reader</text>
<text xml:space="preserve" text-anchor="start" x="1504.29" y="-110.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">YAML 1.2</text>
<text xml:space="preserve" text-anchor="start" x="1392.78" y="-88.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Reads skillsign.yaml to extract skill_id and</text>
<text xml:space="preserve" text-anchor="start" x="1403.62" y="-70.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">skill_version at signing time, with same</text>
<text xml:space="preserve" text-anchor="start" x="1406.96" y="-52.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">strict YAML parsing restrictions as the</text>
<text xml:space="preserve" text-anchor="start" x="1464.05" y="-34.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">sidecar (Section 7.3)</text>
</g>
<!-- skillfiles -->
<g id="node4" class="node">
<title>skillfiles</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M2343.15,-163.64C2343.15,-172.67 2271.43,-180 2183.13,-180 2094.84,-180 2023.11,-172.67 2023.11,-163.64 2023.11,-163.64 2023.11,-16.36 2023.11,-16.36 2023.11,-7.33 2094.84,0 2183.13,0 2271.43,0 2343.15,-7.33 2343.15,-16.36 2343.15,-16.36 2343.15,-163.64 2343.15,-163.64"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M2343.15,-163.64C2343.15,-154.61 2271.43,-147.27 2183.13,-147.27 2094.84,-147.27 2023.11,-154.61 2023.11,-163.64"/>
<text xml:space="preserve" text-anchor="start" x="2119.23" y="-122.8" font-family="Arial" font-size="20.00" fill="#eff6ff">Skill File Store</text>
<text xml:space="preserve" text-anchor="start" x="2131.84" y="-101.1" font-family="Arial" font-size="13.00" fill="#bfdbfe">Local File System</text>
<text xml:space="preserve" text-anchor="start" x="2050.17" y="-79.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">SKILL.md files, skillsign.yaml manifests,</text>
<text xml:space="preserve" text-anchor="start" x="2108.1" y="-61.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">.skillsign sidecars, and</text>
<text xml:space="preserve" text-anchor="start" x="2045.59" y="-43.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">.skillsign&#45;policy.yaml trust policies on disk</text>
</g>
<!-- skillauthor&#45;&gt;signingengine -->
<g id="edge1" class="edge">
<title>skillauthor&#45;&gt;signingengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M343.47,-90C447.26,-90 579.57,-90 684.48,-90"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="684.34,-92.63 691.84,-90 684.34,-87.38 684.34,-92.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="406.62,-93 406.62,-125.8 430.62,-125.8 430.62,-93 406.62,-93"/>
<text xml:space="preserve" text-anchor="start" x="414.73" y="-106.2" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">1</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="433.62,-93 433.62,-125.8 631.81,-125.8 631.81,-93 433.62,-93"/>
<text xml:space="preserve" text-anchor="start" x="436.62" y="-105.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Runs: skillsign sign ./SKILL.md</text>
</g>
<!-- skillauthor&#45;&gt;signingengine -->
<g id="edge4" class="edge">
<title>skillauthor&#45;&gt;signingengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M353.33,-33.42C370.2,-29.69 387.15,-26.5 403.62,-24.2 505.38,-9.98 533.08,-9.73 634.81,-24.2 654.48,-27 674.84,-31.1 694.91,-35.91"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="353.09,-30.78 346.36,-35.01 354.25,-35.9 353.09,-30.78"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="427.63,-27.2 427.63,-60 451.63,-60 451.63,-27.2 427.63,-27.2"/>
<text xml:space="preserve" text-anchor="start" x="435.73" y="-40.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">4</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="454.63,-27.2 454.63,-60 610.81,-60 610.81,-27.2 454.63,-27.2"/>
<text xml:space="preserve" text-anchor="start" x="457.63" y="-39.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">CLI error — exit code 10</text>
</g>
<!-- signingengine&#45;&gt;manifestreader -->
<g id="edge2" class="edge">
<title>signingengine&#45;&gt;manifestreader</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1029.95,-90C1131.34,-90 1260.54,-90 1362.45,-90"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1362.33,-92.63 1369.83,-90 1362.33,-87.38 1362.33,-92.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1093.06,-93 1093.06,-125.8 1117.06,-125.8 1117.06,-93 1093.06,-93"/>
<text xml:space="preserve" text-anchor="start" x="1101.17" y="-106.2" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">2</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1120.06,-93 1120.06,-125.8 1309.72,-125.8 1309.72,-93 1120.06,-93"/>
<text xml:space="preserve" text-anchor="start" x="1123.06" y="-105.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads and validates manifest</text>
</g>
<!-- manifestreader&#45;&gt;skillfiles -->
<g id="edge3" class="edge">
<title>manifestreader&#45;&gt;skillfiles</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1692.84,-90C1789.61,-90 1913.16,-90 2011.9,-90"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2011.76,-92.63 2019.26,-90 2011.76,-87.38 2011.76,-92.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1755.95,-93 1755.95,-125.8 1779.95,-125.8 1779.95,-93 1755.95,-93"/>
<text xml:space="preserve" text-anchor="start" x="1764.06" y="-106.2" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">3</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1782.95,-93 1782.95,-125.8 1960.11,-125.8 1960.11,-93 1782.95,-93"/>
<text xml:space="preserve" text-anchor="start" x="1785.95" y="-105.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads skillsign.yaml — fails</text>
</g>
</g>
</svg>
`;case"errorInvalidSkillFile":return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 14.0.4 (0)
 -->
<!-- Pages: 1 -->
<svg width="2456pt" height="1025pt"
 viewBox="0.00 0.00 2456.00 1025.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 1010.05)">
<!-- skillauthor -->
<g id="node1" class="node">
<title>skillauthor</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="343.62,-619 0,-619 0,-439 343.62,-439 343.62,-619"/>
<text xml:space="preserve" text-anchor="start" x="121.23" y="-543" font-family="Arial" font-size="20.00" fill="#ffe0c2">Skill Author</text>
<text xml:space="preserve" text-anchor="start" x="20.06" y="-519.5" font-family="Arial" font-size="15.00" fill="#f9b27c">A developer who creates and signs SKILL.md</text>
<text xml:space="preserve" text-anchor="start" x="109.28" y="-501.5" font-family="Arial" font-size="15.00" fill="#f9b27c">files for distribution</text>
</g>
<!-- signingengine -->
<g id="node2" class="node">
<title>signingengine</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1063.52,-619 728.27,-619 728.27,-439 1063.52,-439 1063.52,-619"/>
<text xml:space="preserve" text-anchor="start" x="828.62" y="-579.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Signing Engine</text>
<text xml:space="preserve" text-anchor="start" x="833.75" y="-558.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">ECDSA P&#45;256, X.509</text>
<text xml:space="preserve" text-anchor="start" x="774.16" y="-536.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Orchestrates the signing protocol via</text>
<text xml:space="preserve" text-anchor="start" x="748.32" y="-518.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Sigstore SDK: reads manifest, canonicalizes</text>
<text xml:space="preserve" text-anchor="start" x="754.99" y="-500.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">SKILL.md, computes digest, obtains OIDC</text>
<text xml:space="preserve" text-anchor="start" x="822.1" y="-482.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">identity token, invokes</text>
<text xml:space="preserve" text-anchor="start" x="760.82" y="-464.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">SigningContext.signer() which generates</text>
</g>
<!-- manifestreader -->
<g id="node3" class="node">
<title>manifestreader</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1772.84,-995 1452.61,-995 1452.61,-815 1772.84,-815 1772.84,-995"/>
<text xml:space="preserve" text-anchor="start" x="1539.35" y="-946.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Manifest Reader</text>
<text xml:space="preserve" text-anchor="start" x="1584.18" y="-925.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">YAML 1.2</text>
<text xml:space="preserve" text-anchor="start" x="1472.67" y="-903.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Reads skillsign.yaml to extract skill_id and</text>
<text xml:space="preserve" text-anchor="start" x="1483.51" y="-885.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">skill_version at signing time, with same</text>
<text xml:space="preserve" text-anchor="start" x="1486.85" y="-867.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">strict YAML parsing restrictions as the</text>
<text xml:space="preserve" text-anchor="start" x="1543.94" y="-849.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">sidecar (Section 7.3)</text>
</g>
<!-- skillfiles -->
<g id="node4" class="node">
<title>skillfiles</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M2425.89,-732.64C2425.89,-741.67 2354.17,-749 2265.87,-749 2177.58,-749 2105.85,-741.67 2105.85,-732.64 2105.85,-732.64 2105.85,-585.36 2105.85,-585.36 2105.85,-576.33 2177.58,-569 2265.87,-569 2354.17,-569 2425.89,-576.33 2425.89,-585.36 2425.89,-585.36 2425.89,-732.64 2425.89,-732.64"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M2425.89,-732.64C2425.89,-723.61 2354.17,-716.27 2265.87,-716.27 2177.58,-716.27 2105.85,-723.61 2105.85,-732.64"/>
<text xml:space="preserve" text-anchor="start" x="2201.97" y="-691.8" font-family="Arial" font-size="20.00" fill="#eff6ff">Skill File Store</text>
<text xml:space="preserve" text-anchor="start" x="2214.58" y="-670.1" font-family="Arial" font-size="13.00" fill="#bfdbfe">Local File System</text>
<text xml:space="preserve" text-anchor="start" x="2132.91" y="-648.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">SKILL.md files, skillsign.yaml manifests,</text>
<text xml:space="preserve" text-anchor="start" x="2190.84" y="-630.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">.skillsign sidecars, and</text>
<text xml:space="preserve" text-anchor="start" x="2128.33" y="-612.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">.skillsign&#45;policy.yaml trust policies on disk</text>
</g>
<!-- canonicalprocessor -->
<g id="node5" class="node">
<title>canonicalprocessor</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1780.36,-180 1445.09,-180 1445.09,0 1780.36,0 1780.36,-180"/>
<text xml:space="preserve" text-anchor="start" x="1494.35" y="-140.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Canonical Form Processor</text>
<text xml:space="preserve" text-anchor="start" x="1564.32" y="-119.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">UTF&#45;8, SHA&#45;256</text>
<text xml:space="preserve" text-anchor="start" x="1486.82" y="-97.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Implemented across canonical.py and</text>
<text xml:space="preserve" text-anchor="start" x="1465.14" y="-79.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">digest.py. canonical.py: 8&#45;step normalization</text>
<text xml:space="preserve" text-anchor="start" x="1480.19" y="-61.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">(BOM strip, CRLF normalization, trailing</text>
<text xml:space="preserve" text-anchor="start" x="1483.08" y="-43.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">whitespace trim, single trailing newline,</text>
<text xml:space="preserve" text-anchor="start" x="1497.26" y="-25.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">UTF&#45;8 encode, null&#45;byte rejection).</text>
</g>
<!-- skillauthor&#45;&gt;signingengine -->
<g id="edge1" class="edge">
<title>skillauthor&#45;&gt;signingengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M343.48,-529C456.41,-529 604.15,-529 718.28,-529"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="718,-531.63 725.5,-529 718,-526.38 718,-531.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="423.35,-532 423.35,-564.8 447.35,-564.8 447.35,-532 423.35,-532"/>
<text xml:space="preserve" text-anchor="start" x="431.45" y="-545.2" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">1</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="450.35,-532 450.35,-564.8 648.54,-564.8 648.54,-532 450.35,-532"/>
<text xml:space="preserve" text-anchor="start" x="453.35" y="-544.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Runs: skillsign sign ./SKILL.md</text>
</g>
<!-- skillauthor&#45;&gt;signingengine -->
<g id="edge7" class="edge">
<title>skillauthor&#45;&gt;signingengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M353.38,-466.52C370.21,-462.42 387.13,-458.93 403.62,-456.4 519.88,-438.55 552.06,-438.24 668.27,-456.4 687.96,-459.48 708.28,-463.97 728.3,-469.25"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="353.06,-463.89 346.42,-468.26 354.33,-468.99 353.06,-463.89"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="406.62,-459.4 406.62,-499 430.62,-499 430.62,-459.4 406.62,-459.4"/>
<text xml:space="preserve" text-anchor="start" x="414.73" y="-476" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">7</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="433.62,-459.4 433.62,-499 665.27,-499 665.27,-459.4 433.62,-459.4"/>
<text xml:space="preserve" text-anchor="start" x="436.62" y="-483.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Canonical form normalization fails —</text>
<text xml:space="preserve" text-anchor="start" x="511.7" y="-466.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">exit code 10</text>
</g>
<!-- signingengine&#45;&gt;manifestreader -->
<g id="edge2" class="edge">
<title>signingengine&#45;&gt;manifestreader</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M975.25,-618.94C1015.95,-661.12 1068.58,-709.2 1123.52,-742 1222.26,-800.96 1345.11,-841.84 1442.88,-867.91"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1442.01,-870.4 1449.93,-869.77 1443.35,-865.32 1442.01,-870.4"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1145.97,-853.04 1145.97,-885.84 1169.97,-885.84 1169.97,-853.04 1145.97,-853.04"/>
<text xml:space="preserve" text-anchor="start" x="1154.08" y="-866.24" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">2</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1172.97,-853.04 1172.97,-885.84 1362.63,-885.84 1362.63,-853.04 1172.97,-853.04"/>
<text xml:space="preserve" text-anchor="start" x="1175.97" y="-865.24" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads and validates manifest</text>
</g>
<!-- signingengine&#45;&gt;skillfiles -->
<g id="edge4" class="edge">
<title>signingengine&#45;&gt;skillfiles</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1063.27,-544.81C1325.01,-569.68 1830.28,-617.7 2094.49,-642.81"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2094.22,-645.42 2101.93,-643.52 2094.72,-640.19 2094.22,-645.42"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1476.4,-614.15 1476.4,-653.75 1500.4,-653.75 1500.4,-614.15 1476.4,-614.15"/>
<text xml:space="preserve" text-anchor="start" x="1484.51" y="-630.75" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">4</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1503.4,-614.15 1503.4,-653.75 1749.04,-653.75 1749.04,-614.15 1503.4,-614.15"/>
<text xml:space="preserve" text-anchor="start" x="1506.4" y="-638.15" font-family="Arial" font-size="14.00" fill="#c9c9c9">Checks for existing .skillsign sidecar —</text>
<text xml:space="preserve" text-anchor="start" x="1577.19" y="-621.35" font-family="Arial" font-size="14.00" fill="#c9c9c9">none found, OK</text>
</g>
<!-- signingengine&#45;&gt;skillfiles -->
<g id="edge6" class="edge">
<title>signingengine&#45;&gt;skillfiles</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1063.49,-511.94C1241.79,-497.14 1532.49,-482.95 1780.36,-517.2 1901.8,-533.98 1928.23,-557.44 2045.85,-592 2061.88,-596.71 2078.54,-601.68 2095.2,-606.69"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2094.17,-609.12 2102.11,-608.77 2095.69,-604.09 2094.17,-609.12"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1513.74,-520.2 1513.74,-553 1537.74,-553 1537.74,-520.2 1513.74,-520.2"/>
<text xml:space="preserve" text-anchor="start" x="1521.84" y="-533.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">6</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1540.74,-520.2 1540.74,-553 1711.71,-553 1711.71,-520.2 1540.74,-520.2"/>
<text xml:space="preserve" text-anchor="start" x="1543.74" y="-532.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads SKILL.md file bytes</text>
</g>
<!-- signingengine&#45;&gt;canonicalprocessor -->
<g id="edge5" class="edge">
<title>signingengine&#45;&gt;canonicalprocessor</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M960.9,-439.14C1002.29,-386.39 1060.15,-321.73 1123.52,-278.2 1217.98,-213.3 1337.91,-166.66 1435.27,-136.04"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1435.94,-138.58 1442.33,-133.85 1434.38,-133.57 1435.94,-138.58"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1126.52,-281.2 1126.52,-314 1150.52,-314 1150.52,-281.2 1126.52,-281.2"/>
<text xml:space="preserve" text-anchor="start" x="1134.62" y="-294.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">5</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1153.52,-281.2 1153.52,-314 1382.09,-314 1382.09,-281.2 1153.52,-281.2"/>
<text xml:space="preserve" text-anchor="start" x="1156.52" y="-293.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Requests canonical form and digest</text>
</g>
<!-- manifestreader&#45;&gt;skillfiles -->
<g id="edge3" class="edge">
<title>manifestreader&#45;&gt;skillfiles</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1772.8,-845.06C1854.44,-814.29 1955.48,-776.17 2045.85,-742 2061.83,-735.96 2078.46,-729.67 2095.1,-723.37"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2095.98,-725.84 2102.06,-720.73 2094.12,-720.93 2095.98,-725.84"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1843.36,-820.97 1843.36,-853.77 1867.36,-853.77 1867.36,-820.97 1843.36,-820.97"/>
<text xml:space="preserve" text-anchor="start" x="1851.47" y="-834.17" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">3</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1870.36,-820.97 1870.36,-853.77 2042.85,-853.77 2042.85,-820.97 1870.36,-820.97"/>
<text xml:space="preserve" text-anchor="start" x="1873.36" y="-833.17" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads skillsign.yaml — OK</text>
</g>
</g>
</svg>
`;case"errorMalformedSidecar":return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 14.0.4 (0)
 -->
<!-- Pages: 1 -->
<svg width="2416pt" height="210pt"
 viewBox="0.00 0.00 2416.00 210.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 195.05)">
<!-- skillconsumer -->
<g id="node1" class="node">
<title>skillconsumer</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="320.04,-180 0,-180 0,0 320.04,0 320.04,-180"/>
<text xml:space="preserve" text-anchor="start" x="92.78" y="-104" font-family="Arial" font-size="20.00" fill="#ffe0c2">Skill Consumer</text>
<text xml:space="preserve" text-anchor="start" x="22.43" y="-80.5" font-family="Arial" font-size="15.00" fill="#f9b27c">A developer who installs and uses signed</text>
<text xml:space="preserve" text-anchor="start" x="89.99" y="-62.5" font-family="Arial" font-size="15.00" fill="#f9b27c">skills in Claude Code</text>
</g>
<!-- verificationengine -->
<g id="node2" class="node">
<title>verificationengine</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1062.59,-180 725.67,-180 725.67,0 1062.59,0 1062.59,-180"/>
<text xml:space="preserve" text-anchor="start" x="810.74" y="-140.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Verification Engine</text>
<text xml:space="preserve" text-anchor="start" x="831.98" y="-119.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">ECDSA P&#45;256, X.509</text>
<text xml:space="preserve" text-anchor="start" x="752.4" y="-97.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Orchestrates verification: reads sidecar via</text>
<text xml:space="preserve" text-anchor="start" x="745.72" y="-79.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">SidecarManager, recomputes digest, verifies</text>
<text xml:space="preserve" text-anchor="start" x="759.06" y="-61.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">ECDSA P&#45;256 signature using certificate</text>
<text xml:space="preserve" text-anchor="start" x="766.14" y="-43.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">public key, validates cert chain against</text>
<text xml:space="preserve" text-anchor="start" x="772.83" y="-25.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Fulcio root via TUF TrustedRoot and</text>
</g>
<!-- sidecarmanager -->
<g id="node3" class="node">
<title>sidecarmanager</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1738.65,-180 1384.23,-180 1384.23,0 1738.65,0 1738.65,-180"/>
<text xml:space="preserve" text-anchor="start" x="1485.29" y="-140.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Sidecar Manager</text>
<text xml:space="preserve" text-anchor="start" x="1532.9" y="-119.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">YAML 1.2</text>
<text xml:space="preserve" text-anchor="start" x="1417.2" y="-97.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Implemented as a single sidecar.py module</text>
<text xml:space="preserve" text-anchor="start" x="1442.23" y="-79.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">combining reader and writer. Writer:</text>
<text xml:space="preserve" text-anchor="start" x="1404.29" y="-61.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">assembles canonical field&#45;ordered YAML (PEM</text>
<text xml:space="preserve" text-anchor="start" x="1429.73" y="-43.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">fields as literal block scalars) and writes</text>
<text xml:space="preserve" text-anchor="start" x="1427.64" y="-25.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">atomically via temp file rename. Reader:</text>
</g>
<!-- skillfiles -->
<g id="node4" class="node">
<title>skillfiles</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M2385.76,-163.64C2385.76,-172.67 2314.03,-180 2225.74,-180 2137.44,-180 2065.72,-172.67 2065.72,-163.64 2065.72,-163.64 2065.72,-16.36 2065.72,-16.36 2065.72,-7.33 2137.44,0 2225.74,0 2314.03,0 2385.76,-7.33 2385.76,-16.36 2385.76,-16.36 2385.76,-163.64 2385.76,-163.64"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M2385.76,-163.64C2385.76,-154.61 2314.03,-147.27 2225.74,-147.27 2137.44,-147.27 2065.72,-154.61 2065.72,-163.64"/>
<text xml:space="preserve" text-anchor="start" x="2161.83" y="-122.8" font-family="Arial" font-size="20.00" fill="#eff6ff">Skill File Store</text>
<text xml:space="preserve" text-anchor="start" x="2174.44" y="-101.1" font-family="Arial" font-size="13.00" fill="#bfdbfe">Local File System</text>
<text xml:space="preserve" text-anchor="start" x="2092.78" y="-79.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">SKILL.md files, skillsign.yaml manifests,</text>
<text xml:space="preserve" text-anchor="start" x="2150.7" y="-61.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">.skillsign sidecars, and</text>
<text xml:space="preserve" text-anchor="start" x="2088.19" y="-43.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">.skillsign&#45;policy.yaml trust policies on disk</text>
</g>
<!-- skillconsumer&#45;&gt;verificationengine -->
<g id="edge1" class="edge">
<title>skillconsumer&#45;&gt;verificationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M319.88,-90C436.34,-90 594.52,-90 715.22,-90"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="715.15,-92.63 722.65,-90 715.15,-87.38 715.15,-92.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="406.37,-93 406.37,-125.8 430.37,-125.8 430.37,-93 406.37,-93"/>
<text xml:space="preserve" text-anchor="start" x="414.48" y="-106.2" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">1</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="433.37,-93 433.37,-125.8 639.33,-125.8 639.33,-93 433.37,-93"/>
<text xml:space="preserve" text-anchor="start" x="436.37" y="-105.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Runs: skillsign verify ./SKILL.md</text>
</g>
<!-- skillconsumer&#45;&gt;verificationengine -->
<g id="edge4" class="edge">
<title>skillconsumer&#45;&gt;verificationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M329.7,-34.02C346.56,-30.03 363.54,-26.63 380.04,-24.2 505.64,-5.74 539.98,-6.39 665.67,-24.2 685.41,-27 705.83,-31.1 725.97,-35.9"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="329.39,-31.39 322.73,-35.72 330.64,-36.49 329.39,-31.39"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="383.04,-27.2 383.04,-60 407.04,-60 407.04,-27.2 383.04,-27.2"/>
<text xml:space="preserve" text-anchor="start" x="391.15" y="-40.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">4</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="410.04,-27.2 410.04,-60 662.67,-60 662.67,-27.2 410.04,-27.2"/>
<text xml:space="preserve" text-anchor="start" x="413.04" y="-39.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">MALFORMED_SIDECAR — exit code 1</text>
</g>
<!-- verificationengine&#45;&gt;sidecarmanager -->
<g id="edge2" class="edge">
<title>verificationengine&#45;&gt;sidecarmanager</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1062.58,-90C1157.39,-90 1276.18,-90 1373.95,-90"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1373.72,-92.63 1381.22,-90 1373.72,-87.38 1373.72,-92.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1125.59,-93 1125.59,-125.8 1149.59,-125.8 1149.59,-93 1125.59,-93"/>
<text xml:space="preserve" text-anchor="start" x="1133.69" y="-106.2" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">2</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1152.59,-93 1152.59,-125.8 1321.23,-125.8 1321.23,-93 1152.59,-93"/>
<text xml:space="preserve" text-anchor="start" x="1155.59" y="-105.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads and parses sidecar</text>
</g>
<!-- sidecarmanager&#45;&gt;skillfiles -->
<g id="edge3" class="edge">
<title>sidecarmanager&#45;&gt;skillfiles</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1738.62,-90C1836.41,-90 1957.49,-90 2054.35,-90"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2054.31,-92.63 2061.81,-90 2054.31,-87.38 2054.31,-92.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1801.65,-93 1801.65,-125.8 1825.65,-125.8 1825.65,-93 1801.65,-93"/>
<text xml:space="preserve" text-anchor="start" x="1809.76" y="-106.2" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">3</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1828.65,-93 1828.65,-125.8 2002.72,-125.8 2002.72,-93 1828.65,-93"/>
<text xml:space="preserve" text-anchor="start" x="1831.65" y="-105.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads .skillsign sidecar file</text>
</g>
</g>
</svg>
`;case"errorPolicyFail":return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 14.0.4 (0)
 -->
<!-- Pages: 1 -->
<svg width="2475pt" height="210pt"
 viewBox="0.00 0.00 2475.00 210.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 195.05)">
<!-- skillconsumer -->
<g id="node1" class="node">
<title>skillconsumer</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="320.04,-180 0,-180 0,0 320.04,0 320.04,-180"/>
<text xml:space="preserve" text-anchor="start" x="92.78" y="-104" font-family="Arial" font-size="20.00" fill="#ffe0c2">Skill Consumer</text>
<text xml:space="preserve" text-anchor="start" x="22.43" y="-80.5" font-family="Arial" font-size="15.00" fill="#f9b27c">A developer who installs and uses signed</text>
<text xml:space="preserve" text-anchor="start" x="89.99" y="-62.5" font-family="Arial" font-size="15.00" fill="#f9b27c">skills in Claude Code</text>
</g>
<!-- verificationengine -->
<g id="node2" class="node">
<title>verificationengine</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1015.91,-180 678.99,-180 678.99,0 1015.91,0 1015.91,-180"/>
<text xml:space="preserve" text-anchor="start" x="764.07" y="-140.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Verification Engine</text>
<text xml:space="preserve" text-anchor="start" x="785.31" y="-119.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">ECDSA P&#45;256, X.509</text>
<text xml:space="preserve" text-anchor="start" x="705.73" y="-97.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Orchestrates verification: reads sidecar via</text>
<text xml:space="preserve" text-anchor="start" x="699.05" y="-79.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">SidecarManager, recomputes digest, verifies</text>
<text xml:space="preserve" text-anchor="start" x="712.38" y="-61.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">ECDSA P&#45;256 signature using certificate</text>
<text xml:space="preserve" text-anchor="start" x="719.46" y="-43.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">public key, validates cert chain against</text>
<text xml:space="preserve" text-anchor="start" x="726.15" y="-25.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Fulcio root via TUF TrustedRoot and</text>
</g>
<!-- policyengine -->
<g id="node3" class="node">
<title>policyengine</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1763.67,-180 1419.25,-180 1419.25,0 1763.67,0 1763.67,-180"/>
<text xml:space="preserve" text-anchor="start" x="1530.87" y="-140.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Policy Engine</text>
<text xml:space="preserve" text-anchor="start" x="1562.91" y="-119.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">YAML 1.2</text>
<text xml:space="preserve" text-anchor="start" x="1453.04" y="-97.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">[Phase 2, not yet implemented] Evaluates</text>
<text xml:space="preserve" text-anchor="start" x="1465.18" y="-79.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">trust policies with first&#45;match&#45;wins rule</text>
<text xml:space="preserve" text-anchor="start" x="1469.72" y="-61.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">evaluation, signer_org matching with</text>
<text xml:space="preserve" text-anchor="start" x="1441.37" y="-43.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">lowercase normalization, and max_age_days</text>
<text xml:space="preserve" text-anchor="start" x="1439.3" y="-25.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">enforcement against verified rekor_timestamp</text>
</g>
<!-- skillfiles -->
<g id="node4" class="node">
<title>skillfiles</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M2444.99,-163.64C2444.99,-172.67 2373.26,-180 2284.97,-180 2196.67,-180 2124.95,-172.67 2124.95,-163.64 2124.95,-163.64 2124.95,-16.36 2124.95,-16.36 2124.95,-7.33 2196.67,0 2284.97,0 2373.26,0 2444.99,-7.33 2444.99,-16.36 2444.99,-16.36 2444.99,-163.64 2444.99,-163.64"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M2444.99,-163.64C2444.99,-154.61 2373.26,-147.27 2284.97,-147.27 2196.67,-147.27 2124.95,-154.61 2124.95,-163.64"/>
<text xml:space="preserve" text-anchor="start" x="2221.06" y="-122.8" font-family="Arial" font-size="20.00" fill="#eff6ff">Skill File Store</text>
<text xml:space="preserve" text-anchor="start" x="2233.67" y="-101.1" font-family="Arial" font-size="13.00" fill="#bfdbfe">Local File System</text>
<text xml:space="preserve" text-anchor="start" x="2152.01" y="-79.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">SKILL.md files, skillsign.yaml manifests,</text>
<text xml:space="preserve" text-anchor="start" x="2209.93" y="-61.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">.skillsign sidecars, and</text>
<text xml:space="preserve" text-anchor="start" x="2147.42" y="-43.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">.skillsign&#45;policy.yaml trust policies on disk</text>
</g>
<!-- skillconsumer&#45;&gt;verificationengine -->
<g id="edge1" class="edge">
<title>skillconsumer&#45;&gt;verificationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M319.99,-90C424.3,-90 560.84,-90 668.73,-90"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="668.55,-92.63 676.05,-90 668.55,-87.38 668.55,-92.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="383.04,-93 383.04,-132.6 407.04,-132.6 407.04,-93 383.04,-93"/>
<text xml:space="preserve" text-anchor="start" x="391.15" y="-109.6" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">1</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="410.04,-93 410.04,-132.6 615.99,-132.6 615.99,-93 410.04,-93"/>
<text xml:space="preserve" text-anchor="start" x="425.11" y="-117" font-family="Arial" font-size="14.00" fill="#c9c9c9">Runs: skillsign verify &#45;&#45;policy</text>
<text xml:space="preserve" text-anchor="start" x="413.04" y="-100.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">.skillsign&#45;policy.yaml ./SKILL.md</text>
</g>
<!-- skillconsumer&#45;&gt;verificationengine -->
<g id="edge5" class="edge">
<title>skillconsumer&#45;&gt;verificationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M329.7,-34.02C346.56,-30.03 363.54,-26.63 380.04,-24.2 485.11,-8.76 513.84,-9.3 618.99,-24.2 638.73,-27 659.16,-31.1 679.3,-35.9"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="329.39,-31.39 322.73,-35.72 330.64,-36.49 329.39,-31.39"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="395.08,-27.2 395.08,-60 419.08,-60 419.08,-27.2 395.08,-27.2"/>
<text xml:space="preserve" text-anchor="start" x="403.19" y="-40.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">5</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="422.08,-27.2 422.08,-60 603.95,-60 603.95,-27.2 422.08,-27.2"/>
<text xml:space="preserve" text-anchor="start" x="425.08" y="-39.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">POLICY_FAIL — exit code 3</text>
</g>
<!-- verificationengine&#45;&gt;policyengine -->
<g id="edge2" class="edge">
<title>verificationengine&#45;&gt;policyengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1015.9,-90C1132.92,-90 1289.07,-90 1409.04,-90"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1408.91,-92.63 1416.41,-90 1408.91,-87.38 1408.91,-92.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1078.91,-93 1078.91,-132.6 1102.91,-132.6 1102.91,-93 1078.91,-93"/>
<text xml:space="preserve" text-anchor="start" x="1087.02" y="-109.6" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">2</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1105.91,-93 1105.91,-132.6 1356.25,-132.6 1356.25,-93 1105.91,-93"/>
<text xml:space="preserve" text-anchor="start" x="1136.53" y="-117" font-family="Arial" font-size="14.00" fill="#c9c9c9">Passes verified signer identity,</text>
<text xml:space="preserve" text-anchor="start" x="1108.91" y="-100.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">rekor_timestamp, and skill_id [Phase 2]</text>
</g>
<!-- verificationengine&#45;&gt;policyengine -->
<g id="edge4" class="edge">
<title>verificationengine&#45;&gt;policyengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1025.54,-33.6C1042.43,-29.79 1059.41,-26.54 1075.91,-24.2 1200.59,-6.53 1234.53,-6.8 1359.25,-24.2 1378.98,-26.95 1399.4,-30.97 1419.56,-35.68"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1025.26,-30.97 1018.55,-35.22 1026.45,-36.08 1025.26,-30.97"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1140.38,-27.2 1140.38,-60 1164.38,-60 1164.38,-27.2 1140.38,-27.2"/>
<text xml:space="preserve" text-anchor="start" x="1148.49" y="-40.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">4</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1167.38,-27.2 1167.38,-60 1294.77,-60 1294.77,-27.2 1167.38,-27.2"/>
<text xml:space="preserve" text-anchor="start" x="1170.38" y="-39.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Returns deny result</text>
</g>
<!-- policyengine&#45;&gt;skillfiles -->
<g id="edge3" class="edge">
<title>policyengine&#45;&gt;skillfiles</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1763.39,-90C1870.23,-90 2007.3,-90 2113.96,-90"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2113.66,-92.63 2121.16,-90 2113.66,-87.38 2113.66,-92.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1826.67,-93 1826.67,-132.6 1850.67,-132.6 1850.67,-93 1826.67,-93"/>
<text xml:space="preserve" text-anchor="start" x="1834.77" y="-109.6" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">3</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1853.67,-93 1853.67,-132.6 2061.95,-132.6 2061.95,-93 1853.67,-93"/>
<text xml:space="preserve" text-anchor="start" x="1856.67" y="-117" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads .skillsign&#45;policy.yaml trust</text>
<text xml:space="preserve" text-anchor="start" x="1908.39" y="-100.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">policy [Phase 2]</text>
</g>
</g>
</svg>
`;case"errorSidecarExists":return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 14.0.4 (0)
 -->
<!-- Pages: 1 -->
<svg width="2408pt" height="364pt"
 viewBox="0.00 0.00 2408.00 364.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 349.05)">
<!-- skillauthor -->
<g id="node1" class="node">
<title>skillauthor</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="343.62,-180 0,-180 0,0 343.62,0 343.62,-180"/>
<text xml:space="preserve" text-anchor="start" x="121.23" y="-104" font-family="Arial" font-size="20.00" fill="#ffe0c2">Skill Author</text>
<text xml:space="preserve" text-anchor="start" x="20.06" y="-80.5" font-family="Arial" font-size="15.00" fill="#f9b27c">A developer who creates and signs SKILL.md</text>
<text xml:space="preserve" text-anchor="start" x="109.28" y="-62.5" font-family="Arial" font-size="15.00" fill="#f9b27c">files for distribution</text>
</g>
<!-- signingengine -->
<g id="node2" class="node">
<title>signingengine</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1069.76,-180 734.52,-180 734.52,0 1069.76,0 1069.76,-180"/>
<text xml:space="preserve" text-anchor="start" x="834.86" y="-140.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Signing Engine</text>
<text xml:space="preserve" text-anchor="start" x="840" y="-119.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">ECDSA P&#45;256, X.509</text>
<text xml:space="preserve" text-anchor="start" x="780.41" y="-97.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Orchestrates the signing protocol via</text>
<text xml:space="preserve" text-anchor="start" x="754.57" y="-79.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Sigstore SDK: reads manifest, canonicalizes</text>
<text xml:space="preserve" text-anchor="start" x="761.24" y="-61.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">SKILL.md, computes digest, obtains OIDC</text>
<text xml:space="preserve" text-anchor="start" x="828.35" y="-43.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">identity token, invokes</text>
<text xml:space="preserve" text-anchor="start" x="767.07" y="-25.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">SigningContext.signer() which generates</text>
</g>
<!-- manifestreader -->
<g id="node3" class="node">
<title>manifestreader</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1732.65,-334 1412.43,-334 1412.43,-154 1732.65,-154 1732.65,-334"/>
<text xml:space="preserve" text-anchor="start" x="1499.17" y="-285.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Manifest Reader</text>
<text xml:space="preserve" text-anchor="start" x="1544" y="-264.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">YAML 1.2</text>
<text xml:space="preserve" text-anchor="start" x="1432.48" y="-242.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Reads skillsign.yaml to extract skill_id and</text>
<text xml:space="preserve" text-anchor="start" x="1443.32" y="-224.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">skill_version at signing time, with same</text>
<text xml:space="preserve" text-anchor="start" x="1446.66" y="-206.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">strict YAML parsing restrictions as the</text>
<text xml:space="preserve" text-anchor="start" x="1503.76" y="-188.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">sidecar (Section 7.3)</text>
</g>
<!-- skillfiles -->
<g id="node4" class="node">
<title>skillfiles</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M2378.19,-163.64C2378.19,-172.67 2306.46,-180 2218.17,-180 2129.87,-180 2058.15,-172.67 2058.15,-163.64 2058.15,-163.64 2058.15,-16.36 2058.15,-16.36 2058.15,-7.33 2129.87,0 2218.17,0 2306.46,0 2378.19,-7.33 2378.19,-16.36 2378.19,-16.36 2378.19,-163.64 2378.19,-163.64"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M2378.19,-163.64C2378.19,-154.61 2306.46,-147.27 2218.17,-147.27 2129.87,-147.27 2058.15,-154.61 2058.15,-163.64"/>
<text xml:space="preserve" text-anchor="start" x="2154.26" y="-122.8" font-family="Arial" font-size="20.00" fill="#eff6ff">Skill File Store</text>
<text xml:space="preserve" text-anchor="start" x="2166.87" y="-101.1" font-family="Arial" font-size="13.00" fill="#bfdbfe">Local File System</text>
<text xml:space="preserve" text-anchor="start" x="2085.21" y="-79.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">SKILL.md files, skillsign.yaml manifests,</text>
<text xml:space="preserve" text-anchor="start" x="2143.14" y="-61.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">.skillsign sidecars, and</text>
<text xml:space="preserve" text-anchor="start" x="2080.62" y="-43.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">.skillsign&#45;policy.yaml trust policies on disk</text>
</g>
<!-- skillauthor&#45;&gt;signingengine -->
<g id="edge1" class="edge">
<title>skillauthor&#45;&gt;signingengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M343.57,-90C458.05,-90 608.46,-90 724.2,-90"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="724.06,-92.63 731.56,-90 724.06,-87.38 724.06,-92.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="426.47,-93 426.47,-125.8 450.47,-125.8 450.47,-93 426.47,-93"/>
<text xml:space="preserve" text-anchor="start" x="434.58" y="-106.2" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">1</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="453.47,-93 453.47,-125.8 651.66,-125.8 651.66,-93 453.47,-93"/>
<text xml:space="preserve" text-anchor="start" x="456.47" y="-105.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Runs: skillsign sign ./SKILL.md</text>
</g>
<!-- skillauthor&#45;&gt;signingengine -->
<g id="edge5" class="edge">
<title>skillauthor&#45;&gt;signingengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M353.33,-33.42C370.2,-29.69 387.15,-26.5 403.62,-24.2 522.86,-7.54 555.32,-7.25 674.52,-24.2 694.19,-27 714.54,-31.1 734.61,-35.91"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="353.09,-30.78 346.36,-35.01 354.25,-35.9 353.09,-30.78"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="406.62,-27.2 406.62,-60 430.62,-60 430.62,-27.2 406.62,-27.2"/>
<text xml:space="preserve" text-anchor="start" x="414.73" y="-40.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">5</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="433.62,-27.2 433.62,-60 671.52,-60 671.52,-27.2 433.62,-27.2"/>
<text xml:space="preserve" text-anchor="start" x="436.62" y="-39.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Sidecar already exists — exit code 10</text>
</g>
<!-- signingengine&#45;&gt;manifestreader -->
<g id="edge2" class="edge">
<title>signingengine&#45;&gt;manifestreader</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1069.65,-128.36C1171.15,-151.75 1300.5,-181.55 1402.47,-205.05"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1401.71,-207.57 1409.61,-206.69 1402.89,-202.45 1401.71,-207.57"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1132.76,-192.79 1132.76,-225.59 1156.76,-225.59 1156.76,-192.79 1132.76,-192.79"/>
<text xml:space="preserve" text-anchor="start" x="1140.87" y="-205.99" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">2</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1159.76,-192.79 1159.76,-225.59 1349.43,-225.59 1349.43,-192.79 1159.76,-192.79"/>
<text xml:space="preserve" text-anchor="start" x="1162.76" y="-204.99" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads and validates manifest</text>
</g>
<!-- signingengine&#45;&gt;skillfiles -->
<g id="edge4" class="edge">
<title>signingengine&#45;&gt;skillfiles</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1069.61,-77.8C1169.05,-71.12 1297.89,-63.55 1412.43,-60.2 1554.69,-56.04 1590.4,-55.83 1732.65,-60.2 1837.09,-63.41 1954,-70.5 2046.82,-76.96"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2046.47,-79.56 2054.14,-77.47 2046.84,-74.33 2046.47,-79.56"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1446.72,-63.2 1446.72,-96 1470.72,-96 1470.72,-63.2 1446.72,-63.2"/>
<text xml:space="preserve" text-anchor="start" x="1454.83" y="-76.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">4</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1473.72,-63.2 1473.72,-96 1698.36,-96 1698.36,-63.2 1473.72,-63.2"/>
<text xml:space="preserve" text-anchor="start" x="1476.72" y="-75.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Checks for existing sidecar (step 3)</text>
</g>
<!-- manifestreader&#45;&gt;skillfiles -->
<g id="edge3" class="edge">
<title>manifestreader&#45;&gt;skillfiles</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1732.64,-205.93C1828.28,-183.05 1949.95,-153.94 2047.43,-130.61"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2047.76,-133.23 2054.45,-128.93 2046.54,-128.13 2047.76,-133.23"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1795.65,-192.79 1795.65,-225.59 1819.65,-225.59 1819.65,-192.79 1795.65,-192.79"/>
<text xml:space="preserve" text-anchor="start" x="1803.76" y="-205.99" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">3</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1822.65,-192.79 1822.65,-225.59 1995.15,-225.59 1995.15,-192.79 1822.65,-192.79"/>
<text xml:space="preserve" text-anchor="start" x="1825.65" y="-204.99" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads skillsign.yaml — OK</text>
</g>
</g>
</svg>
`;case"errorSigningInfra":return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 14.0.4 (0)
 -->
<!-- Pages: 1 -->
<svg width="1841pt" height="939pt"
 viewBox="0.00 0.00 1841.00 939.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 923.85)">
<!-- skillauthor -->
<g id="node1" class="node">
<title>skillauthor</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="343.62,-470 0,-470 0,-290 343.62,-290 343.62,-470"/>
<text xml:space="preserve" text-anchor="start" x="121.23" y="-394" font-family="Arial" font-size="20.00" fill="#ffe0c2">Skill Author</text>
<text xml:space="preserve" text-anchor="start" x="20.06" y="-370.5" font-family="Arial" font-size="15.00" fill="#f9b27c">A developer who creates and signs SKILL.md</text>
<text xml:space="preserve" text-anchor="start" x="109.28" y="-352.5" font-family="Arial" font-size="15.00" fill="#f9b27c">files for distribution</text>
</g>
<!-- signingengine -->
<g id="node2" class="node">
<title>signingengine</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1053.41,-470 718.16,-470 718.16,-290 1053.41,-290 1053.41,-470"/>
<text xml:space="preserve" text-anchor="start" x="818.51" y="-430.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Signing Engine</text>
<text xml:space="preserve" text-anchor="start" x="823.65" y="-409.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">ECDSA P&#45;256, X.509</text>
<text xml:space="preserve" text-anchor="start" x="764.06" y="-387.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Orchestrates the signing protocol via</text>
<text xml:space="preserve" text-anchor="start" x="738.22" y="-369.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Sigstore SDK: reads manifest, canonicalizes</text>
<text xml:space="preserve" text-anchor="start" x="744.89" y="-351.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">SKILL.md, computes digest, obtains OIDC</text>
<text xml:space="preserve" text-anchor="start" x="812" y="-333.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">identity token, invokes</text>
<text xml:space="preserve" text-anchor="start" x="750.72" y="-315.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">SigningContext.signer() which generates</text>
</g>
<!-- authhandler -->
<g id="node3" class="node">
<title>authhandler</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1811.18,-760 1447.41,-760 1447.41,-580 1811.18,-580 1811.18,-760"/>
<text xml:space="preserve" text-anchor="start" x="1570.92" y="-720.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Auth Handler</text>
<text xml:space="preserve" text-anchor="start" x="1613.04" y="-699.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">OIDC</text>
<text xml:space="preserve" text-anchor="start" x="1497.56" y="-677.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Obtains OIDC identity token for signing.</text>
<text xml:space="preserve" text-anchor="start" x="1485.08" y="-659.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Detects ambient CI credentials first (GitHub</text>
<text xml:space="preserve" text-anchor="start" x="1572.19" y="-641.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Actions OIDC via</text>
<text xml:space="preserve" text-anchor="start" x="1490.99" y="-623.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">detect_credential(&quot;sigstore&quot;) with client ID</text>
<text xml:space="preserve" text-anchor="start" x="1467.46" y="-605.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">_SIGSTORE_CLIENT_ID=&quot;sigstore&quot;). Falls back</text>
</g>
<!-- fulcio -->
<g id="node4" class="node">
<title>fulcio</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="1789.31,-470 1469.27,-470 1469.27,-290 1789.31,-290 1789.31,-470"/>
<text xml:space="preserve" text-anchor="start" x="1585.95" y="-412" font-family="Arial" font-size="20.00" fill="#f8fafc">Fulcio CA</text>
<text xml:space="preserve" text-anchor="start" x="1498.82" y="-388.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">Sigstore certificate authority that issues</text>
<text xml:space="preserve" text-anchor="start" x="1497.98" y="-370.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">short&#45;lived certificates binding a verified</text>
<text xml:space="preserve" text-anchor="start" x="1506.72" y="-352.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">GitHub identity to a signer&#45;generated</text>
<text xml:space="preserve" text-anchor="start" x="1558.42" y="-334.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">ephemeral public key</text>
</g>
<!-- rekor -->
<g id="node5" class="node">
<title>rekor</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="1798.61,-180 1459.97,-180 1459.97,0 1798.61,0 1798.61,-180"/>
<text xml:space="preserve" text-anchor="start" x="1519.24" y="-104" font-family="Arial" font-size="20.00" fill="#f8fafc">Rekor Transparency Log</text>
<text xml:space="preserve" text-anchor="start" x="1480.03" y="-80.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">Append&#45;only, publicly auditable log recording</text>
<text xml:space="preserve" text-anchor="start" x="1512.15" y="-62.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">signatures, certificates, and digests</text>
</g>
<!-- skillauthor&#45;&gt;signingengine -->
<g id="edge1" class="edge">
<title>skillauthor&#45;&gt;signingengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M343.35,-380C453.55,-380 596.66,-380 708.07,-380"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="707.88,-382.63 715.38,-380 707.88,-377.38 707.88,-382.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="408.56,-383 408.56,-422.6 432.56,-422.6 432.56,-383 408.56,-383"/>
<text xml:space="preserve" text-anchor="start" x="416.67" y="-399.6" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">1</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="435.56,-383 435.56,-422.6 653.22,-422.6 653.22,-383 435.56,-383"/>
<text xml:space="preserve" text-anchor="start" x="438.56" y="-407" font-family="Arial" font-size="14.00" fill="#c9c9c9">Manifest and canonical form valid,</text>
<text xml:space="preserve" text-anchor="start" x="499.64" y="-390.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">begins signing</text>
</g>
<!-- skillauthor&#45;&gt;signingengine -->
<g id="edge7" class="edge">
<title>skillauthor&#45;&gt;signingengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M353.38,-317.52C370.21,-313.42 387.13,-309.93 403.62,-307.4 515.44,-290.23 546.39,-289.93 658.16,-307.4 677.86,-310.48 698.18,-314.97 718.19,-320.25"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="353.06,-314.89 346.42,-319.26 354.33,-319.99 353.06,-314.89"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="406.62,-310.4 406.62,-350 430.62,-350 430.62,-310.4 406.62,-310.4"/>
<text xml:space="preserve" text-anchor="start" x="414.73" y="-327" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">7</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="433.62,-310.4 433.62,-350 655.16,-350 655.16,-310.4 433.62,-310.4"/>
<text xml:space="preserve" text-anchor="start" x="436.62" y="-334.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Signing infrastructure failure — exit</text>
<text xml:space="preserve" text-anchor="start" x="519.48" y="-317.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">code 10</text>
</g>
<!-- signingengine&#45;&gt;signingengine -->
<g id="edge5" class="edge">
<title>signingengine&#45;&gt;signingengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M824.08,-469.98C808.9,-526.28 829.47,-580 885.79,-580 938.7,-580 960.06,-532.58 949.86,-480.17"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="952.43,-479.64 948.18,-472.93 947.32,-480.83 952.43,-479.64"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="740.5,-583 740.5,-615.8 764.5,-615.8 764.5,-583 740.5,-583"/>
<text xml:space="preserve" text-anchor="start" x="748.61" y="-596.2" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">5</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="767.5,-583 767.5,-615.8 1031.08,-615.8 1031.08,-583 767.5,-583"/>
<text xml:space="preserve" text-anchor="start" x="770.5" y="-595.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Local ECDSA signing fails — exit code 10</text>
</g>
<!-- signingengine&#45;&gt;authhandler -->
<g id="edge2" class="edge">
<title>signingengine&#45;&gt;authhandler</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1053.2,-445.08C1167.32,-489.71 1319,-549.04 1437.93,-595.55"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1436.76,-597.91 1444.7,-598.2 1438.67,-593.02 1436.76,-597.91"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1139.36,-570.92 1139.36,-603.72 1163.36,-603.72 1163.36,-570.92 1139.36,-570.92"/>
<text xml:space="preserve" text-anchor="start" x="1147.46" y="-584.12" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">2</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1166.36,-570.92 1166.36,-603.72 1361.46,-603.72 1361.46,-570.92 1166.36,-570.92"/>
<text xml:space="preserve" text-anchor="start" x="1169.36" y="-583.12" font-family="Arial" font-size="14.00" fill="#c9c9c9">Requests OIDC authentication</text>
</g>
<!-- signingengine&#45;&gt;fulcio -->
<g id="edge4" class="edge">
<title>signingengine&#45;&gt;fulcio</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1053.2,-380C1174.26,-380 1337.6,-380 1459.27,-380"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1458.9,-382.63 1466.4,-380 1458.9,-377.38 1458.9,-382.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1120.69,-383 1120.69,-422.6 1144.69,-422.6 1144.69,-383 1120.69,-383"/>
<text xml:space="preserve" text-anchor="start" x="1128.8" y="-399.6" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">4</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1147.69,-383 1147.69,-422.6 1380.13,-422.6 1380.13,-383 1147.69,-383"/>
<text xml:space="preserve" text-anchor="start" x="1150.69" y="-407" font-family="Arial" font-size="14.00" fill="#c9c9c9">Certificate issuance fails — exit code</text>
<text xml:space="preserve" text-anchor="start" x="1256.12" y="-390.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">10</text>
</g>
<!-- signingengine&#45;&gt;rekor -->
<g id="edge6" class="edge">
<title>signingengine&#45;&gt;rekor</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1053.2,-314.92C1171.37,-268.7 1329.82,-206.73 1450.48,-159.54"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1451.35,-162.02 1457.38,-156.84 1449.44,-157.13 1451.35,-162.02"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1116.41,-289.2 1116.41,-322 1140.41,-322 1140.41,-289.2 1116.41,-289.2"/>
<text xml:space="preserve" text-anchor="start" x="1124.52" y="-302.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">6</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1143.41,-289.2 1143.41,-322 1384.41,-322 1384.41,-289.2 1143.41,-289.2"/>
<text xml:space="preserve" text-anchor="start" x="1146.41" y="-301.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Rekor submission fails — exit code 10</text>
</g>
<!-- authhandler&#45;&gt;authhandler -->
<g id="edge3" class="edge">
<title>authhandler&#45;&gt;authhandler</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1563.41,-759.98C1547.21,-816.28 1569.17,-870 1629.29,-870 1685.78,-870 1708.58,-822.58 1697.7,-770.17"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1700.25,-769.57 1695.9,-762.92 1695.16,-770.83 1700.25,-769.57"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1487.89,-873 1487.89,-905.8 1511.89,-905.8 1511.89,-873 1487.89,-873"/>
<text xml:space="preserve" text-anchor="start" x="1496" y="-886.2" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">3</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1514.89,-873 1514.89,-905.8 1770.69,-905.8 1770.69,-873 1514.89,-873"/>
<text xml:space="preserve" text-anchor="start" x="1517.89" y="-885.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">OIDC authentication fails — exit code 10</text>
</g>
</g>
</svg>
`;case"errorSkillIdMismatch":return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 14.0.4 (0)
 -->
<!-- Pages: 1 -->
<svg width="1079pt" height="359pt"
 viewBox="0.00 0.00 1079.00 359.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 343.85)">
<!-- skillconsumer -->
<g id="node1" class="node">
<title>skillconsumer</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="320.04,-180 0,-180 0,0 320.04,0 320.04,-180"/>
<text xml:space="preserve" text-anchor="start" x="92.78" y="-104" font-family="Arial" font-size="20.00" fill="#ffe0c2">Skill Consumer</text>
<text xml:space="preserve" text-anchor="start" x="22.43" y="-80.5" font-family="Arial" font-size="15.00" fill="#f9b27c">A developer who installs and uses signed</text>
<text xml:space="preserve" text-anchor="start" x="89.99" y="-62.5" font-family="Arial" font-size="15.00" fill="#f9b27c">skills in Claude Code</text>
</g>
<!-- verificationengine -->
<g id="node2" class="node">
<title>verificationengine</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1049.37,-180 712.45,-180 712.45,0 1049.37,0 1049.37,-180"/>
<text xml:space="preserve" text-anchor="start" x="797.53" y="-140.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Verification Engine</text>
<text xml:space="preserve" text-anchor="start" x="818.77" y="-119.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">ECDSA P&#45;256, X.509</text>
<text xml:space="preserve" text-anchor="start" x="739.19" y="-97.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Orchestrates verification: reads sidecar via</text>
<text xml:space="preserve" text-anchor="start" x="732.51" y="-79.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">SidecarManager, recomputes digest, verifies</text>
<text xml:space="preserve" text-anchor="start" x="745.85" y="-61.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">ECDSA P&#45;256 signature using certificate</text>
<text xml:space="preserve" text-anchor="start" x="752.93" y="-43.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">public key, validates cert chain against</text>
<text xml:space="preserve" text-anchor="start" x="759.62" y="-25.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Fulcio root via TUF TrustedRoot and</text>
</g>
<!-- skillconsumer&#45;&gt;verificationengine -->
<g id="edge1" class="edge">
<title>skillconsumer&#45;&gt;verificationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M319.67,-90C432.76,-90 584.89,-90 702.08,-90"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="702.07,-92.63 709.57,-90 702.07,-87.38 702.07,-92.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="383.04,-93 383.04,-132.6 407.04,-132.6 407.04,-93 383.04,-93"/>
<text xml:space="preserve" text-anchor="start" x="391.15" y="-109.6" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">1</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="410.04,-93 410.04,-132.6 649.45,-132.6 649.45,-93 410.04,-93"/>
<text xml:space="preserve" text-anchor="start" x="413.04" y="-117" font-family="Arial" font-size="14.00" fill="#c9c9c9">Runs: skillsign verify ./SKILL.md — all</text>
<text xml:space="preserve" text-anchor="start" x="470.22" y="-100.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">crypto checks pass</text>
</g>
<!-- skillconsumer&#45;&gt;verificationengine -->
<g id="edge3" class="edge">
<title>skillconsumer&#45;&gt;verificationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M329.7,-34.02C346.56,-30.03 363.54,-26.63 380.04,-24.2 499.83,-6.6 532.58,-7.21 652.45,-24.2 672.19,-27 692.62,-31.1 712.76,-35.9"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="329.39,-31.39 322.73,-35.72 330.64,-36.49 329.39,-31.39"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="384.98,-27.2 384.98,-60 408.98,-60 408.98,-27.2 384.98,-27.2"/>
<text xml:space="preserve" text-anchor="start" x="393.09" y="-40.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">3</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="411.98,-27.2 411.98,-60 647.51,-60 647.51,-27.2 411.98,-27.2"/>
<text xml:space="preserve" text-anchor="start" x="414.98" y="-39.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">SKILL_ID_MISMATCH — exit code 1</text>
</g>
<!-- verificationengine&#45;&gt;verificationengine -->
<g id="edge2" class="edge">
<title>verificationengine&#45;&gt;verificationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M817.5,-179.98C801.91,-236.28 823.04,-290 880.91,-290 935.28,-290 957.22,-242.58 946.75,-190.17"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="949.32,-189.61 945.02,-182.93 944.21,-190.83 949.32,-189.61"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="754.7,-293 754.7,-325.8 778.7,-325.8 778.7,-293 754.7,-293"/>
<text xml:space="preserve" text-anchor="start" x="762.81" y="-306.2" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">2</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="781.7,-293 781.7,-325.8 1007.13,-325.8 1007.13,-293 781.7,-293"/>
<text xml:space="preserve" text-anchor="start" x="784.7" y="-305.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Owner&#45;path consistency check fails</text>
</g>
</g>
</svg>
`;case"errorTampered":return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 14.0.4 (0)
 -->
<!-- Pages: 1 -->
<svg width="2427pt" height="759pt"
 viewBox="0.00 0.00 2427.00 759.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 744.05)">
<!-- skillconsumer -->
<g id="node1" class="node">
<title>skillconsumer</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="320.04,-490 0,-490 0,-310 320.04,-310 320.04,-490"/>
<text xml:space="preserve" text-anchor="start" x="92.78" y="-414" font-family="Arial" font-size="20.00" fill="#ffe0c2">Skill Consumer</text>
<text xml:space="preserve" text-anchor="start" x="22.43" y="-390.5" font-family="Arial" font-size="15.00" fill="#f9b27c">A developer who installs and uses signed</text>
<text xml:space="preserve" text-anchor="start" x="89.99" y="-372.5" font-family="Arial" font-size="15.00" fill="#f9b27c">skills in Claude Code</text>
</g>
<!-- verificationengine -->
<g id="node2" class="node">
<title>verificationengine</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1015.92,-490 679,-490 679,-310 1015.92,-310 1015.92,-490"/>
<text xml:space="preserve" text-anchor="start" x="764.07" y="-450.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Verification Engine</text>
<text xml:space="preserve" text-anchor="start" x="785.31" y="-429.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">ECDSA P&#45;256, X.509</text>
<text xml:space="preserve" text-anchor="start" x="705.73" y="-407.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Orchestrates verification: reads sidecar via</text>
<text xml:space="preserve" text-anchor="start" x="699.05" y="-389.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">SidecarManager, recomputes digest, verifies</text>
<text xml:space="preserve" text-anchor="start" x="712.39" y="-371.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">ECDSA P&#45;256 signature using certificate</text>
<text xml:space="preserve" text-anchor="start" x="719.47" y="-353.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">public key, validates cert chain against</text>
<text xml:space="preserve" text-anchor="start" x="726.16" y="-335.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Fulcio root via TUF TrustedRoot and</text>
</g>
<!-- sidecarmanager -->
<g id="node3" class="node">
<title>sidecarmanager</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1771.35,-729 1416.94,-729 1416.94,-549 1771.35,-549 1771.35,-729"/>
<text xml:space="preserve" text-anchor="start" x="1517.99" y="-689.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Sidecar Manager</text>
<text xml:space="preserve" text-anchor="start" x="1565.6" y="-668.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">YAML 1.2</text>
<text xml:space="preserve" text-anchor="start" x="1449.9" y="-646.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Implemented as a single sidecar.py module</text>
<text xml:space="preserve" text-anchor="start" x="1474.94" y="-628.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">combining reader and writer. Writer:</text>
<text xml:space="preserve" text-anchor="start" x="1436.99" y="-610.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">assembles canonical field&#45;ordered YAML (PEM</text>
<text xml:space="preserve" text-anchor="start" x="1462.43" y="-592.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">fields as literal block scalars) and writes</text>
<text xml:space="preserve" text-anchor="start" x="1460.34" y="-574.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">atomically via temp file rename. Reader:</text>
</g>
<!-- skillfiles -->
<g id="node4" class="node">
<title>skillfiles</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M2396.67,-558.64C2396.67,-567.67 2324.95,-575 2236.65,-575 2148.36,-575 2076.63,-567.67 2076.63,-558.64 2076.63,-558.64 2076.63,-411.36 2076.63,-411.36 2076.63,-402.33 2148.36,-395 2236.65,-395 2324.95,-395 2396.67,-402.33 2396.67,-411.36 2396.67,-411.36 2396.67,-558.64 2396.67,-558.64"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M2396.67,-558.64C2396.67,-549.61 2324.95,-542.27 2236.65,-542.27 2148.36,-542.27 2076.63,-549.61 2076.63,-558.64"/>
<text xml:space="preserve" text-anchor="start" x="2172.75" y="-517.8" font-family="Arial" font-size="20.00" fill="#eff6ff">Skill File Store</text>
<text xml:space="preserve" text-anchor="start" x="2185.36" y="-496.1" font-family="Arial" font-size="13.00" fill="#bfdbfe">Local File System</text>
<text xml:space="preserve" text-anchor="start" x="2103.69" y="-474.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">SKILL.md files, skillsign.yaml manifests,</text>
<text xml:space="preserve" text-anchor="start" x="2161.62" y="-456.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">.skillsign sidecars, and</text>
<text xml:space="preserve" text-anchor="start" x="2099.11" y="-438.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">.skillsign&#45;policy.yaml trust policies on disk</text>
</g>
<!-- canonicalprocessor -->
<g id="node5" class="node">
<title>canonicalprocessor</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1761.78,-180 1426.51,-180 1426.51,0 1761.78,0 1761.78,-180"/>
<text xml:space="preserve" text-anchor="start" x="1475.77" y="-140.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Canonical Form Processor</text>
<text xml:space="preserve" text-anchor="start" x="1545.74" y="-119.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">UTF&#45;8, SHA&#45;256</text>
<text xml:space="preserve" text-anchor="start" x="1468.24" y="-97.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Implemented across canonical.py and</text>
<text xml:space="preserve" text-anchor="start" x="1446.56" y="-79.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">digest.py. canonical.py: 8&#45;step normalization</text>
<text xml:space="preserve" text-anchor="start" x="1461.61" y="-61.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">(BOM strip, CRLF normalization, trailing</text>
<text xml:space="preserve" text-anchor="start" x="1464.5" y="-43.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">whitespace trim, single trailing newline,</text>
<text xml:space="preserve" text-anchor="start" x="1478.68" y="-25.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">UTF&#45;8 encode, null&#45;byte rejection).</text>
</g>
<!-- skillconsumer&#45;&gt;verificationengine -->
<g id="edge1" class="edge">
<title>skillconsumer&#45;&gt;verificationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M320,-400C424.3,-400 560.84,-400 668.73,-400"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="668.55,-402.63 676.05,-400 668.55,-397.38 668.55,-402.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="383.04,-403 383.04,-435.8 407.04,-435.8 407.04,-403 383.04,-403"/>
<text xml:space="preserve" text-anchor="start" x="391.15" y="-416.2" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">1</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="410.04,-403 410.04,-435.8 616,-435.8 616,-403 410.04,-403"/>
<text xml:space="preserve" text-anchor="start" x="413.04" y="-415.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Runs: skillsign verify ./SKILL.md</text>
</g>
<!-- skillconsumer&#45;&gt;verificationengine -->
<g id="edge6" class="edge">
<title>skillconsumer&#45;&gt;verificationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M329.7,-344.02C346.56,-340.03 363.54,-336.63 380.04,-334.2 485.11,-318.76 513.85,-319.3 619,-334.2 638.74,-337 659.16,-341.1 679.3,-345.9"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="329.39,-341.39 322.73,-345.72 330.64,-346.49 329.39,-341.39"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="400.55,-337.2 400.55,-370 424.55,-370 424.55,-337.2 400.55,-337.2"/>
<text xml:space="preserve" text-anchor="start" x="408.65" y="-350.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">6</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="427.55,-337.2 427.55,-370 598.49,-370 598.49,-337.2 427.55,-337.2"/>
<text xml:space="preserve" text-anchor="start" x="430.55" y="-349.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">TAMPERED — exit code 1</text>
</g>
<!-- verificationengine&#45;&gt;sidecarmanager -->
<g id="edge2" class="edge">
<title>verificationengine&#45;&gt;sidecarmanager</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1015.77,-462.28C1035.98,-469.44 1056.37,-476.49 1075.92,-483 1184.96,-519.31 1308.13,-556.6 1406.91,-585.62"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1406.16,-588.13 1414.09,-587.72 1407.64,-583.09 1406.16,-588.13"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1098.76,-573.68 1098.76,-606.48 1122.76,-606.48 1122.76,-573.68 1098.76,-573.68"/>
<text xml:space="preserve" text-anchor="start" x="1106.87" y="-586.88" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">2</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1125.76,-573.68 1125.76,-606.48 1334.09,-606.48 1334.09,-573.68 1125.76,-573.68"/>
<text xml:space="preserve" text-anchor="start" x="1128.76" y="-585.88" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads and parses sidecar — OK</text>
</g>
<!-- verificationengine&#45;&gt;skillfiles -->
<g id="edge5" class="edge">
<title>verificationengine&#45;&gt;skillfiles</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1015.61,-409.78C1200.5,-420.65 1507.22,-438.82 1771.35,-455.2 1868.77,-461.24 1977.68,-468.22 2065.51,-473.9"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2065.17,-476.51 2072.83,-474.38 2065.51,-471.27 2065.17,-476.51"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1495.16,-458.2 1495.16,-491 1519.16,-491 1519.16,-458.2 1495.16,-458.2"/>
<text xml:space="preserve" text-anchor="start" x="1503.27" y="-471.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">5</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1522.16,-458.2 1522.16,-491 1693.13,-491 1693.13,-458.2 1522.16,-458.2"/>
<text xml:space="preserve" text-anchor="start" x="1525.16" y="-470.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads SKILL.md file bytes</text>
</g>
<!-- verificationengine&#45;&gt;canonicalprocessor -->
<g id="edge4" class="edge">
<title>verificationengine&#45;&gt;canonicalprocessor</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1009.51,-310.13C1031.58,-298.89 1054.14,-287.93 1075.92,-278.2 1187.05,-228.53 1315.66,-181.69 1416.83,-147.16"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1417.41,-149.74 1423.67,-144.84 1415.72,-144.77 1417.41,-149.74"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1078.92,-281.2 1078.92,-314 1102.92,-314 1102.92,-281.2 1078.92,-281.2"/>
<text xml:space="preserve" text-anchor="start" x="1087.02" y="-294.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">4</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1105.92,-281.2 1105.92,-314 1353.94,-314 1353.94,-281.2 1105.92,-281.2"/>
<text xml:space="preserve" text-anchor="start" x="1108.92" y="-293.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Recomputes canonical form and digest</text>
</g>
<!-- sidecarmanager&#45;&gt;skillfiles -->
<g id="edge3" class="edge">
<title>sidecarmanager&#45;&gt;skillfiles</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1771.01,-596.72C1862.84,-574.64 1974.7,-547.74 2065.65,-525.87"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2066.17,-528.45 2072.85,-524.14 2064.94,-523.34 2066.17,-528.45"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1834.35,-583.32 1834.35,-616.12 1858.35,-616.12 1858.35,-583.32 1834.35,-583.32"/>
<text xml:space="preserve" text-anchor="start" x="1842.46" y="-596.52" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">3</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1861.35,-583.32 1861.35,-616.12 2013.63,-616.12 2013.63,-583.32 1861.35,-583.32"/>
<text xml:space="preserve" text-anchor="start" x="1864.35" y="-595.52" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads .skillsign sidecar</text>
</g>
</g>
</svg>
`;case"errorUnsigned":return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 14.0.4 (0)
 -->
<!-- Pages: 1 -->
<svg width="2438pt" height="210pt"
 viewBox="0.00 0.00 2438.00 210.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 195.05)">
<!-- skillconsumer -->
<g id="node1" class="node">
<title>skillconsumer</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="320.04,-180 0,-180 0,0 320.04,0 320.04,-180"/>
<text xml:space="preserve" text-anchor="start" x="92.78" y="-104" font-family="Arial" font-size="20.00" fill="#ffe0c2">Skill Consumer</text>
<text xml:space="preserve" text-anchor="start" x="22.43" y="-80.5" font-family="Arial" font-size="15.00" fill="#f9b27c">A developer who installs and uses signed</text>
<text xml:space="preserve" text-anchor="start" x="89.99" y="-62.5" font-family="Arial" font-size="15.00" fill="#f9b27c">skills in Claude Code</text>
</g>
<!-- verificationengine -->
<g id="node2" class="node">
<title>verificationengine</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1015.92,-180 679,-180 679,0 1015.92,0 1015.92,-180"/>
<text xml:space="preserve" text-anchor="start" x="764.07" y="-140.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Verification Engine</text>
<text xml:space="preserve" text-anchor="start" x="785.31" y="-119.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">ECDSA P&#45;256, X.509</text>
<text xml:space="preserve" text-anchor="start" x="705.73" y="-97.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Orchestrates verification: reads sidecar via</text>
<text xml:space="preserve" text-anchor="start" x="699.05" y="-79.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">SidecarManager, recomputes digest, verifies</text>
<text xml:space="preserve" text-anchor="start" x="712.39" y="-61.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">ECDSA P&#45;256 signature using certificate</text>
<text xml:space="preserve" text-anchor="start" x="719.47" y="-43.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">public key, validates cert chain against</text>
<text xml:space="preserve" text-anchor="start" x="726.16" y="-25.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Fulcio root via TUF TrustedRoot and</text>
</g>
<!-- sidecarmanager -->
<g id="node3" class="node">
<title>sidecarmanager</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1691.98,-180 1337.56,-180 1337.56,0 1691.98,0 1691.98,-180"/>
<text xml:space="preserve" text-anchor="start" x="1438.62" y="-140.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Sidecar Manager</text>
<text xml:space="preserve" text-anchor="start" x="1486.23" y="-119.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">YAML 1.2</text>
<text xml:space="preserve" text-anchor="start" x="1370.53" y="-97.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Implemented as a single sidecar.py module</text>
<text xml:space="preserve" text-anchor="start" x="1395.56" y="-79.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">combining reader and writer. Writer:</text>
<text xml:space="preserve" text-anchor="start" x="1357.62" y="-61.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">assembles canonical field&#45;ordered YAML (PEM</text>
<text xml:space="preserve" text-anchor="start" x="1383.06" y="-43.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">fields as literal block scalars) and writes</text>
<text xml:space="preserve" text-anchor="start" x="1380.97" y="-25.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">atomically via temp file rename. Reader:</text>
</g>
<!-- skillfiles -->
<g id="node4" class="node">
<title>skillfiles</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M2407.57,-163.64C2407.57,-172.67 2335.85,-180 2247.55,-180 2159.25,-180 2087.53,-172.67 2087.53,-163.64 2087.53,-163.64 2087.53,-16.36 2087.53,-16.36 2087.53,-7.33 2159.25,0 2247.55,0 2335.85,0 2407.57,-7.33 2407.57,-16.36 2407.57,-16.36 2407.57,-163.64 2407.57,-163.64"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M2407.57,-163.64C2407.57,-154.61 2335.85,-147.27 2247.55,-147.27 2159.25,-147.27 2087.53,-154.61 2087.53,-163.64"/>
<text xml:space="preserve" text-anchor="start" x="2183.64" y="-122.8" font-family="Arial" font-size="20.00" fill="#eff6ff">Skill File Store</text>
<text xml:space="preserve" text-anchor="start" x="2196.26" y="-101.1" font-family="Arial" font-size="13.00" fill="#bfdbfe">Local File System</text>
<text xml:space="preserve" text-anchor="start" x="2114.59" y="-79.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">SKILL.md files, skillsign.yaml manifests,</text>
<text xml:space="preserve" text-anchor="start" x="2172.52" y="-61.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">.skillsign sidecars, and</text>
<text xml:space="preserve" text-anchor="start" x="2110.01" y="-43.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">.skillsign&#45;policy.yaml trust policies on disk</text>
</g>
<!-- skillconsumer&#45;&gt;verificationengine -->
<g id="edge1" class="edge">
<title>skillconsumer&#45;&gt;verificationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M320,-90C424.3,-90 560.84,-90 668.73,-90"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="668.55,-92.63 676.05,-90 668.55,-87.38 668.55,-92.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="383.04,-93 383.04,-125.8 407.04,-125.8 407.04,-93 383.04,-93"/>
<text xml:space="preserve" text-anchor="start" x="391.15" y="-106.2" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">1</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="410.04,-93 410.04,-125.8 616,-125.8 616,-93 410.04,-93"/>
<text xml:space="preserve" text-anchor="start" x="413.04" y="-105.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Runs: skillsign verify ./SKILL.md</text>
</g>
<!-- skillconsumer&#45;&gt;verificationengine -->
<g id="edge4" class="edge">
<title>skillconsumer&#45;&gt;verificationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M329.7,-34.02C346.56,-30.03 363.54,-26.63 380.04,-24.2 485.11,-8.76 513.85,-9.3 619,-24.2 638.74,-27 659.16,-31.1 679.3,-35.9"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="329.39,-31.39 322.73,-35.72 330.64,-36.49 329.39,-31.39"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="402.49,-27.2 402.49,-60 426.49,-60 426.49,-27.2 402.49,-27.2"/>
<text xml:space="preserve" text-anchor="start" x="410.6" y="-40.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">4</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="429.49,-27.2 429.49,-60 596.55,-60 596.55,-27.2 429.49,-27.2"/>
<text xml:space="preserve" text-anchor="start" x="432.49" y="-39.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">UNSIGNED — exit code 2</text>
</g>
<!-- verificationengine&#45;&gt;sidecarmanager -->
<g id="edge2" class="edge">
<title>verificationengine&#45;&gt;sidecarmanager</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1015.91,-90C1110.72,-90 1229.51,-90 1327.28,-90"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1327.05,-92.63 1334.55,-90 1327.05,-87.38 1327.05,-92.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1078.92,-93 1078.92,-125.8 1102.92,-125.8 1102.92,-93 1078.92,-93"/>
<text xml:space="preserve" text-anchor="start" x="1087.02" y="-106.2" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">2</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1105.92,-93 1105.92,-125.8 1274.56,-125.8 1274.56,-93 1105.92,-93"/>
<text xml:space="preserve" text-anchor="start" x="1108.92" y="-105.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads and parses sidecar</text>
</g>
<!-- sidecarmanager&#45;&gt;skillfiles -->
<g id="edge3" class="edge">
<title>sidecarmanager&#45;&gt;skillfiles</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1691.74,-90C1808.48,-90 1960.87,-90 2076.4,-90"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2076.23,-92.63 2083.73,-90 2076.23,-87.38 2076.23,-92.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1754.98,-93 1754.98,-132.6 1778.98,-132.6 1778.98,-93 1754.98,-93"/>
<text xml:space="preserve" text-anchor="start" x="1763.09" y="-109.6" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">3</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1781.98,-93 1781.98,-132.6 2024.53,-132.6 2024.53,-93 1781.98,-93"/>
<text xml:space="preserve" text-anchor="start" x="1784.98" y="-117" font-family="Arial" font-size="14.00" fill="#c9c9c9">Looks for SKILL.md.skillsign — file not</text>
<text xml:space="preserve" text-anchor="start" x="1885.74" y="-100.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">found</text>
</g>
</g>
</svg>
`;case"policyVerificationFlow":return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 14.0.4 (0)
 -->
<!-- Pages: 1 -->
<svg width="2583pt" height="512pt"
 viewBox="0.00 0.00 2583.00 512.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 497.05)">
<!-- skillconsumer -->
<g id="node1" class="node">
<title>skillconsumer</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="320.04,-321 0,-321 0,-141 320.04,-141 320.04,-321"/>
<text xml:space="preserve" text-anchor="start" x="92.78" y="-245" font-family="Arial" font-size="20.00" fill="#ffe0c2">Skill Consumer</text>
<text xml:space="preserve" text-anchor="start" x="22.43" y="-221.5" font-family="Arial" font-size="15.00" fill="#f9b27c">A developer who installs and uses signed</text>
<text xml:space="preserve" text-anchor="start" x="89.99" y="-203.5" font-family="Arial" font-size="15.00" fill="#f9b27c">skills in Claude Code</text>
</g>
<!-- verificationengine -->
<g id="node2" class="node">
<title>verificationengine</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1075.81,-321 738.89,-321 738.89,-141 1075.81,-141 1075.81,-321"/>
<text xml:space="preserve" text-anchor="start" x="823.96" y="-281.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Verification Engine</text>
<text xml:space="preserve" text-anchor="start" x="845.2" y="-260.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">ECDSA P&#45;256, X.509</text>
<text xml:space="preserve" text-anchor="start" x="765.62" y="-238.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Orchestrates verification: reads sidecar via</text>
<text xml:space="preserve" text-anchor="start" x="758.94" y="-220.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">SidecarManager, recomputes digest, verifies</text>
<text xml:space="preserve" text-anchor="start" x="772.28" y="-202.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">ECDSA P&#45;256 signature using certificate</text>
<text xml:space="preserve" text-anchor="start" x="779.36" y="-184.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">public key, validates cert chain against</text>
<text xml:space="preserve" text-anchor="start" x="786.05" y="-166.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Fulcio root via TUF TrustedRoot and</text>
</g>
<!-- rekorclient -->
<g id="node3" class="node">
<title>rekorclient</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1814.39,-482 1488.32,-482 1488.32,-302 1814.39,-302 1814.39,-482"/>
<text xml:space="preserve" text-anchor="start" x="1596.33" y="-442.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Rekor Client</text>
<text xml:space="preserve" text-anchor="start" x="1609.1" y="-421.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">HTTPS, JSON</text>
<text xml:space="preserve" text-anchor="start" x="1511.71" y="-399.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Wraps Rekor transparency log queries via</text>
<text xml:space="preserve" text-anchor="start" x="1508.37" y="-381.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">infra/rekor.py. Fetches log entries by log ID</text>
<text xml:space="preserve" text-anchor="start" x="1560.06" y="-363.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">using the Rekor search API</text>
<text xml:space="preserve" text-anchor="start" x="1528.8" y="-345.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">(/api/v1/log/entries/retrieve). Used by</text>
<text xml:space="preserve" text-anchor="start" x="1530.88" y="-327.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">verification engine in &#45;&#45;strict mode to</text>
</g>
<!-- rekor -->
<g id="node4" class="node">
<title>rekor</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="2553.07,-482 2214.43,-482 2214.43,-302 2553.07,-302 2553.07,-482"/>
<text xml:space="preserve" text-anchor="start" x="2273.7" y="-406" font-family="Arial" font-size="20.00" fill="#f8fafc">Rekor Transparency Log</text>
<text xml:space="preserve" text-anchor="start" x="2234.49" y="-382.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">Append&#45;only, publicly auditable log recording</text>
<text xml:space="preserve" text-anchor="start" x="2266.61" y="-364.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">signatures, certificates, and digests</text>
</g>
<!-- policyengine -->
<g id="node5" class="node">
<title>policyengine</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1823.56,-180 1479.14,-180 1479.14,0 1823.56,0 1823.56,-180"/>
<text xml:space="preserve" text-anchor="start" x="1590.76" y="-140.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Policy Engine</text>
<text xml:space="preserve" text-anchor="start" x="1622.81" y="-119.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">YAML 1.2</text>
<text xml:space="preserve" text-anchor="start" x="1512.94" y="-97.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">[Phase 2, not yet implemented] Evaluates</text>
<text xml:space="preserve" text-anchor="start" x="1525.07" y="-79.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">trust policies with first&#45;match&#45;wins rule</text>
<text xml:space="preserve" text-anchor="start" x="1529.62" y="-61.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">evaluation, signer_org matching with</text>
<text xml:space="preserve" text-anchor="start" x="1501.27" y="-43.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">lowercase normalization, and max_age_days</text>
<text xml:space="preserve" text-anchor="start" x="1499.2" y="-25.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">enforcement against verified rekor_timestamp</text>
</g>
<!-- skillfiles -->
<g id="node6" class="node">
<title>skillfiles</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M2543.77,-163.64C2543.77,-172.67 2472.05,-180 2383.75,-180 2295.45,-180 2223.73,-172.67 2223.73,-163.64 2223.73,-163.64 2223.73,-16.36 2223.73,-16.36 2223.73,-7.33 2295.45,0 2383.75,0 2472.05,0 2543.77,-7.33 2543.77,-16.36 2543.77,-16.36 2543.77,-163.64 2543.77,-163.64"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M2543.77,-163.64C2543.77,-154.61 2472.05,-147.27 2383.75,-147.27 2295.45,-147.27 2223.73,-154.61 2223.73,-163.64"/>
<text xml:space="preserve" text-anchor="start" x="2319.84" y="-122.8" font-family="Arial" font-size="20.00" fill="#eff6ff">Skill File Store</text>
<text xml:space="preserve" text-anchor="start" x="2332.45" y="-101.1" font-family="Arial" font-size="13.00" fill="#bfdbfe">Local File System</text>
<text xml:space="preserve" text-anchor="start" x="2250.79" y="-79.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">SKILL.md files, skillsign.yaml manifests,</text>
<text xml:space="preserve" text-anchor="start" x="2308.72" y="-61.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">.skillsign sidecars, and</text>
<text xml:space="preserve" text-anchor="start" x="2246.2" y="-43.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">.skillsign&#45;policy.yaml trust policies on disk</text>
</g>
<!-- skillconsumer&#45;&gt;verificationengine -->
<g id="edge1" class="edge">
<title>skillconsumer&#45;&gt;verificationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M320,-231C439.97,-231 604.56,-231 728.83,-231"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="728.68,-233.63 736.18,-231 728.68,-228.38 728.68,-233.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="425.05,-234 425.05,-290.4 449.05,-290.4 449.05,-234 425.05,-234"/>
<text xml:space="preserve" text-anchor="start" x="433.16" y="-259" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">1</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="452.05,-234 452.05,-290.4 633.87,-290.4 633.87,-234 452.05,-234"/>
<text xml:space="preserve" text-anchor="start" x="455.05" y="-274.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">Runs: skillsign verify &#45;&#45;policy</text>
<text xml:space="preserve" text-anchor="start" x="458.18" y="-258" font-family="Arial" font-size="14.00" fill="#c9c9c9">.skillsign&#45;policy.yaml &#45;&#45;strict</text>
<text xml:space="preserve" text-anchor="start" x="508.34" y="-241.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">./SKILL.md</text>
</g>
<!-- skillconsumer&#45;&gt;verificationengine -->
<g id="edge8" class="edge">
<title>skillconsumer&#45;&gt;verificationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M329.71,-169.18C346.54,-164.8 363.51,-161.07 380.04,-158.4 511.16,-137.23 547.65,-137.96 678.89,-158.4 698.65,-161.48 719.04,-165.97 739.13,-171.24"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="329.32,-166.57 322.75,-171.04 330.68,-171.64 329.32,-166.57"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="383.04,-161.4 383.04,-201 407.04,-201 407.04,-161.4 383.04,-161.4"/>
<text xml:space="preserve" text-anchor="start" x="391.15" y="-178" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">8</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="410.04,-161.4 410.04,-201 675.89,-201 675.89,-161.4 410.04,-161.4"/>
<text xml:space="preserve" text-anchor="start" x="413.04" y="-185.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Returns VERIFIED (0), POLICY_FAIL (3),</text>
<text xml:space="preserve" text-anchor="start" x="469.83" y="-168.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">or verification failure (1)</text>
</g>
<!-- verificationengine&#45;&gt;verificationengine -->
<g id="edge2" class="edge">
<title>verificationengine&#45;&gt;verificationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M842.99,-320.98C827.16,-377.28 848.61,-431 907.35,-431 962.53,-431 984.8,-383.58 974.17,-331.17"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="976.73,-330.6 972.42,-323.92 971.63,-331.83 976.73,-330.6"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="802.53,-434 802.53,-473.6 826.53,-473.6 826.53,-434 802.53,-434"/>
<text xml:space="preserve" text-anchor="start" x="810.64" y="-450.6" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">2</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="829.53,-434 829.53,-473.6 1012.16,-473.6 1012.16,-434 829.53,-434"/>
<text xml:space="preserve" text-anchor="start" x="832.53" y="-458" font-family="Arial" font-size="14.00" fill="#c9c9c9">Completes full cryptographic</text>
<text xml:space="preserve" text-anchor="start" x="887.39" y="-441.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">verification</text>
</g>
<!-- verificationengine&#45;&gt;rekorclient -->
<g id="edge3" class="edge">
<title>verificationengine&#45;&gt;rekorclient</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1075.79,-267.33C1195.94,-293.4 1357.35,-328.42 1478.49,-354.71"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1477.77,-357.24 1485.66,-356.26 1478.88,-352.11 1477.77,-357.24"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1150.1,-342.92 1150.1,-382.52 1174.1,-382.52 1174.1,-342.92 1150.1,-342.92"/>
<text xml:space="preserve" text-anchor="start" x="1158.21" y="-359.52" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">3</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1177.1,-342.92 1177.1,-382.52 1404.85,-382.52 1404.85,-342.92 1177.1,-342.92"/>
<text xml:space="preserve" text-anchor="start" x="1180.1" y="-366.92" font-family="Arial" font-size="14.00" fill="#c9c9c9">Delegates live Rekor query for strict</text>
<text xml:space="preserve" text-anchor="start" x="1238.06" y="-350.12" font-family="Arial" font-size="14.00" fill="#c9c9c9">mode verification</text>
</g>
<!-- verificationengine&#45;&gt;policyengine -->
<g id="edge5" class="edge">
<title>verificationengine&#45;&gt;policyengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1075.79,-199.18C1192.93,-176.92 1349.28,-147.21 1469.3,-124.4"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1469.48,-127.04 1476.36,-123.06 1468.5,-121.88 1469.48,-127.04"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1138.81,-188.39 1138.81,-227.99 1162.81,-227.99 1162.81,-188.39 1138.81,-188.39"/>
<text xml:space="preserve" text-anchor="start" x="1146.91" y="-204.99" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">5</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1165.81,-188.39 1165.81,-227.99 1416.14,-227.99 1416.14,-188.39 1165.81,-188.39"/>
<text xml:space="preserve" text-anchor="start" x="1196.43" y="-212.39" font-family="Arial" font-size="14.00" fill="#c9c9c9">Passes verified signer identity,</text>
<text xml:space="preserve" text-anchor="start" x="1168.81" y="-195.59" font-family="Arial" font-size="14.00" fill="#c9c9c9">rekor_timestamp, and skill_id [Phase 2]</text>
</g>
<!-- verificationengine&#45;&gt;policyengine -->
<g id="edge7" class="edge">
<title>verificationengine&#45;&gt;policyengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1015.2,-135.18C1051.02,-108.87 1092.85,-83.85 1135.81,-70.2 1246.46,-35.04 1377.27,-40.65 1479.31,-54.71"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1014.04,-132.77 1009.6,-139.36 1017.18,-136.98 1014.04,-132.77"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1163.7,-73.2 1163.7,-106 1187.7,-106 1187.7,-73.2 1163.7,-73.2"/>
<text xml:space="preserve" text-anchor="start" x="1171.81" y="-86.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">7</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1190.7,-73.2 1190.7,-106 1391.25,-106 1391.25,-73.2 1190.7,-73.2"/>
<text xml:space="preserve" text-anchor="start" x="1193.7" y="-85.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Returns policy evaluation result</text>
</g>
<!-- rekorclient&#45;&gt;rekor -->
<g id="edge4" class="edge">
<title>rekorclient&#45;&gt;rekor</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1814,-392C1929.54,-392 2085.04,-392 2204.23,-392"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2204.03,-394.63 2211.53,-392 2204.03,-389.38 2204.03,-394.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1886.56,-395 1886.56,-451.4 1910.56,-451.4 1910.56,-395 1886.56,-395"/>
<text xml:space="preserve" text-anchor="start" x="1894.67" y="-420" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">4</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1913.56,-395 1913.56,-451.4 2151.43,-451.4 2151.43,-395 1913.56,-395"/>
<text xml:space="preserve" text-anchor="start" x="1927.44" y="-435.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">Queries log entry by rekor_log_id,</text>
<text xml:space="preserve" text-anchor="start" x="1916.56" y="-419" font-family="Arial" font-size="14.00" fill="#c9c9c9">confirms digest match and timestamp</text>
<text xml:space="preserve" text-anchor="start" x="1954.7" y="-402.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">validity via HTTPS/JSON</text>
</g>
<!-- policyengine&#45;&gt;skillfiles -->
<g id="edge6" class="edge">
<title>policyengine&#45;&gt;skillfiles</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1823.14,-90C1940.38,-90 2095.37,-90 2212.5,-90"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2212.47,-92.63 2219.97,-90 2212.47,-87.38 2212.47,-92.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1901.35,-93 1901.35,-132.6 1925.35,-132.6 1925.35,-93 1901.35,-93"/>
<text xml:space="preserve" text-anchor="start" x="1909.46" y="-109.6" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">6</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1928.35,-93 1928.35,-132.6 2136.64,-132.6 2136.64,-93 1928.35,-93"/>
<text xml:space="preserve" text-anchor="start" x="1931.35" y="-117" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads .skillsign&#45;policy.yaml trust</text>
<text xml:space="preserve" text-anchor="start" x="2014.6" y="-100.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">policy</text>
</g>
</g>
</svg>
`;case"signingFlow":return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 14.0.4 (0)
 -->
<!-- Pages: 1 -->
<svg width="2625pt" height="2380pt"
 viewBox="0.00 0.00 2625.00 2380.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 2365.05)">
<!-- skillauthor -->
<g id="node1" class="node">
<title>skillauthor</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="343.62,-1542 0,-1542 0,-1362 343.62,-1362 343.62,-1542"/>
<text xml:space="preserve" text-anchor="start" x="121.23" y="-1466" font-family="Arial" font-size="20.00" fill="#ffe0c2">Skill Author</text>
<text xml:space="preserve" text-anchor="start" x="20.06" y="-1442.5" font-family="Arial" font-size="15.00" fill="#f9b27c">A developer who creates and signs SKILL.md</text>
<text xml:space="preserve" text-anchor="start" x="109.28" y="-1424.5" font-family="Arial" font-size="15.00" fill="#f9b27c">files for distribution</text>
</g>
<!-- signingengine -->
<g id="node2" class="node">
<title>signingengine</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1040,-1542 704.75,-1542 704.75,-1362 1040,-1362 1040,-1542"/>
<text xml:space="preserve" text-anchor="start" x="805.1" y="-1502.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Signing Engine</text>
<text xml:space="preserve" text-anchor="start" x="810.23" y="-1481.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">ECDSA P&#45;256, X.509</text>
<text xml:space="preserve" text-anchor="start" x="750.65" y="-1459.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Orchestrates the signing protocol via</text>
<text xml:space="preserve" text-anchor="start" x="724.81" y="-1441.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Sigstore SDK: reads manifest, canonicalizes</text>
<text xml:space="preserve" text-anchor="start" x="731.47" y="-1423.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">SKILL.md, computes digest, obtains OIDC</text>
<text xml:space="preserve" text-anchor="start" x="798.58" y="-1405.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">identity token, invokes</text>
<text xml:space="preserve" text-anchor="start" x="737.3" y="-1387.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">SigningContext.signer() which generates</text>
</g>
<!-- manifestreader -->
<g id="node3" class="node">
<title>manifestreader</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1813.93,-2350 1493.7,-2350 1493.7,-2170 1813.93,-2170 1813.93,-2350"/>
<text xml:space="preserve" text-anchor="start" x="1580.45" y="-2301.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Manifest Reader</text>
<text xml:space="preserve" text-anchor="start" x="1625.27" y="-2280.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">YAML 1.2</text>
<text xml:space="preserve" text-anchor="start" x="1513.76" y="-2258.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Reads skillsign.yaml to extract skill_id and</text>
<text xml:space="preserve" text-anchor="start" x="1524.6" y="-2240.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">skill_version at signing time, with same</text>
<text xml:space="preserve" text-anchor="start" x="1527.94" y="-2222.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">strict YAML parsing restrictions as the</text>
<text xml:space="preserve" text-anchor="start" x="1585.04" y="-2204.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">sidecar (Section 7.3)</text>
</g>
<!-- sidecarmanager -->
<g id="node4" class="node">
<title>sidecarmanager</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1831.02,-1252 1476.61,-1252 1476.61,-1072 1831.02,-1072 1831.02,-1252"/>
<text xml:space="preserve" text-anchor="start" x="1577.66" y="-1212.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Sidecar Manager</text>
<text xml:space="preserve" text-anchor="start" x="1625.27" y="-1191.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">YAML 1.2</text>
<text xml:space="preserve" text-anchor="start" x="1509.57" y="-1169.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Implemented as a single sidecar.py module</text>
<text xml:space="preserve" text-anchor="start" x="1534.61" y="-1151.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">combining reader and writer. Writer:</text>
<text xml:space="preserve" text-anchor="start" x="1496.66" y="-1133.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">assembles canonical field&#45;ordered YAML (PEM</text>
<text xml:space="preserve" text-anchor="start" x="1522.1" y="-1115.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">fields as literal block scalars) and writes</text>
<text xml:space="preserve" text-anchor="start" x="1520.01" y="-1097.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">atomically via temp file rename. Reader:</text>
</g>
<!-- skillfiles -->
<g id="node5" class="node">
<title>skillfiles</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M2584.38,-1965.64C2584.38,-1974.67 2512.66,-1982 2424.36,-1982 2336.07,-1982 2264.34,-1974.67 2264.34,-1965.64 2264.34,-1965.64 2264.34,-1818.36 2264.34,-1818.36 2264.34,-1809.33 2336.07,-1802 2424.36,-1802 2512.66,-1802 2584.38,-1809.33 2584.38,-1818.36 2584.38,-1818.36 2584.38,-1965.64 2584.38,-1965.64"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M2584.38,-1965.64C2584.38,-1956.61 2512.66,-1949.27 2424.36,-1949.27 2336.07,-1949.27 2264.34,-1956.61 2264.34,-1965.64"/>
<text xml:space="preserve" text-anchor="start" x="2360.46" y="-1924.8" font-family="Arial" font-size="20.00" fill="#eff6ff">Skill File Store</text>
<text xml:space="preserve" text-anchor="start" x="2373.07" y="-1903.1" font-family="Arial" font-size="13.00" fill="#bfdbfe">Local File System</text>
<text xml:space="preserve" text-anchor="start" x="2291.4" y="-1881.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">SKILL.md files, skillsign.yaml manifests,</text>
<text xml:space="preserve" text-anchor="start" x="2349.33" y="-1863.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">.skillsign sidecars, and</text>
<text xml:space="preserve" text-anchor="start" x="2286.82" y="-1845.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">.skillsign&#45;policy.yaml trust policies on disk</text>
</g>
<!-- canonicalprocessor -->
<g id="node6" class="node">
<title>canonicalprocessor</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1821.45,-1542 1486.18,-1542 1486.18,-1362 1821.45,-1362 1821.45,-1542"/>
<text xml:space="preserve" text-anchor="start" x="1535.44" y="-1502.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Canonical Form Processor</text>
<text xml:space="preserve" text-anchor="start" x="1605.42" y="-1481.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">UTF&#45;8, SHA&#45;256</text>
<text xml:space="preserve" text-anchor="start" x="1527.91" y="-1459.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Implemented across canonical.py and</text>
<text xml:space="preserve" text-anchor="start" x="1506.24" y="-1441.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">digest.py. canonical.py: 8&#45;step normalization</text>
<text xml:space="preserve" text-anchor="start" x="1521.28" y="-1423.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">(BOM strip, CRLF normalization, trailing</text>
<text xml:space="preserve" text-anchor="start" x="1524.17" y="-1405.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">whitespace trim, single trailing newline,</text>
<text xml:space="preserve" text-anchor="start" x="1538.35" y="-1387.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">UTF&#45;8 encode, null&#45;byte rejection).</text>
</g>
<!-- authhandler -->
<g id="node7" class="node">
<title>authhandler</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1835.71,-325 1471.93,-325 1471.93,-145 1835.71,-145 1835.71,-325"/>
<text xml:space="preserve" text-anchor="start" x="1595.45" y="-285.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Auth Handler</text>
<text xml:space="preserve" text-anchor="start" x="1637.57" y="-264.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">OIDC</text>
<text xml:space="preserve" text-anchor="start" x="1522.09" y="-242.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Obtains OIDC identity token for signing.</text>
<text xml:space="preserve" text-anchor="start" x="1509.6" y="-224.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Detects ambient CI credentials first (GitHub</text>
<text xml:space="preserve" text-anchor="start" x="1596.72" y="-206.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Actions OIDC via</text>
<text xml:space="preserve" text-anchor="start" x="1515.52" y="-188.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">detect_credential(&quot;sigstore&quot;) with client ID</text>
<text xml:space="preserve" text-anchor="start" x="1491.98" y="-170.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">_SIGSTORE_CLIENT_ID=&quot;sigstore&quot;). Falls back</text>
</g>
<!-- github -->
<g id="node8" class="node">
<title>github</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="2594.92,-470 2253.81,-470 2253.81,-290 2594.92,-290 2594.92,-470"/>
<text xml:space="preserve" text-anchor="start" x="2329.89" y="-421" font-family="Arial" font-size="20.00" fill="#f8fafc">GitHub Actions OIDC</text>
<text xml:space="preserve" text-anchor="start" x="2280.55" y="-397.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">CI identity provider: GitHub Actions runtime</text>
<text xml:space="preserve" text-anchor="start" x="2273.86" y="-379.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">issues OIDC tokens encoding the exact repo,</text>
<text xml:space="preserve" text-anchor="start" x="2283.05" y="-361.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">workflow, and branch. Fulcio verifies these</text>
<text xml:space="preserve" text-anchor="start" x="2274.72" y="-343.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">tokens and issues certificates with URI SANs</text>
<text xml:space="preserve" text-anchor="start" x="2407.27" y="-325.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">(e.g.,</text>
</g>
<!-- sigstoredex -->
<g id="node9" class="node">
<title>sigstoredex</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="2592.82,-180 2255.91,-180 2255.91,0 2592.82,0 2592.82,-180"/>
<text xml:space="preserve" text-anchor="start" x="2329.33" y="-131" font-family="Arial" font-size="20.00" fill="#f8fafc">Sigstore Dex (OAuth)</text>
<text xml:space="preserve" text-anchor="start" x="2332.65" y="-107.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">Interactive identity provider:</text>
<text xml:space="preserve" text-anchor="start" x="2326.39" y="-89.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">Sigstore&#45;hosted Dex instance</text>
<text xml:space="preserve" text-anchor="start" x="2280.94" y="-71.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">(oauth2.sigstore.dev/auth) that federates to</text>
<text xml:space="preserve" text-anchor="start" x="2275.96" y="-53.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">Google, GitHub, and Microsoft OAuth. Fulcio</text>
<text xml:space="preserve" text-anchor="start" x="2290.13" y="-35.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">verifies the Dex&#45;issued token and issues</text>
</g>
<!-- fulcio -->
<g id="node10" class="node">
<title>fulcio</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="1813.84,-962 1493.8,-962 1493.8,-782 1813.84,-782 1813.84,-962"/>
<text xml:space="preserve" text-anchor="start" x="1610.47" y="-904" font-family="Arial" font-size="20.00" fill="#f8fafc">Fulcio CA</text>
<text xml:space="preserve" text-anchor="start" x="1523.34" y="-880.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">Sigstore certificate authority that issues</text>
<text xml:space="preserve" text-anchor="start" x="1522.5" y="-862.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">short&#45;lived certificates binding a verified</text>
<text xml:space="preserve" text-anchor="start" x="1531.25" y="-844.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">GitHub identity to a signer&#45;generated</text>
<text xml:space="preserve" text-anchor="start" x="1582.94" y="-826.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">ephemeral public key</text>
</g>
<!-- rekor -->
<g id="node11" class="node">
<title>rekor</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="1823.14,-672 1484.5,-672 1484.5,-492 1823.14,-492 1823.14,-672"/>
<text xml:space="preserve" text-anchor="start" x="1543.76" y="-596" font-family="Arial" font-size="20.00" fill="#f8fafc">Rekor Transparency Log</text>
<text xml:space="preserve" text-anchor="start" x="1504.55" y="-572.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">Append&#45;only, publicly auditable log recording</text>
<text xml:space="preserve" text-anchor="start" x="1536.67" y="-554.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">signatures, certificates, and digests</text>
</g>
<!-- skillauthor&#45;&gt;signingengine -->
<g id="edge1" class="edge">
<title>skillauthor&#45;&gt;signingengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M343.25,-1452C449.78,-1452 586.69,-1452 694.42,-1452"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="694.23,-1454.63 701.73,-1452 694.23,-1449.38 694.23,-1454.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="411.59,-1455 411.59,-1487.8 435.59,-1487.8 435.59,-1455 411.59,-1455"/>
<text xml:space="preserve" text-anchor="start" x="419.7" y="-1468.2" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">1</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="438.59,-1455 438.59,-1487.8 636.78,-1487.8 636.78,-1455 438.59,-1455"/>
<text xml:space="preserve" text-anchor="start" x="441.59" y="-1467.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Runs: skillsign sign ./SKILL.md</text>
</g>
<!-- skillauthor&#45;&gt;signingengine -->
<g id="edge16" class="edge">
<title>skillauthor&#45;&gt;signingengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M353.33,-1395.42C370.2,-1391.69 387.15,-1388.5 403.62,-1386.2 509.76,-1371.37 538.65,-1371.11 644.75,-1386.2 664.42,-1389 684.77,-1393.1 704.84,-1397.91"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="353.09,-1392.78 346.36,-1397.01 354.25,-1397.9 353.09,-1392.78"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="406.62,-1389.2 406.62,-1422 438.19,-1422 438.19,-1389.2 406.62,-1389.2"/>
<text xml:space="preserve" text-anchor="start" x="414.62" y="-1402.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">16</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="441.19,-1389.2 441.19,-1422 641.75,-1422 641.75,-1389.2 441.19,-1389.2"/>
<text xml:space="preserve" text-anchor="start" x="444.19" y="-1401.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Signing complete — exit code 0</text>
</g>
<!-- signingengine&#45;&gt;signingengine -->
<g id="edge12" class="edge">
<title>signingengine&#45;&gt;signingengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M842.1,-1541.98C834.66,-1598.28 844.75,-1652 872.37,-1652 898.33,-1652 908.81,-1604.58 903.81,-1552.17"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="906.45,-1552.14 902.99,-1544.99 901.23,-1552.74 906.45,-1552.14"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="717.85,-1655 717.85,-1694.6 749.43,-1694.6 749.43,-1655 717.85,-1655"/>
<text xml:space="preserve" text-anchor="start" x="725.85" y="-1671.6" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">12</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="752.43,-1655 752.43,-1694.6 1026.89,-1694.6 1026.89,-1655 752.43,-1655"/>
<text xml:space="preserve" text-anchor="start" x="755.43" y="-1679" font-family="Arial" font-size="14.00" fill="#c9c9c9">Signs digest with ephemeral ECDSA P&#45;256</text>
<text xml:space="preserve" text-anchor="start" x="814.57" y="-1662.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">key (step 8, inside SDK)</text>
</g>
<!-- signingengine&#45;&gt;signingengine -->
<g id="edge14" class="edge">
<title>signingengine&#45;&gt;signingengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M824.18,-1541.65C790.52,-1643.93 806.58,-1762 872.37,-1762 936.05,-1762 953.15,-1651.41 923.66,-1551.58"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="926.21,-1550.92 921.47,-1544.54 921.2,-1552.48 926.21,-1550.92"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="736.94,-1765 736.94,-1804.6 768.51,-1804.6 768.51,-1765 736.94,-1765"/>
<text xml:space="preserve" text-anchor="start" x="744.94" y="-1781.6" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">14</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="771.51,-1765 771.51,-1804.6 1007.81,-1804.6 1007.81,-1765 771.51,-1765"/>
<text xml:space="preserve" text-anchor="start" x="774.51" y="-1789" font-family="Arial" font-size="14.00" fill="#c9c9c9">Assembles sidecar dict from Sigstore</text>
<text xml:space="preserve" text-anchor="start" x="820.01" y="-1772.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Bundle fields (step 10)</text>
</g>
<!-- signingengine&#45;&gt;manifestreader -->
<g id="edge2" class="edge">
<title>signingengine&#45;&gt;manifestreader</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M878.99,-1541.83C892.65,-1682.12 939.51,-1952.79 1100,-2104 1203.33,-2201.36 1362.71,-2238.68 1483.84,-2252.63"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1483.21,-2255.2 1490.96,-2253.42 1483.79,-2249.98 1483.21,-2255.2"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1147.63,-2243.5 1147.63,-2276.3 1171.63,-2276.3 1171.63,-2243.5 1147.63,-2243.5"/>
<text xml:space="preserve" text-anchor="start" x="1155.74" y="-2256.7" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">2</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1174.63,-2243.5 1174.63,-2276.3 1364.29,-2276.3 1364.29,-2243.5 1174.63,-2243.5"/>
<text xml:space="preserve" text-anchor="start" x="1177.63" y="-2255.7" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads and validates manifest</text>
</g>
<!-- signingengine&#45;&gt;skillfiles -->
<g id="edge4" class="edge">
<title>signingengine&#45;&gt;skillfiles</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M897.26,-1541.99C927.44,-1635.85 989.32,-1778.41 1100,-1845 1462,-2062.79 1986.18,-1992.13 2253.18,-1934.91"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2253.62,-1937.5 2260.4,-1933.35 2252.51,-1932.37 2253.62,-1937.5"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1528,-1996.19 1528,-2028.99 1552,-2028.99 1552,-1996.19 1528,-1996.19"/>
<text xml:space="preserve" text-anchor="start" x="1536.1" y="-2009.39" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">4</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1555,-1996.19 1555,-2028.99 1779.64,-2028.99 1779.64,-1996.19 1555,-1996.19"/>
<text xml:space="preserve" text-anchor="start" x="1558" y="-2008.39" font-family="Arial" font-size="14.00" fill="#c9c9c9">Checks for existing sidecar (step 3)</text>
</g>
<!-- signingengine&#45;&gt;skillfiles -->
<g id="edge6" class="edge">
<title>signingengine&#45;&gt;skillfiles</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1039.9,-1506.5C1060.11,-1512.86 1080.5,-1519.16 1100,-1525 1512.17,-1648.48 2000.86,-1780.24 2253.36,-1847.25"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2252.51,-1849.74 2260.43,-1849.13 2253.85,-1844.67 2252.51,-1849.74"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1529.16,-1732.85 1529.16,-1765.65 1553.16,-1765.65 1553.16,-1732.85 1529.16,-1732.85"/>
<text xml:space="preserve" text-anchor="start" x="1537.26" y="-1746.05" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">6</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1556.16,-1732.85 1556.16,-1765.65 1778.48,-1765.65 1778.48,-1732.85 1556.16,-1732.85"/>
<text xml:space="preserve" text-anchor="start" x="1559.16" y="-1745.05" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads SKILL.md file bytes (step 4)</text>
</g>
<!-- signingengine&#45;&gt;canonicalprocessor -->
<g id="edge5" class="edge">
<title>signingengine&#45;&gt;canonicalprocessor</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1039.63,-1452C1168.06,-1452 1345.41,-1452 1476.35,-1452"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1475.96,-1454.63 1483.46,-1452 1475.96,-1449.38 1475.96,-1454.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1128.18,-1455 1128.18,-1494.6 1152.18,-1494.6 1152.18,-1455 1128.18,-1455"/>
<text xml:space="preserve" text-anchor="start" x="1136.29" y="-1471.6" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">5</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1155.18,-1455 1155.18,-1494.6 1383.75,-1494.6 1383.75,-1455 1155.18,-1455"/>
<text xml:space="preserve" text-anchor="start" x="1158.18" y="-1479" font-family="Arial" font-size="14.00" fill="#c9c9c9">Requests canonical form and digest</text>
<text xml:space="preserve" text-anchor="start" x="1236.01" y="-1462.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">(steps 4&#45;5)</text>
</g>
<!-- signingengine&#45;&gt;authhandler -->
<g id="edge7" class="edge">
<title>signingengine&#45;&gt;authhandler</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M880.08,-1362.01C895.61,-1204.82 945.5,-875.54 1100,-650.2 1194.21,-512.8 1348.76,-402.34 1470.53,-330"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1471.51,-332.47 1476.63,-326.4 1468.84,-327.95 1471.51,-332.47"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1119.24,-653.2 1119.24,-686 1143.24,-686 1143.24,-653.2 1119.24,-653.2"/>
<text xml:space="preserve" text-anchor="start" x="1127.34" y="-666.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">7</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1146.24,-653.2 1146.24,-686 1392.69,-686 1392.69,-653.2 1146.24,-653.2"/>
<text xml:space="preserve" text-anchor="start" x="1149.24" y="-665.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Requests OIDC authentication (step 6)</text>
</g>
<!-- signingengine&#45;&gt;fulcio -->
<g id="edge11" class="edge">
<title>signingengine&#45;&gt;fulcio</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M994.31,-1362.01C1137.94,-1255.13 1376.54,-1077.59 1523.68,-968.1"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1525.04,-970.35 1529.49,-963.77 1521.91,-966.14 1525.04,-970.35"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1103,-1283.62 1103,-1323.22 1134.57,-1323.22 1134.57,-1283.62 1103,-1283.62"/>
<text xml:space="preserve" text-anchor="start" x="1111" y="-1300.22" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">11</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1137.57,-1283.62 1137.57,-1323.22 1408.93,-1323.22 1408.93,-1283.62 1137.57,-1283.62"/>
<text xml:space="preserve" text-anchor="start" x="1140.57" y="-1307.62" font-family="Arial" font-size="14.00" fill="#c9c9c9">Submits OIDC token and ephemeral public</text>
<text xml:space="preserve" text-anchor="start" x="1172.1" y="-1290.82" font-family="Arial" font-size="14.00" fill="#c9c9c9">key via Sigstore SDK (steps 7&#45;8)</text>
</g>
<!-- signingengine&#45;&gt;rekor -->
<g id="edge13" class="edge">
<title>signingengine&#45;&gt;rekor</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M900.05,-1362.11C933.94,-1259.08 1000.29,-1089.21 1100,-970.6 1204.39,-846.42 1357.32,-743 1475.88,-674.16"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1476.91,-676.59 1482.09,-670.57 1474.29,-672.05 1476.91,-676.59"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1113.5,-973.6 1113.5,-1030 1145.07,-1030 1145.07,-973.6 1113.5,-973.6"/>
<text xml:space="preserve" text-anchor="start" x="1121.5" y="-998.6" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">13</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1148.07,-973.6 1148.07,-1030 1398.43,-1030 1398.43,-973.6 1148.07,-973.6"/>
<text xml:space="preserve" text-anchor="start" x="1167.81" y="-1014.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Submits signature, certificate, and</text>
<text xml:space="preserve" text-anchor="start" x="1151.07" y="-997.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">digest as hashedrekord/v0.0.1 entry via</text>
<text xml:space="preserve" text-anchor="start" x="1205.56" y="-980.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">Sigstore SDK (step 9)</text>
</g>
<!-- manifestreader&#45;&gt;skillfiles -->
<g id="edge3" class="edge">
<title>manifestreader&#45;&gt;skillfiles</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1813.66,-2234.16C1925.23,-2211.32 2075.13,-2170.96 2193.81,-2104 2246.29,-2074.39 2296.45,-2030.56 2336.42,-1990.42"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2338.24,-1992.31 2341.64,-1985.13 2334.5,-1988.63 2338.24,-1992.31"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1936.45,-2218.38 1936.45,-2251.18 1960.45,-2251.18 1960.45,-2218.38 1936.45,-2218.38"/>
<text xml:space="preserve" text-anchor="start" x="1944.55" y="-2231.58" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">3</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1963.45,-2218.38 1963.45,-2251.18 2153.07,-2251.18 2153.07,-2218.38 1963.45,-2218.38"/>
<text xml:space="preserve" text-anchor="start" x="1966.45" y="-2230.58" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads skillsign.yaml manifest</text>
</g>
<!-- sidecarmanager&#45;&gt;skillfiles -->
<g id="edge15" class="edge">
<title>sidecarmanager&#45;&gt;skillfiles</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1768.24,-1251.86C1790.72,-1269.96 1814.05,-1288.97 1835.71,-1307 1997.39,-1441.62 2046.39,-1466.5 2193.81,-1616.6 2248.26,-1672.04 2304.19,-1738.9 2347.21,-1792.86"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2345.13,-1794.46 2351.85,-1798.7 2349.24,-1791.19 2345.13,-1794.46"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1910.87,-1619.6 1910.87,-1676 1942.44,-1676 1942.44,-1619.6 1910.87,-1619.6"/>
<text xml:space="preserve" text-anchor="start" x="1918.87" y="-1644.6" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">15</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1945.44,-1619.6 1945.44,-1676 2178.64,-1676 2178.64,-1619.6 1945.44,-1619.6"/>
<text xml:space="preserve" text-anchor="start" x="1958.57" y="-1660.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Writes SKILL.md.skillsign sidecar</text>
<text xml:space="preserve" text-anchor="start" x="1948.44" y="-1643.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">atomically via temp file rename (step</text>
<text xml:space="preserve" text-anchor="start" x="2051.93" y="-1626.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">11)</text>
</g>
<!-- authhandler&#45;&gt;authhandler -->
<g id="edge8" class="edge">
<title>authhandler&#45;&gt;authhandler</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1585.84,-324.98C1569.12,-381.28 1591.78,-435 1653.82,-435 1712.1,-435 1735.63,-387.58 1724.4,-335.17"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1726.94,-334.53 1722.54,-327.91 1721.86,-335.83 1726.94,-334.53"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1548.6,-438 1548.6,-470.8 1572.6,-470.8 1572.6,-438 1548.6,-438"/>
<text xml:space="preserve" text-anchor="start" x="1556.7" y="-451.2" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">8</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1575.6,-438 1575.6,-470.8 1759.04,-470.8 1759.04,-438 1575.6,-438"/>
<text xml:space="preserve" text-anchor="start" x="1578.6" y="-450.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Detects authentication mode</text>
</g>
<!-- authhandler&#45;&gt;github -->
<g id="edge9" class="edge">
<title>authhandler&#45;&gt;github</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1835.49,-269.09C1958.6,-292.31 2120.92,-322.94 2243.79,-346.12"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2243.23,-348.69 2251.09,-347.5 2244.2,-343.53 2243.23,-348.69"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1898.71,-336.1 1898.71,-375.7 1922.71,-375.7 1922.71,-336.1 1898.71,-336.1"/>
<text xml:space="preserve" text-anchor="start" x="1906.81" y="-352.7" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">9</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1925.71,-336.1 1925.71,-375.7 2190.81,-375.7 2190.81,-336.1 1925.71,-336.1"/>
<text xml:space="preserve" text-anchor="start" x="1928.71" y="-360.1" font-family="Arial" font-size="14.00" fill="#c9c9c9">CI path: ambient OIDC token from GitHub</text>
<text xml:space="preserve" text-anchor="start" x="2035.3" y="-343.3" font-family="Arial" font-size="14.00" fill="#c9c9c9">Actions</text>
</g>
<!-- authhandler&#45;&gt;sigstoredex -->
<g id="edge10" class="edge">
<title>authhandler&#45;&gt;sigstoredex</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1835.49,-200.91C1959.25,-177.56 2122.62,-146.74 2245.73,-123.51"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2246.15,-126.1 2253.04,-122.13 2245.18,-120.95 2246.15,-126.1"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1904.63,-191.1 1904.63,-230.7 1936.2,-230.7 1936.2,-191.1 1904.63,-191.1"/>
<text xml:space="preserve" text-anchor="start" x="1912.63" y="-207.7" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">10</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1939.2,-191.1 1939.2,-230.7 2184.88,-230.7 2184.88,-191.1 1939.2,-191.1"/>
<text xml:space="preserve" text-anchor="start" x="1942.2" y="-215.1" font-family="Arial" font-size="14.00" fill="#c9c9c9">Interactive path: browser&#45;based OAuth</text>
<text xml:space="preserve" text-anchor="start" x="2011.08" y="-198.3" font-family="Arial" font-size="14.00" fill="#c9c9c9">via Sigstore Dex</text>
</g>
</g>
</svg>
`;case"verificationFlow":return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 14.0.4 (0)
 -->
<!-- Pages: 1 -->
<svg width="2562pt" height="1194pt"
 viewBox="0.00 0.00 2562.00 1194.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 1179.05)">
<!-- skillconsumer -->
<g id="node1" class="node">
<title>skillconsumer</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="320.04,-770 0,-770 0,-590 320.04,-590 320.04,-770"/>
<text xml:space="preserve" text-anchor="start" x="92.78" y="-694" font-family="Arial" font-size="20.00" fill="#ffe0c2">Skill Consumer</text>
<text xml:space="preserve" text-anchor="start" x="22.43" y="-670.5" font-family="Arial" font-size="15.00" fill="#f9b27c">A developer who installs and uses signed</text>
<text xml:space="preserve" text-anchor="start" x="89.99" y="-652.5" font-family="Arial" font-size="15.00" fill="#f9b27c">skills in Claude Code</text>
</g>
<!-- verificationengine -->
<g id="node2" class="node">
<title>verificationengine</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1046.04,-770 709.12,-770 709.12,-590 1046.04,-590 1046.04,-770"/>
<text xml:space="preserve" text-anchor="start" x="794.2" y="-730.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Verification Engine</text>
<text xml:space="preserve" text-anchor="start" x="815.44" y="-709.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">ECDSA P&#45;256, X.509</text>
<text xml:space="preserve" text-anchor="start" x="735.86" y="-687.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Orchestrates verification: reads sidecar via</text>
<text xml:space="preserve" text-anchor="start" x="729.18" y="-669.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">SidecarManager, recomputes digest, verifies</text>
<text xml:space="preserve" text-anchor="start" x="742.52" y="-651.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">ECDSA P&#45;256 signature using certificate</text>
<text xml:space="preserve" text-anchor="start" x="749.59" y="-633.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">public key, validates cert chain against</text>
<text xml:space="preserve" text-anchor="start" x="756.28" y="-615.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Fulcio root via TUF TrustedRoot and</text>
</g>
<!-- sidecarmanager -->
<g id="node3" class="node">
<title>sidecarmanager</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1801.48,-1164 1447.06,-1164 1447.06,-984 1801.48,-984 1801.48,-1164"/>
<text xml:space="preserve" text-anchor="start" x="1548.12" y="-1124.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Sidecar Manager</text>
<text xml:space="preserve" text-anchor="start" x="1595.73" y="-1103.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">YAML 1.2</text>
<text xml:space="preserve" text-anchor="start" x="1480.03" y="-1081.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Implemented as a single sidecar.py module</text>
<text xml:space="preserve" text-anchor="start" x="1505.06" y="-1063.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">combining reader and writer. Writer:</text>
<text xml:space="preserve" text-anchor="start" x="1467.12" y="-1045.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">assembles canonical field&#45;ordered YAML (PEM</text>
<text xml:space="preserve" text-anchor="start" x="1492.55" y="-1027.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">fields as literal block scalars) and writes</text>
<text xml:space="preserve" text-anchor="start" x="1490.46" y="-1009.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">atomically via temp file rename. Reader:</text>
</g>
<!-- skillfiles -->
<g id="node4" class="node">
<title>skillfiles</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M2523.35,-1011.64C2523.35,-1020.67 2451.63,-1028 2363.33,-1028 2275.04,-1028 2203.31,-1020.67 2203.31,-1011.64 2203.31,-1011.64 2203.31,-864.36 2203.31,-864.36 2203.31,-855.33 2275.04,-848 2363.33,-848 2451.63,-848 2523.35,-855.33 2523.35,-864.36 2523.35,-864.36 2523.35,-1011.64 2523.35,-1011.64"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M2523.35,-1011.64C2523.35,-1002.61 2451.63,-995.27 2363.33,-995.27 2275.04,-995.27 2203.31,-1002.61 2203.31,-1011.64"/>
<text xml:space="preserve" text-anchor="start" x="2299.43" y="-970.8" font-family="Arial" font-size="20.00" fill="#eff6ff">Skill File Store</text>
<text xml:space="preserve" text-anchor="start" x="2312.04" y="-949.1" font-family="Arial" font-size="13.00" fill="#bfdbfe">Local File System</text>
<text xml:space="preserve" text-anchor="start" x="2230.37" y="-927.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">SKILL.md files, skillsign.yaml manifests,</text>
<text xml:space="preserve" text-anchor="start" x="2288.3" y="-909.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">.skillsign sidecars, and</text>
<text xml:space="preserve" text-anchor="start" x="2225.79" y="-891.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">.skillsign&#45;policy.yaml trust policies on disk</text>
</g>
<!-- canonicalprocessor -->
<g id="node5" class="node">
<title>canonicalprocessor</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1791.9,-615 1456.63,-615 1456.63,-435 1791.9,-435 1791.9,-615"/>
<text xml:space="preserve" text-anchor="start" x="1505.89" y="-575.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Canonical Form Processor</text>
<text xml:space="preserve" text-anchor="start" x="1575.87" y="-554.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">UTF&#45;8, SHA&#45;256</text>
<text xml:space="preserve" text-anchor="start" x="1498.36" y="-532.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Implemented across canonical.py and</text>
<text xml:space="preserve" text-anchor="start" x="1476.69" y="-514.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">digest.py. canonical.py: 8&#45;step normalization</text>
<text xml:space="preserve" text-anchor="start" x="1491.73" y="-496.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">(BOM strip, CRLF normalization, trailing</text>
<text xml:space="preserve" text-anchor="start" x="1494.63" y="-478.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">whitespace trim, single trailing newline,</text>
<text xml:space="preserve" text-anchor="start" x="1508.8" y="-460.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">UTF&#45;8 encode, null&#45;byte rejection).</text>
</g>
<!-- tufclient -->
<g id="node6" class="node">
<title>tufclient</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1787.32,-325 1461.22,-325 1461.22,-145 1787.32,-145 1787.32,-325"/>
<text xml:space="preserve" text-anchor="start" x="1576.49" y="-285.8" font-family="Arial" font-size="20.00" fill="#eef2ff">TUF Client</text>
<text xml:space="preserve" text-anchor="start" x="1586.72" y="-264.1" font-family="Arial" font-size="13.00" fill="#c7d2fe">TUF, HTTPS</text>
<text xml:space="preserve" text-anchor="start" x="1500.47" y="-242.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">Wraps Sigstore SDK TrustedRoot via</text>
<text xml:space="preserve" text-anchor="start" x="1489.63" y="-224.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">infra/tuf.py. Fetches production TUF root</text>
<text xml:space="preserve" text-anchor="start" x="1486.28" y="-206.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">metadata including Fulcio root certificates</text>
<text xml:space="preserve" text-anchor="start" x="1481.7" y="-188.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">and Rekor public key. Falls back to cached</text>
<text xml:space="preserve" text-anchor="start" x="1481.27" y="-170.7" font-family="Arial" font-size="15.00" fill="#c7d2fe">metadata when offline. Used by verification</text>
</g>
<!-- tuf -->
<g id="node7" class="node">
<title>tuf</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="2523.35,-470 2203.31,-470 2203.31,-290 2523.35,-290 2523.35,-470"/>
<text xml:space="preserve" text-anchor="start" x="2319.99" y="-394" font-family="Arial" font-size="20.00" fill="#f8fafc">TUF Root</text>
<text xml:space="preserve" text-anchor="start" x="2244.54" y="-370.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">The Update Framework root of trust</text>
<text xml:space="preserve" text-anchor="start" x="2258.28" y="-352.5" font-family="Arial" font-size="15.00" fill="#cbd5e1">distributing Sigstore public keys</text>
</g>
<!-- tufcache -->
<g id="node8" class="node">
<title>tufcache</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M2531.41,-163.64C2531.41,-172.67 2456.08,-180 2363.33,-180 2270.59,-180 2195.25,-172.67 2195.25,-163.64 2195.25,-163.64 2195.25,-16.36 2195.25,-16.36 2195.25,-7.33 2270.59,0 2363.33,0 2456.08,0 2531.41,-7.33 2531.41,-16.36 2531.41,-16.36 2531.41,-163.64 2531.41,-163.64"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M2531.41,-163.64C2531.41,-154.61 2456.08,-147.27 2363.33,-147.27 2270.59,-147.27 2195.25,-154.61 2195.25,-163.64"/>
<text xml:space="preserve" text-anchor="start" x="2288.31" y="-122.8" font-family="Arial" font-size="20.00" fill="#eff6ff">TUF Root Cache</text>
<text xml:space="preserve" text-anchor="start" x="2312.04" y="-101.1" font-family="Arial" font-size="13.00" fill="#bfdbfe">Local File System</text>
<text xml:space="preserve" text-anchor="start" x="2215.31" y="-79.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">Local cache of bundled and fetched Sigstore</text>
<text xml:space="preserve" text-anchor="start" x="2248.7" y="-61.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">TUF root metadata and Fulcio root</text>
<text xml:space="preserve" text-anchor="start" x="2327.49" y="-43.7" font-family="Arial" font-size="15.00" fill="#bfdbfe">certificates</text>
</g>
<!-- skillconsumer&#45;&gt;verificationengine -->
<g id="edge1" class="edge">
<title>skillconsumer&#45;&gt;verificationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M319.83,-680C432.04,-680 582.53,-680 698.76,-680"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="698.66,-682.63 706.16,-680 698.66,-677.38 698.66,-682.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="398.1,-683 398.1,-715.8 422.1,-715.8 422.1,-683 398.1,-683"/>
<text xml:space="preserve" text-anchor="start" x="406.21" y="-696.2" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">1</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="425.1,-683 425.1,-715.8 631.06,-715.8 631.06,-683 425.1,-683"/>
<text xml:space="preserve" text-anchor="start" x="428.1" y="-695.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Runs: skillsign verify ./SKILL.md</text>
</g>
<!-- skillconsumer&#45;&gt;verificationengine -->
<g id="edge12" class="edge">
<title>skillconsumer&#45;&gt;verificationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M329.71,-618.18C346.54,-613.8 363.51,-610.07 380.04,-607.4 498.1,-588.34 530.95,-589 649.12,-607.4 668.88,-610.48 689.28,-614.97 709.36,-620.24"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="329.32,-615.57 322.75,-620.04 330.68,-620.64 329.32,-615.57"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="383.04,-610.4 383.04,-650 414.61,-650 414.61,-610.4 383.04,-610.4"/>
<text xml:space="preserve" text-anchor="start" x="391.04" y="-627" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">11</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="417.61,-610.4 417.61,-650 646.12,-650 646.12,-610.4 417.61,-610.4"/>
<text xml:space="preserve" text-anchor="start" x="420.61" y="-634.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Returns VERIFIED (exit 0) or failure</text>
<text xml:space="preserve" text-anchor="start" x="464.17" y="-617.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">with specific exit code</text>
</g>
<!-- verificationengine&#45;&gt;verificationengine -->
<g id="edge6" class="edge">
<title>verificationengine&#45;&gt;verificationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M856.54,-769.98C851.37,-826.28 858.38,-880 877.58,-880 895.62,-880 902.9,-832.58 899.43,-780.17"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="902.07,-780.27 898.86,-773 896.83,-780.68 902.07,-780.27"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="746.7,-883 746.7,-915.8 770.7,-915.8 770.7,-883 746.7,-883"/>
<text xml:space="preserve" text-anchor="start" x="754.81" y="-896.2" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">6</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="773.7,-883 773.7,-915.8 1008.46,-915.8 1008.46,-883 773.7,-883"/>
<text xml:space="preserve" text-anchor="start" x="776.7" y="-895.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Cryptographic verification (steps 6&#45;8)</text>
</g>
<!-- verificationengine&#45;&gt;verificationengine -->
<g id="edge10" class="edge">
<title>verificationengine&#45;&gt;verificationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M844.09,-769.65C820.69,-871.93 831.85,-990 877.58,-990 921.79,-990 933.7,-879.64 913.29,-779.88"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="915.87,-779.38 911.72,-772.61 910.74,-780.49 915.87,-779.38"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="742.41,-993 742.41,-1032.6 766.41,-1032.6 766.41,-993 742.41,-993"/>
<text xml:space="preserve" text-anchor="start" x="750.52" y="-1009.6" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">9</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="769.41,-993 769.41,-1032.6 1012.75,-1032.6 1012.75,-993 769.41,-993"/>
<text xml:space="preserve" text-anchor="start" x="772.41" y="-1017" font-family="Arial" font-size="14.00" fill="#c9c9c9">Temporal binding and SET verification</text>
<text xml:space="preserve" text-anchor="start" x="867.35" y="-1000.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">(step 9)</text>
</g>
<!-- verificationengine&#45;&gt;verificationengine -->
<g id="edge11" class="edge">
<title>verificationengine&#45;&gt;verificationengine</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M836.36,-769.97C789.97,-914.49 803.71,-1100 877.58,-1100 949.79,-1100 964.54,-922.73 921.84,-779.76"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="924.43,-779.25 919.7,-772.86 919.41,-780.8 924.43,-779.25"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="711.41,-1103 711.41,-1142.6 742.98,-1142.6 742.98,-1103 711.41,-1103"/>
<text xml:space="preserve" text-anchor="start" x="719.41" y="-1119.6" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">10</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="745.98,-1103 745.98,-1142.6 1043.76,-1142.6 1043.76,-1103 745.98,-1103"/>
<text xml:space="preserve" text-anchor="start" x="748.98" y="-1127" font-family="Arial" font-size="14.00" fill="#c9c9c9">SKILL_ID_MISMATCH owner&#45;path check (step</text>
<text xml:space="preserve" text-anchor="start" x="884.75" y="-1110.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">11)</text>
</g>
<!-- verificationengine&#45;&gt;sidecarmanager -->
<g id="edge2" class="edge">
<title>verificationengine&#45;&gt;sidecarmanager</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M945.06,-769.71C986.38,-819.77 1043.45,-879.58 1106.04,-918 1206.9,-979.9 1333.98,-1018.68 1436.94,-1042.09"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1436.29,-1044.64 1444.19,-1043.72 1437.44,-1039.52 1436.29,-1044.64"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1113.33,-1030.17 1113.33,-1062.97 1137.33,-1062.97 1137.33,-1030.17 1113.33,-1030.17"/>
<text xml:space="preserve" text-anchor="start" x="1121.43" y="-1043.37" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">2</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1140.33,-1030.17 1140.33,-1062.97 1379.77,-1062.97 1379.77,-1030.17 1140.33,-1030.17"/>
<text xml:space="preserve" text-anchor="start" x="1143.33" y="-1042.37" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads and parses sidecar (steps 1&#45;2)</text>
</g>
<!-- verificationengine&#45;&gt;skillfiles -->
<g id="edge5" class="edge">
<title>verificationengine&#45;&gt;skillfiles</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1045.9,-709.09C1330.52,-758.59 1905.86,-858.63 2192.31,-908.44"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2191.56,-910.97 2199.4,-909.67 2192.46,-905.8 2191.56,-910.97"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1525.28,-841.86 1525.28,-874.66 1549.28,-874.66 1549.28,-841.86 1525.28,-841.86"/>
<text xml:space="preserve" text-anchor="start" x="1533.39" y="-855.06" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">5</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1552.28,-841.86 1552.28,-874.66 1723.25,-874.66 1723.25,-841.86 1552.28,-841.86"/>
<text xml:space="preserve" text-anchor="start" x="1555.28" y="-854.06" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads SKILL.md file bytes</text>
</g>
<!-- verificationengine&#45;&gt;canonicalprocessor -->
<g id="edge4" class="edge">
<title>verificationengine&#45;&gt;canonicalprocessor</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1045.7,-645.21C1164.99,-620.39 1325.15,-587.05 1446.56,-561.78"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1446.93,-564.38 1453.74,-560.29 1445.86,-559.24 1446.93,-564.38"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1109.04,-632.86 1109.04,-672.46 1133.04,-672.46 1133.04,-632.86 1109.04,-632.86"/>
<text xml:space="preserve" text-anchor="start" x="1117.15" y="-649.46" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">4</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1136.04,-632.86 1136.04,-672.46 1384.06,-672.46 1384.06,-632.86 1136.04,-632.86"/>
<text xml:space="preserve" text-anchor="start" x="1139.04" y="-656.86" font-family="Arial" font-size="14.00" fill="#c9c9c9">Recomputes canonical form and digest</text>
<text xml:space="preserve" text-anchor="start" x="1226.6" y="-640.06" font-family="Arial" font-size="14.00" fill="#c9c9c9">(steps 3&#45;5)</text>
</g>
<!-- verificationengine&#45;&gt;tufclient -->
<g id="edge7" class="edge">
<title>verificationengine&#45;&gt;tufclient</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M972.77,-590.01C1012.15,-554.98 1059.52,-516.02 1106.04,-485.6 1215.36,-414.1 1348.13,-350.2 1451.78,-304.81"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1452.8,-307.23 1458.63,-301.83 1450.71,-302.42 1452.8,-307.23"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1111.78,-488.6 1111.78,-545 1135.78,-545 1135.78,-488.6 1111.78,-488.6"/>
<text xml:space="preserve" text-anchor="start" x="1119.88" y="-513.6" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">7</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1138.78,-488.6 1138.78,-545 1381.33,-545 1381.33,-488.6 1138.78,-488.6"/>
<text xml:space="preserve" text-anchor="start" x="1172.51" y="-529.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Requests trusted Fulcio root</text>
<text xml:space="preserve" text-anchor="start" x="1141.78" y="-512.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">certificates and Rekor public key (step</text>
<text xml:space="preserve" text-anchor="start" x="1253.83" y="-495.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">7)</text>
</g>
<!-- sidecarmanager&#45;&gt;skillfiles -->
<g id="edge3" class="edge">
<title>sidecarmanager&#45;&gt;skillfiles</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1801.35,-1041.51C1919.79,-1019.66 2075.1,-991 2192.27,-969.38"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2192.54,-972 2199.44,-968.06 2191.59,-966.84 2192.54,-972"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1877.61,-1033.01 1877.61,-1072.61 1901.61,-1072.61 1901.61,-1033.01 1877.61,-1033.01"/>
<text xml:space="preserve" text-anchor="start" x="1885.72" y="-1049.61" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">3</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1904.61,-1033.01 1904.61,-1072.61 2119.12,-1072.61 2119.12,-1033.01 1904.61,-1033.01"/>
<text xml:space="preserve" text-anchor="start" x="1907.61" y="-1057.01" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads .skillsign sidecar with strict</text>
<text xml:space="preserve" text-anchor="start" x="1956.22" y="-1040.21" font-family="Arial" font-size="14.00" fill="#c9c9c9">YAML 1.2 parsing</text>
</g>
<!-- tufclient&#45;&gt;tuf -->
<g id="edge8" class="edge">
<title>tufclient&#45;&gt;tuf</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1787.02,-266.82C1907.38,-290.5 2071.24,-322.73 2193.3,-346.75"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2192.66,-349.3 2200.52,-348.17 2193.67,-344.14 2192.66,-349.3"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1866.81,-336.1 1866.81,-368.9 1902.28,-368.9 1902.28,-336.1 1866.81,-336.1"/>
<text xml:space="preserve" text-anchor="start" x="1874.81" y="-349.3" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">8.1</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1905.28,-336.1 1905.28,-368.9 2129.92,-368.9 2129.92,-336.1 1905.28,-336.1"/>
<text xml:space="preserve" text-anchor="start" x="1908.28" y="-348.3" font-family="Arial" font-size="14.00" fill="#c9c9c9">Fetches current TUF root metadata</text>
</g>
<!-- tufclient&#45;&gt;tufcache -->
<g id="edge9" class="edge">
<title>tufclient&#45;&gt;tufcache</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1787.02,-203.18C1904.49,-180.07 2063.4,-148.81 2184.45,-124.99"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2184.74,-127.61 2191.6,-123.59 2183.73,-122.46 2184.74,-127.61"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1864.48,-191.1 1864.48,-223.9 1899.94,-223.9 1899.94,-191.1 1864.48,-191.1"/>
<text xml:space="preserve" text-anchor="start" x="1872.48" y="-204.3" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">8.2</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1902.94,-191.1 1902.94,-223.9 2132.25,-223.9 2132.25,-191.1 1902.94,-191.1"/>
<text xml:space="preserve" text-anchor="start" x="1905.94" y="-203.3" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads/writes cached TUF metadata</text>
</g>
</g>
</svg>
`;default:throw new Error("Unknown viewId: "+e)}}export{t as dotSource,n as svgSource};
