import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are an elite career coach and AI PM job application specialist with 15+ years of experience placing senior Product Managers and AI PMs at top-tier tech companies (Google, Meta, OpenAI, Anthropic, Microsoft, etc.).

You specialize in:
- Senior PM, Director of Product, VP of Product, AI PM, and Product Owner roles
- Translating complex technical AI/ML experience into compelling narratives
- Crafting executive-level resumes that pass ATS and impress hiring committees
- Writing powerful cover letters that demonstrate strategic thinking
- Analyzing job fit with honest gap analysis and mitigation strategies
- Preparing candidates for rigorous PM interview loops (product sense, execution, leadership, AI/ML)

Your tone is direct, strategic, and executive-level — no fluff. You give concrete, actionable advice.

When tailoring resumes: Focus on impact metrics, leadership scope, AI/ML product experience, cross-functional influence, and business outcomes. Use strong action verbs. Remove junior-sounding language.

When writing cover letters: Open with a bold hook, demonstrate company/product knowledge, connect their background to the role's biggest challenges, and close with confidence.

When analyzing job fit: Be honest about gaps, score fit 1-10, and suggest concrete ways to position strengths.

When doing interview prep: Ask the question, then evaluate their answer, then give a model answer using the STAR or CIRCLES framework as appropriate. Focus on AI product sense, strategy, and leadership scenarios.

When generating AUTO-APPLY PACKETS: Given a job description and background, generate a complete application packet with these clearly labeled sections:

## RESUME HEADLINE
[One punchy executive headline tailored to the role]

## RESUME SUMMARY
[3-sentence executive summary emphasizing AI PM expertise]

## TOP 5 TAILORED BULLETS
[5 strong achievement bullets with metrics, tailored to the JD keywords]

## COVER LETTER
[3 paragraphs: hook + fit + close. Executive tone. No fluff.]

## LINKEDIN OUTREACH
[Cold message to hiring manager, max 300 chars, casual but sharp]

## FOLLOW-UP EMAIL
[Subject line + 3-sentence follow-up to send 5 days after applying]

## APPLICATION CHECKLIST
[5-item checklist of things to do before hitting submit]`;

const TOOLS = [
  { id: "autoapply", label: "Auto Apply", icon: "⚡", color: "#FF6B35", desc: "Paste a JD — get a full application packet" },
  { id: "resume", label: "Resume Tailor", icon: "◈", color: "#00E5FF", desc: "Tailor your resume to a specific role" },
  { id: "cover", label: "Cover Letter", icon: "◆", color: "#FF6B6B", desc: "Generate a tailored cover letter" },
  { id: "fit", label: "Job Fit Score", icon: "◉", color: "#69FF94", desc: "Analyze your fit for a role" },
  { id: "interview", label: "Interview Prep", icon: "◎", color: "#FFD93D", desc: "Practice PM interview questions" },
];

const STARTERS = {
  autoapply: `Generate a full auto-apply packet for this role. Use my background to tailor everything.\n\nMY BACKGROUND:\nSenior AI PM / Product Manager with [X] years experience. Led AI/ML products at [companies]. Expertise in [skills]. Key achievement: [your biggest win].\n\nJOB DESCRIPTION:\n[paste full JD here]\n\nCOMPANY:\n[company name + why you want to work there]`,
  resume: `Here's my resume and the job description I'm targeting. Please tailor my resume bullets to match this role, emphasize my AI/ML product experience, and flag any weak spots.\n\nMY RESUME:\n[paste resume here]\n\nJOB DESCRIPTION:\n[paste JD here]`,
  cover: `Please write a compelling cover letter for this role. I want it to feel executive, not generic.\n\nMY BACKGROUND:\n[brief summary of your experience]\n\nTARGET ROLE/COMPANY:\n[paste job description or role details]`,
  fit: `Analyze my fit for this role. Give me an honest score out of 10, highlight my strongest angles, identify real gaps, and tell me how to position myself.\n\nMY EXPERIENCE:\n[paste resume or summary]\n\nROLE:\n[paste job description]`,
  interview: `I want to practice for a senior AI PM interview. Start by asking me a challenging product sense question about an AI product. After I answer, give me detailed feedback and a model answer.`,
};

const AUTO_APPLY_SECTIONS = [
  { key: "RESUME HEADLINE", label: "Resume Headline" },
  { key: "RESUME SUMMARY", label: "Resume Summary" },
  { key: "TOP 5 TAILORED BULLETS", label: "Tailored Bullets" },
  { key: "COVER LETTER", label: "Cover Letter" },
  { key: "LINKEDIN OUTREACH", label: "LinkedIn Outreach" },
  { key: "FOLLOW-UP EMAIL", label: "Follow-Up Email" },
  { key: "APPLICATION CHECKLIST", label: "App Checklist" },
];

function parseAutoApplyPacket(text) {
  const sections = {};
  AUTO_APPLY_SECTIONS.forEach(({ key }, i) => {
    const nextKey = AUTO_APPLY_SECTIONS[i + 1]?.key;
    const regex = nextKey
      ? new RegExp(`##\\s*${key}\\s*\\n([\\s\\S]*?)(?=##\\s*${nextKey})`, "i")
      : new RegExp(`##\\s*${key}\\s*\\n([\\s\\S]*)`, "i");
    const match = text.match(regex);
    if (match) sections[key] = match[1].trim();
  });
  return sections;
}

