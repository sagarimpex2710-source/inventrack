import { useState, useRef } from "react";
import { Package, Users, FileText, Plus, Trash2, Edit3, Search, X, Check, ChevronRight, Settings, Camera, Palette, AlertTriangle, Eye, ShoppingBag, Phone, Mail, Calendar, MapPin, Building, Share2, Copy, Cake, Grid3X3, Truck, Printer } from "lucide-react";

const uid = () => Math.random().toString(36).substr(2, 9);
const SIZES = ["S","M","L","XL","XXL","3XL","4XL","5XL","6XL","7XL"];
const DEFAULT_CATS = ["Kurta","Pant","Kurta Pant","Dupatta Set","Top","Dresses"];
const FABRICS = ["Cotton","Mix Blend","Viscous","Other (Enter Manually)"];
const STATES_IN = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Chandigarh","Jammu & Kashmir","Ladakh","Puducherry"];

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

/* ── Reusable Components ── */
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

const Modal = ({open,onClose,title,sub,children,w=640}) => {
  if (!open) return null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"flex-start",justifyContent:"center",background:"rgba(0,0,0,.35)",backdropFilter:"blur(4px)",paddingTop:30,overflowY:"auto"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:S.card,borderRadius:16,border:`1px solid ${S.bdr}`,width:"96%",maxWidth:w,boxShadow:"0 20px 60px rgba(0,0,0,.12)",marginBottom:40}}>
        <div style={{padding:"16px 20px",borderBottom:`1px solid ${S.bdr}`,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,background:S.card,borderRadius:"16px 16px 0 0",zIndex:1}}>
          <div><h3 style={{margin:0,fontSize:15,fontWeight:700}}>{title}</h3>{sub && <p style={{margin:"2px 0 0",fontSize:11,color:S.txt2}}>{sub}</p>}</div>
          <button onClick={onClose} style={{background:S.bg,border:"none",borderRadius:8,padding:6,cursor:"pointer",display:"flex",color:S.txt2}}><X size={16}/></button>
        </div>
        <div style={{padding:"18px 20px"}}>{children}</div>
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

const ImgUp = ({value,onChange,sz=80}) => {
  const ref = useRef();
  return (
    <div style={{position:"relative"}}>
      <div onClick={()=>ref.current?.click()} style={{width:sz,height:sz,borderRadius:10,border:`2px dashed ${value?S.acc:S.bdr}`,background:value?"transparent":S.bg,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden",flexShrink:0}}>
        {value ? <img src={value} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <div style={{textAlign:"center",color:S.txt3}}><Camera size={20}/><div style={{fontSize:9,marginTop:2}}>Upload</div></div>}
      </div>
      <input ref={ref} type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>onChange(ev.target.result);r.readAsDataURL(f);}} style={{display:"none"}}/>
      {value && <button onClick={e=>{e.stopPropagation();onChange(null);}} style={{position:"absolute",top:-6,right:-6,width:20,height:20,borderRadius:"50%",background:S.red,border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:0}}><X size={10} color="#fff"/></button>}
    </div>
  );
};

