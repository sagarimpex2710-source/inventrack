import { useState, useRef, useEffect } from "react";
import { Package, Users, FileText, Plus, Trash2, Edit3, Search, X, Check, ChevronRight, Settings, Camera, Palette, AlertTriangle, ShoppingBag, Phone, Mail, Calendar, MapPin, Building, Cake, Grid3X3, Truck, Printer, Download, ChevronDown, MessageCircle, Send, Bot, Sparkles, Lock, ShoppingCart, ExternalLink, ClipboardList, CheckCircle, Clock, XCircle, KeyRound, DatabaseBackup, Upload, RotateCcw, Share2, PhoneCall, ImageIcon, ChevronLeft, ChevronUp, History, MessageSquare, Star, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

/* ── Supabase Client ── */
const SUPA_URL = "https://godcyrhyplwocwkuoqqx.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvZGN5cmh5cGx3b2N3a3VvcXF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMTEzNDIsImV4cCI6MjA4Nzc4NzM0Mn0.el44jSooM2nA8eH29MyZXA6FdIjgYIslNEX29BQpgYE";
const supabase = createClient(SUPA_URL, SUPA_KEY);

const H = { "Content-Type": "application/json", "apikey": SUPA_KEY, "Authorization": `Bearer ${SUPA_KEY}`, "Prefer": "resolution=merge-duplicates" };

const db = {
  from: (table) => ({
    select: async (cols="*") => {
      const r = await fetch(`${SUPA_URL}/rest/v1/${table}?select=${cols}`, { headers: H });
      return r.ok ? { data: await r.json(), error: null } : { data: null, error: await r.json() };
    },
    selectOrdered: async (col, asc=false) => {
      const r = await fetch(`${SUPA_URL}/rest/v1/${table}?select=*&order=${col}.${asc?"asc":"desc"}`, { headers: H });
      return r.ok ? { data: await r.json(), error: null } : { data: null, error: await r.json() };
    },
    upsert: async (row) => {
      const r = await fetch(`${SUPA_URL}/rest/v1/${table}`, { method: "POST", headers: H, body: JSON.stringify(row) });
      return r.ok ? { error: null } : { error: await r.json() };
    },
    delete: async (col, val) => {
      const r = await fetch(`${SUPA_URL}/rest/v1/${table}?${col}=eq.${val}`, { method: "DELETE", headers: H });
      return r.ok ? { error: null } : { error: await r.json() };
    },
    deleteAll: async () => {
      const r = await fetch(`${SUPA_URL}/rest/v1/${table}?id=neq.___`, { method: "DELETE", headers: H });
      return r.ok ? { error: null } : { error: await r.json() };
    },
  })
};

const uid = () => Math.random().toString(36).substr(2, 9);
const SIZES = ["S","M","L","XL","XXL","3XL","4XL","5XL","6XL","7XL"];
const DEFAULT_CATS = ["Kurta","Pant","Kurta Pant","Dupatta Set","Top","Dresses"];
const FABRICS = ["Cotton","Mix Blend","Viscous","Other (Enter Manually)"];
const STATES_IN = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Chandigarh","Jammu & Kashmir","Ladakh","Puducherry"];

const GST_STATES = {"01":"Jammu & Kashmir","02":"Himachal Pradesh","03":"Punjab","04":"Chandigarh","05":"Uttarakhand","06":"Haryana","07":"Delhi","08":"Rajasthan","09":"Uttar Pradesh","10":"Bihar","11":"Sikkim","12":"Arunachal Pradesh","13":"Nagaland","14":"Manipur","15":"Mizoram","16":"Tripura","17":"Meghalaya","18":"Assam","19":"West Bengal","20":"Jharkhand","21":"Odisha","22":"Chhattisgarh","23":"Madhya Pradesh","24":"Gujarat","26":"Dadra & Nagar Haveli","27":"Maharashtra","28":"Andhra Pradesh","29":"Karnataka","30":"Goa","31":"Lakshadweep","32":"Kerala","33":"Tamil Nadu","34":"Puducherry","35":"Andaman & Nicobar","36":"Telangana","37":"Andhra Pradesh","38":"Ladakh"};

const gstAutoFill = (gstin, setCf, setGstStatus) => {
  const g = gstin.toUpperCase().trim();
  setCf(prev => ({...prev, gst: g}));
  if (g.length < 2) { setGstStatus(""); return; }

  // Extract state from digits 1-2
  const stateCode = g.slice(0,2);
  const state = GST_STATES[stateCode] || "";
  if (state) setCf(prev => ({...prev, gst: g, state}));

  if (g.length !== 15) { setGstStatus(""); return; }

  // Validate GST format: 2 digits + 10 PAN + 1 digit + Z + 1 checksum
  const gstRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1}$/;
  if (gstRegex.test(g)) {
    // Extract PAN-based info
    const pan = g.slice(2, 12);
    const entityType = {"P":"Proprietor","F":"Firm/LLP","C":"Company","H":"HUF","A":"AOP","B":"BOI","G":"Govt","J":"AI","L":"Local","T":"Trust"}[pan[3]] || "";
    setGstStatus({state, pan, entityType, valid: true});
  } else {
    setGstStatus({valid: false});
  }
};

const fmtD = d => d ? new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—";
const fmtR = n => "₹" + Number(n).toLocaleString("en-IN",{minimumFractionDigits:2});
const fmtS = n => "₹" + Number(n).toLocaleString("en-IN");

/* ── Shared Styles ── */
const S = {
  bg:"#f5f6fa", card:"#ffffff", bdr:"#e5e7ee", bdrD:"#d1d5de",
  txt:"#1a1d26", txt2:"#5f6577", txt3:"#9ca3b4",
  acc:"#4361ee", accL:"#eef1ff",
  grn:"#0d9f6e", grnL:"#ecfdf5", amb:"#d97706", ambL:"#fffbeb",
  red:"#dc2626", redL:"#fef2f2", pur:"#7c3aed", purL:"#f5f3ff",
  pnk:"#db2777", pnkL:"#fdf2f8", tea:"#0891b2", teaL:"#ecfeff",
  f:"'DM Sans',system-ui,sans-serif", fm:"'JetBrains Mono',monospace"
};

/* ── Supabase Storage Upload ── */
const uploadToStorage = async (file, folder = "general") => {
  // Compress first
  const compressed = await new Promise((res, rej) => {
    if (!file || !file.type.startsWith("image/")) { rej(new Error("Not an image")); return; }
    const reader = new FileReader();
    reader.onerror = () => rej(new Error("Read failed"));
    reader.onload = ev => {
      const img = new Image();
      img.onerror = () => rej(new Error("Load failed"));
      img.onload = () => {
        try {
          const maxPx = 800;
          const ratio = Math.min(maxPx / img.width, maxPx / img.height, 1);
          const w = Math.max(1, Math.round(img.width * ratio));
          const h = Math.max(1, Math.round(img.height * ratio));
          const canvas = document.createElement("canvas");
          canvas.width = w; canvas.height = h;
          canvas.getContext("2d").drawImage(img, 0, 0, w, h);
          canvas.toBlob(blob => blob ? res(blob) : rej(new Error("Blob failed")), "image/webp", 0.75);
        } catch(e) { rej(e); }
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  // Upload blob to Supabase Storage
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
  const storageH = { "apikey": SUPA_KEY, "Authorization": `Bearer ${SUPA_KEY}`, "Content-Type": "image/webp", "x-upsert": "true" };
  const r = await fetch(`${SUPA_URL}/storage/v1/object/images/${filename}`, { method: "POST", headers: storageH, body: compressed });
  if (!r.ok) throw new Error("Storage upload failed");
  return `${SUPA_URL}/storage/v1/object/public/images/${filename}`;
};

const isStorageUrl = v => typeof v === "string" && v.startsWith("http");

/* ── Image Upload Component ── */
const ImgUp = ({value, onChange, sz=80, folder="general"}) => {
  const ref = useRef();
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const handle = async e => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 15 * 1024 * 1024) { setErr("Max 15MB"); setTimeout(() => setErr(""), 3000); return; }
    setUploading(true); setErr("");
    try {
      const url = await uploadToStorage(f, folder);
      onChange(url);
    } catch(ex) {
      console.error("Upload error:", ex);
      setErr("Upload failed"); setTimeout(() => setErr(""), 3000);
    }
    finally { setUploading(false); e.target.value = ""; }
  };
  return (
    <div style={{position:"relative", display:"inline-block"}}>
      <div onClick={() => !uploading && ref.current?.click()} style={{width:sz, height:sz, borderRadius:10, border:`2px dashed ${err ? S.red : value ? S.acc : S.bdr}`, background:value?"transparent":S.bg, display:"flex", alignItems:"center", justifyContent:"center", cursor:uploading?"wait":"pointer", overflow:"hidden", flexShrink:0}}>
        {uploading
          ? <div style={{textAlign:"center",color:S.acc}}><RefreshCw size={18} style={{animation:"spin 1s linear infinite"}}/><div style={{fontSize:9,marginTop:4}}>Uploading…</div></div>
          : value
            ? <img src={value} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            : <div style={{textAlign:"center",color:err?S.red:S.txt3}}><Camera size={20}/><div style={{fontSize:9,marginTop:2}}>{err||"Upload"}</div></div>
        }
      </div>
      <input ref={ref} type="file" accept="image/*" onChange={handle} style={{display:"none"}}/>
      {value && !uploading && <button onClick={e => {e.stopPropagation(); onChange(null);}} style={{position:"absolute",top:-6,right:-6,width:20,height:20,borderRadius:"50%",background:S.red,border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:0}}><X size={10} color="#fff"/></button>}
    </div>
  );
};
const Btn = ({children,v="primary",sz="md",onClick,disabled,icon,style:st}) => {
  const vs = {primary:{bg:S.acc,c:"#fff"},secondary:{bg:S.card,c:S.txt2,bd:`1px solid ${S.bdr}`},danger:{bg:S.redL,c:S.red},ghost:{bg:"transparent",c:S.txt2},success:{bg:S.grn,c:"#fff"}}[v];
  const ss = {sm:{p:"5px 10px",f:11},md:{p:"8px 16px",f:12},lg:{p:"10px 20px",f:13}}[sz];
  return <button disabled={disabled} onClick={onClick} style={{display:"inline-flex",alignItems:"center",gap:5,padding:ss.p,fontSize:ss.f,fontWeight:600,fontFamily:S.f,border:vs.bd||"none",borderRadius:8,background:vs.bg,color:vs.c,cursor:disabled?"not-allowed":"pointer",opacity:disabled?.4:1,transition:"all .15s",whiteSpace:"nowrap",...st}}>{icon}{children}</button>;
};

const Inp = ({label,icon,cStyle,...p}) => (
  <div style={{display:"flex",flexDirection:"column",gap:3,...cStyle}}>
    {label && <label style={{fontSize:10,fontWeight:700,color:S.txt3,letterSpacing:.8,textTransform:"uppercase",fontFamily:S.f}}>{label}</label>}
    <div style={{display:"flex",alignItems:"center",background:S.bg,border:`1px solid ${S.bdr}`,borderRadius:8,padding:"0 10px"}}>
      {icon && <span style={{color:S.txt3,display:"flex",marginRight:6}}>{icon}</span>}
      <input {...p} style={{flex:1,background:"transparent",border:"none",outline:"none",color:S.txt,fontFamily:S.f,fontSize:13,padding:"9px 0",...(p.iStyle||{})}} />
    </div>
  </div>
);

const Sel = ({label,options,placeholder,...p}) => (
  <div style={{display:"flex",flexDirection:"column",gap:3}}>
    {label && <label style={{fontSize:10,fontWeight:700,color:S.txt3,letterSpacing:.8,textTransform:"uppercase",fontFamily:S.f}}>{label}</label>}
    <select {...p} style={{background:S.bg,border:`1px solid ${S.bdr}`,borderRadius:8,padding:"9px 10px",color:S.txt,fontFamily:S.f,fontSize:13,outline:"none",cursor:"pointer"}}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={typeof o==="string"?o:o.v} value={typeof o==="string"?o:o.v}>{typeof o==="string"?o:o.l}</option>)}
    </select>
  </div>
);

const Tag = ({children,color=S.acc}) => <span style={{display:"inline-flex",padding:"2px 9px",borderRadius:14,fontSize:10,fontWeight:700,color,background:`${color}15`}}>{children}</span>;

/* ── Searchable Select ── */
const SearchSel = ({label, options, value, onChange, placeholder="Search..."}) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const selected = options.find(o => o.v === value);
  const filtered = options.filter(o => o.l.toLowerCase().includes(query.toLowerCase()));

  // Close on outside click
  useState(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  });

  return (
    <div ref={ref} style={{display:"flex",flexDirection:"column",gap:3,position:"relative"}}>
      {label && <label style={{fontSize:10,fontWeight:700,color:S.txt3,letterSpacing:.8,textTransform:"uppercase",fontFamily:S.f}}>{label}</label>}
      <div
        onClick={() => { setOpen(o => !o); setQuery(""); }}
        style={{display:"flex",alignItems:"center",background:S.bg,border:`1px solid ${open ? S.acc : S.bdr}`,borderRadius:8,padding:"0 10px",cursor:"pointer",minHeight:38,transition:"border-color .15s"}}
      >
        {selected
          ? <span style={{flex:1,fontSize:13,color:S.txt,fontFamily:S.f,padding:"9px 0",lineHeight:1}}>{selected.l}</span>
          : <span style={{flex:1,fontSize:13,color:S.txt3,fontFamily:S.f,padding:"9px 0"}}>{placeholder}</span>
        }
        {selected
          ? <button onClick={e => { e.stopPropagation(); onChange(""); setOpen(false); }} style={{background:"none",border:"none",padding:2,cursor:"pointer",display:"flex",color:S.txt3}}><X size={13}/></button>
          : <ChevronDown size={13} style={{color:S.txt3,transform:open?"rotate(180deg)":"none",transition:"transform .15s"}}/>
        }
      </div>
      {open && (
        <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:200,background:S.card,border:`1px solid ${S.bdrD}`,borderRadius:10,boxShadow:"0 8px 24px rgba(0,0,0,.12)",marginTop:4,overflow:"hidden"}}>
          <div style={{padding:"8px 10px",borderBottom:`1px solid ${S.bdr}`,display:"flex",alignItems:"center",gap:6,background:S.bg}}>
            <Search size={13} style={{color:S.txt3,flexShrink:0}}/>
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Type to search..."
              style={{flex:1,border:"none",outline:"none",background:"transparent",fontSize:13,color:S.txt,fontFamily:S.f}}
            />
            {query && <button onClick={() => setQuery("")} style={{background:"none",border:"none",padding:0,cursor:"pointer",display:"flex",color:S.txt3}}><X size={12}/></button>}
          </div>
          <div style={{maxHeight:200,overflowY:"auto"}}>
            {filtered.length === 0
              ? <div style={{padding:"14px 12px",fontSize:12,color:S.txt3,textAlign:"center"}}>No results found</div>
              : filtered.map(o => (
                  <div
                    key={o.v}
                    onClick={() => { onChange(o.v); setOpen(false); setQuery(""); }}
                    style={{padding:"10px 12px",fontSize:13,cursor:"pointer",background:o.v === value ? S.accL : "transparent",color:o.v === value ? S.acc : S.txt,fontWeight:o.v === value ? 600 : 400,fontFamily:S.f,borderBottom:`1px solid ${S.bdr}`,transition:"background .1s"}}
                    onMouseEnter={e => { if (o.v !== value) e.currentTarget.style.background = S.bg; }}
                    onMouseLeave={e => { if (o.v !== value) e.currentTarget.style.background = "transparent"; }}
                  >
                    {o.l}
                  </div>
                ))
            }
          </div>
        </div>
      )}
    </div>
  );
};

const Modal = ({open,onClose,title,sub,children,w=640}) => {
  if (!open) return null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"flex-start",justifyContent:"center",background:"rgba(0,0,0,.4)",backdropFilter:"blur(4px)",paddingTop:16,overflowY:"auto",WebkitOverflowScrolling:"touch"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:S.card,borderRadius:16,border:`1px solid ${S.bdr}`,width:"calc(100% - 16px)",maxWidth:w,boxShadow:"0 20px 60px rgba(0,0,0,.15)",marginBottom:40}}>
        <div style={{padding:"14px 16px",borderBottom:`1px solid ${S.bdr}`,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,background:S.card,borderRadius:"16px 16px 0 0",zIndex:1}}>
          <div><h3 style={{margin:0,fontSize:15,fontWeight:700}}>{title}</h3>{sub && <p style={{margin:"2px 0 0",fontSize:11,color:S.txt2}}>{sub}</p>}</div>
          <button onClick={onClose} style={{background:S.bg,border:"none",borderRadius:8,padding:6,cursor:"pointer",display:"flex",color:S.txt2}}><X size={16}/></button>
        </div>
        <div style={{padding:"16px"}}>{children}</div>
      </div>
    </div>
  );
};

const ConfirmDialog = ({open, title, message, onYes, onNo, danger=true}) => {
  if (!open) return null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,.5)",backdropFilter:"blur(6px)",padding:16}}>
      <div onClick={e=>e.stopPropagation()} style={{background:S.card,borderRadius:18,border:`1px solid ${S.bdr}`,width:"calc(100% - 16px)",maxWidth:380,boxShadow:"0 24px 64px rgba(0,0,0,.2)",overflow:"hidden"}}>
        <div style={{padding:"20px 20px 16px",textAlign:"center"}}>
          <div style={{width:52,height:52,borderRadius:16,background:danger?S.redL:S.ambL,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}>
            <AlertTriangle size={24} color={danger?S.red:S.amb}/>
          </div>
          <div style={{fontSize:16,fontWeight:800,marginBottom:8}}>{title}</div>
          <div style={{fontSize:13,color:S.txt2,lineHeight:1.6}}>{message}</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0,borderTop:`1px solid ${S.bdr}`}}>
          <button onClick={onNo} style={{padding:"14px 0",border:"none",borderRight:`1px solid ${S.bdr}`,background:"#fff",color:S.txt2,fontSize:14,fontWeight:700,fontFamily:S.f,cursor:"pointer",borderRadius:"0 0 0 18px"}}>No, Cancel</button>
          <button onClick={onYes} style={{padding:"14px 0",border:"none",background:danger?S.red:S.amb,color:"#fff",fontSize:14,fontWeight:700,fontFamily:S.f,cursor:"pointer",borderRadius:"0 0 18px 0"}}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
};

const SizeChip = ({label,on,onClick}) => (
  <button onClick={onClick} style={{padding:"6px 12px",borderRadius:16,fontSize:12,fontWeight:600,fontFamily:S.f,border:on?`2px solid ${S.acc}`:`1.5px solid ${S.bdr}`,background:on?S.accL:S.card,color:on?S.acc:S.txt2,cursor:"pointer",minWidth:42,textAlign:"center"}}>{label}</button>
);

const ColorDot = ({name}) => {
  const h = name.split("").reduce((a,c)=>a+c.charCodeAt(0),0) % 360;
  return <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"3px 10px 3px 3px",background:`hsl(${h},55%,95%)`,borderRadius:16,border:`1px solid hsl(${h},45%,85%)`}}><div style={{width:16,height:16,borderRadius:"50%",background:`hsl(${h},55%,55%)`,border:`2px solid hsl(${h},45%,85%)`}}/><span style={{fontSize:11,fontWeight:600,color:`hsl(${h},50%,35%)`}}>{name}</span></div>;
};



const Stat = ({icon,label,value,color}) => (
  <div style={{background:S.card,borderRadius:12,padding:"14px 16px",border:`1px solid ${S.bdr}`,flex:"1 1 130px",minWidth:0}}>
    <div style={{width:32,height:32,borderRadius:8,background:`${color}15`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8,color}}>{icon}</div>
    <div style={{fontSize:20,fontWeight:800,color:S.txt,letterSpacing:-.5}}>{value}</div>
    <div style={{fontSize:9,fontWeight:700,color:S.txt3,marginTop:2,letterSpacing:.8,textTransform:"uppercase"}}>{label}</div>
  </div>
);

/* ── Shop Product Card ── */
const ShopProductCard = ({ article, onAddToCart, onViewDetail }) => {
  const [selColor, setSelColor] = useState(0);
  const col = article.colors[selColor];
  const totalStock = article.colors.reduce((s,c) => s + Object.values(c.sizes).reduce((ss,v) => ss+(v.qty||0),0), 0);

  return (
    <div style={{background:"#fff",borderRadius:16,border:`1px solid ${S.bdr}`,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,.05)",display:"flex",flexDirection:"column",cursor:"pointer",transition:"box-shadow .2s,transform .15s"}}
      onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 8px 28px rgba(67,97,238,.15)";e.currentTarget.style.transform="translateY(-2px)";}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,.05)";e.currentTarget.style.transform="none";}}
      onClick={()=>onViewDetail(article, selColor)}
    >
      <div style={{height:200,background:S.bg,overflow:"hidden",position:"relative"}}>
        {col?.image
          ? <img src={col.image} alt={article.name} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform .3s"}}/>
          : <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:6,color:S.txt3}}><Package size={40}/><span style={{fontSize:11}}>No image</span></div>
        }
        <div style={{position:"absolute",top:8,left:8}}><Tag color={S.pur}>{article.category}</Tag></div>
        {totalStock <= 5 && totalStock > 0 && <div style={{position:"absolute",top:8,right:8,background:"#dc2626",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20}}>Only {totalStock} left!</div>}
        {totalStock === 0 && <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"#fff",fontWeight:700,fontSize:13}}>Out of Stock</span></div>}
      </div>
      <div style={{padding:"12px 13px",flex:1,display:"flex",flexDirection:"column",gap:6}}>
        <div style={{fontSize:14,fontWeight:700,lineHeight:1.3}}>{article.name}</div>
        <div style={{fontSize:11,color:S.txt3}}>{article.fabricQuality}</div>
        {/* Color swatches */}
        <div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}}>
          {article.colors.map((c,i) => {
            const h = c.name.split("").reduce((a,ch)=>a+ch.charCodeAt(0),0)%360;
            return <button key={i} onClick={e=>{e.stopPropagation();setSelColor(i);}} title={c.name} style={{width:20,height:20,borderRadius:"50%",background:`hsl(${h},55%,55%)`,border:selColor===i?`3px solid ${S.acc}`:`2px solid rgba(0,0,0,.1)`,cursor:"pointer",padding:0,flexShrink:0}}/>;
          })}
          <span style={{fontSize:10,color:S.txt3,marginLeft:2}}>{article.colors.length} color{article.colors.length>1?"s":""}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"auto",paddingTop:6}}>
          <div style={{fontSize:11,color:S.txt2}}>{article.selectedSizes.length} sizes</div>
          <div style={{fontSize:12,fontWeight:700,color:S.acc,display:"flex",alignItems:"center",gap:3}}>View Details <ChevronRight size={12}/></div>
        </div>
      </div>
    </div>
  );
};