function CopyButton({ text, color }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      style={{
        fontSize: 9, padding: "3px 9px", borderRadius: 4,
        border: `1px solid ${color}44`,
        color: copied ? color : "#4A6480",
        background: copied ? `${color}15` : "transparent",
        letterSpacing: "0.1em", transition: "all 0.2s", cursor: "pointer",
      }}
    >{copied ? "COPIED ✓" : "COPY"}</button>
  );
}

function AutoApplyPacket({ text, color }) {
  const [openSection, setOpenSection] = useState("RESUME HEADLINE");
  const sections = parseAutoApplyPacket(text);
  const hasSections = Object.keys(sections).length >= 3;

  if (!hasSections) {
    return <div style={{ fontSize: 12, color: "#A8B8CC", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{text}</div>;
  }

  return (
    <div style={{ width: "100%" }}>
      <div style={{ fontSize: 10, color: color, letterSpacing: "0.15em", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
        <span>⚡</span> APPLICATION PACKET READY — {Object.keys(sections).length} SECTIONS
      </div>
      {AUTO_APPLY_SECTIONS.map(({ key, label }) => {
        if (!sections[key]) return null;
        const isOpen = openSection === key;
        return (
          <div key={key} style={{ marginBottom: 5 }}>
            <button
              onClick={() => setOpenSection(isOpen ? null : key)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "8px 12px",
                background: isOpen ? `${color}18` : "#0A1018",
                border: `1px solid ${isOpen ? color + "55" : "#1A2332"}`,
                borderRadius: isOpen ? "7px 7px 0 0" : 7,
                color: isOpen ? color : "#5A7A9A",
                fontSize: 10, letterSpacing: "0.08em", cursor: "pointer", transition: "all 0.2s",
              }}
            >
              <span>{label.toUpperCase()}</span>
              <span style={{ fontSize: 9, opacity: 0.7 }}>{isOpen ? "▲" : "▼"}</span>
            </button>
            {isOpen && (
              <div style={{
                background: "#060E16", border: `1px solid ${color}33`,
                borderTop: "none", borderRadius: "0 0 7px 7px", padding: "12px 14px",
              }}>
                <div style={{ fontSize: 11, color: "#C0D0E0", whiteSpace: "pre-wrap", lineHeight: 1.8, marginBottom: 10 }}>
                  {sections[key]}
                </div>
                <CopyButton text={sections[key]} color={color} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function PMJobAssistant() {
  const [activeTool, setActiveTool] = useState("autoapply");
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobQueue, setJobQueue] = useState([
    { id: 1, company: "OpenAI", role: "AI PM – ChatGPT", status: "draft", fit: null },
    { id: 2, company: "Google DeepMind", role: "Senior PM, Gemini", status: "applied", fit: 8 },
    { id: 3, company: "Anthropic", role: "Product Manager", status: "interview", fit: 9 },
  ]);
  const [showQueue, setShowQueue] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const activeTool_ = TOOLS.find((t) => t.id === activeTool);
  const currentMessages = messages[activeTool] || [];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [currentMessages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const updatedMsgs = [...currentMessages, userMsg];
    setMessages((prev) => ({ ...prev, [activeTool]: updatedMsgs }));
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          system: SYSTEM_PROMPT,
          messages: updatedMsgs,
        }),
      });
      const data = await res.json();
      const reply = data.content?.map((b) => b.text || "").join("\n") || "No response.";
      setMessages((prev) => ({
        ...prev,
        [activeTool]: [...updatedMsgs, { role: "assistant", content: reply, isPacket: activeTool === "autoapply" }],
      }));
    } catch {
      setMessages((prev) => ({
        ...prev,
        [activeTool]: [...updatedMsgs, { role: "assistant", content: "Error reaching AI. Please try again." }],
      }));
    }
    setLoading(false);
  };

  const statusColors = { draft: "#4A6480", applied: "#FFD93D", interview: "#69FF94", offer: "#FF6B35" };

  return (
    <div style={{ minHeight: "100vh", background: "#080C10", color: "#E8EDF2", fontFamily: "'DM Mono','Fira Code',monospace", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:#0D1117;}
        ::-webkit-scrollbar-thumb{background:#1E2A38;border-radius:2px;}
        textarea{resize:none;outline:none;}
        button{cursor:pointer;border:none;background:none;}
        .tb{transition:all 0.2s ease;}
        .tb:hover{opacity:0.82;}
        .msg-in{animation:fadeUp 0.3s ease;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pulse{0%,100%{opacity:0.35;}50%{opacity:1;}}
        .dot{animation:pulse 1.2s infinite;}
        .dot:nth-child(2){animation-delay:0.2s;}
        .dot:nth-child(3){animation-delay:0.4s;}
        .grid-bg{background-image:linear-gradient(rgba(0,229,255,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.022) 1px,transparent 1px);background-size:40px 40px;}
        select{font-family:inherit;}
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1A2332", padding: "13px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(8,12,16,0.97)", position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "#FF6B3520", border: "1px solid #FF6B3555", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>⚡</div>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: "0.07em" }}>PM COPILOT</div>
            <div style={{ fontSize: 9, color: "#4A6480", letterSpacing: "0.12em" }}>SENIOR AI PM · AUTO-APPLY</div>
          </div>
        </div>
        <button className="tb" onClick={() => setShowQueue(!showQueue)} style={{
          fontSize: 9, padding: "5px 11px", borderRadius: 6,
          border: `1px solid ${showQueue ? "#FF6B3566" : "#1A2332"}`,
          color: showQueue ? "#FF6B35" : "#4A6480",
          background: showQueue ? "#FF6B3512" : "transparent",
          letterSpacing: "0.1em",
        }}>
          ◈ TRACKER ({jobQueue.length})
        </button>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "calc(100vh - 59px)" }}>

        {/* Sidebar */}
        <div style={{ width: 185, borderRight: "1px solid #1A2332", padding: "14px 10px", display: "flex", flexDirection: "column", gap: 5, background: "#060A0E", overflowY: "auto" }}>
          <div style={{ fontSize: 9, color: "#2A4060", letterSpacing: "0.2em", marginBottom: 5, paddingLeft: 3 }}>TOOLS</div>
          {TOOLS.map((tool) => (
            <button key={tool.id} className="tb" onClick={() => { setActiveTool(tool.id); setInput(""); setShowQueue(false); }} style={{
              padding: "8px 10px", borderRadius: 7, textAlign: "left",
              background: activeTool === tool.id ? `${tool.color}14` : "transparent",
              border: `1px solid ${activeTool === tool.id ? tool.color + "55" : "#1A2332"}`,
              color: activeTool === tool.id ? tool.color : "#4A6480",
            }}>
              <div style={{ fontSize: 12, marginBottom: 2 }}>{tool.icon} {tool.label}</div>
              <div style={{ fontSize: 9, opacity: 0.6, lineHeight: 1.4 }}>{tool.desc}</div>
            </button>
          ))}
          <div style={{ marginTop: "auto", borderTop: "1px solid #1A2332", paddingTop: 12 }}>
            <div style={{ fontSize: 9, color: "#2A4060", letterSpacing: "0.15em", marginBottom: 7, paddingLeft: 3 }}>PROFILE</div>
            <div style={{ fontSize: 9, color: "#3A5470", lineHeight: 1.8, paddingLeft: 3 }}>
              <div>◈ Senior / Executive</div>
              <div>◈ AI PM · Product Mgmt</div>
              <div>◈ Product Owner</div>
            </div>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }} className="grid-bg">

          {/* Job Tracker */}
          {showQueue && (
            <div style={{ borderBottom: "1px solid #1A2332", background: "#060A0E", padding: "14px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ fontSize: 9, color: "#FF6B35", letterSpacing: "0.15em" }}>⚡ JOB TRACKER</div>
                <button className="tb" onClick={() => {
                  const company = prompt("Company name?");
                  const role = prompt("Role title?");
                  if (company && role) setJobQueue(prev => [...prev, { id: Date.now(), company, role, status: "draft", fit: null }]);
                }} style={{ fontSize: 9, padding: "4px 9px", borderRadius: 5, border: "1px solid #FF6B3544", color: "#FF6B35", background: "#FF6B3510", letterSpacing: "0.1em" }}>
                  + ADD JOB
                </button>
              </div>
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                {jobQueue.map((job) => (
                  <div key={job.id} style={{ background: "#0D1520", border: "1px solid #1A2332", borderRadius: 9, padding: "9px 12px", minWidth: 155, flexShrink: 0 }}>
                    <div style={{ fontSize: 11, color: "#C0D0E0", marginBottom: 3, fontWeight: 500 }}>{job.company}</div>
                    <div style={{ fontSize: 9, color: "#4A6480", marginBottom: 8, lineHeight: 1.4 }}>{job.role}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <select value={job.status} onChange={(e) => setJobQueue(prev => prev.map(j => j.id === job.id ? { ...j, status: e.target.value } : j))}
                        style={{ fontSize: 9, background: "#080C10", border: "none", color: statusColors[job.status], letterSpacing: "0.08em", outline: "none", cursor: "pointer" }}>
                        <option value="draft">DRAFT</option>
                        <option value="applied">APPLIED</option>
                        <option value="interview">INTERVIEW</option>
                        <option value="offer">OFFER</option>
                      </select>
                      {job.fit && <div style={{ fontSize: 9, color: "#69FF94" }}>{job.fit}/10</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tool Bar */}
          <div style={{ padding: "11px 18px", borderBottom: "1px solid #1A2332", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(8,12,16,0.8)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ color: activeTool_.color, fontSize: 15 }}>{activeTool_.icon}</span>
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "0.06em" }}>{activeTool_.label.toUpperCase()}</span>
            </div>
            <button className="tb" onClick={() => { setInput(STARTERS[activeTool]); textareaRef.current?.focus(); }} style={{
              fontSize: 9, color: activeTool_.color, border: `1px solid ${activeTool_.color}44`,
              borderRadius: 5, padding: "4px 10px", background: `${activeTool_.color}10`, letterSpacing: "0.1em",
            }}>USE TEMPLATE ↗</button>
          </div>

          {/* Auto-Apply Hero */}
          {activeTool === "autoapply" && currentMessages.length === 0 && (
            <div style={{ margin: "16px 18px 0", padding: "14px 16px", background: "#FF6B3510", border: "1px solid #FF6B3530", borderRadius: 10 }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12, color: "#FF6B35", marginBottom: 5 }}>⚡ ONE CLICK → FULL APPLICATION PACKET</div>
              <div style={{ fontSize: 10, color: "#6A8AAA", lineHeight: 1.7, marginBottom: 10 }}>
                Paste any job description + your background. Get a complete ready-to-use packet instantly.
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["Resume Headline", "Executive Summary", "5 Tailored Bullets", "Cover Letter", "LinkedIn DM", "Follow-Up Email", "App Checklist"].map(tag => (
                  <div key={tag} style={{ fontSize: 9, padding: "2px 8px", borderRadius: 20, border: "1px solid #FF6B3530", color: "#FF6B35", background: "#FF6B3508", letterSpacing: "0.06em" }}>{tag}</div>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "18px" }}>
            {currentMessages.length === 0 && activeTool !== "autoapply" && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, opacity: 0.4 }}>
                <div style={{ fontSize: 36, color: activeTool_.color }}>{activeTool_.icon}</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: "#4A6480", letterSpacing: "0.1em" }}>{activeTool_.label.toUpperCase()}</div>
                <div style={{ fontSize: 10, color: "#2A4060", textAlign: "center", maxWidth: 260, lineHeight: 1.6 }}>
                  {activeTool_.desc}. Hit "USE TEMPLATE" to get started.
                </div>
              </div>
            )}

            {currentMessages.map((msg, i) => (
              <div key={i} className="msg-in" style={{ marginBottom: 16, display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                {msg.role === "assistant" && (
                  <div style={{ width: 24, height: 24, minWidth: 24, background: `${activeTool_.color}20`, border: `1px solid ${activeTool_.color}44`, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: activeTool_.color, marginRight: 7, marginTop: 2 }}>⬡</div>
                )}
                <div style={{
                  maxWidth: msg.isPacket ? "92%" : "72%",
                  width: msg.isPacket ? "92%" : "auto",
                  padding: "11px 13px",
                  borderRadius: msg.role === "user" ? "9px 9px 2px 9px" : "9px 9px 9px 2px",
                  background: msg.role === "user" ? `linear-gradient(135deg,${activeTool_.color}20,${activeTool_.color}0D)` : "#0D1520",
                  border: `1px solid ${msg.role === "user" ? activeTool_.color + "33" : "#1A2332"}`,
                  fontSize: 12, lineHeight: 1.7,
                  color: msg.role === "user" ? "#C8D8E8" : "#A8B8CC",
                  whiteSpace: msg.isPacket ? "normal" : "pre-wrap",
                  wordBreak: "break-word",
                }}>
                  {msg.isPacket ? <AutoApplyPacket text={msg.content} color={activeTool_.color} /> : msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
                <div style={{ width: 24, height: 24, background: `${activeTool_.color}20`, border: `1px solid ${activeTool_.color}44`, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: activeTool_.color }}>⬡</div>
                <div style={{ padding: "9px 16px", background: "#0D1520", border: "1px solid #1A2332", borderRadius: "9px 9px 9px 2px", display: "flex", gap: 5, alignItems: "center" }}>
                  {[0, 1, 2].map(i => <div key={i} className="dot" style={{ width: 5, height: 5, borderRadius: "50%", background: activeTool_.color }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "12px 18px", borderTop: "1px solid #1A2332", background: "rgba(8,12,16,0.96)" }}>
            <div style={{ display: "flex", gap: 9, alignItems: "flex-end", background: "#0D1520", border: `1px solid ${input ? activeTool_.color + "55" : "#1A2332"}`, borderRadius: 9, padding: "10px 12px", transition: "border-color 0.2s" }}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) sendMessage(); }}
                placeholder={activeTool === "autoapply" ? "Paste job description + your background... (⌘+Enter)" : `Ask your ${activeTool_.label.toLowerCase()} assistant... (⌘+Enter)`}
                rows={3}
                style={{ flex: 1, background: "transparent", border: "none", color: "#C8D8E8", fontSize: 12, lineHeight: 1.6, fontFamily: "inherit", letterSpacing: "0.02em" }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                style={{ width: 32, height: 32, borderRadius: 6, background: input.trim() && !loading ? activeTool_.color : "#1A2332", color: input.trim() && !loading ? "#080C10" : "#2A4060", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", flexShrink: 0 }}
              >↑</button>
            </div>
            <div style={{ fontSize: 9, color: "#161E28", marginTop: 5, textAlign: "center", letterSpacing: "0.1em" }}>POWERED BY CLAUDE · SENIOR AI PM · AUTO-APPLY</div>
          </div>
        </div>
      </div>
    </div>
  );
}