const Stat = ({icon,label,value,color}) => (
  <div style={{background:S.card,borderRadius:12,padding:"14px 16px",border:`1px solid ${S.bdr}`,flex:"1 1 130px",minWidth:0}}>
    <div style={{width:32,height:32,borderRadius:8,background:`${color}15`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8,color}}>{icon}</div>
    <div style={{fontSize:20,fontWeight:800,color:S.txt,letterSpacing:-.5}}>{value}</div>
    <div style={{fontSize:9,fontWeight:700,color:S.txt3,marginTop:2,letterSpacing:.8,textTransform:"uppercase"}}>{label}</div>
  </div>
);

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
  const [copied, setCopied] = useState(false);

  // ── Challans State ──
  const [challans, setChallans] = useState([]);
  const [showChModal, setShowChModal] = useState(false);
  const [showCompany, setShowCompany] = useState(false);
  const [expandedCh, setExpandedCh] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [co, setCo] = useState({name:"",address:"",phone:"",email:"",gstin:""});
  const blankCh = {customerId:"",lrNumber:"",remarks:"",items:[]};
  const [chf, setChf] = useState(blankCh);

  // ═══ INVENTORY HELPERS ═══
  const artTot = a => a.colors.reduce((s,c) => s + Object.values(c.sizes).reduce((ss,v) => ss + (v.qty||0), 0), 0);
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
    if (editArt) setArticles(articles.map(a => a.id === editArt.id ? {...a,...d} : a));
    else setArticles([...articles, {id:uid(),...d,createdAt:Date.now()}]);
    setShowArtModal(false);
  };
  const delArt = id => { setArticles(articles.filter(a => a.id !== id)); if (expanded === id) setExpanded(null); };
  const addCat = () => { const c = newCat.trim(); if (c && !cats.includes(c)) { setCats([...cats, c]); setNewCat(""); } };
  const filteredArt = articles.filter(a => (a.name.toLowerCase().includes(search.toLowerCase()) || a.skuId.toLowerCase().includes(search.toLowerCase())) && (fCat === "All" || a.category === fCat));

  // ═══ CUSTOMER HELPERS ═══
  const openAddCust = () => { setEditCust(null); setCf({...blankC}); setShowCustModal(true); };
  const openEditCust = c => { setEditCust(c); setCf({name:c.name,phone:c.phone,whatsapp:c.whatsapp||"",email:c.email||"",dob:c.dob||"",address:c.address||"",city:c.city||"",state:c.state||"",pincode:c.pincode||"",company:c.company||"",gst:c.gst||"",agent:c.agent||"",transport:c.transport||""}); setShowCustModal(true); };
  const saveCust = () => {
    if (!cf.name || !cf.phone) return;
    if (editCust) setCustomers(customers.map(c => c.id === editCust.id ? {...c,...cf} : c));
    else setCustomers([...customers, {id:uid(),...cf,createdAt:Date.now(),purchases:[]}]);
    setShowCustModal(false);
  };
  const delCust = id => { setCustomers(customers.filter(c => c.id !== id)); if (expandedCust === id) setExpandedCust(null); };
  const extSubmit = () => { if (!extF.name || !extF.phone) return; setCustomers([...customers, {id:uid(),...extF,createdAt:Date.now(),purchases:[]}]); setExtF({...blankC}); setShowCustForm(false); };
  const copyLink = () => { navigator.clipboard?.writeText("https://yourcompany.com/register").then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); };
  const filteredCust = customers.filter(c => c.name.toLowerCase().includes(cSearch.toLowerCase()) || c.phone.includes(cSearch) || (c.company||"").toLowerCase().includes(cSearch.toLowerCase()));
  const upBdays = customers.filter(c => c.dob).map(c => { const d = new Date(c.dob), now = new Date(), ty = new Date(now.getFullYear(), d.getMonth(), d.getDate()); if (ty < now) ty.setFullYear(now.getFullYear()+1); return {...c, nextBday:ty, daysUntil:Math.ceil((ty-now)/864e5)}; }).sort((a,b) => a.daysUntil - b.daysUntil).slice(0, 5);
  const av = name => { const h = name.split("").reduce((a,c) => a + c.charCodeAt(0), 0) % 360; return {bg:`hsl(${h},50%,92%)`,color:`hsl(${h},50%,40%)`}; };

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
  const getChArt = it => articles.find(a => a.id === it.articleId);
  const getChCol = it => { const a = getChArt(it); return a?.colors[Number(it.colorIdx)]; };
  const chTotQty = chf.items.reduce((s,it) => s + Object.values(it.sizes).reduce((ss,q) => ss + q, 0), 0);
  const chTotAmt = chf.items.reduce((s,it) => { const col = getChCol(it); if (!col) return s; return s + Object.entries(it.sizes).reduce((ss,[sz,q]) => ss + q * (col.sizes[sz]?.price || 0), 0); }, 0);

  const saveChallan = () => {
    if (!chf.customerId || chf.items.length === 0) return;
    const valid = chf.items.filter(it => it.articleId && it.colorIdx !== "" && Object.values(it.sizes).some(q => q > 0));
    if (valid.length === 0) return;
    const challanItems = valid.map(it => {
      const art = getChArt(it); const col = getChCol(it);
      return { articleName:art.name, skuId:art.skuId, colorName:col.name, colorImage:col.image,
        sizes:Object.entries(it.sizes).filter(([,q]) => q > 0).map(([sz,q]) => ({size:sz,qty:q,price:col.sizes[sz]?.price||0,amount:q*(col.sizes[sz]?.price||0)}))
      };
    });
    const tQty = challanItems.reduce((s,it) => s + it.sizes.reduce((ss,sz) => ss + sz.qty, 0), 0);
    const tAmt = challanItems.reduce((s,it) => s + it.sizes.reduce((ss,sz) => ss + sz.amount, 0), 0);
    const cust = customers.find(c => c.id === chf.customerId);
    const newCh = {
      id:uid(), number:`DC-${String(challans.length+1).padStart(4,"0")}`, date:Date.now(),
      customer:{name:cust.name,phone:cust.phone,address:`${cust.address||""}, ${cust.city||""}, ${cust.state||""} - ${cust.pincode||""}`,gst:cust.gst,transport:cust.transport},
      lrNumber:chf.lrNumber, remarks:chf.remarks, items:challanItems, totalQty:tQty, totalAmt:tAmt
    };
    // Deduct stock
    const updArts = articles.map(a => {
      const copy = JSON.parse(JSON.stringify(a));
      valid.filter(it => it.articleId === a.id).forEach(it => {
        const ci = Number(it.colorIdx);
        Object.entries(it.sizes).forEach(([sz,q]) => { if (copy.colors[ci]?.sizes[sz]) copy.colors[ci].sizes[sz].qty = Math.max(0, copy.colors[ci].sizes[sz].qty - q); });
      });
      return copy;
    });
    setArticles(updArts);
    setChallans([newCh, ...challans]);
    setShowChModal(false);
    setChf({...blankCh});
  };

  const printChallan = ch => {
    const w = window.open("","_blank","width=800,height=1000");
    const rows = ch.items.flatMap(it => it.sizes.map(sz => `<tr><td>${it.articleName}<br/><small>${it.skuId}</small></td><td>${it.colorName}</td><td>${sz.size}</td><td style="text-align:center">${sz.qty}</td><td style="text-align:right">${fmtS(sz.price)}</td><td style="text-align:right;font-weight:700">${fmtS(sz.amount)}</td></tr>`)).join("");
    w.document.write(`<!DOCTYPE html><html><head><title>${ch.number}</title>
      <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;padding:30px;color:#1a1a2e;font-size:13px}
      .hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:16px;border-bottom:3px solid #4361ee}
      .co-name{font-size:20px;font-weight:800}.co-det{font-size:11px;color:#6b7280;margin-top:2px}
      .ch-title{text-align:right}.ch-title h1{font-size:24px;font-weight:800;color:#4361ee}.ch-title p{font-size:12px;color:#6b7280}
      .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px}
      .info-box{padding:14px;background:#f8fafc;border-radius:8px}.info-box h4{font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;margin-bottom:6px}.info-box p{font-size:12px;color:#374151;line-height:1.5}
      table{width:100%;border-collapse:collapse;margin:16px 0}th{background:#1e293b;color:#fff;padding:8px 12px;text-align:left;font-size:10px;text-transform:uppercase}
      td{padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:12px}
      .grand{background:#ecfdf5;font-weight:800;font-size:14px}
      .notes{font-size:11px;color:#6b7280;margin-top:16px;padding:10px 14px;background:#fffbeb;border-radius:6px;border-left:3px solid #f59e0b}
      .footer{margin-top:40px;padding-top:16px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between}
      .sig{width:180px;text-align:center}.sig .line{border-top:1px solid #374151;margin-top:60px;padding-top:6px;font-size:11px;color:#6b7280}
      @media print{body{padding:16px}}</style></head><body>
      <div class="hdr"><div>${companyLogo?`<img src="${companyLogo}" style="width:56px;height:56px;object-fit:contain;border-radius:8px;margin-bottom:6px"/>`:""}<div class="co-name">${co.name||"Your Company"}</div><div class="co-det">${co.address||""}</div><div class="co-det">${co.phone||""} ${co.email?`| ${co.email}`:""}</div>${co.gstin?`<div class="co-det">GSTIN: ${co.gstin}</div>`:""}</div>
      <div class="ch-title"><h1>DELIVERY CHALLAN</h1><p>${ch.number} | ${fmtD(ch.date)}</p></div></div>
      <div class="info-grid"><div class="info-box"><h4>Customer</h4><p><strong>${ch.customer.name}</strong></p><p>${ch.customer.address}</p><p>Phone: ${ch.customer.phone}</p>${ch.customer.gst?`<p>GST: ${ch.customer.gst}</p>`:""}</div>
      <div class="info-box"><h4>Transport Details</h4><p>Transport: ${ch.customer.transport||"—"}</p><p>LR Number: ${ch.lrNumber||"—"}</p></div></div>
      <table><thead><tr><th>Article</th><th>Color</th><th>Size</th><th style="text-align:center">Qty</th><th style="text-align:right">Rate</th><th style="text-align:right">Amount</th></tr></thead><tbody>${rows}
      <tr class="grand"><td colspan="3" style="text-align:right">Grand Total</td><td style="text-align:center;font-weight:800">${ch.totalQty} pcs</td><td></td><td style="text-align:right">${fmtR(ch.totalAmt)}</td></tr></tbody></table>
      ${ch.remarks?`<div class="notes"><strong>Remarks:</strong> ${ch.remarks}</div>`:""}
      <div class="footer"><div class="sig"><div class="line">Receiver's Signature</div></div><div class="sig"><div class="line">Authorized Signature</div></div></div></body></html>`);
    w.document.close(); setTimeout(() => w.print(), 500);
  };

  // ═══ RENDER ═══
  return (
    <div style={{minHeight:"100vh",fontFamily:S.f,background:S.bg,color:S.txt}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none}input[type=number]{-moz-appearance:textfield}@media(max-width:640px){.stat-grid{grid-template-columns:1fr 1fr!important}.hide-mob{display:none!important}.form-grid2{grid-template-columns:1fr!important}}`}</style>

      {/* HEADER */}
      <div style={{background:S.card,borderBottom:`1px solid ${S.bdr}`,padding:"10px 16px",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",maxWidth:1100,margin:"0 auto",flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#4361ee,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}><Package size={20}/></div>
            <h1 style={{margin:0,fontSize:16,fontWeight:800,letterSpacing:-.3}}>InvenTrack</h1>
          </div>
          <div style={{display:"flex",background:S.bg,borderRadius:10,padding:3,gap:2}}>
            {[{id:"inventory",label:"Inventory",ic:<Package size={14}/>},{id:"customers",label:"Customers",ic:<Users size={14}/>},{id:"challans",label:"Challans",ic:<FileText size={14}/>}].map(t =>
              <button key={t.id} onClick={() => setTab(t.id)} style={{display:"flex",alignItems:"center",gap:5,padding:"7px 12px",borderRadius:8,border:"none",background:tab===t.id?S.card:"transparent",color:tab===t.id?S.acc:S.txt2,fontFamily:S.f,fontSize:11,fontWeight:tab===t.id?700:500,cursor:"pointer",boxShadow:tab===t.id?"0 1px 3px rgba(0,0,0,.08)":"none"}}>{t.ic}<span>{t.label}</span></button>
            )}
          </div>
        </div>
      </div>

      <div style={{padding:16,maxWidth:1100,margin:"0 auto"}}>

      {/* ═══ INVENTORY TAB ═══ */}
      {tab === "inventory" && <>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:8}}>
          <h2 style={{margin:0,fontSize:18,fontWeight:800}}>Inventory</h2>
          <div style={{display:"flex",gap:8}}><Btn v="secondary" sz="sm" icon={<Settings size={13}/>} onClick={() => setShowCats(true)}>Categories</Btn><Btn sz="sm" icon={<Plus size={14}/>} onClick={openAddArt}>New Article</Btn></div>
        </div>
        <div className="stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:18}}>
          <Stat icon={<Package size={16}/>} label="Articles" value={articles.length} color={S.acc}/>
          <Stat icon={<Palette size={16}/>} label="Colors" value={totalCols} color={S.pur}/>
          <Stat icon={<Grid3X3 size={16}/>} label="Total Pcs" value={totalPcs.toLocaleString()} color={S.grn}/>
          <Stat icon={<AlertTriangle size={16}/>} label="Low Stock" value={lowStock} color={S.amb}/>
        </div>
        <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:180}}><Inp icon={<Search size={14}/>} placeholder="Search name or SKU..." value={search} onChange={e => setSearch(e.target.value)}/></div>
          <Sel options={["All",...cats]} value={fCat} onChange={e => setFCat(e.target.value)}/>
        </div>

        {filteredArt.length === 0 ? (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"60px 20px",textAlign:"center"}}>
            <div style={{width:60,height:60,borderRadius:16,background:S.accL,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14,color:S.acc}}><Package size={28}/></div>
            <h3 style={{margin:0,fontSize:16,fontWeight:700}}>No articles found</h3>
            <p style={{margin:"6px 0 18px",fontSize:13,color:S.txt2}}>Add your first article to get started</p>
            <Btn icon={<Plus size={14}/>} onClick={openAddArt}>Add Article</Btn>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {filteredArt.map(a => {
              const tot = artTot(a), exp = expanded === a.id;
              return (
                <div key={a.id}>
                  <div onClick={() => setExpanded(exp ? null : a.id)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",background:S.card,borderRadius:exp?"10px 10px 0 0":10,border:`1px solid ${exp?S.bdrD:S.bdr}`,borderBottom:exp?"none":undefined,cursor:"pointer",flexWrap:"wrap",gap:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0}}>
                      <ChevronRight size={14} style={{color:S.txt3,transform:exp?"rotate(90deg)":"none",transition:"transform .2s",flexShrink:0}}/>
                      <div style={{minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:700}}>{a.name} <span className="hide-mob" style={{fontSize:11,color:S.txt3,fontFamily:S.fm,marginLeft:6}}>{a.skuId}</span></div>
                        <div style={{display:"flex",gap:4,marginTop:4,flexWrap:"wrap"}}>{a.colors.map((c,i) => <ColorDot key={i} name={c.name}/>)}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span className="hide-mob"><Tag color={S.pur}>{a.category}</Tag></span>
                      <span style={{fontSize:15,fontWeight:800,color:tot===0?S.red:S.grn}}>{tot}<span style={{fontSize:10,color:S.txt3,marginLeft:2}}>pcs</span></span>
                      <div style={{display:"flex",gap:4}} onClick={e => e.stopPropagation()}>
                        <button onClick={() => openEditArt(a)} style={{background:S.accL,border:"none",borderRadius:6,padding:5,cursor:"pointer",display:"flex",color:S.acc}}><Edit3 size={13}/></button>
                        <button onClick={() => delArt(a.id)} style={{background:S.redL,border:"none",borderRadius:6,padding:5,cursor:"pointer",display:"flex",color:S.red}}><Trash2 size={13}/></button>
                      </div>
                    </div>
                  </div>
                  {exp && (
                    <div style={{background:S.card,borderRadius:"0 0 10px 10px",border:`1px solid ${S.bdrD}`,borderTop:`1px dashed ${S.bdr}`,padding:16,overflowX:"auto"}}>
                      {a.colors.map((c,ci) => {
                        const cT = Object.values(c.sizes).reduce((s,v) => s + (v.qty||0), 0);
                        return (
                          <div key={ci} style={{background:S.bg,borderRadius:10,padding:14,border:`1px solid ${S.bdr}`,marginBottom:ci < a.colors.length-1 ? 10 : 0}}>
                            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                              {c.image && <img src={c.image} alt="" style={{width:48,height:48,borderRadius:8,objectFit:"cover"}}/>}
                              <ColorDot name={c.name}/>
                              <span style={{marginLeft:"auto",fontSize:13,fontWeight:700,color:S.acc}}>{cT} pcs</span>
                            </div>
                            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                              {a.selectedSizes.map(sz => {
                                const q = c.sizes[sz]?.qty || 0, p = c.sizes[sz]?.price || 0;
                                return (
                                  <div key={sz} style={{textAlign:"center",minWidth:56}}>
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
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:8}}>
          <h2 style={{margin:0,fontSize:18,fontWeight:800}}>Customers</h2>
          <div style={{display:"flex",gap:8}}><Btn v="secondary" sz="sm" icon={<Share2 size={13}/>} onClick={() => setShowCustForm(true)}>Form</Btn><Btn sz="sm" icon={<Plus size={14}/>} onClick={openAddCust}>Add</Btn></div>
        </div>
        <div className="stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:18}}>
          <Stat icon={<Users size={16}/>} label="Customers" value={customers.length} color={S.acc}/>
          <Stat icon={<Cake size={16}/>} label="Birthdays" value={upBdays.length} color={S.pnk}/>
          <Stat icon={<Building size={16}/>} label="Companies" value={customers.filter(c => c.company).length} color={S.pur}/>
          <Stat icon={<ShoppingBag size={16}/>} label="Purchases" value={customers.reduce((s,c) => (c.purchases||[]).length + s, 0)} color={S.grn}/>
        </div>

        {upBdays.length > 0 && (
          <div style={{background:S.card,borderRadius:12,padding:"14px 18px",marginBottom:16,border:`1px solid ${S.bdr}`}}>
            <div style={{fontSize:10,fontWeight:700,color:S.pnk,textTransform:"uppercase",letterSpacing:.8,marginBottom:10,display:"flex",alignItems:"center",gap:6}}><Cake size={14}/> Upcoming Birthdays</div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>{upBdays.map(c => { const a = av(c.name); return <div key={c.id} style={{background:S.pnkL,borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,minWidth:180}}><div style={{width:34,height:34,borderRadius:"50%",background:a.bg,color:a.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700}}>{c.name.charAt(0)}</div><div><div style={{fontSize:12,fontWeight:700}}>{c.name}</div><div style={{fontSize:10,color:S.txt2}}>{fmtD(c.nextBday)} · <span style={{color:S.pnk,fontWeight:600}}>{c.daysUntil}d</span></div></div></div>; })}</div>
          </div>
        )}

        <div style={{marginBottom:16}}><Inp icon={<Search size={14}/>} placeholder="Search name, phone, company..." value={cSearch} onChange={e => setCSearch(e.target.value)}/></div>

        {filteredCust.length === 0 ? (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"60px 20px",textAlign:"center"}}>
            <div style={{width:60,height:60,borderRadius:16,background:S.accL,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14,color:S.acc}}><Users size={28}/></div>
            <h3 style={{margin:0,fontSize:16,fontWeight:700}}>No customers</h3>
            <p style={{margin:"6px 0 18px",fontSize:13,color:S.txt2}}>Add customers or share the registration form</p>
            <Btn icon={<Plus size={14}/>} onClick={openAddCust}>Add Customer</Btn>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:6}}>{filteredCust.map(c => {
            const a = av(c.name), isE = expandedCust === c.id;
            return (
              <div key={c.id}>
                <div onClick={() => setExpandedCust(isE ? null : c.id)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",background:S.card,borderRadius:isE?"10px 10px 0 0":10,border:`1px solid ${isE?S.bdrD:S.bdr}`,borderBottom:isE?"none":undefined,cursor:"pointer",gap:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0}}>
                    <div style={{width:38,height:38,borderRadius:"50%",background:a.bg,color:a.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,flexShrink:0}}>{c.name.charAt(0)}</div>
                    <div style={{minWidth:0}}><div style={{fontSize:13,fontWeight:700}}>{c.name}</div><div style={{fontSize:11,color:S.txt2}}>{c.phone}{c.company ? ` · ${c.company}` : ""}</div></div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span className="hide-mob" style={{fontSize:12,color:S.txt2}}>{c.city||""}</span>
                    <div style={{display:"flex",gap:4}} onClick={e => e.stopPropagation()}>
                      <button onClick={() => openEditCust(c)} style={{background:S.accL,border:"none",borderRadius:6,padding:5,cursor:"pointer",display:"flex",color:S.acc}}><Edit3 size={13}/></button>
                      <button onClick={() => delCust(c.id)} style={{background:S.redL,border:"none",borderRadius:6,padding:5,cursor:"pointer",display:"flex",color:S.red}}><Trash2 size={13}/></button>
                    </div>
                  </div>
                </div>
                {isE && (
                  <div style={{background:S.card,borderRadius:"0 0 10px 10px",border:`1px solid ${S.bdrD}`,borderTop:`1px dashed ${S.bdr}`,padding:18}}>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:10}}>
                      {[{l:"Phone",v:c.phone},{l:"WhatsApp",v:c.whatsapp||"—"},{l:"Email",v:c.email||"—"},{l:"DOB",v:c.dob?fmtD(c.dob):"—"},{l:"Address",v:c.address?`${c.address}, ${c.city}, ${c.state} - ${c.pincode}`:"—"},{l:"Company",v:c.company||"—"},{l:"GST",v:c.gst||"—"},{l:"Agent",v:c.agent||"—"},{l:"Transport",v:c.transport||"—"}].map((x,i) => (
                        <div key={i} style={{padding:"8px 10px",background:S.bg,borderRadius:8}}>
                          <div style={{fontSize:9,fontWeight:700,color:S.txt3,textTransform:"uppercase",letterSpacing:.8}}>{x.l}</div>
                          <div style={{fontSize:12,fontWeight:600,marginTop:2}}>{x.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}</div>
        )}
      </>}

      {/* ═══ CHALLANS TAB ═══ */}
      {tab === "challans" && <>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:8}}>
          <h2 style={{margin:0,fontSize:18,fontWeight:800}}>Delivery Challans</h2>
          <div style={{display:"flex",gap:8}}><Btn v="secondary" sz="sm" icon={<Building size={13}/>} onClick={() => setShowCompany(true)}>Company</Btn><Btn sz="sm" icon={<Plus size={14}/>} onClick={() => { setChf({...blankCh}); setShowChModal(true); }}>New Challan</Btn></div>
        </div>
        <div className="stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:18}}>
          <Stat icon={<FileText size={16}/>} label="Total Challans" value={challans.length} color={S.acc}/>
          <Stat icon={<Grid3X3 size={16}/>} label="Dispatched" value={challans.reduce((s,c) => s + c.totalQty, 0)} color={S.tea}/>
          <Stat icon={<span style={{fontSize:14,fontWeight:800}}>₹</span>} label="Total Value" value={fmtR(challans.reduce((s,c) => s + c.totalAmt, 0))} color={S.grn}/>
          <Stat icon={<Users size={16}/>} label="Customers" value={[...new Set(challans.map(c => c.customer.name))].length} color={S.pur}/>
        </div>

        {challans.length === 0 ? (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"60px 20px",textAlign:"center"}}>
            <div style={{width:60,height:60,borderRadius:16,background:S.accL,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14,color:S.acc}}><FileText size={28}/></div>
            <h3 style={{margin:0,fontSize:16,fontWeight:700}}>No challans yet</h3>
            <p style={{margin:"6px 0 18px",fontSize:13,color:S.txt2}}>Create a challan to dispatch items & auto-deduct stock</p>
            <Btn icon={<Plus size={14}/>} onClick={() => { setChf({...blankCh}); setShowChModal(true); }}>Create Challan</Btn>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:6}}>{challans.map(ch => {
            const isE = expandedCh === ch.id;
            return (
              <div key={ch.id}>
                <div onClick={() => setExpandedCh(isE ? null : ch.id)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 18px",background:S.card,borderRadius:isE?"10px 10px 0 0":10,border:`1px solid ${isE?S.bdrD:S.bdr}`,borderBottom:isE?"none":undefined,cursor:"pointer",flexWrap:"wrap",gap:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:40,height:40,borderRadius:10,background:S.accL,display:"flex",alignItems:"center",justifyContent:"center",color:S.acc}}><FileText size={18}/></div>
                    <div><div style={{fontSize:14,fontWeight:700}}>{ch.number}</div><div style={{fontSize:11,color:S.txt2}}>{ch.customer.name} · {fmtD(ch.date)}</div></div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                    <Tag color={S.tea}>{ch.totalQty} pcs</Tag>
                    <span style={{fontSize:15,fontWeight:700,color:S.grn}}>{fmtR(ch.totalAmt)}</span>
                    <Btn v="secondary" sz="sm" icon={<Printer size={12}/>} onClick={e => { e.stopPropagation(); printChallan(ch); }}>Print</Btn>
                  </div>
                </div>
                {isE && (
                  <div style={{background:S.card,borderRadius:"0 0 10px 10px",border:`1px solid ${S.bdrD}`,borderTop:`1px dashed ${S.bdr}`,padding:16,overflowX:"auto"}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
                      <div style={{padding:12,background:S.bg,borderRadius:8}}><div style={{fontSize:9,fontWeight:700,color:S.txt3,textTransform:"uppercase",marginBottom:4}}>Customer</div><div style={{fontSize:13,fontWeight:600}}>{ch.customer.name}</div><div style={{fontSize:11,color:S.txt2}}>{ch.customer.address}</div></div>
                      <div style={{padding:12,background:S.bg,borderRadius:8}}><div style={{fontSize:9,fontWeight:700,color:S.txt3,textTransform:"uppercase",marginBottom:4}}>Transport</div><div style={{fontSize:13,fontWeight:600}}>{ch.customer.transport||"—"}</div><div style={{fontSize:11,color:S.txt2}}>LR: {ch.lrNumber||"—"}</div>{ch.remarks && <div style={{fontSize:11,color:S.amb,marginTop:4}}>Note: {ch.remarks}</div>}</div>
                    </div>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                      <thead><tr style={{background:S.bg}}><th style={{textAlign:"left",padding:"8px 10px",fontSize:9,fontWeight:700,color:S.txt3,textTransform:"uppercase",borderBottom:`1px solid ${S.bdr}`}}>Article</th><th style={{textAlign:"left",padding:8,fontSize:9,fontWeight:700,color:S.txt3,borderBottom:`1px solid ${S.bdr}`}}>Color</th><th style={{textAlign:"left",padding:8,fontSize:9,fontWeight:700,color:S.txt3,borderBottom:`1px solid ${S.bdr}`}}>Size</th><th style={{textAlign:"center",padding:8,fontSize:9,fontWeight:700,color:S.txt3,borderBottom:`1px solid ${S.bdr}`}}>Qty</th><th style={{textAlign:"right",padding:8,fontSize:9,fontWeight:700,color:S.txt3,borderBottom:`1px solid ${S.bdr}`}}>Rate</th><th style={{textAlign:"right",padding:"8px 10px",fontSize:9,fontWeight:700,color:S.txt3,borderBottom:`1px solid ${S.bdr}`}}>Amount</th></tr></thead>
                      <tbody>
                        {ch.items.flatMap((it,ii) => it.sizes.map((sz,si) => (
                          <tr key={`${ii}-${si}`}>
                            <td style={{padding:"8px 10px",borderBottom:`1px solid ${S.bdr}`}}>{si===0 ? <><div style={{fontWeight:600}}>{it.articleName}</div><div style={{fontSize:10,color:S.txt2}}>{it.skuId}</div></> : ""}</td>
                            <td style={{padding:8,borderBottom:`1px solid ${S.bdr}`}}>{si===0 ? <ColorDot name={it.colorName}/> : ""}</td>
                            <td style={{padding:8,borderBottom:`1px solid ${S.bdr}`,fontWeight:600}}>{sz.size}</td>
                            <td style={{textAlign:"center",padding:8,borderBottom:`1px solid ${S.bdr}`,fontWeight:700,fontFamily:S.fm}}>{sz.qty}</td>
                            <td style={{textAlign:"right",padding:8,borderBottom:`1px solid ${S.bdr}`,fontFamily:S.fm}}>{fmtS(sz.price)}</td>
                            <td style={{textAlign:"right",padding:"8px 10px",borderBottom:`1px solid ${S.bdr}`,fontWeight:700,fontFamily:S.fm}}>{fmtS(sz.amount)}</td>
                          </tr>
                        )))}
                        <tr><td colSpan={3} style={{padding:10,fontWeight:700,textAlign:"right"}}>Total</td><td style={{textAlign:"center",padding:10,fontWeight:800,color:S.acc,fontFamily:S.fm}}>{ch.totalQty}</td><td></td><td style={{textAlign:"right",padding:10,fontWeight:800,color:S.grn,fontFamily:S.fm,fontSize:14}}>{fmtR(ch.totalAmt)}</td></tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}</div>
        )}
      </>}
      </div>

      {/* ═══ MODALS ═══ */}

      {/* Article Modal */}
      <Modal open={showArtModal} onClose={() => setShowArtModal(false)} title={editArt ? "Edit Article" : "New Article"} sub="Details, sizes, colors & pricing" w={700}>
        <div className="form-grid2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Inp label="Article Name" placeholder="e.g. Premium Kurta" value={af.name} onChange={e => setAf({...af, name:e.target.value})}/>
          <Inp label="SKU ID" placeholder="e.g. SKU-001" value={af.skuId} onChange={e => setAf({...af, skuId:e.target.value})} iStyle={{fontFamily:S.fm}}/>
          <Sel label="Fabric Quality" options={FABRICS} placeholder="Select..." value={af.fabricQuality} onChange={e => setAf({...af, fabricQuality:e.target.value, customFabric:""})}/>
          <Sel label="Category" options={cats} placeholder="Select..." value={af.category} onChange={e => setAf({...af, category:e.target.value})}/>
        </div>
        {af.fabricQuality === "Other (Enter Manually)" && <div style={{marginTop:12}}><Inp label="Enter Fabric" placeholder="e.g. Georgette..." value={af.customFabric} onChange={e => setAf({...af, customFabric:e.target.value})}/></div>}
        <div style={{marginTop:20}}>
          <label style={{fontSize:10,fontWeight:700,color:S.txt3,letterSpacing:.8,textTransform:"uppercase",display:"block",marginBottom:6}}>Sizes</label>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{SIZES.map(s => <SizeChip key={s} label={s} on={af.selectedSizes.includes(s)} onClick={() => toggleSz(s)}/>)}</div>
        </div>
        <div style={{marginTop:20}}>
          <label style={{fontSize:10,fontWeight:700,color:S.txt3,letterSpacing:.8,textTransform:"uppercase",display:"block",marginBottom:6}}>Colors & Quantities</label>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            <Inp placeholder="Color name..." value={newCol} onChange={e => setNewCol(e.target.value)} onKeyDown={e => e.key === "Enter" && addColor()} icon={<Palette size={14}/>} cStyle={{flex:1}}/>
            <Btn onClick={addColor} disabled={!newCol.trim() || af.selectedSizes.length === 0} icon={<Plus size={14}/>} style={{alignSelf:"flex-end"}}>Add</Btn>
          </div>
          {af.selectedSizes.length === 0 && af.colors.length === 0 && (
            <div style={{padding:14,background:S.ambL,borderRadius:8,display:"flex",alignItems:"center",gap:8}}>
              <AlertTriangle size={14} color={S.amb}/><span style={{fontSize:12,color:S.amb}}>Select sizes first, then add colors.</span>
            </div>
          )}
          {af.colors.map((c,ci) => (
            <div key={ci} style={{background:S.bg,borderRadius:10,border:`1px solid ${S.bdr}`,padding:14,marginBottom:10}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:12,flexWrap:"wrap"}}>
                <ImgUp value={c.image} onChange={img => setColImg(ci, img)} sz={72}/>
                <div style={{flex:1,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <ColorDot name={c.name}/>
                  <button onClick={() => rmColor(ci)} style={{background:S.redL,border:"none",borderRadius:6,padding:4,cursor:"pointer",display:"flex",color:S.red}}><Trash2 size={13}/></button>
                </div>
              </div>
              {af.selectedSizes.length > 0 && (
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {af.selectedSizes.map(sz => (
                    <div key={sz} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,minWidth:64}}>
                      <span style={{fontSize:10,fontWeight:700,color:S.acc}}>{sz}</span>
                      <input type="number" min="0" placeholder="Qty" value={c.sizes[sz]?.qty || ""} onChange={e => updVal(ci,sz,"qty",e.target.value)} style={{width:"100%",textAlign:"center",background:S.card,border:`1px solid ${S.bdr}`,borderRadius:6,padding:"7px 2px",color:S.txt,fontFamily:S.fm,fontSize:12,fontWeight:600,outline:"none"}}/>
                      <div style={{position:"relative",width:"100%"}}>
                        <span style={{position:"absolute",left:6,top:"50%",transform:"translateY(-50%)",color:S.txt3,fontSize:10}}>₹</span>
                        <input type="number" min="0" placeholder="Price" value={c.sizes[sz]?.price || ""} onChange={e => updVal(ci,sz,"price",e.target.value)} style={{width:"100%",textAlign:"center",background:S.card,border:`1px solid ${S.bdr}`,borderRadius:6,padding:"7px 2px 7px 16px",color:S.txt,fontFamily:S.fm,fontSize:11,outline:"none"}}/>
                      </div>
                    </div>
                  ))}
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,minWidth:50}}>
                    <span style={{fontSize:10,fontWeight:700,color:S.grn}}>TTL</span>
                    <div style={{padding:"7px 4px",fontSize:14,fontWeight:800,color:S.grn,fontFamily:S.fm}}>{Object.values(c.sizes).reduce((s,v) => s + (v.qty||0), 0)}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:20,paddingTop:14,borderTop:`1px solid ${S.bdr}`}}>
          <Btn v="secondary" onClick={() => setShowArtModal(false)}>Cancel</Btn>
          <Btn onClick={saveArt} disabled={!af.skuId || !af.name || !af.category || (!af.fabricQuality || (af.fabricQuality === "Other (Enter Manually)" && !af.customFabric.trim()))} icon={<Check size={14}/>}>{editArt ? "Update" : "Save"}</Btn>
        </div>
      </Modal>

      {/* Categories Modal */}
      <Modal open={showCats} onClose={() => setShowCats(false)} title="Manage Categories" w={420}>
        <div style={{display:"flex",gap:8,marginBottom:14}}><Inp placeholder="New category..." value={newCat} onChange={e => setNewCat(e.target.value)} onKeyDown={e => e.key === "Enter" && addCat()} cStyle={{flex:1}}/><Btn onClick={addCat} disabled={!newCat.trim()} icon={<Plus size={14}/>} style={{alignSelf:"flex-end"}}>Add</Btn></div>
        {cats.map((c,i) => <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",background:S.bg,borderRadius:8,border:`1px solid ${S.bdr}`,marginBottom:6}}><span style={{fontSize:13,fontWeight:600}}>{c}</span><button onClick={() => setCats(cats.filter(x => x !== c))} style={{background:S.redL,border:"none",borderRadius:6,padding:4,cursor:"pointer",display:"flex",color:S.red}}><Trash2 size={13}/></button></div>)}
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
          <Inp label="GST" placeholder="GSTIN" value={cf.gst} onChange={e => setCf({...cf, gst:e.target.value})} iStyle={{fontFamily:S.fm,textTransform:"uppercase"}}/>
          <Inp label="Transport Name" icon={<Truck size={13}/>} placeholder="Transport" value={cf.transport} onChange={e => setCf({...cf, transport:e.target.value})}/>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:20,paddingTop:14,borderTop:`1px solid ${S.bdr}`}}>
          <Btn v="secondary" onClick={() => setShowCustModal(false)}>Cancel</Btn>
          <Btn onClick={saveCust} disabled={!cf.name || !cf.phone} icon={<Check size={14}/>}>{editCust ? "Update" : "Add"}</Btn>
        </div>
      </Modal>

      {/* Customer Registration Form */}
      <Modal open={showCustForm} onClose={() => setShowCustForm(false)} title="Customer Registration Form" w={480}>
        <div style={{background:"#fff",borderRadius:12,padding:22,border:`1px solid ${S.bdr}`}}>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{width:48,height:48,borderRadius:12,background:"linear-gradient(135deg,#4361ee,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",color:"#fff"}}><Package size={22}/></div>
            <div style={{fontSize:18,fontWeight:800}}>Register With Us</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {[{l:"Name *",k:"name",ph:"Full name"},{l:"Phone *",k:"phone",ph:"+91..."},{l:"WhatsApp",k:"whatsapp",ph:"+91..."},{l:"Email",k:"email",ph:"email@...",t:"email"},{l:"DOB",k:"dob",t:"date"},{l:"Address",k:"address",ph:"Street"},{l:"City",k:"city",ph:"City"},{l:"Pincode",k:"pincode",ph:"XXXXXX"},{l:"Company",k:"company",ph:"Company"},{l:"GST",k:"gst",ph:"GSTIN"},{l:"Transport",k:"transport",ph:"Transport name"}].map(f => (
              <div key={f.k} style={{display:"flex",flexDirection:"column",gap:3}}>
                <label style={{fontSize:11,fontWeight:600,color:"#374151"}}>{f.l}</label>
                <input type={f.t||"text"} placeholder={f.ph} value={extF[f.k]} onChange={e => setExtF({...extF,[f.k]:e.target.value})} style={{border:"1px solid #d1d5db",borderRadius:8,padding:"9px 10px",background:"#f9fafb",fontFamily:S.f,fontSize:13,color:"#1a1d26",outline:"none"}}/>
              </div>
            ))}
            <div style={{display:"flex",flexDirection:"column",gap:3}}><label style={{fontSize:11,fontWeight:600,color:"#374151"}}>State</label><select value={extF.state} onChange={e => setExtF({...extF, state:e.target.value})} style={{border:"1px solid #d1d5db",borderRadius:8,padding:"9px 10px",background:"#f9fafb",fontFamily:S.f,fontSize:13,outline:"none"}}><option value="">Select...</option>{STATES_IN.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          </div>
          <button onClick={extSubmit} disabled={!extF.name || !extF.phone} style={{width:"100%",marginTop:18,padding:"11px 0",background:extF.name&&extF.phone?"#4361ee":"#d1d5db",color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:extF.name&&extF.phone?"pointer":"not-allowed",fontFamily:S.f}}>Submit</button>
        </div>
      </Modal>

      {/* Company Settings Modal */}
      <Modal open={showCompany} onClose={() => setShowCompany(false)} title="Company Settings" sub="Logo & details for challan PDF" w={480}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:16}}><ImgUp value={companyLogo} onChange={setCompanyLogo} sz={100}/></div>
        <div className="form-grid2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Inp label="Company Name" value={co.name} onChange={e => setCo({...co, name:e.target.value})} placeholder="Your Company" cStyle={{gridColumn:"1/-1"}}/>
          <Inp label="Address" value={co.address} onChange={e => setCo({...co, address:e.target.value})} placeholder="Address" cStyle={{gridColumn:"1/-1"}}/>
          <Inp label="Phone" icon={<Phone size={13}/>} value={co.phone} onChange={e => setCo({...co, phone:e.target.value})} placeholder="+91..."/>
          <Inp label="Email" icon={<Mail size={13}/>} value={co.email} onChange={e => setCo({...co, email:e.target.value})} placeholder="email@..."/>
          <Inp label="GSTIN" value={co.gstin} onChange={e => setCo({...co, gstin:e.target.value})} placeholder="GST Number" iStyle={{fontFamily:S.fm,textTransform:"uppercase"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",marginTop:20}}><Btn onClick={() => setShowCompany(false)} icon={<Check size={14}/>}>Save</Btn></div>
      </Modal>

      {/* Create Challan Modal */}
      <Modal open={showChModal} onClose={() => setShowChModal(false)} title="Create Delivery Challan" sub="Select customer, add items, enter dispatch qty" w={760}>
        <Sel label="Select Customer *" options={customers.map(c => ({v:c.id, l:`${c.name} — ${c.phone}`}))} placeholder="Choose customer..." value={chf.customerId} onChange={e => setChf({...chf, customerId:e.target.value})}/>
        {selCust && (
          <div style={{background:S.bg,borderRadius:10,padding:12,marginTop:10,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:12}}>
            <div><span style={{color:S.txt3,fontSize:10,fontWeight:700,textTransform:"uppercase"}}>Address</span><div style={{fontWeight:600,marginTop:2}}>{selCust.address ? `${selCust.address}, ${selCust.city}, ${selCust.state} - ${selCust.pincode}` : "—"}</div></div>
            <div><span style={{color:S.txt3,fontSize:10,fontWeight:700,textTransform:"uppercase"}}>GST</span><div style={{fontWeight:600,marginTop:2,fontFamily:S.fm}}>{selCust.gst || "—"}</div></div>
            <div><span style={{color:S.txt3,fontSize:10,fontWeight:700,textTransform:"uppercase"}}>Transport</span><div style={{fontWeight:600,marginTop:2}}>{selCust.transport || "—"}</div></div>
            <div><span style={{color:S.txt3,fontSize:10,fontWeight:700,textTransform:"uppercase"}}>Agent</span><div style={{fontWeight:600,marginTop:2}}>{selCust.agent || "—"}</div></div>
          </div>
        )}
        <div className="form-grid2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:14}}>
          <Inp label="LR Number" icon={<Truck size={13}/>} placeholder="LR/GR number" value={chf.lrNumber} onChange={e => setChf({...chf, lrNumber:e.target.value})}/>
          <Inp label="Remarks" placeholder="Notes..." value={chf.remarks} onChange={e => setChf({...chf, remarks:e.target.value})}/>
        </div>
        <div style={{marginTop:20}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <label style={{fontSize:10,fontWeight:700,color:S.txt3,letterSpacing:.8,textTransform:"uppercase"}}>Dispatch Items</label>
            <Btn sz="sm" v="ghost" icon={<Plus size={13}/>} onClick={addChItem}>Add Item</Btn>
          </div>
          {chf.items.length === 0 && <div style={{padding:20,background:S.bg,borderRadius:10,textAlign:"center",color:S.txt2,fontSize:13,border:`1px dashed ${S.bdr}`}}>Click "Add Item" to select articles for dispatch</div>}
          {chf.items.map((it,ii) => {
            const art = getChArt(it); const col = getChCol(it);
            const availSizes = col ? art.selectedSizes.filter(sz => (col.sizes[sz]?.qty || 0) > 0) : [];
            return (
              <div key={ii} style={{background:S.bg,borderRadius:10,border:`1px solid ${S.bdr}`,padding:14,marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                  <span style={{fontSize:11,fontWeight:700,color:S.acc}}>Item #{ii+1}</span>
                  <button onClick={() => rmChItem(ii)} style={{background:S.redL,border:"none",borderRadius:6,padding:4,cursor:"pointer",display:"flex",color:S.red}}><Trash2 size={13}/></button>
                </div>
                <div className="form-grid2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <Sel label="Article" options={articles.filter(a => artTot(a) > 0).map(a => ({v:a.id, l:`${a.name} (${a.skuId})`}))} placeholder="Select article..." value={it.articleId} onChange={e => updChItem(ii,"articleId",e.target.value)}/>
                  {art && <Sel label="Color" options={art.colors.map((c,ci) => ({v:String(ci), l:c.name}))} placeholder="Select color..." value={it.colorIdx} onChange={e => updChItem(ii,"colorIdx",e.target.value)}/>}
                </div>
                {col && availSizes.length > 0 && (
                  <div style={{marginTop:12}}>
                    <div style={{fontSize:10,fontWeight:700,color:S.txt3,textTransform:"uppercase",marginBottom:6}}>Enter dispatch qty per size</div>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      {availSizes.map(sz => {
                        const avail = col.sizes[sz]?.qty || 0;
                        const price = col.sizes[sz]?.price || 0;
                        return (
                          <div key={sz} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,minWidth:70}}>
                            <span style={{fontSize:10,fontWeight:700,color:S.acc}}>{sz}</span>
                            <span style={{fontSize:9,color:S.txt3}}>Avail: {avail}</span>
                            <input type="number" min="0" max={avail} placeholder="0" value={it.sizes[sz] || ""} onChange={e => updChQty(ii,sz,Math.min(Number(e.target.value)||0,avail))} style={{width:"100%",textAlign:"center",background:S.card,border:`1px solid ${S.bdr}`,borderRadius:6,padding:"7px 2px",color:S.txt,fontFamily:S.fm,fontSize:12,fontWeight:600,outline:"none"}}/>
                            {price > 0 && <span style={{fontSize:9,color:S.grn,fontFamily:S.fm}}>{fmtS(price)}</span>}
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
        {chf.items.length > 0 && (
          <div style={{display:"flex",justifyContent:"flex-end",gap:20,padding:"12px 0",borderTop:`1px solid ${S.bdr}`,marginTop:10}}>
            <div style={{textAlign:"center"}}><div style={{fontSize:9,fontWeight:700,color:S.txt3,textTransform:"uppercase"}}>Total Qty</div><div style={{fontSize:18,fontWeight:800,color:S.acc,fontFamily:S.fm}}>{chTotQty}</div></div>
            <div style={{textAlign:"center"}}><div style={{fontSize:9,fontWeight:700,color:S.txt3,textTransform:"uppercase"}}>Total Amount</div><div style={{fontSize:18,fontWeight:800,color:S.grn,fontFamily:S.fm}}>{fmtR(chTotAmt)}</div></div>
          </div>
        )}
        <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:14,paddingTop:14,borderTop:`1px solid ${S.bdr}`}}>
          <Btn v="secondary" onClick={() => setShowChModal(false)}>Cancel</Btn>
          <Btn onClick={saveChallan} disabled={!chf.customerId || chf.items.length === 0 || chTotQty === 0} icon={<Check size={14}/>}>Create Challan & Deduct Stock</Btn>
        </div>
      </Modal>
    </div>
  );
}