/* ── Product Detail Modal ── */
const ProductDetailModal = ({ article, initialColorIdx=0, onClose, onAddToCart }) => {
  const [selColor, setSelColor] = useState(initialColorIdx);
  const [selSize, setSelSize] = useState("");
  const [added, setAdded] = useState(false);
  if (!article) return null;
  const col = article.colors[selColor];
  const availSizes = article.selectedSizes.filter(s => (col?.sizes[s]?.qty||0) > 0);
  const price = selSize ? col?.sizes[selSize]?.price || 0 : 0;
  const totalStock = Object.values(col?.sizes||{}).reduce((s,v)=>s+(v.qty||0),0);
  const doAdd = () => {
    if (!selSize || !col) return;
    onAddToCart(article.id, selColor, selSize, col.sizes[selSize]?.price||0);
    setAdded(true); setTimeout(() => setAdded(false), 1800);
  };
  return (
    <div style={{position:"fixed",inset:0,zIndex:600,background:"rgba(0,0,0,.5)",backdropFilter:"blur(6px)",display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"20px 20px 0 0",width:"100%",maxWidth:540,maxHeight:"92vh",overflow:"hidden",display:"flex",flexDirection:"column"}}>
        {/* Image Gallery */}
        <div style={{position:"relative",height:280,background:S.bg,flexShrink:0}}>
          {col?.image
            ? <img src={col.image} alt={article.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            : <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",flexDirection:"column",gap:8,color:S.txt3}}><Package size={48}/><span>No image</span></div>
          }
          <button onClick={onClose} style={{position:"absolute",top:12,left:12,background:"rgba(0,0,0,.4)",border:"none",borderRadius:"50%",width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}}><X size={16}/></button>
          <div style={{position:"absolute",top:12,right:12}}><Tag color={S.pur}>{article.category}</Tag></div>
          {/* Thumbnail row */}
          {article.colors.length > 1 && (
            <div style={{position:"absolute",bottom:10,left:0,right:0,display:"flex",justifyContent:"center",gap:6,padding:"0 12px"}}>
              {article.colors.map((c,i) => {
                const h = c.name.split("").reduce((a,ch)=>a+ch.charCodeAt(0),0)%360;
                return (
                  <button key={i} onClick={()=>{setSelColor(i);setSelSize("");}} style={{width:36,height:36,borderRadius:8,border:selColor===i?`2.5px solid #fff`:`2px solid rgba(255,255,255,.4)`,overflow:"hidden",cursor:"pointer",flexShrink:0,background:`hsl(${h},55%,55%)`,padding:0}}>
                    {c.image && <img src={c.image} alt={c.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Details */}
        <div style={{padding:"16px 18px",overflowY:"auto",flex:1}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10,marginBottom:10}}>
            <div>
              <h2 style={{margin:0,fontSize:18,fontWeight:800,lineHeight:1.2}}>{article.name}</h2>
              <div style={{fontSize:12,color:S.txt2,marginTop:3}}>{article.fabricQuality} · {article.category}</div>
            </div>
            {totalStock <= 5 && totalStock > 0 && <span style={{background:S.redL,color:S.red,fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:20,whiteSpace:"nowrap"}}>Only {totalStock} left!</span>}
          </div>

          {/* Selected color */}
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,padding:"8px 12px",background:S.bg,borderRadius:10}}>
            <div style={{width:24,height:24,borderRadius:"50%",background:`hsl(${col?.name.split("").reduce((a,c)=>a+c.charCodeAt(0),0)%360},55%,55%)`,border:`2px solid rgba(0,0,0,.1)`,flexShrink:0}}/>
            <div style={{fontSize:13,fontWeight:600}}>{col?.name}</div>
            <div style={{marginLeft:"auto",display:"flex",gap:6}}>
              {article.colors.map((c,i) => {
                const h = c.name.split("").reduce((a,ch)=>a+ch.charCodeAt(0),0)%360;
                return <button key={i} onClick={()=>{setSelColor(i);setSelSize("");}} title={c.name} style={{width:22,height:22,borderRadius:"50%",background:`hsl(${h},55%,55%)`,border:selColor===i?`3px solid ${S.acc}`:`2px solid rgba(0,0,0,.1)`,cursor:"pointer",padding:0}}/>;
              })}
            </div>
          </div>

          {/* Size picker */}
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,fontWeight:700,color:S.txt3,textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Select Size</div>
            {availSizes.length > 0 ? (
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {article.selectedSizes.map(s => {
                  const avail = (col?.sizes[s]?.qty||0) > 0;
                  return (
                    <button key={s} onClick={()=>avail&&setSelSize(s)} style={{padding:"8px 14px",borderRadius:10,fontSize:13,fontWeight:700,fontFamily:S.f,border:selSize===s?`2px solid ${S.acc}`:`1.5px solid ${avail?S.bdr:"#e5e7eb"}`,background:selSize===s?S.accL:"#fff",color:selSize===s?S.acc:avail?S.txt:"#ccc",cursor:avail?"pointer":"not-allowed",textDecoration:avail?"none":"line-through"}}>
                      {s}
                    </button>
                  );
                })}
              </div>
            ) : <div style={{fontSize:13,color:S.red,fontWeight:600}}>This color is out of stock</div>}
          </div>

          {/* Price */}
          {selSize && price > 0 && (
            <div style={{fontSize:22,fontWeight:800,color:S.grn,fontFamily:S.fm,marginBottom:14}}>{fmtS(price)}</div>
          )}
        </div>

        {/* Add to cart */}
        <div style={{padding:"14px 18px",borderTop:`1px solid ${S.bdr}`,background:"#fff",flexShrink:0}}>
          <button onClick={doAdd} disabled={!selSize||availSizes.length===0} style={{width:"100%",padding:"14px 0",borderRadius:14,border:"none",background:added?"#0d9f6e":selSize&&availSizes.length>0?"linear-gradient(135deg,#4361ee,#7c3aed)":"#e5e7eb",color:"#fff",fontWeight:700,fontSize:15,fontFamily:S.f,cursor:selSize&&availSizes.length>0?"pointer":"not-allowed",transition:"background .25s"}}>
            {added?"✓ Added to Cart!":"Add to Cart 🛒"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── ChatBot Component ── */
const ChatBot = ({articles, co, chatMsgs, setChatMsgs, chatOpen, setChatOpen, chatInput, setChatInput, chatLoading, setChatLoading, chatEndRef, chatInputRef, buildSystemPrompt}) => {
  const sendChat = async () => {
    const msg = chatInput.trim();
    if (!msg || chatLoading) return;
    const userMsg = {role:"user", content:msg};
    const newMsgs = [...chatMsgs, userMsg];
    setChatMsgs(newMsgs);
    setChatInput("");
    setChatLoading(true);
    setTimeout(() => chatEndRef.current?.scrollIntoView({behavior:"smooth"}), 50);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,system:buildSystemPrompt(),messages:newMsgs.map(m=>({role:m.role,content:m.content}))})
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Sorry, I couldn't get a response. Please try again!";
      setChatMsgs(prev => [...prev, {role:"assistant", content:reply}]);
    } catch {
      setChatMsgs(prev => [...prev, {role:"assistant", content:"Oops! Something went wrong. 😊"}]);
    } finally {
      setChatLoading(false);
      setTimeout(() => { chatEndRef.current?.scrollIntoView({behavior:"smooth"}); chatInputRef.current?.focus(); }, 80);
    }
  };
  return (
    <>
      <button onClick={() => { setChatOpen(o=>!o); setTimeout(()=>chatInputRef.current?.focus(),200); }} style={{position:"fixed",bottom:22,right:20,zIndex:900,width:54,height:54,borderRadius:"50%",border:"none",cursor:"pointer",background:"linear-gradient(135deg,#4361ee,#7c3aed)",boxShadow:"0 4px 20px rgba(67,97,238,.45)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",transition:"transform .2s",transform:chatOpen?"scale(0.9)":"scale(1)"}}>
        {chatOpen ? <X size={22}/> : <MessageCircle size={22}/>}
        {!chatOpen && chatMsgs.length > 1 && <div style={{position:"absolute",top:-3,right:-3,width:16,height:16,borderRadius:"50%",background:S.grn,border:"2px solid #fff",fontSize:9,fontWeight:800,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>{chatMsgs.filter(m=>m.role==="assistant").length-1}</div>}
      </button>
      {chatOpen && (
        <div style={{position:"fixed",bottom:88,right:16,zIndex:900,width:"min(380px,calc(100vw - 24px))",height:"min(540px,calc(100vh - 120px))",background:"#fff",borderRadius:18,border:`1px solid ${S.bdr}`,boxShadow:"0 16px 60px rgba(0,0,0,.18)",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"14px 16px",background:"linear-gradient(135deg,#4361ee,#7c3aed)",display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Bot size={18} color="#fff"/></div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:"#fff"}}>Product Assistant</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.75)",display:"flex",alignItems:"center",gap:4}}><div style={{width:6,height:6,borderRadius:"50%",background:"#4ade80"}}/>Online · Ask about our collections</div>
            </div>
            <button onClick={()=>setChatMsgs([{role:"assistant",content:"👋 Hello! I'm your product assistant. Ask me about our latest collections, available sizes, fabrics, or anything about our products!"}])} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer",color:"rgba(255,255,255,.8)",fontSize:10,fontWeight:600,fontFamily:S.f}}>Clear</button>
          </div>
          {chatMsgs.length <= 1 && (
            <div style={{padding:"8px 10px",borderBottom:`1px solid ${S.bdr}`,display:"flex",gap:6,flexWrap:"wrap",background:S.bg}}>
              {["What's new? ✨","Show all kurtas 👗","Best fabrics? 🧵","Sizes available?"].map(q=>(
                <button key={q} onClick={()=>{setChatInput(q);setTimeout(()=>chatInputRef.current?.focus(),50);}} style={{padding:"5px 10px",borderRadius:20,border:`1px solid ${S.acc}30`,background:S.accL,color:S.acc,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:S.f,whiteSpace:"nowrap"}}>{q}</button>
              ))}
            </div>
          )}
          <div style={{flex:1,overflowY:"auto",padding:"14px 12px",display:"flex",flexDirection:"column",gap:10}}>
            {chatMsgs.map((m,i)=>(
              <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",gap:7,alignItems:"flex-end"}}>
                {m.role==="assistant" && <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#4361ee,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginBottom:2}}><Sparkles size={13} color="#fff"/></div>}
                <div style={{maxWidth:"78%",padding:"10px 13px",borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",background:m.role==="user"?"linear-gradient(135deg,#4361ee,#7c3aed)":S.bg,color:m.role==="user"?"#fff":S.txt,fontSize:13,lineHeight:1.5,fontFamily:S.f,boxShadow:m.role==="user"?"0 2px 8px rgba(67,97,238,.3)":"none",border:m.role==="assistant"?`1px solid ${S.bdr}`:"none",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{m.content}</div>
              </div>
            ))}
            {chatLoading && (
              <div style={{display:"flex",gap:7,alignItems:"flex-end"}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#4361ee,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Sparkles size={13} color="#fff"/></div>
                <div style={{padding:"12px 16px",borderRadius:"16px 16px 16px 4px",background:S.bg,border:`1px solid ${S.bdr}`,display:"flex",gap:4,alignItems:"center"}}>
                  {[0,1,2].map(d=><div key={d} style={{width:7,height:7,borderRadius:"50%",background:S.acc,animation:"bounce .9s infinite",animationDelay:`${d*.2}s`}}/>)}
                </div>
              </div>
            )}
            <div ref={chatEndRef}/>
          </div>
          <div style={{padding:"10px 12px",borderTop:`1px solid ${S.bdr}`,display:"flex",gap:8,alignItems:"center",background:"#fff"}}>
            <input ref={chatInputRef} value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendChat()} placeholder="Ask about our products..." style={{flex:1,border:`1px solid ${S.bdr}`,borderRadius:24,padding:"9px 14px",fontSize:13,fontFamily:S.f,color:S.txt,background:S.bg,outline:"none"}}/>
            <button onClick={sendChat} disabled={!chatInput.trim()||chatLoading} style={{width:38,height:38,borderRadius:"50%",border:"none",background:chatInput.trim()&&!chatLoading?"linear-gradient(135deg,#4361ee,#7c3aed)":"#e5e7ee",color:chatInput.trim()&&!chatLoading?"#fff":S.txt3,display:"flex",alignItems:"center",justifyContent:"center",cursor:chatInput.trim()&&!chatLoading?"pointer":"not-allowed",flexShrink:0,transition:"all .15s"}}><Send size={15}/></button>
          </div>
        </div>
      )}
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
    </>
  );
};

/* ══════════════════════════════════════════════════════ */
/* ═══ MAIN APP ═══ */
/* ══════════════════════════════════════════════════════ */
export default function App() {
  const [tab, setTab] = useState("inventory");

  // ── Inventory State ──
  const [articles, setArticles] = useState([]);
  const [cats, setCats] = useState(DEFAULT_CATS);
  const [search, setSearch] = useState("");
  const [fCat, setFCat] = useState("All");
  const [expanded, setExpanded] = useState(null);
  const [showArtModal, setShowArtModal] = useState(false);
  const [showCats, setShowCats] = useState(false);
  const [editArt, setEditArt] = useState(null);
  const [newCat, setNewCat] = useState("");
  const blankA = {skuId:"",name:"",fabricQuality:"",category:"",selectedSizes:[],colors:[],customFabric:""};
  const [af, setAf] = useState(blankA);
  const [newCol, setNewCol] = useState("");

  // ── Customers State ──
  const [customers, setCustomers] = useState([]);
  const [cSearch, setCSearch] = useState("");
  const [showCustModal, setShowCustModal] = useState(false);
  const [showCustForm, setShowCustForm] = useState(false);
  const [editCust, setEditCust] = useState(null);
  const [expandedCust, setExpandedCust] = useState(null);
  const blankC = {name:"",phone:"",whatsapp:"",email:"",dob:"",address:"",city:"",state:"",pincode:"",company:"",gst:"",agent:"",transport:""};
  const [cf, setCf] = useState(blankC);
  const [extF, setExtF] = useState(blankC);
  const [confirmDlg, setConfirmDlg] = useState(null);
  const askConfirm = (title, message, onYes) => setConfirmDlg({title, message, onYes});

  const [copied, setCopied] = useState(false);
  const [gstStatus, setGstStatus] = useState(null);

  // ── Challans State ──
  const [challans, setChallans] = useState([]);
  const [showChModal, setShowChModal] = useState(false);
  const [showCompany, setShowCompany] = useState(false);
  const [expandedCh, setExpandedCh] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [co, setCo] = useState({name:"Sagar Impex",address:"Jaipur, Rajasthan",phone:"",email:"",gstin:""});
  const blankCh = {customerId:"",lrNumber:"",remarks:"",items:[]};
  const [chf, setChf] = useState(blankCh);
  const [editCh, setEditCh] = useState(null); // challan being edited

  // ── Chatbot State ──
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsgs, setChatMsgs] = useState([
    {role:"assistant", content:"👋 Hello! I'm your product assistant. Ask me about our latest collections, available sizes, fabrics, or anything about our products!"}
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef();
  const chatInputRef = useRef();

  // ── PIN / Auth State ──
  const DEFAULT_PIN = "1234";
  const [isLocked, setIsLocked] = useState(true);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [savedPin, setSavedPin] = useState(() => { try { return localStorage.getItem("inven_pin") || DEFAULT_PIN; } catch { return DEFAULT_PIN; } });
  const [showChangePIN, setShowChangePIN] = useState(false);
  const [newPin1, setNewPin1] = useState(""); const [newPin2, setNewPin2] = useState(""); const [pinChangeErr, setPinChangeErr] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  // ── Shop / Customer View State ──
  const [isShopView, setIsShopView] = useState(() => typeof window !== "undefined" && window.location.hash === "#shop");
  const [shopSearch, setShopSearch] = useState("");
  const [shopCat, setShopCat] = useState("All");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [orderForm, setOrderForm] = useState({name:"",phone:"",note:""});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [detailArticle, setDetailArticle] = useState(null);
  const [detailColorIdx, setDetailColorIdx] = useState(0);
  const [showCallback, setShowCallback] = useState(false);
  const [callbackForm, setCallbackForm] = useState({name:"",phone:"",msg:""});
  const [callbackSent, setCallbackSent] = useState(false);
  const [catBanners, setCatBanners] = useState({}); // {catName: base64img}
  const [showCatBanners, setShowCatBanners] = useState(false);

  // ── Orders State ──
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [reportView, setReportView] = useState("article"); // article | party
  const [reportSearch, setReportSearch] = useState("");
  const [showConvertOrder, setShowConvertOrder] = useState(false);
  const [convertingOrder, setConvertingOrder] = useState(null);
  const [convertSelItems, setConvertSelItems] = useState({});
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [showStockView, setShowStockView] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const blankOF = {customerId:"", remarks:"", items:[]};
  const [orderForm2, setOrderForm2] = useState(blankOF);

  // ── Backup State ──
  const [showBackup, setShowBackup] = useState(false);
  const [backupMsg, setBackupMsg] = useState("");
  const backupRef = useRef();

  // ── DB / Sync State ──
  const [dbStatus, setDbStatus] = useState("loading"); // loading | synced | error | saving
  const saveTimer = useRef(null);
  const LS = "inventrack_v1"; // localStorage cache key

  /* ─── SUPABASE HELPERS ─── */

  // Save a single key to settings table
  const dbSet = async (key, value) => {
    await db.from("settings").upsert({ key, value: JSON.stringify(value), updated_at: new Date().toISOString() });
  };

  // Load all data from Supabase on mount
  const loadFromDB = async () => {
    setDbStatus("loading");
    try {
      const [setsRes, ordsRes] = await Promise.all([
        db.from("settings").select("*"),
        db.from("orders").selectOrdered("created_at", false)
      ]);
      if (setsRes.data) {
        const m = Object.fromEntries(setsRes.data.map(s => [s.key, (() => { try { return JSON.parse(s.value); } catch { return s.value; } })()]));
        if (m.articles)    setArticles(m.articles);
        if (m.customers)   setCustomers(m.customers);
        if (m.challans)    setChallans(m.challans);
        if (m.cats)        setCats(m.cats);
        if (m.co)          setCo(m.co);
        if (m.companyLogo !== undefined) setCompanyLogo(m.companyLogo);
        if (m.catBanners)  setCatBanners(m.catBanners);
        if (m.pin)         setSavedPin(m.pin);
        localStorage.setItem(LS, JSON.stringify({ articles: m.articles||[], customers: m.customers||[], challans: m.challans||[], cats: m.cats||DEFAULT_CATS, co: m.co||{}, companyLogo: m.companyLogo||null, catBanners: m.catBanners||{} }));
      }
      if (ordsRes.data) setOrders(ordsRes.data.map(o => ({ ...o.data, id: o.id, status: o.status, type: o.type })));
      setDbStatus("synced");
    } catch (e) {
      console.warn("Supabase load failed, using cache:", e.message);
      setDbStatus("error");
      try {
        const saved = localStorage.getItem(LS);
        if (saved) {
          const d = JSON.parse(saved);
          if (d.articles)    setArticles(d.articles);
          if (d.customers)   setCustomers(d.customers);
          if (d.challans)    setChallans(d.challans);
          if (d.cats)        setCats(d.cats);
          if (d.co)          setCo(d.co);
          if (d.companyLogo !== undefined) setCompanyLogo(d.companyLogo);
          if (d.catBanners)  setCatBanners(d.catBanners);
        }
      } catch {}
    }
  };

  // Debounced save — fires 1.5s after last change
  const scheduleSave = (newState) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setDbStatus("saving");
    saveTimer.current = setTimeout(async () => {
      try {
        await Promise.all([
          dbSet("articles",    newState.articles    ?? articles),
          dbSet("customers",   newState.customers   ?? customers),
          dbSet("challans",    newState.challans    ?? challans),
          dbSet("cats",        newState.cats        ?? cats),
          dbSet("co",          newState.co          ?? co),
          dbSet("companyLogo", newState.companyLogo !== undefined ? newState.companyLogo : companyLogo),
          dbSet("catBanners",  newState.catBanners  ?? catBanners),
        ]);
        setDbStatus("synced");
        // Update localStorage cache
        const full = { articles, customers, challans, cats, co, companyLogo, catBanners, ...newState };
        localStorage.setItem(LS, JSON.stringify(full));
      } catch (e) {
        console.error("Save failed:", e.message);
        setDbStatus("error");
      }
    }, 1500);
  };

  // On mount: load from localStorage immediately (instant), then sync from Supabase
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS);
      if (saved) {
        const d = JSON.parse(saved);
        if (d.articles)    setArticles(d.articles);
        if (d.customers)   setCustomers(d.customers);
        if (d.challans)    setChallans(d.challans);
        if (d.cats)        setCats(d.cats);
        if (d.co)          setCo(d.co);
        if (d.companyLogo !== undefined) setCompanyLogo(d.companyLogo);
        if (d.catBanners)  setCatBanners(d.catBanners);
      }
    } catch {}
    loadFromDB();
  }, []);

  // Real-time orders — new shop orders appear instantly
  useEffect(() => {
    const channel = supabase.channel("orders-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, payload => {
        if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
          const o = payload.new;
          const newOrd = { ...o.data, id: o.id, status: o.status, type: o.type };
          setOrders(prev => {
            const exists = prev.find(x => x.id === newOrd.id);
            return exists ? prev.map(x => x.id === newOrd.id ? newOrd : x) : [newOrd, ...prev];
          });
        }
        if (payload.eventType === "DELETE") {
          setOrders(prev => prev.filter(x => x.id !== payload.old.id));
        }
      }).subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  // Override setters to trigger Supabase save
  const setArticlesDB    = v => { setArticles(v);    scheduleSave({ articles: v }); };
  const setCustomersDB   = v => { setCustomers(v);   scheduleSave({ customers: v }); };
  const setChallansDB    = v => { setChallans(v);    scheduleSave({ challans: v }); };
  const setCatsDB        = v => { setCats(v);        scheduleSave({ cats: v }); };
  const setCoDB          = v => { setCo(v);          scheduleSave({ co: v }); };
  const setLogoDb        = v => { setCompanyLogo(v); scheduleSave({ companyLogo: v }); };
  const setCatBannersDB  = v => { setCatBanners(v);  scheduleSave({ catBanners: v }); };

  // Save new pin to Supabase
  const saveNewPin = () => {
    if (newPin1.length < 4) { setPinChangeErr("PIN must be 4 digits"); return; }
    if (newPin1 !== newPin2) { setPinChangeErr("PINs do not match"); return; }
    setSavedPin(newPin1);
    dbSet("pin", newPin1).catch(() => {});
    try { localStorage.setItem("inven_pin", newPin1); } catch {}
    setShowChangePIN(false); setNewPin1(""); setNewPin2(""); setPinChangeErr("");
  };

  // Orders: save to Supabase orders table
  const saveOrderToDB = async (order) => {
    const { id, status, type, ...data } = order;
    await db.from("orders").upsert({ id, data, status: status||"pending", type: type||"order", updated_at: new Date().toISOString() });
  };
  const deleteOrderFromDB = async (id) => {
    await db.from("orders").delete("id", id);
  };

  // Export all data as JSON backup
  const exportBackup = () => {
    const data = { articles, customers, challans, orders, cats, co, exportedAt: new Date().toISOString(), version: 2 };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `InvenTrack_Backup_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    setBackupMsg("✅ Backup downloaded successfully!");
    setTimeout(() => setBackupMsg(""), 3000);
  };

  // Import from JSON backup
  const importBackup = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const d = JSON.parse(ev.target.result);
        if (!d.articles && !d.customers) throw new Error("Invalid");
        if (d.articles)  setArticlesDB(d.articles);
        if (d.customers) setCustomersDB(d.customers);
        if (d.challans)  setChallansDB(d.challans);
        if (d.cats)      setCatsDB(d.cats);
        if (d.co)        setCoDB(d.co);
        setBackupMsg("✅ Data restored! Syncing to cloud…");
        setTimeout(() => setBackupMsg(""), 4000);
      } catch { setBackupMsg("❌ Invalid backup file."); setTimeout(() => setBackupMsg(""), 4000); }
    };
    reader.readAsText(file); e.target.value = "";
  };

  // Clear all data
  const clearAllData = () => {
    if (!window.confirm("⚠️ Delete ALL data from cloud + this device?\n\nExport a backup first!")) return;
    setArticlesDB([]); setCustomersDB([]); setChallansDB([]); setOrders([]);
    setCatsDB(DEFAULT_CATS); setCoDB({ name:"",address:"",phone:"",email:"",gstin:"" }); setLogoDb(null);
    db.from("orders").deleteAll().catch(()=>{});
    try { localStorage.removeItem(LS); } catch {}
    setBackupMsg("🗑️ All data cleared.");
    setTimeout(() => setBackupMsg(""), 3000);
  };

  const getStorageInfo = () => {
    try {
      const size = new Blob([localStorage.getItem(LS)||""]).size;
      return size > 1024*1024 ? `${(size/1024/1024).toFixed(1)} MB` : `${(size/1024).toFixed(0)} KB`;
    } catch { return "—"; }
  };

  // Hash change for shop view
  useEffect(() => {
    const onHash = () => setIsShopView(window.location.hash === "#shop");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // ── PIN helpers ──
  const tryUnlock = (pin) => {
    if (pin === savedPin) { setIsLocked(false); setPinInput(""); setPinError(false); }
    else { setPinError(true); setPinInput(""); setTimeout(() => setPinError(false), 900); }
  };
  const handlePinKey = d => {
    if (d === "del") { setPinInput(p => p.slice(0,-1)); return; }
    const next = pinInput + d;
    setPinInput(next);
    if (next.length === 4) setTimeout(() => tryUnlock(next), 100);
  };

  // ═══ INVENTORY HELPERS ═══
  const artTot = a => a.colors.reduce((s,c) => s + Object.values(c.sizes).reduce((ss,v) => ss + (v.qty||0), 0), 0);

  // ── Shop / Cart helpers ──
  const shopArticles = articles.filter(a => {
    const tot = artTot(a);
    const matchSearch = a.name.toLowerCase().includes(shopSearch.toLowerCase());
    const matchCat = shopCat === "All" || a.category === shopCat;
    return tot > 0 && matchSearch && matchCat;
  });
  const addToCart = (articleId, colorIdx, size, price) => {
    setCart(prev => {
      const key = `${articleId}-${colorIdx}-${size}`;
      const exists = prev.find(i => `${i.articleId}-${i.colorIdx}-${i.size}` === key);
      if (exists) return prev.map(i => `${i.articleId}-${i.colorIdx}-${i.size}` === key ? {...i, qty: i.qty+1} : i);
      return [...prev, {articleId, colorIdx, size, price, qty:1}];
    });
  };
  const removeFromCart = (articleId, colorIdx, size) => setCart(prev => prev.filter(i => !(i.articleId===articleId&&i.colorIdx===colorIdx&&i.size===size)));
  const cartTotal = cart.reduce((s,i) => s + i.qty*i.price, 0);
  const cartQty = cart.reduce((s,i) => s + i.qty, 0);
  const placeOrder = () => {
    if (!orderForm.name || !orderForm.phone || cart.length === 0) return;
    const orderItems = cart.map(i => {
      const art = articles.find(a => a.id === i.articleId);
      const col = art?.colors[i.colorIdx];
      return {articleId:i.articleId, colorIdx:i.colorIdx, articleName:art?.name||"", skuId:art?.skuId||"", colorName:col?.name||"", colorImage:col?.image||null, size:i.size, qty:i.qty, price:i.price, amount:i.qty*i.price};
    });
    const order = {id:uid(), number:`ORD-${String(orders.length+1).padStart(4,"0")}`, date:Date.now(), customer:{name:orderForm.name, phone:orderForm.phone}, note:orderForm.note, items:orderItems, totalQty:cart.reduce((s,i)=>s+i.qty,0), totalAmt:cartTotal, status:"pending", type:"order"};
    setOrders(prev => [order, ...prev]);
    saveOrderToDB(order).catch(e => console.error("Order save failed:", e));
    setCart([]); setOrderForm({name:"",phone:"",note:""}); setOrderPlaced(true);
    setTimeout(() => setOrderPlaced(false), 4000);
    setShowCart(false);
  };
  const updateOrderStatus = (id, status) => {
    const updated = orders.map(o => o.id===id ? {...o, status} : o);
    setOrders(updated);
    saveOrderToDB(updated.find(o=>o.id===id)).catch(()=>{});
  };
  const shareLink = () => {
    const url = window.location.href.replace(/#.*/,"") + "#shop";
    try { navigator.clipboard.writeText(url); } catch {}
    setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2500);
  };

  const submitCallback = () => {
    if (!callbackForm.name || !callbackForm.phone) return;
    const order = {id:uid(), number:`CB-${uid().slice(0,4).toUpperCase()}`, date:Date.now(), customer:{name:callbackForm.name,phone:callbackForm.phone}, note:`CALLBACK REQUEST: ${callbackForm.msg}`, items:[], totalQty:0, totalAmt:0, status:"pending", type:"callback"};
    setOrders(prev => [order, ...prev]);
    saveOrderToDB(order).catch(()=>{});
    setCallbackSent(true); setCallbackForm({name:"",phone:"",msg:""});
    setTimeout(() => { setCallbackSent(false); setShowCallback(false); }, 3000);
  };

  const waLink = (phone, msg) => `https://wa.me/${phone.replace(/\D/g,"")}?text=${encodeURIComponent(msg)}`;

  const birthdayWAMsg = (c) => {
    const coName = co.name || "Our Store";
    return `🎂 *Happy Birthday ${c.name}!*\n\nWishing you a wonderful day! 🎉\n\nAs a special birthday gift from *${coName}*, enjoy exclusive offers on your next purchase.\n\nVisit us or reply to this message to shop. We value your continued support! 🛍️\n\n— Team ${coName}`;
  };

  const totalPcs = articles.reduce((s,a) => s + artTot(a), 0);
  const totalCols = articles.reduce((s,a) => s + a.colors.length, 0);
  const lowStock = articles.filter(a => a.colors.some(c => Object.values(c.sizes).some(v => (v.qty||0) > 0 && (v.qty||0) <= 5))).length;

  const openAddArt = () => { setEditArt(null); setAf({...blankA,category:cats[0]||""}); setNewCol(""); setShowArtModal(true); };
  const openEditArt = a => {
    setEditArt(a);
    const ic = !FABRICS.includes(a.fabricQuality) || a.fabricQuality === "Other (Enter Manually)";
    setAf({skuId:a.skuId,name:a.name,fabricQuality:ic?"Other (Enter Manually)":a.fabricQuality,category:a.category,selectedSizes:[...a.selectedSizes],colors:JSON.parse(JSON.stringify(a.colors)),customFabric:ic?a.fabricQuality:""});
    setNewCol(""); setShowArtModal(true);
  };
  const toggleSz = sz => {
    const has = af.selectedSizes.includes(sz);
    const ns = has ? af.selectedSizes.filter(s => s !== sz) : [...af.selectedSizes, sz];
    const uc = af.colors.map(c => { const m = {}; ns.forEach(s => { m[s] = c.sizes[s] || {qty:0,price:0}; }); return {...c, sizes:m}; });
    setAf({...af, selectedSizes:ns, colors:uc});
  };
  const addColor = () => {
    const n = newCol.trim();
    if (!n || af.colors.find(c => c.name.toLowerCase() === n.toLowerCase())) return;
    const sizes = {}; af.selectedSizes.forEach(s => { sizes[s] = {qty:0,price:0}; });
    setAf({...af, colors:[...af.colors, {name:n, image:null, sizes}]}); setNewCol("");
  };
  const rmColor = i => setAf({...af, colors:af.colors.filter((_,j) => j !== i)});
  const setColImg = (i,img) => { const c = [...af.colors]; c[i] = {...c[i], image:img}; setAf({...af, colors:c}); };
  const updVal = (ci,sz,field,val) => { const c = [...af.colors]; c[ci] = {...c[ci], sizes:{...c[ci].sizes,[sz]:{...c[ci].sizes[sz],[field]:Math.max(0,Number(val)||0)}}}; setAf({...af, colors:c}); };
  const saveArt = () => {
    const ff = af.fabricQuality === "Other (Enter Manually)" ? af.customFabric : af.fabricQuality;
    if (!af.skuId || !af.name || !af.category || !ff) return;
    const d = {...af, fabricQuality:ff}; delete d.customFabric;
    const updated = editArt ? articles.map(a => a.id === editArt.id ? {...a,...d} : a) : [...articles, {id:uid(),...d,createdAt:Date.now()}];
    setArticlesDB(updated);
    setShowArtModal(false);
  };
  const delArt = id => {
    const art = articles.find(a => a.id === id);
    askConfirm(
      `Delete "${art?.name}"?`,
      `This will permanently delete the article and all its color/size data. This cannot be undone.`,
      () => { setArticlesDB(articles.filter(a => a.id !== id)); if (expanded === id) setExpanded(null); }
    );
  };
  const addCat = () => { const c = newCat.trim(); if (c && !cats.includes(c)) { setCatsDB([...cats, c]); setNewCat(""); } };
  const filteredArt = articles.filter(a => (a.name.toLowerCase().includes(search.toLowerCase()) || a.skuId.toLowerCase().includes(search.toLowerCase())) && (fCat === "All" || a.category === fCat));

  // ═══ CUSTOMER HELPERS ═══
  const openAddCust = () => { setEditCust(null); setCf({...blankC}); setGstStatus(null); setShowCustModal(true); };
  const openEditCust = c => { setEditCust(c); setCf({name:c.name,phone:c.phone,whatsapp:c.whatsapp||"",email:c.email||"",dob:c.dob||"",address:c.address||"",city:c.city||"",state:c.state||"",pincode:c.pincode||"",company:c.company||"",gst:c.gst||"",agent:c.agent||"",transport:c.transport||""}); setGstStatus(null); setShowCustModal(true); };
  const saveCust = () => {
    if (!cf.name || !cf.phone) return;
    const updated = editCust ? customers.map(c => c.id === editCust.id ? {...c,...cf} : c) : [...customers, {id:uid(),...cf,createdAt:Date.now(),purchases:[]}];
    setCustomersDB(updated);
    setShowCustModal(false);
  };
  const delCust = id => { setCustomersDB(customers.filter(c => c.id !== id)); if (expandedCust === id) setExpandedCust(null); };
  const extSubmit = () => { if (!extF.name || !extF.phone) return; setCustomersDB([...customers, {id:uid(),...extF,createdAt:Date.now(),purchases:[]}]); setExtF({...blankC}); setShowCustForm(false); };
  const copyLink = () => { navigator.clipboard?.writeText("https://yourcompany.com/register").then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); };
  const filteredCust = customers.filter(c => c.name.toLowerCase().includes(cSearch.toLowerCase()) || c.phone.includes(cSearch) || (c.company||"").toLowerCase().includes(cSearch.toLowerCase()));
  const upBdays = customers.filter(c => c.dob).map(c => { const d = new Date(c.dob), now = new Date(), ty = new Date(now.getFullYear(), d.getMonth(), d.getDate()); if (ty < now) ty.setFullYear(now.getFullYear()+1); return {...c, nextBday:ty, daysUntil:Math.ceil((ty-now)/864e5)}; }).sort((a,b) => a.daysUntil - b.daysUntil).slice(0, 5);
  const av = name => { const h = name.split("").reduce((a,c) => a + c.charCodeAt(0), 0) % 360; return {bg:`hsl(${h},50%,92%)`,color:`hsl(${h},50%,40%)`}; };
  const custPurchaseHistory = (cust) => {
    const fromChallans = challans.filter(ch => ch.customerId === cust.id || ch.customer?.name === cust.name).map(ch => ({
      id:ch.id, number:ch.number, date:ch.date, type:"challan",
      items: ch.items.map(it => ({name:it.articleName, color:it.colorName, sizes:it.sizes})),
      totalQty:ch.totalQty, totalAmt:ch.totalAmt
    }));
    const fromOrders = orders.filter(o => o.customer?.phone === cust.phone && o.status === "approved" && o.type !== "callback").map(o => ({
      id:o.id, number:o.number, date:o.date, type:"order",
      items: o.items.map(it => ({name:it.articleName, color:it.colorName, sizes:[{size:it.size,qty:it.qty,amount:it.amount}]})),
      totalQty:o.totalQty, totalAmt:o.totalAmt
    }));
    return [...fromChallans, ...fromOrders].sort((a,b) => b.date - a.date);
  };

  // ═══ CHALLAN HELPERS ═══
  const selCust = customers.find(c => c.id === chf.customerId);
  const addChItem = () => setChf({...chf, items:[...chf.items, {articleId:"",colorIdx:"",sizes:{}}]});
  const rmChItem = i => setChf({...chf, items:chf.items.filter((_,j) => j !== i)});
  const updChItem = (i, field, val) => {
    const items = [...chf.items]; items[i] = {...items[i], [field]:val};
    if (field === "articleId") { items[i].colorIdx = ""; items[i].sizes = {}; }
    if (field === "colorIdx") { items[i].sizes = {}; }
    setChf({...chf, items});
  };
  const updChQty = (i, sz, val) => { const items = [...chf.items]; items[i] = {...items[i], sizes:{...items[i].sizes,[sz]:Math.max(0,Number(val)||0)}}; setChf({...chf, items}); };
  const updChPrice = (i, sz, val) => { const items = [...chf.items]; items[i] = {...items[i], prices:{...items[i].prices,[sz]:Math.max(0,Number(val)||0)}}; setChf({...chf, items}); };
  const [editChArts, setEditChArts] = useState(null); // restored articles during edit
  const chArts = editChArts || articles; // use restored arts during edit
  const getChArt = it => chArts.find(a => a.id === it.articleId);
  const getChCol = it => { const a = getChArt(it); return a?.colors[Number(it.colorIdx)]; };
  const chTotQty = chf.items.reduce((s,it) => s + Object.values(it.sizes).reduce((ss,q) => ss + q, 0), 0);
  const chTotAmt = chf.items.reduce((s,it) => { const col = getChCol(it); if (!col) return s; return s + Object.entries(it.sizes).reduce((ss,[sz,q]) => { const p = (it.prices?.[sz] !== undefined && it.prices[sz] !== "") ? Number(it.prices[sz]) : (col.sizes[sz]?.price || 0); return ss + q * p; }, 0); }, 0);

  const openNewChallan = () => { setEditCh(null); setChf({...blankCh}); setShowChModal(true); };

  const openEditChallan = ch => {
    const restoredArts = articles.map(a => {
      const copy = JSON.parse(JSON.stringify(a));
      ch.items.forEach(it => {
        if (it.articleId !== a.id) return;
        const ci = Number(it.colorIdx);
        (it.sizesRaw||[]).forEach(({size,qty}) => {
          if (copy.colors[ci]?.sizes[size]) copy.colors[ci].sizes[size].qty += qty;
        });
      });
      return copy;
    });
    setEditChArts(restoredArts); // keep restored arts separate — don't save to DB yet
    setEditCh(ch);
    setChf({
      customerId: ch.customerId || "",
      lrNumber: ch.lrNumber || "",
      remarks: ch.remarks || "",
      items: ch.items.map(it => ({
        articleId: it.articleId || "",
        colorIdx: it.colorIdx !== undefined ? String(it.colorIdx) : "",
        sizes: Object.fromEntries((it.sizesRaw||[]).map(({size,qty}) => [size, qty]))
      }))
    });
    setShowChModal(true);
  };

  const saveChallan = () => {
    if (!chf.customerId || chf.items.length === 0) return;
    const valid = chf.items.filter(it => it.articleId && it.colorIdx !== "" && Object.values(it.sizes).some(q => q > 0));
    if (valid.length === 0) return;
    const challanItems = valid.map(it => {
      const art = getChArt(it); const col = getChCol(it);
      const sizesData = Object.entries(it.sizes).filter(([,q]) => q > 0).map(([sz,q]) => {
        const defaultPrice = col.sizes[sz]?.price || 0;
        const price = (it.prices?.[sz] !== undefined && it.prices[sz] !== "") ? Number(it.prices[sz]) : defaultPrice;
        return {size:sz, qty:q, price, amount:q*price};
      });
      return {
        articleId: art.id, colorIdx: Number(it.colorIdx),
        articleName:art.name, skuId:art.skuId, colorName:col.name, colorImage:col.image,
        sizes:sizesData, sizesRaw: sizesData.map(s => ({size:s.size, qty:s.qty}))
      };
    });
    const tQty = challanItems.reduce((s,it) => s + it.sizes.reduce((ss,sz) => ss + sz.qty, 0), 0);
    const tAmt = challanItems.reduce((s,it) => s + it.sizes.reduce((ss,sz) => ss + sz.amount, 0), 0);
    const cust = customers.find(c => c.id === chf.customerId);
    const challan = {
      id: editCh ? editCh.id : uid(),
      number: editCh ? editCh.number : `DC-${String(challans.length+1).padStart(4,"0")}`,
      date: editCh ? editCh.date : Date.now(),
      customerId: chf.customerId,
      customer:{name:cust.name,phone:cust.phone,address:`${cust.address||""}, ${cust.city||""}, ${cust.state||""} - ${cust.pincode||""}`.replace(/^,\s*/,""),gst:cust.gst,transport:cust.transport},
      lrNumber:chf.lrNumber, remarks:chf.remarks, items:challanItems, totalQty:tQty, totalAmt:tAmt
    };
    // Deduct stock from restored arts (edit) or current arts (new)
    const baseArts = editChArts || articles;
    const updArts = baseArts.map(a => {
      const copy = JSON.parse(JSON.stringify(a));
      valid.filter(it => it.articleId === a.id).forEach(it => {
        const ci = Number(it.colorIdx);
        Object.entries(it.sizes).forEach(([sz,q]) => { if (copy.colors[ci]?.sizes[sz]) copy.colors[ci].sizes[sz].qty = Math.max(0, copy.colors[ci].sizes[sz].qty - q); });
      });
      return copy;
    });
    const updChallans = editCh ? challans.map(c => c.id === editCh.id ? challan : c) : [challan, ...challans];
    // Save both together in ONE scheduleSave to avoid race condition
    setArticles(updArts);
    setChallans(updChallans);
    scheduleSave({ articles: updArts, challans: updChallans });
    setEditChArts(null); // clear temp restored arts
    setShowChModal(false);
    setChf({...blankCh});
    setEditCh(null);
  };

  const delChallan = ch => {
    askConfirm(
      `Delete Challan ${ch.number}?`,
      `This will delete the challan for ${ch.customer.name} (${ch.totalQty} pcs · ${fmtR(ch.totalAmt)}).\n\n⚠️ Stock will be restored back to inventory.`,
      () => {
        const restoredArts = articles.map(a => {
          const copy = JSON.parse(JSON.stringify(a));
          ch.items.forEach(it => {
            if (it.articleId !== a.id) return;
            const ci = Number(it.colorIdx);
            (it.sizesRaw||[]).forEach(({size,qty}) => {
              if (copy.colors[ci]?.sizes[size]) copy.colors[ci].sizes[size].qty += qty;
            });
          });
          return copy;
        });
        const updChallans = challans.filter(c => c.id !== ch.id);
        setArticles(restoredArts);
        setChallans(updChallans);
        scheduleSave({ articles: restoredArts, challans: updChallans });
        if (expandedCh === ch.id) setExpandedCh(null);
      }
    );
  };

  /* ── Challan PDF/Print ── */
  const rupee = (n) => "Rs." + Number(n).toLocaleString("en-IN");
  const getChallanHTML = ch => {
    // One row per article+color, sizes shown horizontally — much more compact
    const rows = ch.items.map((it, idx) => {
      const sizeCells = it.sizes.map(sz =>
        `<td class="sz-cell"><div class="sz-lbl">${sz.size}</div><div class="sz-qty">${sz.qty}</div><div class="sz-rate">${rupee(sz.price)}</div></td>`
      ).join("");
      const rowAmt = it.sizes.reduce((s,sz) => s + sz.amount, 0);
      const rowQty = it.sizes.reduce((s,sz) => s + sz.qty, 0);
      const bg = idx % 2 === 0 ? "#fff" : "#f9fafb";
      return `<tr style="background:${bg}">
        <td class="sno">${idx+1}</td>
        <td class="art-td"><div class="art-name">${it.articleName}</div><div class="sku">${it.skuId}</div></td>
        <td class="col-td"><div class="color-cell">${it.colorImage?`<img src="${it.colorImage}" class="col-img"/>`:""}
          <span class="col-dot" style="background:hsl(${it.colorName.split("").reduce((a,c)=>a+c.charCodeAt(0),0)%360},55%,55%)"></span>${it.colorName}</div></td>
        <td class="sizes-td"><div class="sizes-wrap">${sizeCells}</div></td>
        <td class="qty-td bold">${rowQty}</td>
        <td class="amt-td bold">${rupee(rowAmt)}</td>
      </tr>`;
    }).join("");

    return `<!DOCTYPE html><html><head><title>${ch.number}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Segoe UI',sans-serif;padding:18px 22px;color:#1a1a2e;font-size:11px}
  .hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;padding-bottom:10px;border-bottom:2.5px solid #4361ee}
  .co-logo{width:48px;height:48px;object-fit:contain;border-radius:6px;margin-bottom:4px}
  .co-name{font-size:16px;font-weight:800;line-height:1.2}
  .co-det{font-size:10px;color:#6b7280;margin-top:1px}
  .ch-title{text-align:right}
  .ch-title h1{font-size:18px;font-weight:800;color:#4361ee;letter-spacing:-.3px}
  .ch-title p{font-size:10px;color:#6b7280;margin-top:2px}
  .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px}
  .info-box{padding:7px 10px;background:#f8fafc;border-radius:6px;border:1px solid #e5e7eb}
  .info-box h4{font-size:8px;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;margin-bottom:3px}
  .info-box p{font-size:10px;color:#374151;line-height:1.4}
  table{width:100%;border-collapse:collapse}
  thead tr{background:#1e293b}
  th{color:#fff;padding:5px 7px;text-align:left;font-size:9px;text-transform:uppercase;letter-spacing:.5px}
  td{padding:5px 7px;border-bottom:1px solid #e5e7eb;font-size:10px;vertical-align:middle}
  .sno{color:#9ca3af;width:22px}
  .art-td{min-width:100px}
  .art-name{font-weight:600;font-size:10px}
  .sku{font-size:9px;color:#9ca3af;margin-top:1px}
  .col-td{min-width:100px;vertical-align:middle}
  .color-cell{display:flex;flex-direction:column;align-items:center;gap:5px;font-size:10px;text-align:center}
  .col-img{width:72px;height:72px;border-radius:8px;object-fit:cover;border:1px solid #e5e7eb;flex-shrink:0;display:block}
  .col-dot{display:inline-block;width:9px;height:9px;border-radius:50%;flex-shrink:0}
  .sizes-td{padding:3px 7px}
  .sizes-wrap{display:flex;flex-wrap:wrap;gap:3px}
  .sz-cell{display:inline-block;text-align:center;background:#eef1ff;border-radius:4px;padding:2px 6px;min-width:38px}
  .sz-lbl{font-size:8px;font-weight:700;color:#4361ee}
  .sz-qty{font-size:11px;font-weight:800;color:#1a1a2e;line-height:1.2}
  .sz-rate{font-size:8px;color:#0d9f6e}
  .qty-td{text-align:center;font-size:11px;width:36px}
  .amt-td{text-align:right;font-size:10px;width:70px}
  .bold{font-weight:700}
  .grand td{background:#ecfdf5;font-weight:800;font-size:11px;border-top:2px solid #0d9f6e}
  .notes{font-size:10px;color:#6b7280;margin-top:8px;padding:6px 10px;background:#fffbeb;border-radius:5px;border-left:3px solid #f59e0b}
  .footer{margin-top:24px;padding-top:10px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between}
  .sig .line{border-top:1px solid #374151;margin-top:44px;padding-top:5px;font-size:10px;color:#6b7280;text-align:center;min-width:160px}
  @media print{
    body{padding:10px 14px}
    @page{margin:8mm}
  }
</style></head><body>
<div class="hdr">
  <div>${companyLogo?`<img src="${companyLogo}" class="co-logo"/>`:""}
    <div class="co-name">${co.name||"Your Company"}</div>
    <div class="co-det">${co.address||""}</div>
    <div class="co-det">${[co.phone,co.email].filter(Boolean).join(" | ")}</div>
    ${co.gstin?`<div class="co-det">GSTIN: ${co.gstin}</div>`:""}
  </div>
  <div class="ch-title"><h1>DELIVERY CHALLAN</h1><p>${ch.number} &nbsp;|&nbsp; ${fmtD(ch.date)}</p></div>
</div>
<div class="info-grid">
  <div class="info-box"><h4>Bill To</h4>
    <p><strong>${ch.customer.name}</strong></p>
    <p>${ch.customer.address}</p>
    <p>Ph: ${ch.customer.phone}${ch.customer.gst?` &nbsp;|&nbsp; GST: ${ch.customer.gst}`:""}</p>
  </div>
  <div class="info-box"><h4>Dispatch Info</h4>
    <p>Transport: <strong>${ch.customer.transport||"—"}</strong></p>
    <p>LR No: <strong>${ch.lrNumber||"—"}</strong></p>
  </div>
</div>
<table>
  <thead><tr>
    <th>#</th><th>Article</th><th>Color</th><th>Sizes (Qty @ Rate)</th>
    <th style="text-align:center">Pcs</th><th style="text-align:right">Amount</th>
  </tr></thead>
  <tbody>${rows}
  <tr class="grand">
    <td colspan="4" style="text-align:right;font-size:11px">Grand Total</td>
    <td style="text-align:center">${ch.totalQty} pcs</td>
    <td style="text-align:right">${rupee(ch.totalAmt)}</td>
  </tr>
  </tbody>
</table>
${ch.remarks?`<div class="notes"><strong>Remarks:</strong> ${ch.remarks}</div>`:""}
<div class="footer">
  <div class="sig"><div class="line">Receiver's Signature</div></div>
  <div class="sig"><div class="line">Authorized Signature</div></div>
</div>
</body></html>`;
  };

  const printChallan = ch => {
    const w = window.open("", "_blank", "width=900,height=1100");
    if (!w) { alert("Please allow pop-ups to print challans."); return; }
    w.document.write(getChallanHTML(ch));
    w.document.close();
    w.onload = () => setTimeout(() => { w.focus(); w.print(); }, 300);
    // fallback if onload already fired
    setTimeout(() => { try { w.focus(); w.print(); } catch {} }, 800);
  };

  const downloadPDF = ch => {
    // Download as HTML file — open in browser then Ctrl+P → Save as PDF
    const html = getChallanHTML(ch);
    const blob = new Blob([html], {type: "text/html;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${ch.number}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  };

  const printPackingSlip = (ch) => {
    const html = `<!DOCTYPE html><html><head><title>Packing Slip ${ch.number}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',sans-serif;background:#f5f6fa;display:flex;flex-direction:column;align-items:center;padding:20px;min-height:100vh}
.controls{background:#fff;border-radius:10px;padding:14px 20px;margin-bottom:16px;display:flex;align-items:center;gap:12px;box-shadow:0 2px 8px rgba(0,0,0,.1);width:100%;max-width:440px}
.controls label{font-size:13px;font-weight:600;color:#374151}
.controls input{width:70px;border:1.5px solid #d1d5db;border-radius:6px;padding:6px 10px;font-size:16px;font-weight:700;text-align:center;outline:none}
.controls button{padding:8px 18px;border:none;border-radius:7px;cursor:pointer;font-size:13px;font-weight:700}
.btn-update{background:#eef1ff;color:#4361ee}
.btn-print{background:#0d9f6e;color:#fff}
.slip{width:100%;max-width:440px;background:#fff;border:2px solid #1e293b;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.12)}
.hdr{background:#1e293b;color:#fff;padding:14px 18px;display:flex;justify-content:space-between;align-items:flex-start}
.hdr-left h1{font-size:18px;font-weight:800;letter-spacing:.5px}
.hdr-left p{font-size:11px;opacity:.7;margin-top:3px}
.hdr-right{text-align:right}
.hdr-right .co{font-size:14px;font-weight:700}
.hdr-right .ph{font-size:11px;opacity:.7;margin-top:2px}
.from-bar{background:#f1f5f9;padding:8px 18px;font-size:11px;color:#64748b;border-bottom:1px solid #e2e8f0}
.to-section{padding:16px 18px;border-bottom:2px dashed #e2e8f0}
.to-label{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:#9ca3af;margin-bottom:6px}
.to-name{font-size:24px;font-weight:800;color:#1a1a2e;line-height:1.2;margin-bottom:5px}
.to-addr{font-size:12px;color:#4b5563;line-height:1.7}
.to-phone{font-size:14px;font-weight:700;color:#4361ee;margin-top:6px}
.stats{display:grid;grid-template-columns:1fr 1fr 1fr;border-bottom:1px solid #e2e8f0}
.stat{padding:12px 10px;text-align:center;border-right:1px solid #e2e8f0}
.stat:last-child{border-right:none}
.stat-label{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;margin-bottom:5px}
.stat-value{font-size:22px;font-weight:800;color:#1a1a2e;line-height:1}
.stat-sub{font-size:10px;color:#6b7280;margin-top:3px}
.transport-value{font-size:13px;font-weight:700;color:#1a1a2e;margin-top:2px;line-height:1.3}
.ref-bar{background:#eef1ff;padding:10px 18px;display:flex;justify-content:space-between;align-items:center}
.ref-bar span{font-size:11px;font-weight:700;color:#4361ee}
.footer{padding:8px 18px;text-align:center;font-size:10px;color:#9ca3af}
@media print{
  body{background:#fff;padding:0}
  .controls{display:none}
  .slip{box-shadow:none;border-radius:0;max-width:100%;border-color:#000}
  @page{margin:5mm;size:A5 portrait}
}
</style></head><body>
<div class="controls">
  <label>No. of Parcels:</label>
  <input id="pc" type="number" min="1" value="1" oninput="document.getElementById('pv').textContent=this.value||1"/>
  <button class="btn-update" onclick="document.getElementById('pv').textContent=document.getElementById('pc').value||1">Update</button>
  <button class="btn-print" onclick="window.print()">🖨 Print</button>
</div>
<div class="slip">
  <div class="hdr">
    <div class="hdr-left"><h1>PACKING SLIP</h1><p>${ch.number} &nbsp;·&nbsp; ${new Date(ch.date).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</p></div>
    <div class="hdr-right"><div class="co">${co.name||"Your Company"}</div><div class="ph">${co.phone||""}</div></div>
  </div>
  <div class="from-bar">From: <strong>${co.name||"Your Company"}</strong>${co.address ? " &nbsp;·&nbsp; "+co.address : ""}</div>
  <div class="to-section">
    <div class="to-label">Ship To</div>
    <div class="to-name">${ch.customer.name}</div>
    <div class="to-addr">${ch.customer.address||""}</div>
    <div class="to-phone">&#128222; ${ch.customer.phone||"—"}</div>
  </div>
  <div class="stats">
    <div class="stat">
      <div class="stat-label">Parcels</div>
      <div class="stat-value" id="pv">1</div>
      <div class="stat-sub">boxes / bags</div>
    </div>
    <div class="stat">
      <div class="stat-label">Total Pcs</div>
      <div class="stat-value">${ch.totalQty}</div>
      <div class="stat-sub">pieces</div>
    </div>
    <div class="stat">
      <div class="stat-label">Transport</div>
      <div class="transport-value">${ch.customer.transport||"—"}</div>
      <div class="stat-sub">LR: ${ch.lrNumber||"—"}</div>
    </div>
  </div>
  <div class="ref-bar">
    <span>&#128196; Challan: ${ch.number}</span>
    <span>&#128230; ${ch.items.length} item${ch.items.length>1?"s":""} &nbsp;·&nbsp; ${ch.totalQty} pcs</span>
  </div>
  <div class="footer">Handle with care &nbsp;·&nbsp; ${co.name||""} ${co.phone ? "· "+co.phone : ""}</div>
</div>
</body></html>`;
    const w = window.open("", "_blank");
    if (!w) { alert("Please allow pop-ups for this site to print the packing slip.\n\nIn your browser: Settings → Pop-ups → Allow for this site."); return; }
    w.document.write(html);
    w.document.close();
  };
  const printOrderSlip = (ord) => {
    const rows = ord.items.map((it,idx) => {
      const bg = idx%2===0?"#fff":"#f9fafb";
      // Normalize: shop orders use flat {size,qty,price,amount}, manual orders use sizes:[...]
      const sizes = Array.isArray(it.sizes) ? it.sizes : [{size:it.size, qty:it.qty, price:it.price||0, amount:it.amount||0}];
      const sizeCells = sizes.map(sz=>`<span style="display:inline-block;background:#eef1ff;border-radius:4px;padding:3px 8px;margin:2px;font-size:11px;text-align:center"><div style="font-weight:800;color:#4361ee">${sz.size}</div><div style="font-weight:700;color:#1a1a2e">${sz.qty} pcs</div><div style="color:#0d9f6e;font-size:10px">Rs.${Number(sz.price||0).toLocaleString("en-IN")}</div></span>`).join("");
      const totalQty = sizes.reduce((s,sz)=>s+sz.qty,0);
      const totalAmt = sizes.reduce((s,sz)=>s+(sz.amount||0),0);
      return `<tr style="background:${bg}">
        <td style="padding:6px 10px;color:#9ca3af;font-size:11px">${idx+1}</td>
        <td style="padding:6px 10px"><div style="font-weight:700;font-size:12px">${it.articleName}</div><div style="font-size:10px;color:#9ca3af">${it.skuId||""}</div></td>
        <td style="padding:6px 10px"><div style="display:flex;align-items:center;gap:6px">${it.colorImage?`<img src="${it.colorImage}" style="width:36px;height:36px;border-radius:6px;object-fit:cover"/>`:""}
          <span style="font-size:12px;font-weight:600">${it.colorName}</span></div></td>
        <td style="padding:6px 10px">${sizeCells}</td>
        <td style="padding:6px 10px;text-align:center;font-weight:700;font-size:13px">${totalQty}</td>
        <td style="padding:6px 10px;text-align:right;font-weight:700;font-size:12px;color:#0d9f6e">Rs.${Number(totalAmt).toLocaleString("en-IN")}</td>
      </tr>`;
    }).join("");
    const html = `<!DOCTYPE html><html><head><title>Order ${ord.number}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;padding:20px;color:#1a1a2e}
.no-print{margin-bottom:14px;display:flex;gap:8px}
.no-print button{padding:8px 18px;border:none;border-radius:7px;cursor:pointer;font-size:13px;font-weight:700;font-family:sans-serif}
@media print{.no-print{display:none}@page{margin:8mm}}</style></head><body>
<div class="no-print">
  <button onclick="window.print()" style="background:#4361ee;color:#fff">🖨 Print / Save PDF</button>
  <button onclick="window.close()" style="background:#f1f5f9;color:#374151">Close</button>
</div>
<div style="border:2px solid #1e293b;border-radius:10px;overflow:hidden">
  <div style="background:#1e293b;color:#fff;padding:14px 18px;display:flex;justify-content:space-between;align-items:center">
    <div><div style="font-size:18px;font-weight:800">CUSTOMER ORDER</div><div style="font-size:11px;opacity:.7;margin-top:2px">${ord.number} · ${new Date(ord.date).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</div></div>
    <div style="text-align:right"><div style="font-size:14px;font-weight:700">${co.name||"Your Company"}</div><div style="font-size:11px;opacity:.7">${co.phone||""}</div></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #e5e7eb">
    <div style="padding:12px 16px;border-right:1px solid #e5e7eb">
      <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;margin-bottom:4px">Customer</div>
      <div style="font-size:15px;font-weight:800">${ord.customer?.name||"—"}</div>
      <div style="font-size:12px;color:#6b7280;margin-top:2px">${ord.customer?.phone||""}</div>
      ${ord.customer?.address?`<div style="font-size:11px;color:#9ca3af;margin-top:2px">${ord.customer.address}</div>`:""}
    </div>
    <div style="padding:12px 16px">
      <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;margin-bottom:4px">Details</div>
      ${ord.remarks?`<div style="font-size:12px;color:#374151">Note: <strong>${ord.remarks}</strong></div>`:""}
      <div style="font-size:12px;color:#374151;margin-top:4px">Total: <strong style="color:#0d9f6e">Rs.${Number(ord.totalAmt).toLocaleString("en-IN")}</strong></div>
      <div style="font-size:12px;color:#374151;margin-top:2px">Pieces: <strong>${ord.totalQty}</strong></div>
    </div>
  </div>
  <table style="width:100%;border-collapse:collapse">
    <thead><tr style="background:#f8fafc">
      <th style="padding:8px 10px;text-align:left;font-size:9px;text-transform:uppercase;color:#9ca3af;font-weight:700">#</th>
      <th style="padding:8px 10px;text-align:left;font-size:9px;text-transform:uppercase;color:#9ca3af;font-weight:700">Article</th>
      <th style="padding:8px 10px;text-align:left;font-size:9px;text-transform:uppercase;color:#9ca3af;font-weight:700">Color</th>
      <th style="padding:8px 10px;text-align:left;font-size:9px;text-transform:uppercase;color:#9ca3af;font-weight:700">Sizes / Qty / Rate</th>
      <th style="padding:8px 10px;text-align:center;font-size:9px;text-transform:uppercase;color:#9ca3af;font-weight:700">Pcs</th>
      <th style="padding:8px 10px;text-align:right;font-size:9px;text-transform:uppercase;color:#9ca3af;font-weight:700">Amount</th>
    </tr></thead>
    <tbody>${rows}
    <tr style="background:#ecfdf5">
      <td colspan="4" style="padding:10px;text-align:right;font-weight:800;font-size:12px">Grand Total</td>
      <td style="padding:10px;text-align:center;font-weight:800">${ord.totalQty} pcs</td>
      <td style="padding:10px;text-align:right;font-weight:800;color:#0d9f6e;font-size:14px">Rs.${Number(ord.totalAmt).toLocaleString("en-IN")}</td>
    </tr></tbody>
  </table>
  <div style="padding:10px 16px;text-align:center;font-size:10px;color:#9ca3af;border-top:1px solid #e5e7eb">
    This is a proforma order — not a tax invoice · ${co.name||""} ${co.phone?"· "+co.phone:""}
  </div>
</div></body></html>`;
    const w = window.open("","_blank");
    if (!w) { alert("Please allow pop-ups for this site."); return; }
    w.document.write(html); w.document.close();
  };

  const openEditOrder = (ord) => {
    const cust = customers.find(c => c.phone === ord.customer?.phone || c.name === ord.customer?.name);
    const items = ord.items.map(it => {
      const sizes = {};
      const prices = {};
      it.sizes.forEach(sz => { sizes[sz.size] = sz.qty; prices[sz.size] = sz.price; });
      return { articleId: it.articleId, colorIdx: String(it.colorIdx), sizes, prices };
    });
    setEditingOrder(ord);
    setOrderForm2({ customerId: cust?.id || "", remarks: ord.remarks || "", items });
    setShowCreateOrder(true);
  };

  const saveManualOrder = (printAfter=false) => {
    if (!orderForm2.customerId || orderForm2.items.length === 0) return;
    const cust = customers.find(c => c.id === orderForm2.customerId);
    const valid = orderForm2.items.filter(it => it.articleId && it.colorIdx !== "" && Object.values(it.sizes).some(q=>q>0));
    if (valid.length === 0) return;
    const orderItems = valid.map(it => {
      const art = articles.find(a => a.id === it.articleId);
      const col = art?.colors[Number(it.colorIdx)];
      const sizesData = Object.entries(it.sizes).filter(([,q])=>q>0).map(([sz,q])=>{
        const p = (it.prices?.[sz]!==undefined && it.prices[sz]!=="") ? Number(it.prices[sz]) : (col?.sizes[sz]?.price||0);
        return {size:sz,qty:q,price:p,amount:q*p};
      });
      return {articleId:art.id,colorIdx:Number(it.colorIdx),articleName:art.name,skuId:art.skuId,colorName:col?.name||"",colorImage:col?.image||null,sizes:sizesData};
    });
    const tQty = orderItems.reduce((s,it)=>s+it.sizes.reduce((ss,sz)=>ss+sz.qty,0),0);
    const tAmt = orderItems.reduce((s,it)=>s+it.sizes.reduce((ss,sz)=>ss+sz.amount,0),0);
    const ord = {
      id: editingOrder ? editingOrder.id : uid(),
      number: editingOrder ? editingOrder.number : `ORD-${String(orders.length+1).padStart(4,"0")}`,
      date: editingOrder ? editingOrder.date : Date.now(),
      customer:{name:cust.name,phone:cust.phone,address:`${cust.address||""}, ${cust.city||""}, ${cust.state||""}`.replace(/^,\s*/,"")},
      remarks:orderForm2.remarks,items:orderItems,totalQty:tQty,totalAmt:tAmt,
      status: editingOrder ? editingOrder.status : "manual",
      type: editingOrder ? editingOrder.type : "manual"
    };
    setOrders(prev => editingOrder ? prev.map(o => o.id===ord.id ? ord : o) : [ord, ...prev]);
    saveOrderToDB(ord).catch(()=>{});
    setShowCreateOrder(false);
    setEditingOrder(null);
    setOrderForm2(blankOF);
    if (printAfter) setTimeout(()=>printOrderSlip(ord),300);
  };

  const openConvertOrder = (ord) => {
    setConvertingOrder(ord);
    // Pre-select all items by default
    const sel = {};
    ord.items.forEach((_,i) => sel[i] = true);
    setConvertSelItems(sel);
    setShowConvertOrder(true);
  };

  const doConvertToChallan = () => {
    if (!convertingOrder) return;
    const cust = customers.find(c => c.name === convertingOrder.customer?.name || c.phone === convertingOrder.customer?.phone);
    const selectedIdxs = Object.keys(convertSelItems).filter(i => convertSelItems[i]).map(Number);
    const selectedItems = convertingOrder.items.filter((_,i) => convertSelItems[i]);
    if (selectedItems.length === 0) return;
    // Build chf items from selected order items
    const chfItems = selectedItems.map(it => {
      const art = articles.find(a => a.id === it.articleId);
      if (!art) return null;
      const sizes = {};
      const prices = {};
      it.sizes.forEach(sz => { sizes[sz.size] = sz.qty; prices[sz.size] = sz.price; });
      return { articleId: it.articleId, colorIdx: String(it.colorIdx), sizes, prices };
    }).filter(Boolean);
    // Mark selected items as delivered in the order
    const updatedOrder = {
      ...convertingOrder,
      items: convertingOrder.items.map((it, i) =>
        selectedIdxs.includes(i) ? {...it, delivered: true} : it
      )
    };
    setOrders(prev => prev.map(o => o.id === convertingOrder.id ? updatedOrder : o));
    saveOrderToDB(updatedOrder).catch(()=>{});
    setEditCh(null);
    setEditChArts(null);
    setChf({
      customerId: cust?.id || "",
      lrNumber: "",
      remarks: `Converted from ${convertingOrder.number}`,
      items: chfItems
    });
    setShowConvertOrder(false);
    setShowChModal(true);
  };

  const printArticleReport = (artEntries, allTxns) => {
    const sizeOrder = ["S","M","L","XL","XXL","3XL","4XL","5XL","6XL","7XL"];
    const sortSizes = sizes => [...sizes].sort((a,b)=>(sizeOrder.indexOf(a)===-1?99:sizeOrder.indexOf(a))-(sizeOrder.indexOf(b)===-1?99:sizeOrder.indexOf(b)));

    const articleBlocks = artEntries.map(art => {
      // Collect all sizes across article
      const allSizesSet = new Set();
      Object.values(art.parties).forEach(p => p.txns.forEach(t => t.sizes.forEach(sz => allSizesSet.add(sz.size))));
      const allSizes = sortSizes([...allSizesSet]);

      // Party rows: for each party → colors → sizes
      let artTotalQty = 0, artTotalAmt = 0;
      const partyBlocks = Object.values(art.parties).map((p,pi) => {
        // Group txns by color
        const colorMap = {};
        p.txns.forEach(t => {
          if (!colorMap[t.colorName]) colorMap[t.colorName] = {sizes:{}, qty:0, amt:0, refs:[]};
          t.sizes.forEach(sz => {
            colorMap[t.colorName].sizes[sz.size] = (colorMap[t.colorName].sizes[sz.size]||0) + sz.qty;
            colorMap[t.colorName].qty += sz.qty;
            colorMap[t.colorName].amt += (sz.amount||0);
          });
          colorMap[t.colorName].refs.push(`${t.number}(${t.type==="challan"?"DC":"ORD"})`);
        });

        const partyTotalQty = Object.values(colorMap).reduce((s,c)=>s+c.qty,0);
        const partyTotalAmt = Object.values(colorMap).reduce((s,c)=>s+c.amt,0);
        artTotalQty += partyTotalQty;
        artTotalAmt += partyTotalAmt;

        const colorRows = Object.entries(colorMap).map(([color, data], ci) => {
          const h = color.split("").reduce((a,c)=>a+c.charCodeAt(0),0)%360;
          const sizeCells = allSizes.map(sz => {
            const q = data.sizes[sz]||0;
            return `<td style="padding:5px 8px;text-align:center;font-size:13px;font-weight:${q>0?"800":"400"};color:${q>0?"#1e293b":"#cbd5e1"};background:${q>0?"#dbeafe":"transparent"}">${q>0?q:"—"}</td>`;
          }).join("");
          return `<tr style="background:${ci%2===0?"#fff":"#f8fafc"}">
            <td style="padding:4px 8px 4px 24px;font-size:11px">
              <div style="display:flex;align-items:center;gap:5px">
                <div style="width:10px;height:10px;border-radius:50%;background:hsl(${h},55%,55%);flex-shrink:0"></div>
                <span style="font-weight:600;color:#374151">${color}</span>
                <span style="color:#9ca3af;font-size:9px">${data.refs.slice(0,2).join(", ")}${data.refs.length>2?` +${data.refs.length-2}`:""}</span>
              </div>
            </td>
            ${sizeCells}
            <td style="padding:5px 8px;text-align:center;font-weight:700;font-size:12px;color:#0891b2">${data.qty}</td>
            <td style="padding:5px 8px;text-align:right;font-size:11px;font-weight:600;color:#0d9f6e">Rs.${Number(data.amt).toLocaleString("en-IN")}</td>
          </tr>`;
        }).join("");

        // Party subtotal row
        const partySubtotals = allSizes.map(sz => {
          const q = Object.values(colorMap).reduce((s,c)=>s+(c.sizes[sz]||0),0);
          return `<td style="padding:5px 8px;text-align:center;font-weight:800;font-size:12px;color:#4361ee;background:#ede9fe">${q>0?q:"—"}</td>`;
        }).join("");

        return `
          <tr style="background:#f5f3ff;border-top:2px solid #c4b5fd">
            <td style="padding:7px 10px;font-weight:800;font-size:13px;color:#7c3aed">
              ${p.party}
              <div style="font-size:10px;color:#a78bfa;font-weight:500">${p.phone||""}</div>
            </td>
            ${allSizes.map(()=>`<td style="background:#f5f3ff"></td>`).join("")}
            <td></td><td></td>
          </tr>
          ${colorRows}
          <tr style="background:#ede9fe;border-bottom:2px solid #c4b5fd">
            <td style="padding:5px 10px 5px 20px;font-size:11px;font-weight:700;color:#6d28d9">↳ Subtotal</td>
            ${partySubtotals}
            <td style="padding:5px 8px;text-align:center;font-weight:800;font-size:13px;color:#7c3aed">${partyTotalQty}</td>
            <td style="padding:5px 8px;text-align:right;font-weight:700;font-size:12px;color:#0d9f6e">Rs.${Number(partyTotalAmt).toLocaleString("en-IN")}</td>
          </tr>`;
      }).join("");

      // Grand total row
      const grandTotals = allSizes.map(sz => {
        const q = Object.values(art.parties).reduce((s,p)=>s+p.txns.reduce((ss,t)=>ss+t.sizes.reduce((sss,sz2)=>sz2.size===sz?sss+sz2.qty:sss,0),0),0);
        return `<td style="padding:6px 8px;text-align:center;font-weight:900;font-size:14px;color:#fff;background:#1e293b">${q>0?q:"—"}</td>`;
      }).join("");

      const sizeHeaders = allSizes.map(sz=>`<th style="padding:6px 8px;text-align:center;font-size:10px;font-weight:800;color:#fff;background:#1e293b;min-width:44px;letter-spacing:.5px">${sz}</th>`).join("");

      return `
        <div style="margin-bottom:24px;border:2px solid #1e293b;border-radius:12px;overflow:hidden;page-break-inside:avoid">
          <div style="background:linear-gradient(135deg,#1e293b,#334155);color:#fff;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
            <div>
              <div style="font-size:17px;font-weight:900;letter-spacing:-.3px">${art.articleName}</div>
              <div style="font-size:10px;opacity:.55;margin-top:2px;font-family:monospace">${art.skuId||""}</div>
            </div>
            <div style="display:flex;gap:20px;text-align:center">
              <div><div style="font-size:9px;opacity:.5;text-transform:uppercase;letter-spacing:.8px">Parties</div><div style="font-size:20px;font-weight:900">${Object.keys(art.parties).length}</div></div>
              <div><div style="font-size:9px;opacity:.5;text-transform:uppercase;letter-spacing:.8px">Total Pcs</div><div style="font-size:20px;font-weight:900;color:#7dd3fc">${artTotalQty}</div></div>
              <div><div style="font-size:9px;opacity:.5;text-transform:uppercase;letter-spacing:.8px">Amount</div><div style="font-size:16px;font-weight:800;color:#6ee7b7">Rs.${Number(artTotalAmt).toLocaleString("en-IN")}</div></div>
            </div>
          </div>
          <div style="overflow-x:auto">
            <table style="width:100%;border-collapse:collapse;min-width:400px">
              <thead>
                <tr style="background:#1e293b">
                  <th style="padding:6px 10px;text-align:left;font-size:10px;font-weight:800;color:#94a3b8">PARTY / COLOR</th>
                  ${sizeHeaders}
                  <th style="padding:6px 8px;text-align:center;font-size:10px;font-weight:800;color:#fff;background:#0891b2">TOTAL</th>
                  <th style="padding:6px 8px;text-align:right;font-size:10px;font-weight:800;color:#fff;background:#0d9f6e">AMT</th>
                </tr>
              </thead>
              <tbody>
                ${partyBlocks}
                <tr style="background:#1e293b">
                  <td style="padding:8px 10px;font-weight:900;font-size:13px;color:#f8fafc">GRAND TOTAL</td>
                  ${grandTotals}
                  <td style="padding:6px 8px;text-align:center;font-weight:900;font-size:16px;color:#7dd3fc;background:#1e293b">${artTotalQty}</td>
                  <td style="padding:6px 8px;text-align:right;font-weight:800;font-size:13px;color:#6ee7b7;background:#1e293b">Rs.${Number(artTotalAmt).toLocaleString("en-IN")}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>`;
    }).join("");

    const grandTotal = artEntries.reduce((s,art)=>s+Object.values(art.parties).reduce((ss,p)=>ss+p.txns.reduce((sss,t)=>sss+t.sizes.reduce((q,sz)=>q+sz.qty,0),0),0),0);
    const grandAmt = artEntries.reduce((s,art)=>s+Object.values(art.parties).reduce((ss,p)=>ss+p.txns.reduce((sss,t)=>sss+t.sizes.reduce((q,sz)=>q+(sz.amount||0),0),0),0),0);

    const html = `<!DOCTYPE html><html><head><title>Article Report</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',sans-serif;padding:20px;color:#1a1a2e;background:#f8fafc}
.no-print{margin-bottom:16px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.no-print button{padding:8px 18px;border:none;border-radius:7px;cursor:pointer;font-size:13px;font-weight:700;font-family:sans-serif}
.report-header{background:#1e293b;color:#fff;border-radius:12px;padding:16px 20px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px}
@media print{
  .no-print{display:none}
  body{background:#fff;padding:8px}
  @page{margin:6mm;size:A4 landscape}
}
</style></head><body>
<div class="no-print">
  <button onclick="window.print()" style="background:#4361ee;color:#fff">🖨 Print / Save PDF</button>
  <button onclick="window.close()" style="background:#f1f5f9;color:#374151">Close</button>
  <span style="font-size:12px;color:#64748b">Tip: Print in Landscape for best results</span>
</div>
<div class="report-header">
  <div>
    <div style="font-size:20px;font-weight:900">📦 Article-wise Order Report</div>
    <div style="font-size:11px;opacity:.6;margin-top:3px">${co.name||"Your Company"} &nbsp;·&nbsp; ${new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</div>
  </div>
  <div style="display:flex;gap:24px;text-align:center">
    <div><div style="font-size:9px;opacity:.5;text-transform:uppercase">Articles</div><div style="font-size:22px;font-weight:900">${artEntries.length}</div></div>
    <div><div style="font-size:9px;opacity:.5;text-transform:uppercase">Total Pcs</div><div style="font-size:22px;font-weight:900;color:#7dd3fc">${grandTotal}</div></div>
    <div><div style="font-size:9px;opacity:.5;text-transform:uppercase">Total Amount</div><div style="font-size:18px;font-weight:800;color:#6ee7b7">Rs.${Number(grandAmt).toLocaleString("en-IN")}</div></div>
  </div>
</div>
${rows}
</body></html>`;
    const w = window.open("","_blank");
    if (!w) { alert("Please allow pop-ups."); return; }
    w.document.write(html); w.document.close();
  };

  const buildSystemPrompt = () => {
    const artList = articles.map(a => {
      const colorDetails = a.colors.map(c => {
        const sizes = a.selectedSizes.map(s => `${s}:${c.sizes[s]?.qty||0}pcs@₹${c.sizes[s]?.price||0}`).join(", ");
        return `    • ${c.name} [${sizes}]`;
      }).join("\n");
      return `• ${a.name} (SKU: ${a.skuId}) — ${a.category} | Fabric: ${a.fabricQuality}\n${colorDetails}`;
    }).join("\n");
    return `You are a friendly and enthusiastic customer-facing product assistant for a clothing/fashion store.
Your job is to help customers discover products, answer questions about new launches, fabrics, sizes, colors, and availability.

CURRENT INVENTORY:
${artList || "No products added yet. Let customers know exciting new arrivals are coming soon!"}

GUIDELINES:
- Be warm, helpful, and excited about the products
- If a customer asks about a specific item, describe it engagingly with fabric and color details
- If stock is low (≤5 pcs), create gentle urgency: "Only a few left!"
- If out of stock on a size, suggest other available sizes
- Keep responses concise and friendly — 2-4 sentences max unless listing products
- Use emojis naturally but not excessively
- Never reveal internal SKU IDs or pricing unless directly asked
- If asked about something not in inventory, say new collections are always coming and encourage them to check back
- Format product lists with bullet points for readability`;
  };

  // ═══ RENDER ═══

  // ── PIN Lock Screen ──
  if (isLocked && !isShopView) return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#1a1d26 0%,#2d2f45 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:S.f}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet"/>
      <div style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",borderRadius:24,padding:"36px 32px",width:"min(360px,92vw)",backdropFilter:"blur(20px)",boxShadow:"0 32px 80px rgba(0,0,0,.4)"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:60,height:60,borderRadius:18,background:"linear-gradient(135deg,#4361ee,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}><Lock size={26} color="#fff"/></div>
          <h2 style={{color:"#fff",margin:0,fontSize:20,fontWeight:800,letterSpacing:-.3}}>InvenTrack</h2>
          <p style={{color:"rgba(255,255,255,.5)",margin:"6px 0 0",fontSize:13}}>Enter your PIN to continue</p>
        </div>
        {/* PIN dots */}
        <div style={{display:"flex",justifyContent:"center",gap:14,marginBottom:28}}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{width:16,height:16,borderRadius:"50%",background: i < pinInput.length ? "#4361ee" : "rgba(255,255,255,.15)", border:"2px solid " + (pinError ? "#dc2626" : i < pinInput.length ? "#4361ee" : "rgba(255,255,255,.2)"), transition:"all .15s", transform: pinError ? "translateX(4px)" : "none"}}/>
          ))}
        </div>
        {pinError && <p style={{color:"#f87171",textAlign:"center",fontSize:12,marginBottom:14,marginTop:-18}}>Incorrect PIN</p>}
        {/* Keypad */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          {["1","2","3","4","5","6","7","8","9","","0","del"].map((d,i) => d === "" ? <div key={i}/> : (
            <button key={i} onClick={() => handlePinKey(d)} style={{padding:"16px 0",borderRadius:14,border:"1px solid rgba(255,255,255,.1)",background:"rgba(255,255,255,.07)",color:"#fff",fontSize:d==="del"?12:20,fontWeight:d==="del"?600:700,fontFamily:S.f,cursor:"pointer",transition:"background .1s"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.14)"}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.07)"}>
              {d==="del"?"⌫":d}
            </button>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:20}}>
          <span style={{color:"rgba(255,255,255,.3)",fontSize:11}}>Default PIN: 1234</span>
        </div>
      </div>
    </div>
  );

  // ── Customer Shop View ──
  if (isShopView) {
    return (
    <div style={{minHeight:"100vh",fontFamily:S.f,background:"#f8f9fc",color:S.txt}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box} @media(max-width:600px){.shop-grid{grid-template-columns:1fr 1fr!important}} .shop-card:hover{box-shadow:0 8px 28px rgba(67,97,238,.15)!important;transform:translateY(-2px)!important}`}</style>

      {/* Header */}
      <div style={{background:"#fff",borderBottom:`1px solid ${S.bdr}`,padding:"12px 16px",position:"sticky",top:0,zIndex:200,boxShadow:"0 2px 10px rgba(0,0,0,.06)"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:0}}>
            {companyLogo
              ? <img src={companyLogo} alt="" style={{width:36,height:36,borderRadius:10,objectFit:"contain",border:`1px solid ${S.bdr}`}}/>
              : <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#4361ee,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Package size={17} color="#fff"/></div>
            }
            <div style={{minWidth:0}}>
              <div style={{fontSize:15,fontWeight:800,letterSpacing:-.3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{co.name||"Our Collection"}</div>
              <div style={{fontSize:10,color:S.txt3}}>Browse & Order</div>
            </div>
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <button onClick={()=>setShowCallback(true)} style={{display:"flex",alignItems:"center",gap:5,padding:"8px 12px",borderRadius:10,border:`1px solid ${S.bdr}`,background:"#fff",color:S.txt2,fontSize:12,fontWeight:600,fontFamily:S.f,cursor:"pointer",whiteSpace:"nowrap"}}>
              <PhoneCall size={14}/><span style={{display:"none"}} className="tab-label">Call Me</span><span>Callback</span>
            </button>
            <button onClick={()=>setShowCart(true)} style={{position:"relative",background:"linear-gradient(135deg,#4361ee,#7c3aed)",border:"none",borderRadius:10,padding:"8px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,color:"#fff",fontSize:13,fontWeight:700,fontFamily:S.f}}>
              <ShoppingCart size={16}/>
              {cartQty > 0 ? <span style={{background:"#fff",color:S.acc,borderRadius:20,fontSize:10,fontWeight:800,padding:"1px 7px"}}>{cartQty}</span> : "Cart"}
            </button>
          </div>
        </div>
      </div>

      <div style={{maxWidth:1100,margin:"0 auto",padding:"16px 12px"}}>

        {/* Search + Category filter */}
        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:160}}><Inp icon={<Search size={14}/>} placeholder="Search products..." value={shopSearch} onChange={e=>setShopSearch(e.target.value)}/></div>
          <Sel options={["All",...cats]} value={shopCat} onChange={e=>setShopCat(e.target.value)}/>
        </div>

        {/* Order success banner */}
        {orderPlaced && (
          <div style={{background:S.grnL,border:`1px solid ${S.grn}30`,borderRadius:12,padding:"14px 18px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
            <CheckCircle size={20} color={S.grn}/>
            <div><div style={{fontWeight:700,color:S.grn,fontSize:14}}>Order Placed! 🎉</div><div style={{fontSize:12,color:S.txt2,marginTop:2}}>We'll contact you shortly to confirm your order.</div></div>
          </div>
        )}

        {/* Callback success banner */}
        {callbackSent && (
          <div style={{background:S.accL,border:`1px solid ${S.acc}30`,borderRadius:12,padding:"14px 18px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
            <PhoneCall size={20} color={S.acc}/>
            <div><div style={{fontWeight:700,color:S.acc,fontSize:14}}>Callback Requested! 📞</div><div style={{fontSize:12,color:S.txt2,marginTop:2}}>We'll call you back shortly.</div></div>
          </div>
        )}

        {shopArticles.length === 0 ? (
          <div style={{textAlign:"center",padding:"60px 20px",color:S.txt2}}>
            <Package size={40} style={{margin:"0 auto 12px",display:"block",color:S.txt3}}/>
            <div style={{fontSize:16,fontWeight:700}}>No products available</div>
            <div style={{fontSize:13,marginTop:6}}>Check back soon for new arrivals!</div>
          </div>
        ) : (
          /* Products grouped by category with banners */
          (shopCat === "All" ? [...new Set(articles.filter(a=>artTot(a)>0).map(a=>a.category))] : [shopCat]).map(cat => {
            const catArticles = shopArticles.filter(a => a.category === cat);
            if (catArticles.length === 0) return null;
            const banner = catBanners[cat];
            return (
              <div key={cat} style={{marginBottom:32}}>
                {/* Category Banner */}
                {banner ? (
                  <div style={{borderRadius:14,overflow:"hidden",marginBottom:14,height:140,position:"relative"}}>
                    <img src={banner} alt={cat} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    <div style={{position:"absolute",inset:0,background:"linear-gradient(to right,rgba(0,0,0,.55) 0%,transparent 60%)",display:"flex",alignItems:"center",padding:"0 20px"}}>
                      <h2 style={{margin:0,color:"#fff",fontSize:22,fontWeight:800,textShadow:"0 2px 8px rgba(0,0,0,.3)"}}>{cat}</h2>
                    </div>
                  </div>
                ) : (
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                    <h2 style={{margin:0,fontSize:17,fontWeight:800}}>{cat}</h2>
                    <div style={{flex:1,height:1,background:S.bdr}}/>
                    <Tag color={S.pur}>{catArticles.length} styles</Tag>
                  </div>
                )}
                <div className="shop-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14}}>
                  {catArticles.map(a => (
                    <ShopProductCard key={a.id} article={a} onAddToCart={addToCart} onViewDetail={(art, ci) => { setDetailArticle(art); setDetailColorIdx(ci); }}/>
                  ))}
                </div>
              </div>
            );
          })
        )}

        {/* Request Callback FAB */}
        <div style={{position:"fixed",bottom:86,left:16,zIndex:300}}>
          <button onClick={()=>setShowCallback(true)} style={{background:"#25D366",border:"none",borderRadius:50,padding:"11px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:7,color:"#fff",fontSize:13,fontWeight:700,fontFamily:S.f,boxShadow:"0 4px 16px rgba(37,211,102,.4)"}}>
            <PhoneCall size={16}/> Request Callback
          </button>
        </div>
      </div>

      {/* Product Detail Modal */}
      {detailArticle && (
        <ProductDetailModal
          article={detailArticle}
          initialColorIdx={detailColorIdx}
          onClose={()=>setDetailArticle(null)}
          onAddToCart={(aid,ci,sz,price)=>{ addToCart(aid,ci,sz,price); }}
        />
      )}

      {/* Callback Modal */}
      {showCallback && (
        <div style={{position:"fixed",inset:0,zIndex:600,background:"rgba(0,0,0,.45)",backdropFilter:"blur(4px)",display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>setShowCallback(false)}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,padding:24}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
              <div>
                <div style={{fontSize:18,fontWeight:800}}>📞 Request a Callback</div>
                <div style={{fontSize:12,color:S.txt2,marginTop:3}}>Leave your details and we'll call you back!</div>
              </div>
              <button onClick={()=>setShowCallback(false)} style={{background:S.bg,border:"none",borderRadius:8,padding:6,cursor:"pointer",display:"flex",color:S.txt2}}><X size={16}/></button>
            </div>
            {callbackSent ? (
              <div style={{textAlign:"center",padding:"20px 0"}}>
                <div style={{fontSize:36,marginBottom:8}}>✅</div>
                <div style={{fontSize:16,fontWeight:700,color:S.grn}}>Request Sent!</div>
                <div style={{fontSize:13,color:S.txt2,marginTop:4}}>We'll call you back shortly.</div>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <Inp label="Your Name *" placeholder="Full name" value={callbackForm.name} onChange={e=>setCallbackForm({...callbackForm,name:e.target.value})}/>
                <Inp label="Phone Number *" placeholder="+91 XXXXX XXXXX" icon={<Phone size={13}/>} value={callbackForm.phone} onChange={e=>setCallbackForm({...callbackForm,phone:e.target.value})}/>
                <Inp label="Message (optional)" placeholder="e.g. Interested in Kurta sets, size M-L" value={callbackForm.msg} onChange={e=>setCallbackForm({...callbackForm,msg:e.target.value})}/>
                <button onClick={submitCallback} disabled={!callbackForm.name||!callbackForm.phone} style={{marginTop:6,padding:"13px 0",borderRadius:12,border:"none",background:callbackForm.name&&callbackForm.phone?"linear-gradient(135deg,#4361ee,#7c3aed)":"#e5e7eb",color:"#fff",fontWeight:700,fontSize:14,fontFamily:S.f,cursor:callbackForm.name&&callbackForm.phone?"pointer":"not-allowed"}}>
                  📞 Request Callback
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <div style={{position:"fixed",inset:0,zIndex:500,display:"flex",justifyContent:"flex-end"}} onClick={()=>setShowCart(false)}>
          <div onClick={e=>e.stopPropagation()} style={{width:"min(420px,100vw)",height:"100%",background:"#fff",boxShadow:"-8px 0 40px rgba(0,0,0,.15)",display:"flex",flexDirection:"column"}}>
            <div style={{padding:"16px 18px",borderBottom:`1px solid ${S.bdr}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
              <div style={{fontWeight:800,fontSize:16,display:"flex",alignItems:"center",gap:8}}><ShoppingCart size={18} color={S.acc}/> Your Cart {cartQty>0&&<Tag color={S.acc}>{cartQty} items</Tag>}</div>
              <button onClick={()=>setShowCart(false)} style={{background:S.bg,border:"none",borderRadius:8,padding:6,cursor:"pointer",display:"flex",color:S.txt2}}><X size={16}/></button>
            </div>
            <div style={{flex:1,padding:"14px 18px",overflowY:"auto"}}>
              {cart.length===0 ? (
                <div style={{textAlign:"center",padding:"40px 20px",color:S.txt3}}><ShoppingCart size={36} style={{margin:"0 auto 10px",display:"block"}}/><div style={{fontSize:14}}>Your cart is empty</div></div>
              ) : (
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {cart.map((item,i) => {
                    const art = articles.find(a=>a.id===item.articleId), col = art?.colors[item.colorIdx];
                    return (
                      <div key={i} style={{background:S.bg,borderRadius:12,padding:12,border:`1px solid ${S.bdr}`,display:"flex",gap:10,alignItems:"center"}}>
                        {col?.image && <img src={col.image} alt="" style={{width:52,height:52,borderRadius:8,objectFit:"cover",flexShrink:0}}/>}
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:13,fontWeight:700}}>{art?.name}</div>
                          <div style={{fontSize:11,color:S.txt2}}>{col?.name} · Size {item.size}</div>
                          <div style={{fontSize:12,fontWeight:700,color:S.grn,marginTop:2}}>{fmtS(item.price*item.qty)} <span style={{fontWeight:400,color:S.txt3}}>× {item.qty}</span></div>
                        </div>
                        <button onClick={()=>removeFromCart(item.articleId,item.colorIdx,item.size)} style={{background:S.redL,border:"none",borderRadius:6,padding:4,cursor:"pointer",display:"flex",color:S.red,flexShrink:0}}><X size={13}/></button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {cart.length>0 && (
              <div style={{padding:"14px 18px",borderTop:`1px solid ${S.bdr}`,background:"#fff",flexShrink:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <span style={{fontWeight:700,fontSize:14}}>Total</span>
                  <span style={{fontWeight:800,fontSize:18,color:S.grn,fontFamily:S.fm}}>{fmtR(cartTotal)}</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:12}}>
                  <Inp label="Your Name *" placeholder="Full name" value={orderForm.name} onChange={e=>setOrderForm({...orderForm,name:e.target.value})}/>
                  <Inp label="Phone *" placeholder="+91..." icon={<Phone size={13}/>} value={orderForm.phone} onChange={e=>setOrderForm({...orderForm,phone:e.target.value})}/>
                  <Inp label="Note (optional)" placeholder="Special instructions..." value={orderForm.note} onChange={e=>setOrderForm({...orderForm,note:e.target.value})}/>
                </div>
                <button onClick={placeOrder} disabled={!orderForm.name||!orderForm.phone} style={{width:"100%",padding:"13px 0",borderRadius:12,border:"none",background:orderForm.name&&orderForm.phone?"linear-gradient(135deg,#4361ee,#7c3aed)":"#d1d5db",color:"#fff",fontWeight:700,fontSize:14,fontFamily:S.f,cursor:orderForm.name&&orderForm.phone?"pointer":"not-allowed"}}>
                  Place Order 🎉
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <ChatBot articles={articles} co={co} chatMsgs={chatMsgs} setChatMsgs={setChatMsgs} chatOpen={chatOpen} setChatOpen={setChatOpen} chatInput={chatInput} setChatInput={setChatInput} chatLoading={chatLoading} setChatLoading={setChatLoading} chatEndRef={chatEndRef} chatInputRef={chatInputRef} buildSystemPrompt={buildSystemPrompt}/>
    </div>
  );}


  return (
    <div style={{minHeight:"100vh",fontFamily:S.f,background:S.bg,color:S.txt}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box}
        input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none}
        input[type=number]{-moz-appearance:textfield}
        @keyframes spin{to{transform:rotate(360deg)}}
        @media(max-width:600px){
          .stat-grid{grid-template-columns:1fr 1fr!important}
          .hide-mob{display:none!important}
          .form-grid2{grid-template-columns:1fr!important}
          .ch-header-right{flex-direction:column!important;align-items:flex-end!important}
          .tab-label{display:none}
        }
      `}</style>

      {/* HEADER */}
      <div style={{background:S.card,borderBottom:`1px solid ${S.bdr}`,padding:"10px 14px",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",maxWidth:1100,margin:"0 auto",gap:8,flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,#4361ee,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",flexShrink:0}}><Package size={18}/></div>
            <h1 style={{margin:0,fontSize:15,fontWeight:800,letterSpacing:-.3,whiteSpace:"nowrap"}}>InvenTrack</h1>
          </div>
          <div style={{display:"flex",background:S.bg,borderRadius:10,padding:3,gap:2}}>
            {[{id:"inventory",label:"Inventory",ic:<Package size={14}/>},{id:"customers",label:"Customers",ic:<Users size={14}/>},{id:"challans",label:"Challans",ic:<FileText size={14}/>},{id:"orders",label:"Orders",ic:<ClipboardList size={14}/>,badge:orders.filter(o=>o.status==="pending").length},{id:"reports",label:"Reports",ic:<Star size={14}/>}].map(t =>
              <button key={t.id} onClick={() => setTab(t.id)} style={{position:"relative",display:"flex",alignItems:"center",gap:5,padding:"7px 10px",borderRadius:8,border:"none",background:tab===t.id?S.card:"transparent",color:tab===t.id?S.acc:S.txt2,fontFamily:S.f,fontSize:11,fontWeight:tab===t.id?700:500,cursor:"pointer",boxShadow:tab===t.id?"0 1px 3px rgba(0,0,0,.08)":"none"}}>
                {t.ic}<span className="tab-label">{t.label}</span>
                {t.badge > 0 && <span style={{position:"absolute",top:2,right:2,background:S.red,color:"#fff",borderRadius:20,fontSize:9,fontWeight:800,padding:"0 4px",minWidth:14,textAlign:"center",lineHeight:"14px"}}>{t.badge}</span>}
              </button>
            )}
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            {/* Sync status indicator */}
            <div title={dbStatus === "synced" ? "Synced to cloud" : dbStatus === "saving" ? "Saving…" : dbStatus === "loading" ? "Loading…" : "Sync error — check connection"} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 8px",borderRadius:8,background:dbStatus==="synced"?S.grnL:dbStatus==="error"?S.redL:S.ambL,border:`1px solid ${dbStatus==="synced"?S.grn+"30":dbStatus==="error"?S.red+"30":S.amb+"30"}`}}>
              {dbStatus==="synced" && <><Wifi size={12} color={S.grn}/><span style={{fontSize:10,fontWeight:700,color:S.grn}} className="tab-label">Synced</span></>}
              {dbStatus==="saving" && <><RefreshCw size={12} color={S.amb} style={{animation:"spin 1s linear infinite"}}/><span style={{fontSize:10,fontWeight:700,color:S.amb}} className="tab-label">Saving…</span></>}
              {dbStatus==="loading" && <><RefreshCw size={12} color={S.amb} style={{animation:"spin 1s linear infinite"}}/><span style={{fontSize:10,fontWeight:700,color:S.amb}} className="tab-label">Loading…</span></>}
              {dbStatus==="error" && <><WifiOff size={12} color={S.red}/><button onClick={loadFromDB} style={{background:"none",border:"none",fontSize:10,fontWeight:700,color:S.red,cursor:"pointer",fontFamily:S.f,padding:0}} className="tab-label">Retry</button></>}
            </div>
            <button onClick={shareLink} style={{display:"flex",alignItems:"center",gap:5,padding:"7px 12px",borderRadius:8,border:`1px solid ${S.bdr}`,background:linkCopied?S.grnL:S.card,color:linkCopied?S.grn:S.txt2,fontFamily:S.f,fontSize:11,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",transition:"all .2s"}}>
              {linkCopied?<><Check size={13}/>Copied!</>:<><ExternalLink size={13}/><span className="tab-label">Share Shop</span></>}
            </button>
            <button onClick={() => setShowBackup(true)} title="Backup & Restore" style={{padding:"7px 10px",borderRadius:8,border:`1px solid ${S.bdr}`,background:S.card,color:S.txt2,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontFamily:S.f,fontSize:11,fontWeight:600}}>
              <DatabaseBackup size={15}/><span className="tab-label">Backup</span>
            </button>
            <button onClick={() => setShowCompany(true)} title="Company Settings" style={{padding:"7px 10px",borderRadius:8,border:`1px solid ${S.bdr}`,background:S.card,color:S.txt2,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontFamily:S.f,fontSize:11,fontWeight:600}}>
              <Building size={15}/><span className="tab-label">Company</span>
            </button>
            <button onClick={() => setIsLocked(true)} title="Lock" style={{padding:7,borderRadius:8,border:`1px solid ${S.bdr}`,background:S.card,color:S.txt2,cursor:"pointer",display:"flex"}}><Lock size={15}/></button>
          </div>
        </div>
      </div>

      <div style={{padding:"14px 12px",maxWidth:1100,margin:"0 auto"}}>

      {/* ═══ INVENTORY TAB ═══ */}
      {tab === "inventory" && <>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
          <h2 style={{margin:0,fontSize:17,fontWeight:800}}>Inventory</h2>
          <div style={{display:"flex",gap:6}}><Btn v="secondary" sz="sm" icon={<Grid3X3 size={13}/>} onClick={() => setShowStockView(true)}>Stock View</Btn><Btn v="secondary" sz="sm" icon={<ImageIcon size={13}/>} onClick={() => setShowCatBanners(true)}>Shop Banners</Btn><Btn v="secondary" sz="sm" icon={<Settings size={13}/>} onClick={() => setShowCats(true)}>Categories</Btn><Btn sz="sm" icon={<Plus size={14}/>} onClick={openAddArt}>New Article</Btn></div>
        </div>
        <div className="stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>
          <Stat icon={<Package size={16}/>} label="Articles" value={articles.length} color={S.acc}/>
          <Stat icon={<Palette size={16}/>} label="Colors" value={totalCols} color={S.pur}/>
          <Stat icon={<Grid3X3 size={16}/>} label="Total Pcs" value={totalPcs.toLocaleString()} color={S.grn}/>
          <Stat icon={<AlertTriangle size={16}/>} label="Low Stock" value={lowStock} color={S.amb}/>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:160}}><Inp icon={<Search size={14}/>} placeholder="Search name or SKU..." value={search} onChange={e => setSearch(e.target.value)}/></div>
          <Sel options={["All",...cats]} value={fCat} onChange={e => setFCat(e.target.value)}/>
        </div>

        {filteredArt.length === 0 ? (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"50px 20px",textAlign:"center"}}>
            <div style={{width:56,height:56,borderRadius:16,background:S.accL,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12,color:S.acc}}><Package size={26}/></div>
            <h3 style={{margin:0,fontSize:15,fontWeight:700}}>No articles found</h3>
            <p style={{margin:"5px 0 16px",fontSize:13,color:S.txt2}}>Add your first article to get started</p>
            <Btn icon={<Plus size={14}/>} onClick={openAddArt}>Add Article</Btn>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {filteredArt.map(a => {
              const tot = artTot(a), exp = expanded === a.id;
              return (
                <div key={a.id}>
                  <div onClick={() => setExpanded(exp ? null : a.id)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 13px",background:S.card,borderRadius:exp?"10px 10px 0 0":10,border:`1px solid ${exp?S.bdrD:S.bdr}`,borderBottom:exp?"none":undefined,cursor:"pointer",gap:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:0}}>
                      <ChevronRight size={14} style={{color:S.txt3,transform:exp?"rotate(90deg)":"none",transition:"transform .2s",flexShrink:0}}/>
                      <div style={{minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:700}}>{a.name} <span className="hide-mob" style={{fontSize:11,color:S.txt3,fontFamily:S.fm,marginLeft:4}}>{a.skuId}</span></div>
                        <div style={{display:"flex",gap:3,marginTop:3,flexWrap:"wrap"}}>{a.colors.map((c,i) => <ColorDot key={i} name={c.name}/>)}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span className="hide-mob"><Tag color={S.pur}>{a.category}</Tag></span>
                      <span style={{fontSize:14,fontWeight:800,color:tot===0?S.red:S.grn}}>{tot}<span style={{fontSize:10,color:S.txt3,marginLeft:2}}>pcs</span></span>
                      <div style={{display:"flex",gap:3}} onClick={e => e.stopPropagation()}>
                        <button onClick={() => openEditArt(a)} style={{background:S.accL,border:"none",borderRadius:6,padding:5,cursor:"pointer",display:"flex",color:S.acc}}><Edit3 size={13}/></button>
                        <button onClick={() => delArt(a.id)} style={{background:S.redL,border:"none",borderRadius:6,padding:5,cursor:"pointer",display:"flex",color:S.red}}><Trash2 size={13}/></button>
                      </div>
                    </div>
                  </div>
                  {exp && (
                    <div style={{background:S.card,borderRadius:"0 0 10px 10px",border:`1px solid ${S.bdrD}`,borderTop:`1px dashed ${S.bdr}`,padding:14,overflowX:"auto"}}>
                      {a.colors.map((c,ci) => {
                        const cT = Object.values(c.sizes).reduce((s,v) => s + (v.qty||0), 0);
                        return (
                          <div key={ci} style={{background:S.bg,borderRadius:10,padding:12,border:`1px solid ${S.bdr}`,marginBottom:ci < a.colors.length-1 ? 8 : 0}}>
                            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                              {c.image && <img src={c.image} alt="" style={{width:44,height:44,borderRadius:8,objectFit:"cover"}}/>}
                              <ColorDot name={c.name}/>
                              <span style={{marginLeft:"auto",fontSize:13,fontWeight:700,color:S.acc}}>{cT} pcs</span>
                            </div>
                            <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                              {a.selectedSizes.map(sz => {
                                const q = c.sizes[sz]?.qty || 0, p = c.sizes[sz]?.price || 0;
                                return (
                                  <div key={sz} style={{textAlign:"center",minWidth:54}}>
                                    <div style={{fontSize:10,fontWeight:700,color:S.txt3}}>{sz}</div>
                                    <div style={{fontSize:14,fontWeight:700,fontFamily:S.fm,color:q===0?S.txt3:q<=5?S.amb:S.txt,background:q<=5&&q>0?S.ambL:"transparent",borderRadius:6,padding:"2px 6px"}}>{q}</div>
                                    <div style={{fontSize:10,color:p?S.grn:S.txt3,fontFamily:S.fm}}>{p ? fmtS(p) : "—"}</div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </>}

      {/* ═══ CUSTOMERS TAB ═══ */}
      {tab === "customers" && <>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
          <h2 style={{margin:0,fontSize:17,fontWeight:800}}>Customers</h2>
          <div style={{display:"flex",gap:6}}><Btn v="secondary" sz="sm" icon={<ExternalLink size={13}/>} onClick={() => setShowCustForm(true)}>Form</Btn><Btn sz="sm" icon={<Plus size={14}/>} onClick={openAddCust}>Add</Btn></div>
        </div>
        <div className="stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>
          <Stat icon={<Users size={16}/>} label="Customers" value={customers.length} color={S.acc}/>
          <Stat icon={<Cake size={16}/>} label="Birthdays" value={upBdays.length} color={S.pnk}/>
          <Stat icon={<Building size={16}/>} label="Companies" value={customers.filter(c => c.company).length} color={S.pur}/>
          <Stat icon={<ShoppingBag size={16}/>} label="Purchases" value={customers.reduce((s,c) => (c.purchases||[]).length + s, 0)} color={S.grn}/>
        </div>

        {upBdays.length > 0 && (
          <div style={{background:S.card,borderRadius:12,padding:"12px 16px",marginBottom:14,border:`1px solid ${S.bdr}`}}>
            <div style={{fontSize:10,fontWeight:700,color:S.pnk,textTransform:"uppercase",letterSpacing:.8,marginBottom:8,display:"flex",alignItems:"center",gap:6}}><Cake size={14}/> Upcoming Birthdays</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {upBdays.map(c => {
                const a = av(c.name);
                return (
                  <div key={c.id} style={{background:S.pnkL,borderRadius:12,padding:"10px 12px",display:"flex",alignItems:"center",gap:10,minWidth:200,maxWidth:280,border:`1px solid ${S.pnk}20`}}>
                    <div style={{width:34,height:34,borderRadius:"50%",background:a.bg,color:a.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,flexShrink:0}}>{c.name.charAt(0)}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:700}}>{c.name}</div>
                      <div style={{fontSize:10,color:S.txt2}}>{fmtD(c.nextBday)} · <span style={{color:S.pnk,fontWeight:600}}>{c.daysUntil === 0 ? "🎂 Today!" : `${c.daysUntil}d away`}</span></div>
                    </div>
                    {(c.whatsapp || c.phone) && (
                      <a href={waLink(c.whatsapp||c.phone, birthdayWAMsg(c))} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} title="Send Birthday Wish on WhatsApp" style={{background:"#25D366",border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer",display:"flex",alignItems:"center",gap:4,color:"#fff",textDecoration:"none",fontSize:10,fontWeight:700,fontFamily:S.f,flexShrink:0}}>
                        <MessageSquare size={12}/>WA
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{marginBottom:14}}><Inp icon={<Search size={14}/>} placeholder="Search name, phone, company..." value={cSearch} onChange={e => setCSearch(e.target.value)}/></div>

        {filteredCust.length === 0 ? (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"50px 20px",textAlign:"center"}}>
            <div style={{width:56,height:56,borderRadius:16,background:S.accL,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12,color:S.acc}}><Users size={26}/></div>
            <h3 style={{margin:0,fontSize:15,fontWeight:700}}>No customers</h3>
            <p style={{margin:"5px 0 16px",fontSize:13,color:S.txt2}}>Add customers or share the registration form</p>
            <Btn icon={<Plus size={14}/>} onClick={openAddCust}>Add Customer</Btn>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:6}}>{filteredCust.map(c => {
            const a = av(c.name), isE = expandedCust === c.id;
            return (
              <div key={c.id}>
                <div onClick={() => setExpandedCust(isE ? null : c.id)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 13px",background:S.card,borderRadius:isE?"10px 10px 0 0":10,border:`1px solid ${isE?S.bdrD:S.bdr}`,borderBottom:isE?"none":undefined,cursor:"pointer",gap:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:0}}>
                    <div style={{width:36,height:36,borderRadius:"50%",background:a.bg,color:a.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,flexShrink:0}}>{c.name.charAt(0)}</div>
                    <div style={{minWidth:0}}><div style={{fontSize:13,fontWeight:700}}>{c.name}</div><div style={{fontSize:11,color:S.txt2}}>{c.phone}{c.company ? ` · ${c.company}` : ""}</div></div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span className="hide-mob" style={{fontSize:12,color:S.txt2}}>{c.city||""}</span>
                    <div style={{display:"flex",gap:3}} onClick={e => e.stopPropagation()}>
                      <button onClick={() => openEditCust(c)} style={{background:S.accL,border:"none",borderRadius:6,padding:5,cursor:"pointer",display:"flex",color:S.acc}}><Edit3 size={13}/></button>
                      <button onClick={() => delCust(c.id)} style={{background:S.redL,border:"none",borderRadius:6,padding:5,cursor:"pointer",display:"flex",color:S.red}}><Trash2 size={13}/></button>
                    </div>
                  </div>
                </div>
                {isE && (
                  <div style={{background:S.card,borderRadius:"0 0 10px 10px",border:`1px solid ${S.bdrD}`,borderTop:`1px dashed ${S.bdr}`,padding:16}}>
                    {/* Details grid */}
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:8,marginBottom:14}}>
                      {[{l:"Phone",v:c.phone,link:`tel:${c.phone}`},{l:"WhatsApp",v:c.whatsapp||"—",link:c.whatsapp?waLink(c.whatsapp,"Hello!"):"#"},{l:"Email",v:c.email||"—"},{l:"DOB",v:c.dob?fmtD(c.dob):"—"},{l:"Address",v:c.address?`${c.address}, ${c.city}, ${c.state} - ${c.pincode}`:"—"},{l:"Company",v:c.company||"—"},{l:"GST",v:c.gst||"—"},{l:"Agent",v:c.agent||"—"},{l:"Transport",v:c.transport||"—"}].map((x,i) => (
                        <div key={i} style={{padding:"8px 10px",background:S.bg,borderRadius:8}}>
                          <div style={{fontSize:9,fontWeight:700,color:S.txt3,textTransform:"uppercase",letterSpacing:.8}}>{x.l}</div>
                          {x.link && x.v !== "—" ? <a href={x.link} target="_blank" rel="noreferrer" style={{fontSize:12,fontWeight:600,marginTop:2,color:S.acc,display:"block",textDecoration:"none"}}>{x.v}</a> : <div style={{fontSize:12,fontWeight:600,marginTop:2}}>{x.v}</div>}
                        </div>
                      ))}
                    </div>
                    {/* Purchase History */}
                    {(() => {
                      const hist = custPurchaseHistory(c);
                      const totSpend = hist.reduce((s,h)=>s+h.totalAmt,0);
                      if (hist.length === 0) return (
                        <div style={{background:S.bg,borderRadius:10,padding:"12px 14px",textAlign:"center",color:S.txt3,fontSize:12}}>
                          <History size={18} style={{margin:"0 auto 6px",display:"block"}}/>No purchase history yet
                        </div>
                      );
                      return (
                        <div>
                          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                            <div style={{fontSize:10,fontWeight:700,color:S.txt3,textTransform:"uppercase",letterSpacing:.8,display:"flex",alignItems:"center",gap:5}}><History size={12}/>Purchase History</div>
                            <div style={{display:"flex",gap:12}}>
                              <span style={{fontSize:11,color:S.txt2}}>{hist.length} transactions</span>
                              <span style={{fontSize:11,fontWeight:700,color:S.grn}}>{fmtR(totSpend)} total</span>
                            </div>
                          </div>
                          <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:280,overflowY:"auto"}}>
                            {hist.map((h,hi) => (
                              <div key={hi} style={{background:S.bg,borderRadius:10,padding:"10px 12px",border:`1px solid ${S.bdr}`}}>
                                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                                    <Tag color={h.type==="challan"?S.tea:S.grn}>{h.type==="challan"?"Challan":"Order"}</Tag>
                                    <span style={{fontSize:12,fontWeight:700}}>{h.number}</span>
                                  </div>
                                  <span style={{fontSize:11,color:S.txt3}}>{fmtD(h.date)}</span>
                                </div>
                                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:4}}>
                                  {h.items.slice(0,3).map((it,ii) => (
                                    <span key={ii} style={{fontSize:11,color:S.txt2,background:S.card,padding:"2px 8px",borderRadius:6,border:`1px solid ${S.bdr}`}}>
                                      {it.name} · {it.color}
                                    </span>
                                  ))}
                                  {h.items.length > 3 && <span style={{fontSize:11,color:S.txt3}}>+{h.items.length-3} more</span>}
                                </div>
                                <div style={{display:"flex",gap:12,marginTop:6}}>
                                  <span style={{fontSize:11,color:S.txt2}}>{h.totalQty} pcs</span>
                                  <span style={{fontSize:12,fontWeight:700,color:S.grn}}>{fmtR(h.totalAmt)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                    {/* WhatsApp quick action */}
                    {(c.whatsapp || c.phone) && (
                      <a href={waLink(c.whatsapp||c.phone,"Hello! We have new collections available. Would you like to see our latest arrivals? 🛍️")} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,marginTop:10,padding:"7px 14px",borderRadius:8,background:"#25D366",color:"#fff",fontSize:12,fontWeight:700,fontFamily:S.f,textDecoration:"none"}}>
                        <MessageSquare size={13}/>Send WhatsApp
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}</div>
        )}
      </>}

      {/* ═══ CHALLANS TAB ═══ */}
      {tab === "challans" && <>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
          <h2 style={{margin:0,fontSize:17,fontWeight:800}}>Delivery Challans</h2>
          <div style={{display:"flex",gap:6}}>
            <Btn v="secondary" sz="sm" icon={<Building size={13}/>} onClick={() => setShowCompany(true)}>Company</Btn>
            <Btn sz="sm" icon={<Plus size={14}/>} onClick={openNewChallan}>New Challan</Btn>
          </div>
        </div>
        <div className="stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>
          <Stat icon={<FileText size={16}/>} label="Total" value={challans.length} color={S.acc}/>
          <Stat icon={<Grid3X3 size={16}/>} label="Dispatched" value={challans.reduce((s,c) => s + c.totalQty, 0)} color={S.tea}/>
          <Stat icon={<span style={{fontSize:14,fontWeight:800}}>₹</span>} label="Value" value={fmtR(challans.reduce((s,c) => s + c.totalAmt, 0))} color={S.grn}/>
          <Stat icon={<Users size={16}/>} label="Customers" value={[...new Set(challans.map(c => c.customer.name))].length} color={S.pur}/>
        </div>

        {challans.length === 0 ? (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"50px 20px",textAlign:"center"}}>
            <div style={{width:56,height:56,borderRadius:16,background:S.accL,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12,color:S.acc}}><FileText size={26}/></div>
            <h3 style={{margin:0,fontSize:15,fontWeight:700}}>No challans yet</h3>
            <p style={{margin:"5px 0 16px",fontSize:13,color:S.txt2}}>Create a challan to dispatch items & auto-deduct stock</p>
            <Btn icon={<Plus size={14}/>} onClick={openNewChallan}>Create Challan</Btn>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:6}}>{challans.map(ch => {
            const isE = expandedCh === ch.id;
            return (
              <div key={ch.id}>
                <div style={{background:S.card,borderRadius:isE?"10px 10px 0 0":10,border:`1px solid ${isE?S.bdrD:S.bdr}`,borderBottom:isE?"none":undefined}}>
                  <div onClick={() => setExpandedCh(isE ? null : ch.id)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 15px",cursor:"pointer",flexWrap:"wrap",gap:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:38,height:38,borderRadius:10,background:S.accL,display:"flex",alignItems:"center",justifyContent:"center",color:S.acc,flexShrink:0}}><FileText size={17}/></div>
                      <div>
                        <div style={{fontSize:13,fontWeight:700}}>{ch.number}</div>
                        <div style={{fontSize:11,color:S.txt2}}>{ch.customer.name} · {fmtD(ch.date)}</div>
                      </div>
                    </div>
                    <div className="ch-header-right" style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                      <Tag color={S.tea}>{ch.totalQty} pcs</Tag>
                      <span style={{fontSize:14,fontWeight:700,color:S.grn}}>{fmtR(ch.totalAmt)}</span>
                      <div style={{display:"flex",gap:4}} onClick={e => e.stopPropagation()}>
                        <button onClick={() => openEditChallan(ch)} style={{background:S.accL,border:"none",borderRadius:6,padding:"5px 8px",cursor:"pointer",display:"flex",alignItems:"center",gap:4,color:S.acc,fontSize:11,fontWeight:600,fontFamily:S.f}}><Edit3 size={12}/>Edit</button>
                        <button onClick={() => printChallan(ch)} style={{background:S.bg,border:`1px solid ${S.bdr}`,borderRadius:6,padding:"5px 8px",cursor:"pointer",display:"flex",alignItems:"center",gap:4,color:S.txt2,fontSize:11,fontWeight:600,fontFamily:S.f}}><Printer size={12}/>Print</button>
                        <button onClick={() => downloadPDF(ch)} style={{background:S.grnL,border:"none",borderRadius:6,padding:"5px 8px",cursor:"pointer",display:"flex",alignItems:"center",gap:4,color:S.grn,fontSize:11,fontWeight:600,fontFamily:S.f}}><Download size={12}/>PDF</button>
                        <button onClick={() => delChallan(ch)} style={{background:S.redL,border:"none",borderRadius:6,padding:5,cursor:"pointer",display:"flex",color:S.red}}><Trash2 size={13}/></button>
                      </div>
                    </div>
                  </div>
                </div>
                {isE && (
                  <div style={{background:S.card,borderRadius:"0 0 10px 10px",border:`1px solid ${S.bdrD}`,borderTop:`1px dashed ${S.bdr}`,padding:14}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                      <div style={{padding:10,background:S.bg,borderRadius:8}}><div style={{fontSize:9,fontWeight:700,color:S.txt3,textTransform:"uppercase",marginBottom:3}}>Customer</div><div style={{fontSize:13,fontWeight:600}}>{ch.customer.name}</div><div style={{fontSize:11,color:S.txt2}}>{ch.customer.address}</div></div>
                      <div style={{padding:10,background:S.bg,borderRadius:8}}><div style={{fontSize:9,fontWeight:700,color:S.txt3,textTransform:"uppercase",marginBottom:3}}>Transport</div><div style={{fontSize:13,fontWeight:600}}>{ch.customer.transport||"—"}</div><div style={{fontSize:11,color:S.txt2}}>LR: {ch.lrNumber||"—"}</div>{ch.remarks && <div style={{fontSize:11,color:S.amb,marginTop:3}}>Note: {ch.remarks}</div>}</div>
                    </div>
                    {/* Items with images */}
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {ch.items.map((it, ii) => (
                        <div key={ii} style={{background:S.bg,borderRadius:10,padding:12,border:`1px solid ${S.bdr}`}}>
                          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                            {it.colorImage && <img src={it.colorImage} alt="" style={{width:44,height:44,borderRadius:8,objectFit:"cover",border:`1px solid ${S.bdr}`}}/>}
                            <div>
                              <div style={{fontSize:13,fontWeight:700}}>{it.articleName}</div>
                              <div style={{display:"flex",alignItems:"center",gap:6,marginTop:2}}>
                                <ColorDot name={it.colorName}/>
                                <span style={{fontSize:10,color:S.txt3,fontFamily:S.fm}}>{it.skuId}</span>
                              </div>
                            </div>
                          </div>
                          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                            {it.sizes.map((sz,si) => (
                              <div key={si} style={{background:S.card,borderRadius:8,padding:"6px 10px",border:`1px solid ${S.bdr}`,textAlign:"center",minWidth:60}}>
                                <div style={{fontSize:10,fontWeight:700,color:S.acc}}>{sz.size}</div>
                                <div style={{fontSize:14,fontWeight:800,fontFamily:S.fm,color:S.txt}}>{sz.qty}</div>
                                <div style={{fontSize:10,color:S.grn,fontFamily:S.fm}}>{fmtS(sz.price)}</div>
                              </div>
                            ))}
                          </div>
                          <div style={{textAlign:"right",fontSize:12,fontWeight:700,color:S.grn,marginTop:8}}>
                            {it.sizes.reduce((s,sz)=>s+sz.qty,0)} pcs · {fmtR(it.sizes.reduce((s,sz)=>s+sz.amount,0))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0 0",borderTop:`1px solid ${S.bdr}`,marginTop:10,flexWrap:"wrap",gap:8}}>
                      <div style={{display:"flex",gap:12}}>
                        <div style={{textAlign:"center"}}><div style={{fontSize:9,fontWeight:700,color:S.txt3,textTransform:"uppercase"}}>Total Qty</div><div style={{fontSize:18,fontWeight:800,color:S.acc,fontFamily:S.fm}}>{ch.totalQty}</div></div>
                        <div style={{textAlign:"center"}}><div style={{fontSize:9,fontWeight:700,color:S.txt3,textTransform:"uppercase"}}>Total Amount</div><div style={{fontSize:18,fontWeight:800,color:S.grn,fontFamily:S.fm}}>{fmtR(ch.totalAmt)}</div></div>
                      </div>
                      <button onClick={() => printPackingSlip(ch)} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 18px",background:`linear-gradient(135deg,${S.pur},#9333ea)`,border:"none",borderRadius:10,cursor:"pointer",color:"#fff",fontSize:13,fontWeight:700,fontFamily:S.f,boxShadow:`0 3px 12px ${S.pur}40`}}>
                        <Package size={16}/>Packing Slip
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}</div>
        )}
      </>}

      {/* ═══ ORDERS TAB ═══ */}
      {tab === "orders" && <>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
          <h2 style={{margin:0,fontSize:17,fontWeight:800}}>Customer Orders</h2>
          <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
            <Tag color={S.amb}>{orders.filter(o=>o.status==="pending").length} Pending</Tag>
            <Tag color={S.grn}>{orders.filter(o=>o.status==="approved").length} Approved</Tag>
            <Btn sz="sm" icon={<Plus size={13}/>} onClick={()=>{setOrderForm2(blankOF);setShowCreateOrder(true);}}>Create Order</Btn>
            <Btn sz="sm" icon={<ExternalLink size={13}/>} onClick={shareLink} v="secondary">{linkCopied?"Copied! ✓":"Share Shop Link"}</Btn>
            <Btn sz="sm" icon={<KeyRound size={13}/>} onClick={()=>setShowChangePIN(true)} v="secondary">Change PIN</Btn>
          </div>
        </div>
        {orders.length === 0 ? (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"50px 20px",textAlign:"center"}}>
            <div style={{width:56,height:56,borderRadius:16,background:S.accL,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12,color:S.acc}}><ClipboardList size={26}/></div>
            <h3 style={{margin:0,fontSize:15,fontWeight:700}}>No orders yet</h3>
            <p style={{margin:"5px 0 16px",fontSize:13,color:S.txt2}}>Share your shop link with customers to start receiving orders</p>
            <Btn icon={<ExternalLink size={14}/>} onClick={shareLink}>{linkCopied?"Link Copied! ✓":"Copy Shop Link"}</Btn>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {orders.map(ord => {
              const isE = expandedOrder === ord.id;
              const isManual = ord.type === "manual";
              const deliveredCount = (ord.items||[]).filter(it=>it.delivered).length;
              const totalItems = (ord.items||[]).length;
              const isFullyDelivered = totalItems > 0 && deliveredCount === totalItems;
              const isPartialDelivered = deliveredCount > 0 && deliveredCount < totalItems;
              const statusColor = isFullyDelivered?S.grn:isPartialDelivered?S.tea:{pending:S.amb,approved:S.grn,rejected:S.red,manual:S.pur}[ord.status]||S.pur;
              const statusBg = isFullyDelivered?S.grnL:isPartialDelivered?S.teaL:{pending:S.ambL,approved:S.grnL,rejected:S.redL,manual:S.purL}[ord.status]||S.purL;
              const StatusIcon = isFullyDelivered?CheckCircle:isPartialDelivered?Truck:{pending:Clock,approved:CheckCircle,rejected:XCircle,manual:FileText}[ord.status]||FileText;
              const statusLabel = isFullyDelivered?"Delivered":isPartialDelivered?"Partial":ord.status.charAt(0).toUpperCase()+ord.status.slice(1);
              return (
                <div key={ord.id}>
                  <div style={{background:S.card,borderRadius:isE?"10px 10px 0 0":10,border:`1px solid ${isE?S.bdrD:S.bdr}`,borderBottom:isE?"none":undefined}}>
                    <div onClick={()=>setExpandedOrder(isE?null:ord.id)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 15px",cursor:"pointer",gap:8,flexWrap:"wrap"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:38,height:38,borderRadius:10,background:statusBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:statusColor}}><ClipboardList size={17}/></div>
                        <div>
                          <div style={{fontSize:13,fontWeight:700}}>{ord.number} · {ord.customer.name}</div>
                          <div style={{fontSize:11,color:S.txt2}}>{ord.customer.phone} · {fmtD(ord.date)}</div>
                        </div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                        <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:20,background:statusBg,color:statusColor,fontSize:11,fontWeight:700}}><StatusIcon size={11}/>{statusLabel}</span>
                        <Tag color={S.tea}>{ord.totalQty} pcs</Tag>
                        <span style={{fontSize:13,fontWeight:700,color:S.grn}}>{fmtR(ord.totalAmt)}</span>
                        {ord.status === "pending" && (
                          <div style={{display:"flex",gap:4}} onClick={e=>e.stopPropagation()}>
                            <button onClick={()=>updateOrderStatus(ord.id,"approved")} style={{padding:"5px 10px",borderRadius:7,border:"none",background:S.grnL,color:S.grn,fontWeight:600,fontSize:11,fontFamily:S.f,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><Check size={12}/>Approve</button>
                            <button onClick={()=>updateOrderStatus(ord.id,"rejected")} style={{padding:"5px 10px",borderRadius:7,border:"none",background:S.redL,color:S.red,fontWeight:600,fontSize:11,fontFamily:S.f,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><X size={12}/>Reject</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {isE && (
                    <div style={{background:S.card,borderRadius:"0 0 10px 10px",border:`1px solid ${S.bdrD}`,borderTop:`1px dashed ${S.bdr}`,padding:14}}>
                      {ord.note && <div style={{background:S.ambL,borderRadius:8,padding:"8px 12px",marginBottom:12,fontSize:12,color:S.amb}}>📝 {ord.note}</div>}
                      {/* Delivery summary bar */}
                      {ord.items?.some(it=>it.delivered) && (() => {
                        const delivered = ord.items.filter(it=>it.delivered).length;
                        const pending = ord.items.length - delivered;
                        return (
                          <div style={{display:"flex",gap:8,marginBottom:10,padding:"8px 12px",background:pending===0?S.grnL:S.ambL,borderRadius:8,alignItems:"center",flexWrap:"wrap"}}>
                            <span style={{fontSize:12,fontWeight:700,color:pending===0?S.grn:S.amb}}>{pending===0?"✅ Fully Delivered":"⏳ Partially Delivered"}</span>
                            <Tag color={S.grn}>{delivered} Delivered</Tag>
                            {pending>0 && <Tag color={S.amb}>{pending} Pending</Tag>}
                          </div>
                        );
                      })()}
                      <div style={{display:"flex",flexDirection:"column",gap:8}}>
                        {ord.items.map((it,i) => {
                          const isDelivered = !!it.delivered;
                          const isManualOrd = ord.type === "manual";
                          const sizes = Array.isArray(it.sizes) ? it.sizes : [{size:it.size, qty:it.qty, price:it.price||0, amount:it.amount||0}];
                          return (
                            <div key={i} style={{background:isDelivered?S.grnL:S.bg,borderRadius:10,padding:12,border:`2px solid ${isDelivered?S.grn+"50":S.bdr}`,display:"flex",alignItems:"center",gap:10,opacity:isDelivered?0.85:1,transition:"all .2s"}}>
                              {it.colorImage && <img src={it.colorImage} alt="" style={{width:44,height:44,borderRadius:8,objectFit:"cover",flexShrink:0,filter:isDelivered?"grayscale(30%)":"none"}}/>}
                              <div style={{flex:1}}>
                                <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                                  <span style={{fontSize:13,fontWeight:700,color:isDelivered?S.grn:S.txt}}>{it.articleName}</span>
                                  {isManualOrd && isDelivered && <span style={{background:S.grn,color:"#fff",fontSize:9,fontWeight:800,padding:"2px 7px",borderRadius:20,letterSpacing:.5}}>✓ DELIVERED</span>}
                                  {isManualOrd && !isDelivered && <span style={{background:S.amb,color:"#fff",fontSize:9,fontWeight:800,padding:"2px 7px",borderRadius:20,letterSpacing:.5}}>PENDING</span>}
                                </div>
                                <div style={{display:"flex",gap:6,alignItems:"center",marginTop:4,flexWrap:"wrap"}}>
                                  <ColorDot name={it.colorName}/>
                                  {sizes.map((sz,si)=>(
                                    <div key={si} style={{background:isDelivered?"#d1fae5":"#eef1ff",borderRadius:8,padding:"4px 8px",textAlign:"center",border:`1px solid ${isDelivered?S.grn+"30":S.acc+"20"}`}}>
                                      <div style={{fontSize:11,fontWeight:800,color:isDelivered?S.grn:S.acc}}>{sz.size}</div>
                                      <div style={{fontSize:12,fontWeight:700,color:S.txt}}>{sz.qty} pcs</div>
                                      <div style={{fontSize:10,fontWeight:600,color:S.grn}}>{fmtS(sz.price||0)}</div>
                                    </div>
                                  ))}
                                  <div style={{marginLeft:4,paddingLeft:8,borderLeft:`2px solid ${S.bdr}`}}>
                                    <div style={{fontSize:10,color:S.txt3}}>Total</div>
                                    <div style={{fontSize:13,fontWeight:800,color:S.grn}}>{fmtR(sizes.reduce((s,sz)=>s+(sz.amount||0),0))}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10,paddingTop:10,borderTop:`1px solid ${S.bdr}`}}>
                        <span style={{fontWeight:800,fontSize:15,color:S.grn}}>{fmtR(ord.totalAmt)}</span>
                        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                          {ord.items?.length > 0 && <button onClick={()=>openConvertOrder(ord)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",background:S.grnL,border:`1px solid ${S.grn}40`,borderRadius:8,cursor:"pointer",color:S.grn,fontSize:12,fontWeight:700,fontFamily:S.f}}><FileText size={14}/>Convert to Challan</button>}
                          <button onClick={()=>openEditOrder(ord)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",background:S.accL,border:"none",borderRadius:8,cursor:"pointer",color:S.acc,fontSize:12,fontWeight:700,fontFamily:S.f}}><Edit3 size={14}/>Edit Order</button>
                          <button onClick={()=>printOrderSlip(ord)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",background:`linear-gradient(135deg,${S.pur},#9333ea)`,border:"none",borderRadius:8,cursor:"pointer",color:"#fff",fontSize:12,fontWeight:700,fontFamily:S.f}}>
                            <Printer size={14}/>Print / Share
                          </button>
                          <button onClick={()=>askConfirm(`Delete ${ord.number}?`,`This will permanently delete the order for ${ord.customer?.name}. This cannot be undone.`,()=>{setOrders(prev=>prev.filter(o=>o.id!==ord.id));deleteOrderFromDB(ord.id).catch(()=>{});setExpandedOrder(null);})} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",background:S.redL,border:"none",borderRadius:8,cursor:"pointer",color:S.red,fontSize:12,fontWeight:700,fontFamily:S.f}}>
                            <Trash2 size={14}/>Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </>}

      {/* ═══ REPORTS TAB ═══ */}
      {tab === "reports" && (() => {
        // Combine all challans + approved/manual orders into one dataset
        const allTxns = [
          ...challans.map(ch => ({
            type:"challan", number:ch.number, date:ch.date,
            party: ch.customer.name, phone: ch.customer.phone,
            items: ch.items.map(it => ({
              articleId:it.articleId, articleName:it.articleName, skuId:it.skuId,
              colorName:it.colorName, colorImage:it.colorImage,
              sizes:it.sizes
            }))
          })),
          ...orders.filter(o=>o.type==="manual"||o.status==="approved").map(o => ({
            type:"order", number:o.number, date:o.date,
            party:o.customer?.name||"—", phone:o.customer?.phone||"",
            items:(o.items||[]).map(it => ({
              articleId:it.articleId, articleName:it.articleName, skuId:it.skuId||"",
              colorName:it.colorName, colorImage:it.colorImage,
              sizes: Array.isArray(it.sizes) ? it.sizes : [{size:it.size,qty:it.qty,price:it.price,amount:it.amount}]
            }))
          }))
        ];

        // ── Article-wise view: each article → parties who ordered it ──
        const articleMap = {};
        allTxns.forEach(txn => {
          txn.items.forEach(it => {
            if (!it.articleName) return;
            const key = it.articleId || it.articleName;
            if (!articleMap[key]) articleMap[key] = { articleName:it.articleName, skuId:it.skuId, colorImage:it.colorImage, parties:{} };
            const pKey = txn.party;
            if (!articleMap[key].parties[pKey]) articleMap[key].parties[pKey] = { party:txn.party, phone:txn.phone, txns:[] };
            articleMap[key].parties[pKey].txns.push({ number:txn.number, date:txn.date, type:txn.type, colorName:it.colorName, sizes:it.sizes });
          });
        });

        // ── Party-wise view: each party → articles they ordered ──
        const partyMap = {};
        allTxns.forEach(txn => {
          const key = txn.party;
          if (!partyMap[key]) partyMap[key] = { party:txn.party, phone:txn.phone, articles:{} };
          txn.items.forEach(it => {
            if (!it.articleName) return;
            const aKey = it.articleId || it.articleName;
            if (!partyMap[key].articles[aKey]) partyMap[key].articles[aKey] = { articleName:it.articleName, skuId:it.skuId, colorImage:it.colorImage, txns:[] };
            partyMap[key].articles[aKey].txns.push({ number:txn.number, date:txn.date, type:txn.type, colorName:it.colorName, sizes:it.sizes });
          });
        });

        const artEntries = Object.values(articleMap).filter(a => a.articleName.toLowerCase().includes(reportSearch.toLowerCase()) || a.skuId?.toLowerCase().includes(reportSearch.toLowerCase()));
        const partyEntries = Object.values(partyMap).filter(p => p.party.toLowerCase().includes(reportSearch.toLowerCase()) || p.phone?.includes(reportSearch));

        return <>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
            <h2 style={{margin:0,fontSize:17,fontWeight:800}}>Order Reports</h2>
            <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
              <div style={{display:"flex",background:S.bg,borderRadius:8,padding:3,gap:2}}>
                <button onClick={()=>setReportView("article")} style={{padding:"6px 14px",borderRadius:6,border:"none",background:reportView==="article"?S.card:"transparent",color:reportView==="article"?S.acc:S.txt2,fontFamily:S.f,fontSize:12,fontWeight:reportView==="article"?700:500,cursor:"pointer",boxShadow:reportView==="article"?"0 1px 3px rgba(0,0,0,.08)":"none"}}>Article-wise</button>
                <button onClick={()=>setReportView("party")} style={{padding:"6px 14px",borderRadius:6,border:"none",background:reportView==="party"?S.card:"transparent",color:reportView==="party"?S.acc:S.txt2,fontFamily:S.f,fontSize:12,fontWeight:reportView==="party"?700:500,cursor:"pointer",boxShadow:reportView==="party"?"0 1px 3px rgba(0,0,0,.08)":"none"}}>Party-wise</button>
              </div>
              {reportView==="article" && artEntries.length>0 && (
                <button onClick={()=>printArticleReport(artEntries, allTxns)} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",background:`linear-gradient(135deg,${S.pur},#9333ea)`,border:"none",borderRadius:8,cursor:"pointer",color:"#fff",fontSize:12,fontWeight:700,fontFamily:S.f}}>
                  <Download size={13}/>Export PDF
                </button>
              )}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>
            <Stat icon={<Package size={16}/>} label="Articles" value={Object.keys(articleMap).length} color={S.acc}/>
            <Stat icon={<Users size={16}/>} label="Parties" value={Object.keys(partyMap).length} color={S.pur}/>
            <Stat icon={<FileText size={16}/>} label="Challans" value={challans.length} color={S.tea}/>
            <Stat icon={<ClipboardList size={16}/>} label="Orders" value={orders.filter(o=>o.type==="manual"||o.status==="approved").length} color={S.grn}/>
          </div>

          {/* Search */}
          <div style={{marginBottom:14}}>
            <Inp icon={<Search size={14}/>} placeholder={reportView==="article"?"Search article name or SKU...":"Search party name or phone..."} value={reportSearch} onChange={e=>setReportSearch(e.target.value)}/>
          </div>

          {/* ── ARTICLE-WISE VIEW ── */}
          {reportView==="article" && (
            artEntries.length===0
            ? <div style={{textAlign:"center",padding:"40px 20px",color:S.txt3}}><Package size={36} style={{margin:"0 auto 10px",display:"block"}}/><div>No data yet</div></div>
            : <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {artEntries.map((art,ai) => {
                  const totalQty = Object.values(art.parties).reduce((s,p)=>s+p.txns.reduce((ss,t)=>ss+t.sizes.reduce((sss,sz)=>sss+sz.qty,0),0),0);
                  const totalAmt = Object.values(art.parties).reduce((s,p)=>s+p.txns.reduce((ss,t)=>ss+t.sizes.reduce((sss,sz)=>sss+(sz.amount||0),0),0),0);
                  return (
                    <div key={ai} style={{background:S.card,borderRadius:12,border:`1px solid ${S.bdr}`,overflow:"hidden"}}>
                      {/* Article Header */}
                      <div style={{padding:"12px 16px",background:`linear-gradient(135deg,${S.accL},${S.purL})`,display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${S.bdr}`}}>
                        {art.colorImage && <img src={art.colorImage} alt="" style={{width:44,height:44,borderRadius:8,objectFit:"cover",flexShrink:0,border:`1px solid ${S.bdr}`}}/>}
                        <div style={{flex:1}}>
                          <div style={{fontSize:14,fontWeight:800}}>{art.articleName}</div>
                          <div style={{fontSize:11,color:S.txt2,fontFamily:S.fm}}>{art.skuId}</div>
                        </div>
                        <div style={{display:"flex",gap:16,flexShrink:0}}>
                          <div style={{textAlign:"center"}}><div style={{fontSize:9,fontWeight:700,color:S.txt3,textTransform:"uppercase"}}>Parties</div><div style={{fontSize:16,fontWeight:800,color:S.acc}}>{Object.keys(art.parties).length}</div></div>
                          <div style={{textAlign:"center"}}><div style={{fontSize:9,fontWeight:700,color:S.txt3,textTransform:"uppercase"}}>Total Pcs</div><div style={{fontSize:16,fontWeight:800,color:S.tea}}>{totalQty}</div></div>
                          <div style={{textAlign:"center"}}><div style={{fontSize:9,fontWeight:700,color:S.txt3,textTransform:"uppercase"}}>Total Amt</div><div style={{fontSize:15,fontWeight:800,color:S.grn}}>{fmtR(totalAmt)}</div></div>
                        </div>
                      </div>
                      {/* Party rows */}
                      {Object.values(art.parties).map((p,pi) => {
                        const pQty = p.txns.reduce((s,t)=>s+t.sizes.reduce((ss,sz)=>ss+sz.qty,0),0);
                        const pAmt = p.txns.reduce((s,t)=>s+t.sizes.reduce((ss,sz)=>ss+(sz.amount||0),0),0);
                        return (
                          <div key={pi} style={{padding:"10px 16px",borderBottom:pi<Object.values(art.parties).length-1?`1px solid ${S.bdr}`:"none",display:"flex",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
                            <div style={{flex:1,minWidth:160}}>
                              <div style={{fontSize:13,fontWeight:700}}>{p.party}</div>
                              <div style={{fontSize:11,color:S.txt2}}>{p.phone}</div>
                              <div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap"}}>
                                {p.txns.map((t,ti)=>(
                                  <div key={ti} style={{background:t.type==="challan"?S.teaL:S.purL,borderRadius:6,padding:"3px 8px",fontSize:11}}>
                                    <span style={{fontWeight:700,color:t.type==="challan"?S.tea:S.pur}}>{t.number}</span>
                                    <span style={{color:S.txt2,marginLeft:4}}>{t.colorName}</span>
                                    <span style={{color:S.txt3,marginLeft:4}}>{fmtD(t.date)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div style={{display:"flex",gap:12,alignItems:"center",flexShrink:0}}>
                              <div style={{textAlign:"right"}}>
                                <div style={{fontSize:13,fontWeight:800,color:S.tea}}>{pQty} pcs</div>
                                <div style={{fontSize:12,fontWeight:700,color:S.grn}}>{fmtR(pAmt)}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
          )}

          {/* ── PARTY-WISE VIEW ── */}
          {reportView==="party" && (
            partyEntries.length===0
            ? <div style={{textAlign:"center",padding:"40px 20px",color:S.txt3}}><Users size={36} style={{margin:"0 auto 10px",display:"block"}}/><div>No data yet</div></div>
            : <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {partyEntries.map((p,pi) => {
                  const totalQty = Object.values(p.articles).reduce((s,a)=>s+a.txns.reduce((ss,t)=>ss+t.sizes.reduce((sss,sz)=>sss+sz.qty,0),0),0);
                  const totalAmt = Object.values(p.articles).reduce((s,a)=>s+a.txns.reduce((ss,t)=>ss+t.sizes.reduce((sss,sz)=>sss+(sz.amount||0),0),0),0);
                  return (
                    <div key={pi} style={{background:S.card,borderRadius:12,border:`1px solid ${S.bdr}`,overflow:"hidden"}}>
                      {/* Party Header */}
                      <div style={{padding:"12px 16px",background:`linear-gradient(135deg,${S.purL},${S.pnkL})`,display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${S.bdr}`}}>
                        <div style={{width:42,height:42,borderRadius:"50%",background:`hsl(${p.party.split("").reduce((a,c)=>a+c.charCodeAt(0),0)%360},50%,88%)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,flexShrink:0,color:`hsl(${p.party.split("").reduce((a,c)=>a+c.charCodeAt(0),0)%360},50%,35%)`}}>{p.party.charAt(0)}</div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:14,fontWeight:800}}>{p.party}</div>
                          <div style={{fontSize:11,color:S.txt2}}>{p.phone}</div>
                        </div>
                        <div style={{display:"flex",gap:16,flexShrink:0}}>
                          <div style={{textAlign:"center"}}><div style={{fontSize:9,fontWeight:700,color:S.txt3,textTransform:"uppercase"}}>Articles</div><div style={{fontSize:16,fontWeight:800,color:S.pur}}>{Object.keys(p.articles).length}</div></div>
                          <div style={{textAlign:"center"}}><div style={{fontSize:9,fontWeight:700,color:S.txt3,textTransform:"uppercase"}}>Total Pcs</div><div style={{fontSize:16,fontWeight:800,color:S.tea}}>{totalQty}</div></div>
                          <div style={{textAlign:"center"}}><div style={{fontSize:9,fontWeight:700,color:S.txt3,textTransform:"uppercase"}}>Total Amt</div><div style={{fontSize:15,fontWeight:800,color:S.grn}}>{fmtR(totalAmt)}</div></div>
                        </div>
                      </div>
                      {/* Article rows */}
                      {Object.values(p.articles).map((a,ai) => {
                        const aQty = a.txns.reduce((s,t)=>s+t.sizes.reduce((ss,sz)=>ss+sz.qty,0),0);
                        const aAmt = a.txns.reduce((s,t)=>s+t.sizes.reduce((ss,sz)=>ss+(sz.amount||0),0),0);
                        return (
                          <div key={ai} style={{padding:"10px 16px",borderBottom:ai<Object.values(p.articles).length-1?`1px solid ${S.bdr}`:"none",display:"flex",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
                            {a.colorImage && <img src={a.colorImage} alt="" style={{width:36,height:36,borderRadius:6,objectFit:"cover",flexShrink:0}}/>}
                            <div style={{flex:1,minWidth:160}}>
                              <div style={{fontSize:13,fontWeight:700}}>{a.articleName} <span style={{fontSize:10,color:S.txt3,fontFamily:S.fm}}>{a.skuId}</span></div>
                              <div style={{display:"flex",gap:6,marginTop:5,flexWrap:"wrap"}}>
                                {a.txns.map((t,ti)=>(
                                  <div key={ti} style={{background:t.type==="challan"?S.teaL:S.purL,borderRadius:6,padding:"3px 8px",fontSize:11}}>
                                    <span style={{fontWeight:700,color:t.type==="challan"?S.tea:S.pur}}>{t.number}</span>
                                    <span style={{color:S.txt2,marginLeft:4}}>{t.colorName}</span>
                                    <span style={{color:S.txt3,marginLeft:4}}>{t.sizes.map(sz=>`${sz.size}:${sz.qty}`).join(" ")}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div style={{textAlign:"right",flexShrink:0}}>
                              <div style={{fontSize:13,fontWeight:800,color:S.tea}}>{aQty} pcs</div>
                              <div style={{fontSize:12,fontWeight:700,color:S.grn}}>{fmtR(aAmt)}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
          )}
        </>;
      })()}
      </div>

      {/* ═══ MODALS ═══ */}

      {/* Change PIN Modal */}
      <Modal open={showChangePIN} onClose={()=>{setShowChangePIN(false);setNewPin1("");setNewPin2("");setPinChangeErr("");}} title="Change PIN" w={360}>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Inp label="New PIN (4 digits)" placeholder="••••" type="password" maxLength={4} value={newPin1} onChange={e=>setNewPin1(e.target.value.replace(/\D/g,"").slice(0,4))} icon={<Lock size={13}/>}/>
          <Inp label="Confirm PIN" placeholder="••••" type="password" maxLength={4} value={newPin2} onChange={e=>setNewPin2(e.target.value.replace(/\D/g,"").slice(0,4))} icon={<Lock size={13}/>}/>
          {pinChangeErr && <div style={{fontSize:12,color:S.red,fontWeight:600}}>{pinChangeErr}</div>}
          <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:4}}>
            <Btn v="secondary" onClick={()=>setShowChangePIN(false)}>Cancel</Btn>
            <Btn onClick={saveNewPin} disabled={newPin1.length<4} icon={<Check size={14}/>}>Save PIN</Btn>
          </div>
        </div>
      </Modal>

      {/* Category Banners Modal */}
      <Modal open={showCatBanners} onClose={()=>setShowCatBanners(false)} title="Shop Category Banners" sub="Upload banner images shown above each category in the shop" w={560}>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{fontSize:12,color:S.txt2,background:S.accL,borderRadius:8,padding:"8px 12px"}}>
            💡 Banners appear as a full-width image header above each category in the customer shop view. Best size: 1200×300px landscape.
          </div>
          {cats.map(cat => (
            <div key={cat} style={{background:S.bg,borderRadius:12,padding:14,border:`1px solid ${S.bdr}`}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,marginBottom:6}}>{cat}</div>
                  {catBanners[cat] ? (
                    <div style={{position:"relative",borderRadius:10,overflow:"hidden",height:80}}>
                      <img src={catBanners[cat]} alt={cat} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                      <button onClick={()=>setCatBannersDB({...catBanners,[cat]:null})} style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,.6)",border:"none",borderRadius:6,padding:"3px 6px",cursor:"pointer",color:"#fff",fontSize:10,fontWeight:600,display:"flex",alignItems:"center",gap:3}}>
                        <X size={10}/>Remove
                      </button>
                    </div>
                  ) : (
                    <div style={{color:S.txt3,fontSize:12}}>No banner — categories show with a plain heading divider</div>
                  )}
                </div>
                <ImgUp value={catBanners[cat]||null} onChange={v=>setCatBannersDB({...catBanners,[cat]:v})} sz={64} folder="banners"/>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Backup & Restore Modal */}
      <Modal open={showBackup} onClose={() => setShowBackup(false)} title="Backup & Restore" sub="Export, import or clear your data" w={460}>
        <input ref={backupRef} type="file" accept=".json" onChange={importBackup} style={{display:"none"}}/>

        {backupMsg && (
          <div style={{padding:"10px 14px",borderRadius:10,marginBottom:14,background:backupMsg.startsWith("✅")?S.grnL:backupMsg.startsWith("❌")?S.redL:S.ambL,color:backupMsg.startsWith("✅")?S.grn:backupMsg.startsWith("❌")?S.red:S.amb,fontSize:13,fontWeight:600}}>
            {backupMsg}
          </div>
        )}

        {/* Sync status */}
        <div style={{background:dbStatus==="synced"?S.grnL:dbStatus==="error"?S.redL:S.ambL,border:`1px solid ${dbStatus==="synced"?S.grn+"25":dbStatus==="error"?S.red+"25":S.amb+"25"}`,borderRadius:12,padding:"12px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
          {dbStatus==="synced" && <><Wifi size={18} color={S.grn}/><div><div style={{fontSize:13,fontWeight:700,color:S.grn}}>Synced to Supabase ☁️</div><div style={{fontSize:11,color:S.txt2,marginTop:1}}>All data is safely stored in the cloud · Local cache: <strong>{getStorageInfo()}</strong></div></div></>}
          {(dbStatus==="saving"||dbStatus==="loading") && <><RefreshCw size={18} color={S.amb} style={{animation:"spin 1s linear infinite"}}/><div><div style={{fontSize:13,fontWeight:700,color:S.amb}}>Syncing…</div><div style={{fontSize:11,color:S.txt2,marginTop:1}}>Saving to Supabase cloud database</div></div></>}
          {dbStatus==="error" && <><WifiOff size={18} color={S.red}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:S.red}}>Sync Error</div><div style={{fontSize:11,color:S.txt2,marginTop:1}}>Working offline — data saved locally. <button onClick={loadFromDB} style={{color:S.acc,background:"none",border:"none",cursor:"pointer",fontFamily:S.f,fontSize:11,fontWeight:600,padding:0}}>Retry now</button></div></div></>}
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {/* Export */}
          <div style={{background:S.bg,borderRadius:12,padding:"14px 16px",border:`1px solid ${S.bdr}`}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
              <div>
                <div style={{fontSize:13,fontWeight:700,display:"flex",alignItems:"center",gap:6}}><Download size={15} color={S.acc}/>Export Backup</div>
                <div style={{fontSize:11,color:S.txt2,marginTop:2}}>Download all your data as a JSON file you can keep safe</div>
              </div>
              <Btn onClick={exportBackup} icon={<Download size={13}/>}>Export</Btn>
            </div>
            <div style={{marginTop:10,fontSize:11,color:S.txt3,display:"flex",gap:16,flexWrap:"wrap"}}>
              <span>📦 {articles.length} articles</span>
              <span>👤 {customers.length} customers</span>
              <span>📄 {challans.length} challans</span>
              <span>🛒 {orders.length} orders</span>
            </div>
          </div>

          {/* Import */}
          <div style={{background:S.bg,borderRadius:12,padding:"14px 16px",border:`1px solid ${S.bdr}`}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
              <div>
                <div style={{fontSize:13,fontWeight:700,display:"flex",alignItems:"center",gap:6}}><Upload size={15} color={S.pur}/>Restore Backup</div>
                <div style={{fontSize:11,color:S.txt2,marginTop:2}}>Import a previously exported JSON backup file</div>
              </div>
              <Btn v="secondary" onClick={() => backupRef.current?.click()} icon={<Upload size={13}/>}>Import</Btn>
            </div>
          </div>

          {/* Clear data */}
          <div style={{background:S.redL,borderRadius:12,padding:"14px 16px",border:`1px solid ${S.red}20`}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:S.red,display:"flex",alignItems:"center",gap:6}}><RotateCcw size={15}/>Reset All Data</div>
                <div style={{fontSize:11,color:S.txt2,marginTop:2}}>⚠️ Permanently delete everything. Export a backup first!</div>
              </div>
              <Btn v="danger" onClick={clearAllData}>Clear</Btn>
            </div>
          </div>
        </div>

        <div style={{marginTop:14,padding:"10px 12px",background:S.ambL,borderRadius:8,fontSize:11,color:S.amb,lineHeight:1.5}}>
          💡 <strong>Tip:</strong> Export a backup regularly and save the file to Google Drive, WhatsApp, or email so you never lose your data even if you change browsers or devices.
        </div>
      </Modal>

      {/* Article Modal */}
      <Modal open={showArtModal} onClose={() => setShowArtModal(false)} title={editArt ? "Edit Article" : "New Article"} sub="Details, sizes, colors & pricing" w={700}>
        <div className="form-grid2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Inp label="Article Name" placeholder="e.g. Premium Kurta" value={af.name} onChange={e => setAf({...af, name:e.target.value})}/>
          <Inp label="SKU ID" placeholder="e.g. SKU-001" value={af.skuId} onChange={e => setAf({...af, skuId:e.target.value})} iStyle={{fontFamily:S.fm}}/>
          <Sel label="Fabric Quality" options={FABRICS} placeholder="Select..." value={af.fabricQuality} onChange={e => setAf({...af, fabricQuality:e.target.value, customFabric:""})}/>
          <Sel label="Category" options={cats} placeholder="Select..." value={af.category} onChange={e => setAf({...af, category:e.target.value})}/>
        </div>
        {af.fabricQuality === "Other (Enter Manually)" && <div style={{marginTop:12}}><Inp label="Enter Fabric" placeholder="e.g. Georgette..." value={af.customFabric} onChange={e => setAf({...af, customFabric:e.target.value})}/></div>}
        <div style={{marginTop:18}}>
          <label style={{fontSize:10,fontWeight:700,color:S.txt3,letterSpacing:.8,textTransform:"uppercase",display:"block",marginBottom:6}}>Sizes</label>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{SIZES.map(s => <SizeChip key={s} label={s} on={af.selectedSizes.includes(s)} onClick={() => toggleSz(s)}/>)}</div>
        </div>
        <div style={{marginTop:18}}>
          <label style={{fontSize:10,fontWeight:700,color:S.txt3,letterSpacing:.8,textTransform:"uppercase",display:"block",marginBottom:6}}>Colors & Quantities</label>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            <Inp placeholder="Color name..." value={newCol} onChange={e => setNewCol(e.target.value)} onKeyDown={e => e.key === "Enter" && addColor()} icon={<Palette size={14}/>} cStyle={{flex:1}}/>
            <Btn onClick={addColor} disabled={!newCol.trim() || af.selectedSizes.length === 0} icon={<Plus size={14}/>} style={{alignSelf:"flex-end"}}>Add</Btn>
          </div>
          {af.selectedSizes.length === 0 && af.colors.length === 0 && (
            <div style={{padding:12,background:S.ambL,borderRadius:8,display:"flex",alignItems:"center",gap:8}}>
              <AlertTriangle size={14} color={S.amb}/><span style={{fontSize:12,color:S.amb}}>Select sizes first, then add colors.</span>
            </div>
          )}
          {af.colors.map((c,ci) => (
            <div key={ci} style={{background:S.bg,borderRadius:10,border:`1px solid ${S.bdr}`,padding:12,marginBottom:10}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:10,flexWrap:"wrap"}}>
                <ImgUp value={c.image} onChange={img => setColImg(ci, img)} sz={64} folder="colors"/>
                <div style={{flex:1,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <ColorDot name={c.name}/>
                  <button onClick={() => rmColor(ci)} style={{background:S.redL,border:"none",borderRadius:6,padding:4,cursor:"pointer",display:"flex",color:S.red}}><Trash2 size={13}/></button>
                </div>
              </div>
              {af.selectedSizes.length > 0 && (
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {af.selectedSizes.map(sz => (
                    <div key={sz} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,minWidth:62}}>
                      <span style={{fontSize:10,fontWeight:700,color:S.acc}}>{sz}</span>
                      <input type="number" min="0" placeholder="Qty" value={c.sizes[sz]?.qty || ""} onChange={e => updVal(ci,sz,"qty",e.target.value)} style={{width:"100%",textAlign:"center",background:S.card,border:`1px solid ${S.bdr}`,borderRadius:6,padding:"7px 2px",color:S.txt,fontFamily:S.fm,fontSize:12,fontWeight:600,outline:"none"}}/>
                      <div style={{position:"relative",width:"100%"}}>
                        <span style={{position:"absolute",left:6,top:"50%",transform:"translateY(-50%)",color:S.txt3,fontSize:10}}>₹</span>
                        <input type="number" min="0" placeholder="Price" value={c.sizes[sz]?.price || ""} onChange={e => updVal(ci,sz,"price",e.target.value)} style={{width:"100%",textAlign:"center",background:S.card,border:`1px solid ${S.bdr}`,borderRadius:6,padding:"7px 2px 7px 16px",color:S.txt,fontFamily:S.fm,fontSize:11,outline:"none"}}/>
                      </div>
                    </div>
                  ))}
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,minWidth:48}}>
                    <span style={{fontSize:10,fontWeight:700,color:S.grn}}>TTL</span>
                    <div style={{padding:"7px 4px",fontSize:14,fontWeight:800,color:S.grn,fontFamily:S.fm}}>{Object.values(c.sizes).reduce((s,v) => s + (v.qty||0), 0)}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:18,paddingTop:14,borderTop:`1px solid ${S.bdr}`}}>
          <Btn v="secondary" onClick={() => setShowArtModal(false)}>Cancel</Btn>
          <Btn onClick={saveArt} disabled={!af.skuId || !af.name || !af.category || (!af.fabricQuality || (af.fabricQuality === "Other (Enter Manually)" && !af.customFabric.trim()))} icon={<Check size={14}/>}>{editArt ? "Update" : "Save"}</Btn>
        </div>
      </Modal>

      {/* Categories Modal */}
      <Modal open={showCats} onClose={() => setShowCats(false)} title="Manage Categories" w={420}>
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          <Inp placeholder="New category..." value={newCat} onChange={e => setNewCat(e.target.value)} onKeyDown={e => e.key === "Enter" && addCat()} cStyle={{flex:1}}/>
          <Btn onClick={addCat} disabled={!newCat.trim()} icon={<Plus size={14}/>} style={{alignSelf:"flex-end"}}>Add</Btn>
        </div>
        {cats.map((c,i) => <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 12px",background:S.bg,borderRadius:8,border:`1px solid ${S.bdr}`,marginBottom:5}}><span style={{fontSize:13,fontWeight:600}}>{c}</span><button onClick={() => setCatsDB(cats.filter(x => x !== c))} style={{background:S.redL,border:"none",borderRadius:6,padding:4,cursor:"pointer",display:"flex",color:S.red}}><Trash2 size={13}/></button></div>)}
      </Modal>

      {/* Customer Modal */}
      <Modal open={showCustModal} onClose={() => setShowCustModal(false)} title={editCust ? "Edit Customer" : "Add Customer"} w={600}>
        <div className="form-grid2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Inp label="Full Name *" icon={<Users size={13}/>} placeholder="Name" value={cf.name} onChange={e => setCf({...cf, name:e.target.value})}/>
          <Inp label="Phone *" icon={<Phone size={13}/>} placeholder="+91..." value={cf.phone} onChange={e => setCf({...cf, phone:e.target.value})}/>
          <Inp label="WhatsApp" icon={<Phone size={13}/>} placeholder="+91..." value={cf.whatsapp} onChange={e => setCf({...cf, whatsapp:e.target.value})}/>
          <Inp label="Email" icon={<Mail size={13}/>} placeholder="email@..." value={cf.email} onChange={e => setCf({...cf, email:e.target.value})}/>
          <Inp label="DOB" icon={<Calendar size={13}/>} type="date" value={cf.dob} onChange={e => setCf({...cf, dob:e.target.value})}/>
          <Inp label="Agent Name" icon={<Users size={13}/>} placeholder="Agent" value={cf.agent} onChange={e => setCf({...cf, agent:e.target.value})}/>
          <Inp label="Address" icon={<MapPin size={13}/>} placeholder="Street" value={cf.address} onChange={e => setCf({...cf, address:e.target.value})} cStyle={{gridColumn:"1/-1"}}/>
          <Inp label="City" placeholder="City" value={cf.city} onChange={e => setCf({...cf, city:e.target.value})}/>
          <Sel label="State" options={STATES_IN} placeholder="Select..." value={cf.state} onChange={e => setCf({...cf, state:e.target.value})}/>
          <Inp label="Pincode" placeholder="XXXXXX" value={cf.pincode} onChange={e => setCf({...cf, pincode:e.target.value})}/>
          <Inp label="Company" icon={<Building size={13}/>} placeholder="Company" value={cf.company} onChange={e => setCf({...cf, company:e.target.value})}/>
          {/* GST Auto-fill field */}
          <div style={{gridColumn:"1/-1"}}>
            <label style={{fontSize:10,fontWeight:700,color:S.txt3,letterSpacing:.8,textTransform:"uppercase",display:"block",marginBottom:3}}>GST Number</label>
            <div style={{display:"flex",alignItems:"center",background:S.bg,border:`1.5px solid ${gstStatus?.valid===false?S.red:gstStatus?.valid?S.grn:S.bdr}`,borderRadius:8,padding:"0 10px",transition:"border-color .2s"}}>
              <input
                placeholder="Enter 15-digit GSTIN"
                value={cf.gst}
                maxLength={15}
                onChange={e => gstAutoFill(e.target.value, setCf, setGstStatus)}
                style={{flex:1,background:"transparent",border:"none",outline:"none",color:S.txt,fontFamily:S.fm,fontSize:13,padding:"9px 0",textTransform:"uppercase",letterSpacing:1}}
              />
              {gstStatus?.valid === true && <CheckCircle size={14} color={S.grn} style={{flexShrink:0}}/>}
              {gstStatus?.valid === false && <XCircle size={14} color={S.red} style={{flexShrink:0}}/>}
            </div>
            {/* Info extracted from GST */}
            {gstStatus?.valid === true && (
              <div style={{marginTop:6,padding:"8px 12px",background:S.grnL,borderRadius:8,border:`1px solid ${S.grn}30`,fontSize:12}}>
                <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
                  {gstStatus.state && <span>📍 <strong>State:</strong> {gstStatus.state} <span style={{color:S.grn,fontSize:10}}>(auto-filled)</span></span>}
                  {gstStatus.entityType && <span>🏢 <strong>Type:</strong> {gstStatus.entityType}</span>}
                  {gstStatus.pan && <span>🪪 <strong>PAN:</strong> {gstStatus.pan}</span>}
                </div>
              </div>
            )}
            {gstStatus?.valid === false && <div style={{fontSize:11,color:S.red,marginTop:4}}>⚠️ Invalid GST format — please check</div>}
            {gstStatus?.state && gstStatus?.valid !== false && cf.gst.length < 15 && (
              <div style={{fontSize:11,color:S.txt2,marginTop:4}}>📍 State detected: <strong>{gstStatus.state}</strong></div>
            )}
          </div>
          <Inp label="Transport Name" icon={<Truck size={13}/>} placeholder="Transport" value={cf.transport} onChange={e => setCf({...cf, transport:e.target.value})}/>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:18,paddingTop:14,borderTop:`1px solid ${S.bdr}`}}>
          <Btn v="secondary" onClick={() => setShowCustModal(false)}>Cancel</Btn>
          <Btn onClick={saveCust} disabled={!cf.name || !cf.phone} icon={<Check size={14}/>}>{editCust ? "Update" : "Add"}</Btn>
        </div>
      </Modal>

      {/* Customer Registration Form */}
      <Modal open={showCustForm} onClose={() => setShowCustForm(false)} title="Customer Registration Form" w={480}>
        <div style={{background:"#fff",borderRadius:12,padding:20,border:`1px solid ${S.bdr}`}}>
          <div style={{textAlign:"center",marginBottom:16}}>
            <div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,#4361ee,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 8px",color:"#fff"}}><Package size={20}/></div>
            <div style={{fontSize:17,fontWeight:800}}>Register With Us</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:9}}>
            {[{l:"Name *",k:"name",ph:"Full name"},{l:"Phone *",k:"phone",ph:"+91..."},{l:"WhatsApp",k:"whatsapp",ph:"+91..."},{l:"Email",k:"email",ph:"email@...",t:"email"},{l:"DOB",k:"dob",t:"date"},{l:"Address",k:"address",ph:"Street"},{l:"City",k:"city",ph:"City"},{l:"Pincode",k:"pincode",ph:"XXXXXX"},{l:"Company",k:"company",ph:"Company"},{l:"GST",k:"gst",ph:"GSTIN"},{l:"Transport",k:"transport",ph:"Transport name"}].map(f => (
              <div key={f.k} style={{display:"flex",flexDirection:"column",gap:3}}>
                <label style={{fontSize:11,fontWeight:600,color:"#374151"}}>{f.l}</label>
                <input type={f.t||"text"} placeholder={f.ph} value={extF[f.k]} onChange={e => setExtF({...extF,[f.k]:e.target.value})} style={{border:"1px solid #d1d5db",borderRadius:8,padding:"9px 10px",background:"#f9fafb",fontFamily:S.f,fontSize:13,color:"#1a1d26",outline:"none"}}/>
              </div>
            ))}
            <div style={{display:"flex",flexDirection:"column",gap:3}}><label style={{fontSize:11,fontWeight:600,color:"#374151"}}>State</label><select value={extF.state} onChange={e => setExtF({...extF, state:e.target.value})} style={{border:"1px solid #d1d5db",borderRadius:8,padding:"9px 10px",background:"#f9fafb",fontFamily:S.f,fontSize:13,outline:"none"}}><option value="">Select...</option>{STATES_IN.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          </div>
          <button onClick={extSubmit} disabled={!extF.name || !extF.phone} style={{width:"100%",marginTop:16,padding:"11px 0",background:extF.name&&extF.phone?S.acc:"#d1d5db",color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:extF.name&&extF.phone?"pointer":"not-allowed",fontFamily:S.f}}>Submit</button>
        </div>
      </Modal>

      {/* Company Settings Modal */}
      <Modal open={showCompany} onClose={() => { setCoDB(co); setLogoDb(companyLogo); setShowCompany(false); }} title="Company Settings" sub="Logo & details for challan PDF" w={480}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:14}}><ImgUp value={companyLogo} onChange={v => setCompanyLogo(v)} sz={90} folder="logos"/></div>
        <div className="form-grid2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Inp label="Company Name" value={co.name} onChange={e => setCo({...co, name:e.target.value})} placeholder="Your Company" cStyle={{gridColumn:"1/-1"}}/>
          <Inp label="Address" value={co.address} onChange={e => setCo({...co, address:e.target.value})} placeholder="Address" cStyle={{gridColumn:"1/-1"}}/>
          <Inp label="Phone" icon={<Phone size={13}/>} value={co.phone} onChange={e => setCo({...co, phone:e.target.value})} placeholder="+91..."/>
          <Inp label="Email" icon={<Mail size={13}/>} value={co.email} onChange={e => setCo({...co, email:e.target.value})} placeholder="email@..."/>
          <Inp label="GSTIN" value={co.gstin} onChange={e => setCo({...co, gstin:e.target.value})} placeholder="GST Number" iStyle={{fontFamily:S.fm,textTransform:"uppercase"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",marginTop:18}}><Btn onClick={() => { setCoDB(co); setLogoDb(companyLogo); setShowCompany(false); }} icon={<Check size={14}/>}>Save to Cloud</Btn></div>
      </Modal>

      {/* ═══ CREATE / EDIT CHALLAN MODAL (Simplified UI) ═══ */}
      <Modal open={showChModal} onClose={() => { setShowChModal(false); setEditCh(null); setChf({...blankCh}); }} title={editCh ? `Edit ${editCh.number}` : "New Delivery Challan"} sub="Select customer, add articles & dispatch quantities" w={720}>

        {/* Step 1: Customer */}
        <div style={{marginBottom:16}}>
          <label style={{fontSize:10,fontWeight:700,color:S.txt3,letterSpacing:.8,textTransform:"uppercase",display:"block",marginBottom:6}}>① Customer</label>
          <Sel options={customers.map(c => ({v:c.id, l:`${c.name} — ${c.phone}`}))} placeholder="Choose customer..." value={chf.customerId} onChange={e => setChf({...chf, customerId:e.target.value})}/>
          {selCust && (
            <div style={{background:S.accL,borderRadius:10,padding:"10px 14px",marginTop:8,display:"flex",flexWrap:"wrap",gap:12,fontSize:12}}>
              <span style={{fontWeight:700,color:S.acc}}>{selCust.name}</span>
              {selCust.transport && <span style={{color:S.txt2}}>🚚 {selCust.transport}</span>}
              {selCust.gst && <span style={{color:S.txt2,fontFamily:S.fm}}>GST: {selCust.gst}</span>}
              {selCust.agent && <span style={{color:S.txt2}}>Agent: {selCust.agent}</span>}
            </div>
          )}
        </div>

        {/* Step 2: LR + Remarks */}
        <div className="form-grid2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
          <Inp label="LR Number" icon={<Truck size={13}/>} placeholder="LR/GR number" value={chf.lrNumber} onChange={e => setChf({...chf, lrNumber:e.target.value})}/>
          <Inp label="Remarks" placeholder="Notes..." value={chf.remarks} onChange={e => setChf({...chf, remarks:e.target.value})}/>
        </div>

        {/* Step 3: Items */}
        <div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <label style={{fontSize:10,fontWeight:700,color:S.txt3,letterSpacing:.8,textTransform:"uppercase"}}>② Dispatch Items</label>
            <Btn sz="sm" icon={<Plus size={13}/>} onClick={addChItem}>Add Item</Btn>
          </div>

          {chf.items.length === 0 && (
            <div style={{padding:24,background:S.bg,borderRadius:10,textAlign:"center",color:S.txt2,fontSize:13,border:`2px dashed ${S.bdr}`}}>
              <Truck size={24} style={{margin:"0 auto 8px",display:"block",color:S.txt3}}/> Click "Add Item" to select articles
            </div>
          )}

          {chf.items.map((it, ii) => {
            const art = getChArt(it);
            const col = getChCol(it);
            const availSizes = col ? art.selectedSizes.filter(sz => (col.sizes[sz]?.qty || 0) > 0) : [];
            return (
              <div key={ii} style={{background:S.bg,borderRadius:12,border:`1px solid ${S.bdr}`,padding:14,marginBottom:10}}>
                {/* Header */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    {col?.image && <img src={col.image} alt="" style={{width:40,height:40,borderRadius:8,objectFit:"cover",border:`1px solid ${S.bdr}`}}/>}
                    <span style={{fontSize:14,fontWeight:700,color:S.acc}}>Item #{ii+1}</span>
                    {art && col && <ColorDot name={col.name}/>}
                    {art && <span style={{fontSize:13,fontWeight:600,color:S.txt}}>{art.name}</span>}
                  </div>
                  <button onClick={() => rmChItem(ii)} style={{background:S.redL,border:"none",borderRadius:6,padding:6,cursor:"pointer",display:"flex",color:S.red}}><Trash2 size={15}/></button>
                </div>

                {/* Article + Color selects */}
                <div className="form-grid2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:col && availSizes.length > 0 ? 12 : 0}}>
                  <SearchSel label="Article" options={chArts.filter(a => editCh ? true : artTot(a) > 0).map(a => ({v:a.id, l:`${a.name} (${a.skuId})`}))} placeholder="Search article..." value={it.articleId} onChange={v => updChItem(ii,"articleId",v)}/>
                  {art && <Sel label="Color" options={art.colors.map((c,ci) => ({v:String(ci), l:c.name}))} placeholder="Select color..." value={it.colorIdx} onChange={e => updChItem(ii,"colorIdx",e.target.value)}/>}
                </div>

                {/* Size qty + price inputs */}
                {col && availSizes.length > 0 && (
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:S.txt3,textTransform:"uppercase",marginBottom:10}}>Qty & Rate per size</div>
                    <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                      {availSizes.map(sz => {
                        const avail = col.sizes[sz]?.qty || 0;
                        const defaultPrice = col.sizes[sz]?.price || 0;
                        const customPrice = it.prices?.[sz];
                        const qty = it.sizes[sz] || 0;
                        return (
                          <div key={sz} style={{background:S.card,borderRadius:12,border:`2px solid ${qty > 0 ? S.acc : S.bdr}`,padding:"10px 12px",textAlign:"center",minWidth:88,transition:"border-color .15s"}}>
                            <div style={{fontSize:14,fontWeight:800,color:qty>0?S.acc:S.txt2,marginBottom:4}}>{sz}</div>
                            <input type="number" min="0" max={avail} placeholder="0" value={it.sizes[sz] || ""} onChange={e => updChQty(ii,sz,Math.min(Number(e.target.value)||0,avail))} style={{width:"100%",textAlign:"center",background:"transparent",border:"none",outline:"none",color:S.txt,fontFamily:S.fm,fontSize:22,fontWeight:800,padding:"2px 0"}}/>
                            <div style={{fontSize:11,color:S.txt3,marginBottom:6}}>/ {avail} pcs</div>
                            <div style={{borderTop:`1px dashed ${S.bdr}`,paddingTop:6,display:"flex",alignItems:"center",justifyContent:"center",gap:2}}>
                              <span style={{fontSize:12,color:S.txt3,fontWeight:600}}>₹</span>
                              <input type="number" min="0" placeholder={defaultPrice||"Rate"} value={customPrice !== undefined ? customPrice : (defaultPrice || "")} onChange={e => updChPrice(ii,sz,e.target.value)} style={{width:"100%",textAlign:"center",background:"transparent",border:"none",outline:"none",color:S.grn,fontFamily:S.fm,fontSize:14,fontWeight:700,padding:0}}/>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary bar */}
        {chTotQty > 0 && (
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",background:S.accL,borderRadius:10,marginTop:8,border:`1px solid ${S.acc}20`}}>
            <span style={{fontSize:13,fontWeight:600,color:S.txt2}}>Summary</span>
            <div style={{display:"flex",gap:20}}>
              <div style={{textAlign:"center"}}><div style={{fontSize:9,fontWeight:700,color:S.txt3,textTransform:"uppercase"}}>Total Qty</div><div style={{fontSize:18,fontWeight:800,color:S.acc,fontFamily:S.fm}}>{chTotQty}</div></div>
              <div style={{textAlign:"center"}}><div style={{fontSize:9,fontWeight:700,color:S.txt3,textTransform:"uppercase"}}>Total Amt</div><div style={{fontSize:18,fontWeight:800,color:S.grn,fontFamily:S.fm}}>{fmtR(chTotAmt)}</div></div>
            </div>
          </div>
        )}

        <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:16,paddingTop:14,borderTop:`1px solid ${S.bdr}`}}>
          <Btn v="secondary" onClick={() => { setShowChModal(false); setEditCh(null); setChf({...blankCh}); setEditChArts(null); }}>Cancel</Btn>
          <Btn onClick={saveChallan} disabled={!chf.customerId || chf.items.length === 0 || chTotQty === 0} icon={<Check size={14}/>}>
            {editCh ? "Update Challan" : "Create & Deduct Stock"}
          </Btn>
        </div>
      </Modal>

      {/* Stock View Modal */}
      <Modal open={showStockView} onClose={()=>setShowStockView(false)} title="Available Stock" sub="Live inventory across all articles, colors and sizes" w={800}>
        <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
          <div style={{padding:"8px 14px",background:S.grnL,borderRadius:8,fontSize:12,fontWeight:700,color:S.grn}}>{articles.length} Articles</div>
          <div style={{padding:"8px 14px",background:S.accL,borderRadius:8,fontSize:12,fontWeight:700,color:S.acc}}>{totalPcs} Total Pcs</div>
          <div style={{padding:"8px 14px",background:S.ambL,borderRadius:8,fontSize:12,fontWeight:700,color:S.amb}}>{lowStock} Low Stock</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:"65vh",overflowY:"auto"}}>
          {[...new Set(articles.map(a=>a.category))].map(cat => {
            const catArts = articles.filter(a=>a.category===cat);
            return (
              <div key={cat}>
                <div style={{fontSize:11,fontWeight:800,color:S.txt3,textTransform:"uppercase",letterSpacing:1,padding:"6px 0 4px",borderBottom:`2px solid ${S.acc}`,marginBottom:6}}>{cat}</div>
                {catArts.map(a => {
                  const tot = artTot(a);
                  return (
                    <div key={a.id} style={{background:S.bg,borderRadius:10,padding:12,border:`1px solid ${tot===0?S.red+"40":S.bdr}`,marginBottom:6}}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                        <div>
                          <span style={{fontSize:13,fontWeight:700}}>{a.name}</span>
                          <span style={{fontSize:10,color:S.txt3,fontFamily:S.fm,marginLeft:8}}>{a.skuId}</span>
                          <span style={{fontSize:10,color:S.txt2,marginLeft:8}}>{a.fabricQuality}</span>
                        </div>
                        <span style={{fontSize:14,fontWeight:800,color:tot===0?S.red:tot<=10?S.amb:S.grn}}>{tot} pcs</span>
                      </div>
                      {a.colors.map((c,ci) => {
                        const cTot = Object.values(c.sizes).reduce((s,v)=>s+(v.qty||0),0);
                        if (cTot === 0) return null;
                        return (
                          <div key={ci} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,padding:"6px 8px",background:S.card,borderRadius:8,flexWrap:"wrap"}}>
                            {c.image && <img src={c.image} alt="" style={{width:28,height:28,borderRadius:5,objectFit:"cover"}}/>}
                            <ColorDot name={c.name}/>
                            <div style={{display:"flex",gap:4,flexWrap:"wrap",flex:1}}>
                              {a.selectedSizes.map(sz => {
                                const q = c.sizes[sz]?.qty||0;
                                if (q===0) return null;
                                return <span key={sz} style={{fontSize:11,fontWeight:700,background:q<=3?S.redL:q<=5?S.ambL:S.grnL,color:q<=3?S.red:q<=5?S.amb:S.grn,padding:"2px 8px",borderRadius:6}}>{sz}: {q}</span>;
                              })}
                            </div>
                            <span style={{fontSize:11,fontWeight:700,color:S.txt2}}>{cTot} pcs</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </Modal>

      {/* Create Manual Order Modal */}
      <Modal open={showCreateOrder} onClose={()=>{setShowCreateOrder(false);setEditingOrder(null);setOrderForm2(blankOF);}} title={editingOrder?"Edit Order":"Create Customer Order"} sub="Create a proforma order to share with customer — no stock deducted" w={720}>
        <div style={{background:S.purL,borderRadius:8,padding:"8px 12px",marginBottom:14,fontSize:12,color:S.pur,fontWeight:600}}>
          📋 This creates a shareable order slip. Stock is NOT deducted. Use Challans to deduct stock.
        </div>
        <div style={{marginBottom:14}}>
          <Sel label="① Customer" options={customers.map(c=>({v:c.id,l:`${c.name} — ${c.phone}`}))} placeholder="Choose customer..." value={orderForm2.customerId} onChange={e=>setOrderForm2({...orderForm2,customerId:e.target.value})}/>
        </div>
        <Inp label="Remarks / Note" placeholder="e.g. Sample order, Approval pending..." value={orderForm2.remarks} onChange={e=>setOrderForm2({...orderForm2,remarks:e.target.value})} cStyle={{marginBottom:14}}/>
        <div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <label style={{fontSize:10,fontWeight:700,color:S.txt3,letterSpacing:.8,textTransform:"uppercase"}}>② Items</label>
            <Btn sz="sm" icon={<Plus size={13}/>} onClick={()=>setOrderForm2({...orderForm2,items:[...orderForm2.items,{articleId:"",colorIdx:"",sizes:{}}]})}>Add Item</Btn>
          </div>
          {orderForm2.items.length===0 && <div style={{padding:24,background:S.bg,borderRadius:10,textAlign:"center",color:S.txt2,fontSize:13,border:`2px dashed ${S.bdr}`}}><Package size={24} style={{margin:"0 auto 8px",display:"block",color:S.txt3}}/>Click "Add Item" to add articles</div>}
          {orderForm2.items.map((it,ii)=>{
            const art = articles.find(a=>a.id===it.articleId);
            const col = art?.colors[Number(it.colorIdx)];
            return (
              <div key={ii} style={{background:S.bg,borderRadius:12,border:`1px solid ${S.bdr}`,padding:14,marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                  <span style={{fontSize:13,fontWeight:700,color:S.acc}}>Item #{ii+1}</span>
                  <button onClick={()=>setOrderForm2({...orderForm2,items:orderForm2.items.filter((_,j)=>j!==ii)})} style={{background:S.redL,border:"none",borderRadius:6,padding:5,cursor:"pointer",display:"flex",color:S.red}}><Trash2 size={13}/></button>
                </div>
                <div className="form-grid2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:col?12:0}}>
                  <SearchSel label="Article" options={articles.map(a=>({v:a.id,l:`${a.name} (${a.skuId})`}))} placeholder="Search article..." value={it.articleId} onChange={v=>{const ni=[...orderForm2.items];ni[ii]={articleId:v,colorIdx:"",sizes:{}};setOrderForm2({...orderForm2,items:ni});}}/>
                  {art && <Sel label="Color" options={art.colors.map((c,ci)=>({v:String(ci),l:c.name}))} placeholder="Select color..." value={it.colorIdx} onChange={e=>{const ni=[...orderForm2.items];ni[ii]={...ni[ii],colorIdx:e.target.value,sizes:{}};setOrderForm2({...orderForm2,items:ni});}}/>}
                </div>
                {col && art && (
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {art.selectedSizes.map(sz=>{
                      const qty = it.sizes[sz]||0;
                      const defaultPrice = col.sizes[sz]?.price||0;
                      const customPrice = it.prices?.[sz];
                      const displayPrice = customPrice !== undefined ? customPrice : defaultPrice;
                      return (
                        <div key={sz} style={{background:S.card,borderRadius:10,border:`2px solid ${qty>0?S.pur:S.bdr}`,padding:"8px 10px",textAlign:"center",minWidth:80}}>
                          <div style={{fontSize:13,fontWeight:800,color:qty>0?S.pur:S.txt2,marginBottom:4}}>{sz}</div>
                          <input type="number" min="0" placeholder="0" value={it.sizes[sz]||""} onChange={e=>{const ni=[...orderForm2.items];ni[ii]={...ni[ii],sizes:{...ni[ii].sizes,[sz]:Math.max(0,Number(e.target.value)||0)}};setOrderForm2({...orderForm2,items:ni});}} style={{width:"100%",textAlign:"center",background:"transparent",border:"none",outline:"none",color:S.txt,fontFamily:S.fm,fontSize:20,fontWeight:800,padding:"2px 0"}}/>
                          <div style={{borderTop:`1px dashed ${S.bdr}`,paddingTop:5,marginTop:4,display:"flex",alignItems:"center",justifyContent:"center",gap:2}}>
                            <span style={{fontSize:11,color:S.txt3,fontWeight:600}}>₹</span>
                            <input type="number" min="0" placeholder={defaultPrice||"Rate"} value={displayPrice||""} onChange={e=>{const ni=[...orderForm2.items];ni[ii]={...ni[ii],prices:{...ni[ii].prices,[sz]:Math.max(0,Number(e.target.value)||0)}};setOrderForm2({...orderForm2,items:ni});}} style={{width:"100%",textAlign:"center",background:"transparent",border:"none",outline:"none",color:S.grn,fontFamily:S.fm,fontSize:13,fontWeight:700,padding:0}}/>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {orderForm2.items.some(it=>Object.values(it.sizes).some(q=>q>0)) && (
          <div style={{padding:"10px 14px",background:S.purL,borderRadius:10,marginTop:8,display:"flex",justifyContent:"flex-end",gap:20}}>
            <div style={{textAlign:"center"}}><div style={{fontSize:9,fontWeight:700,color:S.txt3,textTransform:"uppercase"}}>Total Qty</div><div style={{fontSize:18,fontWeight:800,color:S.pur,fontFamily:S.fm}}>{orderForm2.items.reduce((s,it)=>s+Object.values(it.sizes).reduce((ss,q)=>ss+q,0),0)}</div></div>
            <div style={{textAlign:"center"}}><div style={{fontSize:9,fontWeight:700,color:S.txt3,textTransform:"uppercase"}}>Total Amt</div><div style={{fontSize:18,fontWeight:800,color:S.grn,fontFamily:S.fm}}>{fmtR(orderForm2.items.reduce((s,it)=>{const art=articles.find(a=>a.id===it.articleId);const col=art?.colors[Number(it.colorIdx)];return s+Object.entries(it.sizes).reduce((ss,[sz,q])=>{const p=(it.prices?.[sz]!==undefined&&it.prices[sz]!=="")? Number(it.prices[sz]):(col?.sizes[sz]?.price||0);return ss+q*p;},0);},0))}</div></div>
          </div>
        )}
        <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:16,paddingTop:14,borderTop:`1px solid ${S.bdr}`}}>
          <Btn v="secondary" onClick={()=>{setShowCreateOrder(false);setEditingOrder(null);setOrderForm2(blankOF);}}>Cancel</Btn>
          <Btn onClick={saveManualOrder} disabled={!orderForm2.customerId||orderForm2.items.length===0} icon={<Check size={14}/>}>{editingOrder?"Update Order":"Save Order"}</Btn>
          <Btn onClick={()=>saveManualOrder(true)} disabled={!orderForm2.customerId||orderForm2.items.length===0} icon={<Printer size={14}/>} style={{background:`linear-gradient(135deg,${S.pur},#9333ea)`}}>{editingOrder?"Update & Print":"Save & Print"}</Btn>
        </div>
      </Modal>

      {/* Convert Order to Challan Modal */}
      <Modal open={showConvertOrder} onClose={()=>setShowConvertOrder(false)} title="Convert to Delivery Challan" sub="Select which items to include — stock will be deducted" w={580}>
        {convertingOrder && <>
          <div style={{background:S.grnL,borderRadius:10,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:10,fontSize:12}}>
            <FileText size={16} color={S.grn}/>
            <div><strong>{convertingOrder.number}</strong> · {convertingOrder.customer?.name} · {convertingOrder.totalQty} pcs · {fmtR(convertingOrder.totalAmt)}</div>
          </div>
          <div style={{fontSize:11,fontWeight:700,color:S.txt3,textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Select Items to Include</div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
            {convertingOrder.items.map((it,i) => {
              const checked = !!convertSelItems[i];
              return (
                <div key={i} onClick={()=>setConvertSelItems(prev=>({...prev,[i]:!prev[i]}))} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:checked?S.grnL:S.bg,borderRadius:10,border:`2px solid ${checked?S.grn:S.bdr}`,cursor:"pointer",transition:"all .15s"}}>
                  <div style={{width:22,height:22,borderRadius:6,border:`2px solid ${checked?S.grn:S.bdr}`,background:checked?S.grn:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {checked && <Check size={13} color="#fff"/>}
                  </div>
                  {it.colorImage && <img src={it.colorImage} alt="" style={{width:40,height:40,borderRadius:8,objectFit:"cover",flexShrink:0}}/>}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:700}}>{it.articleName}</div>
                    <div style={{fontSize:11,color:S.txt2,marginTop:2}}>{it.colorName} · {it.sizes.map(sz=>`${sz.size}×${sz.qty}`).join(", ")}</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:12,fontWeight:700,color:S.grn}}>{fmtR(it.sizes.reduce((s,sz)=>s+sz.amount,0))}</div>
                    <div style={{fontSize:11,color:S.txt2}}>{it.sizes.reduce((s,sz)=>s+sz.qty,0)} pcs</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:S.accL,borderRadius:10,marginBottom:14}}>
            <span style={{fontSize:12,color:S.txt2}}>{Object.values(convertSelItems).filter(Boolean).length} of {convertingOrder.items.length} items selected</span>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{const a={};convertingOrder.items.forEach((_,i)=>a[i]=true);setConvertSelItems(a);}} style={{fontSize:11,fontWeight:600,color:S.acc,background:"none",border:"none",cursor:"pointer",fontFamily:S.f}}>Select All</button>
              <button onClick={()=>setConvertSelItems({})} style={{fontSize:11,fontWeight:600,color:S.txt2,background:"none",border:"none",cursor:"pointer",fontFamily:S.f}}>Clear</button>
            </div>
          </div>
          <div style={{background:S.ambL,borderRadius:8,padding:"8px 12px",marginBottom:14,fontSize:11,color:S.amb}}>
            ⚠️ Stock will be deducted when challan is saved. You can edit quantities in the challan form.
          </div>
          <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
            <Btn v="secondary" onClick={()=>setShowConvertOrder(false)}>Cancel</Btn>
            <Btn onClick={doConvertToChallan} disabled={Object.values(convertSelItems).filter(Boolean).length===0} icon={<FileText size={14}/>}>Open in Challan Form</Btn>
          </div>
        </>}
      </Modal>

      <ConfirmDialog
        open={!!confirmDlg}
        title={confirmDlg?.title}
        message={confirmDlg?.message}
        onYes={() => { confirmDlg?.onYes(); setConfirmDlg(null); }}
        onNo={() => setConfirmDlg(null)}
      />

      <ChatBot articles={articles} co={co} chatMsgs={chatMsgs} setChatMsgs={setChatMsgs} chatOpen={chatOpen} setChatOpen={setChatOpen} chatInput={chatInput} setChatInput={setChatInput} chatLoading={chatLoading} setChatLoading={setChatLoading} chatEndRef={chatEndRef} chatInputRef={chatInputRef} buildSystemPrompt={buildSystemPrompt}/>
    </div>
  );
}
