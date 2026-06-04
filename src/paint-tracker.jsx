import React, { useState, useRef, useEffect, Component } from "react";

function getUID(){try{let id=localStorage.getItem("pf_uid");if(!id){id="u"+Math.random().toString(36).slice(2);localStorage.setItem("pf_uid",id);}return id;}catch{return "local";}}
const _SB_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhubnlmeHR1YmFoYnh1dnFnY3RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MDExMzYsImV4cCI6MjA5NTk3NzEzNn0.tAO6QhummsUFsdx-JWvJohxiWq4FaaTh0MkbB2EdNBA";
const _SB_URL="https://hnnyfxtubahbxuvqgctm.supabase.co/rest/v1";
let _syncStatus="idle";
let _syncError="";
let _syncSetStatus=null;
// Supabase sync — push only, no overwrite of local state
async function sbGet(table,uid){
  try{
    const r=await fetch(`${_SB_URL}/${table}?user_id=eq.${uid}`,{headers:{"apikey":_SB_KEY,"Authorization":"Bearer "+_SB_KEY}});
    const data=await r.json();
    if(!r.ok){_syncError=`GET ${table}: ${r.status} ${JSON.stringify(data).slice(0,80)}`;_syncSetStatus&&_syncSetStatus("error:"+_syncError);}
    return r.ok?data:[];
  }catch(e){_syncError=`GET ${table}: ${e.message}`;_syncSetStatus&&_syncSetStatus("error:"+_syncError);return [];}
}
async function sbUpsert(table,rows,conflictCol="id"){
  if(!rows.length)return;
  try{
    const r=await fetch(`${_SB_URL}/${table}`,{method:"POST",headers:{"apikey":_SB_KEY,"Authorization":"Bearer "+_SB_KEY,"Content-Type":"application/json","Prefer":`resolution=merge-duplicates,return=minimal`,"x-upsert-conflict-col":conflictCol},body:JSON.stringify(rows)});
    const text=await r.text();
    if(!r.ok){_syncError=`POST ${table}: ${r.status} ${text.slice(0,80)}`;_syncSetStatus&&_syncSetStatus("error:"+_syncError);}
    else{_syncSetStatus&&_syncSetStatus("ok");setTimeout(()=>_syncSetStatus&&_syncSetStatus("idle"),3000);}
  }catch(e){_syncError=`POST ${table}: ${e.message}`;_syncSetStatus&&_syncSetStatus("error:"+_syncError);}
}

class ErrorBoundary extends Component {
  state={error:null,info:null};
  static getDerivedStateFromError(e){return{error:e};}
  componentDidCatch(e,info){this.setState({info});}
  render(){
    if(this.state.error) return React.createElement("div",
      {style:{background:"#0d0d0d",color:"#e83030",padding:20,fontFamily:"monospace",fontSize:11,minHeight:"100vh",whiteSpace:"pre-wrap",wordBreak:"break-all"}},
      "APP ERROR: "+String(this.state.error)+"\n\n"+
      (this.state.error?.stack||"")+"\n\n"+
      (this.state.info?.componentStack||""));
    return this.props.children;
  }
}

const T = {
  bg:"#0d0d0d", surface:"#111", card:"#141414", border:"#2a2a2a",
  orange:"#d4f54a", yellow:"#ffd000", white:"#f0f0f0",
  dim:"#555", dimmer:"#333", red:"#e83030", green:"#00cc66",
  lime:"#d4f54a",
  font:"'DM Sans', system-ui, sans-serif",
};

const IC={
  camera:"📷", image:"🖼️", palette:"🎨", tool:"🔧", brush:"🖌️",
  spray:"💨", flask:"🧪", box:"📦", cart:"🛒", pin:"📍",
  folder:"📁", calendar:"📅", location:"📍", store:"🏪",
  receipt:"🧾", masking:"🩹", primer:"🪣", edit:"✏️",
  settings:"⚙️", drop:"💧",
};
const BRANDS = {
  kaleido:{ name:"Kaleido", color:"#d4f54a" },
  vallejo:{ name:"Vallejo",            color:"#e8b800" },
  custom: { name:"Custom / Other",     color:"#00cc66" },
};

const TOOL_TYPES=["Brush","Airbrush","Palette Knife","Primer","Varnish","Masking Tape","Tools","Supplies"];
const CONSUMABLE_TYPES=["Sandpaper","Blades","Paper","Sponge","Cloth","Glue","Putty","Filler","Plastic Rod/Sheet","Wire","Resin","Other"];
const SHOP_CATS=["Paint","Brush","Airbrush","Palette Knife","Primer","Varnish","Masking Tape","Tools","Supplies","Other"];

const ALL_PAINTS = [
  // ── PRIMARY A ────────────────────────────────────────────────────────────
  { id:"K001", brand:"kaleido", line:"Primary A", name:"White",         hex:"#f2f2f2",  barcode:"" },
  { id:"K002", brand:"kaleido", line:"Primary A", name:"Black",         hex:"#0a0a0a",  barcode:"" },
  { id:"K003", brand:"kaleido", line:"Primary A", name:"Red",           hex:"#cc1a1a",  barcode:"" },
  { id:"K004", brand:"kaleido", line:"Primary A", name:"Orange",        hex:"#e86020",  barcode:"" },
  { id:"K005", brand:"kaleido", line:"Primary A", name:"Yellow",        hex:"#f5d000",  barcode:"" },
  { id:"K006", brand:"kaleido", line:"Primary A", name:"Green",         hex:"#0d5c2a",  barcode:"" },
  { id:"K007", brand:"kaleido", line:"Primary A", name:"Blue",          hex:"#1a2ecc",  barcode:"" },
  { id:"K008", brand:"kaleido", line:"Primary A", name:"Purple",        hex:"#4a20a0",  barcode:"" },
  { id:"K009", brand:"kaleido", line:"Primary A", name:"Off White",     hex:"#eceae0",  barcode:"" },
  { id:"K010", brand:"kaleido", line:"Primary A", name:"Gray",          hex:"#787880",  barcode:"" },
  { id:"K011", brand:"kaleido", line:"Primary A", name:"Shine Red",     hex:"#e83018",  barcode:"" },
  { id:"K012", brand:"kaleido", line:"Primary A", name:"Orange Yellow", hex:"#e09020",  barcode:"" },
  { id:"K013", brand:"kaleido", line:"Primary A", name:"Emerald Green", hex:"#10b850",  barcode:"" },
  { id:"K014", brand:"kaleido", line:"Primary A", name:"Cobalt Blue",   hex:"#1a38c0",  barcode:"" },
  { id:"K015", brand:"kaleido", line:"Primary A", name:"Violet",        hex:"#6878c0",  barcode:"" },
  { id:"K016", brand:"kaleido", line:"Primary A", name:"Pink",          hex:"#e870a0",  barcode:"" },
  { id:"K017", brand:"kaleido", line:"Primary A", name:"Russet",        hex:"#a01820",  barcode:"" },
  { id:"K018", brand:"kaleido", line:"Primary A", name:"Brown",         hex:"#b04820",  barcode:"" },
  { id:"K019", brand:"kaleido", line:"Primary A", name:"Salmon Pink",   hex:"#e84030",  barcode:"" },
  { id:"K020", brand:"kaleido", line:"Primary A", name:"Cream Yellow",  hex:"#e0c820",  barcode:"" },
  { id:"K021", brand:"kaleido", line:"Primary A", name:"Lime Green",    hex:"#78b860",  barcode:"" },
  { id:"K022", brand:"kaleido", line:"Primary A", name:"Dark Green",    hex:"#1a4830",  barcode:"" },
  { id:"K023", brand:"kaleido", line:"Primary A", name:"Sky Blue",      hex:"#1898e8",  barcode:"" },
  { id:"K024", brand:"kaleido", line:"Primary A", name:"Blue Gray",     hex:"#505870",  barcode:"" },
  // ── PRIMARY B ────────────────────────────────────────────────────────────
  { id:"K025", brand:"kaleido", line:"Primary B", name:"Purple Red",    hex:"#b84050",  barcode:"" },
  { id:"K026", brand:"kaleido", line:"Primary B", name:"Magenta",       hex:"#e030c0",  barcode:"" },
  { id:"K027", brand:"kaleido", line:"Primary B", name:"Ocher",         hex:"#d88820",  barcode:"" },
  { id:"K028", brand:"kaleido", line:"Primary B", name:"Ivory",         hex:"#e8e8c8",  barcode:"" },
  { id:"K029", brand:"kaleido", line:"Primary B", name:"Yellow Green",  hex:"#44d020",  barcode:"" },
  { id:"K030", brand:"kaleido", line:"Primary B", name:"Teal",          hex:"#00c8d8",  barcode:"" },
  { id:"K031", brand:"kaleido", line:"Primary B", name:"Ultramarine",   hex:"#1a40c0",  barcode:"" },
  { id:"K032", brand:"kaleido", line:"Primary B", name:"Cobalt Violet", hex:"#2050d0",  barcode:"" },
  { id:"K033", brand:"kaleido", line:"Primary B", name:"Flesh",         hex:"#e8d8b8",  barcode:"" },
  { id:"K034", brand:"kaleido", line:"Primary B", name:"Flesh White",   hex:"#eeeae0",  barcode:"" },
  { id:"K035", brand:"kaleido", line:"Primary B", name:"Flesh Pink",    hex:"#e8c0a8",  barcode:"" },
  { id:"K036", brand:"kaleido", line:"Primary B", name:"Flesh Orange",  hex:"#e0c878",  barcode:"" },
  { id:"K037", brand:"kaleido", line:"Primary B", name:"Matt White",    hex:"#e8ecee",  barcode:"" },
  { id:"K038", brand:"kaleido", line:"Primary B", name:"Matt Black",    hex:"#303030",  barcode:"" },
  { id:"K039", brand:"kaleido", line:"Primary B", name:"Matt Red",      hex:"#e02828",  barcode:"" },
  { id:"K040", brand:"kaleido", line:"Primary B", name:"Matt Orange",   hex:"#e07820",  barcode:"" },
  { id:"K041", brand:"kaleido", line:"Primary B", name:"Matt Yellow",   hex:"#e8c800",  barcode:"" },
  { id:"K042", brand:"kaleido", line:"Primary B", name:"Matt Green",    hex:"#2a8840",  barcode:"" },
  { id:"K043", brand:"kaleido", line:"Primary B", name:"Matt Blue",     hex:"#2060d0",  barcode:"" },
  { id:"K044", brand:"kaleido", line:"Primary B", name:"Matt Purple",   hex:"#6655c0",  barcode:"" },
  { id:"K045", brand:"kaleido", line:"Primary B", name:"Buff",          hex:"#ddd090",  barcode:"" },
  { id:"K046", brand:"kaleido", line:"Primary B", name:"Wood",          hex:"#d4b880",  barcode:"" },
  { id:"K047", brand:"kaleido", line:"Primary B", name:"Wood Brown",    hex:"#c09060",  barcode:"" },
  { id:"K048", brand:"kaleido", line:"Primary B", name:"Rubber Black",  hex:"#303438",  barcode:"" },
  // ── MECHA ─────────────────────────────────────────────────────────────────
  { id:"K101", brand:"kaleido", line:"Mecha", name:"Cool White",        hex:"#eef0f4",  barcode:"" },
  { id:"K102", brand:"kaleido", line:"Mecha", name:"Bright Red",        hex:"#e82020",  barcode:"" },
  { id:"K103", brand:"kaleido", line:"Mecha", name:"Bright Yellow",     hex:"#e8cc00",  barcode:"" },
  { id:"K104", brand:"kaleido", line:"Mecha", name:"Bright Blue",       hex:"#1a50e0",  barcode:"" },
  { id:"K105", brand:"kaleido", line:"Mecha", name:"Olive Green",       hex:"#708860",  barcode:"" },
  { id:"K106", brand:"kaleido", line:"Mecha", name:"Deep Olive Green",  hex:"#4a6040",  barcode:"" },
  { id:"K107", brand:"kaleido", line:"Mecha", name:"Hibiscus Purple",   hex:"#8868cc",  barcode:"" },
  { id:"K108", brand:"kaleido", line:"Mecha", name:"Titanium Slate",    hex:"#505a68",  barcode:"" },
  { id:"K109", brand:"kaleido", line:"Mecha", name:"Phantom Gray",      hex:"#606870",  barcode:"" },
  { id:"K110", brand:"kaleido", line:"Mecha", name:"Forge Red",         hex:"#e02818",  barcode:"" },
  { id:"K111", brand:"kaleido", line:"Mecha", name:"Rose Taupe",        hex:"#d09080",  barcode:"" },
  { id:"K112", brand:"kaleido", line:"Mecha", name:"Chestnut Red",      hex:"#a01830",  barcode:"" },
  { id:"K113", brand:"kaleido", line:"Mecha", name:"Azure Blue",        hex:"#2878d8",  barcode:"" },
  { id:"K114", brand:"kaleido", line:"Mecha", name:"Dark Azure",        hex:"#1a50c0",  barcode:"" },
  { id:"K115", brand:"kaleido", line:"Mecha", name:"Space Blue",        hex:"#182258",  barcode:"" },
  { id:"K116", brand:"kaleido", line:"Mecha", name:"Dark Space Blue",   hex:"#10183a",  barcode:"" },
  { id:"K117", brand:"kaleido", line:"Mecha", name:"Freedom Blue",      hex:"#1a50d0",  barcode:"" },
  { id:"K118", brand:"kaleido", line:"Mecha", name:"Desert Rose",       hex:"#c88898",  barcode:"" },
  { id:"K119", brand:"kaleido", line:"Mecha", name:"Armor White",       hex:"#e8eaf0",  barcode:"" },
  { id:"K120", brand:"kaleido", line:"Mecha", name:"Armor Gray",        hex:"#a0a8b0",  barcode:"" },
  { id:"K121", brand:"kaleido", line:"Mecha", name:"Armor Carbon",      hex:"#2a2a2c",  barcode:"" },
  { id:"K122", brand:"kaleido", line:"Mecha", name:"Dark Coral",        hex:"#e03828",  barcode:"" },
  { id:"K123", brand:"kaleido", line:"Mecha", name:"Sunset Orange",     hex:"#e89010",  barcode:"" },
  { id:"K124", brand:"kaleido", line:"Mecha", name:"Artillery Green",   hex:"#5a7848",  barcode:"" },
  // ── AUTO COLORS (solid) ───────────────────────────────────────────────────
  { id:"K201", brand:"kaleido", line:"Auto", name:"Italian Racing Red", hex:"#e02020",  barcode:"" },
  { id:"K202", brand:"kaleido", line:"Auto", name:"Flame Orange",       hex:"#e06818",  barcode:"" },
  { id:"K203", brand:"kaleido", line:"Auto", name:"Modena Yellow",      hex:"#e8c000",  barcode:"" },
  { id:"K204", brand:"kaleido", line:"Auto", name:"Mint Green",         hex:"#40d4a8",  barcode:"" },
  { id:"K205", brand:"kaleido", line:"Auto", name:"Racing Emerald",     hex:"#007a50",  barcode:"" },
  { id:"K206", brand:"kaleido", line:"Auto", name:"Baby Blue",          hex:"#8cc4d8",  barcode:"" },
  { id:"K207", brand:"kaleido", line:"Auto", name:"Scotia Blue",        hex:"#1a3a8c",  barcode:"" },
  { id:"K208", brand:"kaleido", line:"Auto", name:"Track Gray",         hex:"#787888",  barcode:"" },
  // ── AUTO COLORS (metallic/pearl) ──────────────────────────────────────────
  { id:"K301", brand:"kaleido", line:"Auto Metallic", name:"Diamond White",       hex:"#e8eaf0",  barcode:"" },
  { id:"K302", brand:"kaleido", line:"Auto Metallic", name:"Cosmic Black",        hex:"#282828",  barcode:"" },
  { id:"K303", brand:"kaleido", line:"Auto Metallic", name:"Metallic Racing Red", hex:"#d83828",  barcode:"" },
  { id:"K304", brand:"kaleido", line:"Auto Metallic", name:"Magma Orange",        hex:"#e84818",  barcode:"" },
  { id:"K305", brand:"kaleido", line:"Auto Metallic", name:"Lustrous Orange",     hex:"#e87010",  barcode:"" },
  { id:"K306", brand:"kaleido", line:"Auto Metallic", name:"Verde Green",         hex:"#a0d020",  barcode:"" },
  { id:"K307", brand:"kaleido", line:"Auto Metallic", name:"Turquoise",           hex:"#20a888",  barcode:"" },
  { id:"K308", brand:"kaleido", line:"Auto Metallic", name:"Metallic Oak Green",  hex:"#98b898",  barcode:"" },
  { id:"K309", brand:"kaleido", line:"Auto Metallic", name:"Almond Green",        hex:"#50a888",  barcode:"" },
  { id:"K310", brand:"kaleido", line:"Auto Metallic", name:"Inferno Green",       hex:"#60c040",  barcode:"" },
  { id:"K311", brand:"kaleido", line:"Auto Metallic", name:"Rally Spirit Blue",   hex:"#0088e0",  barcode:"" },
  { id:"K312", brand:"kaleido", line:"Auto Metallic", name:"Liquid Blue",         hex:"#4898c8",  barcode:"" },
  { id:"K313", brand:"kaleido", line:"Auto Metallic", name:"Metallic Blue Gray",  hex:"#7088a8",  barcode:"" },
  { id:"K314", brand:"kaleido", line:"Auto Metallic", name:"Metallic Purple Red", hex:"#b06888",  barcode:"" },
  { id:"K315", brand:"kaleido", line:"Auto Metallic", name:"Twilight Purple",     hex:"#8844cc",  barcode:"" },
  { id:"K316", brand:"kaleido", line:"Auto Metallic", name:"Graphite Gray",       hex:"#8890a8",  barcode:"" },
  // ── METAL ─────────────────────────────────────────────────────────────────
  { id:"KM001", brand:"kaleido", line:"Metal", name:"Zirconium Black",  hex:"#3a3838",  barcode:"" },
  { id:"KM002", brand:"kaleido", line:"Metal", name:"Gun Metal",        hex:"#504e50",  barcode:"" },
  { id:"KM003", brand:"kaleido", line:"Metal", name:"Tungsten Steel",   hex:"#b8b8b8",  barcode:"" },
  { id:"KM004", brand:"kaleido", line:"Metal", name:"Titanium Alloy",   hex:"#c0b8a8",  barcode:"" },
  { id:"KM005", brand:"kaleido", line:"Metal", name:"Stainless Steel",  hex:"#c8c4b8",  barcode:"" },
  { id:"KM006", brand:"kaleido", line:"Metal", name:"Silver",           hex:"#c89480",  barcode:"" },
  { id:"KM007", brand:"kaleido", line:"Metal", name:"Aluminium",        hex:"#c8a840",  barcode:"" },
  { id:"KM008", brand:"kaleido", line:"Metal", name:"Red Copper",       hex:"#c89030",  barcode:"" },
  { id:"KM009", brand:"kaleido", line:"Metal", name:"Copper",           hex:"#c87020",  barcode:"" },
  { id:"KM010", brand:"kaleido", line:"Metal", name:"Scorched Gold",    hex:"#b06818",  barcode:"" },
  { id:"KM011", brand:"kaleido", line:"Metal", name:"Champagne Gold",   hex:"#c09030",  barcode:"" },
  { id:"KM012", brand:"kaleido", line:"Metal", name:"Flashy Gold",      hex:"#d4880c",  barcode:"" },
  // ── TRANSLUCENT ───────────────────────────────────────────────────────────
  { id:"KC001", brand:"kaleido", line:"Translucent", name:"Translucent White",  hex:"#f0f4ff",  barcode:"" },
  { id:"KC002", brand:"kaleido", line:"Translucent", name:"Translucent Black",  hex:"#303040",  barcode:"" },
  { id:"KC003", brand:"kaleido", line:"Translucent", name:"Translucent Red",    hex:"#dd1020",  barcode:"" },
  { id:"KC004", brand:"kaleido", line:"Translucent", name:"Translucent Orange", hex:"#e85010",  barcode:"" },
  { id:"KC005", brand:"kaleido", line:"Translucent", name:"Translucent Yellow", hex:"#f8cc00",  barcode:"" },
  { id:"KC006", brand:"kaleido", line:"Translucent", name:"Translucent Green",  hex:"#00aa44",  barcode:"" },
  { id:"KC007", brand:"kaleido", line:"Translucent", name:"Translucent Blue",   hex:"#0055cc",  barcode:"" },
  { id:"KC008", brand:"kaleido", line:"Translucent", name:"Translucent Purple", hex:"#7722cc",  barcode:"" },
  { id:"KC009", brand:"kaleido", line:"Translucent", name:"Translucent Pink",   hex:"#ee44aa",  barcode:"" },
  { id:"KC010", brand:"kaleido", line:"Translucent", name:"Translucent Teal",   hex:"#008899",  barcode:"" },
  { id:"KC011", brand:"kaleido", line:"Translucent", name:"Translucent Gold",   hex:"#cc9900",  barcode:"" },
  { id:"KC012", brand:"kaleido", line:"Translucent", name:"Translucent Smoke",  hex:"#404050",  barcode:"" },
  // ── VALLEJO GAME COLOR (72.xxx) ──────────────────────────────────────────
  { id:"72.001", brand:"vallejo", line:"Game Color", name:"Dead White",        hex:"#f2f2f2", barcode:"" },
  { id:"72.002", brand:"vallejo", line:"Vallejo Primer", name:"White Primer",      hex:"#efefef", barcode:"" },
  { id:"72.003", brand:"vallejo", line:"Game Color", name:"Pale Flesh",        hex:"#dea882", barcode:"" },
  { id:"72.004", brand:"vallejo", line:"Game Color", name:"Elf Skintone",      hex:"#c8865a", barcode:"" },
  { id:"72.005", brand:"vallejo", line:"Game Color", name:"Moon Yellow",       hex:"#f5d800", barcode:"" },
  { id:"72.006", brand:"vallejo", line:"Game Color", name:"Sun Yellow",        hex:"#f8bc00", barcode:"" },
  { id:"72.007", brand:"vallejo", line:"Game Color", name:"Gold Yellow",       hex:"#d89000", barcode:"" },
  { id:"72.008", brand:"vallejo", line:"Game Color", name:"Orange Fire",       hex:"#e03808", barcode:"" },
  { id:"72.009", brand:"vallejo", line:"Game Color", name:"Hot Orange",        hex:"#d45010", barcode:"" },
  { id:"72.010", brand:"vallejo", line:"Game Color", name:"Bloody Red",        hex:"#b01818", barcode:"" },
  { id:"72.011", brand:"vallejo", line:"Game Color", name:"Gory Red",          hex:"#8a0e0e", barcode:"" },
  { id:"72.012", brand:"vallejo", line:"Game Color", name:"Scarlet Red",       hex:"#c81020", barcode:"" },
  { id:"72.013", brand:"vallejo", line:"Game Color", name:"Squid Pink",        hex:"#d84070", barcode:"" },
  { id:"72.014", brand:"vallejo", line:"Game Color", name:"Warlord Purple",    hex:"#5e1a8a", barcode:"" },
  { id:"72.015", brand:"vallejo", line:"Game Color", name:"Hexed Lichen",      hex:"#4a2870", barcode:"" },
  { id:"72.016", brand:"vallejo", line:"Game Color", name:"Royal Purple",      hex:"#4a0090", barcode:"" },
  { id:"72.017", brand:"vallejo", line:"Game Color", name:"Dark Blue",         hex:"#141a58", barcode:"" },
  { id:"72.018", brand:"vallejo", line:"Game Color", name:"Stormy Blue",       hex:"#223870", barcode:"" },
  { id:"72.019", brand:"vallejo", line:"Game Color", name:"Night Blue",        hex:"#0e1440", barcode:"" },
  { id:"72.020", brand:"vallejo", line:"Game Color", name:"Imperial Blue",     hex:"#153070", barcode:"" },
  { id:"72.021", brand:"vallejo", line:"Game Color", name:"Magic Blue",        hex:"#1a48c0", barcode:"" },
  { id:"72.022", brand:"vallejo", line:"Game Color", name:"Ultramarine Blue",  hex:"#1a30a8", barcode:"" },
  { id:"72.023", brand:"vallejo", line:"Game Color", name:"Electric Blue",     hex:"#0070e0", barcode:"" },
  { id:"72.024", brand:"vallejo", line:"Game Color", name:"Turquoise",         hex:"#008080", barcode:"" },
  { id:"72.025", brand:"vallejo", line:"Game Color", name:"Foul Green",        hex:"#6ab000", barcode:"" },
  { id:"72.026", brand:"vallejo", line:"Game Color", name:"Jade Green",        hex:"#008850", barcode:"" },
  { id:"72.027", brand:"vallejo", line:"Game Color", name:"Scurvy Green",      hex:"#609830", barcode:"" },
  { id:"72.028", brand:"vallejo", line:"Game Color", name:"Dark Green",        hex:"#144018", barcode:"" },
  { id:"72.029", brand:"vallejo", line:"Game Color", name:"Sick Green",        hex:"#88a830", barcode:"" },
  { id:"72.030", brand:"vallejo", line:"Game Color", name:"Goblin Green",      hex:"#2e8828", barcode:"" },
  { id:"72.031", brand:"vallejo", line:"Game Color", name:"Camouflage Green",  hex:"#445820", barcode:"" },
  { id:"72.032", brand:"vallejo", line:"Game Color", name:"Scorpy Green",      hex:"#50a010", barcode:"" },
  { id:"72.033", brand:"vallejo", line:"Game Color", name:"Livery Green",      hex:"#205018", barcode:"" },
  { id:"72.034", brand:"vallejo", line:"Game Color", name:"Bone White",        hex:"#e0d8b0", barcode:"" },
  { id:"72.035", brand:"vallejo", line:"Game Color", name:"Dead Flesh",        hex:"#bab870", barcode:"" },
  { id:"72.036", brand:"vallejo", line:"Game Color", name:"Bronze Fleshtone",  hex:"#b88060", barcode:"" },
  { id:"72.037", brand:"vallejo", line:"Game Color", name:"Filthy Brown",      hex:"#806030", barcode:"" },
  { id:"72.038", brand:"vallejo", line:"Game Color", name:"Scrofulous Brown",  hex:"#9a7038", barcode:"" },
  { id:"72.039", brand:"vallejo", line:"Game Color", name:"Plague Brown",      hex:"#a08840", barcode:"" },
  { id:"72.040", brand:"vallejo", line:"Game Color", name:"Leather Brown",     hex:"#804828", barcode:"" },
  { id:"72.041", brand:"vallejo", line:"Game Color", name:"Dwarf Skin",        hex:"#c07050", barcode:"" },
  { id:"72.042", brand:"vallejo", line:"Game Color", name:"Parasite Brown",    hex:"#703818", barcode:"" },
  { id:"72.043", brand:"vallejo", line:"Game Color", name:"Beasty Brown",      hex:"#724420", barcode:"" },
  { id:"72.044", brand:"vallejo", line:"Game Color", name:"Dark Fleshtone",    hex:"#985838", barcode:"" },
  { id:"72.045", brand:"vallejo", line:"Game Color", name:"Charred Brown",     hex:"#402818", barcode:"" },
  { id:"72.046", brand:"vallejo", line:"Game Color", name:"Ghost Grey",        hex:"#c0c4c0", barcode:"" },
  { id:"72.047", brand:"vallejo", line:"Game Color", name:"Wolf Grey",         hex:"#788898", barcode:"" },
  { id:"72.048", brand:"vallejo", line:"Game Color", name:"Sombre Grey",       hex:"#586878", barcode:"" },
  { id:"72.049", brand:"vallejo", line:"Game Color", name:"Stonewall Grey",    hex:"#a09898", barcode:"" },
  { id:"72.050", brand:"vallejo", line:"Game Color", name:"Cold Grey",         hex:"#707e8e", barcode:"" },
  { id:"72.051", brand:"vallejo", line:"Game Color", name:"Black",             hex:"#0d0d0d", barcode:"" },
  { id:"72.052", brand:"vallejo", line:"Game Color", name:"Silver",            hex:"#c8ccd4", barcode:"" },
  { id:"72.053", brand:"vallejo", line:"Game Color", name:"Chainmail Silver",  hex:"#9ca4b0", barcode:"" },
  { id:"72.054", brand:"vallejo", line:"Game Color", name:"Gunmetal",          hex:"#505e70", barcode:"" },
  { id:"72.055", brand:"vallejo", line:"Game Color", name:"Polished Gold",     hex:"#d4a020", barcode:"" },
  { id:"72.056", brand:"vallejo", line:"Game Color", name:"Glorious Gold",     hex:"#c08810", barcode:"" },
  { id:"72.057", brand:"vallejo", line:"Game Color", name:"Bright Bronze",     hex:"#986020", barcode:"" },
  { id:"72.058", brand:"vallejo", line:"Game Color", name:"Brassy Brass",      hex:"#a88028", barcode:"" },
  { id:"72.059", brand:"vallejo", line:"Game Color", name:"Hammered Copper",   hex:"#984020", barcode:"" },
  { id:"72.060", brand:"vallejo", line:"Game Color", name:"Tinny Tin",         hex:"#605848", barcode:"" },
  { id:"72.061", brand:"vallejo", line:"Game Color", name:"Khaki",             hex:"#9a8850", barcode:"" },
  { id:"72.062", brand:"vallejo", line:"Game Color", name:"Earth",             hex:"#785e30", barcode:"" },
  { id:"72.063", brand:"vallejo", line:"Game Color", name:"Desert Yellow",     hex:"#c09848", barcode:"" },
  { id:"72.064", brand:"vallejo", line:"Game Color", name:"Yellow Olive",      hex:"#888c38", barcode:"" },
  { id:"72.065", brand:"vallejo", line:"Game Color", name:"Terracotta",        hex:"#b05038", barcode:"" },
  { id:"72.066", brand:"vallejo", line:"Game Color", name:"Tan",               hex:"#c09060", barcode:"" },
  { id:"72.067", brand:"vallejo", line:"Game Color", name:"Cayman Green",      hex:"#485838", barcode:"" },
  { id:"72.071", brand:"vallejo", line:"Game Color", name:"Barbarian Skin",    hex:"#c07040", barcode:"" },
  { id:"72.076", brand:"vallejo", line:"Game Color", name:"Alien Purple",      hex:"#7828b8", barcode:"" },
  { id:"72.085", brand:"vallejo", line:"Vallejo Ink", name:"Yellow Ink",        hex:"#f8d800", barcode:"" },
  { id:"72.086", brand:"vallejo", line:"Vallejo Ink", name:"Red Ink",           hex:"#dd0020", barcode:"" },
  { id:"72.087", brand:"vallejo", line:"Vallejo Ink", name:"Violet Ink",        hex:"#6600cc", barcode:"" },
  { id:"72.088", brand:"vallejo", line:"Vallejo Ink", name:"Blue Ink",          hex:"#0044ee", barcode:"" },
  { id:"72.089", brand:"vallejo", line:"Vallejo Ink", name:"Green Ink",         hex:"#00aa44", barcode:"" },
  { id:"72.091", brand:"vallejo", line:"Vallejo Ink", name:"Sepia Ink",         hex:"#883818", barcode:"" },
  { id:"72.092", brand:"vallejo", line:"Vallejo Ink", name:"Brown Ink",         hex:"#662808", barcode:"" },
  { id:"72.095", brand:"vallejo", line:"Game Color", name:"Glacier Blue",      hex:"#90bcd8", barcode:"" },
  { id:"72.096", brand:"vallejo", line:"Game Color", name:"Verdigris",         hex:"#388878", barcode:"" },
  { id:"72.097", brand:"vallejo", line:"Game Color", name:"Pale Yellow",       hex:"#f5e880", barcode:"" },
  { id:"72.098", brand:"vallejo", line:"Game Color", name:"Elfic Flesh",       hex:"#d8a878", barcode:"" },
  { id:"72.099", brand:"vallejo", line:"Game Color", name:"Cadmium Skin",      hex:"#c07048", barcode:"" },
  { id:"72.100", brand:"vallejo", line:"Game Color", name:"Rosy Flesh",        hex:"#cc8868", barcode:"" },
  { id:"72.101", brand:"vallejo", line:"Game Color", name:"Off White",         hex:"#ede8d8", barcode:"" },
  { id:"72.102", brand:"vallejo", line:"Game Color", name:"Steel Grey",        hex:"#708090", barcode:"" },
  { id:"72.105", brand:"vallejo", line:"Game Color", name:"Mutation Green",    hex:"#68b820", barcode:"" },
  { id:"72.107", brand:"vallejo", line:"Game Color", name:"Athena Skin",       hex:"#c89868", barcode:"" },
  { id:"72.108", brand:"vallejo", line:"Game Color", name:"Succubus Skin",     hex:"#a86848", barcode:"" },
  { id:"72.109", brand:"vallejo", line:"Game Color", name:"Toxic Yellow",      hex:"#d8e820", barcode:"" },
  { id:"72.110", brand:"vallejo", line:"Game Color", name:"Sunset Orange",     hex:"#d85c18", barcode:"" },
  { id:"72.111", brand:"vallejo", line:"Game Color", name:"Nocturnal Red",     hex:"#780010", barcode:"" },
  { id:"72.112", brand:"vallejo", line:"Game Color", name:"Evil Red",          hex:"#980010", barcode:"" },
  { id:"72.113", brand:"vallejo", line:"Game Color", name:"Deep Magenta",      hex:"#b80058", barcode:"" },
  { id:"72.114", brand:"vallejo", line:"Game Color", name:"Lustful Purple",    hex:"#7a1888", barcode:"" },
  { id:"72.115", brand:"vallejo", line:"Game Color", name:"Grunge Brown",      hex:"#685848", barcode:"" },
  { id:"72.116", brand:"vallejo", line:"Game Color", name:"Midnight Purple",   hex:"#2a1458", barcode:"" },
  { id:"72.117", brand:"vallejo", line:"Game Color", name:"Elfic Blue",        hex:"#4880c0", barcode:"" },
  { id:"72.118", brand:"vallejo", line:"Game Color", name:"Sunrise Blue",      hex:"#5888cc", barcode:"" },
  { id:"72.119", brand:"vallejo", line:"Game Color", name:"Aquamarine",        hex:"#30b8a8", barcode:"" },
  { id:"72.120", brand:"vallejo", line:"Game Color", name:"Abyssal Turquoise", hex:"#007080", barcode:"" },
  { id:"72.121", brand:"vallejo", line:"Game Color", name:"Ghost Green",       hex:"#98cc80", barcode:"" },
  { id:"72.122", brand:"vallejo", line:"Game Color", name:"Bile Green",        hex:"#a8c000", barcode:"" },
  { id:"72.123", brand:"vallejo", line:"Game Color", name:"Angel Green",       hex:"#50c050", barcode:"" },
  { id:"72.124", brand:"vallejo", line:"Game Color", name:"Gorgon Brown",      hex:"#886858", barcode:"" },
  { id:"72.125", brand:"vallejo", line:"Game Color", name:"Brewer Brown",      hex:"#6b3c18", barcode:"" },
  { id:"72.145", brand:"vallejo", line:"Game Color", name:"Dirty Grey",        hex:"#787870", barcode:"" },
  { id:"72.148", brand:"vallejo", line:"Game Color", name:"Warm Grey",         hex:"#908878", barcode:"" },
  { id:"72.155", brand:"vallejo", line:"Game Color", name:"Charcoal",          hex:"#282828", barcode:"" },
  // ── Game Color Fluorescent ──
  { id:"72.103", brand:"vallejo", line:"Game Color", name:"Fluorescent Yellow",   hex:"#f8f000", barcode:"" },
  { id:"72.104", brand:"vallejo", line:"Game Color", name:"Fluorescent Green",    hex:"#00f040", barcode:"" },
  { id:"72.156", brand:"vallejo", line:"Game Color", name:"Fluorescent Orange",   hex:"#ff7000", barcode:"" },
  { id:"72.157", brand:"vallejo", line:"Game Color", name:"Fluorescent Red",      hex:"#ff1020", barcode:"" },
  { id:"72.158", brand:"vallejo", line:"Game Color", name:"Fluorescent Magenta",  hex:"#f000a0", barcode:"" },
  { id:"72.159", brand:"vallejo", line:"Game Color", name:"Fluorescent Violet",   hex:"#8000d0", barcode:"" },
  { id:"72.160", brand:"vallejo", line:"Game Color", name:"Fluorescent Blue",     hex:"#0040ff", barcode:"" },
  { id:"72.161", brand:"vallejo", line:"Game Color", name:"Fluorescent Cold Green",hex:"#00e890", barcode:"" },
  // ── Game Color Ink ──
  { id:"72.082", brand:"vallejo", line:"Vallejo Ink", name:"White Ink",         hex:"#f8f8f8", barcode:"" },
  { id:"72.083", brand:"vallejo", line:"Vallejo Ink", name:"Magenta Ink",       hex:"#c00070", barcode:"" },
  { id:"72.084", brand:"vallejo", line:"Vallejo Ink", name:"Dark Turquoise Ink",hex:"#007870", barcode:"" },
  { id:"72.090", brand:"vallejo", line:"Vallejo Ink", name:"Black Green Ink",   hex:"#101808", barcode:"" },
  { id:"72.093", brand:"vallejo", line:"Vallejo Ink", name:"Skin Ink",          hex:"#c07850", barcode:"" },
  { id:"72.094", brand:"vallejo", line:"Vallejo Ink", name:"Black Ink",         hex:"#101010", barcode:"" },
  { id:"72.106", brand:"vallejo", line:"Vallejo Ink", name:"Scarlet Blood Ink", hex:"#c01020", barcode:"" },
  // ── Game Color Wash ──
  { id:"73.200", brand:"vallejo", line:"Vallejo Wash", name:"Sepia Wash",          hex:"#704020", barcode:"" },
  { id:"73.201", brand:"vallejo", line:"Vallejo Wash", name:"Black Wash",          hex:"#101010", barcode:"" },
  { id:"73.203", brand:"vallejo", line:"Vallejo Wash", name:"Umber Wash",          hex:"#5a3010", barcode:"" },
  { id:"73.204", brand:"vallejo", line:"Vallejo Wash", name:"Flesh Wash",          hex:"#c07848", barcode:"" },
  { id:"73.206", brand:"vallejo", line:"Vallejo Wash", name:"Red Wash",            hex:"#980010", barcode:"" },
  { id:"73.207", brand:"vallejo", line:"Vallejo Wash", name:"Blue Wash",           hex:"#102060", barcode:"" },
  { id:"73.208", brand:"vallejo", line:"Vallejo Wash", name:"Yellow Wash",         hex:"#a07000", barcode:"" },
  { id:"73.209", brand:"vallejo", line:"Vallejo Wash", name:"Violet Wash",         hex:"#400860", barcode:"" },
  // ── Game Color Special FX ──
  { id:"72.600", brand:"vallejo", line:"Vallejo Weathering", name:"Vomit",              hex:"#a8a020", barcode:"" },
  { id:"72.601", brand:"vallejo", line:"Vallejo Weathering", name:"Fresh Blood",         hex:"#980010", barcode:"" },
  { id:"72.602", brand:"vallejo", line:"Vallejo Weathering", name:"Thick Blood",         hex:"#600008", barcode:"" },
  { id:"72.603", brand:"vallejo", line:"Vallejo Weathering", name:"Demon Blood",         hex:"#400010", barcode:"" },
  { id:"72.604", brand:"vallejo", line:"Vallejo Weathering", name:"Frost",               hex:"#c8e8f8", barcode:"" },
  { id:"72.605", brand:"vallejo", line:"Vallejo Weathering", name:"Green Rust",          hex:"#488040", barcode:"" },
  { id:"72.606", brand:"vallejo", line:"Vallejo Weathering", name:"Bile",                hex:"#909810", barcode:"" },
  { id:"72.607", brand:"vallejo", line:"Vallejo Weathering", name:"Acid",                hex:"#c0d808", barcode:"" },
  { id:"72.608", brand:"vallejo", line:"Vallejo Weathering", name:"Corrosion",           hex:"#806828", barcode:"" },
  { id:"72.609", brand:"vallejo", line:"Vallejo Weathering", name:"Rust",                hex:"#a84010", barcode:"" },
  { id:"72.610", brand:"vallejo", line:"Vallejo Weathering", name:"Galvanic Corrosion",  hex:"#587030", barcode:"" },
  { id:"72.611", brand:"vallejo", line:"Vallejo Weathering", name:"Moss and Lichen",     hex:"#6a7828", barcode:"" },
  // ── XPRESS COLOR (72.4xx) ─────────────────────────────────────────────────
  { id:"72.401", brand:"vallejo", line:"Xpress Color", name:"Templar White",        hex:"#c8ccc8", barcode:"" },
  { id:"72.402", brand:"vallejo", line:"Xpress Color", name:"Dwarf Skin",           hex:"#904830", barcode:"" },
  { id:"72.403", brand:"vallejo", line:"Xpress Color", name:"Imperial Yellow",      hex:"#e09000", barcode:"" },
  { id:"72.404", brand:"vallejo", line:"Xpress Color", name:"Nuclear Yellow",       hex:"#e8c000", barcode:"" },
  { id:"72.405", brand:"vallejo", line:"Xpress Color", name:"Martian Orange",       hex:"#c84c10", barcode:"" },
  { id:"72.406", brand:"vallejo", line:"Xpress Color", name:"Plasma Red",           hex:"#a81010", barcode:"" },
  { id:"72.407", brand:"vallejo", line:"Xpress Color", name:"Velvet Red",           hex:"#780810", barcode:"" },
  { id:"72.408", brand:"vallejo", line:"Xpress Color", name:"Cardinal Purple",      hex:"#6a0848", barcode:"" },
  { id:"72.409", brand:"vallejo", line:"Xpress Color", name:"Deep Purple",          hex:"#300830", barcode:"" },
  { id:"72.410", brand:"vallejo", line:"Xpress Color", name:"Gloomy Violet",        hex:"#480898", barcode:"" },
  { id:"72.411", brand:"vallejo", line:"Xpress Color", name:"Mystic Blue",          hex:"#1038b0", barcode:"" },
  { id:"72.412", brand:"vallejo", line:"Xpress Color", name:"Storm Blue",           hex:"#102890", barcode:"" },
  { id:"72.413", brand:"vallejo", line:"Xpress Color", name:"Omega Blue",           hex:"#081898", barcode:"" },
  { id:"72.414", brand:"vallejo", line:"Xpress Color", name:"Caribbean Turquoise",  hex:"#006868", barcode:"" },
  { id:"72.415", brand:"vallejo", line:"Xpress Color", name:"Orc Skin",             hex:"#587838", barcode:"" },
  { id:"72.416", brand:"vallejo", line:"Xpress Color", name:"Troll Green",          hex:"#088010", barcode:"" },
  { id:"72.417", brand:"vallejo", line:"Xpress Color", name:"Snake Green",          hex:"#106828", barcode:"" },
  { id:"72.418", brand:"vallejo", line:"Xpress Color", name:"Lizard Green",         hex:"#104510", barcode:"" },
  { id:"72.419", brand:"vallejo", line:"Xpress Color", name:"Plague Green",         hex:"#406020", barcode:"" },
  { id:"72.420", brand:"vallejo", line:"Xpress Color", name:"Wasteland Brown",      hex:"#906830", barcode:"" },
  { id:"72.421", brand:"vallejo", line:"Xpress Color", name:"Copper Brown",         hex:"#784828", barcode:"" },
  { id:"72.422", brand:"vallejo", line:"Xpress Color", name:"Space Grey",           hex:"#585e68", barcode:"" },
  { id:"72.423", brand:"vallejo", line:"Xpress Color", name:"Black Lotus",          hex:"#0c0c10", barcode:"" },
  { id:"72.449", brand:"vallejo", line:"Xpress Color", name:"Mummy White",          hex:"#e8e0c8", barcode:"" },
  { id:"72.450", brand:"vallejo", line:"Xpress Color", name:"Bag of Bones",         hex:"#c8b888", barcode:"" },
  { id:"72.451", brand:"vallejo", line:"Xpress Color", name:"Khaki Drill",          hex:"#b89848", barcode:"" },
  { id:"72.452", brand:"vallejo", line:"Xpress Color", name:"Rotten Flesh",         hex:"#9aac60", barcode:"" },
  { id:"72.453", brand:"vallejo", line:"Xpress Color", name:"Military Yellow",      hex:"#a08020", barcode:"" },
  { id:"72.454", brand:"vallejo", line:"Xpress Color", name:"Desert Ochre",         hex:"#b08830", barcode:"" },
  { id:"72.455", brand:"vallejo", line:"Xpress Color", name:"Chameleon Orange",     hex:"#c05818", barcode:"" },
  { id:"72.456", brand:"vallejo", line:"Xpress Color", name:"Wicked Purple",        hex:"#580848", barcode:"" },
  { id:"72.457", brand:"vallejo", line:"Xpress Color", name:"Fairy Skin",           hex:"#d8a898", barcode:"" },
  { id:"72.458", brand:"vallejo", line:"Xpress Color", name:"Demonic Skin",         hex:"#c07848", barcode:"" },
  { id:"72.459", brand:"vallejo", line:"Xpress Color", name:"Fluid Pink",           hex:"#e070a0", barcode:"" },
  { id:"72.460", brand:"vallejo", line:"Xpress Color", name:"Twilight Rose",        hex:"#983060", barcode:"" },
  { id:"72.461", brand:"vallejo", line:"Xpress Color", name:"Vampiric Purple",      hex:"#400868", barcode:"" },
  { id:"72.462", brand:"vallejo", line:"Xpress Color", name:"Starship Steel",       hex:"#6c7c8c", barcode:"" },
  { id:"72.463", brand:"vallejo", line:"Xpress Color", name:"Iceberg Grey",         hex:"#b8c0cc", barcode:"" },
  { id:"72.464", brand:"vallejo", line:"Xpress Color", name:"Wagram Blue",          hex:"#103890", barcode:"" },
  { id:"72.465", brand:"vallejo", line:"Xpress Color", name:"Forest Green",         hex:"#1c4c18", barcode:"" },
  { id:"72.466", brand:"vallejo", line:"Xpress Color", name:"Armor Green",          hex:"#385428", barcode:"" },
  { id:"72.467", brand:"vallejo", line:"Xpress Color", name:"Camouflage Green",     hex:"#3c5828", barcode:"" },
  { id:"72.468", brand:"vallejo", line:"Xpress Color", name:"Commando Green",       hex:"#283c20", barcode:"" },
  { id:"72.469", brand:"vallejo", line:"Xpress Color", name:"Landser Grey",         hex:"#282820", barcode:"" },
  { id:"72.470", brand:"vallejo", line:"Xpress Color", name:"Zombie Flesh",         hex:"#9aaa68", barcode:"" },
  { id:"72.471", brand:"vallejo", line:"Xpress Color", name:"Tanned Skin",          hex:"#b07848", barcode:"" },
  { id:"72.472", brand:"vallejo", line:"Xpress Color", name:"Mahogany",             hex:"#602818", barcode:"" },
  { id:"72.473", brand:"vallejo", line:"Xpress Color", name:"Battledress Brown",    hex:"#483020", barcode:"" },
  { id:"72.474", brand:"vallejo", line:"Xpress Color", name:"Willow Bark",          hex:"#503820", barcode:"" },
  { id:"72.475", brand:"vallejo", line:"Xpress Color", name:"Muddy Ground",         hex:"#584830", barcode:"" },
  { id:"72.476", brand:"vallejo", line:"Xpress Color", name:"Greasy Black",         hex:"#1c1810", barcode:"" },
  { id:"72.477", brand:"vallejo", line:"Xpress Color", name:"Dreadnought Yellow",   hex:"#c8a000", barcode:"" },
  { id:"72.478", brand:"vallejo", line:"Xpress Color", name:"Phoenix Orange",       hex:"#c84808", barcode:"" },
  { id:"72.479", brand:"vallejo", line:"Xpress Color", name:"Seraph Red",           hex:"#980810", barcode:"" },
  { id:"72.480", brand:"vallejo", line:"Xpress Color", name:"Legacy Blue",          hex:"#0c2070", barcode:"" },
  { id:"72.481", brand:"vallejo", line:"Xpress Color", name:"Heretic Turquoise",    hex:"#006858", barcode:"" },
  { id:"72.482", brand:"vallejo", line:"Xpress Color", name:"Monastic Green",       hex:"#106838", barcode:"" },
  { id:"72.483", brand:"vallejo", line:"Xpress Color", name:"Viking Grey",          hex:"#687888", barcode:"" },
  { id:"72.484", brand:"vallejo", line:"Xpress Color", name:"Hospitaller Black",    hex:"#100c10", barcode:"" },
  // ── VALLEJO AUXILIARY PRODUCTS ────────────────────────────────────────────
  // Game Color / Model Color auxiliaries
  { id:"72.448", brand:"vallejo", line:"Vallejo Auxiliary", name:"Xpress Medium",        hex:"#d8e8f0", barcode:"" },
  { id:"72.650", brand:"vallejo", line:"Vallejo Auxiliary", name:"Gloss Poly Varnish",   hex:"#d8e8f0", barcode:"" },
  { id:"72.651", brand:"vallejo", line:"Vallejo Auxiliary", name:"Matt Poly Varnish",    hex:"#d8e8f0", barcode:"" },
  { id:"72.652", brand:"vallejo", line:"Vallejo Auxiliary", name:"Satin Poly Varnish",   hex:"#d8e8f0", barcode:"" },
  { id:"72.653", brand:"vallejo", line:"Vallejo Auxiliary", name:"Ultra Matt Poly Varnish",hex:"#d8e8f0", barcode:"" },
  { id:"70.521", brand:"vallejo", line:"Vallejo Auxiliary", name:"Metal Medium",          hex:"#d0d0d0", barcode:"" },
  { id:"70.523", brand:"vallejo", line:"Vallejo Auxiliary", name:"Liquid Mask",           hex:"#f0e8c0", barcode:"" },
  { id:"70.524", brand:"vallejo", line:"Vallejo Auxiliary", name:"Thinner Medium",        hex:"#d8e8f0", barcode:"" },
  { id:"70.540", brand:"vallejo", line:"Vallejo Auxiliary", name:"Matt Base",             hex:"#d8e8f0", barcode:"" },
  { id:"70.470", brand:"vallejo", line:"Vallejo Auxiliary", name:"Gloss Medium",          hex:"#d8e8f0", barcode:"" },
  { id:"70.596", brand:"vallejo", line:"Vallejo Auxiliary", name:"Glaze Medium",          hex:"#d8e8f0", barcode:"" },
  { id:"70.597", brand:"vallejo", line:"Vallejo Auxiliary", name:"Retarder Medium",       hex:"#d8e8f0", barcode:"" },
  { id:"70.400", brand:"vallejo", line:"Vallejo Auxiliary", name:"Plastic Putty",         hex:"#f0e8d0", barcode:"" },
  { id:"71.261", brand:"vallejo", line:"Vallejo Auxiliary", name:"Airbrush Thinner",      hex:"#d8e8f0", barcode:"" },
  { id:"71.262", brand:"vallejo", line:"Vallejo Auxiliary", name:"Airbrush Flow Improver",hex:"#d8e8f0", barcode:"" },
  { id:"73.212", brand:"vallejo", line:"Vallejo Auxiliary", name:"Decal Softener",        hex:"#d8e8f0", barcode:"" },
  { id:"73.213", brand:"vallejo", line:"Vallejo Auxiliary", name:"Decal Fix",             hex:"#d8e8f0", barcode:"" },
  { id:"73.214", brand:"vallejo", line:"Vallejo Auxiliary", name:"Chipping Medium",       hex:"#d8e8f0", barcode:"" },
  // ── VALLEJO PRIMERS ───────────────────────────────────────────────────────
  // Mecha Color primers (already moved to this line above)
  // Model Air / Game Air surface primers (70.6xx)
  { id:"70.600", brand:"vallejo", line:"Vallejo Primer", name:"White",                   hex:"#f0f0f0", barcode:"" },
  { id:"70.601", brand:"vallejo", line:"Vallejo Primer", name:"Grey",                    hex:"#888888", barcode:"" },
  { id:"70.602", brand:"vallejo", line:"Vallejo Primer", name:"Black",                   hex:"#141414", barcode:"" },
  { id:"70.603", brand:"vallejo", line:"Vallejo Primer", name:"German Panzer Grey",      hex:"#404848", barcode:"" },
  { id:"70.604", brand:"vallejo", line:"Vallejo Primer", name:"German Dark Yellow",      hex:"#c8a030", barcode:"" },
  { id:"70.605", brand:"vallejo", line:"Vallejo Primer", name:"German Red Brown",        hex:"#803020", barcode:"" },
  { id:"70.606", brand:"vallejo", line:"Vallejo Primer", name:"German Green Brown",      hex:"#708040", barcode:"" },
  { id:"70.607", brand:"vallejo", line:"Vallejo Primer", name:"UK Bronze Green",         hex:"#405830", barcode:"" },
  { id:"70.608", brand:"vallejo", line:"Vallejo Primer", name:"USA Olive Drab",          hex:"#606820", barcode:"" },
  { id:"70.609", brand:"vallejo", line:"Vallejo Primer", name:"Russian Green 4BO",       hex:"#487838", barcode:"" },
  { id:"70.610", brand:"vallejo", line:"Vallejo Primer", name:"Earth Green (Early)",     hex:"#607040", barcode:"" },
  { id:"70.611", brand:"vallejo", line:"Vallejo Primer", name:"Parched Grass (Late)",    hex:"#a09860", barcode:"" },
  { id:"70.612", brand:"vallejo", line:"Vallejo Primer", name:"NATO Green",              hex:"#4a6030", barcode:"" },
  { id:"70.613", brand:"vallejo", line:"Vallejo Primer", name:"Desert Tan",              hex:"#c0a870", barcode:"" },
  { id:"70.614", brand:"vallejo", line:"Vallejo Primer", name:"IDF Israeli Sand Grey",   hex:"#b0a880", barcode:"" },
  { id:"70.615", brand:"vallejo", line:"Vallejo Primer", name:"USN Light Ghost Grey",    hex:"#9098a8", barcode:"" },
  { id:"70.625", brand:"vallejo", line:"Vallejo Primer", name:"Ultramarine Blue",        hex:"#1a38bb", barcode:"" },
  { id:"70.629", brand:"vallejo", line:"Vallejo Primer", name:"Sun Yellow",              hex:"#f8cc00", barcode:"" },
  { id:"70.630", brand:"vallejo", line:"Vallejo Primer", name:"Steel Grey",              hex:"#808898", barcode:"" },
  { id:"70.631", brand:"vallejo", line:"Vallejo Primer", name:"Chainmail Silver",        hex:"#a0a8b0", barcode:"" },
  { id:"70.632", brand:"vallejo", line:"Vallejo Primer", name:"Bloody Red",              hex:"#c02020", barcode:"" },
  // Metal Color primers
  { id:"77.657", brand:"vallejo", line:"Vallejo Primer", name:"Metal Gloss Varnish",     hex:"#d8e8f0", barcode:"" },
  { id:"77.660", brand:"vallejo", line:"Vallejo Primer", name:"Gloss Black Primer",      hex:"#101010", barcode:"" },
  // ── VALLEJO GAME AIR (76.xxx) ─────────────────────────────────────────────
  // IDs corrected from legacy 72.7xx to official 76.xxx per Vallejo Game Air PDF (CC298)
  { id:"76.001", brand:"vallejo", line:"Game Air", name:"Dead White",          hex:"#f0f0ee", barcode:"" },
  { id:"76.003", brand:"vallejo", line:"Game Air", name:"Pale Flesh",          hex:"#dba882", barcode:"" },
  { id:"76.004", brand:"vallejo", line:"Game Air", name:"Elf Skin Tone",       hex:"#c8885a", barcode:"" },
  { id:"76.005", brand:"vallejo", line:"Game Air", name:"Moon Yellow",         hex:"#f5d800", barcode:"" },
  { id:"76.006", brand:"vallejo", line:"Game Air", name:"Sun Yellow",          hex:"#f8bc00", barcode:"" },
  { id:"76.007", brand:"vallejo", line:"Game Air", name:"Gold Yellow",         hex:"#d89000", barcode:"" },
  { id:"76.008", brand:"vallejo", line:"Game Air", name:"Orange Fire",         hex:"#e03808", barcode:"" },
  { id:"76.010", brand:"vallejo", line:"Game Air", name:"Bloody Red",          hex:"#b01818", barcode:"" },
  { id:"76.012", brand:"vallejo", line:"Game Air", name:"Scarlet Red",         hex:"#c81020", barcode:"" },
  { id:"76.013", brand:"vallejo", line:"Game Air", name:"Squid Pink",          hex:"#d04080", barcode:"" },
  { id:"76.014", brand:"vallejo", line:"Game Air", name:"Warlord Purple",      hex:"#5e1a8a", barcode:"" },
  { id:"76.016", brand:"vallejo", line:"Game Air", name:"Royal Purple",        hex:"#4a0090", barcode:"" },
  { id:"76.019", brand:"vallejo", line:"Game Air", name:"Night Blue",          hex:"#0e1440", barcode:"" },
  { id:"76.020", brand:"vallejo", line:"Game Air", name:"Imperial Blue",       hex:"#153070", barcode:"" },
  { id:"76.021", brand:"vallejo", line:"Game Air", name:"Magic Blue",          hex:"#1a48c0", barcode:"" },
  { id:"76.022", brand:"vallejo", line:"Game Air", name:"Ultramarine Blue",    hex:"#1a30a8", barcode:"" },
  { id:"76.023", brand:"vallejo", line:"Game Air", name:"Electric Blue",       hex:"#0070e0", barcode:"" },
  { id:"76.024", brand:"vallejo", line:"Game Air", name:"Turquoise",           hex:"#008080", barcode:"" },
  { id:"76.026", brand:"vallejo", line:"Game Air", name:"Jade Green",          hex:"#008850", barcode:"" },
  { id:"76.027", brand:"vallejo", line:"Game Air", name:"Scurvy Green",        hex:"#609830", barcode:"" },
  { id:"76.028", brand:"vallejo", line:"Game Air", name:"Dark Green",          hex:"#144018", barcode:"" },
  { id:"76.031", brand:"vallejo", line:"Game Air", name:"Camouflage Green",    hex:"#445820", barcode:"" },
  { id:"76.032", brand:"vallejo", line:"Game Air", name:"Scorpy Green",        hex:"#50a010", barcode:"" },
  { id:"76.034", brand:"vallejo", line:"Game Air", name:"Bone White",          hex:"#e0d8b0", barcode:"" },
  { id:"76.035", brand:"vallejo", line:"Game Air", name:"Dead Flesh",          hex:"#bab870", barcode:"" },
  { id:"76.036", brand:"vallejo", line:"Game Air", name:"Bronze Brown",        hex:"#987040", barcode:"" },
  { id:"76.040", brand:"vallejo", line:"Game Air", name:"Leather Brown",       hex:"#804828", barcode:"" },
  { id:"76.042", brand:"vallejo", line:"Game Air", name:"Parasite Brown",      hex:"#703818", barcode:"" },
  { id:"76.043", brand:"vallejo", line:"Game Air", name:"Beasty Brown",        hex:"#724420", barcode:"" },
  { id:"76.045", brand:"vallejo", line:"Game Air", name:"Charred Brown",       hex:"#402818", barcode:"" },
  { id:"76.047", brand:"vallejo", line:"Game Air", name:"Wolf Grey",           hex:"#788898", barcode:"" },
  { id:"76.048", brand:"vallejo", line:"Game Air", name:"Sombre Grey",         hex:"#586878", barcode:"" },
  { id:"76.049", brand:"vallejo", line:"Game Air", name:"Stonewall Grey",      hex:"#a09898", barcode:"" },
  { id:"76.050", brand:"vallejo", line:"Game Air", name:"Neutral Grey",        hex:"#888888", barcode:"" },
  { id:"76.051", brand:"vallejo", line:"Game Air", name:"Black",               hex:"#0d0d0d", barcode:"" },
  { id:"76.062", brand:"vallejo", line:"Game Air", name:"Earth",               hex:"#785e30", barcode:"" },
  { id:"76.063", brand:"vallejo", line:"Game Air", name:"Desert Yellow",       hex:"#c09848", barcode:"" },
  { id:"76.071", brand:"vallejo", line:"Game Air", name:"Barbarian Skin",      hex:"#c07040", barcode:"" },
  { id:"76.076", brand:"vallejo", line:"Game Air", name:"Alien Purple",        hex:"#7828b8", barcode:"" },
  { id:"76.100", brand:"vallejo", line:"Game Air", name:"Rosy Flesh",          hex:"#cc8868", barcode:"" },
  { id:"76.107", brand:"vallejo", line:"Game Air", name:"Athena Skin",         hex:"#c89868", barcode:"" },
  { id:"76.109", brand:"vallejo", line:"Game Air", name:"Toxic Yellow",        hex:"#d8e820", barcode:"" },
  { id:"76.111", brand:"vallejo", line:"Game Air", name:"Nocturnal Red",       hex:"#780010", barcode:"" },
  { id:"76.114", brand:"vallejo", line:"Game Air", name:"Lustful Purple",      hex:"#7a1888", barcode:"" },
  { id:"76.115", brand:"vallejo", line:"Game Air", name:"Grunge Brown",        hex:"#685848", barcode:"" },
  { id:"76.116", brand:"vallejo", line:"Game Air", name:"Midnight Purple",     hex:"#2a1458", barcode:"" },
  { id:"76.118", brand:"vallejo", line:"Game Air", name:"Sunrise Blue",        hex:"#5888cc", barcode:"" },
  { id:"76.120", brand:"vallejo", line:"Game Air", name:"Abyssal Turquoise",   hex:"#007080", barcode:"" },
  { id:"76.121", brand:"vallejo", line:"Game Air", name:"Ghost Green",         hex:"#98cc80", barcode:"" },
  { id:"76.122", brand:"vallejo", line:"Game Air", name:"Bile Green",          hex:"#a8c000", barcode:"" },
  { id:"76.123", brand:"vallejo", line:"Game Air", name:"Angel Green",         hex:"#50c050", barcode:"" },
  // ── VALLEJO MODEL COLOR (70.xxx) ─────────────────────────────────────────
  { id:"70.951", brand:"vallejo", line:"Model Color", name:"White",            hex:"#f2f2f2",  barcode:"" },
  { id:"70.919", brand:"vallejo", line:"Model Color", name:"Cold White",       hex:"#f0f4ff",  barcode:"" },
  { id:"70.918", brand:"vallejo", line:"Model Color", name:"Ivory",            hex:"#ede0b8",  barcode:"" },
  { id:"70.820", brand:"vallejo", line:"Model Color", name:"Off White",        hex:"#ece8d8",  barcode:"" },
  { id:"70.950", brand:"vallejo", line:"Model Color", name:"Black",            hex:"#0d0d0d",  barcode:"" },
  { id:"70.862", brand:"vallejo", line:"Model Color", name:"Black Grey",       hex:"#2c2c2c",  barcode:"" },
  { id:"70.837", brand:"vallejo", line:"Model Color", name:"Pale Sand",        hex:"#e8d8b0",  barcode:"" },
  { id:"70.916", brand:"vallejo", line:"Model Color", name:"Sand Yellow",      hex:"#c8a850",  barcode:"" },
  { id:"70.976", brand:"vallejo", line:"Model Color", name:"Buff",             hex:"#c8a870",  barcode:"" },
  { id:"70.913", brand:"vallejo", line:"Model Color", name:"Yellow Ochre",     hex:"#c09030",  barcode:"" },
  { id:"70.948", brand:"vallejo", line:"Model Color", name:"Golden Yellow",    hex:"#e8a800",  barcode:"" },
  { id:"70.953", brand:"vallejo", line:"Model Color", name:"Flat Yellow",      hex:"#e8c000",  barcode:"" },
  { id:"70.952", brand:"vallejo", line:"Model Color", name:"Lemon Yellow",     hex:"#f0e000",  barcode:"" },
  { id:"70.858", brand:"vallejo", line:"Model Color", name:"Ice Yellow",       hex:"#f8f0b0",  barcode:"" },
  { id:"70.851", brand:"vallejo", line:"Model Color", name:"Bright Orange",    hex:"#e86010",  barcode:"" },
  { id:"70.911", brand:"vallejo", line:"Model Color", name:"Light Orange",     hex:"#e88030",  barcode:"" },
  { id:"70.957", brand:"vallejo", line:"Model Color", name:"Flat Red",         hex:"#b81818",  barcode:"" },
  { id:"70.926", brand:"vallejo", line:"Model Color", name:"Red",              hex:"#c82020",  barcode:"" },
  { id:"70.817", brand:"vallejo", line:"Model Color", name:"Scarlet",          hex:"#d81020",  barcode:"" },
  { id:"70.909", brand:"vallejo", line:"Model Color", name:"Vermilion",        hex:"#e03018",  barcode:"" },
  { id:"70.908", brand:"vallejo", line:"Model Color", name:"Carmine Red",      hex:"#b01028",  barcode:"" },
  { id:"70.946", brand:"vallejo", line:"Model Color", name:"Dark Red",         hex:"#880010",  barcode:"" },
  { id:"70.985", brand:"vallejo", line:"Model Color", name:"Hull Red",         hex:"#802018",  barcode:"" },
  { id:"70.958", brand:"vallejo", line:"Model Color", name:"Pink",             hex:"#e070a0",  barcode:"" },
  { id:"70.944", brand:"vallejo", line:"Model Color", name:"Old Rose",         hex:"#c07878",  barcode:"" },
  { id:"70.945", brand:"vallejo", line:"Model Color", name:"Magenta",          hex:"#cc0077",  barcode:"" },
  { id:"70.959", brand:"vallejo", line:"Model Color", name:"Purple",           hex:"#661188",  barcode:"" },
  { id:"70.960", brand:"vallejo", line:"Model Color", name:"Violet",           hex:"#5511aa",  barcode:"" },
  { id:"70.810", brand:"vallejo", line:"Model Color", name:"Royal Purple",     hex:"#4400aa",  barcode:"" },
  { id:"70.807", brand:"vallejo", line:"Model Color", name:"Oxford Blue",      hex:"#1a2888",  barcode:"" },
  { id:"70.965", brand:"vallejo", line:"Model Color", name:"Prussian Blue",    hex:"#182888",  barcode:"" },
  { id:"70.899", brand:"vallejo", line:"Model Color", name:"Dark Prussian Blue",hex:"#101870", barcode:"" },
  { id:"70.930", brand:"vallejo", line:"Model Color", name:"Dark Blue",        hex:"#101a50",  barcode:"" },
  { id:"70.925", brand:"vallejo", line:"Model Color", name:"Blue",             hex:"#1848a8",  barcode:"" },
  { id:"70.963", brand:"vallejo", line:"Model Color", name:"Medium Blue",      hex:"#2255bb",  barcode:"" },
  { id:"70.962", brand:"vallejo", line:"Model Color", name:"Flat Blue",        hex:"#2244aa",  barcode:"" },
  { id:"70.839", brand:"vallejo", line:"Model Color", name:"Ultramarine",      hex:"#1a30aa",  barcode:"" },
  { id:"70.941", brand:"vallejo", line:"Model Color", name:"Grey Blue",        hex:"#886040",  barcode:"" },
  { id:"70.943", brand:"vallejo", line:"Model Color", name:"Blue Grey",        hex:"#7080a8",  barcode:"" },
  { id:"70.961", brand:"vallejo", line:"Model Color", name:"Sky Blue",         hex:"#5088c8",  barcode:"" },
  { id:"70.902", brand:"vallejo", line:"Model Color", name:"Azure",            hex:"#5098d0",  barcode:"" },
  { id:"70.966", brand:"vallejo", line:"Model Color", name:"Turquoise",        hex:"#009090",  barcode:"" },
  { id:"70.838", brand:"vallejo", line:"Model Color", name:"Emerald",          hex:"#009966",  barcode:"" },
  { id:"70.942", brand:"vallejo", line:"Model Color", name:"Light Green",      hex:"#60c060",  barcode:"" },
  { id:"70.827", brand:"vallejo", line:"Model Color", name:"Lime Green",       hex:"#80cc20",  barcode:"" },
  { id:"70.968", brand:"vallejo", line:"Model Color", name:"Flat Green",       hex:"#2a7030",  barcode:"" },
  { id:"70.967", brand:"vallejo", line:"Model Color", name:"Olive Green",      hex:"#a0b868",  barcode:"" },
  { id:"70.970", brand:"vallejo", line:"Model Color", name:"Deep Green",       hex:"#1a5020",  barcode:"" },
  { id:"70.895", brand:"vallejo", line:"Model Color", name:"Gunship Green",    hex:"#385828",  barcode:"" },
  { id:"70.857", brand:"vallejo", line:"Model Color", name:"Golden Olive",     hex:"#80902a",  barcode:"" },
  { id:"70.879", brand:"vallejo", line:"Model Color", name:"Green Brown",      hex:"#806028",  barcode:"" },
  { id:"70.921", brand:"vallejo", line:"Model Color", name:"English Uniform",  hex:"#908050",  barcode:"" },
  { id:"70.920", brand:"vallejo", line:"Model Color", name:"German Uniform",   hex:"#507040",  barcode:"" },
  { id:"70.978", brand:"vallejo", line:"Model Color", name:"Dark Yellow",      hex:"#c8a020",  barcode:"" },
  { id:"70.977", brand:"vallejo", line:"Model Color", name:"Desert Yellow",    hex:"#c0a048",  barcode:"" },
  { id:"70.988", brand:"vallejo", line:"Model Color", name:"Khaki",            hex:"#c0a868",  barcode:"" },
  { id:"70.880", brand:"vallejo", line:"Model Color", name:"Khaki Grey",       hex:"#9a9870",  barcode:"" },
  { id:"70.987", brand:"vallejo", line:"Model Color", name:"Medium Grey",      hex:"#808080",  barcode:"" },
  { id:"70.992", brand:"vallejo", line:"Model Color", name:"Neutral Grey",     hex:"#989898",  barcode:"" },
  { id:"70.994", brand:"vallejo", line:"Model Color", name:"Dark Grey",        hex:"#707890",  barcode:"" },
  { id:"70.995", brand:"vallejo", line:"Model Color", name:"German Grey",      hex:"#484840",  barcode:"" },
  { id:"70.884", brand:"vallejo", line:"Model Color", name:"Stone Grey",       hex:"#a0a090",  barcode:"" },
  { id:"70.990", brand:"vallejo", line:"Model Color", name:"Light Grey",       hex:"#b8bcc8",  barcode:"" },
  { id:"70.993", brand:"vallejo", line:"Model Color", name:"White Grey",       hex:"#e8e4d8",  barcode:"" },
  { id:"70.940", brand:"vallejo", line:"Model Color", name:"Saddle Brown",     hex:"#905838",  barcode:"" },
  { id:"70.872", brand:"vallejo", line:"Model Color", name:"Chocolate Brown",  hex:"#6a3818",  barcode:"" },
  { id:"70.871", brand:"vallejo", line:"Model Color", name:"Leather Brown",    hex:"#8a5030",  barcode:"" },
  { id:"70.877", brand:"vallejo", line:"Model Color", name:"Gold Brown",       hex:"#a07828",  barcode:"" },
  { id:"70.875", brand:"vallejo", line:"Model Color", name:"Beige Brown",      hex:"#b08860",  barcode:"" },
  { id:"70.876", brand:"vallejo", line:"Model Color", name:"Brown Sand",       hex:"#c09858",  barcode:"" },
  { id:"70.983", brand:"vallejo", line:"Model Color", name:"Flat Earth",       hex:"#907858",  barcode:"" },
  { id:"70.873", brand:"vallejo", line:"Model Color", name:"US Field Drab",    hex:"#a08058",  barcode:"" },
  { id:"70.815", brand:"vallejo", line:"Model Color", name:"Basic Skin Tone",  hex:"#d4a070",  barcode:"" },
  { id:"70.955", brand:"vallejo", line:"Model Color", name:"Flat Flesh",       hex:"#c89060",  barcode:"" },
  { id:"70.860", brand:"vallejo", line:"Model Color", name:"Medium Flesh",     hex:"#c88858",  barcode:"" },
  { id:"70.845", brand:"vallejo", line:"Model Color", name:"Sunny Skin Tone",  hex:"#d09848",  barcode:"" },
  { id:"70.928", brand:"vallejo", line:"Model Color", name:"Light Flesh",      hex:"#e0c0a0",  barcode:"" },
  { id:"70.996", brand:"vallejo", line:"Model Color", name:"Gold",             hex:"#c89820",  barcode:"" },
  { id:"70.997", brand:"vallejo", line:"Model Color", name:"Silver",           hex:"#c8ccd4",  barcode:"" },
  { id:"70.998", brand:"vallejo", line:"Model Color", name:"Bronze",           hex:"#a06828",  barcode:"" },
  { id:"70.999", brand:"vallejo", line:"Model Color", name:"Copper",           hex:"#a05828",  barcode:"" },
  { id:"70.863", brand:"vallejo", line:"Model Color", name:"Gunmetal Grey",    hex:"#606870",  barcode:"" },
  { id:"70.864", brand:"vallejo", line:"Model Color", name:"Natural Steel",    hex:"#b0b4b8",  barcode:"" },
  { id:"70.865", brand:"vallejo", line:"Model Color", name:"Oily Steel",       hex:"#909898",  barcode:"" },
  // ── Model Color additional colours from NewIC PDF ──
  { id:"70.740", brand:"vallejo", line:"Model Color", name:"Camouflage Mid Brown",  hex:"#806040", barcode:"" },
  { id:"70.741", brand:"vallejo", line:"Model Color", name:"Camouflage Black Green",hex:"#1a2810", barcode:"" },
  { id:"70.747", brand:"vallejo", line:"Model Color", name:"Faded Red",             hex:"#b04848", barcode:"" },
  { id:"70.748", brand:"vallejo", line:"Model Color", name:"Light Pink",            hex:"#f0c0c0", barcode:"" },
  { id:"70.749", brand:"vallejo", line:"Model Color", name:"Dark Purple",           hex:"#381060", barcode:"" },
  { id:"70.750", brand:"vallejo", line:"Model Color", name:"Light Violet",          hex:"#c090d0", barcode:"" },
  { id:"70.751", brand:"vallejo", line:"Model Color", name:"Black Violet",          hex:"#180828", barcode:"" },
  { id:"70.752", brand:"vallejo", line:"Model Color", name:"Infantry Blue",         hex:"#204080", barcode:"" },
  { id:"70.753", brand:"vallejo", line:"Model Color", name:"Light Blue Green",      hex:"#80c0b0", barcode:"" },
  { id:"70.754", brand:"vallejo", line:"Model Color", name:"Continental Blue",      hex:"#1040a0", barcode:"" },
  { id:"70.755", brand:"vallejo", line:"Model Color", name:"Light Emerald",         hex:"#40d080", barcode:"" },
  { id:"70.756", brand:"vallejo", line:"Model Color", name:"Splinter Green",        hex:"#488028", barcode:"" },
  { id:"70.757", brand:"vallejo", line:"Model Color", name:"Pacific Green",         hex:"#306040", barcode:"" },
  { id:"70.758", brand:"vallejo", line:"Model Color", name:"Bright Green",          hex:"#40b030", barcode:"" },
  { id:"70.759", brand:"vallejo", line:"Model Color", name:"German Tank Crew",      hex:"#788068", barcode:"" },
  { id:"70.760", brand:"vallejo", line:"Model Color", name:"Light Mud",             hex:"#c0a870", barcode:"" },
  { id:"70.761", brand:"vallejo", line:"Model Color", name:"Old Wood",              hex:"#906840", barcode:"" },
  { id:"70.762", brand:"vallejo", line:"Model Color", name:"Grey Brown",            hex:"#908870", barcode:"" },
  { id:"70.763", brand:"vallejo", line:"Model Color", name:"Canvas",                hex:"#c0a870", barcode:"" },
  { id:"70.764", brand:"vallejo", line:"Model Color", name:"Military Yellow",       hex:"#b09830", barcode:"" },
  { id:"70.765", brand:"vallejo", line:"Model Color", name:"Desert Tan",            hex:"#c0a870", barcode:"" },
  { id:"70.766", brand:"vallejo", line:"Model Color", name:"Cream White",           hex:"#f0e8c8", barcode:"" },
  { id:"70.767", brand:"vallejo", line:"Model Color", name:"Desert Brown",          hex:"#906040", barcode:"" },
  { id:"70.768", brand:"vallejo", line:"Model Color", name:"Dark Brown",            hex:"#503018", barcode:"" },
  { id:"70.769", brand:"vallejo", line:"Model Color", name:"Mustard Brown",         hex:"#988030", barcode:"" },
  { id:"70.770", brand:"vallejo", line:"Model Color", name:"New Wood",              hex:"#c08040", barcode:"" },
  { id:"70.771", brand:"vallejo", line:"Model Color", name:"Dark Rust",             hex:"#882010", barcode:"" },
  { id:"70.772", brand:"vallejo", line:"Model Color", name:"Medium Grey Blue",      hex:"#607098", barcode:"" },
  { id:"70.773", brand:"vallejo", line:"Model Color", name:"Violet Grey",           hex:"#707090", barcode:"" },
  { id:"70.774", brand:"vallejo", line:"Model Color", name:"Lavender Grey",         hex:"#9090b0", barcode:"" },
  { id:"70.800", brand:"vallejo", line:"Model Color", name:"Gunmetal Blue",         hex:"#405870", barcode:"" },
  { id:"70.801", brand:"vallejo", line:"Model Color", name:"Brass",                 hex:"#b09020", barcode:"" },
  { id:"70.802", brand:"vallejo", line:"Model Color", name:"Sunset Red",            hex:"#c83820", barcode:"" },
  { id:"70.803", brand:"vallejo", line:"Model Color", name:"Brown Rose",            hex:"#c07878", barcode:"" },
  { id:"70.804", brand:"vallejo", line:"Model Color", name:"Beige Red",             hex:"#c09080", barcode:"" },
  { id:"70.805", brand:"vallejo", line:"Model Color", name:"German Orange",         hex:"#d06020", barcode:"" },
  { id:"70.806", brand:"vallejo", line:"Model Color", name:"German Yellow",         hex:"#c8a820", barcode:"" },
  { id:"70.808", brand:"vallejo", line:"Model Color", name:"Blue Green",            hex:"#208070", barcode:"" },
  { id:"70.809", brand:"vallejo", line:"Model Color", name:"Royal Blue",            hex:"#1830a0", barcode:"" },
  { id:"70.811", brand:"vallejo", line:"Model Color", name:"Blue Violet",           hex:"#4830a0", barcode:"" },
  { id:"70.812", brand:"vallejo", line:"Model Color", name:"Violet Red",            hex:"#a01050", barcode:"" },
  { id:"70.814", brand:"vallejo", line:"Model Color", name:"Burnt Red",             hex:"#782010", barcode:"" },
  { id:"70.816", brand:"vallejo", line:"Model Color", name:"Luftwaffe Uniform",     hex:"#607080", barcode:"" },
  { id:"70.818", brand:"vallejo", line:"Model Color", name:"Red Leather",           hex:"#a04030", barcode:"" },
  { id:"70.819", brand:"vallejo", line:"Model Color", name:"Iraqi Sand",            hex:"#d0b880", barcode:"" },
  { id:"70.821", brand:"vallejo", line:"Model Color", name:"German Beige WWII",     hex:"#b09860", barcode:"" },
  { id:"70.822", brand:"vallejo", line:"Model Color", name:"Camouflage Black Brown",hex:"#382010", barcode:"" },
  { id:"70.823", brand:"vallejo", line:"Model Color", name:"Luftwaffe Green",       hex:"#688060", barcode:"" },
  { id:"70.824", brand:"vallejo", line:"Model Color", name:"Orange Ochre",          hex:"#c87828", barcode:"" },
  { id:"70.825", brand:"vallejo", line:"Model Color", name:"Pale Brown",            hex:"#c0a080", barcode:"" },
  { id:"70.826", brand:"vallejo", line:"Model Color", name:"Medium Brown",          hex:"#905838", barcode:"" },
  { id:"70.828", brand:"vallejo", line:"Vallejo Ink", name:"Mahogany Ink",          hex:"#602010", barcode:"" },
  { id:"70.829", brand:"vallejo", line:"Model Color", name:"Amaranth Red",          hex:"#b01840", barcode:"" },
  { id:"70.830", brand:"vallejo", line:"Model Color", name:"German Field Grey WWII",hex:"#6a7858", barcode:"" },
  { id:"70.833", brand:"vallejo", line:"Model Color", name:"Fern Green",            hex:"#508040", barcode:"" },
  { id:"70.836", brand:"vallejo", line:"Model Color", name:"London Grey",           hex:"#808090", barcode:"" },
  { id:"70.840", brand:"vallejo", line:"Model Color", name:"Light Turquoise",       hex:"#60d0b8", barcode:"" },
  { id:"70.841", brand:"vallejo", line:"Model Color", name:"Andrea Blue",           hex:"#2060c0", barcode:"" },
  { id:"70.843", brand:"vallejo", line:"Model Color", name:"Cork Brown",            hex:"#987850", barcode:"" },
  { id:"70.844", brand:"vallejo", line:"Model Color", name:"Deep Sky Blue",         hex:"#1880d0", barcode:"" },
  { id:"70.846", brand:"vallejo", line:"Model Color", name:"Mahogany Brown",        hex:"#703020", barcode:"" },
  { id:"70.847", brand:"vallejo", line:"Model Color", name:"Dark Sand",             hex:"#c0a060", barcode:"" },
  { id:"70.850", brand:"vallejo", line:"Model Color", name:"Medium Olive",          hex:"#788028", barcode:"" },
  { id:"70.856", brand:"vallejo", line:"Model Color", name:"Ochre Brown",           hex:"#a07820", barcode:"" },
  { id:"70.859", brand:"vallejo", line:"Model Color", name:"Black Red",             hex:"#380808", barcode:"" },
  { id:"70.866", brand:"vallejo", line:"Model Color", name:"Grey Green",            hex:"#708070", barcode:"" },
  { id:"70.867", brand:"vallejo", line:"Model Color", name:"Dark Blue Grey",        hex:"#384060", barcode:"" },
  { id:"70.868", brand:"vallejo", line:"Model Color", name:"Dark Sea Green",        hex:"#3a5848", barcode:"" },
  { id:"70.869", brand:"vallejo", line:"Model Color", name:"Basalt Grey",           hex:"#606870", barcode:"" },
  { id:"70.870", brand:"vallejo", line:"Model Color", name:"Medium Sea Grey",       hex:"#808898", barcode:"" },
  { id:"70.874", brand:"vallejo", line:"Model Color", name:"Tan Earth",             hex:"#a07848", barcode:"" },
  { id:"70.878", brand:"vallejo", line:"Model Color", name:"Old Gold",              hex:"#987010", barcode:"" },
  { id:"70.881", brand:"vallejo", line:"Model Color", name:"Green Yellow",          hex:"#a8b828", barcode:"" },
  { id:"70.882", brand:"vallejo", line:"Model Color", name:"Middle Stone",          hex:"#c0a860", barcode:"" },
  { id:"70.883", brand:"vallejo", line:"Model Color", name:"Silver Grey",           hex:"#a0a8b0", barcode:"" },
  { id:"70.885", brand:"vallejo", line:"Model Color", name:"Pastel Green",          hex:"#80b878", barcode:"" },
  { id:"70.886", brand:"vallejo", line:"Model Color", name:"Green Grey",            hex:"#788078", barcode:"" },
  { id:"70.887", brand:"vallejo", line:"Model Color", name:"US Olive Drab",         hex:"#606820", barcode:"" },
  { id:"70.888", brand:"vallejo", line:"Model Color", name:"Olive Grey",            hex:"#707858", barcode:"" },
  { id:"70.889", brand:"vallejo", line:"Model Color", name:"Olive Brown",           hex:"#786038", barcode:"" },
  { id:"70.890", brand:"vallejo", line:"Model Color", name:"Refractive Green",      hex:"#407838", barcode:"" },
  { id:"70.891", brand:"vallejo", line:"Model Color", name:"Intermediate Green",    hex:"#408028", barcode:"" },
  { id:"70.892", brand:"vallejo", line:"Model Color", name:"Yellow Olive",          hex:"#909820", barcode:"" },
  { id:"70.893", brand:"vallejo", line:"Model Color", name:"US Dark Green",         hex:"#285020", barcode:"" },
  { id:"70.894", brand:"vallejo", line:"Model Color", name:"Camouflage Olive Green",hex:"#687038", barcode:"" },
  { id:"70.896", brand:"vallejo", line:"Model Color", name:"Extra Dark Green",      hex:"#183018", barcode:"" },
  { id:"70.897", brand:"vallejo", line:"Model Color", name:"Bronze Green",          hex:"#485830", barcode:"" },
  { id:"70.898", brand:"vallejo", line:"Model Color", name:"Dark Sea Blue",         hex:"#182848", barcode:"" },
  { id:"70.901", brand:"vallejo", line:"Model Color", name:"Pastel Blue",           hex:"#a0c0d8", barcode:"" },
  { id:"70.905", brand:"vallejo", line:"Model Color", name:"Blue Grey Pale",        hex:"#9098b0", barcode:"" },
  { id:"70.906", brand:"vallejo", line:"Model Color", name:"Pale Blue",             hex:"#b0c8e0", barcode:"" },
  { id:"70.907", brand:"vallejo", line:"Model Color", name:"Pale Grey Blue",        hex:"#9090b0", barcode:"" },
  { id:"70.914", brand:"vallejo", line:"Model Color", name:"Green Ochre",           hex:"#a09030", barcode:"" },
  { id:"70.915", brand:"vallejo", line:"Model Color", name:"Deep Yellow",           hex:"#e8a000", barcode:"" },
  { id:"70.917", brand:"vallejo", line:"Model Color", name:"Beige",                 hex:"#d0b888", barcode:"" },
  { id:"70.922", brand:"vallejo", line:"Model Color", name:"Uniform Green",         hex:"#708050", barcode:"" },
  { id:"70.923", brand:"vallejo", line:"Model Color", name:"Japanese Uniform WWII", hex:"#9a9060", barcode:"" },
  { id:"70.924", brand:"vallejo", line:"Model Color", name:"Russian Uniform WWII",  hex:"#607050", barcode:"" },
  { id:"70.927", brand:"vallejo", line:"Model Color", name:"Dark Flesh",            hex:"#a86040", barcode:"" },
  { id:"70.929", brand:"vallejo", line:"Model Color", name:"Light Brown",           hex:"#b08060", barcode:"" },
  { id:"70.931", brand:"vallejo", line:"Model Color", name:"Flat Earth",            hex:"#907858", barcode:"" },
  { id:"70.939", brand:"vallejo", line:"Vallejo Ink", name:"Smoke Ink",             hex:"#202020", barcode:"" },
  { id:"70.947", brand:"vallejo", line:"Model Color", name:"Dark Vermilion",        hex:"#b01820", barcode:"" },
  { id:"70.949", brand:"vallejo", line:"Model Color", name:"Light Yellow",          hex:"#f8f0a0", barcode:"" },
  { id:"70.954", brand:"vallejo", line:"Model Color", name:"Yellow Green",          hex:"#a0c820", barcode:"" },
  { id:"70.956", brand:"vallejo", line:"Model Color", name:"Clear Orange",          hex:"#f07820", barcode:"" },
  { id:"70.964", brand:"vallejo", line:"Model Color", name:"Field Blue",            hex:"#304878", barcode:"" },
  { id:"70.969", brand:"vallejo", line:"Model Color", name:"Park Green Flat",       hex:"#388030", barcode:"" },
  { id:"70.971", brand:"vallejo", line:"Model Color", name:"Light Green Grey",      hex:"#909888", barcode:"" },
  { id:"70.972", brand:"vallejo", line:"Model Color", name:"Light Green Blue",      hex:"#8098a8", barcode:"" },
  { id:"70.974", brand:"vallejo", line:"Model Color", name:"Green Sky",             hex:"#609878", barcode:"" },
  { id:"70.975", brand:"vallejo", line:"Model Color", name:"Military Green",        hex:"#507038", barcode:"" },
  { id:"70.979", brand:"vallejo", line:"Model Color", name:"Camouflage Dark Green", hex:"#304028", barcode:"" },
  { id:"70.980", brand:"vallejo", line:"Model Color", name:"Black Green",           hex:"#182018", barcode:"" },
  { id:"70.981", brand:"vallejo", line:"Model Color", name:"Orange Brown",          hex:"#a85820", barcode:"" },
  { id:"70.982", brand:"vallejo", line:"Model Color", name:"Cavalry Brown",         hex:"#7a3820", barcode:"" },
  { id:"70.984", brand:"vallejo", line:"Model Color", name:"Flat Brown",            hex:"#704030", barcode:"" },
  { id:"70.986", brand:"vallejo", line:"Model Color", name:"Deck Tan",              hex:"#c0a870", barcode:"" },
  { id:"70.989", brand:"vallejo", line:"Model Color", name:"Sky Grey",              hex:"#9098a8", barcode:"" },
  { id:"70.991", brand:"vallejo", line:"Model Color", name:"Dark Sea Grey",         hex:"#707890", barcode:"" },
  // ── Model Color Auxiliary / Mediums ──
  { id:"70.510", brand:"vallejo", line:"Vallejo Varnish", name:"Model Gloss Varnish",  hex:"#d8e8f0", barcode:"" },
  { id:"70.520", brand:"vallejo", line:"Vallejo Varnish", name:"Model Matt Varnish",   hex:"#d8e8f0", barcode:"" },
  { id:"70.522", brand:"vallejo", line:"Vallejo Varnish", name:"Model Satin Varnish",  hex:"#d8e8f0", barcode:"" },
  // ── Liquid Metal (70.79x) ──
  { id:"70.790", brand:"vallejo", line:"Liquid Metal", name:"Silver (Liquid Metal)",    hex:"#c0c8d0", barcode:"" },
  { id:"70.791", brand:"vallejo", line:"Liquid Metal", name:"Gold (Liquid Metal)",      hex:"#c08010", barcode:"" },
  { id:"70.792", brand:"vallejo", line:"Liquid Metal", name:"Old Gold (Liquid Metal)",  hex:"#987010", barcode:"" },
  { id:"70.793", brand:"vallejo", line:"Liquid Metal", name:"Rich Gold (Liquid Metal)", hex:"#b07808", barcode:"" },
  { id:"70.794", brand:"vallejo", line:"Liquid Metal", name:"Red Gold (Liquid Metal)",  hex:"#a84820", barcode:"" },
  { id:"70.795", brand:"vallejo", line:"Liquid Metal", name:"Green Gold (Liquid Metal)",hex:"#809010", barcode:"" },
  { id:"70.796", brand:"vallejo", line:"Liquid Metal", name:"White Gold (Liquid Metal)",hex:"#d0c8a0", barcode:"" },
  { id:"70.797", brand:"vallejo", line:"Liquid Metal", name:"Copper (Liquid Metal)",    hex:"#a85020", barcode:"" },
  // ── VALLEJO MODEL AIR (71.xxx) ────────────────────────────────────────────
  { id:"71.001", brand:"vallejo", line:"Model Air", name:"White",              hex:"#f2f2f2", barcode:"" },
  { id:"71.002", brand:"vallejo", line:"Model Air", name:"Medium Yellow",      hex:"#e8c000", barcode:"" },
  { id:"71.003", brand:"vallejo", line:"Model Air", name:"Red RLM23",          hex:"#c82018", barcode:"" },
  { id:"71.004", brand:"vallejo", line:"Model Air", name:"Blue",               hex:"#1848a8", barcode:"" },
  { id:"71.005", brand:"vallejo", line:"Model Air", name:"Grey Blue",          hex:"#6080a0", barcode:"" },
  { id:"71.006", brand:"vallejo", line:"Model Air", name:"Light Green Chromate",hex:"#a0b868",barcode:"" },
  { id:"71.007", brand:"vallejo", line:"Model Air", name:"Olive Green",        hex:"#586820", barcode:"" },
  { id:"71.008", brand:"vallejo", line:"Model Air", name:"Pale Blue",          hex:"#a0c0d8", barcode:"" },
  { id:"71.009", brand:"vallejo", line:"Model Air", name:"Duck Egg Green",     hex:"#90b8a0", barcode:"" },
  { id:"71.010", brand:"vallejo", line:"Model Air", name:"Interior Green",     hex:"#607050", barcode:"" },
  { id:"71.011", brand:"vallejo", line:"Model Air", name:"Dark Green RLM83",   hex:"#384e1e", barcode:"" },
  { id:"71.012", brand:"vallejo", line:"Model Air", name:"Dark Green",         hex:"#284218", barcode:"" },
  { id:"71.013", brand:"vallejo", line:"Model Air", name:"Yellow Olive",       hex:"#888838", barcode:"" },
  { id:"71.014", brand:"vallejo", line:"Model Air", name:"Gunship Green",      hex:"#385828", barcode:"" },
  { id:"71.015", brand:"vallejo", line:"Model Air", name:"Dark Green RLM71",   hex:"#2c4418", barcode:"" },
  { id:"71.016", brand:"vallejo", line:"Model Air", name:"USAF Olive Drab",    hex:"#4c5420", barcode:"" },
  { id:"71.017", brand:"vallejo", line:"Model Air", name:"Russian Green 4BO",  hex:"#485c2c", barcode:"" },
  { id:"71.018", brand:"vallejo", line:"Model Air", name:"Black Green",        hex:"#1e2c14", barcode:"" },
  { id:"71.019", brand:"vallejo", line:"Model Air", name:"Camouflage Dark Green",hex:"#2e3618",barcode:"" },
  { id:"71.020", brand:"vallejo", line:"Model Air", name:"Green Brown",        hex:"#4c5c18", barcode:"" },
  { id:"71.021", brand:"vallejo", line:"Model Air", name:"Black Green RLM70",  hex:"#1c2810", barcode:"" },
  { id:"71.022", brand:"vallejo", line:"Model Air", name:"Light Green RLM82",  hex:"#708040", barcode:"" },
  { id:"71.023", brand:"vallejo", line:"Model Air", name:"Hemp",               hex:"#c0a868", barcode:"" },
  { id:"71.024", brand:"vallejo", line:"Model Air", name:"Khaki Brown",        hex:"#907040", barcode:"" },
  { id:"71.025", brand:"vallejo", line:"Model Air", name:"Dark Yellow",        hex:"#c8a840", barcode:"" },
  { id:"71.026", brand:"vallejo", line:"Model Air", name:"US Flat Brown",      hex:"#8c6038", barcode:"" },
  { id:"71.027", brand:"vallejo", line:"Model Air", name:"Light Brown",        hex:"#b08858", barcode:"" },
  { id:"71.028", brand:"vallejo", line:"Model Air", name:"Sand Yellow",        hex:"#c8b068", barcode:"" },
  { id:"71.029", brand:"vallejo", line:"Model Air", name:"Dark Earth",         hex:"#705030", barcode:"" },
  { id:"71.030", brand:"vallejo", line:"Model Air", name:"Brown Green",        hex:"#706838", barcode:"" },
  { id:"71.031", brand:"vallejo", line:"Model Air", name:"Middle Stone",       hex:"#c0a870", barcode:"" },
  { id:"71.032", brand:"vallejo", line:"Model Air", name:"Golden Brown",       hex:"#a07838", barcode:"" },
  { id:"71.033", brand:"vallejo", line:"Model Air", name:"Yellow Ochre",       hex:"#c8a030", barcode:"" },
  { id:"71.034", brand:"vallejo", line:"Model Air", name:"Sand Brown",         hex:"#c0a878", barcode:"" },
  { id:"71.035", brand:"vallejo", line:"Model Air", name:"Camouflage Pale Brown",hex:"#c8b890",barcode:"" },
  { id:"71.036", brand:"vallejo", line:"Model Air", name:"Mahogany",           hex:"#603020", barcode:"" },
  { id:"71.037", brand:"vallejo", line:"Model Air", name:"Mud Brown",          hex:"#706040", barcode:"" },
  { id:"71.038", brand:"vallejo", line:"Model Air", name:"Camouflage Medium Brown",hex:"#806038",barcode:"" },
  { id:"71.039", brand:"vallejo", line:"Model Air", name:"Hull Red",           hex:"#784030", barcode:"" },
  { id:"71.040", brand:"vallejo", line:"Model Air", name:"Burnt Umber",        hex:"#6a4020", barcode:"" },
  { id:"71.041", brand:"vallejo", line:"Model Air", name:"Armour Brown",       hex:"#803828", barcode:"" },
  { id:"71.042", brand:"vallejo", line:"Model Air", name:"Dark Brown RLM61",   hex:"#482810", barcode:"" },
  { id:"71.043", brand:"vallejo", line:"Model Air", name:"US Olive Drab",      hex:"#4c5828", barcode:"" },
  { id:"71.044", brand:"vallejo", line:"Model Air", name:"Grey RLM02",         hex:"#888070", barcode:"" },
  { id:"71.045", brand:"vallejo", line:"Model Air", name:"Cement Grey",        hex:"#a09888", barcode:"" },
  { id:"71.046", brand:"vallejo", line:"Model Air", name:"Pale Blue Grey",     hex:"#a0b0c0", barcode:"" },
  { id:"71.047", brand:"vallejo", line:"Model Air", name:"Grey",               hex:"#909098", barcode:"" },
  { id:"71.048", brand:"vallejo", line:"Model Air", name:"Engine Gray",        hex:"#707880", barcode:"" },
  { id:"71.049", brand:"vallejo", line:"Model Air", name:"Sea Grey",           hex:"#8898a8", barcode:"" },
  { id:"71.050", brand:"vallejo", line:"Model Air", name:"Light Grey",         hex:"#c0c4c8", barcode:"" },
  { id:"71.051", brand:"vallejo", line:"Model Air", name:"Blue Grey RLM78",    hex:"#808888", barcode:"" },
  { id:"71.052", brand:"vallejo", line:"Model Air", name:"Light Blue",         hex:"#606868", barcode:"" },
  { id:"71.053", brand:"vallejo", line:"Model Air", name:"Steel Blue",         hex:"#708088", barcode:"" },
  { id:"71.054", brand:"vallejo", line:"Model Air", name:"Dark Blue",          hex:"#485868", barcode:"" },
  { id:"71.055", brand:"vallejo", line:"Model Air", name:"Blue RLM65",         hex:"#383838", barcode:"" },
  { id:"71.056", brand:"vallejo", line:"Model Air", name:"Aluminum",           hex:"#3a3e40", barcode:"" },
  { id:"71.057", brand:"vallejo", line:"Model Air", name:"Natural Steel",      hex:"#0d0d0d", barcode:"" },
  { id:"71.058", brand:"vallejo", line:"Model Air", name:"Gun Metal",          hex:"#607080", barcode:"" },
  { id:"71.059", brand:"vallejo", line:"Model Air", name:"White Aluminum",     hex:"#d8e0e8", barcode:"" },
  { id:"71.060", brand:"vallejo", line:"Model Air", name:"Black",              hex:"#111111", barcode:"" },
  { id:"71.062", brand:"vallejo", line:"Model Air", name:"Pale Yellow",        hex:"#c0c4c8", barcode:"" },
  { id:"71.063", brand:"vallejo", line:"Model Air", name:"Light Grey Blue",    hex:"#b8bcc0", barcode:"" },
  { id:"71.064", brand:"vallejo", line:"Model Air", name:"Russian Uniform",    hex:"#d0d8e0", barcode:"" },
  { id:"71.065", brand:"vallejo", line:"Model Air", name:"Dark Sea Grey",      hex:"#a0a8b0", barcode:"" },
  { id:"71.066", brand:"vallejo", line:"Model Air", name:"Medium Grey",        hex:"#c89820", barcode:"" },
  { id:"71.068", brand:"vallejo", line:"Model Air", name:"Chrome",             hex:"#a05828", barcode:"" },
  { id:"71.069", brand:"vallejo", line:"Model Air", name:"Silver",             hex:"#904020", barcode:"" },
  { id:"71.070", brand:"vallejo", line:"Model Air", name:"Gold",               hex:"#c83018", barcode:"" },
  { id:"71.071", brand:"vallejo", line:"Model Air", name:"Copper",             hex:"#90b8d0", barcode:"" },
  { id:"71.072", brand:"vallejo", line:"Model Air", name:"Bronze",             hex:"#707880", barcode:"" },
  { id:"71.073", brand:"vallejo", line:"Model Air", name:"Metallic Black",     hex:"#202020", barcode:"" },
  // ── Model Air additional colours from 2026 PDF ──
  { id:"71.067", brand:"vallejo", line:"Model Air", name:"Bright Brass (Met.)",  hex:"#c09428", barcode:"" },
  { id:"71.074", brand:"vallejo", line:"Model Air", name:"Beige",                hex:"#e0d0a8", barcode:"" },
  { id:"71.075", brand:"vallejo", line:"Model Air", name:"Ivory",                hex:"#e8dca0", barcode:"" },
  { id:"71.076", brand:"vallejo", line:"Model Air", name:"Skin Tone",            hex:"#d0a878", barcode:"" },
  { id:"71.077", brand:"vallejo", line:"Model Air", name:"Wood",                 hex:"#a07848", barcode:"" },
  { id:"71.078", brand:"vallejo", line:"Model Air", name:"Yellow RLM04",         hex:"#d8b060", barcode:"" },
  { id:"71.079", brand:"vallejo", line:"Model Air", name:"Tan Earth",            hex:"#a86838", barcode:"" },
  { id:"71.080", brand:"vallejo", line:"Model Air", name:"Rust",                 hex:"#a06030", barcode:"" },
  { id:"71.081", brand:"vallejo", line:"Model Air", name:"Ochre",                hex:"#c09040", barcode:"" },
  { id:"71.082", brand:"vallejo", line:"Model Air", name:"Fluorescent Red",      hex:"#e82010", barcode:"" },
  { id:"71.083", brand:"vallejo", line:"Model Air", name:"Orange",               hex:"#e06010", barcode:"" },
  { id:"71.084", brand:"vallejo", line:"Model Air", name:"Fire Red",             hex:"#c81818", barcode:"" },
  { id:"71.085", brand:"vallejo", line:"Model Air", name:"Ferrari Red",          hex:"#c00010", barcode:"" },
  { id:"71.086", brand:"vallejo", line:"Model Air", name:"Light Red",            hex:"#d04838", barcode:"" },
  { id:"71.087", brand:"vallejo", line:"Model Air", name:"Steel Blue",           hex:"#3870b0", barcode:"" },
  { id:"71.088", brand:"vallejo", line:"Model Air", name:"French Blue",          hex:"#1848a8", barcode:"" },
  { id:"71.089", brand:"vallejo", line:"Model Air", name:"Light Sea Blue",       hex:"#70b8d8", barcode:"" },
  { id:"71.090", brand:"vallejo", line:"Model Air", name:"Deep Sky",             hex:"#1030a0", barcode:"" },
  { id:"71.091", brand:"vallejo", line:"Model Air", name:"Signal Blue",          hex:"#1848c0", barcode:"" },
  { id:"71.092", brand:"vallejo", line:"Model Air", name:"Medium Olive",         hex:"#607040", barcode:"" },
  { id:"71.093", brand:"vallejo", line:"Model Air", name:"NATO Green",           hex:"#406030", barcode:"" },
  { id:"71.094", brand:"vallejo", line:"Model Air", name:"Green Zinc Chromate",  hex:"#90a050", barcode:"" },
  { id:"71.095", brand:"vallejo", line:"Model Air", name:"Pale Green",           hex:"#a8c098", barcode:"" },
  { id:"71.096", brand:"vallejo", line:"Model Air", name:"Olive Grey",           hex:"#708058", barcode:"" },
  { id:"71.097", brand:"vallejo", line:"Model Air", name:"Medium Gunship Grey",  hex:"#808898", barcode:"" },
  { id:"71.101", brand:"vallejo", line:"Model Air", name:"Light Blue RLM78",     hex:"#9ab0c8", barcode:"" },
  { id:"71.102", brand:"vallejo", line:"Model Air", name:"Red",                  hex:"#c02020", barcode:"" },
  { id:"71.103", brand:"vallejo", line:"Model Air", name:"Grey Blue RLM84",      hex:"#8898b0", barcode:"" },
  { id:"71.104", brand:"vallejo", line:"Model Air", name:"Green RLM62",          hex:"#607848", barcode:"" },
  { id:"71.105", brand:"vallejo", line:"Model Air", name:"Brown RLM26",          hex:"#704830", barcode:"" },
  { id:"71.106", brand:"vallejo", line:"Model Air", name:"Ivory RLM05",          hex:"#e0d8a0", barcode:"" },
  { id:"71.107", brand:"vallejo", line:"Model Air", name:"US Interior Yellow",   hex:"#e8d068", barcode:"" },
  { id:"71.108", brand:"vallejo", line:"Model Air", name:"UK Azure Blue",        hex:"#6090c0", barcode:"" },
  { id:"71.109", brand:"vallejo", line:"Model Air", name:"Faded PRU Blue",       hex:"#8098b0", barcode:"" },
  { id:"71.110", brand:"vallejo", line:"Model Air", name:"Dark Grey",            hex:"#606870", barcode:"" },
  { id:"71.111", brand:"vallejo", line:"Model Air", name:"USAF Light Blue",      hex:"#88a8d0", barcode:"" },
  { id:"71.112", brand:"vallejo", line:"Model Air", name:"Sand",                 hex:"#d0b880", barcode:"" },
  { id:"71.113", brand:"vallejo", line:"Model Air", name:"IDF Blue",             hex:"#3868a8", barcode:"" },
  { id:"71.114", brand:"vallejo", line:"Model Air", name:"Medium Grey",          hex:"#909098", barcode:"" },
  { id:"71.115", brand:"vallejo", line:"Model Air", name:"Blue Grey",            hex:"#708098", barcode:"" },
  { id:"71.116", brand:"vallejo", line:"Model Air", name:"Camouflage Grey Green",hex:"#808870", barcode:"" },
  { id:"71.117", brand:"vallejo", line:"Model Air", name:"Camouflage Brown",     hex:"#906838", barcode:"" },
  { id:"71.118", brand:"vallejo", line:"Model Air", name:"Camouflage Grey",      hex:"#909888", barcode:"" },
  { id:"71.119", brand:"vallejo", line:"Model Air", name:"White Grey",           hex:"#e0dcc8", barcode:"" },
  { id:"71.120", brand:"vallejo", line:"Model Air", name:"Dark Ghost Grey",      hex:"#788090", barcode:"" },
  { id:"71.121", brand:"vallejo", line:"Model Air", name:"Light Gull Grey",      hex:"#c0c8c8", barcode:"" },
  { id:"71.122", brand:"vallejo", line:"Model Air", name:"US Desert Armour 686", hex:"#c8b888", barcode:"" },
  { id:"71.123", brand:"vallejo", line:"Model Air", name:"Dark Grey RLM42",      hex:"#686870", barcode:"" },
  { id:"71.124", brand:"vallejo", line:"Model Air", name:"USAF Green",           hex:"#507040", barcode:"" },
  { id:"71.125", brand:"vallejo", line:"Model Air", name:"USAF Brown",           hex:"#705838", barcode:"" },
  { id:"71.126", brand:"vallejo", line:"Model Air", name:"IDF/IAF Green",        hex:"#506838", barcode:"" },
  { id:"71.128", brand:"vallejo", line:"Model Air", name:"Gray Violet",          hex:"#788090", barcode:"" },
  { id:"71.129", brand:"vallejo", line:"Model Air", name:"Light Rust",           hex:"#b07858", barcode:"" },
  { id:"71.130", brand:"vallejo", line:"Model Air", name:"Orange Rust",          hex:"#b06030", barcode:"" },
  { id:"71.131", brand:"vallejo", line:"Model Air", name:"Concrete",             hex:"#b0b0a0", barcode:"" },
  { id:"71.132", brand:"vallejo", line:"Model Air", name:"Aged White",           hex:"#d8d4c0", barcode:"" },
  { id:"71.133", brand:"vallejo", line:"Model Air", name:"Dirt",                 hex:"#806848", barcode:"" },
  { id:"71.134", brand:"vallejo", line:"Model Air", name:"IJA Midori Green",     hex:"#406030", barcode:"" },
  { id:"71.135", brand:"vallejo", line:"Model Air", name:"IJA Chrome Yellow",    hex:"#d8b840", barcode:"" },
  { id:"71.136", brand:"vallejo", line:"Model Air", name:"IJA Earth Brown",      hex:"#806040", barcode:"" },
  { id:"71.137", brand:"vallejo", line:"Model Air", name:"US Light Green",       hex:"#88a870", barcode:"" },
  { id:"71.138", brand:"vallejo", line:"Model Air", name:"US Sand",              hex:"#c8b080", barcode:"" },
  { id:"71.139", brand:"vallejo", line:"Model Air", name:"US Field Drab",        hex:"#707848", barcode:"" },
  { id:"71.140", brand:"vallejo", line:"Model Air", name:"US Desert Sand",       hex:"#c8a868", barcode:"" },
  { id:"71.141", brand:"vallejo", line:"Model Air", name:"IDF Sand Grey 73",     hex:"#a89870", barcode:"" },
  { id:"71.142", brand:"vallejo", line:"Model Air", name:"IDF Sinai Grey 82",    hex:"#908870", barcode:"" },
  { id:"71.143", brand:"vallejo", line:"Model Air", name:"UK Light Stone",       hex:"#d0c098", barcode:"" },
  { id:"71.244", brand:"vallejo", line:"Model Air", name:"Sand Beige",           hex:"#d0c090", barcode:"" },
  { id:"71.245", brand:"vallejo", line:"Model Air", name:"Loam Beige",           hex:"#c8b878", barcode:"" },
  { id:"71.246", brand:"vallejo", line:"Model Air", name:"Yellow Brown",         hex:"#c8b060", barcode:"" },
  { id:"71.247", brand:"vallejo", line:"Model Air", name:"Light Olive",          hex:"#b0b870", barcode:"" },
  { id:"71.248", brand:"vallejo", line:"Model Air", name:"Brown Grey",           hex:"#908870", barcode:"" },
  { id:"71.249", brand:"vallejo", line:"Model Air", name:"NATO Brown",           hex:"#886040", barcode:"" },
  { id:"71.250", brand:"vallejo", line:"Model Air", name:"Bronze Green",         hex:"#506030", barcode:"" },
  { id:"71.251", brand:"vallejo", line:"Model Air", name:"NATO Black",           hex:"#202018", barcode:"" },
  { id:"71.255", brand:"vallejo", line:"Model Air", name:"Light Blue RLM65",     hex:"#8ab0c8", barcode:"" },
  { id:"71.256", brand:"vallejo", line:"Model Air", name:"Green RLM73",          hex:"#607848", barcode:"" },
  { id:"71.257", brand:"vallejo", line:"Model Air", name:"Light Blue RLM76",     hex:"#90b0c8", barcode:"" },
  { id:"71.258", brand:"vallejo", line:"Model Air", name:"Grey Green RLM74",     hex:"#788868", barcode:"" },
  { id:"71.259", brand:"vallejo", line:"Model Air", name:"Grey Violet RLM75",    hex:"#888090", barcode:"" },
  { id:"71.260", brand:"vallejo", line:"Model Air", name:"Light Grey RLM63",     hex:"#a0a898", barcode:"" },
  { id:"71.263", brand:"vallejo", line:"Model Air", name:"Green RLM72",          hex:"#506838", barcode:"" },
  { id:"71.264", brand:"vallejo", line:"Model Air", name:"Brown Violet RLM81",   hex:"#5a4838", barcode:"" },
  { id:"71.265", brand:"vallejo", line:"Model Air", name:"Olive Green RLM80",    hex:"#4c6030", barcode:"" },
  { id:"71.266", brand:"vallejo", line:"Model Air", name:"Dark Blue RLM24",      hex:"#182068", barcode:"" },
  { id:"71.267", brand:"vallejo", line:"Model Air", name:"Light Green RLM25",    hex:"#90a860", barcode:"" },
  { id:"71.268", brand:"vallejo", line:"Model Air", name:"German Grey",          hex:"#484840", barcode:"" },
  { id:"71.269", brand:"vallejo", line:"Model Air", name:"Red",                  hex:"#b82010", barcode:"" },
  { id:"71.270", brand:"vallejo", line:"Model Air", name:"Off-White",            hex:"#e8e0c8", barcode:"" },
  { id:"71.271", brand:"vallejo", line:"Model Air", name:"German Red Brown",     hex:"#9c4838", barcode:"" },
  { id:"71.272", brand:"vallejo", line:"Model Air", name:"German Yellow Brown",  hex:"#906828", barcode:"" },
  { id:"71.273", brand:"vallejo", line:"Model Air", name:"Ocean Grey",           hex:"#808898", barcode:"" },
  { id:"71.274", brand:"vallejo", line:"Model Air", name:"Aggressor Grey",       hex:"#808888", barcode:"" },
  { id:"71.275", brand:"vallejo", line:"Model Air", name:"USAF Medium Grey",     hex:"#909898", barcode:"" },
  { id:"71.276", brand:"vallejo", line:"Model Air", name:"USAF Light Grey",      hex:"#c0c8d0", barcode:"" },
  { id:"71.277", brand:"vallejo", line:"Model Air", name:"Dark Gull Grey",       hex:"#707880", barcode:"" },
  { id:"71.278", brand:"vallejo", line:"Model Air", name:"Sand Yellow RLM79",    hex:"#c8b870", barcode:"" },
  { id:"71.279", brand:"vallejo", line:"Model Air", name:"Insignia White",       hex:"#f0efe8", barcode:"" },
  { id:"71.280", brand:"vallejo", line:"Model Air", name:"Camouflage Grey",      hex:"#909898", barcode:"" },
  { id:"71.281", brand:"vallejo", line:"Model Air", name:"3B Russian Green",     hex:"#486030", barcode:"" },
  { id:"71.282", brand:"vallejo", line:"Model Air", name:"6K Russian Brown",     hex:"#5c3820", barcode:"" },
  { id:"71.283", brand:"vallejo", line:"Model Air", name:"7K Russian Tan",       hex:"#b08050", barcode:"" },
  { id:"71.284", brand:"vallejo", line:"Model Air", name:"UK Light Mud",         hex:"#c0a870", barcode:"" },
  { id:"71.285", brand:"vallejo", line:"Model Air", name:"IJA Dark Green",       hex:"#304020", barcode:"" },
  { id:"71.286", brand:"vallejo", line:"Model Air", name:"IJA Olive Green",      hex:"#587040", barcode:"" },
  { id:"71.287", brand:"vallejo", line:"Model Air", name:"IJA Khaki Brown",      hex:"#907048", barcode:"" },
  { id:"71.288", brand:"vallejo", line:"Model Air", name:"UK BSC 64 Portland Stone",hex:"#c8b888", barcode:"" },
  { id:"71.289", brand:"vallejo", line:"Model Air", name:"US Dark Green",        hex:"#2c4818", barcode:"" },
  { id:"71.290", brand:"vallejo", line:"Model Air", name:"US Earth Brown",       hex:"#806040", barcode:"" },
  { id:"71.291", brand:"vallejo", line:"Model Air", name:"US Earth Yellow",      hex:"#c8a850", barcode:"" },
  { id:"71.292", brand:"vallejo", line:"Model Air", name:"US Loam",              hex:"#907058", barcode:"" },
  { id:"71.293", brand:"vallejo", line:"Model Air", name:"US Earth Red",         hex:"#983828", barcode:"" },
  { id:"71.294", brand:"vallejo", line:"Model Air", name:"US Forest Green",      hex:"#304828", barcode:"" },
  { id:"71.295", brand:"vallejo", line:"Model Air", name:"USN Sea Blue",         hex:"#1c3060", barcode:"" },
  { id:"71.296", brand:"vallejo", line:"Model Air", name:"USAAF Light Grey",     hex:"#b8c0c8", barcode:"" },
  { id:"71.297", brand:"vallejo", line:"Model Air", name:"JGSD Brown 3606",      hex:"#6c5038", barcode:"" },
  { id:"71.298", brand:"vallejo", line:"Model Air", name:"M495 Light Grey",      hex:"#b0b8c0", barcode:"" },
  { id:"71.299", brand:"vallejo", line:"Model Air", name:"Intermediate Blue",    hex:"#4870a8", barcode:"" },
  { id:"71.300", brand:"vallejo", line:"Model Air", name:"Glossy Sea Blue",      hex:"#1c3878", barcode:"" },
  { id:"71.301", brand:"vallejo", line:"Model Air", name:"AMT-4 Camouflage Green",hex:"#305028", barcode:"" },
  { id:"71.302", brand:"vallejo", line:"Model Air", name:"Sky Type S",           hex:"#70a068", barcode:"" },
  { id:"71.303", brand:"vallejo", line:"Model Air", name:"A-24M Camouflage Green",hex:"#3c5820", barcode:"" },
  { id:"71.304", brand:"vallejo", line:"Model Air", name:"AMT-11 Blue Grey",     hex:"#406838", barcode:"" },
  { id:"71.305", brand:"vallejo", line:"Model Air", name:"Interior Grey Green",  hex:"#808890", barcode:"" },
  { id:"71.306", brand:"vallejo", line:"Model Air", name:"Sky Blue",             hex:"#d8e0e8", barcode:"" },
  { id:"71.307", brand:"vallejo", line:"Model Air", name:"BS Medium Sea Grey",   hex:"#788898", barcode:"" },
  { id:"71.308", brand:"vallejo", line:"Model Air", name:"AMT-12 Dark Grey",     hex:"#606870", barcode:"" },
  { id:"71.309", brand:"vallejo", line:"Model Air", name:"Dark Slate Grey",      hex:"#304020", barcode:"" },
  { id:"71.310", brand:"vallejo", line:"Model Air", name:"IJN Deep Dark Green",  hex:"#909898", barcode:"" },
  { id:"71.311", brand:"vallejo", line:"Model Air", name:"IJN Ash Grey",         hex:"#606870", barcode:"" },
  { id:"71.312", brand:"vallejo", line:"Model Air", name:"IJN Medium Grey",      hex:"#708088", barcode:"" },
  { id:"71.313", brand:"vallejo", line:"Model Air", name:"Dark Mediterranean Blue",hex:"#6888a8", barcode:"" },
  { id:"71.314", brand:"vallejo", line:"Model Air", name:"Seaplane Grey",        hex:"#506878", barcode:"" },
  { id:"71.315", brand:"vallejo", line:"Model Air", name:"Tire Black",           hex:"#403830", barcode:"" },
  { id:"71.316", brand:"vallejo", line:"Model Air", name:"No.41 Dark Olive Drab",hex:"#485828", barcode:"" },
  { id:"71.317", brand:"vallejo", line:"Model Air", name:"AII SV Gol Light Blue",hex:"#506840", barcode:"" },
  { id:"71.318", brand:"vallejo", line:"Model Air", name:"AMT-7 Greyish Blue",   hex:"#7898c0", barcode:"" },
  { id:"71.319", brand:"vallejo", line:"Model Air", name:"A-28M Greyish Blue",   hex:"#80a878", barcode:"" },
  { id:"71.320", brand:"vallejo", line:"Model Air", name:"AMT-1 Light Grey Brown",hex:"#485828", barcode:"" },
  { id:"71.321", brand:"vallejo", line:"Model Air", name:"IJA Light Grey Green", hex:"#608048", barcode:"" },
  { id:"71.322", brand:"vallejo", line:"Model Air", name:"IJN Black Green",      hex:"#304818", barcode:"" },
  { id:"71.323", brand:"vallejo", line:"Model Air", name:"BS Dark Earth",        hex:"#7c5030", barcode:"" },
  { id:"71.324", brand:"vallejo", line:"Model Air", name:"BS Dark Green",        hex:"#407040", barcode:"" },
  { id:"71.325", brand:"vallejo", line:"Model Air", name:"IJN Dark Black Green", hex:"#406830", barcode:"" },
  { id:"71.326", brand:"vallejo", line:"Model Air", name:"IJA Grey Green",       hex:"#507038", barcode:"" },
  { id:"71.327", brand:"vallejo", line:"Model Air", name:"IAF Sand",             hex:"#405828", barcode:"" },
  { id:"71.328", brand:"vallejo", line:"Model Air", name:"Light Blue",           hex:"#d0b880", barcode:"" },
  { id:"71.329", brand:"vallejo", line:"Model Air", name:"Green",                hex:"#406830", barcode:"" },
  { id:"71.330", brand:"vallejo", line:"Model Air", name:"Khaki Green No.3",     hex:"#807858", barcode:"" },
  { id:"71.331", brand:"vallejo", line:"Model Air", name:"Cockpit Interior Green Faded",hex:"#808870", barcode:"" },
  { id:"71.332", brand:"vallejo", line:"Model Air", name:"Undersurface Blue Faded",hex:"#8098b0", barcode:"" },
  { id:"71.333", brand:"vallejo", line:"Model Air", name:"Russian AF Blue",      hex:"#3868a8", barcode:"" },
  { id:"71.334", brand:"vallejo", line:"Model Air", name:"Flanker Light Blue",   hex:"#8098c8", barcode:"" },
  { id:"71.335", brand:"vallejo", line:"Model Air", name:"Flanker Light Grey",   hex:"#9098a8", barcode:"" },
  { id:"71.336", brand:"vallejo", line:"Model Air", name:"A-14 Steel Grey",      hex:"#808898", barcode:"" },
  { id:"71.337", brand:"vallejo", line:"Model Air", name:"Flanker Blue",         hex:"#304890", barcode:"" },
  { id:"71.338", brand:"vallejo", line:"Model Air", name:"Russian AF Grey Blue", hex:"#607090", barcode:"" },
  { id:"71.339", brand:"vallejo", line:"Model Air", name:"Russian AF Grey No.3", hex:"#7880a0", barcode:"" },
  { id:"71.340", brand:"vallejo", line:"Model Air", name:"Grey Green",           hex:"#708070", barcode:"" },
  { id:"71.341", brand:"vallejo", line:"Model Air", name:"Green Grey",           hex:"#788070", barcode:"" },
  { id:"71.342", brand:"vallejo", line:"Model Air", name:"Russian AF Light Blue",hex:"#88a8c8", barcode:"" },
  { id:"71.343", brand:"vallejo", line:"Model Air", name:"Russian AF Grey No.7", hex:"#808898", barcode:"" },
  { id:"71.344", brand:"vallejo", line:"Model Air", name:"Russian AF Grey Protective Coat",hex:"#708070", barcode:"" },
  { id:"71.345", brand:"vallejo", line:"Model Air", name:"Russian AF Grey No.8", hex:"#707880", barcode:"" },
  { id:"71.346", brand:"vallejo", line:"Model Air", name:"Russian AF Grey No.4", hex:"#7080a0", barcode:"" },
  { id:"71.347", brand:"vallejo", line:"Model Air", name:"Russian AF Dark Green", hex:"#385030", barcode:"" },
  { id:"71.348", brand:"vallejo", line:"Model Air", name:"USAF Tan",             hex:"#c0a060", barcode:"" },
  // ── VALLEJO METAL COLOR (77.xxx) ─────────────────────────────────────────
  { id:"77.701", brand:"vallejo", line:"Metal Color", name:"Aluminium",       hex:"#c8ccd4", barcode:"" },
  { id:"77.702", brand:"vallejo", line:"Metal Color", name:"Duraluminium",    hex:"#a8b0b8", barcode:"" },
  { id:"77.703", brand:"vallejo", line:"Metal Color", name:"Dark Aluminium",  hex:"#888e94", barcode:"" },
  { id:"77.704", brand:"vallejo", line:"Metal Color", name:"Pale Burnt Metal",hex:"#a89088", barcode:"" },
  { id:"77.706", brand:"vallejo", line:"Metal Color", name:"White Aluminium", hex:"#d8e0e8", barcode:"" },
  { id:"77.707", brand:"vallejo", line:"Metal Color", name:"Chrome",          hex:"#dce8f0", barcode:"" },
  { id:"77.710", brand:"vallejo", line:"Metal Color", name:"Copper",          hex:"#b06830", barcode:"" },
  { id:"77.711", brand:"vallejo", line:"Metal Color", name:"Magnesium",       hex:"#c8c8c0", barcode:"" },
  { id:"77.712", brand:"vallejo", line:"Metal Color", name:"Steel",           hex:"#909898", barcode:"" },
  { id:"77.713", brand:"vallejo", line:"Metal Color", name:"Jet Exhaust",     hex:"#504850", barcode:"" },
  { id:"77.716", brand:"vallejo", line:"Metal Color", name:"Semi Matt Aluminium",hex:"#b0b8c0",barcode:"" },
  { id:"77.717", brand:"vallejo", line:"Metal Color", name:"Dull Aluminium",  hex:"#989fa8", barcode:"" },
  { id:"77.720", brand:"vallejo", line:"Metal Color", name:"Gunmetal Grey",   hex:"#485870", barcode:"" },
  { id:"77.721", brand:"vallejo", line:"Metal Color", name:"Burnt Iron",      hex:"#3c3840", barcode:"" },
  { id:"77.723", brand:"vallejo", line:"Metal Color", name:"Exhaust Manifold",hex:"#6a3820", barcode:"" },
  { id:"77.724", brand:"vallejo", line:"Metal Color", name:"Gold",            hex:"#c0c8d0", barcode:"" },
  { id:"77.725", brand:"vallejo", line:"Metal Color", name:"Brass",           hex:"#c89820", barcode:"" },
  // ── VALLEJO MECHA COLOR (69.xxx) ─────────────────────────────────────────
  // Hex values matched from official Vallejo website swatches (pages 1–5) + Rev03 pamphlet
  // ── Whites / Off-whites ──
  { id:"69.001", brand:"vallejo", line:"Mecha Color", name:"Pure White",        hex:"#f5f5f5", barcode:"" },
  { id:"69.002", brand:"vallejo", line:"Mecha Color", name:"White Grey",        hex:"#d8d8d0", barcode:"" },
  { id:"69.003", brand:"vallejo", line:"Mecha Color", name:"Off-White",         hex:"#e6dfc8", barcode:"" },
  // ── Yellows / Oranges ──
  { id:"69.004", brand:"vallejo", line:"Mecha Color", name:"Yellow",            hex:"#f0c800", barcode:"" },
  { id:"69.007", brand:"vallejo", line:"Mecha Color", name:"Orange",            hex:"#e05810", barcode:"" },
  // ── Reds / Pinks ──
  { id:"69.005", brand:"vallejo", line:"Mecha Color", name:"Light Flesh",       hex:"#dba882", barcode:"" },
  { id:"69.006", brand:"vallejo", line:"Mecha Color", name:"Pink",              hex:"#d85888", barcode:"" },
  { id:"69.008", brand:"vallejo", line:"Mecha Color", name:"Red",               hex:"#c21018", barcode:"" },
  { id:"69.009", brand:"vallejo", line:"Mecha Color", name:"Sz Red",            hex:"#b00820", barcode:"" },
  { id:"69.010", brand:"vallejo", line:"Mecha Color", name:"Magenta",           hex:"#b80068", barcode:"" },
  { id:"69.011", brand:"vallejo", line:"Mecha Color", name:"Dark Red",          hex:"#700010", barcode:"" },
  { id:"69.012", brand:"vallejo", line:"Mecha Color", name:"Purple",            hex:"#501490", barcode:"" },
  // ── Blues ──
  { id:"69.013", brand:"vallejo", line:"Mecha Color", name:"Titan Blue",        hex:"#1a1e60", barcode:"" },
  { id:"69.014", brand:"vallejo", line:"Mecha Color", name:"Grey Green",        hex:"#607060", barcode:"" },
  { id:"69.015", brand:"vallejo", line:"Mecha Color", name:"Blue Grey",         hex:"#607090", barcode:"" },
  { id:"69.016", brand:"vallejo", line:"Mecha Color", name:"Light Blue",        hex:"#80a8d0", barcode:"" },
  { id:"69.017", brand:"vallejo", line:"Mecha Color", name:"Sky Blue",          hex:"#4888c0", barcode:"" },
  { id:"69.018", brand:"vallejo", line:"Mecha Color", name:"Deep Blue",         hex:"#141858", barcode:"" },
  { id:"69.019", brand:"vallejo", line:"Mecha Color", name:"Blue",              hex:"#1638b8", barcode:"" },
  { id:"69.020", brand:"vallejo", line:"Mecha Color", name:"Electric Blue",     hex:"#0048e0", barcode:"" },
  { id:"69.021", brand:"vallejo", line:"Mecha Color", name:"Dark Blue",         hex:"#0c1440", barcode:"" },
  { id:"69.022", brand:"vallejo", line:"Mecha Color", name:"Titan Dark Blue",   hex:"#080a20", barcode:"" },
  { id:"69.023", brand:"vallejo", line:"Mecha Color", name:"Turquoise",         hex:"#008080", barcode:"" },
  // ── Greys / Greens / Earth tones ──
  { id:"69.024", brand:"vallejo", line:"Mecha Color", name:"Stone Grey",        hex:"#909080", barcode:"" },
  { id:"69.025", brand:"vallejo", line:"Mecha Color", name:"Light Green",       hex:"#60b060", barcode:"" },
  { id:"69.026", brand:"vallejo", line:"Mecha Color", name:"Green",             hex:"#208820", barcode:"" },
  { id:"69.027", brand:"vallejo", line:"Mecha Color", name:"Green Blue",        hex:"#207870", barcode:"" },
  { id:"69.028", brand:"vallejo", line:"Mecha Color", name:"Olive Green",       hex:"#566818", barcode:"" },
  { id:"69.029", brand:"vallejo", line:"Mecha Color", name:"Deep Green",        hex:"#154818", barcode:"" },
  { id:"69.030", brand:"vallejo", line:"Mecha Color", name:"Dark Green",        hex:"#122810", barcode:"" },
  { id:"69.031", brand:"vallejo", line:"Mecha Color", name:"Grey Sand",         hex:"#b0a888", barcode:"" },
  { id:"69.032", brand:"vallejo", line:"Mecha Color", name:"Yellow Ochre",      hex:"#b88020", barcode:"" },
  { id:"69.033", brand:"vallejo", line:"Mecha Color", name:"Sand Yellow",       hex:"#c09848", barcode:"" },
  { id:"69.034", brand:"vallejo", line:"Mecha Color", name:"Brown",             hex:"#703020", barcode:"" },
  { id:"69.035", brand:"vallejo", line:"Mecha Color", name:"Chipping Brown",    hex:"#502010", barcode:"" },
  { id:"69.036", brand:"vallejo", line:"Mecha Color", name:"Light Grey",        hex:"#b0b0a8", barcode:"" },
  { id:"69.037", brand:"vallejo", line:"Mecha Color", name:"Grey",              hex:"#787870", barcode:"" },
  { id:"69.038", brand:"vallejo", line:"Mecha Color", name:"Medium Grey",       hex:"#585850", barcode:"" },
  { id:"69.039", brand:"vallejo", line:"Mecha Color", name:"Grey Z",            hex:"#505460", barcode:"" },
  { id:"69.040", brand:"vallejo", line:"Mecha Color", name:"Phantom Grey",      hex:"#404050", barcode:"" },
  { id:"69.041", brand:"vallejo", line:"Mecha Color", name:"Dark Grey Green",   hex:"#303828", barcode:"" },
  { id:"69.042", brand:"vallejo", line:"Mecha Color", name:"Pure Black",        hex:"#0a0a0a", barcode:"" },
  // ── Fluorescents ──
  { id:"69.054", brand:"vallejo", line:"Mecha Color", name:"Yellow Fluorescent",  hex:"#ffe000", barcode:"" },
  { id:"69.055", brand:"vallejo", line:"Mecha Color", name:"Orange Fluorescent",  hex:"#ff5800", barcode:"" },
  { id:"69.056", brand:"vallejo", line:"Mecha Color", name:"Magenta Fluorescent", hex:"#f00090", barcode:"" },
  { id:"69.057", brand:"vallejo", line:"Mecha Color", name:"Green Fluorescent",   hex:"#30e030", barcode:"" },
  // ── Metallics ──
  { id:"69.058", brand:"vallejo", line:"Mecha Color", name:"Gunmetal",          hex:"#4a5c68", barcode:"" },
  { id:"69.059", brand:"vallejo", line:"Mecha Color", name:"Gold",              hex:"#c08010", barcode:"" },
  { id:"69.060", brand:"vallejo", line:"Mecha Color", name:"Old Gold",          hex:"#906808", barcode:"" },
  { id:"69.061", brand:"vallejo", line:"Mecha Color", name:"Copper",            hex:"#a85020", barcode:"" },
  { id:"69.062", brand:"vallejo", line:"Mecha Color", name:"Bronze",            hex:"#905810", barcode:"" },
  { id:"69.063", brand:"vallejo", line:"Mecha Color", name:"Steel",             hex:"#808888", barcode:"" },
  { id:"69.064", brand:"vallejo", line:"Mecha Color", name:"Light Steel",       hex:"#a0a8b0", barcode:"" },
  { id:"69.065", brand:"vallejo", line:"Mecha Color", name:"Dark Steel",        hex:"#606868", barcode:"" },
  { id:"69.066", brand:"vallejo", line:"Mecha Color", name:"Metallic Red",      hex:"#b81828", barcode:"" },
  { id:"69.067", brand:"vallejo", line:"Mecha Color", name:"Metallic Blue",     hex:"#1c3898", barcode:"" },
  { id:"69.068", brand:"vallejo", line:"Mecha Color", name:"Metallic Green",    hex:"#208030", barcode:"" },
  // ── Mecha Primers ──
  { id:"70.640", brand:"vallejo", line:"Vallejo Primer", name:"White",             hex:"#eeeeee", barcode:"" },
  { id:"70.641", brand:"vallejo", line:"Vallejo Primer", name:"Grey",              hex:"#888888", barcode:"" },
  { id:"70.642", brand:"vallejo", line:"Vallejo Primer", name:"Black",             hex:"#141414", barcode:"" },
  { id:"70.643", brand:"vallejo", line:"Vallejo Primer", name:"Ivory",             hex:"#e8ddb8", barcode:"" },
  { id:"70.644", brand:"vallejo", line:"Vallejo Primer", name:"Sand",              hex:"#c4b06a", barcode:"" },
  // ── KALEIDO PRIMERS (KP2xx) ───────────────────────────────────────────────
  { id:"KP201", brand:"kaleido", line:"Kaleido Primer", name:"Primer White",      hex:"#f0f0f0", barcode:"" },
  { id:"KP202", brand:"kaleido", line:"Kaleido Primer", name:"Primer Gray",       hex:"#888888", barcode:"" },
  { id:"KP203", brand:"kaleido", line:"Kaleido Primer", name:"Primer Black",      hex:"#141414", barcode:"" },
  { id:"KP204", brand:"kaleido", line:"Kaleido Primer", name:"Gloss Black Primer",hex:"#0a0a0a", barcode:"" },
  // ── KALEIDO VARNISHES (KV2xx) ─────────────────────────────────────────────
  { id:"KV201", brand:"kaleido", line:"Kaleido Varnish", name:"Varnish Gloss",    hex:"#d8e8f0", barcode:"" },
  { id:"KV202", brand:"kaleido", line:"Kaleido Varnish", name:"Varnish Semi-Gloss",hex:"#d8e8f0", barcode:"" },
  { id:"KV203", brand:"kaleido", line:"Kaleido Varnish", name:"Varnish Matt",     hex:"#d8e8f0", barcode:"" },
  // ── Mecha Washes ──
  { id:"69.505", brand:"vallejo", line:"Vallejo Wash", name:"Light Rust Wash",          hex:"#c07038", barcode:"" },
  { id:"69.507", brand:"vallejo", line:"Vallejo Wash", name:"Dark Rust Wash",           hex:"#984818", barcode:"" },
  { id:"69.515", brand:"vallejo", line:"Vallejo Wash", name:"Light Grey Wash",          hex:"#b8b8b0", barcode:"" },
  { id:"69.518", brand:"vallejo", line:"Vallejo Wash", name:"Black Wash",               hex:"#0c0c0c", barcode:"" },
  { id:"69.521", brand:"vallejo", line:"Vallejo Wash", name:"Oiled Earth Wash",         hex:"#886028", barcode:"" },
  { id:"69.522", brand:"vallejo", line:"Vallejo Wash", name:"Desert Dust Wash",         hex:"#c8a050", barcode:"" },
  // ── Mecha Weathering ──
  { id:"69.813", brand:"vallejo", line:"Vallejo Weathering", name:"Oil Stains (Gloss)",       hex:"#a07010", barcode:"" },
  { id:"69.814", brand:"vallejo", line:"Vallejo Weathering", name:"Fuel Stains (Gloss)",      hex:"#b88020", barcode:"" },
  { id:"69.817", brand:"vallejo", line:"Vallejo Weathering", name:"Petrol Spills (Gloss)",    hex:"#14160c", barcode:"" },
  { id:"69.818", brand:"vallejo", line:"Vallejo Weathering", name:"Brown Engine Soot (Matt)", hex:"#603410", barcode:"" },
  { id:"69.821", brand:"vallejo", line:"Vallejo Weathering", name:"Rust Texture (Matt)",      hex:"#a03c10", barcode:"" },
  // ── Mecha Varnishes ──
  { id:"69.701", brand:"vallejo", line:"Vallejo Varnish", name:"Mecha Gloss Varnish",         hex:"#d8e8f0", barcode:"" },
  { id:"69.702", brand:"vallejo", line:"Vallejo Varnish", name:"Mecha Matt Varnish",          hex:"#d8e8f0", barcode:"" },
  { id:"69.703", brand:"vallejo", line:"Vallejo Varnish", name:"Mecha Satin Varnish",         hex:"#d8e8f0", barcode:"" },
  // ── VALLEJO TRUE METALLIC METAL (77.1xx Base colours) ────────────────────
  { id:"70.121", brand:"vallejo", line:"True Metal", name:"Sterling Silver",   hex:"#c0c8d4", barcode:"" },
  { id:"70.122", brand:"vallejo", line:"True Metal", name:"Radiant Yellow",    hex:"#c89020", barcode:"" },
  { id:"70.123", brand:"vallejo", line:"True Metal", name:"Imperial Gold",     hex:"#b87810", barcode:"" },
  { id:"70.124", brand:"vallejo", line:"True Metal", name:"Ancient Copper",    hex:"#a85830", barcode:"" },
  { id:"70.125", brand:"vallejo", line:"True Metal", name:"Forged Red",        hex:"#b02828", barcode:"" },
  { id:"70.126", brand:"vallejo", line:"True Metal", name:"Ruby Red",          hex:"#aa1020", barcode:"" },
  { id:"70.127", brand:"vallejo", line:"True Metal", name:"Crimson Magenta",   hex:"#aa0848", barcode:"" },
  { id:"70.128", brand:"vallejo", line:"True Metal", name:"Amethyst Purple",   hex:"#7028a8", barcode:"" },
  { id:"70.129", brand:"vallejo", line:"True Metal", name:"Celestial Violet",  hex:"#582098", barcode:"" },
  { id:"70.130", brand:"vallejo", line:"True Metal", name:"Ultramarine Blue",  hex:"#2040b8", barcode:"" },
  { id:"70.131", brand:"vallejo", line:"True Metal", name:"Sapphire Blue",     hex:"#0830b0", barcode:"" },
  { id:"70.132", brand:"vallejo", line:"True Metal", name:"Hydra Turquoise",   hex:"#107888", barcode:"" },
  { id:"70.133", brand:"vallejo", line:"True Metal", name:"Beetle Green",      hex:"#207848", barcode:"" },
  { id:"70.134", brand:"vallejo", line:"True Metal", name:"Dusken Green",      hex:"#307038", barcode:"" },
  { id:"70.135", brand:"vallejo", line:"True Metal", name:"Amber Green",       hex:"#609018", barcode:"" },
  { id:"70.136", brand:"vallejo", line:"True Metal", name:"Greenish Gold",     hex:"#889010", barcode:"" },
  { id:"70.137", brand:"vallejo", line:"True Metal", name:"Arcane Gold",       hex:"#a88018", barcode:"" },
  { id:"70.138", brand:"vallejo", line:"True Metal", name:"Rusty Metal",       hex:"#884028", barcode:"" },
  { id:"70.139", brand:"vallejo", line:"True Metal", name:"Aged Metal",        hex:"#607078", barcode:"" },
  { id:"70.140", brand:"vallejo", line:"True Metal", name:"Obsidian Black",    hex:"#202028", barcode:"" },
];


function mixColors(components, paints) {
  if (!components.length) return "#333";

  // Level 2 Kubelka-Munk with gamma correction
  // Screens use gamma-compressed sRGB — we linearise before mixing for accuracy

  function hexToLinear(hex) {
    const h = hex.replace("#","");
    return [
      parseInt(h.slice(0,2),16)/255,
      parseInt(h.slice(2,4),16)/255,
      parseInt(h.slice(4,6),16)/255
    ].map(c => c <= 0.04045 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4));
  }

  function linearToSrgb(linear) {
    return linear.map(c => {
      const cl = Math.max(0, Math.min(1, c));
      return cl <= 0.0031308 ? cl * 12.92 : 1.055 * Math.pow(cl, 1/2.4) - 0.055;
    });
  }

  // K/S ratio from linear reflectance
  function toKS(rgb) {
    return rgb.map(c => {
      const r = Math.max(0.001, Math.min(0.999, c));
      return (1 - r) * (1 - r) / (2 * r);
    });
  }

  // Reflectance from K/S
  function fromKS(ks) {
    return ks.map(k => 1 + k - Math.sqrt(k * k + 2 * k));
  }

  let totalDrops = 0;
  const mixedKS = [0, 0, 0];

  components.forEach(({paintId, drops}) => {
    const p = paints.find(x => x.id === paintId);
    if (!p?.hex) return;
    const linear = hexToLinear(p.hex);
    const ks = toKS(linear);
    // Weight by drops — more drops = stronger pigment contribution
    mixedKS[0] += ks[0] * drops;
    mixedKS[1] += ks[1] * drops;
    mixedKS[2] += ks[2] * drops;
    totalDrops += drops;
  });

  if (!totalDrops) return "#333";

  const avgKS = mixedKS.map(k => k / totalDrops);
  const linearMix = fromKS(avgKS);
  const srgb = linearToSrgb(linearMix);
  const r = Math.round(srgb[0] * 255);
  const g = Math.round(srgb[1] * 255);
  const b = Math.round(srgb[2] * 255);
  return `rgb(${r},${g},${b})`;
}

function Badge({children,color=T.orange,small=false}){
  return <span style={{display:"inline-block",background:color,color:"#000",fontWeight:900,
    fontSize:small?9:11,letterSpacing:1.5,textTransform:"uppercase",
    padding:small?"2px 8px":"3px 10px",
    borderRadius:20}}>{children}</span>;
}

function SectionHeader({children,right}){
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:4,height:18,background:T.orange,flexShrink:0}}/>
        <span style={{fontWeight:900,fontSize:13,letterSpacing:2,textTransform:"uppercase",color:T.white}}>{children}</span>
      </div>
      {right}
    </div>
  );
}

function Card({children,style={},accent=false,onClick,className=""}){
  const [hov,setHov]=useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      className={className}
      style={{background:T.card,border:`1px solid ${hov&&onClick?T.orange:accent?T.orange:T.border}`,
        borderRadius:12,position:"relative",cursor:onClick?"pointer":"default",transition:"border-color .15s",...style}}>
      <div style={{position:"absolute",top:-1,right:-1,width:12,height:12,borderTop:`3px solid ${T.orange}`,borderRight:`3px solid ${T.orange}`,borderTopRightRadius:12}}/>
      <div style={{position:"absolute",bottom:-1,left:-1,width:12,height:12,borderBottom:`3px solid ${T.orange}`,borderLeft:`3px solid ${T.orange}`,borderBottomLeftRadius:12}}/>
      {children}
    </div>
  );
}

function Btn({children,onClick,color=T.orange,disabled=false,small=false,full=false}){
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background:disabled?"transparent":color,
      border:`1px solid ${disabled?T.orange:color}`,
      color:disabled?T.orange:"#000",
      fontWeight:900,fontSize:small?11:13,letterSpacing:1,textTransform:"uppercase",
      padding:small?"5px 14px":full?"13px":"8px 18px",width:full?"100%":"auto",
      cursor:disabled?"default":"pointer",borderRadius:10,
      transition:"all .2s"}}>
      {children}
    </button>
  );
}

function GhostBtn({children,onClick,color=T.orange,small=false}){
  const cls=color===T.red?"outline-btn-red":color===T.yellow?"outline-btn-yellow":color===T.green?"outline-btn-green":color===T.dim||color==="#555"?"outline-btn-dim":"outline-btn";
  return (
    <button onClick={onClick} className={`ghost-btn ${cls}`} style={{background:T.surface,border:`1px solid ${color}`,color,
      fontWeight:700,fontSize:small?11:12,letterSpacing:1,textTransform:"uppercase",
      padding:small?"4px 10px":"6px 14px",cursor:"pointer",borderRadius:8,transition:"all .15s"}}>{children}</button>
  );
}

function Toggle({on,onToggle,label}){
  return (
    <button onClick={onToggle} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",cursor:"pointer",padding:0}}>
      <div style={{width:44,height:26,borderRadius:13,border:`1px solid ${on?T.orange:T.border}`,
        background:on?"rgba(212,245,74,.1)":"transparent",position:"relative",transition:"all .2s",flexShrink:0}}>
        <div style={{position:"absolute",top:3,left:on?20:3,width:16,height:16,borderRadius:"50%",
          background:on?T.orange:T.dim,transition:"left .2s",boxShadow:on?`0 0 6px ${T.orange}`:"none"}}/>
      </div>
      <span style={{color:on?T.white:T.dim,fontSize:12,fontWeight:700,letterSpacing:.5,textTransform:"uppercase",whiteSpace:"nowrap"}}>{label}</span>
    </button>
  );
}

function Field({value,onChange,placeholder,mono=false,style={}}){
  return (
    <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{width:"100%",boxSizing:"border-box",background:"#0a0a0a",border:`1px solid ${T.border}`,
        borderRadius:0,padding:"10px 12px",color:T.white,fontSize:13,
        fontFamily:mono?"monospace":T.font,outline:"none",marginBottom:10,...style}}/>
  );
}

function FieldLabel({children}){
  return (
    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
      <div style={{width:3,height:10,background:T.orange}}/>
      <span style={{color:T.orange,fontSize:10,fontWeight:900,letterSpacing:2,textTransform:"uppercase"}}>{children}</span>
    </div>
  );
}

function ProjectPicker({projects,value,onChange}){
  const [search,setSearch]=useState("");
  const [open,setOpen]=useState(false);
  const selected=value==="standalone"?null:projects.find(p=>p.id===value);
  const filtered=[
    {id:"standalone",name:"My Mixes (standalone)",sub:"Not assigned to any project",icon:"📋"},
    ...projects.filter(p=>!search||p.name.toLowerCase().includes(search.toLowerCase()))
      .map(p=>({id:p.id,name:p.name,sub:`${p.mixes.length} mix${p.mixes.length!==1?"es":""}`,icon:"🗂"}))
  ];
  return (
    <div style={{marginBottom:14,position:"relative"}}>
      <button onClick={()=>setOpen(o=>!o)}
        style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"11px 14px",
          border:`1px solid ${value!=="standalone"?T.orange:open?T.orange:T.border}`,
          borderRadius:open?"10px 10px 0 0":10,background:value!=="standalone"?"rgba(212,245,74,.05)":"#0a0a0a",
          cursor:"pointer",textAlign:"left",boxSizing:"border-box",transition:"border-color .15s"}}>
        <span style={{fontSize:16}}>{selected?IC.folder:IC.folder}</span>
        <span style={{flex:1,color:value!=="standalone"?T.orange:T.white,fontSize:13,fontWeight:700}}>
          {selected?selected.name:"My Mixes (standalone)"}
        </span>
        <span style={{color:T.dim,fontSize:12}}>{open?"▲":"▼"}</span>
      </button>
      {open&&(
        <div style={{position:"absolute",left:0,right:0,zIndex:50,
          border:`1px solid ${T.orange}`,borderTop:"none",borderRadius:"0 0 10px 10px",
          background:"#0a0a0a",maxHeight:240,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"8px 10px",borderBottom:`1px solid ${T.border}`}}>
            <input autoFocus value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="SEARCH PROJECTS..."
              style={{width:"100%",background:T.bg,border:"none",outline:"none",
                color:T.white,fontSize:12,fontFamily:T.font,fontWeight:700,letterSpacing:.5,boxSizing:"border-box"}}/>
          </div>
          <div style={{overflowY:"auto",flex:1}}>
            {filtered.map(item=>(
              <button key={item.id} onClick={()=>{onChange(item.id);setOpen(false);setSearch("");}}
                style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 14px",
                  border:"none",borderBottom:`1px solid ${T.border}`,
                  background:value===item.id?"rgba(212,245,74,.08)":"transparent",
                  cursor:"pointer",textAlign:"left"}}>
                <span style={{fontSize:15}}>{item.icon}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{color:value===item.id?T.orange:T.white,fontSize:12,fontWeight:700,
                    whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.name}</div>
                  <div style={{color:T.dim,fontSize:10}}>{item.sub}</div>
                </div>
                {value===item.id&&<span style={{color:T.orange,fontSize:13,flexShrink:0}}>✓</span>}
              </button>
            ))}
            {filtered.length===0&&(
              <div style={{padding:"16px",color:T.dimmer,fontSize:11,textAlign:"center",letterSpacing:1,textTransform:"uppercase"}}>No projects found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Sheet({title,badge,onClose,children,footer,toast}){
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",display:"flex",
      alignItems:"flex-end",justifyContent:"center",zIndex:200}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:T.bg,width:"100%",maxWidth:620,borderTop:`4px solid ${T.orange}`,
        maxHeight:"92vh",display:"flex",flexDirection:"column",boxShadow:"0 -24px 80px rgba(0,0,0,.9)",
        borderRadius:"20px 20px 0 0"}}>
        {/* sticky header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"14px 16px",borderBottom:`2px solid ${T.border}`,background:T.surface,
          flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {badge&&<Badge>{badge}</Badge>}
            <span style={{color:T.white,fontWeight:900,fontSize:16,letterSpacing:-.5,textTransform:"uppercase"}}>{title}</span>
          </div>
          <button onClick={onClose} style={{background:T.border,border:"none",color:T.white,
            width:28,height:28,cursor:"pointer",fontSize:14,fontWeight:900,borderRadius:8,
            display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        {/* toast — pinned below header */}
        {toast&&<div style={{flexShrink:0}}>{toast}</div>}
        {/* scrollable body */}
        <div style={{padding:16,overflowY:"auto",overflowX:"hidden",flex:1}}>{children}</div>
        {/* sticky footer */}
        {footer&&(
          <div style={{padding:"12px 16px",background:T.surface,flexShrink:0,borderRadius:"0 0 20px 20px"}}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── LIGHTBOX ─────────────────────────────────────────────────────────────────
function Lightbox({photos,startIndex=0,onClose}){
  const [idx,setIdx]=useState(startIndex);
  const ph=photos[idx];
  function prev(e){e.stopPropagation();setIdx(i=>Math.max(0,i-1));}
  function next(e){e.stopPropagation();setIdx(i=>Math.min(photos.length-1,i+1));}
  useEffect(()=>{
    const h=e=>{
      if(e.key==="ArrowLeft") setIdx(i=>Math.max(0,i-1));
      if(e.key==="ArrowRight") setIdx(i=>Math.min(photos.length-1,i+1));
      if(e.key==="Escape") onClose();
    };
    window.addEventListener("keydown",h);
    return ()=>window.removeEventListener("keydown",h);
  },[]);
  if(!ph) return null;
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.96)",zIndex:999,
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <button onClick={onClose} style={{position:"absolute",top:16,right:16,background:"none",
        border:"none",color:"#fff",fontSize:28,cursor:"pointer",lineHeight:1,zIndex:1}}>✕</button>
      <div style={{position:"absolute",top:20,left:0,right:0,textAlign:"center",
        color:"#666",fontSize:11,letterSpacing:2,textTransform:"uppercase"}}>
        {idx+1} / {photos.length}
      </div>
      <div onClick={e=>e.stopPropagation()} style={{maxWidth:"92vw",maxHeight:"78vh",position:"relative",
        boxShadow:`0 0 0 2px ${T.orange}, 0 30px 80px rgba(0,0,0,.9)`}}>
        <img src={ph.src} alt={ph.name}
          style={{display:"block",maxWidth:"92vw",maxHeight:"78vh",objectFit:"contain"}}/>
        <div style={{position:"absolute",top:-1,left:-1,width:14,height:14,borderTop:`3px solid ${T.orange}`,borderLeft:`3px solid ${T.orange}`}}/>
        <div style={{position:"absolute",top:-1,right:-1,width:14,height:14,borderTop:`3px solid ${T.orange}`,borderRight:`3px solid ${T.orange}`}}/>
        <div style={{position:"absolute",bottom:-1,left:-1,width:14,height:14,borderBottom:`3px solid ${T.orange}`,borderLeft:`3px solid ${T.orange}`}}/>
        <div style={{position:"absolute",bottom:-1,right:-1,width:14,height:14,borderBottom:`3px solid ${T.orange}`,borderRight:`3px solid ${T.orange}`}}/>
      </div>
      {photos.length>1&&(
        <div style={{display:"flex",gap:20,marginTop:20}}>
          <button onClick={prev} disabled={idx===0}
            style={{background:idx===0?"rgba(255,255,255,.05)":"rgba(212,245,74,.1)",
              border:`1px solid ${idx===0?T.border:T.orange}`,color:idx===0?T.dim:T.orange,
              fontWeight:900,fontSize:18,cursor:idx===0?"not-allowed":"pointer",
              width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
          <button onClick={next} disabled={idx===photos.length-1}
            style={{background:idx===photos.length-1?"rgba(255,255,255,.05)":"rgba(212,245,74,.1)",
              border:`1px solid ${idx===photos.length-1?T.border:T.orange}`,color:idx===photos.length-1?T.dim:T.orange,
              fontWeight:900,fontSize:18,cursor:idx===photos.length-1?"not-allowed":"pointer",
              width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center"}}>→</button>
        </div>
      )}
      {photos.length>1&&(
        <div style={{display:"flex",gap:6,marginTop:14,maxWidth:"90vw",overflowX:"auto",paddingBottom:4}}>
          {photos.map((p,i)=>(
            <div key={p.id} onClick={e=>{e.stopPropagation();setIdx(i);}}
              style={{width:48,height:48,flexShrink:0,cursor:"pointer",
                border:`1px solid ${i===idx?T.orange:T.border}`,overflow:"hidden",
                opacity:i===idx?1:.5,transition:"all .15s"}}>
              <img src={p.src} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PhotoPicker({photos=[],onChange}){
  const fileRef=useRef(null);
  const camRef=useRef(null);
  function handleFiles(e){
    [...e.target.files].forEach(file=>{
      const reader=new FileReader();
      reader.onload=ev=>onChange(prev=>[...prev,{id:"ph"+Date.now()+Math.random(),src:ev.target.result,name:file.name}]);
      reader.readAsDataURL(file);
    });
    e.target.value="";
  }
  return (
    <div>
      {photos.length>0&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4,marginBottom:10}}>
          {photos.map(ph=>(
            <div key={ph.id} style={{position:"relative",aspectRatio:"1",background:T.surface,border:`1px solid ${T.border}`,overflow:"hidden"}}>
              <img src={ph.src} alt={ph.name} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
              <div style={{position:"absolute",top:0,right:0,width:8,height:8,borderTop:`2px solid ${T.orange}`,borderRight:`2px solid ${T.orange}`}}/>
              <button onClick={()=>onChange(prev=>prev.filter(p=>p.id!==ph.id))}
                style={{position:"absolute",top:3,left:3,width:20,height:20,background:"rgba(0,0,0,.8)",
                  border:`1px solid ${T.red}`,color:T.red,fontSize:12,cursor:"pointer",
                  display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900}}>✕</button>
            </div>
          ))}
        </div>
      )}
      <div style={{display:"flex",gap:6}}>
        <input ref={camRef} type="file" accept="image/*" capture="environment" onChange={handleFiles} style={{display:"none"}}/>
        <button onClick={()=>camRef.current?.click()} style={{flex:1,background:T.bg,border:`1px solid ${T.orange}`,
          color:T.orange,fontWeight:900,fontSize:11,letterSpacing:1,textTransform:"uppercase",padding:"8px 0",cursor:"pointer",borderRadius:10}}>
          TAKE PHOTO
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} style={{display:"none"}}/>
        <button onClick={()=>fileRef.current?.click()} style={{flex:1,background:T.bg,border:`1px solid ${T.border}`,
          color:T.dim,fontWeight:900,fontSize:11,letterSpacing:1,textTransform:"uppercase",padding:"8px 0",cursor:"pointer",borderRadius:10}}>
          FROM LIBRARY
        </button>
      </div>
      {photos.length===0&&<div style={{textAlign:"center",padding:"12px 0",color:T.dimmer,fontSize:10,letterSpacing:2,textTransform:"uppercase"}}>NO PHOTOS YET</div>}
    </div>
  );
}

// PaintSearch — receives allPaints as prop
function PaintSearch({allPaints,onSelect,brandFilter="all"}){
  const [query,setQuery]=useState("");
  const [open,setOpen]=useState(false);
  const [hi,setHi]=useState(0);
  const wrapRef=useRef(null);
  const inputRef=useRef(null);
  const paints=allPaints||[];

  const results=query.length<1?[]:paints.filter(p=>{
    const bOk=brandFilter==="all"||p.brand===brandFilter;
    if(!bOk) return false;
    const name=p.name.toLowerCase();
    const id=p.id.toLowerCase();
    const line=(p.line||"").toLowerCase();
    const barcode=p.barcode||"";
    const q=query.toLowerCase().trim();
    // Direct substring match
    if(name.includes(q)||id.includes(q)||line.includes(q)||barcode.includes(q)) return true;
    // All words must appear somewhere in name+line (handles "varnish M" and "matt varnish")
    const words=q.split(/\s+/).filter(Boolean);
    const haystack=name+" "+line+" "+id;
    return words.every(w=>haystack.includes(w));
  }).slice(0,18);

  useEffect(()=>setHi(0),[query]);
  useEffect(()=>{
    const h=e=>{if(wrapRef.current&&!wrapRef.current.contains(e.target))setOpen(false);};
    document.addEventListener("mousedown",h);
    return ()=>document.removeEventListener("mousedown",h);
  },[]);

  function pick(paint){onSelect(paint);setQuery("");setOpen(false);}
  function onKey(e){
    if(!open||!results.length) return;
    if(e.key==="ArrowDown"){e.preventDefault();setHi(h=>Math.min(h+1,results.length-1));}
    if(e.key==="ArrowUp"){e.preventDefault();setHi(h=>Math.max(h-1,0));}
    if(e.key==="Enter"){e.preventDefault();pick(results[hi]);}
    if(e.key==="Escape") setOpen(false);
  }

  return (
    <div ref={wrapRef} style={{position:"relative",marginBottom:10}}>
      <div style={{position:"relative"}}>
        <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:13,pointerEvents:"none",opacity:.5}}>⌕</span>
        <input ref={inputRef} value={query} onChange={e=>{setQuery(e.target.value);setOpen(true);}}
          onFocus={()=>{if(query)setOpen(true);}} onKeyDown={onKey}
          placeholder="SEARCH BY NAME, CODE OR BARCODE"
          style={{width:"100%",boxSizing:"border-box",background:"#0a0a0a",border:`1px solid ${T.border}`,
            padding:"10px 36px",color:T.white,fontSize:12,fontWeight:700,letterSpacing:.5,outline:"none",fontFamily:T.font,textTransform:"uppercase"}}/>
        {query&&<button onClick={()=>{setQuery("");setOpen(false);}}
          style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:T.dim,fontSize:16,cursor:"pointer",padding:0}}>✕</button>}
      </div>
      {open&&results.length>0&&(
        <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:999,background:T.card,border:`1px solid ${T.orange}`,
          boxShadow:"0 8px 32px rgba(0,0,0,.9)",maxHeight:260,overflowY:"auto"}}>
          {results.map((p,i)=>{
            const bcMatch=p.barcode&&query.replace(/\s/g,"")&&p.barcode.includes(query.replace(/\s/g,""));
            return (
              <div key={p.id} onMouseDown={()=>pick(p)} onMouseEnter={()=>setHi(i)}
                style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",cursor:"pointer",
                  borderBottom:`1px solid ${T.border}`,background:i===hi?"rgba(212,245,74,.08)":"transparent"}}>
                <div style={{width:32,height:32,borderRadius:8,background:p.hex,border:`1px solid ${T.border}`,flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{color:T.white,fontSize:13,fontWeight:700}}>{p.name}</div>
                  <div style={{display:"flex",gap:6,alignItems:"center",marginTop:1,flexWrap:"wrap"}}>
                    <span style={{color:BRANDS[p.brand]?.color||T.dim,fontSize:10,fontWeight:700,letterSpacing:1}}>{BRANDS[p.brand]?.name}</span>
                    <span style={{color:T.dim,fontSize:10}}>· {p.line}</span>
                    {p.barcode&&<span style={{color:T.dim,fontSize:10,fontFamily:"monospace"}}>▐ {p.barcode}</span>}
                  </div>
                </div>
                <span style={{color:T.dim,fontSize:10,fontFamily:"monospace",flexShrink:0}}>{BRANDS[p.brand]?.name||p.brand} · {p.id}</span>
              </div>
            );
          })}
        </div>
      )}
      {open&&query.length>0&&results.length===0&&(
        <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:999,background:T.card,border:`1px solid ${T.border}`,
          padding:"16px",textAlign:"center",color:T.dim,fontSize:12,letterSpacing:1,textTransform:"uppercase"}}>
          No results for "{query}"
        </div>
      )}
    </div>
  );
}

// ManualBarcodeEntry — receives allPaints as prop
function ManualBarcodeEntry({allPaints,tools,consumables,onFound,onFoundTool,onFoundCon,onTeach,onAddNew,onAddCustom,addNewMode="shop"}){
  const [val,setVal]=useState("");
  const [result,setResult]=useState(null);
  const [filterBrand,setFilterBrand]=useState("all");
  const [filterLine,setFilterLine]=useState("all");
  const paints=allPaints||[];

  // Get unique brands and lines for filter
  const brands=["all",...Object.keys(BRANDS)];
  const lines=["all",...[...new Set(paints.filter(p=>filterBrand==="all"||p.brand===filterBrand).map(p=>p.line))].sort()];

  // Reset line filter when brand changes
  useEffect(()=>setFilterLine("all"),[filterBrand]);

  useEffect(()=>{
    const clean=val.replace(/\s/g,"").replace(/[^0-9a-zA-Z.]/g,"");
    const filtered=paints.filter(p=>
      (filterBrand==="all"||p.brand===filterBrand)&&
      (filterLine==="all"||p.line===filterLine)
    );
    // Show filtered list even without search text
    if(!clean){
      if(filterBrand!=="all"||filterLine!=="all"){
        setResult({found:true,matches:filtered,code:""});
      } else {
        setResult(null);
      }
      return;
    }
    const cleanDigits=val.replace(/\D/g,"");
    // Exact barcode match — paints
    const exactBC=paints.find(p=>p.barcode&&(p.barcode===clean||p.barcode===cleanDigits));
    if(exactBC){setResult({found:true,paint:exactBC,code:cleanDigits||clean});return;}
    // Exact barcode match — tools
    const toolMatch=(tools||[]).find(t=>t.barcode&&(t.barcode===clean||t.barcode===cleanDigits));
    if(toolMatch){setResult({found:true,tool:toolMatch,code:cleanDigits||clean});return;}
    // Exact barcode match — consumables
    const conMatch=(consumables||[]).find(c=>c.barcode&&(c.barcode===clean||c.barcode===cleanDigits));
    if(conMatch){setResult({found:true,con:conMatch,code:cleanDigits||clean});return;}
    // Partial barcode match (pure digits)
    if(cleanDigits.length>=4){
      const partialBC=paints.find(p=>p.barcode&&p.barcode.includes(cleanDigits));
      if(partialBC){setResult({found:true,paint:partialBC,code:cleanDigits});return;}
    }
    // Name/id match — return ALL matches with brand/line filter
    const q=clean.toLowerCase();
    const nameMatches=filtered.filter(p=>p.name.toLowerCase().includes(q)||p.id.toLowerCase().includes(q));
    if(nameMatches.length>0){setResult({found:true,matches:nameMatches,code:clean});return;}
    // No match — show link UI
    if(clean.length>=3) setResult({found:false,code:cleanDigits.length>=8?cleanDigits:clean,isName:!/^\d+$/.test(cleanDigits)||cleanDigits.length<8});
    else setResult(null);
  },[val,filterBrand,filterLine,paints.length,(tools||[]).length,(consumables||[]).length]);

  return (
    <div>
      {/* Brand + Line filters */}
      <div style={{display:"flex",gap:6,marginBottom:6}}>
        <select value={filterBrand} onChange={e=>setFilterBrand(e.target.value)}
          style={{flex:1,background:"#0a0a0a",border:`1px solid ${filterBrand!=="all"?T.orange:T.border}`,
            color:filterBrand!=="all"?T.orange:T.dim,fontSize:11,fontWeight:700,padding:"7px 8px",
            fontFamily:T.font,outline:"none",letterSpacing:.5,textTransform:"uppercase",cursor:"pointer"}}>
          <option value="all">ALL BRANDS</option>
          {Object.entries(BRANDS).map(([k,v])=><option key={k} value={k}>{v.name}</option>)}
        </select>
        <select value={filterLine} onChange={e=>setFilterLine(e.target.value)}
          style={{flex:1,background:"#0a0a0a",border:`1px solid ${filterLine!=="all"?T.orange:T.border}`,
            color:filterLine!=="all"?T.orange:T.dim,fontSize:11,fontWeight:700,padding:"7px 8px",
            fontFamily:T.font,outline:"none",letterSpacing:.5,textTransform:"uppercase",cursor:"pointer"}}>
          <option value="all">ALL LINES</option>
          {lines.filter(l=>l!=="all").map(l=><option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <div style={{position:"relative"}}>
        <input value={val} onChange={e=>setVal(e.target.value)}
          placeholder="TYPE BARCODE NUMBER OR PAINT NAME"
          style={{width:"100%",boxSizing:"border-box",background:"#0a0a0a",
            border:`1px solid ${result?.found?T.green:val.length>0?T.orange:T.border}`,
            padding:"11px 12px",color:T.white,fontSize:13,fontFamily:"monospace",outline:"none",letterSpacing:.5,transition:"border-color .15s"}}/>
        {val&&<button onClick={()=>{setVal("");setResult(null);}}
          style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:T.dim,fontSize:16,cursor:"pointer",padding:0}}>✕</button>}
      </div>
      {result?.found&&result.matches&&(
        <div style={{marginTop:6,border:`1px solid ${T.green}`,padding:"10px 12px",background:"rgba(0,204,102,.05)",borderRadius:10}}>
          <Badge color={T.green}>{result.matches.length} MATCH{result.matches.length>1?"ES":""} FOUND</Badge>
          <div style={{maxHeight:240,overflowY:"auto",marginTop:8,display:"flex",flexDirection:"column",gap:6}}>
            {result.matches.map(p=>(
              <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,background:T.surface,
                border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 10px"}}>
                <div style={{width:28,height:28,background:p.hex,border:`1px solid ${T.border}`,flexShrink:0,borderRadius:5}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{color:T.white,fontSize:12,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</div>
                  <div style={{color:T.dim,fontSize:10}}>{BRANDS[p.brand]?.name||p.brand} · {p.id}</div>
                </div>
                <Btn onClick={()=>onFound(p)} small>ADD</Btn>
              </div>
            ))}
          </div>
        </div>
      )}
      {result?.found&&result.paint&&(
        <div style={{marginTop:6,border:`1px solid ${T.green}`,padding:"10px 12px",background:"rgba(0,204,102,.05)",borderRadius:10}}>
          <Badge color={T.green}>MATCH FOUND</Badge>
          <div style={{display:"flex",alignItems:"center",gap:10,marginTop:8}}>
            <div style={{width:32,height:32,background:result.paint.hex,border:`1px solid ${T.border}`,flexShrink:0,borderRadius:6}}/>
            <div style={{flex:1}}>
              <div style={{color:T.white,fontSize:13,fontWeight:700}}>{result.paint.name}</div>
              <div style={{color:T.dim,fontSize:11}}>{BRANDS[result.paint.brand]?.name} · {result.paint.id}</div>
            </div>
            <Btn onClick={()=>onFound(result.paint)} small>ADD</Btn>
          </div>
        </div>
      )}
      {result?.found&&result.tool&&(
        <div style={{marginTop:6,border:`1px solid ${T.green}`,padding:"10px 12px",background:"rgba(0,204,102,.05)",borderRadius:10}}>
          <Badge color={T.green}>TOOL FOUND</Badge>
          <div style={{display:"flex",alignItems:"center",gap:10,marginTop:8}}>
            <div style={{width:32,height:32,background:T.surface,border:`1px solid ${T.border}`,flexShrink:0,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",color:T.dim}}>{IC.tool}</div>
            <div style={{flex:1}}>
              <div style={{color:T.white,fontSize:13,fontWeight:700}}>{result.tool.name}</div>
              <div style={{color:T.dim,fontSize:11}}>{result.tool.brand||""} · {result.tool.type}</div>
            </div>
            {onFoundTool&&<Btn onClick={()=>onFoundTool(result.tool)} small>VIEW</Btn>}
          </div>
        </div>
      )}
      {result?.found&&result.con&&(
        <div style={{marginTop:6,border:`1px solid ${T.green}`,padding:"10px 12px",background:"rgba(0,204,102,.05)",borderRadius:10}}>
          <Badge color={T.green}>SUPPLY FOUND</Badge>
          <div style={{display:"flex",alignItems:"center",gap:10,marginTop:8}}>
            <div style={{width:32,height:32,background:T.surface,border:`1px solid ${T.border}`,flexShrink:0,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.dim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            </div>
            <div style={{flex:1}}>
              <div style={{color:T.white,fontSize:13,fontWeight:700}}>{result.con.name}</div>
              <div style={{color:T.dim,fontSize:11}}>{result.con.brand||""} · {result.con.type}</div>
            </div>
            {onFoundCon&&<Btn onClick={()=>onFoundCon(result.con)} small>VIEW</Btn>}
          </div>
        </div>
      )}
      {result&&!result.found&&(
        <div style={{marginTop:6,border:`1px solid ${T.yellow}`,borderRadius:10,padding:"10px 12px",background:"rgba(255,208,0,.05)"}}>
          <Badge color={T.yellow}>{result.isName?"NO MATCH FOUND":"NOT IN DATABASE"}</Badge>
          <div style={{color:T.dim,fontSize:11,margin:"6px 0"}}>
            {result.isName
              ?<>No paint named <span style={{color:T.white,fontWeight:700}}>"{val.trim()}"</span> found.</>
              :<>Barcode <span style={{fontFamily:"monospace",color:T.white}}>{result.code}</span> isn't linked yet.</>
            }
          </div>
          {/* Link to existing paint — goes through confirm */}
          {paints.length>0&&(
            <>
              <div style={{color:T.dim,fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Link to existing paint:</div>
              <PaintSearch allPaints={paints} onSelect={p=>{
                if(onTeach) onTeach(result.code,p.id);
                onFound(p);
              }} brandFilter="all"/>
            </>
          )}
          {/* Link to existing tool */}
          {(tools||[]).length>0&&onFoundTool&&(
            <>
              <div style={{color:T.dim,fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:6,marginTop:8}}>Or link to existing tool:</div>
              {(tools||[]).filter(t=>!result.code||t.name.toLowerCase().includes(val.toLowerCase())||true).slice(0,5).map(t=>(
                <button key={t.id} onClick={()=>{
                  if(result.code) onFoundTool({...t,barcode:result.code},true);
                  else onFoundTool(t,false);
                }} style={{display:"flex",alignItems:"center",gap:8,width:"100%",background:T.bg,
                  border:`1px solid ${T.border}`,borderRadius:8,padding:"7px 10px",marginBottom:4,cursor:"pointer",textAlign:"left"}}>
                  <span style={{color:T.dim}}>{IC.tool}</span>
                  <div style={{flex:1}}>
                    <div style={{color:T.white,fontSize:12,fontWeight:700}}>{t.name}</div>
                    <div style={{color:T.dim,fontSize:10}}>{t.brand||""} · {t.type}</div>
                  </div>
                  <span style={{color:T.orange,fontSize:10,fontWeight:700}}>LINK</span>
                </button>
              ))}
            </>
          )}
          {/* Link to existing supply */}
          {(consumables||[]).length>0&&onFoundCon&&(
            <>
              <div style={{color:T.dim,fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:6,marginTop:8}}>Or link to existing supply:</div>
              {(consumables||[]).slice(0,5).map(c=>(
                <button key={c.id} onClick={()=>{
                  if(result.code) onFoundCon({...c,barcode:result.code},true);
                  else onFoundCon(c,false);
                }} style={{display:"flex",alignItems:"center",gap:8,width:"100%",background:T.bg,
                  border:`1px solid ${T.border}`,borderRadius:8,padding:"7px 10px",marginBottom:4,cursor:"pointer",textAlign:"left"}}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.dim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                  <div style={{flex:1}}>
                    <div style={{color:T.white,fontSize:12,fontWeight:700}}>{c.name}</div>
                    <div style={{color:T.dim,fontSize:10}}>{c.brand||""} · {c.type}</div>
                  </div>
                  <span style={{color:T.orange,fontSize:10,fontWeight:700}}>LINK</span>
                </button>
              ))}
            </>
          )}
          {onAddNew&&<AddNewItemForm onAddNew={onAddNew} barcode={result.code} mode={addNewMode}/>}
          {result.isName&&onAddCustom&&(
            <Btn onClick={()=>onAddCustom(val.trim())} small full style={{marginTop:6}}>+ ADD AS CUSTOM PAINT</Btn>
          )}
        </div>
      )}
    </div>
  );
}

// mode="paint" → adds to inventory/collection; mode="shop" → adds to shop list
function AddNewItemForm({onAddNew, barcode, mode="paint"}){
  const [expanded,setExpanded]=useState(false);
  // paint fields
  const [pName,setPName]=useState("");
  const [pBrand,setPBrand]=useState("custom");
  const [pLine,setPLine]=useState("Custom");
  const [pCode,setPCode]=useState("");
  const [pHex,setPHex]=useState("#888888");
  // shop fields
  const [sName,setSName]=useState("");
  const [sBrand,setSBrand]=useState("");
  const [sCat,setSCat]=useState("Paint");

  const isPaint=mode==="paint";
  const canSubmit=isPaint?pName.trim()&&pHex!=="#888888":sName.trim();

  function handleSubmit(){
    if(!canSubmit) return;
    if(isPaint){
      onAddNew({name:pName.trim(),brand:pBrand,line:pLine.trim(),code:pCode.trim(),hex:pHex,barcode});
    } else {
      onAddNew({name:sName.trim(),brand:sBrand.trim(),category:sCat,barcode});
    }
  }

  const inputStyle={background:"#0a0a0a",border:`1px solid ${T.border}`,borderRadius:8,
    padding:"8px 12px",color:T.white,fontSize:12,fontFamily:T.font,outline:"none",
    width:"100%",boxSizing:"border-box"};

  return (
    <div style={{marginTop:8,border:`1px solid ${T.orange}`,borderRadius:10,overflow:"hidden"}}>
      <button onClick={()=>setExpanded(e=>!e)}
        style={{width:"100%",background:"rgba(212,245,74,.06)",border:"none",padding:"9px 14px",
          display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}}>
        <span style={{color:T.orange,fontWeight:900,fontSize:11,letterSpacing:1,textTransform:"uppercase"}}>
          + ADD AS NEW {isPaint?"PAINT":"ITEM"}
        </span>
        <span style={{color:T.orange,fontSize:12}}>{expanded?"▲":"▼"}</span>
      </button>
      {expanded&&(
        <div style={{padding:12,display:"flex",flexDirection:"column",gap:8}}>
          {/* barcode pre-filled display */}
          <div style={{display:"flex",alignItems:"center",gap:8,background:T.surface,border:`1px solid ${T.border}`,
            borderRadius:8,padding:"6px 10px"}}>
            <span style={{color:T.dim,fontSize:10,letterSpacing:1,textTransform:"uppercase",flexShrink:0}}>Barcode</span>
            <span style={{color:T.white,fontSize:11,fontFamily:"monospace",flex:1}}>{barcode}</span>
            <span style={{color:T.green,fontSize:10}}>✓ pre-filled</span>
          </div>

          {isPaint?(
            <>
              <div style={{color:T.dim,fontSize:10,letterSpacing:1,textTransform:"uppercase",marginBottom:-4}}>Brand</div>
              <select value={pBrand} onChange={e=>setPBrand(e.target.value)} style={inputStyle}>
                {Object.entries(BRANDS).map(([k,b])=><option key={k} value={k}>{b.name}</option>)}
              </select>
              <div style={{color:T.dim,fontSize:10,letterSpacing:1,textTransform:"uppercase",marginBottom:-4}}>Line / Range</div>
              <input value={pLine} onChange={e=>setPLine(e.target.value)} placeholder="E.G. GAME COLOR" style={inputStyle}/>
              <div style={{color:T.dim,fontSize:10,letterSpacing:1,textTransform:"uppercase",marginBottom:-4}}>Paint Name *</div>
              <input value={pName} onChange={e=>setPName(e.target.value)} placeholder="E.G. ELECTRIC BLUE" style={inputStyle}/>
              <div style={{color:T.dim,fontSize:10,letterSpacing:1,textTransform:"uppercase",marginBottom:-4}}>Code / SKU</div>
              <input value={pCode} onChange={e=>setPCode(e.target.value)} placeholder="E.G. 72.023 (optional)" style={inputStyle}/>
              <div style={{color:T.dim,fontSize:10,letterSpacing:1,textTransform:"uppercase",marginBottom:-4}}>Colour *</div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <input type="color" value={pHex} onChange={e=>setPHex(e.target.value)}
                  style={{width:44,height:38,border:`1px solid ${T.border}`,background:"none",cursor:"pointer",borderRadius:6,padding:2}}/>
                <input value={pHex} onChange={e=>setPHex(e.target.value)} placeholder="#888888"
                  style={{...inputStyle,fontFamily:"monospace",flex:1}}/>
              </div>
              {pHex==="#888888"&&<div style={{color:T.yellow,fontSize:10,letterSpacing:1}}>⚠ Please pick a colour before saving</div>}
            </>
          ):(
            <>
              <input value={sName} onChange={e=>setSName(e.target.value)} placeholder="ITEM NAME *" style={inputStyle}/>
              <input value={sBrand} onChange={e=>setSBrand(e.target.value)} placeholder="BRAND (optional)" style={inputStyle}/>
              <select value={sCat} onChange={e=>setSCat(e.target.value)} style={inputStyle}>
                {SHOP_CATS.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </>
          )}

          <Btn onClick={handleSubmit} disabled={!canSubmit} full>
            {isPaint?"ADD PAINT TO COLLECTION":"ADD ITEM TO SHOP LIST"}
          </Btn>
        </div>
      )}
    </div>
  );
}

// BarcodeScanner — receives allPaints as prop
function BarcodeScanner({allPaints,onFound,onTeach,onClose,onAddNew,addNewMode="shop"}){
  const inputRef=useRef(null);
  const [status,setStatus]=useState("idle");
  const [scannedCode,setScannedCode]=useState(null);
  const [foundPaint,setFoundPaint]=useState(null);
  const [manualCode,setManualCode]=useState("");
  const [failedImage,setFailedImage]=useState(null);
  const paints=allPaints||[];

  function handleCode(code){
    const clean=code.trim().replace(/\s/g,"");
    setScannedCode(clean);
    const match=paints.find(p=>p.barcode&&(
      p.barcode===clean||p.barcode.replace(/^0+/,"")=== clean.replace(/^0+/,"")
    ));
    if(match){setFoundPaint(match);setStatus("found");}
    else setStatus("unknown");
  }

  async function decodeImage(file){
    if(!file) return;
    setStatus("decoding");
    setFailedImage(null);
    const base64=await new Promise(res=>{
      const r=new FileReader();
      r.onload=e=>res(e.target.result);
      r.readAsDataURL(file);
    });
    const corrected=await new Promise(res=>{
      const img=new Image();
      img.onload=()=>{
        const c=document.createElement("canvas");
        c.width=img.naturalWidth; c.height=img.naturalHeight;
        c.getContext("2d").drawImage(img,0,0);
        res(c.toDataURL("image/jpeg",0.95));
      };
      img.onerror=()=>res(base64);
      img.src=base64;
    });
    try{
      let foundCode=null;
      if(window.ZXing){
        const Z=window.ZXing;
        const hints=new Map();
        hints.set(Z.DecodeHintType.POSSIBLE_FORMATS,[Z.BarcodeFormat.EAN_13,Z.BarcodeFormat.EAN_8,Z.BarcodeFormat.UPC_A,Z.BarcodeFormat.CODE_128]);
        hints.set(Z.DecodeHintType.TRY_HARDER,true);
        const reader=new Z.BrowserMultiFormatReader(hints);
        const img=new Image(); img.src=corrected;
        await new Promise(r=>{img.onload=r;img.onerror=r;});
        outer:
        for(const rot of [0,90,270,180]){
          for(const contrast of [false,true]){
            try{
              const c=document.createElement("canvas");
              const w=img.width*1.5,h=img.height*1.5;
              c.width=(rot===90||rot===270)?h:w;
              c.height=(rot===90||rot===270)?w:h;
              const ctx=c.getContext("2d");
              ctx.translate(c.width/2,c.height/2);
              ctx.rotate(rot*Math.PI/180);
              ctx.drawImage(img,-w/2,-h/2,w,h);
              ctx.setTransform(1,0,0,1,0,0);
              if(contrast){
                const d=ctx.getImageData(0,0,c.width,c.height);
                for(let i=0;i<d.data.length;i+=4){
                  const g=0.299*d.data[i]+0.587*d.data[i+1]+0.114*d.data[i+2];
                  d.data[i]=d.data[i+1]=d.data[i+2]=g>110?255:0;
                }
                ctx.putImageData(d,0,0);
              }
              const result=await reader.decodeFromCanvas(c);
              if(result){foundCode=result.getText();break outer;}
            }catch(e){}
          }
        }
      }
      if(foundCode){handleCode(foundCode);}
      else{setFailedImage(corrected);setStatus("photo_fail");}
    }catch(e){setFailedImage(corrected);setStatus("photo_fail");}
  }

  // Load ZXing on mount
  useEffect(()=>{
    if(window.ZXing) return;
    const s=document.createElement("script");
    s.src="https://cdnjs.cloudflare.com/ajax/libs/zxing-js/0.21.3/zxing.min.js";
    document.head.appendChild(s);
  },[]);

  return (
    <div style={{border:`1px solid ${T.border}`,background:"#0a0a0a",padding:12,borderRadius:10}}>

      {/* IDLE */}
      {status==="idle"&&(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <label style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,
            padding:"13px 0",background:T.orange,color:"#000",fontWeight:900,fontSize:12,
            letterSpacing:1,textTransform:"uppercase",borderRadius:10,cursor:"pointer"}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            TAKE PHOTO OF BARCODE
            <input type="file" accept="image/*" capture="environment"
              onChange={e=>decodeImage(e.target.files?.[0])} style={{display:"none"}}/>
          </label>
          {/* Text field — tap then tap-hold for iOS Scan Text */}
          <input ref={inputRef} value={manualCode}
            onChange={e=>{
              setManualCode(e.target.value);
              const v=e.target.value.trim().replace(/\s/g,"");
              if(v.length>=8){
                const match=paints.find(p=>p.barcode&&(p.barcode===v||p.barcode.replace(/^0+/,"")=== v.replace(/^0+/,"")));
                if(match) handleCode(v);
                else if(v.length>=12) handleCode(v);
              }
            }}
            placeholder="Type number or tap-hold for Scan Text"
            autoComplete="off" autoCorrect="off" autoCapitalize="none"
            style={{width:"100%",boxSizing:"border-box",background:T.surface,
              border:`1px solid ${manualCode?T.orange:T.border}`,
              padding:"11px 12px",color:T.white,fontSize:13,
              outline:"none",borderRadius:10,letterSpacing:.5}}/>
          <div style={{color:T.dimmer,fontSize:10,textAlign:"center",lineHeight:1.5}}>
            💡 Tap and <strong style={{color:T.white}}>hold</strong> the field above → tap <strong style={{color:T.white}}>Scan Text</strong> to use iOS camera
          </div>
          <label style={{display:"block",textAlign:"center",color:T.dimmer,fontSize:11,
            cursor:"pointer",textDecoration:"underline",letterSpacing:1,textTransform:"uppercase"}}>
            choose from photo library
            <input type="file" accept="image/*" onChange={e=>decodeImage(e.target.files?.[0])} style={{display:"none"}}/>
          </label>
          {paints.length>0&&manualCode.length>1&&(
            <PaintSearch allPaints={paints} onSelect={p=>{
              const code=manualCode.trim();
              if(code&&onTeach) onTeach(code,p.id);
              else onFound(p);
              onClose();
            }} brandFilter="all"/>
          )}
          {onAddNew&&manualCode.length>0&&<AddNewItemForm onAddNew={(item)=>{onAddNew({...item,barcode:manualCode.trim()||item.barcode});onClose();}} barcode={manualCode.trim()} mode={addNewMode}/>}
        </div>
      )}

      {status==="decoding"&&(
        <div style={{padding:"24px 0",textAlign:"center"}}>
          <div style={{color:T.orange,fontSize:12,fontWeight:900,letterSpacing:2,textTransform:"uppercase"}}>READING BARCODE...</div>
        </div>
      )}

      {status==="photo_fail"&&(
        <div style={{padding:"8px 0"}}>
          <Badge color={T.red}>AUTO-READ FAILED</Badge>
          <div style={{color:T.dim,fontSize:12,margin:"8px 0"}}>Couldn't read automatically. Type or use Scan Text below.</div>
          {failedImage&&(
            <div style={{marginBottom:10,borderRadius:8,overflow:"hidden",border:`1px solid ${T.border}`,background:"#000",position:"relative"}}>
              <img src={failedImage} alt="scanned" style={{width:"100%",maxHeight:240,objectFit:"contain",display:"block"}}/>
              <div style={{position:"absolute",bottom:0,left:0,right:0,background:"rgba(0,0,0,.75)",
                padding:"5px 8px",fontSize:10,color:T.dim,letterSpacing:1,textAlign:"center",textTransform:"uppercase"}}>
                Read the digits below the barcode and type them in
              </div>
            </div>
          )}
          <input value={manualCode} onChange={e=>{
            setManualCode(e.target.value);
            const v=e.target.value.trim().replace(/\s/g,"");
            if(v.length>=8){
              const match=paints.find(p=>p.barcode&&(p.barcode===v||p.barcode.replace(/^0+/,"")=== v.replace(/^0+/,"")));
              if(match) handleCode(v);
            }
          }}
            placeholder="Type barcode number from photo"
            autoComplete="off" autoCapitalize="none"
            style={{width:"100%",boxSizing:"border-box",background:"#0a0a0a",
              border:`1px solid ${manualCode?T.orange:T.border}`,
              padding:"11px 12px",color:T.white,fontSize:13,fontFamily:"monospace",
              outline:"none",borderRadius:8,marginBottom:8}}/>
          {paints.length>0&&(
            <PaintSearch allPaints={paints} onSelect={p=>{
              const code=manualCode.trim();
              if(code&&onTeach) onTeach(code,p.id);
              else onFound(p);
              onClose();
            }} brandFilter="all"/>
          )}
          <button onClick={()=>{setStatus("idle");setFailedImage(null);setManualCode("");}}
            style={{width:"100%",marginTop:8,background:"none",border:`1px solid ${T.border}`,
              color:T.dim,fontWeight:900,fontSize:11,letterSpacing:1,textTransform:"uppercase",
              padding:"9px 0",cursor:"pointer",borderRadius:8}}>
            TRY AGAIN
          </button>
        </div>
      )}

      {status==="found"&&foundPaint&&(
        <div style={{padding:"8px 0"}}>
          <Badge color={T.green}>BARCODE MATCHED</Badge>
          <div style={{display:"flex",alignItems:"center",gap:10,margin:"10px 0",
            background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 12px"}}>
            <div style={{width:44,height:44,borderRadius:9,background:foundPaint.hex,
              border:`1px solid ${T.border}`,flexShrink:0,boxShadow:`0 0 12px ${foundPaint.hex}66`}}/>
            <div>
              <div style={{color:T.white,fontWeight:700,fontSize:14}}>{foundPaint.name}</div>
              <div style={{color:T.dim,fontSize:11}}>{BRANDS[foundPaint.brand]?.name||foundPaint.brand} · {foundPaint.line}</div>
              <div style={{color:T.orange,fontFamily:"monospace",fontSize:10,marginTop:2}}>▐ {scannedCode}</div>
            </div>
          </div>
          <Btn onClick={()=>{onFound(foundPaint);onClose();}} full>USE THIS PAINT</Btn>
        </div>
      )}

      {status==="unknown"&&(
        <div style={{padding:"8px 0"}}>
          <Badge color={T.yellow}>UNKNOWN BARCODE</Badge>
          <div style={{color:T.orange,fontFamily:"monospace",fontSize:12,margin:"8px 0",
            background:"rgba(212,245,74,.05)",border:`1px solid ${T.border}`,padding:"8px 10px",borderRadius:8}}>
            {scannedCode}
          </div>
          <div style={{color:T.dim,fontSize:11,marginBottom:6,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>Link this barcode to a paint:</div>
          <PaintSearch allPaints={paints} onSelect={p=>{
            if(onTeach) onTeach(scannedCode,p.id);
            onFound(p); onClose();
          }} brandFilter="all"/>
          {onAddNew&&<AddNewItemForm onAddNew={(item)=>{onAddNew({...item,barcode:scannedCode});onClose();}} barcode={scannedCode} mode={addNewMode}/>}
          <GhostBtn onClick={()=>{setStatus("idle");setScannedCode(null);setManualCode("");}} color={T.dim} style={{marginTop:8,width:"100%",justifyContent:"center"}}>TRY AGAIN</GhostBtn>
        </div>
      )}
    </div>
  );
}

// MixBuilder — receives allPaints as prop
function MixSuggestions({labComponents,allPaints,ownedIds,onAdd}){
  const [brandFilter,setBrandFilter]=useState("all");
  const [ownedOnly,setOwnedOnly]=useState(false);
  const [open,setOpen]=useState(true);

  if(!labComponents.length) return null;
  const lastPaint=allPaints.find(p=>p.id===labComponents[labComponents.length-1].paintId);
  if(!lastPaint||!lastPaint.hex) return null;

  function hexToHsl(hex){
    let r=parseInt(hex.slice(1,3),16)/255,g=parseInt(hex.slice(3,5),16)/255,b=parseInt(hex.slice(5,7),16)/255;
    const max=Math.max(r,g,b),min=Math.min(r,g,b);
    let h,s,l=(max+min)/2;
    if(max===min){h=s=0;}else{
      const d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);
      switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4;break;}
      h/=6;
    }
    return [h*360,s*100,l*100];
  }

  const [selH,selS,selL]=hexToHsl(lastPaint.hex);

  function filterBrand(p){
    const bOk=brandFilter==="all"||p.brand===brandFilter;
    const oOk=!ownedOnly||ownedIds.includes(p.id);
    return bOk&&oOk&&!labComponents.find(c=>c.paintId===p.id)&&p.hex;
  }

  const similar=allPaints.filter(p=>{
    if(!filterBrand(p)) return false;
    const [h,s,l]=hexToHsl(p.hex);
    const hd=Math.min(Math.abs(h-selH),360-Math.abs(h-selH));
    return hd<35&&Math.abs(s-selS)<40&&Math.abs(l-selL)<35;
  }).slice(0,12);

  const complementary=allPaints.filter(p=>{
    if(!filterBrand(p)) return false;
    const [h]=hexToHsl(p.hex);
    const hd=Math.min(Math.abs(h-selH),360-Math.abs(h-selH));
    return hd>140&&hd<220;
  }).slice(0,12);

  if(!similar.length&&!complementary.length&&brandFilter==="all"&&!ownedOnly) return null;

  const SwatchRow=({paints})=>(
    <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4}}>
      {paints.length>0?paints.map(p=>{
        const owned=ownedIds.includes(p.id);
        return (
          <button key={p.id} onClick={()=>onAdd(p)}
            style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",
              gap:4,background:"none",border:"none",cursor:"pointer",padding:0}}>
            <div style={{width:44,height:44,borderRadius:10,background:p.hex,
              border:`1px solid ${owned?T.orange:T.border}`,
              boxShadow:"0 2px 8px rgba(0,0,0,.4)"}}/>
            <div style={{fontSize:9,color:T.dimmer,maxWidth:46,textAlign:"center",
              whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</div>
          </button>
        );
      }):(
        <div style={{color:T.dimmer,fontSize:11,padding:"4px 0"}}>None found for this filter</div>
      )}
    </div>
  );

  return (
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,marginBottom:14,overflow:"hidden"}}>
      {/* collapsible header */}
      <button onClick={()=>setOpen(o=>!o)}
        style={{width:"100%",background:"transparent",border:"none",cursor:"pointer",
          padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:14,height:14,borderRadius:3,background:lastPaint.hex,border:`1px solid ${T.border}`,flexShrink:0}}/>
        <div style={{color:T.orange,fontWeight:900,fontSize:11,letterSpacing:1,textTransform:"uppercase",flex:1,textAlign:"left"}}>
          SUGGESTIONS BASED ON {lastPaint.name.toUpperCase()}
        </div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.dim} strokeWidth="2.5"
          style={{transform:open?"rotate(180deg)":"rotate(0deg)",transition:"transform .2s",flexShrink:0}}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open&&(
        <div style={{padding:"0 14px 14px"}}>
          {/* brand + owned filters */}
          <div style={{display:"flex",gap:5,marginBottom:12,flexWrap:"wrap"}}>
            {[["all","ALL"],["kaleido","KALEIDO"],["vallejo","VALLEJO"],["custom","CUSTOM"]].map(([b,l])=>(
              <button key={b} onClick={()=>setBrandFilter(b)}
                style={{padding:"3px 10px",border:`1px solid ${brandFilter===b?T.orange:T.border}`,
                  background:brandFilter===b?"rgba(212,245,74,.08)":"transparent",
                  color:brandFilter===b?T.orange:T.dim,fontWeight:700,fontSize:10,
                  letterSpacing:.5,cursor:"pointer",borderRadius:7,textTransform:"uppercase"}}>
                {l}
              </button>
            ))}
            <button onClick={()=>setOwnedOnly(o=>!o)}
              style={{padding:"3px 10px",border:`1px solid ${ownedOnly?T.yellow:T.border}`,
                background:ownedOnly?"rgba(255,208,0,.1)":"transparent",
                color:ownedOnly?T.yellow:T.dim,fontWeight:700,fontSize:10,
                letterSpacing:.5,cursor:"pointer",borderRadius:7,textTransform:"uppercase"}}>
              {ownedOnly?"★ OWNED":"☆ OWNED"}
            </button>
          </div>

          {(similar.length>0||(brandFilter!=="all"||ownedOnly))&&(
            <div style={{marginBottom:12}}>
              <div style={{color:T.dim,fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>
                SIMILAR ({similar.length})
              </div>
              <SwatchRow paints={similar}/>
            </div>
          )}
          {(complementary.length>0||(brandFilter!=="all"||ownedOnly))&&(
            <div>
              <div style={{color:T.dim,fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>
                ⚡ COMPLEMENTARY ({complementary.length})
              </div>
              <SwatchRow paints={complementary}/>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ColourPicker({allPaints,ownedIds,cpImage,setCpImage,cpColour,setCpColour,cpOwnedOnly,setCpOwnedOnly,ownedMap}){
  const fileRef=useRef(null);
  const [matches,setMatches]=useState([]);
  const [showSampler,setShowSampler]=useState(false);
  const [tempCrosshair,setTempCrosshair]=useState(null);
  const [tempColour,setTempColour]=useState(null);
  const samplerCanvasRef=useRef(null);

  function colourDiff(hex,r2,g2,b2){
    const h=hex.replace("#","");
    const r1=parseInt(h.slice(0,2),16);
    const g1=parseInt(h.slice(2,4),16);
    const b1=parseInt(h.slice(4,6),16);
    const dr=(r1-r2)*0.3,dg=(g1-g2)*0.59,db=(b1-b2)*0.11;
    return Math.sqrt(dr*dr+dg*dg+db*db);
  }

  function findMatches(r,g,b){
    const pool=cpOwnedOnly?allPaints.filter(p=>ownedIds.includes(p.id)):allPaints;
    return [...pool].filter(p=>p.hex).map(p=>({...p,diff:colourDiff(p.hex,r,g,b)})).sort((a,b)=>a.diff-b.diff).slice(0,8);
  }

  function samplePoint(e){
    const canvas=samplerCanvasRef.current;
    if(!canvas) return;
    const rect=canvas.getBoundingClientRect();
    const touch=e.touches?.[0]||e.changedTouches?.[0]||e;
    const px=Math.max(0,Math.min(1,(touch.clientX-rect.left)/rect.width));
    const py=Math.max(0,Math.min(1,(touch.clientY-rect.top)/rect.height));
    const x=Math.round(px*canvas.width);
    const y=Math.round(py*canvas.height);
    const ctx=canvas.getContext("2d");
    let r=0,g=0,b=0,n=0;
    for(let dx=-3;dx<=3;dx++) for(let dy=-3;dy<=3;dy++){
      const ix=Math.max(0,Math.min(canvas.width-1,x+dx));
      const iy=Math.max(0,Math.min(canvas.height-1,y+dy));
      const d=ctx.getImageData(ix,iy,1,1).data;
      r+=d[0]; g+=d[1]; b+=d[2]; n++;
    }
    r=Math.round(r/n); g=Math.round(g/n); b=Math.round(b/n);
    const hex=`#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`;
    setTempColour({r,g,b,hex});
    setTempCrosshair({px,py});
  }

  function confirmSample(){
    if(!tempColour) return;
    setCpColour(tempColour);
    setMatches(findMatches(tempColour.r,tempColour.g,tempColour.b));
    setShowSampler(false);
  }

  function loadImage(file){
    const reader=new FileReader();
    reader.onload=ev=>{
      setCpImage(ev.target.result);
      setCpColour(null); setMatches([]); setTempColour(null); setTempCrosshair(null);
      setTimeout(()=>{
        const canvas=samplerCanvasRef.current;
        if(!canvas) return;
        const img=new Image();
        img.onload=()=>{ canvas.width=img.naturalWidth; canvas.height=img.naturalHeight; canvas.getContext("2d").drawImage(img,0,0); };
        img.src=ev.target.result;
        setShowSampler(true);
      },150);
    };
    reader.readAsDataURL(file);
  }

  function openSampler(){
    setTempColour(null); setTempCrosshair(null);
    setTimeout(()=>{
      const canvas=samplerCanvasRef.current;
      if(!canvas||!cpImage) return;
      const img=new Image();
      img.onload=()=>{ canvas.width=img.naturalWidth; canvas.height=img.naturalHeight; canvas.getContext("2d").drawImage(img,0,0); };
      img.src=cpImage;
    },50);
    setShowSampler(true);
  }

  useEffect(()=>{
    if(!cpColour) return;
    setMatches(findMatches(cpColour.r,cpColour.g,cpColour.b));
  },[cpOwnedOnly]);

  return (
    <div>
      <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}}
        onChange={e=>e.target.files[0]&&loadImage(e.target.files[0])}/>

      {/* ── FULLSCREEN SAMPLER POPUP ── */}
      {showSampler&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.96)",zIndex:300,
          display:"flex",flexDirection:"column"}}>
          <div style={{padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",
            borderBottom:`1px solid ${T.border}`,background:T.surface,flexShrink:0}}>
            <div>
              <div style={{fontWeight:900,fontSize:15,color:T.white}}>SELECT A COLOUR</div>
              <div style={{color:T.dim,fontSize:11,marginTop:2}}>Tap the area you want to match</div>
            </div>
            <button onClick={()=>setShowSampler(false)}
              style={{background:T.border,border:"none",color:T.white,width:30,height:30,
                borderRadius:8,cursor:"pointer",fontWeight:900,fontSize:14}}>✕</button>
          </div>
          <div style={{flex:1,overflow:"auto",padding:8,display:"flex",alignItems:"flex-start",justifyContent:"center"}}>
            <div style={{position:"relative",width:"100%"}}>
              <canvas ref={samplerCanvasRef}
                style={{width:"100%",display:"block",borderRadius:10,cursor:"crosshair",touchAction:"none"}}
                onClick={samplePoint}
                onTouchEnd={e=>{e.preventDefault();samplePoint(e.changedTouches[0]);}}/>
              {tempCrosshair&&(
                <div style={{position:"absolute",left:`${tempCrosshair.px*100}%`,top:`${tempCrosshair.py*100}%`,
                  transform:"translate(-50%,-50%)",pointerEvents:"none"}}>
                  <div style={{width:32,height:32,borderRadius:"50%",
                    border:"3px solid #fff",boxShadow:"0 0 0 2px #000, 0 0 12px rgba(0,0,0,.9)",
                    background:tempColour?.hex||"transparent"}}/>
                </div>
              )}
            </div>
          </div>
          <div style={{padding:"12px 16px",background:T.surface,borderTop:`1px solid ${T.border}`,
            display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
            {tempColour?(
              <>
                <div style={{width:40,height:40,borderRadius:8,background:tempColour.hex,
                  border:`1px solid ${T.border}`,flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{color:T.white,fontSize:12,fontWeight:700}}>Sampled</div>
                  <div style={{color:T.dim,fontSize:10,fontFamily:"monospace"}}>{tempColour.hex.toUpperCase()}</div>
                </div>
                <Btn onClick={confirmSample}>SEE MATCHES</Btn>
              </>
            ):(
              <div style={{flex:1,textAlign:"center",color:T.dim,fontSize:12}}>Tap the photo to pick a colour</div>
            )}
          </div>
        </div>
      )}

      {/* ── MAIN VIEW ── */}
      {!cpImage&&(
        <div style={{border:`2px dashed ${T.border}`,borderRadius:14,padding:32,textAlign:"center"}}>
          <div style={{color:T.dim,fontSize:11,letterSpacing:2,textTransform:"uppercase",marginBottom:16}}>
            Upload a photo to find matching paints
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
            <GhostBtn onClick={()=>{fileRef.current.removeAttribute("capture");fileRef.current.click();}}>FROM LIBRARY</GhostBtn>
            <GhostBtn onClick={()=>{fileRef.current.setAttribute("capture","environment");fileRef.current.click();}}>TAKE PHOTO</GhostBtn>
          </div>
        </div>
      )}

      {cpImage&&(
        <>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <div onClick={()=>setCpOwnedOnly(v=>!v)}
              style={{width:42,height:24,borderRadius:12,background:cpOwnedOnly?T.orange:T.dimmer,
                position:"relative",cursor:"pointer",transition:"background .2s",flexShrink:0}}>
              <div style={{position:"absolute",top:3,left:cpOwnedOnly?21:3,width:18,height:18,
                borderRadius:"50%",background:"#fff",transition:"left .2s"}}/>
            </div>
            <span style={{color:cpOwnedOnly?T.orange:T.dim,fontWeight:700,fontSize:12,textTransform:"uppercase"}}>
              {cpOwnedOnly?"MY PAINTS ONLY":"ALL PAINTS"}
            </span>
          </div>

          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,
            padding:10,marginBottom:14,display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:70,height:70,borderRadius:8,overflow:"hidden",flexShrink:0,border:`1px solid ${T.border}`}}>
              <img src={cpImage} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{color:T.white,fontWeight:700,fontSize:13,marginBottom:6}}>
                {cpColour?"Colour sampled":"No colour selected yet"}
              </div>
              {cpColour&&(
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:24,height:24,borderRadius:5,background:cpColour.hex,border:`1px solid ${T.border}`}}/>
                  <span style={{color:T.dim,fontSize:10,fontFamily:"monospace"}}>{cpColour.hex.toUpperCase()}</span>
                </div>
              )}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <GhostBtn small onClick={openSampler}>{cpColour?"RESELECT":"SELECT COLOUR"}</GhostBtn>
              <GhostBtn small color={T.dim} onClick={()=>{fileRef.current.removeAttribute("capture");fileRef.current.click();}}>CHANGE PHOTO</GhostBtn>
            </div>
          </div>

          {cpColour&&matches.length>0&&(
            <>
              <SectionHeader right={<span style={{color:T.dim,fontSize:10}}>{cpOwnedOnly?"OWNED":"ALL"} · {matches.length}</span>}>
                CLOSEST MATCHES
              </SectionHeader>
              {matches.map((p,i)=>{
                const owned=ownedMap[p.id]||0;
                const matchPct=Math.max(0,Math.round(100-(p.diff/2.55)));
                return (
                  <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,
                    background:T.card,border:`1px solid ${i===0?T.orange:T.border}`,
                    borderRadius:10,padding:"10px 12px",marginBottom:6}}>
                    <div style={{width:36,height:36,borderRadius:8,background:p.hex,border:`1px solid ${T.border}`,flexShrink:0}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{color:T.white,fontSize:13,fontWeight:700}}>{p.name}</div>
                      <div style={{color:T.dim,fontSize:10}}>{BRANDS[p.brand]?.name||p.brand} · {p.id}</div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{color:i===0?T.orange:T.dim,fontWeight:900,fontSize:14}}>{matchPct}%</div>
                      <div style={{color:owned>0?"#4ab8ff":T.dimmer,fontSize:10,display:"flex",alignItems:"center",gap:2,justifyContent:"flex-end"}}>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                        {owned} owned
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </>
      )}
    </div>
  );
}


function MixLab({allPaints,ownedIds,projects,setProjects,selProj,setSelProj,standaloneMixes,setStandaloneMixes,
  labComponents,setLabComponents,labName,setLabName,labNotes,setLabNotes,
  cpImage,setCpImage,cpColour,setCpColour,cpOwnedOnly,setCpOwnedOnly,cpCanvasRef,cpImgRef,ownedMap,onSaved}){
  const [labTab,setLabTab]=useState("mixer"); // "mixer" | "wheel"
  const [labBrandFilter,setLabBrandFilter]=useState("all");
  const [showLabFilter,setShowLabFilter]=useState(false);
  const [labFilterBrands,setLabFilterBrands]=useState(Object.keys(BRANDS));
  const [labFilterLines,setLabFilterLines]=useState([]);
  const [labSearch,setLabSearch]=useState("");
  const [labOwned,setLabOwned]=useState(false);

  function toggleLabBrand(bk){ setLabFilterBrands(prev=>prev.includes(bk)?prev.filter(x=>x!==bk):[...prev,bk]); }
  function toggleLabLine(ln){ setLabFilterLines(prev=>prev.includes(ln)?prev.filter(x=>x!==ln):[...prev,ln]); }
  const labFilterActive=labFilterBrands.length<Object.keys(BRANDS).length||labFilterLines.length>0;
  const [showLabSave,setShowLabSave]=useState(false);
  const [labSaveTo,setLabSaveTo]=useState("standalone");
  const [wheelBrand,setWheelBrand]=useState("all");
  const [wheelOwned,setWheelOwned]=useState(true);
  const [showWheelFilter,setShowWheelFilter]=useState(false);
  const [wheelFilterBrands,setWheelFilterBrands]=useState(Object.keys(BRANDS));
  const [wheelFilterLines,setWheelFilterLines]=useState([]);

  function toggleWheelBrand(bk){ setWheelFilterBrands(prev=>prev.includes(bk)?prev.filter(x=>x!==bk):[...prev,bk]); }
  function toggleWheelLine(ln){ setWheelFilterLines(prev=>prev.includes(ln)?prev.filter(x=>x!==ln):[...prev,ln]); }
  const wheelFilterActive=wheelFilterBrands.length<Object.keys(BRANDS).length||wheelFilterLines.length>0;
  const [wheelSelected,setWheelSelected]=useState(null);
  const [brightness,setBrightness]=useState(50);
  const [wheelListView,setWheelListView]=useState(false);
  const [lastAdded,setLastAdded]=useState(null);

  const labResult=mixColors(labComponents,allPaints);
  const labTotal=labComponents.reduce((s,c)=>s+c.drops,0);

  function addLabPaint(p){
    setLabComponents(prev=>{
      const ex=prev.find(c=>c.paintId===p.id);
      if(ex) return prev.map(c=>c.paintId===p.id?{...c,drops:c.drops+1}:c);
      return [...prev,{paintId:p.id,drops:1}];
    });
    setLastAdded(p.id);
    setTimeout(()=>setLastAdded(null),1500);
    setLabSearch("");
  }

  function saveLabMix(){
    if(!labName.trim()||!labComponents.length) return;
    const mix={id:"m"+Date.now(),name:labName,notes:labNotes,components:labComponents,photos:[],info:"",infoPhotos:[]};
    if(labSaveTo==="project"&&selProj){
      setProjects(projects.map(p=>p.id===selProj?{...p,mixes:[...p.mixes,mix]}:p));
    } else {
      setStandaloneMixes(prev=>[...prev,mix]);
    }
    setLabComponents([]);setLabName("");setLabNotes("");setShowLabSave(false);
    if(onSaved) onSaved(mix.name);
  }

  const labPaints=allPaints.filter(p=>{
    const bOk=labFilterBrands.includes(p.brand);
    const lOk=!labFilterLines.includes(p.line);
    const oOk=!labOwned||ownedIds.includes(p.id);
    const q=labSearch.toLowerCase();
    const sOk=!q||p.name.toLowerCase().includes(q)||p.id.toLowerCase().includes(q);
    return bOk&&lOk&&oOk&&sOk;
  });

  // ── Colour wheel helpers ──
  function hexToHsl(hex){
    let r=parseInt(hex.slice(1,3),16)/255;
    let g=parseInt(hex.slice(3,5),16)/255;
    let b=parseInt(hex.slice(5,7),16)/255;
    const max=Math.max(r,g,b),min=Math.min(r,g,b);
    let h,s,l=(max+min)/2;
    if(max===min){h=s=0;}else{
      const d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);
      switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4;break;}
      h/=6;
    }
    return [h*360,s*100,l*100];
  }

  function hslToPos(h,s,r){
    const angle=(h-90)*(Math.PI/180);
    const dist=(s/100)*r;
    return {x:r+dist*Math.cos(angle),y:r+dist*Math.sin(angle)};
  }

  const wheelPaints=allPaints.filter(p=>{
    const bOk=wheelFilterBrands.includes(p.brand);
    const lOk=!wheelFilterLines.includes(p.line);
    const oOk=!wheelOwned||ownedIds.includes(p.id);
    const isGrey=p.hex&&(()=>{const r=parseInt(p.hex.slice(1,3),16),g=parseInt(p.hex.slice(3,5),16),b=parseInt(p.hex.slice(5,7),16);return Math.max(r-g,g-r,r-b,b-r,g-b,b-g)<20;})();
    return bOk&&lOk&&oOk&&p.hex&&!isGrey;
  });

  const greyPaints=allPaints.filter(p=>{
    const bOk=wheelFilterBrands.includes(p.brand);
    const lOk=!wheelFilterLines.includes(p.line);
    const oOk=!wheelOwned||ownedIds.includes(p.id);
    if(!p.hex||!bOk||!lOk||!oOk) return false;
    const r=parseInt(p.hex.slice(1,3),16),g=parseInt(p.hex.slice(3,5),16),b2=parseInt(p.hex.slice(5,7),16);
    return Math.max(r-g,g-r,r-b2,b2-r,g-b2,b2-g)<20;
  });

  const R=140; // wheel radius

  return (
    <div>
      {/* inner tab switcher */}
      <div style={{display:"flex",gap:0,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden",marginBottom:14}}>
        {[
          ["mixer","MIXER",<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6"/><path d="M10 3v7l-4 8h12l-4-8V3"/></svg>],
          ["wheel","COLOUR WHEEL",<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="8" cy="10" r="1.5" fill="currentColor"/><circle cx="12" cy="7" r="1.5" fill="currentColor"/><circle cx="16" cy="10" r="1.5" fill="currentColor"/></svg>],
          ["colourpick","COLOUR PICK",<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a1 1 0 0 1-1-1v-2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2h-6v1a1 1 0 0 1-1 1z"/><circle cx="12" cy="10" r="3"/></svg>],
        ].map(([tab,label,icon])=>(
          <button key={tab} onClick={()=>setLabTab(tab)}
            style={{flex:1,padding:"9px 0",border:"none",
              borderRight:tab!=="colourpick"?`1px solid ${T.border}`:"none",
              background:labTab===tab?T.orange:T.surface,
              color:labTab===tab?"#000":T.dim,
              fontWeight:900,fontSize:10,letterSpacing:.5,cursor:"pointer",textTransform:"uppercase",
              display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
            {icon}{label}
          </button>
        ))}
      </div>

      {/* ══ MIXER TAB ══ */}
      {labTab==="mixer"&&(
        <div>
          {/* result swatch */}
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:14,marginBottom:14}}>
            <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:labComponents.length?12:0}}>
              <div style={{width:72,height:72,borderRadius:10,flexShrink:0,
                background:labComponents.length?labResult:"#222",
                border:`1px solid ${T.border}`,
                boxShadow:labComponents.length?`0 0 20px ${labResult}66`:"none",
                transition:"background .3s, box-shadow .3s"}}/>
              <div style={{flex:1}}>
                <div style={{color:T.orange,fontWeight:900,fontSize:11,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>RESULT PREVIEW</div>
                {labComponents.length?(
                  <>
                    <div style={{fontFamily:"monospace",fontSize:13,color:T.white,marginBottom:2}}>{labResult.toUpperCase()}</div>
                    <div style={{color:T.dim,fontSize:11}}>{labTotal} drops · {labComponents.length} paint{labComponents.length!==1?"s":""}</div>
                  </>
                ):(
                  <div style={{color:T.dimmer,fontSize:12}}>Add paints below to preview your mix</div>
                )}
              </div>
            </div>

            {/* proportion bar */}
            {labComponents.length>0&&(
              <div style={{display:"flex",height:8,borderRadius:4,overflow:"hidden",gap:1,marginBottom:10}}>
                {labComponents.map(c=>{
                  const p=allPaints.find(x=>x.id===c.paintId);
                  return <div key={c.paintId} style={{flex:c.drops,background:p?.hex||"#333",transition:"flex .2s"}}/>;
                })}
              </div>
            )}

            {/* component rows */}
            {labComponents.map(c=>{
              const p=allPaints.find(x=>x.id===c.paintId); if(!p) return null;
              const pct=Math.round((c.drops/labTotal)*100);
              return (
                <div key={c.paintId} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,
                  background:"rgba(255,255,255,.04)",borderRadius:8,padding:"6px 10px"}}>
                  <div style={{width:20,height:20,borderRadius:6,background:p.hex,border:`1px solid ${T.border}`,flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:700,color:T.white,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</div>
                    <div style={{fontSize:10,color:T.dim}}>{BRANDS[p.brand]?.name||p.brand} · {p.id} · {pct}%</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:0,border:`1px solid ${T.border}`,borderRadius:8,overflow:"hidden",flexShrink:0}}>
                    <button onClick={()=>setLabComponents(prev=>prev.map(x=>x.paintId===c.paintId?{...x,drops:Math.max(1,x.drops-1)}:x))}
                      style={{width:26,height:28,background:T.bg,border:"none",color:T.white,fontSize:14,cursor:"pointer",fontWeight:900}}>−</button>
                    <div style={{minWidth:28,textAlign:"center",color:T.orange,fontSize:12,fontWeight:900,padding:"0 2px"}}>{c.drops}</div>
                    <button onClick={()=>setLabComponents(prev=>prev.map(x=>x.paintId===c.paintId?{...x,drops:x.drops+1}:x))}
                      style={{width:26,height:28,background:T.bg,border:"none",color:T.white,fontSize:14,cursor:"pointer",fontWeight:900}}>+</button>
                  </div>
                  <button onClick={()=>setLabComponents(prev=>prev.filter(x=>x.paintId!==c.paintId))}
                    style={{background:"none",border:"none",color:T.red,cursor:"pointer",fontSize:16,padding:0,flexShrink:0}}>✕</button>
                </div>
              );
            })}

            <div style={{display:"flex",gap:8,marginTop:labComponents.length?8:0,flexWrap:"wrap"}}>
              {labComponents.length>0&&(
                <button onClick={()=>setLabComponents([])}
                  style={{background:"none",border:"none",color:T.dimmer,cursor:"pointer",fontSize:11,
                    letterSpacing:1,textTransform:"uppercase",padding:0}}>
                  ✕ CLEAR ALL
                </button>
              )}
              {labComponents.length>0&&(
                <button onClick={()=>{
                  if(!labName.trim()){
                    const allMixes=[...projects.flatMap(p=>p.mixes),...standaloneMixes];
                    const num=allMixes.length+1;
                    setLabName(`Mix ${String(num).padStart(2,"0")}`);
                  }
                  setShowLabSave(true);
                }}
                  style={{marginLeft:"auto",background:T.orange,border:"none",borderRadius:8,
                    color:"#000",fontWeight:900,fontSize:11,letterSpacing:1,
                    textTransform:"uppercase",padding:"6px 16px",cursor:"pointer"}}>
                  SAVE MY MIX
                </button>
              )}
            </div>
          </div>

          {/* add paints section */}          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:14}}>
            <div style={{color:T.orange,fontWeight:900,fontSize:11,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>▐ ADD PAINTS</div>

            {/* filter button row */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,gap:8}}>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",flex:1}}>
                <button onClick={()=>setShowLabFilter(s=>!s)}
                  style={{background:showLabFilter||labFilterActive?"rgba(212,245,74,.08)":"transparent",
                    border:`1px solid ${showLabFilter||labFilterActive?T.orange:T.border}`,
                    color:showLabFilter||labFilterActive?T.orange:T.dim,
                    fontWeight:900,fontSize:11,letterSpacing:1,cursor:"pointer",
                    padding:"5px 12px",textTransform:"uppercase",borderRadius:8}}>
                  ⚙ FILTER{labFilterActive?" •":""}
                </button>
                <button onClick={()=>setLabOwned(o=>!o)}
                  style={{padding:"5px 12px",border:`1px solid ${labOwned?T.yellow:T.border}`,
                    background:labOwned?"rgba(255,208,0,.1)":"transparent",
                    color:labOwned?T.yellow:T.dim,fontWeight:700,fontSize:11,
                    letterSpacing:.5,cursor:"pointer",borderRadius:8,textTransform:"uppercase"}}>
                  {labOwned?"★ OWNED":"☆ OWNED"}
                </button>
              </div>
              <span style={{color:T.dimmer,fontSize:10,letterSpacing:1,textTransform:"uppercase",flexShrink:0}}>
                {labPaints.length} PAINTS
              </span>
            </div>

            {/* collapsible filter panel */}
            {showLabFilter&&(
              <div style={{background:T.surface,border:`1px solid ${T.orange}`,borderRadius:12,padding:14,marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                  <div style={{color:T.orange,fontSize:11,fontWeight:900,letterSpacing:2,textTransform:"uppercase"}}>▐ FILTER OPTIONS</div>
                  <button onClick={()=>{setLabFilterBrands(Object.keys(BRANDS));setLabFilterLines([]);}}
                    style={{background:"none",border:"none",color:T.dim,cursor:"pointer",fontSize:11,letterSpacing:1,textTransform:"uppercase",fontWeight:700}}>
                    RESET ALL
                  </button>
                </div>

                {/* brands */}
                <div style={{color:T.dim,fontSize:10,letterSpacing:2,textTransform:"uppercase",marginBottom:6,fontWeight:700}}>BRANDS</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
                  {Object.entries(BRANDS).map(([bk,brand])=>{
                    const active=labFilterBrands.includes(bk);
                    return (
                      <button key={bk} onClick={()=>toggleLabBrand(bk)}
                        style={{padding:"5px 12px",border:`1px solid ${active?brand.color:T.border}`,
                          background:active?`${brand.color}22`:"transparent",
                          color:active?brand.color:T.dim,
                          fontWeight:900,fontSize:11,letterSpacing:1,cursor:"pointer",
                          textTransform:"uppercase",borderRadius:8}}>
                        {active?"✓ ":""}{brand.name}
                      </button>
                    );
                  })}
                </div>

                {/* sub-lines grouped by brand */}
                <div style={{color:T.dim,fontSize:10,letterSpacing:2,textTransform:"uppercase",marginBottom:6,fontWeight:700}}>COLOUR LINES</div>
                {Object.entries(BRANDS).filter(([bk])=>labFilterBrands.includes(bk)).map(([bk,brand])=>{
                  const lines=[...new Set(allPaints.filter(p=>p.brand===bk).map(p=>p.line))];
                  if(!lines.length) return null;
                  return (
                    <div key={bk} style={{marginBottom:10}}>
                      <div style={{color:brand.color,fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:5}}>{brand.name}</div>
                      <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                        {lines.map(ln=>{
                          const hidden=labFilterLines.includes(ln);
                          return (
                            <button key={ln} onClick={()=>toggleLabLine(ln)}
                              style={{padding:"3px 10px",border:`1px solid ${hidden?T.border:brand.color}`,
                                background:hidden?"transparent":`${brand.color}15`,
                                color:hidden?T.dimmer:brand.color,
                                fontWeight:700,fontSize:10,letterSpacing:.5,cursor:"pointer",
                                textTransform:"uppercase",borderRadius:6,
                                textDecoration:hidden?"line-through":"none"}}>
                              {ln}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <input value={labSearch} onChange={e=>setLabSearch(e.target.value)}
              placeholder="SEARCH PAINTS..."
              style={{width:"100%",background:"#0a0a0a",border:`1px solid ${T.border}`,borderRadius:10,
                padding:"9px 12px",color:T.white,fontWeight:700,letterSpacing:.5,
                outline:"none",fontFamily:T.font,marginBottom:10,boxSizing:"border-box"}}/>

            <div style={{maxHeight:320,overflowY:"auto"}}>
              {labPaints.slice(0,80).map(p=>{
                const inMix=labComponents.find(c=>c.paintId===p.id);
                const owned=ownedIds.includes(p.id);
                return (
                  <button key={p.id} onClick={()=>addLabPaint(p)}
                    style={{display:"flex",alignItems:"center",gap:10,width:"100%",
                      background:inMix?"rgba(212,245,74,.05)":"transparent",
                      border:`1px solid ${inMix?T.orange:T.border}`,borderRadius:8,
                      padding:"7px 10px",marginBottom:4,cursor:"pointer",textAlign:"left"}}>
                    <div style={{width:28,height:28,borderRadius:6,background:p.hex,
                      border:`1px solid ${owned?T.orange:T.border}`,flexShrink:0}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:700,color:T.white,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</div>
                      <div style={{fontSize:10,color:T.dim}}>{BRANDS[p.brand]?.name||p.brand} · {p.id} · {p.line}</div>
                    </div>
                    {inMix&&<span style={{color:T.orange,fontSize:11,fontWeight:900,flexShrink:0}}>{inMix.drops}</span>}
                    <span style={{color:inMix?T.orange:T.dimmer,fontSize:18,flexShrink:0}}>{inMix?"✓":"+"}</span>
                  </button>
                );
              })}
              {labPaints.length>80&&(
                <div style={{color:T.dimmer,fontSize:11,textAlign:"center",padding:8,letterSpacing:1}}>
                  {labPaints.length-80} MORE — REFINE YOUR SEARCH
                </div>
              )}
              {labPaints.length===0&&(
                <div style={{color:T.dimmer,fontSize:12,textAlign:"center",padding:20}}>NO PAINTS FOUND</div>
              )}
            </div>
          </div>

          {/* similar & complementary based on last added paint */}
          <div style={{marginTop:12}}>
            <MixSuggestions labComponents={labComponents} allPaints={allPaints}
              ownedIds={ownedIds} onAdd={addLabPaint}/>
          </div>
        </div>
      )}

      {/* ══ COLOUR WHEEL TAB ══ */}
      {labTab==="wheel"&&(
        <div>
          {/* filters */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,gap:8}}>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              <button onClick={()=>setShowWheelFilter(s=>!s)}
                style={{background:showWheelFilter||wheelFilterActive?"rgba(212,245,74,.08)":"transparent",
                  border:`1px solid ${showWheelFilter||wheelFilterActive?T.orange:T.border}`,
                  color:showWheelFilter||wheelFilterActive?T.orange:T.dim,
                  fontWeight:900,fontSize:11,letterSpacing:1,cursor:"pointer",
                  padding:"5px 12px",textTransform:"uppercase",borderRadius:8}}>
                ⚙ FILTER{wheelFilterActive?" •":""}
              </button>
              <button onClick={()=>setWheelOwned(o=>!o)}
                style={{padding:"5px 12px",border:`1px solid ${wheelOwned?T.yellow:T.border}`,
                  background:wheelOwned?"rgba(255,208,0,.1)":"transparent",
                  color:wheelOwned?T.yellow:T.dim,fontWeight:700,fontSize:11,
                  letterSpacing:.5,cursor:"pointer",borderRadius:8,textTransform:"uppercase"}}>
                {wheelOwned?"★ OWNED":"☆ ALL"}
              </button>
            </div>
            <span style={{color:T.dimmer,fontSize:10,letterSpacing:1,textTransform:"uppercase",flexShrink:0}}>
              {wheelPaints.length+greyPaints.length} PAINTS
            </span>
          </div>

          {/* collapsible filter panel */}
          {showWheelFilter&&(
            <div style={{background:T.surface,border:`1px solid ${T.orange}`,borderRadius:12,padding:14,marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <div style={{color:T.orange,fontSize:11,fontWeight:900,letterSpacing:2,textTransform:"uppercase"}}>▐ FILTER OPTIONS</div>
                <button onClick={()=>{setWheelFilterBrands(Object.keys(BRANDS));setWheelFilterLines([]);}}
                  style={{background:"none",border:"none",color:T.dim,cursor:"pointer",fontSize:11,letterSpacing:1,textTransform:"uppercase",fontWeight:700}}>
                  RESET ALL
                </button>
              </div>

              <div style={{color:T.dim,fontSize:10,letterSpacing:2,textTransform:"uppercase",marginBottom:6,fontWeight:700}}>BRANDS</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
                {Object.entries(BRANDS).map(([bk,brand])=>{
                  const active=wheelFilterBrands.includes(bk);
                  return (
                    <button key={bk} onClick={()=>toggleWheelBrand(bk)}
                      style={{padding:"5px 12px",border:`1px solid ${active?brand.color:T.border}`,
                        background:active?`${brand.color}22`:"transparent",
                        color:active?brand.color:T.dim,
                        fontWeight:900,fontSize:11,letterSpacing:1,cursor:"pointer",
                        textTransform:"uppercase",borderRadius:8}}>
                      {active?"✓ ":""}{brand.name}
                    </button>
                  );
                })}
              </div>

              <div style={{color:T.dim,fontSize:10,letterSpacing:2,textTransform:"uppercase",marginBottom:6,fontWeight:700}}>COLOUR LINES</div>
              {Object.entries(BRANDS).filter(([bk])=>wheelFilterBrands.includes(bk)).map(([bk,brand])=>{
                const lines=[...new Set(allPaints.filter(p=>p.brand===bk).map(p=>p.line))];
                if(!lines.length) return null;
                return (
                  <div key={bk} style={{marginBottom:10}}>
                    <div style={{color:brand.color,fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:5}}>{brand.name}</div>
                    <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                      {lines.map(ln=>{
                        const hidden=wheelFilterLines.includes(ln);
                        return (
                          <button key={ln} onClick={()=>toggleWheelLine(ln)}
                            style={{padding:"3px 10px",border:`1px solid ${hidden?T.border:brand.color}`,
                              background:hidden?"transparent":`${brand.color}15`,
                              color:hidden?T.dimmer:brand.color,
                              fontWeight:700,fontSize:10,letterSpacing:.5,cursor:"pointer",
                              textTransform:"uppercase",borderRadius:6,
                              textDecoration:hidden?"line-through":"none"}}>
                            {ln}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* brightness filter slider */}
          <div style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <span style={{color:T.dim,fontSize:10,letterSpacing:1,textTransform:"uppercase"}}>🌑 DARK</span>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{color:T.orange,fontSize:10,fontWeight:700,letterSpacing:1}}>BRIGHTNESS</span>
                {brightness!==50&&(
                  <button onClick={()=>setBrightness(50)}
                    style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:6,
                      color:T.dim,fontSize:9,fontWeight:700,letterSpacing:1,textTransform:"uppercase",
                      padding:"2px 7px",cursor:"pointer"}}>RESET</button>
                )}
              </div>
              <span style={{color:T.dim,fontSize:10,letterSpacing:1,textTransform:"uppercase"}}>LIGHT ☀️</span>
            </div>
            <input type="range" min={0} max={100} value={brightness} onChange={e=>setBrightness(+e.target.value)}
              style={{width:"100%",accentColor:T.orange}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6}}>
              <span style={{color:T.dimmer,fontSize:10,letterSpacing:1,textTransform:"uppercase"}}>
                {brightness<30?"SHOWING DARK PAINTS":brightness>70?"SHOWING LIGHT PAINTS":"SHOWING ALL PAINTS"}
              </span>
              <button onClick={()=>setWheelListView(v=>!v)}
                style={{background:wheelListView?T.orange:"transparent",
                  border:`1px solid ${wheelListView?T.orange:T.border}`,borderRadius:7,
                  color:wheelListView?"#000":T.dim,fontSize:10,fontWeight:700,letterSpacing:1,
                  textTransform:"uppercase",padding:"3px 10px",cursor:"pointer",transition:"all .2s"}}>
                {wheelListView?"WHEEL":"LIST"}
              </button>
            </div>
          </div>

          {/* toast notification */}
          {lastAdded&&(()=>{
            const p=allPaints.find(x=>x.id===lastAdded);
            return p?(
              <div style={{background:"#44cc88",borderRadius:10,padding:"8px 14px",
                marginBottom:10,display:"flex",alignItems:"center",gap:8,
                animation:"fadeIn .2s ease"}}>
                <div style={{width:18,height:18,borderRadius:4,background:p.hex,border:"1px solid rgba(0,0,0,.2)",flexShrink:0}}/>
                <span style={{color:"#000",fontWeight:900,fontSize:12,letterSpacing:.5}}>
                  {p.name} added to mix!
                </span>
              </div>
            ):null;
          })()}

          {/* the wheel / list view */}
          {!wheelListView?(
          <div style={{display:"flex",justifyContent:"center",marginBottom:14}}>
            <div style={{position:"relative",width:R*2,height:R*2}}>
              {/* SVG colour wheel background - fixed, always full spectrum */}
              <svg width={R*2} height={R*2} style={{position:"absolute",top:0,left:0,borderRadius:"50%",overflow:"hidden"}}>
                <defs>
                  <radialGradient id="wg" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.9"/>
                    <stop offset="100%" stopColor="transparent"/>
                  </radialGradient>
                  <radialGradient id="dg" cx="50%" cy="50%" r="50%">
                    <stop offset="60%" stopColor="transparent"/>
                    <stop offset="100%" stopColor="rgba(0,0,0,0.5)"/>
                  </radialGradient>
                </defs>
                {Array.from({length:360},(_,i)=>{
                  const a1=(i-90)*Math.PI/180;
                  const a2=(i+1-90)*Math.PI/180;
                  const x1=R+R*Math.cos(a1), y1=R+R*Math.sin(a1);
                  const x2=R+R*Math.cos(a2), y2=R+R*Math.sin(a2);
                  return <path key={i} d={`M${R},${R} L${x1},${y1} A${R},${R} 0 0,1 ${x2},${y2} Z`}
                    fill={`hsl(${i},100%,50%)`}/>;
                })}
                <circle cx={R} cy={R} r={R} fill="url(#wg)"/>
                <circle cx={R} cy={R} r={R} fill="url(#dg)"/>
              </svg>

              {/* paint dots — filtered by brightness slider */}
              {wheelPaints.filter(p=>p.hex).map(p=>{
                const [h,s,l]=hexToHsl(p.hex);
                // slider 50=all visible. Moving toward 0 fades out light paints, moving toward 100 fades out dark paints.
                // target lightness: slider 0→0, 50→50, 100→100
                // opacity based on how close the paint's lightness is to the target window
                let opacity=1;
                if(brightness<50){
                  // dark side: paints with high lightness fade out progressively
                  // at brightness=50 all visible, at brightness=0 only l<20 visible
                  const targetMax=brightness*0.8; // 50→40, 25→20, 0→0
                  const fadeWidth=30;
                  opacity=brightness===50?1:Math.min(1,Math.max(0,(targetMax+fadeWidth-l)/fadeWidth));
                } else {
                  // light side: paints with low lightness fade out progressively
                  // at brightness=50 all visible, at brightness=100 only l>80 visible
                  const targetMin=20+(brightness-50)*1.6; // 50→20, 75→60, 100→100
                  const fadeWidth=30;
                  opacity=brightness===50?1:Math.min(1,Math.max(0,(l-(targetMin-fadeWidth))/fadeWidth));
                }
                if(opacity<0.05) return null;
                const pos=hslToPos(h,s,R);
                const isSelected=wheelSelected?.id===p.id;
                const isInMix=labComponents.find(c=>c.paintId===p.id);
                return (
                  <button key={p.id}
                    onClick={()=>setWheelSelected(wheelSelected?.id===p.id?null:p)}
                    style={{position:"absolute",
                      left:pos.x-(isSelected?12:9),top:pos.y-(isSelected?12:9),
                      width:isSelected?24:18,height:isSelected?24:18,
                      borderRadius:"50%",background:p.hex,
                      border:`1px solid ${isSelected?"#fff":isInMix?T.orange:"rgba(255,255,255,.5)"}`,
                      cursor:"pointer",padding:0,
                      opacity,
                      boxShadow:isSelected?`0 0 12px ${p.hex}, 0 0 0 2px #fff`:"0 1px 4px rgba(0,0,0,.6)",
                      transition:"opacity .2s, all .15s",zIndex:isSelected?10:1}}>
                  </button>
                );
              })}
            </div>
          </div>
          ):(
          /* LIST VIEW */
          <div style={{marginBottom:14}}>
            {(()=>{
              const listPaints=wheelPaints.filter(p=>{
                if(!p.hex) return false;
                const [,,l]=hexToHsl(p.hex);
                if(brightness<50){
                  const targetMax=brightness*0.8;
                  return l<=targetMax+30;
                } else if(brightness>50){
                  const targetMin=20+(brightness-50)*1.6;
                  return l>=targetMin-30;
                }
                return true;
              });
              return (
                <>
                  <div style={{color:T.dimmer,fontSize:10,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>
                    {listPaints.length} PAINT{listPaints.length!==1?"S":""} SHOWN
                  </div>
                  <div style={{maxHeight:320,overflowY:"auto",display:"flex",flexDirection:"column",gap:4,
                    paddingRight:2}}>
                    {listPaints.map(p=>{
                      const isSelected=wheelSelected?.id===p.id;
                      const isInMix=labComponents.find(c=>c.paintId===p.id);
                      return (
                        <button key={p.id} onClick={()=>setWheelSelected(wheelSelected?.id===p.id?null:p)}
                          style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",
                            border:`1px solid ${isSelected?T.orange:isInMix?"rgba(212,245,74,.3)":T.border}`,
                            borderRadius:10,background:isSelected?"rgba(212,245,74,.06)":T.surface,
                            cursor:"pointer",textAlign:"left",transition:"border-color .15s, background .15s",
                            flexShrink:0}}>
                          <div style={{width:28,height:28,borderRadius:6,background:p.hex,flexShrink:0,
                            border:"1px solid rgba(255,255,255,.15)",
                            boxShadow:isSelected?`0 0 8px ${p.hex}`:"none"}}/>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{color:T.white,fontSize:12,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</div>
                            <div style={{color:T.dim,fontSize:10}}>{p.brand} · {p.hex}</div>
                          </div>
                          {isInMix&&<span style={{color:T.orange,fontSize:10,fontWeight:900,letterSpacing:1,flexShrink:0}}>IN MIX</span>}
                          {isSelected?<span style={{color:T.orange,fontSize:14,flexShrink:0}}>▲</span>
                            :<span style={{color:T.dimmer,fontSize:11,flexShrink:0}}>›</span>}
                        </button>
                      );
                    })}
                  </div>
                </>
              );
            })()}
          </div>
          )}

          {/* selected paint info */}
          {wheelSelected?(()=>{
            const [selH,selS,selL]=hexToHsl(wheelSelected.hex);

            // Similar colours — within ±30° hue, similar saturation
            const similar=allPaints.filter(p=>{
              if(p.id===wheelSelected.id||!p.hex) return false;
              const [h,s,l]=hexToHsl(p.hex);
              const hueDiff=Math.min(Math.abs(h-selH),360-Math.abs(h-selH));
              return hueDiff<35&&Math.abs(s-selS)<40&&Math.abs(l-selL)<35;
            }).slice(0,10);

            // Complementary colours — opposite hue (±150°–210°)
            const complementary=allPaints.filter(p=>{
              if(p.id===wheelSelected.id||!p.hex) return false;
              const [h]=hexToHsl(p.hex);
              const hueDiff=Math.min(Math.abs(h-selH),360-Math.abs(h-selH));
              return hueDiff>140&&hueDiff<220;
            }).slice(0,10);

            return (
              <div style={{background:T.card,border:`1px solid ${T.orange}`,borderRadius:12,padding:14,marginBottom:14}}>
                {/* selected header */}
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                  <div style={{width:52,height:52,borderRadius:12,background:wheelSelected.hex,
                    border:`1px solid ${T.border}`,boxShadow:`0 0 16px ${wheelSelected.hex}88`,flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:900,fontSize:15,color:T.white}}>{wheelSelected.name}</div>
                    <div style={{color:T.dim,fontSize:11,marginTop:2}}>{wheelSelected.id} · {wheelSelected.line}</div>
                    <div style={{fontFamily:"monospace",color:T.orange,fontSize:12,marginTop:2}}>{wheelSelected.hex.toUpperCase()}</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {(()=>{
                      const inMix=labComponents.find(c=>c.paintId===wheelSelected.id);
                      const justAdded=lastAdded===wheelSelected.id;
                      return (
                        <button onClick={()=>addLabPaint(wheelSelected)}
                          style={{background:justAdded?"#44cc88":inMix?T.orange:T.orange,
                            border:"none",borderRadius:8,color:"#000",fontWeight:900,
                            fontSize:11,letterSpacing:.5,padding:"6px 12px",cursor:"pointer",
                            textTransform:"uppercase",transition:"background .2s",
                            whiteSpace:"nowrap"}}>
                          {justAdded?"✓ ADDED!":`+ MIX${inMix?` (${inMix.drops})`:""}`}
                        </button>
                      );
                    })()}
                    <button onClick={()=>setWheelSelected(null)}
                      style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:8,
                        color:T.dim,fontWeight:700,fontSize:10,padding:"4px 10px",cursor:"pointer",textTransform:"uppercase"}}>
                      CLOSE
                    </button>
                  </div>
                </div>

                {/* similar colours */}
                <div style={{marginBottom:12}}>
                  <div style={{color:T.dim,fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>
                    SIMILAR COLOURS ({similar.length})
                  </div>
                  {similar.length>0?(
                    <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4}}>
                      {similar.map(p=>{
                        const owned=ownedIds.includes(p.id);
                        return (
                          <button key={p.id} onClick={()=>setWheelSelected(p)}
                            style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",
                              gap:4,background:"none",border:"none",cursor:"pointer",padding:0}}>
                            <div style={{width:40,height:40,borderRadius:8,background:p.hex,
                              border:`1px solid ${owned?T.orange:T.border}`,
                              boxShadow:"0 2px 8px rgba(0,0,0,.4)"}}/>
                            <div style={{fontSize:9,color:T.dimmer,maxWidth:42,textAlign:"center",
                              whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</div>
                          </button>
                        );
                      })}
                    </div>
                  ):(
                    <div style={{color:T.dimmer,fontSize:11}}>No similar colours in database</div>
                  )}
                </div>

                {/* complementary colours */}
                <div>
                  <div style={{color:T.dim,fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>
                    ⚡ COMPLEMENTARY COLOURS ({complementary.length})
                  </div>
                  {complementary.length>0?(
                    <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4}}>
                      {complementary.map(p=>{
                        const owned=ownedIds.includes(p.id);
                        return (
                          <button key={p.id} onClick={()=>setWheelSelected(p)}
                            style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",
                              gap:4,background:"none",border:"none",cursor:"pointer",padding:0}}>
                            <div style={{width:40,height:40,borderRadius:8,background:p.hex,
                              border:`1px solid ${owned?T.orange:T.border}`,
                              boxShadow:"0 2px 8px rgba(0,0,0,.4)"}}/>
                            <div style={{fontSize:9,color:T.dimmer,maxWidth:42,textAlign:"center",
                              whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</div>
                          </button>
                        );
                      })}
                    </div>
                  ):(
                    <div style={{color:T.dimmer,fontSize:11}}>No complementary colours in database</div>
                  )}
                </div>
              </div>
            );
          })():(
            <div style={{background:T.surface,border:`2px dashed ${T.border}`,borderRadius:12,
              padding:"14px",textAlign:"center",marginBottom:14}}>
              <div style={{color:T.dimmer,fontSize:12}}>Tap any dot to see similar and complementary colours</div>
              <div style={{color:T.dim,fontSize:11,marginTop:4}}>{wheelPaints.length} coloured · {greyPaints.length} neutrals</div>
            </div>
          )}

          {/* neutrals strip */}
          {greyPaints.length>0&&(
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:14}}>
              <div style={{color:T.dim,fontWeight:700,fontSize:10,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>NEUTRALS & GREYS</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                {greyPaints.map(p=>{
                  const isSelected=wheelSelected?.id===p.id;
                  const isInMix=labComponents.find(c=>c.paintId===p.id);
                  return (
                    <button key={p.id} onClick={()=>setWheelSelected(wheelSelected?.id===p.id?null:p)}
                      title={p.name}
                      style={{width:28,height:28,borderRadius:"50%",background:p.hex,
                        border:`1px solid ${isSelected?T.white:isInMix?T.orange:"rgba(255,255,255,.2)"}`,
                        cursor:"pointer",padding:0,
                        boxShadow:isSelected?`0 0 8px #fff`:"0 1px 4px rgba(0,0,0,.5)"}}>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══ COLOUR PICK TAB ══ */}
      {labTab==="colourpick"&&(
        <ColourPicker
          allPaints={allPaints} ownedIds={ownedIds}
          cpImage={cpImage} setCpImage={setCpImage}
          cpColour={cpColour} setCpColour={setCpColour}
          cpOwnedOnly={cpOwnedOnly} setCpOwnedOnly={setCpOwnedOnly}
          ownedMap={ownedMap}/>
      )}

      {/* save sheet */}
      {showLabSave&&(
        <Sheet title="Save My Mix" badge="SAVE" onClose={()=>setShowLabSave(false)}
          footer={<Btn onClick={saveLabMix} disabled={!labName.trim()||(labSaveTo==="project"&&!selProj)} full>SAVE MIX</Btn>}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,
            background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:12}}>
            <div style={{width:52,height:52,borderRadius:8,background:labResult,
              border:`1px solid ${T.border}`,boxShadow:`0 0 16px ${labResult}66`,flexShrink:0}}/>
            <div>
              <div style={{fontFamily:"monospace",fontSize:12,color:T.dim,marginBottom:2}}>{labResult.toUpperCase()}</div>
              <div style={{fontSize:11,color:T.dim}}>{labTotal} drops · {labComponents.length} paint{labComponents.length!==1?"s":""}</div>
              <div style={{display:"flex",height:6,borderRadius:3,overflow:"hidden",gap:1,marginTop:6,width:120}}>
                {labComponents.map(c=>{const p=allPaints.find(x=>x.id===c.paintId);return <div key={c.paintId} style={{flex:c.drops,background:p?.hex||"#333"}}/>;  })}
              </div>
            </div>
          </div>
          <FieldLabel>Mix Name</FieldLabel>
          <Field value={labName} onChange={setLabName} placeholder="E.G. SHADOW BASE, HIGHLIGHT MIX"/>
          <FieldLabel>Notes (optional)</FieldLabel>
          <Field value={labNotes} onChange={setLabNotes} placeholder="E.G. THIN 1:1, BASE COAT"/>
          <FieldLabel>Save To</FieldLabel>
          <div style={{display:"flex",gap:0,border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden",marginBottom:14}}>
            {[["standalone","MY MIXES"],["project","A PROJECT"]].map(([v,l])=>(
              <button key={v} onClick={()=>setLabSaveTo(v)}
                style={{flex:1,padding:"10px 0",border:"none",
                  borderRight:v==="standalone"?`2px solid ${T.border}`:"none",
                  background:labSaveTo===v?T.orange:T.surface,
                  color:labSaveTo===v?"#000":T.dim,
                  fontWeight:900,fontSize:11,letterSpacing:.5,cursor:"pointer",textTransform:"uppercase"}}>
                {l}
              </button>
            ))}
          </div>
          {labSaveTo==="project"&&(
            <>
              <FieldLabel>Select Project</FieldLabel>
              <select value={selProj||""} onChange={e=>setSelProj(e.target.value||null)}
                style={{width:"100%",background:"#0a0a0a",border:`1px solid ${T.border}`,borderRadius:10,
                  padding:"10px 12px",color:T.white,fontSize:13,fontFamily:T.font,outline:"none",marginBottom:10}}>
                <option value="">— SELECT PROJECT —</option>
                {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </>
          )}
          {labSaveTo==="standalone"&&(
            <div style={{background:"rgba(212,245,74,.05)",border:`1px solid ${T.border}`,borderRadius:8,
              padding:"10px 12px",color:T.dim,fontSize:12,marginBottom:10}}>
              Saved to <span style={{color:T.orange,fontWeight:700}}>My Mixes</span> — visible on the Mixes page.
            </div>
          )}
        </Sheet>
      )}
    </div>
  );
}

function MixBuilder({allPaints,ownedIds,components,setComponents,onTeachBarcode,onAddNewPaint}){
  const [brand,setBrand]=useState("all");
  const [search,setSearch]=useState("");
  const [showScan,setShowScan]=useState(false);
  const [teachCode,setTeachCode]=useState(null);
  const [ownedOnly,setOwnedOnly]=useState(true);
  const paints=allPaints||[];
  const owned=ownedIds||[];

  const total=components.reduce((s,c)=>s+c.drops,0);
  const mixCol=mixColors(components,paints);

  function addPaint(p){
    const ex=components.find(c=>c.paintId===p.id);
    if(ex) setComponents(components.map(c=>c.paintId===p.id?{...c,drops:c.drops+1}:c));
    else setComponents([...components,{paintId:p.id,drops:1}]);
    setSearch("");
  }

  const filtered=paints.filter(p=>{
    const bOk=brand==="all"||p.brand===brand;
    const oOk=!ownedOnly||owned.includes(p.id);
    const q=search.toLowerCase();
    const sOk=!q||p.name.toLowerCase().includes(q)||p.id.toLowerCase().includes(q);
    return bOk&&oOk&&sOk;
  });

  return (
    <div>
      {/* ── RESULT PREVIEW ── */}
      <div style={{background:"#111",border:`1px solid ${T.border}`,borderRadius:12,padding:14,marginBottom:14}}>
        <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:components.length?12:0}}>
          <div style={{width:64,height:64,borderRadius:10,flexShrink:0,
            background:components.length?mixCol:"#222",
            border:`1px solid ${T.border}`,
            boxShadow:components.length?`0 0 20px ${mixCol}66`:"none",
            transition:"background .3s, box-shadow .3s"}}/>
          <div style={{flex:1}}>
            <div style={{color:T.orange,fontWeight:900,fontSize:11,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>RESULT PREVIEW</div>
            {components.length?(
              <>
                <div style={{fontFamily:"monospace",fontSize:13,color:T.white,marginBottom:2}}>{mixCol.toUpperCase()}</div>
                <div style={{color:T.dim,fontSize:11}}>{total} drops total · {components.length} paint{components.length!==1?"s":""}</div>
              </>
            ):(
              <div style={{color:T.dimmer,fontSize:12}}>Add paints below to preview your mix</div>
            )}
          </div>
        </div>

        {/* proportion bar */}
        {components.length>0&&(
          <div style={{display:"flex",height:8,borderRadius:4,overflow:"hidden",gap:1,marginBottom:10}}>
            {components.map(c=>{
              const p=paints.find(x=>x.id===c.paintId);
              return <div key={c.paintId} style={{flex:c.drops,background:p?.hex||"#333",transition:"flex .2s"}}/>;
            })}
          </div>
        )}

        {/* component rows */}
        {components.map(c=>{
          const p=paints.find(x=>x.id===c.paintId); if(!p) return null;
          const pct=Math.round((c.drops/total)*100);
          return (
            <div key={c.paintId} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,
              background:"rgba(255,255,255,.04)",borderRadius:8,padding:"6px 10px"}}>
              <div style={{width:22,height:22,borderRadius:5,background:p.hex,border:`1px solid ${T.border}`,flexShrink:0}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:700,color:T.white,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</div>
                <div style={{fontSize:10,color:T.dim}}>{BRANDS[p.brand]?.name||p.brand} · {p.id} · {pct}%</div>
              </div>
              <div style={{display:"flex",alignItems:"center",border:`1px solid ${T.border}`,borderRadius:8,overflow:"hidden",flexShrink:0}}>
                <button onClick={()=>setComponents(components.map(x=>x.paintId===c.paintId?{...x,drops:Math.max(1,x.drops-1)}:x))}
                  style={{width:26,height:28,background:T.bg,border:"none",color:T.white,fontSize:14,cursor:"pointer",fontWeight:900}}>−</button>
                <div style={{minWidth:24,textAlign:"center",color:T.orange,fontSize:12,fontWeight:900}}>{c.drops}</div>
                <button onClick={()=>setComponents(components.map(x=>x.paintId===c.paintId?{...x,drops:x.drops+1}:x))}
                  style={{width:26,height:28,background:T.bg,border:"none",color:T.white,fontSize:14,cursor:"pointer",fontWeight:900}}>+</button>
              </div>
              <button onClick={()=>setComponents(components.filter(x=>x.paintId!==c.paintId))}
                style={{background:"none",border:"none",color:T.red,cursor:"pointer",fontSize:16,padding:0,flexShrink:0}}>✕</button>
            </div>
          );
        })}

        {components.length>0&&(
          <button onClick={()=>setComponents([])}
            style={{background:"none",border:"none",color:T.dimmer,cursor:"pointer",fontSize:11,
              letterSpacing:1,textTransform:"uppercase",padding:0,marginTop:4}}>
            ✕ CLEAR ALL
          </button>
        )}
      </div>

      {/* ── ADD PAINTS ── */}      <div style={{background:"#111",border:`1px solid ${T.border}`,borderRadius:12,padding:14}}>
        <div style={{color:T.orange,fontWeight:900,fontSize:11,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>▐ ADD PAINTS</div>

        {/* brand + owned + scan */}
        <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap",alignItems:"center"}}>
          {[["all","ALL"],["kaleido","KALEIDO"],["vallejo","VALLEJO"],["custom","CUSTOM"]].map(([k,l])=>(
            <button key={k} onClick={()=>setBrand(k)}
              style={{padding:"4px 11px",border:`1px solid ${brand===k?T.orange:T.border}`,
                background:brand===k?"rgba(212,245,74,.08)":"transparent",
                color:brand===k?T.orange:T.dim,fontWeight:700,fontSize:11,
                letterSpacing:.5,cursor:"pointer",borderRadius:8,textTransform:"uppercase"}}>
              {l}
            </button>
          ))}
          <button onClick={()=>setOwnedOnly(o=>!o)}
            style={{padding:"4px 12px",border:`1px solid ${ownedOnly?T.yellow:T.border}`,
              background:ownedOnly?"rgba(255,208,0,.1)":"transparent",
              color:ownedOnly?T.yellow:T.dim,fontWeight:700,fontSize:11,
              letterSpacing:.5,cursor:"pointer",borderRadius:8,textTransform:"uppercase"}}>
            {ownedOnly?"★ OWNED":"☆ OWNED"}
          </button>
          <GhostBtn onClick={()=>setShowScan(s=>!s)} color={showScan?T.orange:T.dim} small>SCAN</GhostBtn>
        </div>

        {showScan&&(
          <div style={{marginBottom:10}}>
            <BarcodeScanner allPaints={paints}
              onFound={p=>{addPaint(p);setShowScan(false);}}
              onTeach={code=>{setTeachCode(code);setShowScan(false);}}
              onClose={()=>setShowScan(false)}
              onAddNew={onAddNewPaint ? (paintData)=>{
                const p=onAddNewPaint(paintData);
                if(p) addPaint(p);
                setShowScan(false);
              } : undefined}
              addNewMode="paint"/>
          </div>
        )}

        {teachCode&&(
          <div style={{border:`1px solid ${T.yellow}`,background:"rgba(255,208,0,.05)",padding:12,marginBottom:10,borderRadius:10}}>
            <Badge color={T.yellow}>LINK BARCODE</Badge>
            <div style={{color:T.dim,fontSize:11,fontFamily:"monospace",margin:"8px 0"}}>{teachCode}</div>
            <PaintSearch allPaints={paints} onSelect={p=>{if(onTeachBarcode) onTeachBarcode(p.id,teachCode); addPaint(p); setTeachCode(null);}} brandFilter="all"/>
            <button onClick={()=>setTeachCode(null)} style={{background:"none",border:"none",color:T.dim,cursor:"pointer",fontSize:11,padding:0,textTransform:"uppercase",letterSpacing:1}}>✕ CANCEL</button>
          </div>
        )}

        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="SEARCH PAINTS..."
          style={{width:"100%",background:"#0a0a0a",border:`1px solid ${T.border}`,borderRadius:10,
            padding:"9px 12px",color:T.white,fontWeight:700,letterSpacing:.5,fontSize:16,
            outline:"none",fontFamily:T.font,marginBottom:10,boxSizing:"border-box"}}/>

        <div style={{maxHeight:280,overflowY:"auto"}}>
          {filtered.slice(0,80).map(p=>{
            const inMix=components.find(c=>c.paintId===p.id);
            const isOwned=owned.includes(p.id);
            return (
              <button key={p.id} onClick={()=>addPaint(p)}
                style={{display:"flex",alignItems:"center",gap:10,width:"100%",
                  background:inMix?"rgba(212,245,74,.05)":"transparent",
                  border:`1px solid ${inMix?T.orange:T.border}`,borderRadius:8,
                  padding:"7px 10px",marginBottom:4,cursor:"pointer",textAlign:"left"}}>
                <div style={{width:28,height:28,borderRadius:6,background:p.hex,
                  border:`1px solid ${isOwned?T.orange:T.border}`,flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:700,color:T.white,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</div>
                  <div style={{fontSize:10,color:T.dim}}>{BRANDS[p.brand]?.name||p.brand} · {p.id} · {p.line}</div>
                </div>
                {inMix&&<span style={{color:T.orange,fontSize:11,fontWeight:900,flexShrink:0}}>{inMix.drops}</span>}
                <span style={{color:inMix?T.orange:T.dimmer,fontSize:18,flexShrink:0}}>{inMix?"✓":"+"}</span>
              </button>
            );
          })}
          {filtered.length>80&&(
            <div style={{color:T.dimmer,fontSize:11,textAlign:"center",padding:8,letterSpacing:1}}>
              {filtered.length-80} MORE — REFINE YOUR SEARCH
            </div>
          )}
          {filtered.length===0&&(
            <div style={{color:T.dimmer,fontSize:12,textAlign:"center",padding:20}}>NO PAINTS FOUND</div>
          )}
        </div>
      </div>

      {/* ── SUGGESTIONS ── */}
      <div style={{marginTop:12}}>
        <MixSuggestions labComponents={components} allPaints={paints}
          ownedIds={owned} onAdd={addPaint}/>
      </div>
    </div>
  );
}


function ShopSearchResults({q,tab,allPaints,tools,consumables,ownedIds,onSelect}){
  const query=q.toLowerCase();
  const paintResults=(tab==="all"||tab==="paints")
    ?allPaints.filter(p=>!query||p.name.toLowerCase().includes(query)||p.id.toLowerCase().includes(query)||(p.line||"").toLowerCase().includes(query)).slice(0,30)
    :[];
  const toolResults=(tab==="all"||tab==="tools")
    ?(tools||[]).filter(t=>!query||t.name.toLowerCase().includes(query)||(t.brand||"").toLowerCase().includes(query)).slice(0,20)
    :[];
  const supplyResults=(tab==="all"||tab==="supplies")
    ?(consumables||[]).filter(c=>!query||c.name.toLowerCase().includes(query)||(c.brand||"").toLowerCase().includes(query)||(c.type||"").toLowerCase().includes(query)).slice(0,20)
    :[];

  if(!paintResults.length&&!toolResults.length&&!supplyResults.length) return (
    <div style={{textAlign:"center",padding:"30px 0",color:T.dimmer,fontSize:12,letterSpacing:1}}>
      {query?"NO RESULTS FOUND":"START TYPING TO SEARCH..."}
    </div>
  );

  return (
    <div>
      {paintResults.length>0&&(
        <>
          {tab==="all"&&<div style={{color:T.dim,fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>PAINTS</div>}
          {paintResults.map(p=>{
            const owned=ownedIds.includes(p.id);
            return (
              <button key={p.id}
                onClick={()=>onSelect({name:p.name,brand:BRANDS[p.brand]?.name||p.brand,category:"Paint",barcode:p.barcode||"",hex:p.hex})}
                style={{display:"flex",alignItems:"center",gap:10,width:"100%",
                  background:T.bg,border:`1px solid ${T.border}`,borderRadius:8,
                  padding:"8px 10px",marginBottom:4,cursor:"pointer",textAlign:"left"}}>
                <div style={{width:32,height:32,borderRadius:7,background:p.hex,
                  border:`1px solid ${owned?T.orange:T.border}`,flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:T.white,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</div>
                  <div style={{fontSize:10,color:T.dim}}>{BRANDS[p.brand]?.name||p.brand} · {p.id} · {p.line}</div>
                </div>
                {owned&&<span style={{color:T.orange,fontSize:10,fontWeight:700,flexShrink:0}}>OWNED</span>}
                <span style={{color:T.dimmer,fontSize:18,flexShrink:0}}>+</span>
              </button>
            );
          })}
        </>
      )}
      {toolResults.length>0&&(
        <>
          {tab==="all"&&paintResults.length>0&&<div style={{height:1,background:T.border,margin:"10px 0"}}/>}
          {tab==="all"&&<div style={{color:T.dim,fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>TOOLS</div>}
          {toolResults.map(t=>(
            <button key={t.id}
              onClick={()=>onSelect({name:t.name,brand:t.brand||"",category:t.type||"Tool",barcode:t.barcode||"",hex:""})}
              style={{display:"flex",alignItems:"center",gap:10,width:"100%",
                background:T.bg,border:`1px solid ${T.border}`,borderRadius:8,
                padding:"8px 10px",marginBottom:4,cursor:"pointer",textAlign:"left"}}>
              <div style={{width:32,height:32,borderRadius:7,background:T.surface,
                border:`1px solid ${T.border}`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{IC.tool}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:700,color:T.white,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.name}</div>
                <div style={{fontSize:10,color:T.dim}}>{t.brand||"No brand"} · {t.type||"Tool"}</div>
              </div>
              <span style={{color:T.dimmer,fontSize:18,flexShrink:0}}>+</span>
            </button>
          ))}
        </>
      )}
      {supplyResults.length>0&&(
        <>
          {tab==="all"&&(paintResults.length>0||toolResults.length>0)&&<div style={{height:1,background:T.border,margin:"10px 0"}}/>}
          {tab==="all"&&<div style={{color:T.dim,fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>SUPPLIES</div>}
          {supplyResults.map(c=>{
            const isLow=c.qty<=c.minQty;
            return (
              <button key={c.id}
                onClick={()=>onSelect({name:c.name,brand:c.brand||"",category:"Supplies",barcode:c.barcode||"",hex:""})}
                style={{display:"flex",alignItems:"center",gap:10,width:"100%",
                  background:T.bg,border:`1px solid ${isLow?T.red:T.border}`,borderRadius:8,
                  padding:"8px 10px",marginBottom:4,cursor:"pointer",textAlign:"left"}}>
                <div style={{width:32,height:32,borderRadius:7,background:isLow?"rgba(200,0,0,.12)":T.surface,
                  border:`1px solid ${isLow?T.red:T.border}`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={isLow?T.red:T.dim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:T.white,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.name}</div>
                  <div style={{fontSize:10,color:T.dim}}>{c.brand||"No brand"} · {c.type} · qty: {c.qty}{isLow?<span style={{color:T.red,fontWeight:900}}> · LOW</span>:null}</div>
                </div>
                <span style={{color:T.dimmer,fontSize:18,flexShrink:0}}>+</span>
              </button>
            );
          })}
        </>
      )}
    </div>
  );
}

function PaletteCard({pal,allPaints,ownedIds,addPaintToShop,onDelete,onEdit,ownedMap}){
  const [cartFlash,setCartFlash]=useState(null);
  const [showEdit,setShowEdit]=useState(false);
  const [eName,setEName]=useState(pal.name);
  const [eNotes,setENotes]=useState(pal.notes||"");
  const [eColours,setEColours]=useState([...pal.colours]);

  function saveEdit(){
    onEdit({...pal,name:eName,notes:eNotes,colours:eColours});
    setShowEdit(false);
  }

  return (
    <>
      {showEdit&&(
        <Sheet title="Edit Palette" badge="EDIT" onClose={()=>setShowEdit(false)}
          footer={<Btn onClick={saveEdit} disabled={!eName.trim()||!eColours.length} full>SAVE CHANGES</Btn>}>
          <FieldLabel>Palette Name</FieldLabel>
          <Field value={eName} onChange={setEName} placeholder="PALETTE NAME"/>
          <FieldLabel>Notes</FieldLabel>
          <Field value={eNotes} onChange={setENotes} placeholder="NOTES"/>
          {eColours.length>0&&(
            <div style={{marginBottom:12}}>
              <FieldLabel>Selected ({eColours.length})</FieldLabel>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
                {eColours.map(pid=>{
                  const p=allPaints.find(x=>x.id===pid);
                  return p?(
                    <div key={pid} style={{position:"relative"}}>
                      <div style={{width:36,height:36,borderRadius:8,background:p.hex,border:`1px solid ${T.orange}`}}/>
                      <button onClick={()=>setEColours(prev=>prev.filter(x=>x!==pid))}
                        style={{position:"absolute",top:-4,right:-4,width:14,height:14,borderRadius:"50%",
                          background:T.red,border:"none",color:"#fff",fontSize:8,cursor:"pointer",
                          display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900}}>✕</button>
                    </div>
                  ):null;
                })}
              </div>
            </div>
          )}
          <PaletteBuilder allPaints={allPaints} ownedIds={ownedIds}
            selected={eColours} setSelected={setEColours} addPaintToShop={addPaintToShop}/>
          {eColours.length>0&&(
            <div style={{marginTop:12}}>
              <MixSuggestions
                labComponents={eColours.map(id=>({paintId:id,drops:1}))}
                allPaints={allPaints} ownedIds={ownedIds}
                onAdd={p=>setEColours(prev=>prev.includes(p.id)?prev:[...prev,p.id])}/>
            </div>
          )}
        </Sheet>
      )}

      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:12,marginBottom:8}}>
        {/* header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
          <div>
            <div style={{fontWeight:900,fontSize:14}}>{pal.name}</div>
            {pal.notes&&<div style={{color:T.dim,fontSize:11,marginTop:2}}>{pal.notes}</div>}
            <div style={{color:T.orange,fontSize:11,fontWeight:700,marginTop:2}}>{pal.colours.length} COLOUR{pal.colours.length!==1?"S":""}</div>
          </div>
          <div style={{display:"flex",gap:6}}>
            <GhostBtn small onClick={()=>{setEName(pal.name);setENotes(pal.notes||"");setEColours([...pal.colours]);setShowEdit(true);}}>EDIT</GhostBtn>
            <GhostBtn small color={T.red} onClick={onDelete}>DEL</GhostBtn>
          </div>
        </div>

        {/* colour swatches strip */}
        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>
          {pal.colours.map(pid=>{
            const p=allPaints.find(x=>x.id===pid);
            return p?<div key={pid} title={p.name} style={{width:30,height:30,borderRadius:6,background:p.hex,border:`1px solid ${T.border}`}}/>:null;
          })}
        </div>

        {/* paint list with owned + cart */}
        {pal.colours.map(pid=>{
          const p=allPaints.find(x=>x.id===pid);
          if(!p) return null;
          const owned=ownedMap[p.id]||0;
          return (
            <div key={pid} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:`1px solid ${T.border}`}}>
              <div style={{width:22,height:22,borderRadius:5,background:p.hex,border:`1px solid ${T.border}`,flexShrink:0}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{color:T.white,fontSize:12,fontWeight:600}}>{p.name}</div>
                <div style={{color:T.dim,fontSize:10}}>{BRANDS[p.brand]?.name||p.brand} · {p.id}</div>
              </div>
              {/* owned badge */}
              <span style={{display:"flex",alignItems:"center",gap:2,
                color:owned>0?"#4ab8ff":T.dimmer,fontSize:10,fontWeight:900,
                border:`1px solid ${owned>0?"#4ab8ff":T.dimmer}`,
                borderRadius:5,padding:"1px 5px",flexShrink:0}}>
                <svg width="7" height="7" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                {owned}
              </span>
              {/* cart button */}
              <button onClick={()=>{addPaintToShop(p);setCartFlash(p.id);setTimeout(()=>setCartFlash(null),2000);}}
                style={{background:cartFlash===p.id?"rgba(68,204,136,.15)":"transparent",
                  border:`1px solid ${cartFlash===p.id?"#44cc88":T.border}`,
                  color:cartFlash===p.id?"#44cc88":T.yellow,
                  cursor:"pointer",borderRadius:6,padding:"3px 6px",fontSize:11,
                  fontWeight:900,flexShrink:0,transition:"all .2s",display:"flex",alignItems:"center"}}>
                {cartFlash===p.id?"✓":IC.cart}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

function PaletteBuilder({allPaints,ownedIds,selected,setSelected,addPaintToShop}){
  const [search,setSearch]=useState("");
  const [ownedOnly,setOwnedOnly]=useState(false);
  const [cartFlash,setCartFlash]=useState(null);

  const filtered=allPaints.filter(p=>{
    if(ownedOnly&&!ownedIds.includes(p.id)) return false;
    if(!search.trim()) return true;
    const q=search.toLowerCase();
    return p.name.toLowerCase().includes(q)||(p.id||"").toLowerCase().includes(q);
  }).slice(0,80);

  return (
    <div>
      <FieldLabel>ADD COLOURS</FieldLabel>
      {/* owned toggle */}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
        <div onClick={()=>setOwnedOnly(v=>!v)}
          style={{width:36,height:20,borderRadius:10,background:ownedOnly?T.orange:T.dimmer,
            position:"relative",cursor:"pointer",transition:"background .2s",flexShrink:0}}>
          <div style={{position:"absolute",top:2,left:ownedOnly?18:2,width:16,height:16,
            borderRadius:"50%",background:"#fff",transition:"left .2s"}}/>
        </div>
        <span style={{color:ownedOnly?T.orange:T.dim,fontSize:11,fontWeight:700,textTransform:"uppercase"}}>
          {ownedOnly?"MY PAINTS ONLY":"ALL PAINTS"}
        </span>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)}
        placeholder="SEARCH PAINTS..."
        style={{width:"100%",boxSizing:"border-box",background:"#0a0a0a",border:`1px solid ${T.border}`,
          borderRadius:10,padding:"9px 12px",color:T.white,fontSize:13,fontFamily:T.font,
          outline:"none",marginBottom:8}}/>
      <div style={{maxHeight:260,overflowY:"auto",border:`1px solid ${T.border}`,borderRadius:10}}>
        {filtered.map(p=>{
          const isSelected=selected.includes(p.id);
          const owned=ownedIds.includes(p.id);
          return (
            <div key={p.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",
              background:isSelected?"rgba(212,245,74,.06)":"transparent",
              borderBottom:`1px solid ${T.border}`}}>
              {/* colour swatch — tap to select */}
              <div onClick={()=>setSelected(prev=>isSelected?prev.filter(x=>x!==p.id):[...prev,p.id])}
                style={{width:28,height:28,borderRadius:6,background:p.hex,flexShrink:0,cursor:"pointer",
                  border:`2px solid ${isSelected?T.orange:T.border}`}}/>
              {/* name — tap to select */}
              <div onClick={()=>setSelected(prev=>isSelected?prev.filter(x=>x!==p.id):[...prev,p.id])}
                style={{flex:1,minWidth:0,cursor:"pointer"}}>
                <div style={{color:T.white,fontSize:12,fontWeight:600}}>{p.name}</div>
                <div style={{color:T.dim,fontSize:10}}>{BRANDS[p.brand]?.name||p.brand} · {p.id}</div>
              </div>
              {/* owned badge */}
              <span style={{display:"flex",alignItems:"center",gap:2,
                color:owned?"#4ab8ff":T.dimmer,fontSize:10,fontWeight:900,
                border:`1px solid ${owned?"#4ab8ff":T.dimmer}`,
                borderRadius:5,padding:"1px 5px",flexShrink:0}}>
                <svg width="7" height="7" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                {owned?1:0}
              </span>
              {/* cart button */}
              <button onClick={e=>{e.stopPropagation();addPaintToShop(p);setCartFlash(p.id);setTimeout(()=>setCartFlash(null),2000);}}
                style={{background:cartFlash===p.id?"rgba(68,204,136,.15)":"transparent",
                  border:`1px solid ${cartFlash===p.id?"#44cc88":T.border}`,
                  color:cartFlash===p.id?"#44cc88":T.yellow,
                  cursor:"pointer",borderRadius:6,padding:"3px 6px",fontSize:11,
                  fontWeight:900,flexShrink:0,transition:"all .2s",display:"flex",alignItems:"center"}}>
                {cartFlash===p.id?"✓":IC.cart}
              </button>
              {/* select checkmark */}
              <div onClick={()=>setSelected(prev=>isSelected?prev.filter(x=>x!==p.id):[...prev,p.id])}
                style={{color:isSelected?T.orange:T.dimmer,fontSize:16,fontWeight:900,flexShrink:0,cursor:"pointer",width:16,textAlign:"center"}}>
                {isSelected?"✓":"+"}
              </div>
            </div>
          );
        })}
        {filtered.length===0&&(
          <div style={{textAlign:"center",color:T.dim,fontSize:11,padding:20}}>No paints found</div>
        )}
      </div>
    </div>
  );
}

function PaintDetailSheet({p,barcodeMap,ownedIds,ownedMap,allPaints,labComponents,setLabComponents,
  paintDetailPhotos,setPaintDetailPhotos,paintMixToast,setPaintMixToast,onClose,onEdit,onAddToShop,onAddToCollection,onSaveEdit,cartToast,setLightbox}){
  const bc=Object.entries(barcodeMap).find(([,id])=>id===p.id)?.[0]||p.barcode||null;
  const owned=ownedIds.includes(p.id);
  const photos=paintDetailPhotos[p.id]||[];
  const inMix=labComponents.find(c=>c.paintId===p.id);
  const [addedFlash,setAddedFlash]=useState(false);
  const [mixBanner,setMixBanner]=useState(false);
  const [editName,setEditName]=useState(p.name);
  const [editHex,setEditHex]=useState(p.hex||"#888888");
  const [editBC,setEditBC]=useState(bc||"");
  const [editPrice,setEditPrice]=useState(p.price!=null?String(p.price):"");

  const [editMode,setEditMode]=useState(false);

  function addToMix(){
    setLabComponents(prev=>{
      const ex=prev.find(c=>c.paintId===p.id);
      if(ex) return prev.map(c=>c.paintId===p.id?{...c,drops:c.drops+1}:c);
      return [...prev,{paintId:p.id,drops:1}];
    });
    setPaintMixToast({name:p.name,hex:p.hex});
    setAddedFlash(true);
    setMixBanner(true);
    setTimeout(()=>{setPaintMixToast(null);setAddedFlash(false);setMixBanner(false);},2500);
  }

  function addPhoto(e){
    const file=e.target.files?.[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=ev=>setPaintDetailPhotos(prev=>({...prev,[p.id]:[...(prev[p.id]||[]),ev.target.result]}));
    reader.readAsDataURL(file);
  }

  return (
    <Sheet title={p.name} badge="PAINT" onClose={onClose}
      footer={<Btn onClick={()=>onSaveEdit(p,editName,editHex,editBC,editPrice)} full>SAVE CHANGES</Btn>}
      toast={cartToast?(
        <div style={{background:"#2a2000",borderBottom:`1px solid ${T.yellow}`,
          padding:"10px 16px",display:"flex",alignItems:"center",gap:10}}>
          {p.hex&&<div style={{width:20,height:20,borderRadius:5,background:p.hex,border:`1px solid ${T.border}`,flexShrink:0}}/>}
          <div style={{flex:1}}>
            <div style={{color:T.yellow,fontWeight:900,fontSize:11,letterSpacing:1,textTransform:"uppercase"}}>✓ ADDED TO SHOPPING LIST</div>
            <div style={{color:T.white,fontSize:13,fontWeight:700,marginTop:1}}>{p.name}</div>
          </div>
          <span style={{color:T.yellow}}>✓</span>
        </div>
      ):null}>
      {/* colour swatch + info */}
      <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:16,
        background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,padding:14}}>
        <div style={{width:72,height:72,borderRadius:12,background:p.hex,
          border:`1px solid ${T.border}`,flexShrink:0,boxShadow:`0 0 24px ${p.hex}66`}}/>
        <div style={{flex:1}}>
          <div style={{fontWeight:900,fontSize:16,color:T.white,marginBottom:2}}>{p.name}</div>
          <div style={{color:T.dim,fontSize:12,marginBottom:2}}>{BRANDS[p.brand]?.name||p.brand} · {p.line}</div>
          <div style={{fontFamily:"monospace",color:T.orange,fontSize:12,marginBottom:4}}>{p.hex?.toUpperCase()}</div>
          {bc?<div style={{color:T.orange,fontSize:11,fontFamily:"monospace"}}>▐ {bc}</div>
            :<div style={{color:T.dimmer,fontSize:11}}>NO BARCODE</div>}
          {owned&&<div style={{color:"#44cc88",fontSize:10,fontWeight:700,marginTop:4,letterSpacing:1}}>✓ IN COLLECTION ({ownedMap[p.id]})</div>}
        </div>
      </div>

      {/* inline banners */}
      {mixBanner&&(
        <div style={{background:"#0d2e1a",border:`1px solid #44cc88`,borderRadius:12,
          padding:"10px 16px",marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
          {p.hex&&<div style={{width:24,height:24,borderRadius:6,background:p.hex,border:`1px solid ${T.border}`,flexShrink:0}}/>}
          <div style={{flex:1}}>
            <div style={{color:"#44cc88",fontWeight:900,fontSize:11,letterSpacing:1,textTransform:"uppercase"}}>✓ ADDED TO MIX</div>
            <div style={{color:T.white,fontSize:13,fontWeight:700,marginTop:1}}>{p.name}</div>
          </div>
          <span style={{color:"#44cc88",fontSize:20}}>✓</span>
        </div>
      )}
      {/* grouped action buttons */}
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden",marginBottom:14}}>
        {/* Add to Mix */}
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",borderBottom:`1px solid ${T.border}`}}>
          <span style={{display:"flex"}}>{IC.flask}</span>
          <span style={{flex:1,color:addedFlash?"#44cc88":T.orange,fontWeight:900,fontSize:13,letterSpacing:.5,textTransform:"uppercase"}}>
            {addedFlash?"ADDED TO MIX!":inMix?`IN MIX (${inMix.drops})`:"ADD TO MIX"}
          </span>
          <button onClick={addToMix}
            style={{background:addedFlash?"#44cc88":T.orange,border:"none",borderRadius:8,
              color:"#000",fontWeight:900,fontSize:11,letterSpacing:.5,
              padding:"5px 0",cursor:"pointer",textTransform:"uppercase",
              transition:"all .2s",flexShrink:0,width:90,textAlign:"center"}}>
            {addedFlash?"✓":inMix?"+ DROP":"+ MIX"}
          </button>
        </div>

        {/* Library stepper */}
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",borderBottom:`1px solid ${T.border}`}}>
          <span style={{display:"flex"}}>{IC.box}</span>
          <span style={{flex:1,color:"#44cc88",fontWeight:900,fontSize:13,letterSpacing:.5,textTransform:"uppercase"}}>ADD TO LIBRARY</span>
          <div style={{display:"flex",alignItems:"center",gap:0,border:`1px solid ${owned?"#44cc88":T.border}`,borderRadius:8,overflow:"hidden",flexShrink:0,width:90,justifyContent:"center"}}>
            <button onClick={()=>onAddToCollection(p,-1)}
              style={{width:28,height:30,background:T.bg,border:"none",color:T.white,fontSize:16,cursor:"pointer",fontWeight:900}}>−</button>
            <div style={{minWidth:28,textAlign:"center",color:"#44cc88",fontSize:13,fontWeight:900,padding:"0 4px"}}>{ownedMap[p.id]||0}</div>
            <button onClick={()=>onAddToCollection(p,1)}
              style={{width:28,height:30,background:T.bg,border:"none",color:T.white,fontSize:16,cursor:"pointer",fontWeight:900}}>+</button>
          </div>
        </div>

        {/* Shopping list */}
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px"}}>
          <span style={{display:"flex"}}>{IC.cart}</span>
          <span style={{flex:1,color:T.yellow,fontWeight:900,fontSize:13,letterSpacing:.5,textTransform:"uppercase"}}>SHOPPING LIST</span>
          <button onClick={()=>onAddToShop(p)}
            style={{background:T.bg,border:`1px solid ${T.yellow}`,borderRadius:8,
              color:T.yellow,fontWeight:900,fontSize:11,letterSpacing:.5,
              padding:"5px 0",cursor:"pointer",textTransform:"uppercase",flexShrink:0,
              width:90,textAlign:"center"}}>
            + CART
          </button>
        </div>
      </div>

      {/* similar & complementary */}
      <MixSuggestions labComponents={[{paintId:p.id,drops:1}]} allPaints={allPaints}
        ownedIds={ownedIds} onAdd={sp=>{
          setLabComponents(prev=>{
            const ex=prev.find(c=>c.paintId===sp.id);
            if(ex) return prev.map(c=>c.paintId===sp.id?{...c,drops:c.drops+1}:c);
            return [...prev,{paintId:sp.id,drops:1}];
          });
          setPaintMixToast({name:sp.name,hex:sp.hex});
          setTimeout(()=>setPaintMixToast(null),1500);
        }}/>

      {/* photo strip — always visible above edit section */}
      {photos.length>0&&(
        <div style={{marginBottom:14}}>
          <div style={{color:T.dim,fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:8,display:"flex",alignItems:"center",gap:6}}>{IC.camera} PHOTOS</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {photos.map((ph,i)=>(
              <div key={i} onClick={()=>setLightbox&&setLightbox({photos:photos.map((src,j)=>({id:j,src,name:`Photo ${j+1}`})),index:i})}
                style={{position:"relative",width:80,height:80,cursor:"pointer",flexShrink:0}}>
                <img src={ph} alt="" style={{width:80,height:80,borderRadius:10,objectFit:"cover",
                  border:`1px solid ${T.border}`,boxShadow:"0 4px 12px rgba(0,0,0,.5)",display:"block"}}/>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* edit toggle */}
      <button onClick={()=>setEditMode(e=>!e)}
        style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"12px 16px",marginBottom:editMode?0:14,
          background:editMode?"rgba(212,245,74,.05)":"transparent",
          border:`1px solid ${editMode?T.orange:T.border}`,borderRadius:editMode?"12px 12px 0 0":12,
          cursor:"pointer",
          boxShadow:editMode?"none":"0 4px 16px rgba(0,0,0,.4)",
          transition:"all .2s"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{display:"flex"}}>{IC.edit}</span>
          <span style={{color:editMode?T.orange:T.white,fontWeight:900,fontSize:12,letterSpacing:1,textTransform:"uppercase"}}>
            EDIT PAINT INFO & PHOTOS
          </span>
        </div>
        <span style={{color:editMode?T.orange:T.dim,fontSize:14,fontWeight:700}}>{editMode?"▲":"▼"}</span>
      </button>

      {editMode&&(
        <div style={{border:`1px solid ${T.orange}`,borderTop:"none",borderRadius:"0 0 12px 12px",
          padding:"14px 14px 4px",marginBottom:14,background:"rgba(212,245,74,.03)"}}>

          {/* photos */}
          <FieldLabel>PHOTOS — BOTTLE & COLOUR SWATCH</FieldLabel>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
            {photos.map((ph,i)=>(
              <div key={i} style={{position:"relative",width:80,height:80}}>
                <img src={ph} alt="" style={{width:80,height:80,borderRadius:10,objectFit:"cover",border:`1px solid ${T.border}`}}/>
                <button onClick={()=>setPaintDetailPhotos(prev=>({...prev,[p.id]:prev[p.id].filter((_,j)=>j!==i)}))}
                  style={{position:"absolute",top:2,right:2,background:"rgba(0,0,0,.7)",border:"none",
                    color:"#fff",borderRadius:"50%",width:18,height:18,cursor:"pointer",fontSize:10,
                    display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
              </div>
            ))}
            <label style={{width:80,height:80,border:`2px dashed ${T.border}`,borderRadius:10,
              display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
              cursor:"pointer",color:T.dimmer,fontSize:10,gap:4,flexShrink:0}}>
              <span style={{display:"flex",justifyContent:"center"}}>{IC.camera}</span>
              <span>ADD</span>
              <input type="file" accept="image/*" onChange={addPhoto} style={{display:"none"}}/>
            </label>
          </div>

          {/* edit fields */}
          <div style={{borderTop:`2px solid ${T.border}`,paddingTop:14}}>
            <FieldLabel>Paint Name</FieldLabel>
            <Field value={editName} onChange={setEditName} placeholder="PAINT NAME"/>
            {p.brand==="custom"&&(
              <>
                <FieldLabel>Colour</FieldLabel>
                <div style={{display:"flex",gap:8,marginBottom:10}}>
                  <input type="color" value={editHex} onChange={e=>setEditHex(e.target.value)}
                    style={{width:48,height:40,border:`1px solid ${T.border}`,borderRadius:8,background:"none",cursor:"pointer"}}/>
                  <Field value={editHex} onChange={setEditHex} placeholder="#888888" mono style={{marginBottom:0,flex:1}}/>
                </div>
              </>
            )}
            <FieldLabel>Barcode</FieldLabel>
            <Field value={editBC} onChange={setEditBC} placeholder="SCAN OR TYPE BARCODE" mono/>
            <div style={{color:T.dim,fontSize:10,letterSpacing:1,marginBottom:14,textTransform:"uppercase"}}>Once linked, scanning this barcode finds this paint instantly.</div>
            <FieldLabel>Price per pot (optional)</FieldLabel>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:14}}>
              <span style={{color:T.dim,fontSize:13,fontWeight:700}}>$</span>
              <input type="number" min="0" step="0.01" value={editPrice} onChange={e=>setEditPrice(e.target.value)} placeholder="0.00"
                style={{flex:1,background:"#0a0a0a",border:`1px solid ${T.border}`,padding:"10px 12px",color:T.white,fontSize:13,fontFamily:T.font,outline:"none",borderRadius:8}}/>
            </div>
          </div>
        </div>
      )}
    </Sheet>
  );
}

function ToolDetailSheet({tool,ownedIds,ownedMap,setOwnedMap,setTools,tools,onClose,onAddToShop,onDelete,setLightbox,cartToast}){
  const owned=ownedIds.includes(tool.id);
  const toolIcon=tool.type==="Brush"||tool.type==="Airbrush"?IC.brush:tool.type==="Primer"||tool.type==="Varnish"?IC.primer:tool.type==="Masking Tape"?IC.masking:IC.tool;

  const [confirmDelete,setConfirmDelete]=useState(false);
  const [cartAdded,setCartAdded]=useState(false);
  const [editMode,setEditMode]=useState(false);
  const [eName,setEName]=useState(tool.name||"");
  const [eBrand,setEBrand]=useState(tool.brand||"");
  const [eType,setEType]=useState(tool.type||"Other");
  const [eNotes,setENotes]=useState(tool.notes||"");
  const [eBarcode,setEBarcode]=useState(tool.barcode||"");
  const [eLocation,setELocation]=useState(tool.location||"");
  const [ePrice,setEPrice]=useState(tool.price!=null?String(tool.price):"");
  const [eImages,setEImages]=useState(tool.images||[]);
  const imgInputRef=useRef(null);

  function addPhoto(e){
    const file=e.target.files?.[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=ev=>{
      const img={id:"ti"+Date.now()+Math.random(),src:ev.target.result,name:file.name};
      setEImages(prev=>[...prev,img]);
      setTools(prev=>prev.map(t=>t.id!==tool.id?t:{...t,images:[...(t.images||[]),img]}));
    };
    reader.readAsDataURL(file);
    e.target.value="";
  }
  function removePhoto(id){
    setEImages(prev=>prev.filter(i=>i.id!==id));
    setTools(prev=>prev.map(t=>t.id!==tool.id?t:{...t,images:(t.images||[]).filter(i=>i.id!==id)}));
  }

  function saveChanges(){
    setTools(prev=>prev.map(t=>t.id!==tool.id?t:{...t,name:eName,brand:eBrand,type:eType,notes:eNotes,barcode:eBarcode,location:eLocation,images:eImages,price:ePrice?parseFloat(ePrice):null}));
    onClose();
  }

  return (
    <Sheet title={tool.name} badge="TOOL" onClose={onClose}
      toast={cartToast?(
        <div style={{background:"#2a2000",borderBottom:`1px solid ${T.yellow}`,
          padding:"10px 16px",display:"flex",alignItems:"center",gap:10}}>
          <div style={{flex:1}}>
            <div style={{color:T.yellow,fontWeight:900,fontSize:11,letterSpacing:1,textTransform:"uppercase"}}>✓ ADDED TO SHOPPING LIST</div>
            <div style={{color:T.white,fontSize:13,fontWeight:700,marginTop:1}}>{tool.name}</div>
          </div>
          <span style={{color:T.yellow,fontSize:18}}>✓</span>
        </div>
      ):null}
      footer={
        <div style={{display:"flex",gap:8}}>
          <Btn onClick={saveChanges} full>SAVE CHANGES</Btn>
          <GhostBtn onClick={()=>setConfirmDelete(true)} color={T.red} small>DEL</GhostBtn>
        </div>
      }>
      {/* header */}
      <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:16,
        background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,padding:14}}>
        <div style={{width:64,height:64,borderRadius:12,flexShrink:0,
          background:owned?"rgba(212,245,74,.08)":T.card,
          border:`1px solid ${owned?T.orange:T.border}`,
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>
          {toolIcon}
        </div>
        <div style={{flex:1}}>
          <div style={{fontWeight:900,fontSize:16,color:T.white,marginBottom:2}}>{tool.name}</div>
          {tool.brand&&<div style={{color:T.dim,fontSize:12,marginBottom:2}}>{tool.brand}</div>}
          <Badge small color={T.orange}>{tool.type||"Tool"}</Badge>
          {tool.barcode&&<div style={{color:T.orange,fontSize:11,fontFamily:"monospace",marginTop:4}}>▐ {tool.barcode}</div>}
          {owned&&<div style={{color:"#44cc88",fontSize:10,fontWeight:700,marginTop:4,letterSpacing:1}}>✓ IN COLLECTION ({ownedMap[tool.id]})</div>}
        </div>
      </div>

      {/* action buttons */}
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden",marginBottom:14}}>
        {/* Add to Library */}
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",borderBottom:`1px solid ${T.border}`}}>
          <span style={{display:"flex"}}>{IC.box}</span>
          <span style={{flex:1,color:"#44cc88",fontWeight:900,fontSize:13,letterSpacing:.5,textTransform:"uppercase"}}>ADD TO LIBRARY</span>
          <div style={{display:"flex",alignItems:"center",gap:0,border:`1px solid ${owned?"#44cc88":T.border}`,borderRadius:8,overflow:"hidden",flexShrink:0,width:90,justifyContent:"center"}}>
            <button onClick={()=>{const q=Math.max(0,(ownedMap[tool.id]||0)-1);setOwnedMap(m=>({...m,[tool.id]:q}));setTools(prev=>prev.map(t=>t.id===tool.id?{...t,owned:q>0}:t));}}
              style={{width:28,height:30,background:T.bg,border:"none",color:T.white,fontSize:16,cursor:"pointer",fontWeight:900}}>−</button>
            <div style={{minWidth:28,textAlign:"center",color:"#44cc88",fontSize:13,fontWeight:900,padding:"0 4px"}}>{ownedMap[tool.id]||0}</div>
            <button onClick={()=>{const q=(ownedMap[tool.id]||0)+1;setOwnedMap(m=>({...m,[tool.id]:q}));setTools(prev=>prev.map(t=>t.id===tool.id?{...t,owned:true}:t));}}
              style={{width:28,height:30,background:T.bg,border:"none",color:T.white,fontSize:16,cursor:"pointer",fontWeight:900}}>+</button>
          </div>
        </div>
        {/* Shopping list */}
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px"}}>
          <span style={{display:"flex"}}>{IC.cart}</span>
          <span style={{flex:1,color:T.yellow,fontWeight:900,fontSize:13,letterSpacing:.5,textTransform:"uppercase"}}>SHOPPING LIST</span>
          <button onClick={()=>{onAddToShop(tool);setCartAdded(true);setTimeout(()=>setCartAdded(false),2000);}}
            style={{background:cartAdded?"rgba(68,204,136,.15)":T.bg,
              border:`1px solid ${cartAdded?"#44cc88":T.yellow}`,borderRadius:8,
              color:cartAdded?"#44cc88":T.yellow,fontWeight:900,fontSize:11,letterSpacing:.5,
              padding:"5px 0",cursor:"pointer",textTransform:"uppercase",flexShrink:0,
              width:90,textAlign:"center",transition:"all .2s"}}>
            {cartAdded?"✓ ADDED":"+ CART"}
          </button>
        </div>
      </div>

      {/* notes */}
      {tool.notes&&(
        <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,padding:12,marginBottom:14}}>
          <div style={{color:T.dim,fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>NOTES</div>
          <div style={{color:T.white,fontSize:13,lineHeight:1.5}}>{tool.notes}</div>
        </div>
      )}

      {/* photos — always visible when present */}
      {eImages.length>0&&(
        <div style={{marginBottom:14}}>
          <div style={{color:T.dim,fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:8,display:"flex",alignItems:"center",gap:6}}>{IC.camera} PHOTOS</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {eImages.map((img,i)=>(
              <div key={img.id} onClick={()=>setLightbox({photos:eImages,index:i})}
                style={{width:80,height:80,flexShrink:0,cursor:"pointer"}}>
                <img src={img.src} alt={img.name}
                  style={{width:80,height:80,borderRadius:10,objectFit:"cover",
                    border:`1px solid ${T.border}`,boxShadow:"0 4px 12px rgba(0,0,0,.5)",display:"block"}}/>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* edit toggle */}
      <button onClick={()=>setEditMode(e=>!e)}
        style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"12px 16px",marginBottom:editMode?0:14,
          background:editMode?"rgba(212,245,74,.05)":"transparent",
          border:`1px solid ${editMode?T.orange:T.border}`,borderRadius:editMode?"12px 12px 0 0":12,
          cursor:"pointer",
          boxShadow:editMode?"none":"0 4px 16px rgba(0,0,0,.4)",
          transition:"all .2s"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{display:"flex"}}>{IC.edit}</span>
          <span style={{color:editMode?T.orange:T.white,fontWeight:900,fontSize:12,letterSpacing:1,textTransform:"uppercase"}}>
            EDIT TOOL INFO & PHOTOS
          </span>
        </div>
        <span style={{color:editMode?T.orange:T.dim,fontSize:14,fontWeight:700}}>{editMode?"▲":"▼"}</span>
      </button>

      {editMode&&(
        <div style={{border:`1px solid ${T.orange}`,borderTop:"none",borderRadius:"0 0 12px 12px",
          padding:"14px 14px 4px",marginBottom:14,background:"rgba(212,245,74,.03)"}}>

          {/* photo picker */}
          <FieldLabel>PHOTOS — PRODUCT IMAGE</FieldLabel>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
            {eImages.map((img,i)=>(
              <div key={img.id} style={{position:"relative",width:80,height:80}}>
                <img src={img.src} alt={img.name}
                  style={{width:80,height:80,borderRadius:10,objectFit:"cover",border:`1px solid ${T.border}`,display:"block"}}/>
                <button onClick={()=>removePhoto(img.id)}
                  style={{position:"absolute",top:2,right:2,background:"rgba(0,0,0,.7)",border:"none",
                    color:"#fff",borderRadius:"50%",width:18,height:18,cursor:"pointer",fontSize:10,
                    display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
              </div>
            ))}
            <label style={{width:80,height:80,border:`2px dashed ${T.border}`,borderRadius:10,
              display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
              cursor:"pointer",color:T.dimmer,fontSize:10,gap:4,flexShrink:0}}>
              <span style={{display:"flex",justifyContent:"center"}}>{IC.camera}</span>
              <span>ADD</span>
              <input type="file" accept="image/*" onChange={addPhoto} style={{display:"none"}}/>
            </label>
          </div>

          {/* edit fields */}
          <div style={{borderTop:`2px solid ${T.border}`,paddingTop:14}}>
            <FieldLabel>Tool Name</FieldLabel>
            <Field value={eName} onChange={setEName} placeholder="E.G. WINSOR & NEWTON SERIES 7 NO.1"/>
            <FieldLabel>Brand</FieldLabel>
            <Field value={eBrand} onChange={setEBrand} placeholder="E.G. WINSOR & NEWTON"/>
            <FieldLabel>Type</FieldLabel>
            <select value={eType} onChange={e=>setEType(e.target.value)}
              style={{width:"100%",background:"#0a0a0a",border:`1px solid ${T.border}`,borderRadius:10,
                padding:"10px 12px",color:T.white,fontSize:13,marginBottom:10,fontFamily:T.font,outline:"none"}}>
              {TOOL_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
            <FieldLabel>Notes (optional)</FieldLabel>
            <Field value={eNotes} onChange={setENotes} placeholder="E.G. SIZE 1, NATURAL HAIR..."/>
            <FieldLabel>Barcode (optional)</FieldLabel>
            <Field value={eBarcode} onChange={setEBarcode} placeholder="SCAN OR TYPE BARCODE" mono/>
            <FieldLabel>Location (optional)</FieldLabel>
            <Field value={eLocation} onChange={setELocation} placeholder="E.G. DRAWER 2, BRUSH POT"/>
            <FieldLabel>Price per item (optional)</FieldLabel>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
              <span style={{color:T.dim,fontSize:13,fontWeight:700}}>$</span>
              <input type="number" min="0" step="0.01" value={ePrice} onChange={e=>setEPrice(e.target.value)} placeholder="0.00"
                style={{flex:1,background:"#0a0a0a",border:`1px solid ${T.border}`,padding:"10px 12px",color:T.white,fontSize:13,fontFamily:T.font,outline:"none",borderRadius:8}}/>
            </div>
          </div>

          {confirmDelete&&(
            <div style={{marginTop:12,background:"rgba(200,0,0,.08)",border:`1px solid ${T.red}`,
              borderRadius:12,padding:14}}>
              <div style={{color:T.white,fontWeight:700,fontSize:13,marginBottom:10}}>
                Delete <span style={{color:T.red}}>{tool.name}</span>? This cannot be undone.
              </div>
              <div style={{display:"flex",gap:8}}>
                <Btn onClick={()=>{onDelete(tool.id);}} color={T.red} full>YES, DELETE</Btn>
                <GhostBtn onClick={()=>setConfirmDelete(false)} color={T.dim} small>CANCEL</GhostBtn>
              </div>
            </div>
          )}
        </div>
      )}
    </Sheet>
  );
}

function PaintsUsed({paints,allPaints}){
  const [showAll,setShowAll]=useState(false);
  const visible=showAll?paints:paints.slice(0,5);
  return (
    <div style={{marginBottom:20}}>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
        {visible.map(pid=>{
          const p=allPaints.find(x=>x.id===pid); if(!p) return null;
          return (
            <div key={pid} style={{display:"flex",alignItems:"center",gap:6,
              background:T.surface,border:`1px solid ${T.border}`,
              padding:"4px 8px",borderRadius:8}}>
              <div style={{width:14,height:14,borderRadius:3,background:p.hex,border:`1px solid ${T.border}`}}/>
              <span style={{color:T.white,fontSize:11,fontWeight:700}}>{p.name}</span>
              <span style={{color:T.dim,fontSize:10}}>{BRANDS[p.brand]?.name||p.brand} · {p.id}</span>
            </div>
          );
        })}
        {!paints.length&&<span style={{color:T.dim,fontSize:12}}>Add a mix to see paints.</span>}
      </div>
      {paints.length>5&&(
        <button onClick={()=>setShowAll(s=>!s)}
          style={{background:"none",border:`1px solid ${T.border}`,borderRadius:8,
            color:T.orange,fontWeight:700,fontSize:11,letterSpacing:1,
            textTransform:"uppercase",padding:"5px 14px",cursor:"pointer"}}>
          {showAll?`▲ SHOW LESS`:`▼ SHOW ALL ${paints.length} PAINTS`}
        </button>
      )}
    </div>
  );
}

function PaintTrackerApp(){
  const [view,setView]=useState("projects");
  const [selProj,setSelProj]=useState(null);
  const [customPaints,setCustomPaints]=useState(()=>{try{return JSON.parse(localStorage.getItem("pf_customPaints")||"[]");}catch{return [];}});
  const [paintPrices,setPaintPrices]=useState(()=>{try{return JSON.parse(localStorage.getItem("pf_paintPrices")||"{}");}catch{return {};}});
  const [barcodeMap,setBarcodeMap]=useState(()=>{try{return JSON.parse(localStorage.getItem("pf_barcodeMap")||"{}");}catch{return {};}});
  const [ownedMap,setOwnedMap]=useState(()=>{try{return JSON.parse(localStorage.getItem("pf_ownedMap")||'{"t1":1,"t2":2}');}catch{return {"t1":1,"t2":2};}});
  const ownedIds=Object.keys(ownedMap).filter(id=>ownedMap[id]>0);
  const [projInfoEdit,setProjInfoEdit]=useState(false);
  const [lightbox,setLightbox]=useState(null); // {photos, index}

  const [tools,setTools]=useState(()=>{try{const s=localStorage.getItem('pf_tools');if(s)return JSON.parse(s);}catch{}return [{
    id:"t1",name:"Series 7 Kolinsky No.1",brand:"Winsor & Newton",type:"Brush",
    notes:"Best miniature brush — keeps a fine point",owned:true,barcode:"",qty:1,
    images:[],location:"Brush pot on desk",purchaseDate:"2025-11-10",
    receipt:null,purchaseFrom:"Amazon",
  },{
    id:"t2",name:"Zenithal Grey Primer",brand:"Vallejo",type:"Primer",
    notes:"Apply from above at 45° for zenithal highlight",owned:true,barcode:"",qty:2,
    images:[],location:"Shelf above desk",purchaseDate:"2025-12-01",
    receipt:null,purchaseFrom:"Local Hobby Shop",
  }];});
  const [consumables,setConsumables]=useState(()=>{
    try{const s=localStorage.getItem('pf_consumables');if(s)return JSON.parse(s);}catch{}
    return [{
      id:"con1",name:"Wet/Dry Sandpaper 400 Grit",brand:"3M",type:"Sandpaper",
      notes:"Good for resin cleanup",barcode:"",qty:5,minQty:2,
      location:"Supply drawer",purchaseDate:"2025-12-01",purchaseFrom:"Amazon",receipt:null,
    },{
      id:"con2",name:"Swann-Morton No.11 Blades",brand:"Swann-Morton",type:"Blades",
      notes:"Standard hobby knife blades — replace often",barcode:"",qty:10,minQty:3,
      location:"Desk organiser",purchaseDate:"2025-11-15",purchaseFrom:"Local Hobby Shop",receipt:null,
    }];
  });
  const [shopItems,setShopItems]=useState(()=>{try{const s=localStorage.getItem('pf_shopItems');return s?JSON.parse(s):[];}catch{return [];}});

  const [projects,setProjects]=useState(()=>{try{const s=localStorage.getItem('pf_projects');if(s)return JSON.parse(s);}catch{}return [{
    id:"p1",name:"Demo Project",description:"Tap to explore",createdAt:"2026-05-24",tags:["DEMO"],
    mixes:[{id:"m1",name:"Armor Shadow",notes:"Base layer thin 1:1",components:[{paintId:"K121",drops:3},{paintId:"K109",drops:2}],photos:[],info:"",infoPhotos:[]}],
    paints:["K121","K109"],info:"",infoPhotos:[],
  }];});

  // Compute allPaints with barcode and price overrides
  const allPaints=[...ALL_PAINTS,...customPaints].map(p=>{
    const bc=Object.entries(barcodeMap).find(([,id])=>id===p.id)?.[0];
    const price=paintPrices[p.id]??p.price??null;
    return {...p,...(bc?{barcode:bc}:{}),price};
  });

  function exportData(){
    const data={
      version:1,
      exportedAt:new Date().toISOString(),
      ownedMap,
      barcodeMap,
      paintPrices,
      customPaints,
      tools,
      consumables,
      shopItems,
      projects,
    };
    const json=JSON.stringify(data,null,2);
    const blob=new Blob([json],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;
    a.download=`paintforge-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(file){
    if(!file) return;
    setImportError("");setImportSuccess(false);
    const r=new FileReader();
    r.onload=e=>{
      try{
        const data=JSON.parse(e.target.result);
        if(!data.version||!data.ownedMap) throw new Error("Invalid backup file");
        if(data.ownedMap) setOwnedMap(data.ownedMap);
        if(data.barcodeMap) setBarcodeMap(data.barcodeMap);
        if(data.paintPrices) setPaintPrices(data.paintPrices);
        if(data.customPaints) setCustomPaints(data.customPaints);
        if(data.tools) setTools(data.tools);
        if(data.consumables) setConsumables(data.consumables);
        if(data.shopItems) setShopItems(data.shopItems);
        if(data.projects) setProjects(data.projects);
        setImportSuccess(true);
        setTimeout(()=>setImportSuccess(false),3000);
      }catch(err){
        setImportError("Invalid file — make sure you're importing a PaintForge backup.");
      }
    };
    r.readAsText(file);
  }

  // Persist key state to localStorage
  useEffect(()=>{try{localStorage.setItem("pf_barcodeMap",JSON.stringify(barcodeMap));}catch{}},[barcodeMap]);
  useEffect(()=>{try{localStorage.setItem("pf_ownedMap",JSON.stringify(ownedMap));}catch{}},[ownedMap]);
  useEffect(()=>{try{localStorage.setItem("pf_customPaints",JSON.stringify(customPaints));}catch{}},[customPaints]);
  useEffect(()=>{try{localStorage.setItem("pf_paintPrices",JSON.stringify(paintPrices));}catch{}},[paintPrices]);

  // ── Supabase sync ──
  const [uid]=useState(getUID);
  const [syncStatus,setSyncStatus]=useState("idle");
  useEffect(()=>{_syncSetStatus=setSyncStatus;},[]);

  // Load from Supabase — only on app focus, not constantly
  async function loadFromDB(){
    setSyncStatus("loading");
    try{
      await sbUpsert("pf_users",[{id:uid}]);
      const [b,o,pr,cp,tl,cn,sh,pj]=await Promise.all([
        sbGet("pf_barcodes",uid),sbGet("pf_owned",uid),sbGet("pf_prices",uid),
        sbGet("pf_custom_paints",uid),sbGet("pf_tools",uid),sbGet("pf_consumables",uid),
        sbGet("pf_shop_items",uid),sbGet("pf_projects",uid),
      ]);
      if(b.length) setBarcodeMap(Object.fromEntries(b.map(r=>[r.barcode,r.paint_id])));
      if(o.length) setOwnedMap(Object.fromEntries(o.map(r=>[r.paint_id,r.qty])));
      if(pr.length) setPaintPrices(Object.fromEntries(pr.map(r=>[r.paint_id,r.price])));
      if(cp.length) setCustomPaints(cp.map(r=>r.data));
      if(tl.length) setTools(tl.map(r=>r.data));
      if(cn.length) setConsumables(cn.map(r=>r.data));
      if(sh.length) setShopItems(sh.map(r=>r.data));
      if(pj.length) setProjects(pj.map(r=>r.data));
      setSyncStatus("ok");setTimeout(()=>setSyncStatus("idle"),3000);
    }catch(e){setSyncStatus("error:"+e.message);}
  }

  useEffect(()=>{
    // Load on startup
    loadFromDB();
    // Reload when user switches back to this tab/app
    const onFocus=()=>loadFromDB();
    window.addEventListener("focus",onFocus);
    document.addEventListener("visibilitychange",()=>{if(!document.hidden)loadFromDB();});
    return ()=>window.removeEventListener("focus",onFocus);
  },[]);

  useEffect(()=>{if(Object.keys(ownedMap).length) sbUpsert("pf_owned",Object.entries(ownedMap).map(([paint_id,qty])=>({paint_id,qty,user_id:uid})),"paint_id,user_id");},[ownedMap]);
  useEffect(()=>{if(Object.keys(paintPrices).length) sbUpsert("pf_prices",Object.entries(paintPrices).map(([paint_id,price])=>({paint_id,price,user_id:uid})),"paint_id,user_id");},[paintPrices]);
  useEffect(()=>{if(customPaints.length) sbUpsert("pf_custom_paints",customPaints.map(p=>({id:p.id,user_id:uid,data:p})),"id");},[customPaints]);
  useEffect(()=>{if(tools.length) sbUpsert("pf_tools",tools.map(t=>({id:t.id,user_id:uid,data:t})),"id");},[tools]);
  useEffect(()=>{if(consumables.length) sbUpsert("pf_consumables",consumables.map(c=>({id:c.id,user_id:uid,data:c})),"id");},[consumables]);
  useEffect(()=>{if(shopItems.length) sbUpsert("pf_shop_items",shopItems.map(s=>({id:s.id,user_id:uid,data:s})),"id");},[shopItems]);
  useEffect(()=>{if(projects.length) sbUpsert("pf_projects",projects.map(p=>({id:p.id,user_id:uid,data:p})),"id");},[projects]);


  function toggleOwned(id){
    setOwnedMap(m=>{
      const qty=m[id]||0;
      if(qty>0) return {...m,[id]:0};
      return {...m,[id]:1};
    });
  }
  const [confirmRemovePaint,setConfirmRemovePaint]=useState(null); // paintId
  function setQty(id,qty){
    const q=Math.max(0,Math.round(qty));
    if(q===0&&(ownedMap[id]||0)>0){
      setConfirmRemovePaint(id);
      return;
    }
    setOwnedMap(m=>({...m,[id]:q}));
  }

  // ── Project state ──

  // ── Modal visibility ──
  const [showNewProj,setShowNewProj]=useState(false);
  const [showNewMix,setShowNewMix]=useState(false);
  const [showNewPalette,setShowNewPalette]=useState(false);
  const [nPalName,setNPalName]=useState("");
  const [nPalColours,setNPalColours]=useState([]);
  const [nPalNotes,setNPalNotes]=useState("");
  const [showAddPaint,setShowAddPaint]=useState(false);
  const [addPaintPrefill,setAddPaintPrefill]=useState("");
  const [showEditProj,setShowEditProj]=useState(false);
  const [confirmAddPaint,setConfirmAddPaint]=useState(null); // {paint, barcode}
  const [confirmPaintQty,setConfirmPaintQty]=useState(1);
  const [confirmPaintPrice,setConfirmPaintPrice]=useState("");
  const [showAddCol,setShowAddCol]=useState(false);
  const [colScan,setColScan]=useState(false);
  const [colTeach,setColTeach]=useState(null);
  const [editingMix,setEditingMix]=useState(null);
  const [editingPaint,setEditingPaint]=useState(null);
  const [confirmDel,setConfirmDel]=useState(null);

  // ── New project form ──
  const [nPN,setNPN]=useState(""); const [nPD,setNPD]=useState(""); const [nPT,setNPT]=useState(""); const [nPDate,setNPDate]=useState(new Date().toISOString().slice(0,10)); const [nPCover,setNPCover]=useState(null); const [nPCoverFit,setNPCoverFit]=useState("cover"); const [nPCoverPos,setNPCoverPos]=useState("center");
  // ── Edit project form ──
  const [ePJN,setEPJN]=useState(""); const [ePJD,setEPJD]=useState(""); const [ePJT,setEPJT]=useState(""); const [ePJDate,setEPJDate]=useState(""); const [ePJCover,setEPJCover]=useState(null); const [ePJCoverFit,setEPJCoverFit]=useState("cover"); const [ePJCoverPos,setEPJCoverPos]=useState("center");
  // ── New mix form ──
  const [nMN,setNMN]=useState(""); const [nMNo,setNMNo]=useState(""); const [nMC,setNMC]=useState([]); const [nMPh,setNMPh]=useState([]); const [nMInfo,setNMInfo]=useState(""); const [nMInfoPh,setNMInfoPh]=useState([]);
  // ── Edit mix form ──
  const [eMN,setEMN]=useState(""); const [eMNo,setEMNo]=useState(""); const [eMC,setEMC]=useState([]); const [eMPh,setEMPh]=useState([]); const [eMInfo,setEMInfo]=useState(""); const [eMInfoPh,setEMInfoPh]=useState([]); const [eAssignProj,setEAssignProj]=useState("standalone");
  // ── Edit paint form ──
  const [ePtN,setEPtN]=useState(""); const [ePtBC,setEPtBC]=useState(""); const [ePtHex,setEPtHex]=useState(""); const [ePtScan,setEPtScan]=useState(false); const [ePtPrice,setEPtPrice]=useState("");
  // ── Add custom paint form ──
  const [nCtB,setNCtB]=useState("custom"); const [nCtL,setNCtL]=useState("Custom"); const [nCtN,setNCtN]=useState(""); const [nCtH,setNCtH]=useState("#888"); const [nCtC,setNCtC]=useState(""); const [nCtBC,setNCtBC]=useState(""); const [nCtSc,setNCtSc]=useState(false); const [nCtPrice,setNCtPrice]=useState("");
  // ── Library ──
  const [libOwn,setLibOwn]=useState(true); const [libQ,setLibQ]=useState("");
  const [showBackup,setShowBackup]=useState(false);
  const [importError,setImportError]=useState("");
  const [importSuccess,setImportSuccess]=useState(false);
  const [libTab,setLibTab]=useState("paints");
  const [showLibFilter,setShowLibFilter]=useState(false);
  const [filterBrands,setFilterBrands]=useState(Object.keys(BRANDS)); // brands to SHOW
  const [filterLines,setFilterLines]=useState([]); // lines to HIDE (empty = show all)
  const allLines=[...new Set(ALL_PAINTS.map(p=>p.line))];
  function toggleFilterBrand(bk){ setFilterBrands(prev=>prev.includes(bk)?prev.filter(x=>x!==bk):[...prev,bk]); }
  function toggleFilterLine(ln){ setFilterLines(prev=>prev.includes(ln)?prev.filter(x=>x!==ln):[...prev,ln]); }
  // ── Tools ──
  const [showAddTool,setShowAddTool]=useState(false);
  const [toolTopScan,setToolTopScan]=useState(false);
  const [conTopScan,setConTopScan]=useState(false);
  const [editingTool,setEditingTool]=useState(null);
  const [toolDetail,setToolDetail]=useState(null);
  const [confirmDeleteToolId,setConfirmDeleteToolId]=useState(null);
  const [selectedToolId,setSelectedToolId]=useState(null);
  const [cartToastName,setCartToastName]=useState("");
  const [cartAddedToolId,setCartAddedToolId]=useState(null);
  const [cartAddedPaintId,setCartAddedPaintId]=useState(null);
  const [toolSearch,setToolSearch]=useState("");
  const [nTName,setNTName]=useState(""); const [nTBrand,setNTBrand]=useState(""); const [nTType,setNTType]=useState("Brush"); const [nTNotes,setNTNotes]=useState(""); const [nTOwned,setNTOwned]=useState(true); const [nTBarcode,setNTBarcode]=useState(""); const [nTScan,setNTScan]=useState(false); const [nTPrice,setNTPrice]=useState("");
  const [nTImages,setNTImages]=useState([]); const [nTLocation,setNTLocation]=useState(""); const [nTPurchaseDate,setNTPurchaseDate]=useState(""); const [nTReceipt,setNTReceipt]=useState(null); const [nTPurchaseFrom,setNTPurchaseFrom]=useState("");
  const [eTName,setETName]=useState(""); const [eTBrand,setETBrand]=useState(""); const [eTType,setETType]=useState("Brush"); const [eTNotes,setETNotes]=useState(""); const [eTOwned,setETOwned]=useState(true); const [eTBarcode,setETBarcode]=useState(""); const [eTScan,setETScan]=useState(false); const [eTPrice,setETPrice]=useState("");
  const [eTImages,setETImages]=useState([]); const [eTLocation,setETLocation]=useState(""); const [eTPurchaseDate,setETPurchaseDate]=useState(""); const [eTReceipt,setETReceipt]=useState(null); const [eTPurchaseFrom,setETPurchaseFrom]=useState("");
  function addTool(){
    if(!nTName.trim()) return;
    const t={id:"t"+Date.now(),name:nTName,brand:nTBrand,type:nTType,notes:nTNotes,owned:nTOwned,barcode:nTBarcode.trim(),qty:nTOwned?1:0,
      images:nTImages,location:nTLocation,purchaseDate:nTPurchaseDate,receipt:nTReceipt,purchaseFrom:nTPurchaseFrom,price:nTPrice?parseFloat(nTPrice):null};
    setTools(prev=>[...prev,t]);
    if(nTOwned) setOwnedMap(m=>({...m,[t.id]:1}));
    setNTName("");setNTBrand("");setNTType("Brush");setNTNotes("");setNTOwned(true);setNTBarcode("");setNTScan(false);setNTPrice("");
    setNTImages([]);setNTLocation("");setNTPurchaseDate("");setNTReceipt(null);setNTPurchaseFrom("");
    setShowAddTool(false);
  }
  function openEditTool(tool){
    setEditingTool(tool);setETName(tool.name);setETBrand(tool.brand||"");setETType(tool.type);setETNotes(tool.notes||"");
    setETOwned(tool.owned);setETBarcode(tool.barcode||"");setETScan(false);setETPrice(tool.price!=null?String(tool.price):"");
    setETImages(tool.images||[]);setETLocation(tool.location||"");setETPurchaseDate(tool.purchaseDate||"");
    setETReceipt(tool.receipt||null);setETPurchaseFrom(tool.purchaseFrom||"");
  }
  function saveEditTool(){
    if(!editingTool||!eTName.trim()) return;
    setTools(tools.map(t=>t.id!==editingTool.id?t:{...t,name:eTName,brand:eTBrand,type:eTType,notes:eTNotes,owned:eTOwned,
      barcode:eTBarcode.trim(),images:eTImages,location:eTLocation,purchaseDate:eTPurchaseDate,receipt:eTReceipt,purchaseFrom:eTPurchaseFrom,price:eTPrice?parseFloat(eTPrice):null}));
    setEditingTool(null);
  }
  function deleteTool(id){ setTools(tools.filter(t=>t.id!==id)); }
  // ── Consumables ──
  const [showAddCon,setShowAddCon]=useState(false);
  const [editingCon,setEditingCon]=useState(null);
  const [conDetail,setConDetail]=useState(null);
  const [confirmDeleteConId,setConfirmDeleteConId]=useState(null);
  const [selectedConId,setSelectedConId]=useState(null);
  const [conSearch,setConSearch]=useState("");
  // new consumable fields
  const [nCnName,setNCnName]=useState(""); const [nCnBrand,setNCnBrand]=useState(""); const [nCnType,setNCnType]=useState("Sandpaper");
  const [nCnNotes,setNCnNotes]=useState(""); const [nCnBarcode,setNCnBarcode]=useState(""); const [nCnScan,setNCnScan]=useState(false);
  const [nCnQty,setNCnQty]=useState(1); const [nCnMinQty,setNCnMinQty]=useState(2); const [nCnPrice,setNCnPrice]=useState("");
  const [nCnLocation,setNCnLocation]=useState(""); const [nCnPurchaseDate,setNCnPurchaseDate]=useState("");
  const [nCnPurchaseFrom,setNCnPurchaseFrom]=useState(""); const [nCnReceipt,setNCnReceipt]=useState(null);
  // edit consumable fields
  const [eCnName,setECnName]=useState(""); const [eCnBrand,setECnBrand]=useState(""); const [eCnType,setECnType]=useState("Sandpaper");
  const [eCnNotes,setECnNotes]=useState(""); const [eCnBarcode,setECnBarcode]=useState(""); const [eCnScan,setECnScan]=useState(false);
  const [eCnQty,setECnQty]=useState(1); const [eCnMinQty,setECnMinQty]=useState(2); const [eCnPrice,setECnPrice]=useState("");
  const [eCnLocation,setECnLocation]=useState(""); const [eCnPurchaseDate,setECnPurchaseDate]=useState("");
  const [eCnPurchaseFrom,setECnPurchaseFrom]=useState(""); const [eCnReceipt,setECnReceipt]=useState(null);

  function addConsumable(){
    if(!nCnName.trim()) return;
    const c={id:"con"+Date.now(),name:nCnName,brand:nCnBrand,type:nCnType,notes:nCnNotes,
      barcode:nCnBarcode.trim(),qty:nCnQty,minQty:nCnMinQty,price:nCnPrice?parseFloat(nCnPrice):null,
      location:nCnLocation,purchaseDate:nCnPurchaseDate,purchaseFrom:nCnPurchaseFrom,receipt:nCnReceipt};
    setConsumables(prev=>[...prev,c]);
    setNCnName("");setNCnBrand("");setNCnType("Sandpaper");setNCnNotes("");setNCnBarcode("");setNCnScan(false);
    setNCnQty(1);setNCnMinQty(2);setNCnPrice("");setNCnLocation("");setNCnPurchaseDate("");setNCnPurchaseFrom("");setNCnReceipt(null);
    setShowAddCon(false);
  }
  function openEditCon(c){
    setEditingCon(c);setECnName(c.name);setECnBrand(c.brand||"");setECnType(c.type);setECnNotes(c.notes||"");
    setECnBarcode(c.barcode||"");setECnScan(false);setECnQty(c.qty||0);setECnMinQty(c.minQty||2);setECnPrice(c.price!=null?String(c.price):"");
    setECnLocation(c.location||"");setECnPurchaseDate(c.purchaseDate||"");
    setECnPurchaseFrom(c.purchaseFrom||"");setECnReceipt(c.receipt||null);
  }
  function saveEditCon(){
    if(!editingCon||!eCnName.trim()) return;
    setConsumables(consumables.map(c=>c.id!==editingCon.id?c:{...c,name:eCnName,brand:eCnBrand,type:eCnType,
      notes:eCnNotes,barcode:eCnBarcode.trim(),qty:eCnQty,minQty:eCnMinQty,price:eCnPrice?parseFloat(eCnPrice):null,
      location:eCnLocation,purchaseDate:eCnPurchaseDate,purchaseFrom:eCnPurchaseFrom,receipt:eCnReceipt}));
    setEditingCon(null);
  }
  function deleteConsumable(id){ setConsumables(consumables.filter(c=>c.id!==id)); }
  function addConsumableToShop(c){
    setConfirmAddToShop({name:c.name,brand:c.brand||"",category:"Supplies",barcode:c.barcode||"",hex:null,price:c.price||null});
    setAddShopQty(1);setAddShopNotes("");setAddShopPrice(c.price!=null?String(c.price):"");
  }
  const [showAddShop,setShowAddShop]=useState(false);
  // ── Shopping list ──

  // Persist all data to localStorage
  useEffect(()=>{try{localStorage.setItem("pf_tools",JSON.stringify(tools));}catch{}},[tools]);
  useEffect(()=>{try{localStorage.setItem("pf_consumables",JSON.stringify(consumables));}catch{}},[consumables]);
  useEffect(()=>{try{localStorage.setItem("pf_shopItems",JSON.stringify(shopItems));}catch{}},[shopItems]);
  useEffect(()=>{try{localStorage.setItem("pf_projects",JSON.stringify(projects));}catch{}},[projects]);
  const [shopScan,setShopScan]=useState(false);
  const [shopTeach,setShopTeach]=useState(null);
  const [confirmReceive,setConfirmReceive]=useState(null);
  const [receiveQty,setReceiveQty]=useState(1);
  const [showReceiveAll,setShowReceiveAll]=useState(false);
  const [receiveAllSkipped,setReceiveAllSkipped]=useState([]);
  const [confirmAddToShop,setConfirmAddToShop]=useState(null);
  const [shopToast,setShopToast]=useState(null);
  const [libraryToast,setLibraryToast]=useState(null);
  const [paintDetailCartToast,setPaintDetailCartToast]=useState(false);
  const [toolDetailCartToast,setToolDetailCartToast]=useState(false);
  const [libToast,setLibToast]=useState(null);
  const [paintDetail,setPaintDetail]=useState(null); // paint object
  const [paintDetailPhotos,setPaintDetailPhotos]=useState({}); // {paintId: [urls]}
  const [paintMixToast,setPaintMixToast]=useState(null);
  const [addShopQty,setAddShopQty]=useState(1);
  const [addShopNotes,setAddShopNotes]=useState("");
  const [addShopPrice,setAddShopPrice]=useState("");
  const [nSName,setNSName]=useState(""); const [nSBrand,setNSBrand]=useState(""); const [nSCat,setNSCat]=useState("Paint"); const [nSBarcode,setNSBarcode]=useState(""); const [nSNotes,setNSNotes]=useState(""); const [nSScan,setNSScan]=useState(false); const [nSQty,setNSQty]=useState(1);
  const [shopSearchQ,setShopSearchQ]=useState(""); const [shopSearchTab,setShopSearchTab]=useState("all"); const [shopCustomMode,setShopCustomMode]=useState(false);
  const SHOP_CATS=["Paint","Brush","Airbrush","Palette Knife","Primer","Varnish","Masking Tape","Tools","Supplies","Other"];
  function addShopItem(name,brand,category,barcode,notes,qty,price){
    const n=name||nSName; if(!n.trim()) return;
    setShopItems(prev=>[...prev,{id:"s"+Date.now(),name:n,brand:brand||nSBrand,category:category||nSCat,barcode:barcode||nSBarcode,notes:notes||nSNotes,qty:qty||nSQty,price:price||null,ordered:false,done:false}]);
    setNSName("");setNSBrand("");setNSCat("Paint");setNSBarcode("");setNSNotes("");setNSScan(false);setNSQty(1);setShowAddShop(false);
  }
  function addPaintToShop(paint){
    setConfirmAddToShop({name:paint.name,brand:BRANDS[paint.brand]?.name||"",category:"Paint",barcode:paint.barcode||"",hex:paint.hex});
    setAddShopQty(1);setAddShopNotes("");setAddShopPrice("");
    setLibToast({name:paint.name,hex:paint.hex});
    setTimeout(()=>setLibToast(null),2500);
  }
  function addToolToShop(tool){ setConfirmAddToShop({name:tool.name,brand:tool.brand||"",category:tool.type,barcode:tool.barcode||"",hex:null,price:tool.price||null}); setAddShopQty(1); setAddShopNotes(""); setAddShopPrice(tool.price!=null?String(tool.price):""); }
  function confirmAddShopItem(){
    if(!confirmAddToShop) return;
    const itemName=confirmAddToShop.name;
    setShopItems(prev=>[...prev,{id:"s"+Date.now(),...confirmAddToShop,qty:addShopQty,notes:addShopNotes,price:addShopPrice?parseFloat(addShopPrice):confirmAddToShop.price||null,ordered:false,done:false}]);
    setShopToast({name:itemName,hex:confirmAddToShop.hex});
    setTimeout(()=>setShopToast(null),2500);
    if(paintDetail){
      setPaintDetailCartToast(true);
      setTimeout(()=>setPaintDetailCartToast(false),2500);
    } else if(toolDetail){
      setToolDetailCartToast(true);
      setTimeout(()=>setToolDetailCartToast(false),2500);
    } else {
      setCartToastName(itemName);
      setCartAddedToolId("toast");
      setTimeout(()=>setCartAddedToolId(null),2500);
    }
    setConfirmAddToShop(null);
  }
  function toggleShopOrdered(id){ setShopItems(prev=>prev.map(s=>s.id===id?{...s,ordered:!s.ordered}:s)); }
  function toggleShopDone(id){ setShopItems(prev=>prev.map(s=>s.id===id?{...s,done:!s.done}:s)); }
  function removeShopItem(id){ setShopItems(prev=>prev.filter(s=>s.id!==id)); }
  function clearDoneItems(){ setShopItems(prev=>prev.filter(s=>!s.done)); }
  function openReceive(item){ setConfirmReceive(item); setReceiveQty(item.qty||1); }
  function receiveIntoLibrary(){
    if(!confirmReceive) return;
    const match=allPaints.find(p=>(confirmReceive.barcode&&p.barcode===confirmReceive.barcode)||p.name.toLowerCase()===confirmReceive.name.toLowerCase());
    if(match) setQty(match.id,(ownedMap[match.id]||0)+receiveQty);
    setShopItems(prev=>prev.map(s=>s.id===confirmReceive.id?{...s,done:true}:s));
    setLibraryToast({name:confirmReceive.name,hex:confirmReceive.hex||""});
    setTimeout(()=>setLibraryToast(null),2500);
    setConfirmReceive(null);
  }

  const [standaloneMixes,setStandaloneMixes]=useState([]);
  const [mixTab,setMixTab]=useState("mymixes");
  const [mixSavedToast,setMixSavedToast]=useState(null);
  const [mixSavedDot,setMixSavedDot]=useState(false);
  const [cpImage,setCpImage]=useState(null);
  const [cpColour,setCpColour]=useState(null);
  const [cpOwnedOnly,setCpOwnedOnly]=useState(false);
  const cpCanvasRef=useRef(null);
  const cpImgRef=useRef(null);
  const [labComponents,setLabComponents]=useState([]);
  const [labName,setLabName]=useState("");
  const [labNotes,setLabNotes]=useState("");
  const [showFAB,setShowFAB]=useState(false);
  const [projSearch,setProjSearch]=useState("");
  const [pinnedIds,setPinnedIds]=useState([]);
  const [projSort,setProjSort]=useState("date-new");
  function togglePin(id){ setPinnedIds(ids=>ids.includes(id)?ids.filter(x=>x!==id):[...ids,id]); }

  const project=projects.find(p=>p.id===selProj);

  function createProject(){
    if(!nPN.trim()) return;
    const p={id:"p"+Date.now(),name:nPN,description:nPD,
      createdAt:new Date().toISOString(),
      startedAt:nPDate||new Date().toISOString().slice(0,10),
      tags:nPT.split(",").map(t=>t.trim().toUpperCase()).filter(Boolean),
      mixes:[],paints:[],info:"",infoPhotos:[],cover:nPCover||null,coverFit:nPCoverFit,coverPos:nPCoverPos};
    setProjects(prev=>[...prev,p]); setNPN("");setNPD("");setNPT("");setNPDate(new Date().toISOString().slice(0,10));setNPCover(null); setShowNewProj(false); setSelProj(p.id);
  }
  function openEditProj(){
    if(!project) return;
    setEPJN(project.name);setEPJD(project.description);setEPJT(project.tags.join(", "));
    setEPJDate(project.startedAt||project.createdAt||new Date().toISOString().slice(0,10));
    setEPJCover(project.cover||null);
    setEPJCoverFit(project.coverFit||"cover");
    setEPJCoverPos(project.coverPos||"center");
    setShowEditProj(true);
  }
  function saveProject(){
    if(!ePJN.trim()) return;
    setProjects(projects.map(p=>p.id!==selProj?p:{...p,name:ePJN,description:ePJD,
      tags:ePJT.split(",").map(t=>t.trim().toUpperCase()).filter(Boolean),
      startedAt:ePJDate||p.startedAt||p.createdAt,
      cover:ePJCover,coverFit:ePJCoverFit,coverPos:ePJCoverPos}));
    setShowEditProj(false);
  }
  function savePalette(){
    if(!nPalName.trim()||!nPalColours.length) return;
    const pal={id:"pal"+Date.now(),name:nPalName.trim(),notes:nPalNotes.trim(),colours:nPalColours};
    setProjects(prev=>prev.map(p=>p.id===selProj?{...p,palettes:[...(p.palettes||[]),pal]}:p));
    setNPalName("");setNPalColours([]);setNPalNotes("");setShowNewPalette(false);
  }
  function addMix(){
    if(!nMN.trim()||!nMC.length) return;
    const mix={id:"m"+Date.now(),name:nMN,notes:nMNo,components:nMC,photos:nMPh,info:nMInfo,infoPhotos:nMInfoPh};
    setProjects(projects.map(p=>{
      if(p.id!==selProj) return p;
      const ids=nMC.map(c=>c.paintId);
      return {...p,mixes:[...p.mixes,mix],paints:[...new Set([...p.paints,...ids])]};
    }));
    setNMN("");setNMNo("");setNMC([]);setNMPh([]);setNMInfo("");setNMInfoPh([]); setShowNewMix(false);
  }
  function openEditMix(projId,mix){
    setEditingMix({projId,mix}); setEMN(mix.name); setEMNo(mix.notes||"");
    setEMC([...mix.components]); setEMPh([...(mix.photos||[])]);
    setEMInfo(mix.info||""); setEMInfoPh([...(mix.infoPhotos||[])]);
    setEAssignProj(projId||"standalone");
  }
  function saveEditMix(){
    if(!eMN.trim()||!eMC.length) return;
    const updatedMix={...editingMix.mix,name:eMN,notes:eMNo,components:eMC,photos:eMPh,info:eMInfo,infoPhotos:eMInfoPh};
    const oldProjId=editingMix.projId;
    const newProjId=eAssignProj==="standalone"?null:eAssignProj;

    // Remove from old location
    if(oldProjId){
      setProjects(prev=>prev.map(p=>p.id!==oldProjId?p:{...p,
        mixes:p.mixes.filter(m=>m.id!==editingMix.mix.id),
        paints:[...new Set(p.mixes.filter(m=>m.id!==editingMix.mix.id).flatMap(m=>m.components.map(c=>c.paintId)))]}));
    } else {
      setStandaloneMixes(prev=>prev.filter(m=>m.id!==editingMix.mix.id));
    }

    // Add to new location
    if(newProjId){
      setProjects(prev=>prev.map(p=>{
        if(p.id!==newProjId) return p;
        const mixes=oldProjId===newProjId
          ?p.mixes.map(m=>m.id===editingMix.mix.id?updatedMix:m)
          :[...p.mixes,updatedMix];
        return {...p,mixes,paints:[...new Set(mixes.flatMap(m=>m.components.map(c=>c.paintId)))]};
      }));
    } else {
      if(oldProjId){
        setStandaloneMixes(prev=>[...prev,updatedMix]);
      } else {
        setStandaloneMixes(prev=>prev.map(m=>m.id===editingMix.mix.id?updatedMix:m));
      }
    }
    setEditingMix(null);
  }
  function deleteMix(projId,mixId){
    if(projId){
      setProjects(projects.map(p=>p.id!==projId?p:{...p,mixes:p.mixes.filter(m=>m.id!==mixId)}));
    } else {
      setStandaloneMixes(prev=>prev.filter(m=>m.id!==mixId));
    }
  }
  function deleteProject(id){ setProjects(projects.filter(p=>p.id!==id)); setConfirmDel(null); if(selProj===id) setSelProj(null); }
  function openEditPaint(paint){
    setEPtPrice(paint.price!=null?String(paint.price):"");
    setEditingPaint(paint); setEPtN(paint.name); setEPtHex(paint.hex);
    const bc=Object.entries(barcodeMap).find(([,id])=>id===paint.id)?.[0]||paint.barcode||"";
    setEPtBC(bc); setEPtScan(false);
  }
  function saveEditPaint(){
    if(!editingPaint||!ePtN.trim()) return;
    // Save price for any paint (custom or standard) via paintPrices map
    if(ePtPrice) setPaintPrices(m=>({...m,[editingPaint.id]:parseFloat(ePtPrice)}));
    else setPaintPrices(m=>{const c={...m};delete c[editingPaint.id];return c;});
    // Also update name/hex for custom paints
    if(editingPaint.brand==="custom"){
      setCustomPaints(customPaints.map(p=>p.id!==editingPaint.id?p:{...p,name:ePtN,hex:ePtHex}));
    }
    setBarcodeMap(m=>{
      const c=Object.fromEntries(Object.entries(m).filter(([,id])=>id!==editingPaint.id));
      if(ePtBC.trim()) c[ePtBC.trim()]=editingPaint.id;
      return c;
    });
    setEditingPaint(null);
  }
  function addCustomPaint(){
    if(!nCtN.trim()) return;
    const p={id:"c"+Date.now(),brand:nCtB,line:nCtL,name:nCtN,hex:nCtH,code:nCtC,price:nCtPrice?parseFloat(nCtPrice):null};
    setCustomPaints(prev=>[...prev,p]);
    if(nCtBC.trim()) setBarcodeMap(m=>({...m,[nCtBC.trim()]:p.id}));
    setOwnedMap(m=>({...m,[p.id]:1}));
    setNCtN("");setNCtH("#888");setNCtC("");setNCtBC("");setNCtSc(false);setNCtPrice(""); setShowAddPaint(false);
  }

  const libPaints=allPaints.filter(p=>{
    const oOk=!libOwn||ownedIds.includes(p.id);
    const q=libQ.replace(/\s/g,"").toLowerCase();
    const sOk=!q||p.name.toLowerCase().includes(q)||p.id.toLowerCase().includes(q)||(p.barcode&&p.barcode.includes(q));
    const bOk=filterBrands.includes(p.brand);
    const lOk=!filterLines.includes(p.line);
    return oOk&&sOk&&bOk&&lOk;
  });

  // ── MIX CARD helper ──
  function MixCard({mix}){
    const projId=mix.projId||selProj;
    const mc=mixColors(mix.components,allPaints);
    const tot=mix.components.reduce((s,c)=>s+c.drops,0);
    const [confirmDel,setConfirmDel]=useState(false);
    const [mixCartAdded,setMixCartAdded]=useState(null);
    return (
      <>
      {confirmDel&&(
        <Sheet title="Delete Mix?" badge="!" onClose={()=>setConfirmDel(false)}
          footer={
            <div style={{display:"flex",gap:8}}>
              <GhostBtn onClick={()=>setConfirmDel(false)} color={T.dim}>CANCEL</GhostBtn>
              <Btn onClick={()=>{deleteMix(projId,mix.id);setConfirmDel(false);}} color={T.red} full>YES, DELETE</Btn>
            </div>
          }>
          <div style={{background:"rgba(232,48,48,.06)",border:`1px solid ${T.red}`,borderRadius:12,padding:16,marginBottom:4}}>
            <div style={{color:T.white,fontSize:14,fontWeight:700,marginBottom:6}}>
              Delete <span style={{color:T.red}}>{mix.name}</span>?
            </div>
            <div style={{color:T.dim,fontSize:12,lineHeight:1.5}}>
              This will permanently remove the mix and its recipe. This cannot be undone.
            </div>
          </div>
        </Sheet>
      )}
      <Card className="mix-card" style={{marginBottom:10,padding:0}}>
        <div style={{display:"flex",gap:0}}>
          <div style={{flex:1,padding:"12px 14px"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <div style={{width:42,height:42,borderRadius:10,background:mc,border:`1px solid ${T.border}`,flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontWeight:900,fontSize:14,letterSpacing:-.5}}>{mix.name}</div>
                {mix.notes&&<div style={{color:T.dim,fontSize:11,marginTop:2}}>{mix.notes}</div>}
                <div style={{color:T.orange,fontSize:11,fontWeight:700,marginTop:2}}>{tot} DROPS</div>
              </div>
              <div style={{display:"flex",gap:6}}>
                <GhostBtn onClick={()=>openEditMix(projId,mix)} small>EDIT</GhostBtn>
                <GhostBtn onClick={()=>setConfirmDel(true)} color={T.red} small>DEL</GhostBtn>
              </div>
            </div>
            <div style={{display:"flex",height:5,gap:1,marginBottom:8,borderRadius:3,overflow:"hidden"}}>
              {mix.components.map(c=>{const p=allPaints.find(x=>x.id===c.paintId); return <div key={c.paintId} style={{flex:c.drops,background:p?.hex||"#333"}}/>;} )}
            </div>
            {mix.components.map(c=>{
              const p=allPaints.find(x=>x.id===c.paintId); if(!p) return null;
              const owned=ownedMap[p.id]||0;
              return (
                <div key={c.paintId} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:`1px solid ${T.border}`}}>
                  <div style={{width:22,height:22,borderRadius:6,background:p.hex,border:`1.5px solid ${T.border}`,flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{color:T.white,fontSize:12,fontWeight:600}}>{p.name}</div>
                    <div style={{color:T.dim,fontSize:10}}>{BRANDS[p.brand]?.name||p.brand} · {p.id}</div>
                  </div>
                  <span style={{color:T.orange,fontSize:12,fontWeight:900,display:"flex",alignItems:"center",gap:2}}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="#4ab8ff"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                    {c.drops}
                  </span>
                  <span style={{color:T.dim,fontSize:10,width:30,textAlign:"right"}}>{Math.round((c.drops/tot)*100)}%</span>
                  <span title="In library" style={{
                    display:"flex",alignItems:"center",gap:3,
                    color:owned>0?"#4ab8ff":T.dimmer,
                    fontSize:10,fontWeight:900,
                    border:`1px solid ${owned>0?"#4ab8ff":T.dimmer}`,
                    borderRadius:5,padding:"1px 5px",flexShrink:0,minWidth:28,textAlign:"center"}}>
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                    {owned}
                  </span>
                  <button onClick={()=>{addPaintToShop(p);setMixCartAdded(p.id);setTimeout(()=>setMixCartAdded(null),2000);}}
                    style={{background:mixCartAdded===p.id?"rgba(68,204,136,.15)":"transparent",
                      border:`1px solid ${mixCartAdded===p.id?"#44cc88":T.border}`,
                      color:mixCartAdded===p.id?"#44cc88":T.yellow,
                      cursor:"pointer",borderRadius:6,padding:"2px 6px",
                      fontSize:11,fontWeight:900,flexShrink:0,transition:"all .2s",
                      display:"flex",alignItems:"center"}}>
                    {mixCartAdded===p.id?"✓":IC.cart}
                  </button>
                </div>
              );
            })}
            {mix.photos&&mix.photos.length>0&&(
              <div style={{display:"flex",gap:4,marginTop:10,overflowX:"auto"}}>
                {mix.photos.map((ph,i)=>(
                  <div key={ph.id} onClick={()=>setLightbox({photos:mix.photos,index:i})}
                    style={{width:72,height:72,flexShrink:0,border:`1px solid ${T.border}`,overflow:"hidden",
                      cursor:"pointer",position:"relative",
                      boxShadow:"0 4px 12px rgba(0,0,0,.6)",transition:"transform .1s"}}
                    onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"}
                    onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                    <img src={ph.src} alt={ph.name} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                    <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0)",transition:"background .15s"}}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(212,245,74,.08)"}
                      onMouseLeave={e=>e.currentTarget.style.background="rgba(0,0,0,0)"}/>
                  </div>
                ))}
              </div>
            )}
            {(mix.info||(mix.infoPhotos&&mix.infoPhotos.length>0))&&(
              <div style={{marginTop:10,borderTop:`2px solid ${T.border}`,paddingTop:10}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                  <div style={{width:3,height:10,background:T.orange}}/>
                  <span style={{color:T.orange,fontSize:10,fontWeight:900,letterSpacing:2,textTransform:"uppercase"}}>NOTES & IMAGES</span>
                </div>
                {mix.info&&<div style={{color:T.white,fontSize:13,lineHeight:1.5,background:T.surface,padding:"10px 12px",border:`1px solid ${T.border}`,marginBottom:mix.infoPhotos?.length?8:0,whiteSpace:"pre-wrap"}}>{mix.info}</div>}
                {mix.infoPhotos&&mix.infoPhotos.length>0&&(
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4}}>
                    {mix.infoPhotos.map((ph,i)=>(
                      <div key={ph.id} onClick={()=>setLightbox({photos:mix.infoPhotos,index:i})}
                        style={{aspectRatio:"1",border:`1px solid ${T.border}`,overflow:"hidden",
                          cursor:"pointer",boxShadow:"0 4px 12px rgba(0,0,0,.6)",
                          transition:"transform .1s"}}
                        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.03)"}
                        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                        <img src={ph.src} alt={ph.name} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
      </>
    );
  }

  return (
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:T.font,color:T.white,position:"relative"}}>
      <style>{`
        html, body { overflow-x: hidden; margin:0; padding:0; background:#0d0d0d; }
        * { box-sizing: border-box; }
        input, textarea { border-radius: 10px !important; }
        select { border-radius: 10px !important; }
        input, textarea, select:not(.sort-select) { font-size: 16px !important; }
        .sort-select { font-size: 11px !important; }
        input::placeholder, textarea::placeholder { color: #444; letter-spacing: 1.5px; text-transform: uppercase; font-size: 12px !important; font-family: 'DM Sans', system-ui, sans-serif; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #111; } ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        @keyframes fabPop { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes fabItemIn { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
        @media screen and (-webkit-min-device-pixel-ratio:0) { select:not(.sort-select), textarea, input { font-size: 16px !important; } }

        /* Hover states for pointer devices */
        @media (hover: hover) {
          button:hover { opacity: 0.82; transition: opacity .15s, background .15s, border-color .15s; }
          button:active { opacity: 0.65; transform: scale(0.97); }

          /* Project cards */
          .proj-card:hover { border-color: #d4f54a88 !important; box-shadow: 0 6px 28px rgba(0,0,0,.6) !important; transform: translateY(-2px); transition: all .2s; }
          .proj-card:active { transform: translateY(0); }

          /* Library paint/tool cards */
          .item-card:hover { border-color: #d4f54a55 !important; background: #1a1a1a !important; transition: all .15s; }

          /* Nav buttons */
          .nav-btn:hover { background: rgba(212,245,74,.1) !important; }

          /* Ghost buttons — go solid lime on hover */
          .ghost-btn:hover { background: rgba(212,245,74,.15) !important; border-color: #d4f54a !important; color: #d4f54a !important; }

          /* Outline buttons — go solid on hover */
          .outline-btn:hover { background: #d4f54a !important; color: #000 !important; border-color: #d4f54a !important; transition: all .15s; }
          .outline-btn-red:hover { background: #e83030 !important; color: #fff !important; border-color: #e83030 !important; transition: all .15s; }
          .outline-btn-yellow:hover { background: #ffd000 !important; color: #000 !important; border-color: #ffd000 !important; transition: all .15s; }
          .outline-btn-green:hover { background: #00cc66 !important; color: #000 !important; border-color: #00cc66 !important; transition: all .15s; }
          .outline-btn-dim:hover { background: #555 !important; color: #fff !important; border-color: #555 !important; transition: all .15s; }

          /* FAB menu items */
          .fab-item:hover { background: #222 !important; border-color: #d4f54a !important; }

          /* Mix cards */
          .mix-card:hover { border-color: #d4f54a55 !important; transition: all .15s; }
        }
      `}</style>

      {/* ── SLIM HEADER ── */}
      <div style={{background:T.bg,padding:"8px 16px",
        display:"flex",alignItems:"center",justifyContent:"space-between",
        position:"relative"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,position:"relative",zIndex:1}}>
          <div style={{fontWeight:900,fontSize:15,letterSpacing:-1,lineHeight:1}}>PAINT<span style={{color:T.orange}}>FORGE</span></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,position:"relative",zIndex:1}}>
          <div style={{color:T.orange,fontWeight:900,fontSize:11,letterSpacing:2,textTransform:"uppercase"}}>
            {view==="projects"?"PROJECTS":view==="library"?"LIBRARY":view==="mixes"?"MIXES":"SHOPPING"}
          </div>
          {/* Manual sync button */}
          <button onClick={loadFromDB} title="Sync now"
            style={{background:"none",border:`1px solid ${T.border}`,borderRadius:8,
              color:T.dim,cursor:"pointer",padding:"5px 8px",display:"flex",alignItems:"center",gap:4,
              fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{animation:syncStatus==="loading"?"spin 1s linear infinite":"none"}}>
              <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            SYNC
          </button>
          <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
          <button onClick={()=>setShowBackup(true)} title="Backup & Restore"
            style={{background:"none",border:`1px solid ${T.border}`,borderRadius:8,
              color:T.dim,cursor:"pointer",padding:"5px 8px",display:"flex",alignItems:"center",gap:4,
              fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            BACKUP
          </button>
          {/* Sync status indicator */}
          {syncStatus!=="idle"&&(
            <div onClick={()=>{
              if(syncStatus.startsWith("error:")){
                // Retry — re-trigger all saves
                if(Object.keys(barcodeMap).length) sbUpsert("pf_barcodes",Object.entries(barcodeMap).map(([barcode,paint_id])=>({barcode,paint_id,user_id:uid})),"barcode");
                if(Object.keys(ownedMap).length) sbUpsert("pf_owned",Object.entries(ownedMap).map(([paint_id,qty])=>({paint_id,qty,user_id:uid})),"paint_id,user_id");
                setSyncStatus("loading");
              }
            }}
            style={{display:"flex",alignItems:"center",gap:4,padding:"4px 8px",borderRadius:6,cursor:syncStatus.startsWith("error:")?"pointer":"default",
              background:syncStatus==="ok"?"rgba(0,204,102,.1)":syncStatus==="loading"?"rgba(212,245,74,.08)":syncStatus.startsWith("error:")?"rgba(232,48,48,.1)":"transparent",
              border:`1px solid ${syncStatus==="ok"?"rgba(0,204,102,.3)":syncStatus==="loading"?"rgba(212,245,74,.2)":syncStatus.startsWith("error:")?"rgba(232,48,48,.3)":T.border}`}}>
              {syncStatus==="loading"&&<div style={{width:6,height:6,borderRadius:"50%",background:T.orange,animation:"pulse 1s ease-in-out infinite"}}/>}
              {syncStatus==="ok"&&<div style={{width:6,height:6,borderRadius:"50%",background:"#00cc66"}}/>}
              {syncStatus.startsWith("error:")&&<div style={{width:6,height:6,borderRadius:"50%",background:T.red}}/>}
              <span style={{fontSize:9,fontWeight:700,letterSpacing:.5,textTransform:"uppercase",
                color:syncStatus==="ok"?"#00cc66":syncStatus==="loading"?T.orange:T.red}}>
                {syncStatus==="loading"?"SAVING...":syncStatus==="ok"?"SAVED":syncStatus.startsWith("error:")?"FAILED — TAP TO RETRY":""}
              </span>
              <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
            </div>
          )}

        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{padding:"14px 14px 120px",maxWidth:700,margin:"0 auto"}}>

        {/* PROJECTS LIST */}
        {view==="projects"&&!selProj&&(
          <>
            {/* PINNED ROW */}
            {pinnedIds.length>0&&(
              <div style={{marginBottom:16}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
                  <div style={{width:4,height:16,background:T.yellow}}/>
                  <span style={{color:T.yellow,fontWeight:900,fontSize:11,letterSpacing:2,textTransform:"uppercase"}}>PINNED</span>
                  <span style={{color:T.dim,fontSize:10}}>({pinnedIds.length})</span>
                </div>
                <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:4}}>
                  {pinnedIds.map(pid=>{
                    const proj=projects.find(p=>p.id===pid); if(!proj) return null;
                    const preview=proj.mixes[0]?mixColors(proj.mixes[0].components,allPaints):"#222";
                    return (
                      <div key={pid} onClick={()=>setSelProj(pid)}
                        style={{flexShrink:0,width:130,background:T.card,
                          border:`1px solid ${T.yellow}`,borderRadius:12,
                          padding:10,cursor:"pointer",position:"relative",overflow:"hidden"}}>
                        {/* colour/cover preview */}
                        <div style={{width:"100%",height:60,borderRadius:8,marginBottom:8,
                          overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,.5)",background:preview}}>
                          {proj.cover&&<img src={proj.cover} alt="cover" style={{width:"100%",height:"100%",objectFit:proj.coverFit||"cover",objectPosition:proj.coverPos||"center",display:"block"}}/>}
                        </div>
                        <div style={{fontWeight:900,fontSize:12,letterSpacing:-.3,whiteSpace:"nowrap",
                          overflow:"hidden",textOverflow:"ellipsis"}}>{proj.name}</div>
                        <div style={{color:T.dim,fontSize:10,marginTop:2}}>{proj.mixes.length} mix{proj.mixes.length!==1?"es":""}</div>
                        {/* unpin button */}
                        <button onClick={e=>{e.stopPropagation();togglePin(pid);}}
                          style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,.6)",
                            border:"none",color:T.yellow,cursor:"pointer",fontSize:12,
                            width:22,height:22,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center"}}>
                          {IC.pin}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* search + sort */}
            <div style={{position:"sticky",top:0,zIndex:30,
              background:"rgba(13,13,13,0.8)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",
              paddingTop:8,paddingBottom:8,paddingLeft:6,paddingRight:6,
              borderRadius:14,marginBottom:14}}>
              <div style={{display:"flex",gap:6,alignItems:"stretch"}}>
                <input value={projSearch} onChange={e=>setProjSearch(e.target.value)}
                  placeholder="SEARCH PROJECTS..."
                  style={{flex:1,minWidth:0,background:"#0a0a0a",border:`1px solid ${T.border}`,borderRadius:10,
                    padding:"9px 12px",color:T.white,fontWeight:700,letterSpacing:.5,
                    outline:"none",fontFamily:T.font}}/>
                <select className="sort-select" value={projSort} onChange={e=>setProjSort(e.target.value)}
                  style={{flexShrink:0,background:T.surface,border:`1px solid ${T.border}`,
                    padding:"0 6px",color:T.dim,fontWeight:700,fontSize:11,
                    outline:"none",cursor:"pointer",maxWidth:110,borderRadius:10}}>
                  <option value="name">A–Z</option>
                  <option value="date-new">NEWEST</option>
                  <option value="date-old">OLDEST</option>
                </select>
              </div>
            </div>

            {(()=>{
              const q=projSearch.toLowerCase();
              const filtered=projects.filter(p=>!q||p.name.toLowerCase().includes(q)||p.description.toLowerCase().includes(q)||p.tags.some(t=>t.toLowerCase().includes(q)));
              const sorted=[...filtered].sort((a,b)=>{
                if(projSort==="name") return a.name.localeCompare(b.name);
                if(projSort==="date-new") return new Date(b.startedAt||b.createdAt||0)-new Date(a.startedAt||a.createdAt||0) || b.id.localeCompare(a.id);
                if(projSort==="date-old") return new Date(a.startedAt||a.createdAt||0)-new Date(b.startedAt||b.createdAt||0) || a.id.localeCompare(b.id);
                // pinned first (default)
                const ap=pinnedIds.includes(a.id), bp=pinnedIds.includes(b.id);
                if(ap&&!bp) return -1; if(!ap&&bp) return 1; return 0;
              });

              if(!sorted.length) return (
                <div style={{textAlign:"center",padding:60,color:T.dim,borderTop:`2px solid ${T.border}`}}>
                  {projSearch?"No projects match your search.":"No projects yet."}
                </div>
              );

              return sorted.map(proj=>{
                const pinned=pinnedIds.includes(proj.id);
                const coverSrc=proj.cover||null;
                const hasCover=!!coverSrc;
                const rawMix=proj.mixes[0]?mixColors(proj.mixes[0].components,allPaints):null;
                // parse rgb string to use in rgba
                const mixRgba=(opacity)=>{
                  if(!rawMix) return null;
                  const m=rawMix.match(/\d+/g);
                  return m?`rgba(${m[0]},${m[1]},${m[2]},${opacity})`:null;
                };
                const topBg=hasCover?"#0a0a0a":rawMix
                  ?`radial-gradient(circle at 25% 50%, ${mixRgba(1)} 0%, ${mixRgba(0.5)} 40%, #111 75%)`
                  :`radial-gradient(circle at 25% 50%, rgba(212,245,74,0.7) 0%, rgba(180,220,40,0.3) 40%, #111 75%)`;
                return (
                  <div key={proj.id} onClick={()=>setSelProj(proj.id)}
                    className="proj-card"
                    style={{marginBottom:12,borderRadius:18,overflow:"hidden",cursor:"pointer",
                      border:`1px solid ${pinned?T.orange:T.border}`,
                      boxShadow:pinned?`0 0 20px rgba(212,245,74,0.1)`:"0 4px 20px rgba(0,0,0,.4)"}}>

                    {/* ── TOP: gradient or cover image ── */}
                    <div style={{height:80,position:"relative",overflow:"hidden",background:topBg,borderRadius:"18px 18px 0 0"}}>
                      {hasCover&&<img src={coverSrc} alt="" style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:proj.coverFit||"cover",objectPosition:proj.coverPos||"center",display:"block"}}/>}
                      {/* dark fade overlay from right for text visibility */}
                      <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,
                        background:"linear-gradient(to left, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
                        pointerEvents:"none"}}/>

                      {/* dark shape - concave curve on top-left, fills bottom-right */}
                      <svg viewBox="0 0 400 80" preserveAspectRatio="none"
                        style={{position:"absolute",bottom:0,left:0,right:0,width:"100%",height:"100%",pointerEvents:"none"}}>
                        <path d="M0 65 L400 75 L400 80 L0 80 Z"
                          fill="#141414"/>
                      </svg>

                      {/* top-right mix count */}
                      <div style={{position:"absolute",top:12,right:14,textAlign:"right",zIndex:1}}>
                        <div style={{color:"#fff",fontWeight:900,fontSize:28,lineHeight:1,textShadow:"0 2px 8px rgba(0,0,0,.6)"}}>{proj.mixes.length}</div>
                        <div style={{color:"rgba(255,255,255,.6)",fontSize:9,letterSpacing:2,textTransform:"uppercase"}}>MIXES</div>
                      </div>
                      {/* pin badge */}
                      {pinned&&(
                        <div style={{position:"absolute",top:10,left:12,zIndex:1,
                          background:T.orange,borderRadius:20,padding:"3px 10px",
                          display:"flex",alignItems:"center",gap:4}}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="#000"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/></svg>
                          <span style={{color:"#000",fontSize:9,fontWeight:900,letterSpacing:1}}>PINNED</span>
                        </div>
                      )}
                    </div>

                    {/* ── BOTTOM: dark info section ── */}
                    <div style={{background:T.card,padding:"8px 14px 10px"}}>
                      <div style={{display:"flex",alignItems:"stretch",justifyContent:"space-between",gap:8}}>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontWeight:900,fontSize:16,letterSpacing:-.3,marginBottom:2,
                            whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{proj.name}</div>
                          <div style={{color:T.dim,fontSize:12,marginBottom:6,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                            {proj.description||"Tap to explore"}
                          </div>
                          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                            {proj.tags.map(t=><Badge key={t} small color={T.yellow}>{t}</Badge>)}
                          </div>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",justifyContent:"space-between",gap:4,flexShrink:0,alignSelf:"stretch"}}>
                          {(proj.startedAt||proj.createdAt)&&(
                            <div style={{color:T.dim,fontSize:10,letterSpacing:.5}}>
                              {new Date(proj.startedAt||proj.createdAt).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"2-digit"})}
                            </div>
                          )}
                          <div style={{display:"flex",gap:6}}>
                            <button onClick={e=>{e.stopPropagation();togglePin(proj.id);}}
                              style={{background:pinned?"rgba(212,245,74,.1)":"transparent",
                                border:`1px solid ${pinned?T.orange:T.border}`,
                                color:pinned?T.orange:T.dim,cursor:"pointer",
                                padding:"7px 10px",fontWeight:700,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center"}}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill={pinned?"currentColor":"none"} stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/></svg>
                            </button>
                            <button onClick={e=>{e.stopPropagation();setSelProj(proj.id);}}
                              className="outline-btn"
                              style={{background:"rgba(212,245,74,.06)",border:`1px solid ${T.orange}`,
                                color:T.orange,cursor:"pointer",fontSize:11,padding:"7px 16px",
                                fontWeight:700,letterSpacing:1,textTransform:"uppercase",borderRadius:10,transition:"all .15s"}}>VIEW</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </>
        )}

        {/* PROJECT DETAIL */}
        {view==="projects"&&selProj&&project&&(
          <>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
              <button onClick={()=>{setSelProj(null);setProjInfoEdit(false);}} style={{background:T.border,border:"none",color:T.white,padding:"6px 12px",cursor:"pointer",fontWeight:900,fontSize:11,letterSpacing:1,textTransform:"uppercase",borderRadius:8}}>← BACK</button>
            </div>
            <Card style={{padding:0,marginBottom:16,overflow:"hidden"}} accent>
              {/* cover image or colour bar */}
              {project.cover?(
                <div style={{position:"relative",width:"100%",height:140,overflow:"hidden",borderRadius:"10px 10px 0 0"}}>
                  <img src={project.cover} alt="cover"
                    style={{width:"100%",height:"100%",objectFit:project.coverFit||"cover",objectPosition:project.coverPos||"center",display:"block"}}/>
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.7) 0%,transparent 60%)"}}/>
                  <div style={{position:"absolute",bottom:12,left:14,right:14}}>
                    <div style={{fontWeight:900,fontSize:22,letterSpacing:-1,textTransform:"uppercase",color:T.white,textShadow:"0 2px 8px rgba(0,0,0,.8)"}}>{project.name}</div>
                  </div>
                </div>
              ):null}
              <div style={{padding:"14px 16px"}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:4}}>
                  <div style={{flex:1}}>
                    {!project.cover&&<div style={{fontWeight:900,fontSize:22,letterSpacing:-1,marginBottom:4,textTransform:"uppercase"}}>{project.name}</div>}
                    {project.description&&<div style={{color:T.dim,fontSize:13,marginBottom:4}}>{project.description}</div>}
                    {(project.startedAt||project.createdAt)&&(
                      <div style={{display:"flex",alignItems:"center",gap:5,color:T.dim,fontSize:11,fontWeight:600,letterSpacing:.5,marginBottom:8}}>
                        <span style={{display:"flex",flexShrink:0}}>{IC.calendar}</span>
                        <span>{new Date(project.startedAt||project.createdAt).toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"})}</span>
                      </div>
                    )}
                    <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{project.tags.map(t=><Badge key={t} small color={T.yellow}>{t}</Badge>)}</div>
                  </div>
                  <div style={{display:"flex",gap:6,flexShrink:0,paddingTop:2}}>
                    <GhostBtn onClick={openEditProj} small>EDIT</GhostBtn>
                    <button onClick={()=>setConfirmDel(selProj)}
                      className="outline-btn-red"
                      style={{background:"rgba(232,48,48,.15)",border:`1px solid ${T.red}`,color:T.red,
                        fontWeight:700,fontSize:11,letterSpacing:1,textTransform:"uppercase",
                        padding:"4px 10px",cursor:"pointer",borderRadius:8,transition:"all .15s"}}>DEL</button>
                  </div>
                </div>
              </div>
            </Card>

            <SectionHeader right={<span style={{color:T.dim,fontSize:11}}>{project.paints.length} PAINTS</span>}>PAINTS USED</SectionHeader>
            <PaintsUsed paints={project.paints} allPaints={allPaints}/>

            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <SectionHeader right={null}>COLOUR MIXES</SectionHeader>
              <div style={{display:"flex",gap:6}}>
                <Btn onClick={()=>{
                  const allMixes=[...projects.flatMap(p=>p.mixes),...standaloneMixes];
                  const num=allMixes.length+1;
                  setNMN(`Mix ${String(num).padStart(2,"0")}`);
                  setShowNewMix(true);
                }} small>+ MIX</Btn>
                <Btn onClick={()=>{
                  const allPals=projects.flatMap(p=>p.palettes||[]);
                  const num=allPals.length+1;
                  setNPalName(`Palette ${String(num).padStart(2,"0")}`);
                  setNPalColours([]);setNPalNotes("");setShowNewPalette(true);
                }} small color={T.yellow}>+ PALETTE</Btn>
              </div>
            </div>
            {project.mixes.map(mix=><MixCard key={mix.id} mix={mix}/>)}
            {!project.mixes.length&&(
              <div style={{textAlign:"center",padding:32,border:`2px dashed ${T.border}`,borderRadius:12,color:T.dim,marginBottom:16}}>
                <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase"}}>NO MIXES YET</div>
              </div>
            )}

            {/* COLOUR PALETTES */}
            {(project.palettes||[]).length>0&&(
              <div style={{marginTop:24,marginBottom:16}}>
                <SectionHeader right={null}>COLOUR PALETTES</SectionHeader>
                {(project.palettes||[]).map(pal=>(
                  <PaletteCard key={pal.id} pal={pal} allPaints={allPaints} ownedIds={ownedIds}
                    addPaintToShop={addPaintToShop}
                    onDelete={()=>setProjects(prev=>prev.map(p=>p.id===selProj?{...p,palettes:(p.palettes||[]).filter(pl=>pl.id!==pal.id)}:p))}
                    onEdit={(updated)=>setProjects(prev=>prev.map(p=>p.id===selProj?{...p,palettes:(p.palettes||[]).map(pl=>pl.id===updated.id?updated:pl)}:p))}
                    ownedMap={ownedMap}/>
                ))}
              </div>
            )}

            {/* PROJECT NOTES & IMAGES */}
            <div style={{marginTop:20}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <SectionHeader right={null}>NOTES & IMAGES</SectionHeader>
                <GhostBtn onClick={()=>setProjInfoEdit(e=>!e)} small color={projInfoEdit?T.orange:T.dim}>{projInfoEdit?"DONE":"EDIT"}</GhostBtn>
              </div>
              {projInfoEdit&&(
                <Sheet title="Notes & Images" badge="EDIT" onClose={()=>setProjInfoEdit(false)}
                  footer={<Btn onClick={()=>{
                    const text=document.getElementById("proj-info-text")?.value||"";
                    setProjects(projects.map(p=>p.id!==selProj?p:{...p,info:text}));
                    setProjInfoEdit(false);
                  }} full>SAVE NOTES</Btn>}>
                  <textarea id="proj-info-text" defaultValue={project.info||""}
                    placeholder="ADD NOTES — APPLICATION TIPS, INSPIRATION, SURFACE PREP, STEPS..."
                    rows={6}
                    style={{width:"100%",boxSizing:"border-box",background:"#0a0a0a",border:`1px solid ${T.orange}`,
                      borderRadius:12,padding:"11px 13px",color:T.white,fontSize:13,fontFamily:T.font,outline:"none",resize:"vertical",marginBottom:14,lineHeight:1.5}}/>
                  <FieldLabel>Images</FieldLabel>
                  <PhotoPicker photos={project.infoPhotos||[]} onChange={updater=>setProjects(projects.map(p=>p.id!==selProj?p:{...p,infoPhotos:typeof updater==="function"?updater(p.infoPhotos||[]):updater}))}/>

                  {/* PDF attachments */}
                  <FieldLabel>PDF Files</FieldLabel>
                  <div style={{marginBottom:12}}>
                    {(project.infoPdfs||[]).map((pdf,i)=>(
                      <div key={pdf.id} style={{display:"flex",alignItems:"center",gap:10,
                        background:T.card,border:`1px solid ${T.border}`,borderRadius:10,
                        padding:"10px 12px",marginBottom:6}}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.orange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                          <line x1="9" y1="15" x2="15" y2="15"/>
                        </svg>
                        <span style={{color:T.white,fontSize:12,fontWeight:600,flex:1,minWidth:0,
                          overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{pdf.name}</span>
                        <span style={{color:T.dim,fontSize:10,flexShrink:0}}>{Math.round(pdf.size/1024)}KB</span>
                        <button onClick={()=>setProjects(projects.map(p=>p.id!==selProj?p:{...p,infoPdfs:(p.infoPdfs||[]).filter((_,j)=>j!==i)}))}
                          style={{background:"none",border:"none",color:T.red,cursor:"pointer",fontSize:16,padding:0,flexShrink:0}}>✕</button>
                      </div>
                    ))}
                    <label style={{display:"flex",alignItems:"center",gap:8,
                      background:"transparent",border:`1px dashed ${T.border}`,
                      borderRadius:10,padding:"10px 14px",cursor:"pointer",color:T.dim,fontSize:12,fontWeight:700,letterSpacing:.5}}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                        <line x1="12" y1="12" x2="12" y2="18"/><line x1="9" y1="15" x2="15" y2="15"/>
                      </svg>
                      ATTACH PDF
                      <input type="file" accept="application/pdf" style={{display:"none"}} multiple
                        onChange={e=>{
                          const files=Array.from(e.target.files||[]);
                          files.forEach(file=>{
                            const reader=new FileReader();
                            reader.onload=ev=>{
                              const pdf={id:"pdf"+Date.now()+Math.random(),name:file.name,size:file.size,data:ev.target.result};
                              setProjects(prev=>prev.map(p=>p.id!==selProj?p:{...p,infoPdfs:[...(p.infoPdfs||[]),pdf]}));
                            };
                            reader.readAsDataURL(file);
                          });
                          e.target.value="";
                        }}/>
                    </label>
                  </div>
                </Sheet>
              )}
              {!projInfoEdit&&(
                <div>
                  {(!project.info&&(!project.infoPhotos||!project.infoPhotos.length)&&(!project.infoPdfs||!project.infoPdfs.length))?(
                    <div style={{border:`2px dashed ${T.border}`,borderRadius:12,padding:20,textAlign:"center",color:T.dimmer,cursor:"pointer"}} onClick={()=>setProjInfoEdit(true)}>
                      <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",marginBottom:4}}>NO NOTES YET</div>
                      <div style={{fontSize:11}}>Tap EDIT to add notes, images or PDFs</div>
                    </div>
                  ):(
                    <div>
                      {project.info&&<div style={{color:T.white,fontSize:13,lineHeight:1.6,background:T.surface,padding:"12px 14px",border:`1px solid ${T.border}`,borderRadius:12,marginBottom:10,whiteSpace:"pre-wrap"}}>{project.info}</div>}
                      {project.infoPhotos&&project.infoPhotos.length>0&&(
                        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4,marginBottom:10}}>
                          {project.infoPhotos.map((ph,i)=>(
                            <div key={ph.id} onClick={()=>setLightbox({photos:project.infoPhotos,index:i})}
                              style={{aspectRatio:"1",border:`1px solid ${T.border}`,borderRadius:8,overflow:"hidden",
                                cursor:"pointer",boxShadow:"0 4px 12px rgba(0,0,0,.6)"}}>
                              <img src={ph.src} alt={ph.name} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* PDF list */}
                      {(project.infoPdfs||[]).length>0&&(
                        <div>
                          <div style={{color:T.dim,fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>ATTACHED FILES</div>
                          {(project.infoPdfs||[]).map(pdf=>(
                            <a key={pdf.id} href={pdf.data} download={pdf.name}
                              style={{display:"flex",alignItems:"center",gap:10,
                                background:T.card,border:`1px solid ${T.border}`,borderRadius:10,
                                padding:"10px 12px",marginBottom:6,textDecoration:"none"}}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.orange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                                <line x1="9" y1="15" x2="15" y2="15"/>
                              </svg>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{color:T.white,fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{pdf.name}</div>
                                <div style={{color:T.dim,fontSize:10}}>{Math.round(pdf.size/1024)}KB · Tap to download</div>
                              </div>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.dim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                              </svg>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* LIBRARY */}
        {view==="library"&&(
          <>
            {/* library shop toast */}
            {libToast&&(
              <div style={{background:"#1a1a1a",border:`1px solid ${T.orange}`,
                borderRadius:12,padding:"10px 16px",marginBottom:10,
                display:"flex",alignItems:"center",gap:10}}>
                {libToast.hex&&<div style={{width:24,height:24,borderRadius:6,background:libToast.hex,border:`1px solid ${T.border}`,flexShrink:0}}/>}
                <div style={{flex:1}}>
                  <div style={{color:T.orange,fontWeight:900,fontSize:11,letterSpacing:1,textTransform:"uppercase"}}>✓ ADDED TO SHOPPING LIST</div>
                  <div style={{color:T.white,fontSize:13,fontWeight:700,marginTop:1}}>{libToast.name}</div>
                </div>
                <span style={{color:"#44cc88",fontSize:20}}>✓</span>
              </div>
            )}
            {/* STICKY HEADER — tab switcher + controls */}
            <div style={{position:"sticky",top:0,zIndex:30,background:"rgba(13,13,13,0.8)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",paddingTop:8,paddingBottom:8,marginBottom:0,paddingLeft:6,paddingRight:6,borderRadius:"14px"}}>
              {/* PAINTS / TOOLS tab switcher */}
              <div style={{display:"flex",gap:0,border:`1px solid ${T.border}`,marginBottom:10,borderRadius:12,overflow:"hidden"}}>
                {[
                  ["paints","PAINTS",<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1 1 2.26 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/></svg>],
                  ["tools","TOOLS",<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>],
                  ["consumables","SUPPLIES",<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>],
                ].map(([tab,label,icon])=>(
                  <button key={tab} onClick={()=>setLibTab(tab)}
                    style={{flex:1,padding:"10px 0",border:"none",borderRight:tab!=="consumables"?`1px solid ${T.border}`:"none",
                      background:libTab===tab?T.orange:T.surface,
                      color:libTab===tab?"#000":T.dim,
                      fontWeight:900,fontSize:11,letterSpacing:1,cursor:"pointer",textTransform:"uppercase",
                      display:"flex",alignItems:"center",justifyContent:"center",gap:4,position:"relative"}}>
                    {icon}{label}
                    {tab==="consumables"&&consumables.filter(c=>c.qty<=c.minQty).length>0&&(
                      <span style={{position:"absolute",top:4,right:4,background:T.red,color:"#fff",
                        borderRadius:"50%",width:14,height:14,fontSize:8,fontWeight:900,
                        display:"flex",alignItems:"center",justifyContent:"center"}}>
                        {consumables.filter(c=>c.qty<=c.minQty).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Paints controls */}
              {libTab==="paints"&&(
                <>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",marginBottom:8}}>
                    <Toggle on={libOwn} onToggle={()=>setLibOwn(o=>!o)} label={libOwn?"MY PAINTS":"ALL PAINTS"}/>
                    <div style={{display:"flex",gap:6,flexShrink:0}}>
                      <GhostBtn onClick={()=>setShowAddCol(true)} color={T.yellow} small>+ ADD</GhostBtn>
                      <GhostBtn onClick={()=>setShowAddPaint(true)} small>+ CUSTOM</GhostBtn>
                      <button onClick={()=>setShowLibFilter(s=>!s)}
                        style={{background:showLibFilter||filterBrands.length<Object.keys(BRANDS).length||filterLines.length>0?"rgba(212,245,74,.08)":"transparent",
                          border:`1px solid ${showLibFilter||filterBrands.length<Object.keys(BRANDS).length||filterLines.length>0?T.orange:T.border}`,
                          color:showLibFilter||filterBrands.length<Object.keys(BRANDS).length||filterLines.length>0?T.orange:T.dim,
                          fontWeight:900,fontSize:16,letterSpacing:1,cursor:"pointer",padding:"6px 14px",textTransform:"uppercase",borderRadius:8,lineHeight:1}}>
                        ⚙{(filterBrands.length<Object.keys(BRANDS).length||filterLines.length>0)?" •":""}
                      </button>
                    </div>
                  </div>
                  <input value={libQ} onChange={e=>setLibQ(e.target.value)} placeholder="SEARCH PAINTS..."
                    style={{width:"100%",background:"#0a0a0a",border:`1px solid ${T.border}`,padding:"9px 12px",color:T.white,fontWeight:700,letterSpacing:.5,outline:"none",fontFamily:T.font,borderRadius:10}}/>
                </>
              )}

              {/* Tools controls */}
              {libTab==="tools"&&(
                <>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                    <span style={{color:T.dim,fontSize:12,letterSpacing:1,textTransform:"uppercase"}}>{tools.length} tool{tools.length!==1?"s":""}</span>
                    <Btn onClick={()=>setShowAddTool(true)} small>+ ADD TOOL</Btn>
                  </div>
                  <input value={toolSearch} onChange={e=>setToolSearch(e.target.value)} placeholder="SEARCH TOOLS..."
                    style={{width:"100%",background:"#0a0a0a",border:`1px solid ${T.border}`,padding:"9px 12px",color:T.white,fontWeight:700,letterSpacing:.5,outline:"none",fontFamily:T.font,borderRadius:10}}/>
                </>
              )}
              {/* Consumables controls */}
              {libTab==="consumables"&&(
                <>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{color:T.dim,fontSize:12,letterSpacing:1,textTransform:"uppercase"}}>{consumables.length} item{consumables.length!==1?"s":""}</span>
                      {consumables.filter(c=>c.qty<=c.minQty).length>0&&(
                        <span style={{background:"rgba(200,0,0,.15)",border:`1px solid ${T.red}`,color:T.red,
                          fontSize:10,fontWeight:900,letterSpacing:1,padding:"2px 8px",borderRadius:6,textTransform:"uppercase"}}>
                          ⚠ {consumables.filter(c=>c.qty<=c.minQty).length} LOW
                        </span>
                      )}
                    </div>
                    <Btn onClick={()=>setShowAddCon(true)} small>+ ADD ITEM</Btn>
                  </div>
                  <input value={conSearch} onChange={e=>setConSearch(e.target.value)} placeholder="SEARCH SUPPLIES..."
                    style={{width:"100%",background:"#0a0a0a",border:`1px solid ${T.border}`,padding:"9px 12px",color:T.white,fontWeight:700,letterSpacing:.5,outline:"none",fontFamily:T.font,borderRadius:10}}/>
                </>
              )}
              {/* filter panel — inside sticky header so it never gets clipped */}
              {libTab==="paints"&&showLibFilter&&(
                <div style={{background:T.surface,border:`1px solid ${T.orange}`,borderRadius:12,padding:14,marginTop:8,maxHeight:"55vh",overflowY:"auto"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                    <div style={{color:T.orange,fontSize:11,fontWeight:900,letterSpacing:2,textTransform:"uppercase"}}>▐ FILTER OPTIONS</div>
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={()=>{setFilterBrands([]);setFilterLines([...new Set(allPaints.map(p=>p.line))]);}}
                        style={{background:"none",border:"none",color:T.dim,cursor:"pointer",fontSize:11,letterSpacing:1,textTransform:"uppercase",fontWeight:700}}>
                        DESELECT ALL
                      </button>
                      <button onClick={()=>{setFilterBrands(Object.keys(BRANDS));setFilterLines([]);}}
                        style={{background:"none",border:"none",color:T.dim,cursor:"pointer",fontSize:11,letterSpacing:1,textTransform:"uppercase",fontWeight:700}}>
                        RESET ALL
                      </button>
                    </div>
                  </div>
                  <div style={{color:T.dim,fontSize:10,letterSpacing:2,textTransform:"uppercase",marginBottom:6,fontWeight:700}}>BRANDS</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
                    {Object.entries(BRANDS).map(([bk,brand])=>{
                      const active=filterBrands.includes(bk);
                      return (
                        <button key={bk} onClick={()=>toggleFilterBrand(bk)}
                          style={{padding:"5px 12px",border:`1px solid ${active?brand.color:T.border}`,
                            background:active?`${brand.color}22`:"transparent",
                            color:active?brand.color:T.dim,
                            fontWeight:900,fontSize:11,letterSpacing:1,cursor:"pointer",textTransform:"uppercase",borderRadius:8}}>
                          {active?"✓ ":""}{brand.name}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{color:T.dim,fontSize:10,letterSpacing:2,textTransform:"uppercase",marginBottom:6,fontWeight:700}}>COLOUR LINES</div>
                  {Object.entries(BRANDS).filter(([bk])=>filterBrands.includes(bk)).map(([bk,brand])=>{
                    const lines=[...new Set(allPaints.filter(p=>p.brand===bk).map(p=>p.line))];
                    if(!lines.length) return null;
                    return (
                      <div key={bk} style={{marginBottom:10}}>
                        <div style={{color:brand.color,fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:5}}>{brand.name}</div>
                        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                          {lines.map(ln=>{
                            const hidden=filterLines.includes(ln);
                            return (
                              <button key={ln} onClick={()=>toggleFilterLine(ln)}
                                style={{padding:"3px 10px",border:`1px solid ${hidden?T.border:brand.color}`,
                                  background:hidden?"transparent":`${brand.color}15`,
                                  color:hidden?T.dimmer:brand.color,
                                  fontWeight:700,fontSize:10,letterSpacing:.5,cursor:"pointer",textTransform:"uppercase",
                                  borderRadius:6,textDecoration:hidden?"line-through":"none"}}>
                                {ln}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                  <div style={{color:T.dimmer,fontSize:11,marginTop:8}}>
                    Showing <span style={{color:T.orange,fontWeight:700}}>{libPaints.length}</span> of {allPaints.length} paints
                  </div>
                </div>
              )}
            </div>

            {/* ── PAINTS TAB ── */}
            {libTab==="paints"&&(
              <>
                {libPaints.length===0&&(
                  <div style={{border:`1px dashed ${T.border}`,borderRadius:12,padding:40,textAlign:"center",color:T.dimmer,marginTop:8}}>
                    <div style={{marginBottom:8,display:"flex",justifyContent:"center",color:T.dim}}><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1 1 2.26 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/></svg></div>
                    <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",marginBottom:6}}>{libOwn?"NO PAINTS IN YOUR COLLECTION":"NO PAINTS FOUND"}</div>
                    <div style={{fontSize:11,lineHeight:1.6}}>{libOwn?"Toggle off MY PAINTS to browse all, or tap + ADD to add paints you own.":"Try a different search or filter."}</div>
                  </div>
                )}

                {Object.entries(BRANDS).map(([bk,brand])=>{
                  const lines=[...new Set(libPaints.filter(p=>p.brand===bk).map(p=>p.line))];
                  if(!lines.length) return null;
                  return (
                    <div key={bk} style={{marginBottom:22}}>
                      <div style={{background:brand.color,padding:"5px 12px",marginBottom:10,display:"inline-flex",alignItems:"center",clipPath:"polygon(0 0,100% 0,calc(100% - 10px) 100%,0 100%)"}}>
                        <span style={{color:"#000",fontWeight:900,fontSize:12,letterSpacing:1,textTransform:"uppercase"}}>{brand.name}</span>
                      </div>
                      {lines.map(ln=>(
                        <div key={ln} style={{marginBottom:10}}>
                          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                            <div style={{width:3,height:10,background:brand.color}}/>
                            <span style={{color:T.dim,fontSize:10,letterSpacing:2,textTransform:"uppercase",fontWeight:700}}>{ln}</span>
                          </div>
                          {libPaints.filter(p=>p.brand===bk&&p.line===ln).map(p=>{
                            const owned=ownedIds.includes(p.id);
                            const bc=Object.entries(barcodeMap).find(([,id])=>id===p.id)?.[0]||p.barcode||null;
                            return (
                              <div key={p.id} className="item-card" style={{display:"flex",alignItems:"center",gap:10,background:T.card,border:`1px solid ${owned?brand.color:T.border}`,padding:"8px 12px",marginBottom:3,borderRadius:10}}>
                                {/* clickable left side */}
                                <button onClick={()=>setPaintDetail(p)}
                                  style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0,background:"none",border:"none",cursor:"pointer",padding:0,textAlign:"left"}}>
                                  <div style={{width:30,height:30,borderRadius:7,background:p.hex,border:`1px solid ${T.border}`,flexShrink:0}}/>
                                  <div style={{flex:1,minWidth:0}}>
                                    <div style={{color:T.white,fontSize:12,fontWeight:700}}>{p.name} <span style={{color:T.border,fontWeight:400}}>|</span> <span style={{color:T.dim,fontSize:10,fontWeight:400}}>{BRANDS[p.brand]?.name||p.brand} · {p.id}</span></div>
                                    {bc?<div style={{color:T.dim,fontSize:10,fontFamily:"monospace",marginTop:1}}>▐ {bc}</div>:<div style={{color:T.dimmer,fontSize:10,marginTop:1}}>NO BARCODE</div>}
                                  </div>
                                </button>
                                {/* quantity stepper */}
                                <div style={{display:"flex",alignItems:"center",gap:0,border:`1px solid ${owned?brand.color:T.border}`,flexShrink:0,borderRadius:8,overflow:"hidden"}}>
                                  <button onClick={()=>setQty(p.id,(ownedMap[p.id]||0)-1)}
                                    style={{width:24,height:28,background:T.bg,border:"none",color:owned?T.white:T.dim,fontSize:14,cursor:"pointer",fontWeight:900}}>−</button>
                                  <div style={{minWidth:24,textAlign:"center",color:owned?T.orange:T.dim,fontSize:12,fontWeight:900,padding:"0 2px"}}>{ownedMap[p.id]||0}</div>
                                  <button onClick={()=>setQty(p.id,(ownedMap[p.id]||0)+1)}
                                    style={{width:24,height:28,background:T.bg,border:"none",color:owned?T.white:T.dim,fontSize:14,cursor:"pointer",fontWeight:900}}>+</button>
                                </div>
                                <button onClick={()=>{addPaintToShop(p);setCartAddedPaintId(p.id);setTimeout(()=>setCartAddedPaintId(null),2000);}} title="Add to shopping list"
                                  style={{background:cartAddedPaintId===p.id?"rgba(68,204,136,.15)":T.bg,border:`1px solid ${cartAddedPaintId===p.id?"#44cc88":T.border}`,color:cartAddedPaintId===p.id?"#44cc88":T.yellow,cursor:"pointer",fontSize:12,padding:"3px 8px",fontWeight:900,flexShrink:0,borderRadius:6,transition:"all .2s"}}>
                                  {cartAddedPaintId===p.id?"✓":IC.cart}
                                </button>
                                <button onClick={()=>setPaintDetail(p)} className="outline-btn-dim" style={{background:T.bg,border:`1px solid ${T.border}`,color:T.dim,cursor:"pointer",fontSize:10,padding:"3px 8px",fontWeight:700,letterSpacing:1,textTransform:"uppercase",flexShrink:0,borderRadius:6,transition:"all .15s"}}>EDIT</button>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </>
            )}

            {/* ── TOOLS TAB ── */}
            {libTab==="tools"&&(
              <>
                {tools.length===0&&(
                  <div style={{border:`2px dashed ${T.border}`,borderRadius:12,padding:40,textAlign:"center",color:T.dimmer,cursor:"pointer"}} onClick={()=>setShowAddTool(true)}>
                    <div style={{marginBottom:8,display:"flex",justifyContent:"center",color:T.dim}}><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1 1 2.26 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/></svg></div>
                    <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",marginBottom:4}}>NO TOOLS YET</div>
                    <div style={{fontSize:11}}>Add brushes, primers, masking tape and more</div>
                  </div>
                )}
                {[...new Set(tools.map(t=>t.type))].map(type=>{
                  const filtered=tools.filter(t=>t.type===type&&(!toolSearch||t.name.toLowerCase().includes(toolSearch.toLowerCase())||t.brand?.toLowerCase().includes(toolSearch.toLowerCase())||(t.barcode&&t.barcode.includes(toolSearch))));
                  if(!filtered.length) return null;
                  return (
                    <div key={type} style={{marginBottom:20}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                        <div style={{width:4,height:18,background:T.orange}}/>
                        <span style={{color:T.white,fontWeight:900,fontSize:12,letterSpacing:2,textTransform:"uppercase"}}>{type}</span>
                        <span style={{color:T.dim,fontSize:10}}>({filtered.length})</span>
                      </div>
                      {filtered.map(tool=>(
                        <div key={tool.id}
                          className="item-card"
                          onClick={()=>setSelectedToolId(id=>id===tool.id?null:tool.id)}
                          style={{background:T.card,
                          border:`1px solid ${selectedToolId===tool.id?T.orange:tool.owned?T.orange:T.border}`,padding:"10px 12px",marginBottom:4,borderRadius:10,cursor:"pointer"}}>
                          {/* top row */}
                          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:tool.images?.length?10:0}}>
                            <button onClick={e=>{e.stopPropagation();setToolDetail(tool);}}
                              style={{width:36,height:36,background:tool.owned?"rgba(212,245,74,.08)":T.surface,
                                border:`1px solid ${tool.owned?T.orange:T.border}`,flexShrink:0,borderRadius:8,
                                display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,cursor:"pointer",padding:0}}>
                              {tool.type==="Brush"||tool.type==="Airbrush"?IC.brush:tool.type==="Primer"||tool.type==="Varnish"?IC.primer:tool.type==="Masking Tape"?IC.masking:IC.tool}
                            </button>
                            <button onClick={e=>{e.stopPropagation();setToolDetail(tool);}}
                              style={{flex:1,minWidth:0,background:"none",border:"none",cursor:"pointer",textAlign:"left",padding:0}}>
                              <div style={{color:T.white,fontSize:13,fontWeight:700}}>{tool.name}</div>
                              {tool.brand&&<div style={{color:T.dim,fontSize:11}}>{tool.brand}</div>}
                              {tool.barcode
                                ?<div style={{color:T.orange,fontSize:10,fontFamily:"monospace",marginTop:1}}>▐ {tool.barcode}</div>
                                :<div style={{color:T.dimmer,fontSize:10,marginTop:1}}>NO BARCODE</div>
                              }
                              {tool.notes&&<div style={{color:T.dimmer,fontSize:11,marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{tool.notes}</div>}
                            </button>
                            <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"stretch",minWidth:100}}>
                              {/* stepper */}
                              <div onClick={e=>e.stopPropagation()} style={{display:"flex",alignItems:"center",border:`1px solid ${tool.owned?T.orange:T.border}`,borderRadius:10,overflow:"hidden"}}>
                                <button onClick={()=>{ const q=Math.max(0,(ownedMap[tool.id]||0)-1); setOwnedMap(m=>({...m,[tool.id]:q})); setTools(tools.map(x=>x.id===tool.id?{...x,owned:q>0}:x)); }}
                                  style={{flex:1,height:32,background:T.bg,border:"none",color:tool.owned?T.white:T.dim,fontSize:16,cursor:"pointer",fontWeight:900}}>−</button>
                                <div style={{minWidth:32,textAlign:"center",color:tool.owned?T.orange:T.dim,fontSize:13,fontWeight:900}}>{ownedMap[tool.id]||0}</div>
                                <button onClick={()=>{ const q=(ownedMap[tool.id]||0)+1; setOwnedMap(m=>({...m,[tool.id]:q})); setTools(tools.map(x=>x.id===tool.id?{...x,owned:true}:x)); }}
                                  style={{flex:1,height:32,background:T.bg,border:"none",color:tool.owned?T.white:T.dim,fontSize:16,cursor:"pointer",fontWeight:900}}>+</button>
                              </div>
                              {/* cart + edit row */}
                              <div style={{display:"flex",gap:6}}>
                                <button onClick={e=>{e.stopPropagation();addToolToShop(tool);}} title="Add to shopping list"
                                  style={{flex:1,background:T.bg,border:`1px solid ${T.border}`,color:T.yellow,cursor:"pointer",padding:"6px 0",fontWeight:900,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,gap:4,transition:"all .2s"}}>
                                  {IC.cart}
                                </button>
                                <button onClick={e=>{e.stopPropagation();setToolDetail(tool);}}
                                  className="outline-btn-dim"
                                  style={{flex:1,background:T.bg,border:`1px solid ${T.border}`,color:T.dim,cursor:"pointer",fontSize:10,padding:"6px 0",fontWeight:700,letterSpacing:1,textTransform:"uppercase",borderRadius:8,transition:"all .15s"}}>EDIT</button>
                                {selectedToolId===tool.id&&(
                                  <button onClick={e=>{e.stopPropagation();setConfirmDeleteToolId(tool.id);}}
                                    className="outline-btn-red"
                                    style={{background:"none",border:`1px solid ${T.red}`,color:T.red,cursor:"pointer",fontSize:12,padding:"6px 8px",borderRadius:8,transition:"all .15s"}}>✕</button>
                                )}
                              </div>
                            </div>
                          </div>
                          {/* image strip */}
                          {tool.images&&tool.images.length>0&&(
                            <div style={{display:"flex",gap:4,overflowX:"auto",marginBottom:8}}>
                              {tool.images.map((img,i)=>(
                                <div key={img.id} onClick={()=>setLightbox({photos:tool.images,index:i})}
                                  style={{width:60,height:60,flexShrink:0,borderRadius:8,overflow:"hidden",
                                    border:`1px solid ${T.border}`,cursor:"pointer",
                                    boxShadow:"0 4px 12px rgba(0,0,0,.6)"}}>
                                  <img src={img.src} alt={img.name} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                                </div>
                              ))}
                            </div>
                          )}
                          {/* purchase info row */}
                          {(tool.location||tool.purchaseDate||tool.purchaseFrom)&&(
                            <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:6,paddingTop:6,borderTop:`1px solid ${T.border}`}}>
                              {tool.location&&<div style={{display:"flex",alignItems:"center",gap:4}}><span style={{display:"flex",color:T.dim}}>{IC.location}</span><span style={{color:T.dim,fontSize:11}}>{tool.location}</span></div>}
                              {tool.purchaseFrom&&<div style={{display:"flex",alignItems:"center",gap:4}}><span style={{display:"flex",color:T.dim}}>{IC.store}</span><span style={{color:T.dim,fontSize:11}}>{tool.purchaseFrom}</span></div>}
                              {tool.purchaseDate&&<div style={{display:"flex",alignItems:"center",gap:4}}><span style={{display:"flex",color:T.dim}}>{IC.calendar}</span><span style={{color:T.dim,fontSize:11}}>{new Date(tool.purchaseDate).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}</span></div>}
                              {tool.receipt&&<button onClick={()=>setLightbox({photos:[{id:"r",src:tool.receipt,name:"Receipt"}],index:0})}
                                style={{display:"flex",alignItems:"center",gap:4,background:"none",border:"none",cursor:"pointer",padding:0}}>
                                <span style={{display:"flex",color:T.orange}}>{IC.receipt}</span><span style={{color:T.orange,fontSize:11,fontWeight:700}}>RECEIPT</span>
                              </button>}
                            </div>
                          )}
                          {/* inline delete confirm */}
                          {confirmDeleteToolId===tool.id&&(
                            <div style={{marginTop:10,background:"rgba(200,0,0,.08)",border:`1px solid ${T.red}`,
                              borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                              <span style={{color:T.white,fontSize:12,fontWeight:700,flex:1}}>
                                Delete <span style={{color:T.red}}>{tool.name}</span>? Cannot be undone.
                              </span>
                              <div style={{display:"flex",gap:6}}>
                                <button onClick={()=>{deleteTool(tool.id);setConfirmDeleteToolId(null);}}
                                  style={{background:T.red,border:"none",borderRadius:7,color:"#fff",
                                    fontWeight:900,fontSize:11,letterSpacing:.5,padding:"5px 12px",cursor:"pointer",textTransform:"uppercase"}}>
                                  YES, DELETE
                                </button>
                                <button onClick={()=>setConfirmDeleteToolId(null)}
                                  style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:7,
                                    color:T.dim,fontWeight:700,fontSize:11,padding:"5px 12px",cursor:"pointer",textTransform:"uppercase"}}>
                                  CANCEL
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </>
            )}

            {/* ── CONSUMABLES TAB ── */}
            {libTab==="consumables"&&(
              <>
                {consumables.length===0&&(
                  <div style={{border:`2px dashed ${T.border}`,borderRadius:12,padding:40,textAlign:"center",color:T.dimmer,cursor:"pointer"}} onClick={()=>setShowAddCon(true)}>
                    <div style={{marginBottom:8,display:"flex",justifyContent:"center",color:T.dim}}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                    </div>
                    <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",marginBottom:4}}>NO SUPPLIES YET</div>
                    <div style={{fontSize:11}}>Track sandpaper, blades, paper, glue and other consumables</div>
                  </div>
                )}
                {[...new Set(consumables.map(c=>c.type))].map(type=>{
                  const filtered=consumables.filter(c=>c.type===type&&(!conSearch||c.name.toLowerCase().includes(conSearch.toLowerCase())||(c.brand||"").toLowerCase().includes(conSearch.toLowerCase())));
                  if(!filtered.length) return null;
                  return (
                    <div key={type} style={{marginBottom:20}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                        <div style={{width:4,height:18,background:T.orange}}/>
                        <span style={{color:T.white,fontWeight:900,fontSize:12,letterSpacing:2,textTransform:"uppercase"}}>{type}</span>
                        <span style={{color:T.dim,fontSize:10}}>({filtered.length})</span>
                      </div>
                      {filtered.map(con=>{
                        const isLow=con.qty<=con.minQty;
                        return (
                          <div key={con.id}
                            className="item-card"
                            onClick={()=>setSelectedConId(id=>id===con.id?null:con.id)}
                            style={{background:T.card,
                              border:`1px solid ${selectedConId===con.id?T.orange:isLow?T.red:T.border}`,
                              padding:"10px 12px",marginBottom:4,borderRadius:10,cursor:"pointer"}}>
                            {/* top row */}
                            <div style={{display:"flex",alignItems:"center",gap:10}}>
                              <div style={{width:36,height:36,background:isLow?"rgba(200,0,0,.12)":"rgba(212,245,74,.06)",
                                border:`1px solid ${isLow?T.red:T.border}`,flexShrink:0,borderRadius:8,
                                display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isLow?T.red:T.dim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                              </div>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{display:"flex",alignItems:"center",gap:6}}>
                                  <div style={{color:T.white,fontSize:13,fontWeight:700}}>{con.name}</div>
                                  {isLow&&<span style={{background:"rgba(200,0,0,.15)",border:`1px solid ${T.red}`,color:T.red,fontSize:9,fontWeight:900,letterSpacing:1,padding:"1px 6px",borderRadius:4,textTransform:"uppercase",flexShrink:0}}>LOW</span>}
                                </div>
                                {con.brand&&<div style={{color:T.dim,fontSize:11}}>{con.brand}</div>}
                                {con.barcode
                                  ?<div style={{color:T.orange,fontSize:10,fontFamily:"monospace",marginTop:1}}>▐ {con.barcode}</div>
                                  :<div style={{color:T.dimmer,fontSize:10,marginTop:1}}>NO BARCODE</div>
                                }
                                {con.notes&&<div style={{color:T.dimmer,fontSize:11,marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{con.notes}</div>}
                              </div>
                              <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"stretch",minWidth:100}}>
                                {/* qty stepper */}
                                <div onClick={e=>e.stopPropagation()} style={{display:"flex",alignItems:"center",border:`1px solid ${isLow?T.red:T.border}`,borderRadius:10,overflow:"hidden"}}>
                                  <button onClick={()=>setConsumables(consumables.map(c=>c.id===con.id?{...c,qty:Math.max(0,c.qty-1)}:c))}
                                    style={{flex:1,height:32,background:T.bg,border:"none",color:T.white,fontSize:16,cursor:"pointer",fontWeight:900}}>−</button>
                                  <div style={{minWidth:32,textAlign:"center",color:isLow?T.red:T.orange,fontSize:13,fontWeight:900}}>{con.qty}</div>
                                  <button onClick={()=>setConsumables(consumables.map(c=>c.id===con.id?{...c,qty:c.qty+1}:c))}
                                    style={{flex:1,height:32,background:T.bg,border:"none",color:T.white,fontSize:16,cursor:"pointer",fontWeight:900}}>+</button>
                                </div>
                                {/* cart + edit */}
                                <div style={{display:"flex",gap:6}}>
                                  <button onClick={e=>{e.stopPropagation();addConsumableToShop(con);}} title="Add to shopping list"
                                    style={{flex:1,background:T.bg,border:`1px solid ${T.border}`,color:T.yellow,cursor:"pointer",padding:"6px 0",fontWeight:900,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>
                                    {IC.cart}
                                  </button>
                                  <button onClick={e=>{e.stopPropagation();openEditCon(con);}}
                                    className="outline-btn-dim"
                                    style={{flex:1,background:T.bg,border:`1px solid ${T.border}`,color:T.dim,cursor:"pointer",fontSize:10,padding:"6px 0",fontWeight:700,letterSpacing:1,textTransform:"uppercase",borderRadius:8}}>EDIT</button>
                                  {selectedConId===con.id&&(
                                    <button onClick={e=>{e.stopPropagation();setConfirmDeleteConId(con.id);}}
                                      className="outline-btn-red"
                                      style={{background:"none",border:`1px solid ${T.red}`,color:T.red,cursor:"pointer",fontSize:12,padding:"6px 8px",borderRadius:8}}>✕</button>
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* purchase info */}
                            {(con.location||con.purchaseDate||con.purchaseFrom)&&(
                              <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:6,paddingTop:6,borderTop:`1px solid ${T.border}`}}>
                                {con.location&&<div style={{display:"flex",alignItems:"center",gap:4}}><span style={{display:"flex",color:T.dim}}>{IC.location}</span><span style={{color:T.dim,fontSize:11}}>{con.location}</span></div>}
                                {con.purchaseFrom&&<div style={{display:"flex",alignItems:"center",gap:4}}><span style={{display:"flex",color:T.dim}}>{IC.store}</span><span style={{color:T.dim,fontSize:11}}>{con.purchaseFrom}</span></div>}
                                {con.purchaseDate&&<div style={{display:"flex",alignItems:"center",gap:4}}><span style={{display:"flex",color:T.dim}}>{IC.calendar}</span><span style={{color:T.dim,fontSize:11}}>{new Date(con.purchaseDate).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}</span></div>}
                                {con.receipt&&<button onClick={()=>setLightbox({photos:[{id:"r",src:con.receipt,name:"Receipt"}],index:0})}
                                  style={{display:"flex",alignItems:"center",gap:4,background:"none",border:"none",cursor:"pointer",padding:0}}>
                                  <span style={{display:"flex",color:T.orange}}>{IC.receipt}</span><span style={{color:T.orange,fontSize:11,fontWeight:700}}>RECEIPT</span>
                                </button>}
                              </div>
                            )}
                            {/* min qty indicator */}
                            <div style={{marginTop:6,display:"flex",alignItems:"center",gap:6}}>
                              <span style={{color:T.dimmer,fontSize:10,letterSpacing:1,textTransform:"uppercase"}}>Reorder below:</span>
                              <span style={{color:isLow?T.red:T.dim,fontSize:10,fontWeight:700}}>{con.minQty}</span>
                            </div>
                            {/* delete confirm */}
                            {confirmDeleteConId===con.id&&(
                              <div style={{marginTop:10,background:"rgba(200,0,0,.08)",border:`1px solid ${T.red}`,
                                borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                                <span style={{color:T.white,fontSize:12,fontWeight:700,flex:1}}>
                                  Delete <span style={{color:T.red}}>{con.name}</span>? Cannot be undone.
                                </span>
                                <div style={{display:"flex",gap:6}}>
                                  <button onClick={()=>{deleteConsumable(con.id);setConfirmDeleteConId(null);}}
                                    style={{background:T.red,border:"none",borderRadius:7,color:"#fff",fontWeight:900,fontSize:11,letterSpacing:.5,padding:"5px 12px",cursor:"pointer",textTransform:"uppercase"}}>
                                    YES, DELETE
                                  </button>
                                  <button onClick={()=>setConfirmDeleteConId(null)}
                                    style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:7,color:T.dim,fontWeight:700,fontSize:11,padding:"5px 12px",cursor:"pointer",textTransform:"uppercase"}}>
                                    CANCEL
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}

        {view==="shopping"&&(
          <>
            {/* inline shop toast */}
            {shopToast&&(
              <div style={{background:"#1a1a1a",border:`1px solid ${T.orange}`,
                borderRadius:12,padding:"10px 16px",marginBottom:12,
                display:"flex",alignItems:"center",gap:10}}>
                {shopToast.hex&&<div style={{width:24,height:24,borderRadius:6,background:shopToast.hex,border:`1px solid ${T.border}`,flexShrink:0}}/>}
                <div style={{flex:1}}>
                  <div style={{color:T.orange,fontWeight:900,fontSize:11,letterSpacing:1,textTransform:"uppercase"}}>✓ ADDED TO SHOPPING LIST</div>
                  <div style={{color:T.white,fontSize:13,fontWeight:700,marginTop:1}}>{shopToast.name}</div>
                </div>
                <span style={{color:"#44cc88",fontSize:20}}>✓</span>
              </div>
            )}
            {/* inline library toast */}
            {libraryToast&&(
              <div style={{background:"#1a1a1a",border:`1px solid #44cc88`,
                borderRadius:12,padding:"10px 16px",marginBottom:12,
                display:"flex",alignItems:"center",gap:10}}>
                {libraryToast.hex&&<div style={{width:24,height:24,borderRadius:6,background:libraryToast.hex,border:`1px solid ${T.border}`,flexShrink:0}}/>}
                <div style={{flex:1}}>
                  <div style={{color:"#44cc88",fontWeight:900,fontSize:11,letterSpacing:1,textTransform:"uppercase"}}>✓ ADDED TO LIBRARY</div>
                  <div style={{color:T.white,fontSize:13,fontWeight:700,marginTop:1}}>{libraryToast.name}</div>
                </div>
                <span style={{color:"#44cc88",fontSize:20}}>✓</span>
              </div>
            )}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
              <SectionHeader right={null}>{shopItems.filter(s=>!s.done).length} TO BUY · {shopItems.filter(s=>s.ordered&&!s.done).length} ORDERED · {shopItems.filter(s=>s.done).length} DONE</SectionHeader>
              <div style={{display:"flex",gap:6}}>
                {shopItems.some(s=>s.done)&&<GhostBtn onClick={clearDoneItems} color={T.red} small>CLEAR DONE</GhostBtn>}
                {shopItems.some(s=>!s.done)&&(
                  <GhostBtn small color={T.green} onClick={()=>setShowReceiveAll(true)}>+ ADD ALL TO INVENTORY</GhostBtn>
                )}
                <Btn onClick={()=>setShowAddShop(true)} small>+ ADD ITEM</Btn>
              </div>
            </div>

            {/* scan to add */}
            <div style={{marginBottom:14}}>
              <GhostBtn onClick={()=>setShopScan(s=>!s)} color={shopScan?T.orange:T.dim}>
                {shopScan?"CLOSE SCANNER":"SCAN BARCODE TO ADD"}
              </GhostBtn>
              {shopScan&&(
                <div style={{marginTop:10}}>
                  <BarcodeScanner
                    allPaints={allPaints}
                    onFound={p=>{
                      setConfirmAddToShop({name:p.name,brand:BRANDS[p.brand]?.name||p.brand,category:"Paint",barcode:p.barcode||"",hex:p.hex,price:p.price||null});
                      setAddShopQty(1);setAddShopNotes("");setAddShopPrice(p.price!=null?String(p.price):"");
                      setShopScan(false);
                    }}
                    onTeach={code=>{
                      // Check tools and consumables too
                      const t=tools.find(x=>x.barcode===code);
                      const c=consumables.find(x=>x.barcode===code);
                      if(t){setConfirmAddToShop({name:t.name,brand:t.brand||"",category:t.type,barcode:code,hex:null,price:t.price||null});setAddShopQty(1);setAddShopNotes("");setAddShopPrice(t.price!=null?String(t.price):"");setShopScan(false);}
                      else if(c){setConfirmAddToShop({name:c.name,brand:c.brand||"",category:"Supplies",barcode:code,hex:null,price:c.price||null});setAddShopQty(1);setAddShopNotes("");setAddShopPrice(c.price!=null?String(c.price):"");setShopScan(false);}
                      else{setShopTeach(code);setShopScan(false);}
                    }}
                    onAddNew={({name,brand,category,barcode})=>{addShopItem(name,brand,category,barcode,"",1);setShopScan(false);}}
                    onClose={()=>setShopScan(false)}
                    addNewMode="shop"/>
                </div>
              )}
              {shopTeach&&(
                <div style={{border:`1px solid ${T.yellow}`,background:"rgba(255,208,0,.05)",padding:12,marginTop:10}}>
                  <Badge color={T.yellow}>UNKNOWN BARCODE — ADD TO LIST?</Badge>
                  <div style={{color:T.dim,fontSize:10,fontFamily:"monospace",margin:"8px 0"}}>{shopTeach}</div>
                  <PaintSearch allPaints={allPaints} onSelect={p=>{
                    setConfirmAddToShop({name:p.name,brand:BRANDS[p.brand]?.name||p.brand,category:"Paint",barcode:shopTeach,hex:p.hex,price:p.price||null});
                    setAddShopQty(1);setAddShopNotes("");setAddShopPrice(p.price!=null?String(p.price):"");
                    setShopTeach(null);
                  }} brandFilter="all"/>
                  <div style={{display:"flex",gap:8,marginTop:8}}>
                    <GhostBtn onClick={()=>{addShopItem("Unknown Item","","Other",shopTeach,"");setShopTeach(null);}} color={T.orange} small>ADD AS UNKNOWN</GhostBtn>
                    <GhostBtn onClick={()=>setShopTeach(null)} color={T.dim} small>CANCEL</GhostBtn>
                  </div>
                </div>
              )}
            </div>

            {shopItems.length===0&&(
              <div style={{border:`2px dashed ${T.border}`,borderRadius:12,padding:40,textAlign:"center",color:T.dimmer,cursor:"pointer"}} onClick={()=>setShowAddShop(true)}>
                <div style={{fontSize:28,marginBottom:8,display:"flex",justifyContent:"center"}}>{IC.cart}</div>
                <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",marginBottom:4}}>SHOPPING LIST EMPTY</div>
                <div style={{fontSize:11}}>Add paints or tools you need to buy</div>
              </div>
            )}

            {/* group by category */}
            {[...new Set(shopItems.map(s=>s.category))].map(cat=>{
              const items=shopItems.filter(s=>s.category===cat);
              const catTotal=items.filter(s=>!s.done&&s.price).reduce((sum,s)=>sum+(s.price*(s.qty||1)),0);
              return (
                <div key={cat} style={{marginBottom:20}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                    <div style={{width:4,height:18,background:T.orange}}/>
                    <span style={{color:T.white,fontWeight:900,fontSize:12,letterSpacing:2,textTransform:"uppercase"}}>{cat}</span>
                    <span style={{color:T.dim,fontSize:10}}>({items.filter(s=>!s.done).length} left)</span>
                    {catTotal>0&&<span style={{marginLeft:"auto",color:T.orange,fontSize:11,fontWeight:900}}>${catTotal.toFixed(2)}</span>}
                  </div>
                  {items.map(item=>(
                    <div key={item.id} style={{display:"flex",alignItems:"center",gap:8,
                      background:item.done?"rgba(0,0,0,.3)":item.ordered?"rgba(255,208,0,.05)":T.card,
                      border:`1px solid ${item.done?T.dimmer:item.ordered?T.yellow:T.border}`,
                      padding:"10px 12px",marginBottom:4,borderRadius:10,
                      opacity:item.done?.6:1,transition:"all .15s"}}>
                      {/* ORDERED checkbox */}
                      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,flexShrink:0}}>
                        <button onClick={()=>toggleShopOrdered(item.id)} title="Mark as ordered"
                          style={{width:22,height:22,border:`1px solid ${item.ordered?T.yellow:T.border}`,borderRadius:6,
                            background:item.ordered?"rgba(255,208,0,.2)":"transparent",flexShrink:0,cursor:"pointer",
                            display:"flex",alignItems:"center",justifyContent:"center",color:T.yellow,fontSize:12,fontWeight:900}}>
                          {item.ordered?"✓":""}
                        </button>
                        <div style={{color:T.dimmer,fontSize:8,letterSpacing:.5,textTransform:"uppercase"}}>{item.ordered?"ORD":""}</div>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                          <div style={{color:item.done?T.dim:T.white,fontSize:13,fontWeight:700,
                            textDecoration:item.done?"line-through":"none"}}>{item.name}</div>
                          {item.ordered&&!item.done&&<Badge small color={T.yellow}>ORDERED</Badge>}
                        </div>
                        {item.brand&&<div style={{color:T.dim,fontSize:11}}>{item.brand}</div>}
                        {item.barcode&&<div style={{color:T.orange,fontSize:10,fontFamily:"monospace",marginTop:1}}>▐ {item.barcode}</div>}
                        {item.notes&&<div style={{color:T.dimmer,fontSize:11,marginTop:2}}>{item.notes}</div>}
                        {/* Price display */}
                        {item.price&&!item.done&&(
                          <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}>
                            <span style={{color:T.dim,fontSize:11}}>${item.price.toFixed(2)} each</span>
                            {(item.qty||1)>1&&<span style={{color:T.orange,fontSize:11,fontWeight:900}}>= ${(item.price*(item.qty||1)).toFixed(2)}</span>}
                          </div>
                        )}
                      </div>
                      {/* quantity stepper — hide when done */}
                      {!item.done&&(
                        <div style={{display:"flex",alignItems:"center",gap:0,border:`1px solid ${T.border}`,flexShrink:0}}>
                          <button onClick={()=>setShopItems(shopItems.map(s=>s.id===item.id?{...s,qty:Math.max(1,s.qty-1)}:s))}
                            style={{width:24,height:28,background:T.bg,border:"none",color:T.dim,fontSize:14,cursor:"pointer",fontWeight:900}}>−</button>
                          <div style={{minWidth:24,textAlign:"center",color:T.orange,fontSize:12,fontWeight:900,padding:"0 2px"}}>{item.qty||1}</div>
                          <button onClick={()=>setShopItems(shopItems.map(s=>s.id===item.id?{...s,qty:(s.qty||1)+1}:s))}
                            style={{width:24,height:28,background:T.bg,border:"none",color:T.dim,fontSize:14,cursor:"pointer",fontWeight:900}}>+</button>
                        </div>
                      )}
                      {/* Add to Inventory button */}
                      {!item.done&&(
                        <button onClick={()=>openReceive(item)} title="Add to library inventory"
                          style={{background:"rgba(0,204,102,.1)",border:`1px solid ${T.green}`,
                            borderRadius:8,color:T.green,cursor:"pointer",fontSize:10,padding:"3px 8px",
                            fontWeight:900,letterSpacing:.5,textTransform:"uppercase",flexShrink:0}}>
                          + ADD
                        </button>
                      )}
                      {/* Done / remove */}
                      <button onClick={()=>toggleShopDone(item.id)} title={item.done?"Unmark":"Mark bought"}
                        style={{width:22,height:22,border:`1px solid ${item.done?T.green:T.border}`,borderRadius:6,
                          background:item.done?T.green:"transparent",flexShrink:0,cursor:"pointer",
                          display:"flex",alignItems:"center",justifyContent:"center",color:"#000",fontSize:12,fontWeight:900}}>
                        {item.done?"✓":""}
                      </button>
                      <button onClick={()=>removeShopItem(item.id)}
                        style={{background:"none",border:"none",color:T.red,cursor:"pointer",fontSize:16,padding:0,flexShrink:0}}>✕</button>
                    </div>
                  ))}
                </div>
              );
            })}
            {/* Grand total */}
            {(()=>{
              const pendingItems=shopItems.filter(s=>!s.done&&s.price);
              if(!pendingItems.length) return null;
              const grand=pendingItems.reduce((sum,s)=>sum+(s.price*(s.qty||1)),0);
              return (
                <div style={{borderTop:`2px solid ${T.border}`,marginTop:8,paddingTop:14,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div>
                    <div style={{color:T.dim,fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase"}}>ESTIMATED TOTAL</div>
                    <div style={{color:T.dimmer,fontSize:9,marginTop:2}}>{pendingItems.length} priced item{pendingItems.length!==1?"s":""} · excl. items without price</div>
                  </div>
                  <div style={{color:T.orange,fontSize:22,fontWeight:900}}>${grand.toFixed(2)}</div>
                </div>
              );
            })()}
          </>
        )}

        {/* ALL MIXES */}
        {view==="mixes"&&(
          <>
            {/* tab switcher */}
            <div style={{position:"sticky",top:0,zIndex:30,background:"rgba(13,13,13,0.8)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",paddingTop:8,paddingBottom:8,paddingLeft:6,paddingRight:6,borderRadius:"14px"}}>
              <div style={{display:"flex",gap:0,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
                {[
                  ["mymixes","MY MIXES",<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,true],
                  ["colourlab","MIX LAB",<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11c0 4 3.6 7 8 7s8-3 8-7"/><path d="M4 11h16"/><rect x="8" y="18" width="8" height="2" rx="1"/><line x1="14" y1="4" x2="10" y2="11"/><line x1="16" y1="3" x2="12.5" y2="9.5"/></svg>,false],
                ].map(([tab,label,icon,showDot])=>(
                  <button key={tab} onClick={()=>setMixTab(tab)}
                    style={{flex:1,padding:"10px 0",border:"none",
                      borderRight:tab==="mymixes"?`1px solid ${T.border}`:"none",
                      background:mixTab===tab?T.orange:T.surface,
                      color:mixTab===tab?"#000":T.dim,
                      fontWeight:900,fontSize:12,letterSpacing:1,cursor:"pointer",textTransform:"uppercase",
                      display:"flex",alignItems:"center",justifyContent:"center",gap:6,position:"relative"}}>
                    {icon}{label}
                    {showDot&&mixSavedDot&&(
                      <div style={{width:8,height:8,borderRadius:"50%",background:"#44cc88",
                        position:"absolute",top:6,right:8,boxShadow:"0 0 6px #44cc88"}}/>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* MY MIXES tab */}
            {mixTab==="mymixes"&&(
              <>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                  <span style={{color:T.dim,fontSize:11,letterSpacing:1,textTransform:"uppercase"}}>
                    {projects.flatMap(p=>p.mixes).length + standaloneMixes.length} TOTAL MIXES
                  </span>
                </div>
                {standaloneMixes.length>0&&(
                  <>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                      <div style={{width:4,height:14,background:T.orange}}/>
                      <span style={{color:T.orange,fontWeight:900,fontSize:11,letterSpacing:2,textTransform:"uppercase"}}>FROM MIX LAB</span>
                    </div>
                    {standaloneMixes.map(mix=><MixCard key={mix.id} mix={mix}/>)}
                    <div style={{height:1,background:T.border,margin:"12px 0"}}/>
                  </>
                )}
                {projects.flatMap(proj=>proj.mixes.map(m=>({...m,projName:proj.name,projId:proj.id}))).map(mix=>(
                  <div key={mix.id}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                      <button onClick={()=>{setSelProj(mix.projId);setView("projects");}}
                        style={{background:"none",border:"none",color:T.orange,cursor:"pointer",
                          fontSize:11,padding:0,fontWeight:700,letterSpacing:1,textTransform:"uppercase",
                          display:"flex",alignItems:"center",gap:4}}>
                        ↗ {mix.projName}
                      </button>
                    </div>
                    <MixCard mix={mix}/>
                  </div>
                ))}
                {!projects.flatMap(p=>p.mixes).length&&!standaloneMixes.length&&(
                  <div style={{textAlign:"center",padding:60,color:T.dim,border:`2px dashed ${T.border}`,borderRadius:12}}>
                    <div style={{marginBottom:12,display:"flex",justifyContent:"center",color:T.dim}}><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6"/><path d="M10 3v7l-4 8h12l-4-8V3"/></svg></div>
                    <div style={{fontSize:11,letterSpacing:3,textTransform:"uppercase",marginBottom:8}}>NO MIXES YET</div>
                    <div style={{color:T.dimmer,fontSize:12}}>Create a project and add colour mixes to it</div>
                  </div>
                )}
              </>
            )}

            {/* MIX LAB tab */}
            {mixTab==="colourlab"&&(
              <MixLab allPaints={allPaints} ownedIds={ownedIds} projects={projects}
                setProjects={setProjects} selProj={selProj} setSelProj={setSelProj}
                standaloneMixes={standaloneMixes} setStandaloneMixes={setStandaloneMixes}
                labComponents={labComponents} setLabComponents={setLabComponents}
                labName={labName} setLabName={setLabName}
                labNotes={labNotes} setLabNotes={setLabNotes}
                cpImage={cpImage} setCpImage={setCpImage}
                cpColour={cpColour} setCpColour={setCpColour}
                cpOwnedOnly={cpOwnedOnly} setCpOwnedOnly={setCpOwnedOnly}
                cpCanvasRef={cpCanvasRef} cpImgRef={cpImgRef}
                ownedMap={ownedMap}
                onSaved={(name)=>{
                  setMixSavedToast(name);
                  setMixSavedDot(true);
                  setTimeout(()=>setMixSavedToast(null),3000);
                  setTimeout(()=>setMixSavedDot(false),3000);
                }}/>
            )}
          </>
        )}
      </div>

      {/* ── FADE + BLUR OVERLAY above tab bar ── */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,height:160,zIndex:39,pointerEvents:"none"}}>
        {/* blur layer */}
        <div style={{position:"absolute",inset:0,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",
          WebkitMaskImage:"linear-gradient(to top, black 0%, black 40%, transparent 100%)",
          maskImage:"linear-gradient(to top, black 0%, black 40%, transparent 100%)"}}/>
        {/* dark fade */}
        <div style={{position:"absolute",inset:0,
          background:"linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.9) 30%, rgba(10,10,10,0.4) 60%, rgba(10,10,10,0) 100%)"}}/>
      </div>

      {/* ── FAB MENU OVERLAY ── */}
      {showFAB&&(
        <div onClick={()=>setShowFAB(false)}
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",zIndex:49}}/>
      )}
      {showFAB&&(
        <div style={{position:"fixed",bottom:90,left:"50%",transform:"translateX(-50%)",
          display:"flex",flexDirection:"column",gap:8,alignItems:"center",zIndex:50}}>
          {[
            {label:"NEW PROJECT",icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>,action:()=>{setShowNewProj(true);setShowFAB(false);}},
            {label:"ADD PAINT",icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1 1 2.26 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/></svg>,action:()=>{setView("library");setShowAddCol(true);setShowFAB(false);}},
            {label:"ADD TOOL",icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,action:()=>{setView("library");setLibTab("tools");setShowAddTool(true);setShowFAB(false);}},
            {label:"ADD SUPPLY",icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,action:()=>{setView("library");setLibTab("consumables");setShowAddCon(true);setShowFAB(false);}},
            {label:"ADD TO SHOP",icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,action:()=>{setView("shopping");setShowAddShop(true);setShowFAB(false);}},
          ].map((item,i)=>(
            <button key={i} onClick={item.action}
              className="fab-item"
              style={{display:"flex",alignItems:"center",gap:12,background:T.surface,
                border:`1px solid ${T.orange}`,padding:"11px 22px",cursor:"pointer",borderRadius:12,
                animation:`fabItemIn .18s ease ${i*0.06}s both`,
                minWidth:210,boxShadow:"0 4px 24px rgba(0,0,0,.7)"}}>
              <span style={{color:T.orange,display:"flex",flexShrink:0}}>{item.icon}</span>
              <span style={{color:T.white,fontWeight:900,fontSize:12,letterSpacing:1.5,textTransform:"uppercase"}}>{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── BOTTOM TAB BAR ── */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:40,
        display:"flex",justifyContent:"center",padding:"0 0 12px"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,
          background:"#1a1a1a",borderRadius:32,padding:"8px 12px",
          boxShadow:"0 -2px 24px rgba(0,0,0,.6)",border:`1px solid ${T.border}`,
          maxWidth:380,width:"calc(100% - 32px)"}}>

          {[
            {v:"projects",label:"PROJECTS",svg:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>},
            {v:"library",label:"LIBRARY",svg:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>},
          ].map(({v,label,svg})=>(
            <button key={v} onClick={()=>{setView(v);setSelProj(null);setProjInfoEdit(false);setShowFAB(false);}}
              style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,
                background:view===v?"rgba(212,245,74,.15)":"transparent",
                border:`1px solid ${view===v?"rgba(212,245,74,.3)":"transparent"}`,
                cursor:"pointer",padding:"10px 4px",borderRadius:16,
                transition:"all .15s"}}>
              <div style={{color:view===v?T.lime:"#666",transition:"color .15s"}}>{svg}</div>
              <span style={{color:view===v?T.lime:"#666",fontSize:8,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>{label}</span>
            </button>
          ))}

          {/* FAB centre */}
          <button onClick={()=>setShowFAB(f=>!f)}
            style={{width:52,height:52,borderRadius:"50%",flexShrink:0,
              background:showFAB?"#444":T.lime,
              border:"none",
              boxShadow:`0 0 18px ${T.lime}66`,
              display:"flex",alignItems:"center",justifyContent:"center",
              cursor:"pointer",color:"#000",
              transform:showFAB?"rotate(45deg)":"rotate(0deg)",
              transition:"all .22s",zIndex:2}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>

          {[
            {v:"mixes",label:"MIXES",svg:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11c0 4 3.6 7 8 7s8-3 8-7"/><path d="M4 11h16"/><rect x="8" y="18" width="8" height="2" rx="1"/><line x1="14" y1="4" x2="10" y2="11"/><line x1="16" y1="3" x2="12.5" y2="9.5"/></svg>},
            {v:"shopping",label:"SHOP",svg:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>},
          ].map(({v,label,svg})=>(
            <button key={v} onClick={()=>{setView(v);setSelProj(null);setProjInfoEdit(false);setShowFAB(false);}}
              style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,
                background:view===v?"rgba(212,245,74,.15)":"transparent",
                border:`1px solid ${view===v?"rgba(212,245,74,.3)":"transparent"}`,
                cursor:"pointer",padding:"10px 4px",borderRadius:16,
                transition:"all .15s",position:"relative"}}>
              <div style={{color:view===v?T.lime:"#666",transition:"color .15s",position:"relative"}}>
                {svg}
                {v==="mixes"&&labComponents.length>0&&(
                  <div style={{position:"absolute",top:-2,right:-2,width:7,height:7,
                    borderRadius:"50%",background:T.orange,border:"1.5px solid #1a1a1a"}}/>
                )}
                {v==="shopping"&&shopItems.length>0&&(()=>{
                  const allDone=shopItems.every(s=>s.done);
                  const hasPending=shopItems.some(s=>!s.done);
                  if(!hasPending&&!allDone) return null;
                  return (
                    <div style={{position:"absolute",top:-2,right:-2,width:7,height:7,
                      borderRadius:"50%",
                      background:allDone?"#44cc88":T.yellow,
                      border:"1.5px solid #1a1a1a",
                      boxShadow:allDone?"0 0 4px #44cc88":`0 0 4px ${T.yellow}`}}/>
                  );
                })()}
              </div>
              <span style={{color:view===v?T.lime:"#666",fontSize:8,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MODALS */}
      {showNewProj&&(
        <Sheet title="New Project" badge="NEW" onClose={()=>setShowNewProj(false)}
          footer={<Btn onClick={createProject} disabled={!nPN.trim()} full>CREATE PROJECT</Btn>}>
          <FieldLabel>Cover Image</FieldLabel>
          <div style={{marginBottom:12}}>
            {nPCover?(
              <div style={{marginBottom:8}}>
                <div style={{position:"relative",width:"100%",height:120,overflow:"hidden",
                  border:`1px solid ${T.orange}`,borderRadius:12}}>
                  <img src={nPCover} alt="cover" style={{width:"100%",height:"100%",objectFit:nPCoverFit,objectPosition:nPCoverPos,display:"block"}}/>
                  <button onClick={()=>setNPCover(null)}
                    style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,.8)",
                      border:`1px solid ${T.red}`,color:T.red,cursor:"pointer",borderRadius:6,
                      fontSize:12,width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900}}>✕</button>
                </div>
                {/* fit toggle */}
                <div style={{display:"flex",gap:6,marginTop:6}}>
                  {["cover","contain"].map(f=>(
                    <button key={f} onClick={()=>setNPCoverFit(f)}
                      style={{flex:1,padding:"5px 0",borderRadius:8,border:`1px solid ${nPCoverFit===f?T.orange:T.border}`,
                        background:nPCoverFit===f?"rgba(212,245,74,.08)":"transparent",
                        color:nPCoverFit===f?T.orange:T.dim,fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",cursor:"pointer"}}>
                      {f==="cover"?"FILL":"FIT"}
                    </button>
                  ))}
                </div>
                {/* position grid */}
                <div style={{marginTop:6}}>
                  <div style={{color:T.dim,fontSize:10,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>FOCUS POINT</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4}}>
                    {[
                      ["top left","↖"],["top center","↑"],["top right","↗"],
                      ["center left","←"],["center","·"],["center right","→"],
                      ["bottom left","↙"],["bottom center","↓"],["bottom right","↘"]
                    ].map(([pos,arrow])=>(
                      <button key={pos} onClick={()=>setNPCoverPos(pos)}
                        style={{padding:"6px 0",borderRadius:6,border:`1px solid ${nPCoverPos===pos?T.orange:T.border}`,
                          background:nPCoverPos===pos?"rgba(212,245,74,.08)":"transparent",
                          color:nPCoverPos===pos?T.orange:T.dim,fontSize:14,fontWeight:700,cursor:"pointer"}}>
                        {arrow}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ):(
              <div style={{width:"100%",height:70,border:`2px dashed ${T.border}`,borderRadius:12,
                display:"flex",alignItems:"center",justifyContent:"center",
                color:T.dimmer,fontSize:11,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>
                NO COVER IMAGE
              </div>
            )}
            <div style={{display:"flex",gap:6}}>
              {(()=>{
                function handleCover(e){
                  const file=e.target.files[0]; if(!file) return;
                  const reader=new FileReader();
                  reader.onload=ev=>setNPCover(ev.target.result);
                  reader.readAsDataURL(file);
                  e.target.value="";
                }
                return (
                  <>
                    <label style={{flex:1,background:T.bg,border:`1px solid ${T.orange}`,
                      color:T.orange,fontWeight:900,fontSize:11,letterSpacing:1,textTransform:"uppercase",
                      padding:"8px 0",cursor:"pointer",textAlign:"center",display:"block",borderRadius:10}}>
                      TAKE PHOTO
                      <input type="file" accept="image/*" capture="environment" onChange={handleCover} style={{display:"none"}}/>
                    </label>
                    <label style={{flex:1,background:T.bg,border:`1px solid ${T.border}`,
                      color:T.dim,fontWeight:900,fontSize:11,letterSpacing:1,textTransform:"uppercase",
                      padding:"8px 0",cursor:"pointer",textAlign:"center",display:"block",borderRadius:10}}>
                      FROM LIBRARY
                      <input type="file" accept="image/*" onChange={handleCover} style={{display:"none"}}/>
                    </label>
                  </>
                );
              })()}
            </div>
          </div>
          <FieldLabel>Project Name</FieldLabel><Field value={nPN} onChange={setNPN} placeholder="E.G. STRIKE FREEDOM"/>
          <FieldLabel>Description</FieldLabel><Field value={nPD} onChange={setNPD} placeholder="SHORT DESCRIPTION"/>
          <FieldLabel>Tags (comma separated)</FieldLabel><Field value={nPT} onChange={setNPT} placeholder="E.G. NMM, GUNPLA"/>
          <FieldLabel>Start Date</FieldLabel>
          <input type="date" value={nPDate} onChange={e=>setNPDate(e.target.value)}
            style={{width:"100%",maxWidth:"100%",boxSizing:"border-box",background:"#0a0a0a",border:`1px solid ${T.border}`,
              padding:"6px 10px",color:T.white,fontSize:12,fontFamily:T.font,outline:"none",marginBottom:10,
              colorScheme:"dark",display:"block"}}/>
        </Sheet>
      )}

      {showNewMix&&(
        <Sheet title="New Colour Mix" badge="MIX" onClose={()=>{setShowNewMix(false);setNMN("");setNMC([]);}}
          footer={<Btn onClick={addMix} disabled={!nMN.trim()||!nMC.length} full>SAVE MIX</Btn>}>
          <FieldLabel>Mix Name</FieldLabel>
          <Field value={nMN} onChange={setNMN} placeholder="E.G. SHADOW BASE"/>
          <FieldLabel>Notes</FieldLabel>
          <Field value={nMNo} onChange={setNMNo} placeholder="E.G. THIN 1:1, FIRST LAYER"/>
          <MixBuilder allPaints={allPaints} ownedIds={ownedIds} components={nMC} setComponents={setNMC} onTeachBarcode={teachBarcode}
            onAddNewPaint={({name,brand,line,code,hex,barcode:bc})=>{
              const p={id:"c"+Date.now(),brand,line,name,hex,code};
              setCustomPaints(prev=>[...prev,p]);
              if(bc) setBarcodeMap(m=>({...m,[bc]:p.id}));
              setOwnedMap(m=>({...m,[p.id]:1}));
              return p;
            }}/>
          <div style={{marginTop:12}}><FieldLabel>Result Photos</FieldLabel><PhotoPicker photos={nMPh} onChange={setNMPh}/></div>
          <div style={{marginTop:12,borderTop:`2px solid ${T.border}`,paddingTop:12}}>
            <FieldLabel>Additional Notes & Images</FieldLabel>
            <textarea value={nMInfo} onChange={e=>setNMInfo(e.target.value)} placeholder="APPLICATION TIPS, SURFACE PREP, LAYERING ORDER..." rows={4}
              style={{width:"100%",boxSizing:"border-box",background:"#0a0a0a",border:`1px solid ${T.border}`,borderRadius:10,padding:"11px 13px",color:T.white,fontSize:13,fontFamily:T.font,outline:"none",resize:"vertical",marginBottom:10,lineHeight:1.5}}/>
            <PhotoPicker photos={nMInfoPh} onChange={setNMInfoPh}/>
          </div>
        </Sheet>
      )}

      {/* ── NEW COLOUR PALETTE SHEET ── */}
      {showNewPalette&&(
        <Sheet title="New Colour Palette" badge="PALETTE" onClose={()=>setShowNewPalette(false)}
          footer={<Btn onClick={savePalette} disabled={!nPalName.trim()||!nPalColours.length} full>SAVE PALETTE</Btn>}>
          <FieldLabel>Palette Name</FieldLabel>
          <Field value={nPalName} onChange={setNPalName} placeholder="E.G. SKIN TONES, ARMOUR COLOURS"/>
          <FieldLabel>Notes</FieldLabel>
          <Field value={nPalNotes} onChange={setNPalNotes} placeholder="E.G. USED ON ARMOUR PANELS"/>

          {/* selected colours */}
          {nPalColours.length>0&&(
            <div style={{marginBottom:12}}>
              <FieldLabel>Selected Colours ({nPalColours.length})</FieldLabel>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
                {nPalColours.map(pid=>{
                  const p=allPaints.find(x=>x.id===pid);
                  return p?(
                    <div key={pid} style={{position:"relative"}}>
                      <div style={{width:36,height:36,borderRadius:8,background:p.hex,
                        border:`1px solid ${T.orange}`}} title={p.name}/>
                      <button onClick={()=>setNPalColours(prev=>prev.filter(x=>x!==pid))}
                        style={{position:"absolute",top:-4,right:-4,width:14,height:14,borderRadius:"50%",
                          background:T.red,border:"none",color:"#fff",fontSize:8,cursor:"pointer",
                          display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900}}>✕</button>
                    </div>
                  ):null;
                })}
              </div>
              {/* paint name list */}
              {nPalColours.map(pid=>{
                const p=allPaints.find(x=>x.id===pid);
                return p?(
                  <div key={pid} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",
                    borderBottom:`1px solid ${T.border}`}}>
                    <div style={{width:20,height:20,borderRadius:4,background:p.hex,border:`1px solid ${T.border}`,flexShrink:0}}/>
                    <span style={{color:T.white,fontSize:12,fontWeight:600,flex:1}}>{p.name}</span>
                    <span style={{color:T.dim,fontSize:10}}>{BRANDS[p.brand]?.name||p.brand}</span>
                    <button onClick={()=>setNPalColours(prev=>prev.filter(x=>x!==pid))}
                      style={{background:"none",border:"none",color:T.red,cursor:"pointer",fontSize:14,padding:0}}>✕</button>
                  </div>
                ):null;
              })}
            </div>
          )}

          {/* paint picker */}
          <PaletteBuilder allPaints={allPaints} ownedIds={ownedIds}
            selected={nPalColours} setSelected={setNPalColours}
            addPaintToShop={addPaintToShop}/>
          {nPalColours.length>0&&(
            <div style={{marginTop:12}}>
              <MixSuggestions
                labComponents={nPalColours.map(id=>({paintId:id,drops:1}))}
                allPaints={allPaints} ownedIds={ownedIds}
                onAdd={p=>setNPalColours(prev=>prev.includes(p.id)?prev:[...prev,p.id])}/>
            </div>
          )}
        </Sheet>
      )}

      {editingMix&&(
        <Sheet title="Edit Mix" badge="EDIT" onClose={()=>setEditingMix(null)}
          footer={<Btn onClick={saveEditMix} disabled={!eMN.trim()||!eMC.length} full>SAVE CHANGES</Btn>}>
          <FieldLabel>Mix Name</FieldLabel><Field value={eMN} onChange={setEMN} placeholder="MIX NAME"/>
          <FieldLabel>Notes</FieldLabel><Field value={eMNo} onChange={setEMNo} placeholder="NOTES"/>

          {/* project assignment */}
          <FieldLabel>Assign to Project</FieldLabel>
          <ProjectPicker projects={projects} value={eAssignProj} onChange={setEAssignProj}/>

          <FieldLabel>Recipe</FieldLabel>
          <MixBuilder allPaints={allPaints} ownedIds={ownedIds} components={eMC} setComponents={setEMC} onTeachBarcode={teachBarcode}
            onAddNewPaint={({name,brand,line,code,hex,barcode:bc})=>{
              const p={id:"c"+Date.now(),brand,line,name,hex,code};
              setCustomPaints(prev=>[...prev,p]);
              if(bc) setBarcodeMap(m=>({...m,[bc]:p.id}));
              setOwnedMap(m=>({...m,[p.id]:1}));
              return p;
            }}/>
          <div style={{marginTop:12}}><FieldLabel>Result Photos</FieldLabel><PhotoPicker photos={eMPh} onChange={setEMPh}/></div>
          <div style={{marginTop:12,borderTop:`2px solid ${T.border}`,paddingTop:12}}>
            <FieldLabel>Additional Notes & Images</FieldLabel>
            <textarea value={eMInfo} onChange={e=>setEMInfo(e.target.value)} placeholder="APPLICATION TIPS, SURFACE PREP, LAYERING ORDER..." rows={4}
              style={{width:"100%",boxSizing:"border-box",background:"#0a0a0a",border:`1px solid ${T.border}`,borderRadius:10,padding:"11px 13px",color:T.white,fontSize:13,fontFamily:T.font,outline:"none",resize:"vertical",marginBottom:10,lineHeight:1.5}}/>
            <PhotoPicker photos={eMInfoPh} onChange={setEMInfoPh}/>
          </div>
        </Sheet>
      )}

      {showEditProj&&(
        <Sheet title="Edit Project" badge="EDIT" onClose={()=>setShowEditProj(false)}
          footer={<Btn onClick={saveProject} full>SAVE CHANGES</Btn>}>
          <FieldLabel>Cover Image</FieldLabel>
          <div style={{marginBottom:12}}>
            {ePJCover?(
              <div style={{marginBottom:8}}>
                <div style={{position:"relative",width:"100%",height:120,overflow:"hidden",
                  border:`1px solid ${T.orange}`,borderRadius:12}}>
                  <img src={ePJCover} alt="cover" style={{width:"100%",height:"100%",objectFit:ePJCoverFit,objectPosition:ePJCoverPos,display:"block"}}/>
                  <button onClick={()=>setEPJCover(null)}
                    style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,.8)",
                      border:`1px solid ${T.red}`,color:T.red,cursor:"pointer",borderRadius:6,
                      fontSize:12,width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900}}>✕</button>
                </div>
                {/* fit toggle */}
                <div style={{display:"flex",gap:6,marginTop:6}}>
                  {["cover","contain"].map(f=>(
                    <button key={f} onClick={()=>setEPJCoverFit(f)}
                      style={{flex:1,padding:"5px 0",borderRadius:8,border:`1px solid ${ePJCoverFit===f?T.orange:T.border}`,
                        background:ePJCoverFit===f?"rgba(212,245,74,.08)":"transparent",
                        color:ePJCoverFit===f?T.orange:T.dim,fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",cursor:"pointer"}}>
                      {f==="cover"?"FILL":"FIT"}
                    </button>
                  ))}
                </div>
                {/* position grid */}
                <div style={{marginTop:6}}>
                  <div style={{color:T.dim,fontSize:10,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>FOCUS POINT</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4}}>
                    {[
                      ["top left","↖"],["top center","↑"],["top right","↗"],
                      ["center left","←"],["center","·"],["center right","→"],
                      ["bottom left","↙"],["bottom center","↓"],["bottom right","↘"]
                    ].map(([pos,arrow])=>(
                      <button key={pos} onClick={()=>setEPJCoverPos(pos)}
                        style={{padding:"6px 0",borderRadius:6,border:`1px solid ${ePJCoverPos===pos?T.orange:T.border}`,
                          background:ePJCoverPos===pos?"rgba(212,245,74,.08)":"transparent",
                          color:ePJCoverPos===pos?T.orange:T.dim,fontSize:14,fontWeight:700,cursor:"pointer"}}>
                        {arrow}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ):(
              <div style={{width:"100%",height:80,border:`2px dashed ${T.border}`,borderRadius:12,
                display:"flex",alignItems:"center",justifyContent:"center",
                color:T.dimmer,fontSize:11,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>
                NO COVER IMAGE
              </div>
            )}
            <div style={{display:"flex",gap:6}}>
              {(()=>{
                function handleCover(e){
                  const file=e.target.files[0]; if(!file) return;
                  const reader=new FileReader();
                  reader.onload=ev=>setEPJCover(ev.target.result);
                  reader.readAsDataURL(file);
                  e.target.value="";
                }
                return (
                  <>
                    <label style={{flex:1,background:T.bg,border:`1px solid ${T.orange}`,
                      color:T.orange,fontWeight:900,fontSize:11,letterSpacing:1,textTransform:"uppercase",
                      padding:"8px 0",cursor:"pointer",textAlign:"center",display:"block",borderRadius:10}}>
                      TAKE PHOTO
                      <input type="file" accept="image/*" capture="environment" onChange={handleCover} style={{display:"none"}}/>
                    </label>
                    <label style={{flex:1,background:T.bg,border:`1px solid ${T.border}`,
                      color:T.dim,fontWeight:900,fontSize:11,letterSpacing:1,textTransform:"uppercase",
                      padding:"8px 0",cursor:"pointer",textAlign:"center",display:"block",borderRadius:10}}>
                      FROM LIBRARY
                      <input type="file" accept="image/*" onChange={handleCover} style={{display:"none"}}/>
                    </label>
                  </>
                );
              })()}
            </div>
          </div>
          <FieldLabel>Project Name</FieldLabel><Field value={ePJN} onChange={setEPJN} placeholder="PROJECT NAME"/>
          <FieldLabel>Description</FieldLabel><Field value={ePJD} onChange={setEPJD} placeholder="DESCRIPTION"/>
          <FieldLabel>Tags</FieldLabel><Field value={ePJT} onChange={setEPJT} placeholder="E.G. NMM, KALEIDO"/>
          <FieldLabel>Start Date</FieldLabel>
          <input type="date" value={ePJDate} onChange={e=>setEPJDate(e.target.value)}
            style={{width:"100%",maxWidth:"100%",boxSizing:"border-box",background:"#0a0a0a",border:`1px solid ${T.border}`,
              padding:"6px 10px",color:T.white,fontSize:12,fontFamily:T.font,outline:"none",marginBottom:10,
              colorScheme:"dark",display:"block"}}/>
        </Sheet>
      )}

      {showAddCol&&(
        <Sheet title="Add to Collection" badge="COLLECT" onClose={()=>{setShowAddCol(false);setColScan(false);setColTeach(null);}}>
          <FieldLabel>TYPE BARCODE OR SEARCH BY NAME</FieldLabel>
          <ManualBarcodeEntry allPaints={allPaints} tools={tools} consumables={consumables}
            onFound={p=>{
            setConfirmAddPaint({paint:p,barcode:null});
            setConfirmPaintQty(1);
            setConfirmPaintPrice(paintPrices[p.id]!=null?String(paintPrices[p.id]):"");
            setShowAddCol(false);
          }} onTeach={(code,paintId)=>{
            if(code&&paintId){
              teachBarcode(paintId,code);
              const found=allPaints.find(x=>x.id===paintId);
              if(found){
                setConfirmAddPaint({paint:found,barcode:code});
                setConfirmPaintQty(1);
                setConfirmPaintPrice(paintPrices[found.id]!=null?String(paintPrices[found.id]):"");
                setShowAddCol(false);
              } else {
                setOwnedMap(m=>({...m,[paintId]:(m[paintId]||0)+1}));
                setShowAddCol(false);
              }
            }
            else if(code) setColTeach(code);
          }}
            onFoundTool={(t,saveBarcode)=>{
              if(saveBarcode&&t.barcode){
                setTools(prev=>prev.map(x=>x.id===t.id?{...x,barcode:t.barcode}:x));
              }
              setShowAddCol(false);setLibTab("tools");setView("library");setToolDetail(t);
            }}
            onFoundCon={(c,saveBarcode)=>{
              if(saveBarcode&&c.barcode){
                setConsumables(prev=>prev.map(x=>x.id===c.id?{...x,barcode:c.barcode}:x));
              }
              setShowAddCol(false);setLibTab("consumables");setView("library");setSelectedConId(c.id);
            }}
            onAddCustom={name=>{setShowAddCol(false);setAddPaintPrefill(name);setShowAddPaint(true);}}
            onAddNew={({name,brand,line,code,hex,barcode:bc})=>{
              const p={id:"c"+Date.now(),brand,line,name,hex,code};
              setCustomPaints(prev=>[...prev,p]);
              if(bc) setBarcodeMap(m=>({...m,[bc]:p.id}));
              setOwnedMap(m=>({...m,[p.id]:1}));
              setShowAddCol(false);
            }}
            addNewMode="paint"/>
          <div style={{display:"flex",alignItems:"center",gap:8,margin:"14px 0 10px"}}>
            <div style={{flex:1,height:1,background:T.border}}/>
            <span style={{color:T.dimmer,fontSize:10,letterSpacing:2,textTransform:"uppercase"}}>OR SCAN</span>
            <div style={{flex:1,height:1,background:T.border}}/>
          </div>
          <GhostBtn onClick={()=>setColScan(s=>!s)} color={colScan?T.orange:T.dim}>{colScan?"CLOSE SCANNER":"SCAN BARCODE"}</GhostBtn>
          {colScan&&(
            <div style={{marginTop:10}}>
              <BarcodeScanner allPaints={allPaints}
                onTeach={(code,paintId)=>{
                  if(code&&paintId){
                    teachBarcode(paintId,code);
                    const found=allPaints.find(x=>x.id===paintId);
                    if(found){
                      setConfirmAddPaint({paint:found,barcode:code});
                      setConfirmPaintQty(1);
                      setConfirmPaintPrice(paintPrices[found.id]!=null?String(paintPrices[found.id]):"");
                    } else setOwnedMap(m=>({...m,[paintId]:(m[paintId]||0)+1}));
                    setColScan(false);setShowAddCol(false);
                  } else if(code&&!paintId){
                    setColTeach(code);setColScan(false);
                  }
                }}
                onFound={p=>{
                  setConfirmAddPaint({paint:p,barcode:null});
                  setConfirmPaintQty(1);
                  setConfirmPaintPrice(paintPrices[p.id]!=null?String(paintPrices[p.id]):"");
                  setColScan(false);setShowAddCol(false);
                }}
                onClose={()=>setColScan(false)}
                onAddNew={({name,brand,line,code,hex,barcode:bc})=>{
                  const p={id:"c"+Date.now(),brand,line,name,hex,code};
                  setCustomPaints(prev=>[...prev,p]);
                  if(bc) setBarcodeMap(m=>({...m,[bc]:p.id}));
                  setOwnedMap(m=>({...m,[p.id]:1}));
                  setColScan(false);setShowAddCol(false);
                }}
                addNewMode="paint"/>
            </div>
          )}
          {colTeach&&(
            <div style={{border:`1px solid ${T.yellow}`,background:"rgba(255,208,0,.05)",padding:12,marginTop:10,borderRadius:10}}>
              <Badge color={T.yellow}>LINK BARCODE TO PAINT</Badge>
              <div style={{color:T.dim,fontSize:10,fontFamily:"monospace",margin:"8px 0"}}>{colTeach}</div>
              <PaintSearch allPaints={allPaints} onSelect={p=>{teachBarcode(p.id,colTeach);setOwnedMap(m=>({...m,[p.id]:(m[p.id]||0)+1}));setColTeach(null);setShowAddCol(false);}} brandFilter="all"/>
              <button onClick={()=>setColTeach(null)} style={{background:"none",border:"none",color:T.dim,cursor:"pointer",fontSize:11,padding:0,letterSpacing:1,textTransform:"uppercase"}}>✕ CANCEL</button>
            </div>
          )}
          <div style={{display:"flex",alignItems:"center",gap:8,margin:"14px 0 10px"}}>
            <div style={{flex:1,height:1,background:T.border}}/>
            <span style={{color:T.dimmer,fontSize:10,letterSpacing:2,textTransform:"uppercase"}}>OR CREATE NEW</span>
            <div style={{flex:1,height:1,background:T.border}}/>
          </div>
          <GhostBtn onClick={()=>{setShowAddCol(false);setAddPaintPrefill(""); setShowAddPaint(true);}} color={T.green}>ADD CUSTOM PAINT</GhostBtn>
          <div style={{color:T.dim,fontSize:11,marginTop:14,letterSpacing:1,textTransform:"uppercase",borderTop:`1px solid ${T.border}`,paddingTop:10}}>{ownedIds.length} paint{ownedIds.length!==1?"s":""} in collection</div>
        </Sheet>
      )}

      {showAddPaint&&(
        <Sheet title="Add Custom Paint" badge="CUSTOM" onClose={()=>{setShowAddPaint(false);setNCtSc(false);}}
          footer={
            <Btn onClick={addCustomPaint} disabled={!nCtN.trim()||!nCtH||nCtH==="#888"}
              style={!nCtN.trim()||!nCtH||nCtH==="#888"?{background:"transparent",border:`1px solid ${T.orange}`,color:T.orange,opacity:.5}:{}}
              full>ADD TO LIBRARY</Btn>}>
          {/* back button if opened from Add to Collection */}
          <button onClick={()=>{setShowAddPaint(false);setShowAddCol(true);}}
            style={{display:"flex",alignItems:"center",gap:6,background:T.bg,
              border:`1px solid ${T.border}`,borderRadius:8,
              color:T.white,cursor:"pointer",fontSize:11,fontWeight:700,letterSpacing:1,
              textTransform:"uppercase",padding:"7px 14px",marginBottom:14}}>
            ← BACK TO ADD PAINT
          </button>          <FieldLabel>Brand</FieldLabel>
          <select value={nCtB} onChange={e=>setNCtB(e.target.value)} style={{width:"100%",background:"#0a0a0a",border:`1px solid ${T.border}`,padding:"10px 12px",color:T.white,fontSize:13,marginBottom:10,fontFamily:T.font,outline:"none"}}>
            {Object.entries(BRANDS).map(([k,b])=><option key={k} value={k}>{b.name}</option>)}
          </select>
          <FieldLabel>Line / Range</FieldLabel><Field value={nCtL} onChange={setNCtL} placeholder="E.G. GAME COLOR"/>
          <FieldLabel>Paint Name *</FieldLabel><Field value={nCtN||addPaintPrefill} onChange={v=>{setNCtN(v);setAddPaintPrefill("");}} placeholder="E.G. ELECTRIC BLUE"/>
          <FieldLabel>Code / SKU (optional)</FieldLabel><Field value={nCtC} onChange={setNCtC} placeholder="E.G. 72.023"/>
          <FieldLabel>Colour *</FieldLabel>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            <input type="color" value={nCtH} onChange={e=>setNCtH(e.target.value)} style={{width:48,height:40,border:`1px solid ${T.border}`,background:"none",cursor:"pointer"}}/>
            <Field value={nCtH} onChange={setNCtH} placeholder="#888888" mono style={{marginBottom:0,flex:1}}/>
          </div>
          <FieldLabel>Barcode (optional)</FieldLabel>
          <div style={{display:"flex",gap:6,marginBottom:nCtSc?10:10}}>
            <Field value={nCtBC} onChange={setNCtBC} placeholder="SCAN OR TYPE BARCODE" mono style={{marginBottom:0,flex:1}}/>
            <GhostBtn onClick={()=>setNCtSc(s=>!s)} color={nCtSc?T.orange:T.dim} small>SCAN</GhostBtn>
          </div>
          {nCtSc&&<div style={{marginBottom:12}}><BarcodeScanner allPaints={allPaints} onFound={()=>setNCtSc(false)} onTeach={code=>{setNCtBC(code);setNCtSc(false);}} onClose={()=>setNCtSc(false)}/></div>}
          <FieldLabel>Price per pot (optional)</FieldLabel>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:14}}>
            <span style={{color:T.dim,fontSize:13,fontWeight:700}}>$</span>
            <input type="number" min="0" step="0.01" value={nCtPrice} onChange={e=>setNCtPrice(e.target.value)} placeholder="0.00"
              style={{flex:1,background:"#0a0a0a",border:`1px solid ${T.border}`,padding:"10px 12px",color:T.white,fontSize:13,fontFamily:T.font,outline:"none",borderRadius:8}}/>
          </div>
          <div style={{color:T.dim,fontSize:10,letterSpacing:1,marginBottom:4,textTransform:"uppercase"}}>* Required fields</div>
          <div style={{color:T.dim,fontSize:10,letterSpacing:1,marginBottom:14,textTransform:"uppercase"}}>Custom paints are added to your collection automatically.</div>
        </Sheet>
      )}

      {editingPaint&&(
        <Sheet title="Edit Paint" badge="EDIT" onClose={()=>{setEditingPaint(null);setEPtScan(false);}}
          footer={<Btn onClick={saveEditPaint} full>SAVE CHANGES</Btn>}>
          <div style={{display:"flex",gap:12,alignItems:"center",background:T.surface,border:`1px solid ${T.border}`,padding:"12px 14px",marginBottom:14}}>
            <div style={{width:44,height:44,background:ePtHex,border:`1px solid ${T.border}`,flexShrink:0}}/>
            <div>
              <div style={{color:T.white,fontSize:15,fontWeight:900}}>{editingPaint.name}</div>
              <div style={{color:T.dim,fontSize:11}}>{BRANDS[editingPaint.brand]?.name} · {editingPaint.line} · {editingPaint.id}</div>
            </div>
          </div>
          <FieldLabel>Paint Name</FieldLabel><Field value={ePtN} onChange={setEPtN} placeholder="PAINT NAME"/>
          {editingPaint.brand==="custom"&&(
            <>
              <FieldLabel>Colour</FieldLabel>
              <div style={{display:"flex",gap:8,marginBottom:10}}>
                <input type="color" value={ePtHex} onChange={e=>setEPtHex(e.target.value)} style={{width:48,height:40,border:`1px solid ${T.border}`,background:"none",cursor:"pointer"}}/>
                <Field value={ePtHex} onChange={setEPtHex} placeholder="#888888" mono style={{marginBottom:0,flex:1}}/>
              </div>
            </>
          )}
          <FieldLabel>Barcode</FieldLabel>
          <div style={{display:"flex",gap:6,marginBottom:ePtScan?10:6}}>
            <Field value={ePtBC} onChange={setEPtBC} placeholder="SCAN OR TYPE BARCODE" mono style={{marginBottom:0,flex:1}}/>
            <GhostBtn onClick={()=>setEPtScan(s=>!s)} color={ePtScan?T.orange:T.dim} small>SCAN</GhostBtn>
          </div>
          {ePtScan&&<div style={{marginBottom:12}}><BarcodeScanner allPaints={allPaints} onFound={p=>{const bc=Object.entries(barcodeMap).find(([,id])=>id===p.id)?.[0]||"";setEPtBC(bc);setEPtScan(false);}} onTeach={code=>{setEPtBC(code);setEPtScan(false);}} onClose={()=>setEPtScan(false)}/></div>}
          <FieldLabel>Price per pot (optional)</FieldLabel>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
            <span style={{color:T.dim,fontSize:13,fontWeight:700}}>$</span>
            <input type="number" min="0" step="0.01" value={ePtPrice} onChange={e=>setEPtPrice(e.target.value)} placeholder="0.00"
              style={{flex:1,background:"#0a0a0a",border:`1px solid ${T.border}`,padding:"10px 12px",color:T.white,fontSize:13,fontFamily:T.font,outline:"none",borderRadius:8}}/>
          </div>
          <div style={{color:T.dim,fontSize:10,letterSpacing:1,marginBottom:14,textTransform:"uppercase"}}>Once linked, scanning this barcode finds this paint instantly.</div>
        </Sheet>
      )}

      {/* ADD TOOL MODAL */}
      {showAddTool&&(
        <Sheet title="Add Tool" badge="TOOL" onClose={()=>{setShowAddTool(false);setNTScan(false);setToolTopScan(false);}}
          footer={<Btn onClick={addTool} disabled={!nTName.trim()}
            style={!nTName.trim()?{background:"transparent",border:`1px solid ${T.orange}`,color:T.orange,opacity:.5}:{}}
            full>ADD TO LIBRARY</Btn>}>
          {/* Top barcode scanner */}
          <button onClick={()=>setToolTopScan(s=>!s)}
            style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,width:"100%",
              marginBottom:12,padding:"7px 14px",border:`1px solid ${toolTopScan?T.orange:T.border}`,
              borderRadius:8,background:toolTopScan?"rgba(212,245,74,.08)":T.bg,
              color:toolTopScan?T.orange:T.dim,cursor:"pointer",fontWeight:700,fontSize:11,
              letterSpacing:1,textTransform:"uppercase",fontFamily:T.font}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9V5a2 2 0 0 1 2-2h4M3 15v4a2 2 0 0 0 2 2h4M21 9V5a2 2 0 0 0-2-2h-4M21 15v4a2 2 0 0 1-2 2h-4M7 12h10"/></svg>
            {toolTopScan?"CLOSE SCANNER":"SCAN BARCODE TO FILL"}
          </button>
          {toolTopScan&&(
            <div style={{marginBottom:12}}>
              <BarcodeScanner allPaints={[]}
                onFound={()=>setToolTopScan(false)}
                onTeach={code=>{setNTBarcode(code);setToolTopScan(false);}}
                onAddNew={({name,brand,barcode:bc})=>{
                  setNTName(name||"");setNTBrand(brand||"");
                  if(bc) setNTBarcode(bc);
                  setToolTopScan(false);
                }}
                onClose={()=>setToolTopScan(false)}
                addNewMode="shop"/>
            </div>
          )}
          <FieldLabel>Tool Name</FieldLabel><Field value={nTName} onChange={setNTName} placeholder="E.G. WINSOR & NEWTON SERIES 7 NO.1"/>
          {/* duplicate check */}
          {nTName.trim().length>=3&&(()=>{
            const q=nTName.trim().toLowerCase();
            const matches=tools.filter(t=>t.name.toLowerCase().includes(q)||(t.brand||"").toLowerCase().includes(q)).slice(0,3);
            if(!matches.length) return null;
            return (
              <div style={{marginBottom:10,border:`1px solid ${T.yellow}`,borderRadius:10,padding:"10px 12px",background:"rgba(255,208,0,.05)"}}>
                <div style={{color:T.yellow,fontWeight:900,fontSize:10,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>
                  ⚠ SIMILAR TOOLS ALREADY IN LIBRARY
                </div>
                {matches.map(t=>{
                  const toolIcon=t.type==="Brush"||t.type==="Airbrush"?IC.brush:t.type==="Primer"||t.type==="Varnish"?IC.primer:t.type==="Masking Tape"?IC.masking:IC.tool;
                  return (
                    <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,
                      padding:"6px 0",borderBottom:`1px solid ${T.border}`}}>
                      <div style={{width:28,height:28,borderRadius:6,background:T.surface,
                        border:`1px solid ${T.border}`,display:"flex",alignItems:"center",
                        justifyContent:"center",color:T.dim,flexShrink:0}}>{toolIcon}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{color:T.white,fontSize:12,fontWeight:700}}>{t.name}</div>
                        <div style={{color:T.dim,fontSize:10}}>{t.brand} · {t.type}</div>
                      </div>
                      <Badge color={T.orange} small>{ownedMap[t.id]||0} owned</Badge>
                    </div>
                  );
                })}
                <div style={{color:T.dim,fontSize:10,marginTop:8}}>You can still add a new one if it's different.</div>
              </div>
            );
          })()}
          <FieldLabel>Brand</FieldLabel><Field value={nTBrand} onChange={setNTBrand} placeholder="E.G. WINSOR & NEWTON"/>
          <FieldLabel>Type</FieldLabel>
          <select value={nTType} onChange={e=>setNTType(e.target.value)}
            style={{width:"100%",background:"#0a0a0a",border:`1px solid ${T.border}`,padding:"10px 12px",color:T.white,fontSize:13,marginBottom:10,fontFamily:T.font,outline:"none"}}>
            {TOOL_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
          <FieldLabel>Notes (optional)</FieldLabel>
          <textarea value={nTNotes} onChange={e=>setNTNotes(e.target.value)} placeholder="E.G. SIZE 1, NATURAL HAIR, GREAT FOR FINE DETAILS..." rows={2}
            style={{width:"100%",boxSizing:"border-box",background:"#0a0a0a",border:`1px solid ${T.border}`,padding:"10px 12px",color:T.white,fontSize:13,fontFamily:T.font,outline:"none",resize:"vertical",marginBottom:10,lineHeight:1.5}}/>
          <FieldLabel>Barcode (optional)</FieldLabel>
          <div style={{display:"flex",gap:6,marginBottom:nTScan?10:10}}>
            <Field value={nTBarcode} onChange={setNTBarcode} placeholder="SCAN OR TYPE BARCODE" mono style={{marginBottom:0,flex:1}}/>
            <GhostBtn onClick={()=>setNTScan(s=>!s)} color={nTScan?T.orange:T.dim} small>SCAN</GhostBtn>
          </div>
          {nTScan&&(
            <div style={{marginBottom:12}}>
              <BarcodeScanner allPaints={[]} onFound={()=>setNTScan(false)} onTeach={code=>{setNTBarcode(code);setNTScan(false);}} onClose={()=>setNTScan(false)}/>
            </div>
          )}
          <FieldLabel>Location (where you keep it)</FieldLabel>
          <Field value={nTLocation} onChange={setNTLocation} placeholder="E.G. BRUSH POT, SHELF 2, DESK DRAWER"/>
          <FieldLabel>Price per item (optional)</FieldLabel>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
            <span style={{color:T.dim,fontSize:13,fontWeight:700}}>$</span>
            <input type="number" min="0" step="0.01" value={nTPrice} onChange={e=>setNTPrice(e.target.value)} placeholder="0.00"
              style={{flex:1,background:"#0a0a0a",border:`1px solid ${T.border}`,padding:"10px 12px",color:T.white,fontSize:13,fontFamily:T.font,outline:"none",borderRadius:8}}/>
          </div>
          <FieldLabel>Where you got it from</FieldLabel>
          <Field value={nTPurchaseFrom} onChange={setNTPurchaseFrom} placeholder="E.G. AMAZON, LOCAL HOBBY SHOP"/>
          <FieldLabel>Date purchased</FieldLabel>
          <input type="date" value={nTPurchaseDate} onChange={e=>setNTPurchaseDate(e.target.value)}
            style={{width:"100%",maxWidth:"100%",boxSizing:"border-box",background:"#0a0a0a",border:`1px solid ${T.border}`,
              padding:"6px 10px",color:T.white,fontSize:12,fontFamily:T.font,outline:"none",marginBottom:10,colorScheme:"dark",display:"block"}}/>
          <FieldLabel>Photos of tool</FieldLabel>
          <PhotoPicker photos={nTImages} onChange={setNTImages}/>
          <div style={{marginTop:10}}>
            <FieldLabel>Receipt photo (optional)</FieldLabel>
            {nTReceipt?(
              <div style={{position:"relative",width:"100%",height:100,overflow:"hidden",border:`1px solid ${T.border}`,borderRadius:8,marginBottom:8}}>
                <img src={nTReceipt} alt="receipt" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                <button onClick={()=>setNTReceipt(null)} style={{position:"absolute",top:4,right:4,background:"rgba(0,0,0,.8)",border:`1px solid ${T.red}`,color:T.red,cursor:"pointer",fontSize:12,width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,borderRadius:4}}>✕</button>
              </div>
            ):(
              <label style={{display:"block",width:"100%",background:T.bg,border:`2px dashed ${T.border}`,borderRadius:8,padding:"12px",textAlign:"center",cursor:"pointer",color:T.dimmer,fontSize:11,letterSpacing:1,textTransform:"uppercase",marginBottom:10,boxSizing:"border-box"}}>
                ADD RECEIPT PHOTO
                <input type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setNTReceipt(ev.target.result);r.readAsDataURL(f);e.target.value="";}} style={{display:"none"}}/>
              </label>
            )}
          </div>
          <div style={{marginBottom:14}}>
            <Toggle on={nTOwned} onToggle={()=>setNTOwned(o=>!o)} label={nTOwned?"I OWN THIS":"DON'T OWN YET"}/>
          </div>
        </Sheet>
      )}

      {/* EDIT TOOL MODAL */}
      {editingTool&&(
        <Sheet title="Edit Tool" badge="EDIT" onClose={()=>{setEditingTool(null);setETScan(false);}}
          footer={<Btn onClick={saveEditTool} full>SAVE CHANGES</Btn>}>
          <FieldLabel>Tool Name</FieldLabel><Field value={eTName} onChange={setETName} placeholder="TOOL NAME"/>
          <FieldLabel>Brand</FieldLabel><Field value={eTBrand} onChange={setETBrand} placeholder="BRAND"/>
          <FieldLabel>Type</FieldLabel>
          <select value={eTType} onChange={e=>setETType(e.target.value)}
            style={{width:"100%",background:"#0a0a0a",border:`1px solid ${T.border}`,padding:"10px 12px",color:T.white,fontSize:13,marginBottom:10,fontFamily:T.font,outline:"none"}}>
            {TOOL_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
          <FieldLabel>Notes (optional)</FieldLabel>
          <textarea value={eTNotes} onChange={e=>setETNotes(e.target.value)} placeholder="NOTES..." rows={2}
            style={{width:"100%",boxSizing:"border-box",background:"#0a0a0a",border:`1px solid ${T.border}`,padding:"10px 12px",color:T.white,fontSize:13,fontFamily:T.font,outline:"none",resize:"vertical",marginBottom:10,lineHeight:1.5}}/>
          <FieldLabel>Barcode (optional)</FieldLabel>
          <div style={{display:"flex",gap:6,marginBottom:eTScan?10:10}}>
            <Field value={eTBarcode} onChange={setETBarcode} placeholder="SCAN OR TYPE BARCODE" mono style={{marginBottom:0,flex:1}}/>
            <GhostBtn onClick={()=>setETScan(s=>!s)} color={eTScan?T.orange:T.dim} small>SCAN</GhostBtn>
          </div>
          {eTScan&&(
            <div style={{marginBottom:12}}>
              <BarcodeScanner allPaints={[]} onFound={()=>setETScan(false)} onTeach={code=>{setETBarcode(code);setETScan(false);}} onClose={()=>setETScan(false)}/>
            </div>
          )}
          <FieldLabel>Location (where you keep it)</FieldLabel>
          <Field value={eTLocation} onChange={setETLocation} placeholder="E.G. BRUSH POT, SHELF 2, DESK DRAWER"/>
          <FieldLabel>Price per item (optional)</FieldLabel>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
            <span style={{color:T.dim,fontSize:13,fontWeight:700}}>$</span>
            <input type="number" min="0" step="0.01" value={eTPrice} onChange={e=>setETPrice(e.target.value)} placeholder="0.00"
              style={{flex:1,background:"#0a0a0a",border:`1px solid ${T.border}`,padding:"10px 12px",color:T.white,fontSize:13,fontFamily:T.font,outline:"none",borderRadius:8}}/>
          </div>
          <FieldLabel>Where you got it from</FieldLabel>
          <Field value={eTPurchaseFrom} onChange={setETPurchaseFrom} placeholder="E.G. AMAZON, LOCAL HOBBY SHOP"/>
          <PhotoPicker photos={eTImages} onChange={setETImages}/>
          <div style={{marginTop:10}}>
            <FieldLabel>Receipt photo (optional)</FieldLabel>
            {eTReceipt?(
              <div style={{position:"relative",width:"100%",height:100,overflow:"hidden",border:`1px solid ${T.border}`,borderRadius:8,marginBottom:8}}>
                <img src={eTReceipt} alt="receipt" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                <button onClick={()=>setETReceipt(null)} style={{position:"absolute",top:4,right:4,background:"rgba(0,0,0,.8)",border:`1px solid ${T.red}`,color:T.red,cursor:"pointer",fontSize:12,width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,borderRadius:4}}>✕</button>
              </div>
            ):(
              <label style={{display:"block",width:"100%",background:T.bg,border:`2px dashed ${T.border}`,borderRadius:8,padding:"12px",textAlign:"center",cursor:"pointer",color:T.dimmer,fontSize:11,letterSpacing:1,textTransform:"uppercase",marginBottom:10,boxSizing:"border-box"}}>
                ADD RECEIPT PHOTO
                <input type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setETReceipt(ev.target.result);r.readAsDataURL(f);e.target.value="";}} style={{display:"none"}}/>
              </label>
            )}
          </div>
          <div style={{marginBottom:14}}>
            <Toggle on={eTOwned} onToggle={()=>setETOwned(o=>!o)} label={eTOwned?"I OWN THIS":"DON'T OWN YET"}/>
          </div>
        </Sheet>
      )}

      {/* ADD CONSUMABLE MODAL */}
      {showAddCon&&(
        <Sheet title="Add Supply Item" badge="SUPPLIES" onClose={()=>{setShowAddCon(false);setNCnScan(false);setConTopScan(false);}}
          footer={<>
            <Btn onClick={addConsumable} disabled={!nCnName.trim()}
              style={!nCnName.trim()?{background:"transparent",border:`1px solid ${T.orange}`,color:T.orange,opacity:.5}:{}}
              full>ADD TO LIBRARY</Btn>
            <Btn onClick={()=>{
              if(!nCnName.trim()) return;
              addShopItem(nCnName,nCnBrand,"Supplies",nCnBarcode.trim(),nCnNotes,1);
              setNCnName("");setNCnBrand("");setNCnType("Sandpaper");setNCnNotes("");setNCnBarcode("");setNCnScan(false);
              setNCnQty(1);setNCnMinQty(2);setNCnLocation("");setNCnPurchaseDate("");setNCnPurchaseFrom("");setNCnReceipt(null);
              setShowAddCon(false);
            }} disabled={!nCnName.trim()}
              style={{marginTop:8,background:"transparent",border:`1px solid ${T.yellow}`,color:T.yellow,
                opacity:!nCnName.trim()?.5:1,width:"100%",padding:"12px",fontWeight:900,fontSize:13,
                letterSpacing:1,textTransform:"uppercase",cursor:"pointer",borderRadius:10}}>
              + ADD TO SHOP LIST
            </Btn>
          </>}>
          {/* Top barcode scanner */}
          <button onClick={()=>setConTopScan(s=>!s)}
            style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,width:"100%",
              marginBottom:12,padding:"7px 14px",border:`1px solid ${conTopScan?T.orange:T.border}`,
              borderRadius:8,background:conTopScan?"rgba(212,245,74,.08)":T.bg,
              color:conTopScan?T.orange:T.dim,cursor:"pointer",fontWeight:700,fontSize:11,
              letterSpacing:1,textTransform:"uppercase",fontFamily:T.font}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9V5a2 2 0 0 1 2-2h4M3 15v4a2 2 0 0 0 2 2h4M21 9V5a2 2 0 0 0-2-2h-4M21 15v4a2 2 0 0 1-2 2h-4M7 12h10"/></svg>
            {conTopScan?"CLOSE SCANNER":"SCAN BARCODE TO FILL"}
          </button>
          {conTopScan&&(
            <div style={{marginBottom:12}}>
              <BarcodeScanner allPaints={[]}
                onFound={()=>setConTopScan(false)}
                onTeach={code=>{setNCnBarcode(code);setConTopScan(false);}}
                onAddNew={({name,brand,barcode:bc})=>{
                  setNCnName(name||"");setNCnBrand(brand||"");
                  if(bc) setNCnBarcode(bc);
                  setConTopScan(false);
                }}
                onClose={()=>setConTopScan(false)}
                addNewMode="shop"/>
            </div>
          )}
          <FieldLabel>Item Name *</FieldLabel><Field value={nCnName} onChange={setNCnName} placeholder="E.G. WET/DRY SANDPAPER 400 GRIT"/>
          <FieldLabel>Brand</FieldLabel><Field value={nCnBrand} onChange={setNCnBrand} placeholder="E.G. 3M, SWANN-MORTON"/>
          <FieldLabel>Type</FieldLabel>
          <select value={nCnType} onChange={e=>setNCnType(e.target.value)}
            style={{width:"100%",background:"#0a0a0a",border:`1px solid ${T.border}`,padding:"10px 12px",color:T.white,fontSize:13,marginBottom:10,fontFamily:T.font,outline:"none"}}>
            {CONSUMABLE_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
          <FieldLabel>Notes (optional)</FieldLabel>
          <textarea value={nCnNotes} onChange={e=>setNCnNotes(e.target.value)} placeholder="E.G. 400 GRIT, USE WET FOR RESIN..." rows={2}
            style={{width:"100%",boxSizing:"border-box",background:"#0a0a0a",border:`1px solid ${T.border}`,padding:"10px 12px",color:T.white,fontSize:13,fontFamily:T.font,outline:"none",resize:"vertical",marginBottom:10,lineHeight:1.5}}/>
          <div style={{display:"flex",gap:12,marginBottom:10}}>
            <div style={{flex:1}}>
              <FieldLabel>Quantity</FieldLabel>
              <div style={{display:"flex",alignItems:"center",border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden"}}>
                <button onClick={()=>setNCnQty(q=>Math.max(0,q-1))} style={{flex:1,height:36,background:T.bg,border:"none",color:T.white,fontSize:16,cursor:"pointer",fontWeight:900}}>−</button>
                <div style={{minWidth:36,textAlign:"center",color:T.orange,fontSize:13,fontWeight:900}}>{nCnQty}</div>
                <button onClick={()=>setNCnQty(q=>q+1)} style={{flex:1,height:36,background:T.bg,border:"none",color:T.white,fontSize:16,cursor:"pointer",fontWeight:900}}>+</button>
              </div>
            </div>
            <div style={{flex:1}}>
              <FieldLabel>Reorder below</FieldLabel>
              <div style={{display:"flex",alignItems:"center",border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden"}}>
                <button onClick={()=>setNCnMinQty(q=>Math.max(0,q-1))} style={{flex:1,height:36,background:T.bg,border:"none",color:T.white,fontSize:16,cursor:"pointer",fontWeight:900}}>−</button>
                <div style={{minWidth:36,textAlign:"center",color:T.yellow,fontSize:13,fontWeight:900}}>{nCnMinQty}</div>
                <button onClick={()=>setNCnMinQty(q=>q+1)} style={{flex:1,height:36,background:T.bg,border:"none",color:T.white,fontSize:16,cursor:"pointer",fontWeight:900}}>+</button>
              </div>
            </div>
          </div>
          <FieldLabel>Barcode (optional)</FieldLabel>
          <div style={{display:"flex",gap:6,marginBottom:nCnScan?10:14}}>
            <Field value={nCnBarcode} onChange={setNCnBarcode} placeholder="SCAN OR TYPE BARCODE" mono style={{marginBottom:0,flex:1}}/>
            <GhostBtn onClick={()=>setNCnScan(s=>!s)} color={nCnScan?T.orange:T.dim} small>SCAN</GhostBtn>
          </div>
          {nCnScan&&<div style={{marginBottom:12}}><BarcodeScanner allPaints={[]} onFound={()=>setNCnScan(false)} onTeach={code=>{setNCnBarcode(code);setNCnScan(false);}} onClose={()=>setNCnScan(false)}/></div>}
          <FieldLabel>Location</FieldLabel><Field value={nCnLocation} onChange={setNCnLocation} placeholder="E.G. SUPPLY DRAWER, SHELF 3"/>
          <FieldLabel>Price per item (optional)</FieldLabel>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
            <span style={{color:T.dim,fontSize:13,fontWeight:700}}>$</span>
            <input type="number" min="0" step="0.01" value={nCnPrice} onChange={e=>setNCnPrice(e.target.value)} placeholder="0.00"
              style={{flex:1,background:"#0a0a0a",border:`1px solid ${T.border}`,padding:"10px 12px",color:T.white,fontSize:13,fontFamily:T.font,outline:"none",borderRadius:8}}/>
          </div>
          <FieldLabel>Where you got it from</FieldLabel><Field value={nCnPurchaseFrom} onChange={setNCnPurchaseFrom} placeholder="E.G. AMAZON, LOCAL HOBBY SHOP"/>
          <FieldLabel>Date purchased</FieldLabel>
          <input type="date" value={nCnPurchaseDate} onChange={e=>setNCnPurchaseDate(e.target.value)}
            style={{width:"100%",maxWidth:"100%",boxSizing:"border-box",background:"#0a0a0a",border:`1px solid ${T.border}`,
              padding:"6px 10px",color:T.white,fontSize:12,fontFamily:T.font,outline:"none",marginBottom:10,colorScheme:"dark",display:"block"}}/>
          <FieldLabel>Receipt photo (optional)</FieldLabel>
          {nCnReceipt?(
            <div style={{position:"relative",width:"100%",height:100,overflow:"hidden",border:`1px solid ${T.border}`,borderRadius:8,marginBottom:8}}>
              <img src={nCnReceipt} alt="receipt" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
              <button onClick={()=>setNCnReceipt(null)} style={{position:"absolute",top:4,right:4,background:"rgba(0,0,0,.8)",border:`1px solid ${T.red}`,color:T.red,cursor:"pointer",fontSize:12,width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,borderRadius:4}}>✕</button>
            </div>
          ):(
            <label style={{display:"block",width:"100%",background:T.bg,border:`2px dashed ${T.border}`,borderRadius:8,padding:"12px",textAlign:"center",cursor:"pointer",color:T.dimmer,fontSize:11,letterSpacing:1,textTransform:"uppercase",marginBottom:14,boxSizing:"border-box"}}>
              ADD RECEIPT PHOTO
              <input type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setNCnReceipt(ev.target.result);r.readAsDataURL(f);e.target.value="";}} style={{display:"none"}}/>
            </label>
          )}
        </Sheet>
      )}

      {/* EDIT CONSUMABLE MODAL */}
      {editingCon&&(
        <Sheet title="Edit Supply Item" badge="EDIT" onClose={()=>{setEditingCon(null);setECnScan(false);}}
          footer={<Btn onClick={saveEditCon} full>SAVE CHANGES</Btn>}>
          <FieldLabel>Item Name</FieldLabel><Field value={eCnName} onChange={setECnName} placeholder="ITEM NAME"/>
          <FieldLabel>Brand</FieldLabel><Field value={eCnBrand} onChange={setECnBrand} placeholder="BRAND"/>
          <FieldLabel>Type</FieldLabel>
          <select value={eCnType} onChange={e=>setECnType(e.target.value)}
            style={{width:"100%",background:"#0a0a0a",border:`1px solid ${T.border}`,padding:"10px 12px",color:T.white,fontSize:13,marginBottom:10,fontFamily:T.font,outline:"none"}}>
            {CONSUMABLE_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
          <FieldLabel>Notes</FieldLabel>
          <textarea value={eCnNotes} onChange={e=>setECnNotes(e.target.value)} rows={2}
            style={{width:"100%",boxSizing:"border-box",background:"#0a0a0a",border:`1px solid ${T.border}`,padding:"10px 12px",color:T.white,fontSize:13,fontFamily:T.font,outline:"none",resize:"vertical",marginBottom:10,lineHeight:1.5}}/>
          <div style={{display:"flex",gap:12,marginBottom:10}}>
            <div style={{flex:1}}>
              <FieldLabel>Quantity</FieldLabel>
              <div style={{display:"flex",alignItems:"center",border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden"}}>
                <button onClick={()=>setECnQty(q=>Math.max(0,q-1))} style={{flex:1,height:36,background:T.bg,border:"none",color:T.white,fontSize:16,cursor:"pointer",fontWeight:900}}>−</button>
                <div style={{minWidth:36,textAlign:"center",color:T.orange,fontSize:13,fontWeight:900}}>{eCnQty}</div>
                <button onClick={()=>setECnQty(q=>q+1)} style={{flex:1,height:36,background:T.bg,border:"none",color:T.white,fontSize:16,cursor:"pointer",fontWeight:900}}>+</button>
              </div>
            </div>
            <div style={{flex:1}}>
              <FieldLabel>Reorder below</FieldLabel>
              <div style={{display:"flex",alignItems:"center",border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden"}}>
                <button onClick={()=>setECnMinQty(q=>Math.max(0,q-1))} style={{flex:1,height:36,background:T.bg,border:"none",color:T.white,fontSize:16,cursor:"pointer",fontWeight:900}}>−</button>
                <div style={{minWidth:36,textAlign:"center",color:T.yellow,fontSize:13,fontWeight:900}}>{eCnMinQty}</div>
                <button onClick={()=>setECnMinQty(q=>q+1)} style={{flex:1,height:36,background:T.bg,border:"none",color:T.white,fontSize:16,cursor:"pointer",fontWeight:900}}>+</button>
              </div>
            </div>
          </div>
          <FieldLabel>Barcode</FieldLabel>
          <div style={{display:"flex",gap:6,marginBottom:eCnScan?10:6}}>
            <Field value={eCnBarcode} onChange={setECnBarcode} placeholder="SCAN OR TYPE BARCODE" mono style={{marginBottom:0,flex:1}}/>
            <GhostBtn onClick={()=>setECnScan(s=>!s)} color={eCnScan?T.orange:T.dim} small>SCAN</GhostBtn>
          </div>
          {eCnScan&&<div style={{marginBottom:12}}><BarcodeScanner allPaints={[]} onFound={()=>setECnScan(false)} onTeach={code=>{setECnBarcode(code);setECnScan(false);}} onClose={()=>setECnScan(false)}/></div>}
          <FieldLabel>Location</FieldLabel><Field value={eCnLocation} onChange={setECnLocation} placeholder="E.G. SUPPLY DRAWER"/>
          <FieldLabel>Price per item (optional)</FieldLabel>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
            <span style={{color:T.dim,fontSize:13,fontWeight:700}}>$</span>
            <input type="number" min="0" step="0.01" value={eCnPrice} onChange={e=>setECnPrice(e.target.value)} placeholder="0.00"
              style={{flex:1,background:"#0a0a0a",border:`1px solid ${T.border}`,padding:"10px 12px",color:T.white,fontSize:13,fontFamily:T.font,outline:"none",borderRadius:8}}/>
          </div>
          <FieldLabel>Where you got it from</FieldLabel><Field value={eCnPurchaseFrom} onChange={setECnPurchaseFrom} placeholder="E.G. AMAZON"/>
          <FieldLabel>Date purchased</FieldLabel>
          <input type="date" value={eCnPurchaseDate} onChange={e=>setECnPurchaseDate(e.target.value)}
            style={{width:"100%",maxWidth:"100%",boxSizing:"border-box",background:"#0a0a0a",border:`1px solid ${T.border}`,
              padding:"6px 10px",color:T.white,fontSize:12,fontFamily:T.font,outline:"none",marginBottom:10,colorScheme:"dark",display:"block"}}/>
        </Sheet>
      )}

      {/* CONFIRM REMOVE PAINT */}
      {confirmRemovePaint&&(()=>{
        const p=allPaints.find(x=>x.id===confirmRemovePaint);
        return p?(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:20,width:"100%",maxWidth:360}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <div style={{width:44,height:44,borderRadius:10,background:p.hex,border:`1px solid ${T.border}`,flexShrink:0}}/>
                <div>
                  <div style={{color:T.white,fontWeight:900,fontSize:15}}>{p.name}</div>
                  <div style={{color:T.dim,fontSize:12}}>{BRANDS[p.brand]?.name||p.brand} · {p.id}</div>
                </div>
              </div>
              <div style={{color:T.white,fontSize:13,marginBottom:20,lineHeight:1.5}}>
                Remove <strong>{p.name}</strong> from your collection?
              </div>
              <div style={{display:"flex",gap:10}}>
                <GhostBtn onClick={()=>setConfirmRemovePaint(null)} color={T.dim} style={{flex:1,justifyContent:"center"}}>KEEP IT</GhostBtn>
                <Btn onClick={()=>{setOwnedMap(m=>({...m,[confirmRemovePaint]:0}));setConfirmRemovePaint(null);}} color={T.red} style={{flex:1}}>REMOVE</Btn>
              </div>
            </div>
          </div>
        ):null;
      })()}

      {/* CONFIRM ADD PAINT TO COLLECTION */}
      {confirmAddPaint&&(
        <Sheet title="Add to Collection" badge="COLLECT" onClose={()=>setConfirmAddPaint(null)}
          footer={
            <Btn onClick={()=>{
              const p=confirmAddPaint.paint;
              setOwnedMap(m=>({...m,[p.id]:(m[p.id]||0)+confirmPaintQty}));
              if(confirmPaintPrice) setPaintPrices(m=>({...m,[p.id]:parseFloat(confirmPaintPrice)}));
              setConfirmAddPaint(null);
            }} full>ADD TO COLLECTION</Btn>
          }>
          {/* Paint preview */}
          <div style={{display:"flex",alignItems:"center",gap:12,background:T.surface,
            border:`1px solid ${T.border}`,borderRadius:12,padding:"12px 14px",marginBottom:16}}>
            <div style={{width:52,height:52,borderRadius:10,background:confirmAddPaint.paint.hex,
              border:`1px solid ${T.border}`,flexShrink:0,
              boxShadow:`0 0 16px ${confirmAddPaint.paint.hex}66`}}/>
            <div>
              <div style={{color:T.white,fontWeight:900,fontSize:16}}>{confirmAddPaint.paint.name}</div>
              <div style={{color:T.dim,fontSize:12}}>{BRANDS[confirmAddPaint.paint.brand]?.name||confirmAddPaint.paint.brand} · {confirmAddPaint.paint.line}</div>
              <div style={{color:T.dim,fontSize:11}}>{confirmAddPaint.paint.id}</div>
              {confirmAddPaint.barcode&&<div style={{color:T.orange,fontFamily:"monospace",fontSize:10,marginTop:2}}>▐ {confirmAddPaint.barcode}</div>}
            </div>
          </div>
          {/* Quantity */}
          <FieldLabel>Quantity</FieldLabel>
          <div style={{display:"flex",alignItems:"center",border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden",marginBottom:14}}>
            <button onClick={()=>setConfirmPaintQty(q=>Math.max(1,q-1))}
              style={{flex:1,height:44,background:T.bg,border:"none",color:T.white,fontSize:20,cursor:"pointer",fontWeight:900}}>−</button>
            <div style={{minWidth:48,textAlign:"center",color:T.orange,fontSize:18,fontWeight:900}}>{confirmPaintQty}</div>
            <button onClick={()=>setConfirmPaintQty(q=>q+1)}
              style={{flex:1,height:44,background:T.bg,border:"none",color:T.white,fontSize:20,cursor:"pointer",fontWeight:900}}>+</button>
          </div>
          {/* Price */}
          <FieldLabel>Price per pot (optional)</FieldLabel>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:14}}>
            <span style={{color:T.dim,fontSize:13,fontWeight:700}}>$</span>
            <input type="number" min="0" step="0.01" value={confirmPaintPrice}
              onChange={e=>setConfirmPaintPrice(e.target.value)} placeholder="0.00"
              style={{flex:1,background:"#0a0a0a",border:`1px solid ${T.border}`,padding:"10px 12px",
                color:T.white,fontSize:13,fontFamily:T.font,outline:"none",borderRadius:8}}/>
          </div>
        </Sheet>
      )}

      {/* ADD SHOPPING ITEM MODAL */}
      {showAddShop&&(
        <Sheet title="Add to Shopping List" badge="SHOP" onClose={()=>{setShowAddShop(false);setNSScan(false);setShopScan(false);setShopTeach(null);setShopSearchQ("");setShopCustomMode(false);}}>

          {!shopCustomMode?(
            <>
              {/* Barcode scan button */}
              <button onClick={()=>setShopScan(s=>!s)}
                style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,width:"100%",
                  marginBottom:10,padding:"7px 14px",border:`1px solid ${shopScan?T.orange:T.border}`,
                  borderRadius:8,background:shopScan?"rgba(212,245,74,.08)":T.bg,
                  color:shopScan?T.orange:T.dim,cursor:"pointer",fontWeight:700,fontSize:11,
                  letterSpacing:1,textTransform:"uppercase",fontFamily:T.font,whiteSpace:"nowrap"}}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9V5a2 2 0 0 1 2-2h4M3 15v4a2 2 0 0 0 2 2h4M21 9V5a2 2 0 0 0-2-2h-4M21 15v4a2 2 0 0 1-2 2h-4M7 12h10"/></svg>
                {shopScan?"CLOSE SCANNER":"SCAN BARCODE TO ADD"}
              </button>
              {shopScan&&(
                <div style={{marginBottom:12}}>
                  <BarcodeScanner
                    allPaints={allPaints}
                    onFound={p=>{
                      setShowAddShop(false);setShopScan(false);setShopSearchQ("");
                      setTimeout(()=>{setConfirmAddToShop({name:p.name,brand:BRANDS[p.brand]?.name||p.brand,category:"Paint",barcode:p.barcode||"",hex:p.hex,price:p.price||null});setAddShopQty(1);setAddShopNotes("");setAddShopPrice(p.price!=null?String(p.price):"");},50);
                    }}
                    onTeach={code=>{
                      const t=tools.find(x=>x.barcode===code);
                      const c=consumables.find(x=>x.barcode===code);
                      if(t){setShowAddShop(false);setShopScan(false);setTimeout(()=>{setConfirmAddToShop({name:t.name,brand:t.brand||"",category:t.type,barcode:code,hex:null,price:t.price||null});setAddShopQty(1);setAddShopNotes("");setAddShopPrice(t.price!=null?String(t.price):"");},50);}
                      else if(c){setShowAddShop(false);setShopScan(false);setTimeout(()=>{setConfirmAddToShop({name:c.name,brand:c.brand||"",category:"Supplies",barcode:code,hex:null,price:c.price||null});setAddShopQty(1);setAddShopNotes("");setAddShopPrice(c.price!=null?String(c.price):"");},50);}
                      else{setShopTeach(code);setShopScan(false);}
                    }}
                    onAddNew={({name,brand,category,barcode})=>{addShopItem(name,brand,category,barcode,"",1);setShopScan(false);setShowAddShop(false);}}
                    onClose={()=>setShopScan(false)}
                    addNewMode="shop"/>
                </div>
              )}
              {shopTeach&&(
                <div style={{border:`1px solid ${T.yellow}`,background:"rgba(255,208,0,.05)",padding:12,marginBottom:12,borderRadius:10}}>
                  <Badge color={T.yellow}>UNKNOWN BARCODE</Badge>
                  <div style={{color:T.dim,fontSize:10,fontFamily:"monospace",margin:"8px 0"}}>{shopTeach}</div>
                  <PaintSearch allPaints={allPaints} onSelect={p=>{
                    setShowAddShop(false);setShopTeach(null);
                    setTimeout(()=>{setConfirmAddToShop({name:p.name,brand:BRANDS[p.brand]?.name||p.brand,category:"Paint",barcode:shopTeach,hex:p.hex});setAddShopQty(1);setAddShopNotes("");setAddShopPrice("");},50);
                  }} brandFilter="all"/>
                  <div style={{display:"flex",gap:6,marginTop:8}}>
                    <GhostBtn onClick={()=>{addShopItem("Unknown Item","","Other",shopTeach,"",1);setShopTeach(null);setShowAddShop(false);}} color={T.orange} small>ADD AS UNKNOWN</GhostBtn>
                    <GhostBtn onClick={()=>setShopTeach(null)} color={T.dim} small>CANCEL</GhostBtn>
                  </div>
                </div>
              )}
              {/* search bar */}
              <input value={shopSearchQ} onChange={e=>setShopSearchQ(e.target.value)}
                placeholder="SEARCH PAINTS, TOOLS, SUPPLIES..."
                autoFocus
                style={{width:"100%",background:"#0a0a0a",border:`1px solid ${T.orange}`,borderRadius:10,
                  padding:"11px 14px",color:T.white,fontWeight:700,letterSpacing:.5,fontSize:16,
                  outline:"none",fontFamily:T.font,marginBottom:12,boxSizing:"border-box"}}/>

              {/* tab filter */}
              <div style={{display:"flex",gap:0,border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden",marginBottom:14}}>
                {[["all","ALL"],["paints","PAINTS"],["tools","TOOLS"],["supplies","SUPPLIES"]].map(([t,l],i,arr)=>(
                  <button key={t} onClick={()=>setShopSearchTab(t)}
                    style={{flex:1,padding:"8px 0",border:"none",
                      borderRight:i<arr.length-1?`2px solid ${T.border}`:"none",
                      background:shopSearchTab===t?T.orange:T.surface,
                      color:shopSearchTab===t?"#000":T.dim,
                      fontWeight:900,fontSize:10,letterSpacing:.5,cursor:"pointer",textTransform:"uppercase"}}>
                    {l}
                  </button>
                ))}
              </div>

              {/* results */}
              <div style={{maxHeight:380,overflowY:"auto",marginBottom:14}}>
                <ShopSearchResults
                  q={shopSearchQ} tab={shopSearchTab}
                  allPaints={allPaints} tools={tools} consumables={consumables} ownedIds={ownedIds}
                  onSelect={item=>{
                    setShowAddShop(false);
                    setShopSearchQ("");
                    setShopCustomMode(false);
                    setTimeout(()=>{
                      setConfirmAddToShop(item);
                      setAddShopQty(1);
                      setAddShopNotes("");
                    },50);
                  }}
                />
              </div>

              {/* custom item button */}
              <button onClick={()=>setShopCustomMode(true)}
                style={{width:"100%",padding:"12px",border:`2px dashed ${T.border}`,borderRadius:10,
                  background:T.bg,color:T.dim,cursor:"pointer",fontSize:12,fontWeight:700,
                  letterSpacing:1,textTransform:"uppercase"}}>
                + ADD CUSTOM ITEM
              </button>
            </>
          ):(
            <>
              {/* custom item form */}
              <button onClick={()=>setShopCustomMode(false)}
                style={{background:"none",border:"none",color:T.orange,cursor:"pointer",fontSize:12,
                  fontWeight:700,letterSpacing:1,textTransform:"uppercase",padding:0,marginBottom:14}}>
                ← BACK TO SEARCH
              </button>
              <FieldLabel>Item Name</FieldLabel>
              <Field value={nSName} onChange={setNSName} placeholder="E.G. KALEIDO SCORCHED GOLD"/>
              <FieldLabel>Brand (optional)</FieldLabel>
              <Field value={nSBrand} onChange={setNSBrand} placeholder="E.G. KALEIDO"/>
              <FieldLabel>Category</FieldLabel>
              <select value={nSCat} onChange={e=>setNSCat(e.target.value)}
                style={{width:"100%",background:"#0a0a0a",border:`1px solid ${T.border}`,borderRadius:10,
                  padding:"10px 12px",color:T.white,fontSize:13,marginBottom:10,fontFamily:T.font,outline:"none"}}>
                {SHOP_CATS.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
              <FieldLabel>Notes (optional)</FieldLabel>
              <Field value={nSNotes} onChange={setNSNotes} placeholder="E.G. RUNNING LOW, NEED 2 POTS"/>
              <FieldLabel>Quantity</FieldLabel>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                <button onClick={()=>setNSQty(q=>Math.max(1,q-1))}
                  style={{width:36,height:36,background:T.border,border:"none",color:T.white,fontSize:20,cursor:"pointer",fontWeight:900,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                <div style={{textAlign:"center",minWidth:48}}>
                  <div style={{color:T.orange,fontSize:24,fontWeight:900,lineHeight:1}}>{nSQty}</div>
                  <div style={{color:T.dim,fontSize:9,letterSpacing:1,textTransform:"uppercase"}}>QTY</div>
                </div>
                <button onClick={()=>setNSQty(q=>q+1)}
                  style={{width:36,height:36,background:T.border,border:"none",color:T.white,fontSize:20,cursor:"pointer",fontWeight:900,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
              </div>
              <Btn onClick={()=>{
                if(!nSName.trim()) return;
                addShopItem(nSName,nSBrand,nSCat,nSBarcode,nSNotes,nSQty);
                setShopToast({name:nSName,hex:""});
                setTimeout(()=>setShopToast(null),2500);
                setNSName("");setNSBrand("");setNSCat("Paint");setNSBarcode("");setNSNotes("");setNSQty(1);
                setShopCustomMode(false);setShowAddShop(false);
              }} disabled={!nSName.trim()} full>ADD TO LIST</Btn>
            </>
          )}
        </Sheet>
      )}

      {/* PAINT MIX TOAST */}
      {paintMixToast&&(
        <div style={{position:"fixed",bottom:100,left:"50%",transform:"translateX(-50%)",
          zIndex:9999,background:"#44cc88",borderRadius:12,padding:"10px 18px",
          display:"flex",alignItems:"center",gap:10,
          boxShadow:"0 8px 32px rgba(0,0,0,.6)",maxWidth:"88vw",width:"max-content"}}>
          {paintMixToast.hex&&<div style={{width:22,height:22,borderRadius:5,background:paintMixToast.hex,border:"1px solid rgba(0,0,0,.2)",flexShrink:0}}/>}
          <span style={{color:"#000",fontWeight:900,fontSize:12,letterSpacing:.5}}>{paintMixToast.name} added to mix!</span>
        </div>
      )}

      {/* MIX SAVED TOAST */}
      {mixSavedToast&&(
        <div style={{position:"fixed",top:0,left:0,right:0,zIndex:9999,
          background:"#001a0d",borderBottom:`1px solid #44cc88`,
          padding:"12px 16px",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:10,height:10,borderRadius:"50%",background:"#44cc88",flexShrink:0}}/>
          <div style={{flex:1}}>
            <div style={{color:"#44cc88",fontWeight:900,fontSize:11,letterSpacing:1,textTransform:"uppercase"}}>✓ MIX SAVED TO MY MIXES</div>
            <div style={{color:T.white,fontSize:13,fontWeight:700,marginTop:1}}>{mixSavedToast}</div>
          </div>
        </div>
      )}
      {cartAddedToolId&&!toolDetail&&(
        <div style={{position:"fixed",top:0,left:0,right:0,zIndex:9999,
          background:"#2a2000",borderBottom:`1px solid ${T.yellow}`,
          padding:"12px 16px",display:"flex",alignItems:"center",gap:10}}>
          <div style={{flex:1}}>
            <div style={{color:T.yellow,fontWeight:900,fontSize:11,letterSpacing:1,textTransform:"uppercase"}}>✓ ADDED TO SHOPPING LIST</div>
            <div style={{color:T.white,fontSize:13,fontWeight:700,marginTop:1}}>{cartToastName}</div>
          </div>
          <span style={{color:T.yellow,fontSize:18}}>✓</span>
        </div>
      )}

      {/* TOOL DETAIL SHEET */}
      {toolDetail&&(
        <ToolDetailSheet
          tool={toolDetail}
          ownedIds={ownedIds}
          ownedMap={ownedMap}
          setOwnedMap={setOwnedMap}
          setTools={setTools}
          tools={tools}
          onClose={()=>setToolDetail(null)}
          onAddToShop={addToolToShop}
          onDelete={id=>{deleteTool(id);setToolDetail(null);}}
          setLightbox={setLightbox}
          cartToast={toolDetailCartToast}
        />
      )}

      {/* PAINT DETAIL SHEET */}
      {paintDetail&&(
        <PaintDetailSheet
          p={paintDetail}
          barcodeMap={barcodeMap}
          ownedIds={ownedIds}
          ownedMap={ownedMap}
          allPaints={allPaints}
          labComponents={labComponents}
          setLabComponents={setLabComponents}
          paintDetailPhotos={paintDetailPhotos}
          setPaintDetailPhotos={setPaintDetailPhotos}
          paintMixToast={paintMixToast}
          setPaintMixToast={setPaintMixToast}
          onClose={()=>setPaintDetail(null)}
          onEdit={p=>{setPaintDetail(null);openEditPaint(p);}}
          onAddToShop={addPaintToShop}
          onAddToCollection={(p,delta)=>{setQty(p.id,Math.max(0,(ownedMap[p.id]||0)+delta));}}
          cartToast={paintDetailCartToast}
          setLightbox={setLightbox}
          onSaveEdit={(p,name,hex,bc,price)=>{
            if(p.brand==="custom"){
              setCustomPaints(prev=>prev.map(x=>x.id===p.id?{...x,name,hex}:x));
            }
            // Save price for any paint
            if(price) setPaintPrices(m=>({...m,[p.id]:parseFloat(price)}));
            else setPaintPrices(m=>{const c={...m};delete c[p.id];return c;});
            const newMap=Object.fromEntries(Object.entries(barcodeMap).filter(([,id])=>id!==p.id));
            if(bc.trim()) newMap[bc.trim()]=p.id;
            setBarcodeMap(newMap);
            setPaintDetail(null);
          }}
        />
      )}

      {/* CONFIRM ADD TO SHOPPING LIST MODAL */}
      {confirmAddToShop&&(
        <Sheet title="Add to Shopping List" badge="SHOP" onClose={()=>{setConfirmAddToShop(null);setAddShopPrice("");}}
          footer={<div style={{display:"flex",gap:8}}><GhostBtn onClick={()=>setConfirmAddToShop(null)} color={T.dim}>CANCEL</GhostBtn><Btn onClick={confirmAddShopItem} full>✓ CONFIRM ADD</Btn></div>}>
          <div style={{display:"flex",alignItems:"center",gap:12,background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 16px",marginBottom:16}}>
            {confirmAddToShop.hex&&<div style={{width:52,height:52,borderRadius:10,background:confirmAddToShop.hex,border:`1px solid ${T.border}`,flexShrink:0,boxShadow:`0 0 16px ${confirmAddToShop.hex}66`}}/>}
            <div style={{flex:1}}>
              <div style={{color:T.white,fontSize:15,fontWeight:900}}>{confirmAddToShop.name}</div>
              {confirmAddToShop.brand&&<div style={{color:T.dim,fontSize:12,marginTop:2}}>{confirmAddToShop.brand}</div>}
              <div style={{marginTop:4}}><Badge small color={T.orange}>{confirmAddToShop.category}</Badge></div>
              {confirmAddToShop.barcode&&<div style={{color:T.dim,fontSize:10,fontFamily:"monospace",marginTop:4}}>▐ {confirmAddToShop.barcode}</div>}
            </div>
          </div>
          <FieldLabel>Quantity Needed</FieldLabel>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <button onClick={()=>setAddShopQty(q=>Math.max(1,q-1))}
              style={{width:36,height:36,background:T.border,border:"none",color:T.white,fontSize:20,cursor:"pointer",fontWeight:900,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
            <div style={{textAlign:"center",minWidth:48}}>
              <div style={{color:T.orange,fontSize:24,fontWeight:900,lineHeight:1}}>{addShopQty}</div>
              <div style={{color:T.dim,fontSize:9,letterSpacing:1,textTransform:"uppercase"}}>QTY</div>
            </div>
            <button onClick={()=>setAddShopQty(q=>q+1)}
              style={{width:36,height:36,background:T.border,border:"none",color:T.white,fontSize:20,cursor:"pointer",fontWeight:900,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
          </div>
          <FieldLabel>Price per item (optional)</FieldLabel>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:14}}>
            <span style={{color:T.dim,fontSize:13,fontWeight:700}}>$</span>
            <input type="number" min="0" step="0.01" value={addShopPrice} onChange={e=>setAddShopPrice(e.target.value)} placeholder="0.00"
              style={{flex:1,background:"#0a0a0a",border:`1px solid ${T.border}`,padding:"10px 12px",color:T.white,fontSize:13,fontFamily:T.font,outline:"none",borderRadius:8}}/>
            {addShopPrice&&addShopQty>1&&(
              <span style={{color:T.orange,fontSize:12,fontWeight:900,whiteSpace:"nowrap"}}>= ${(parseFloat(addShopPrice)*addShopQty).toFixed(2)}</span>
            )}
          </div>
          <FieldLabel>Notes (optional)</FieldLabel>
          <Field value={addShopNotes} onChange={setAddShopNotes} placeholder="E.G. RUNNING LOW, PRIORITY BUY"/>
        </Sheet>
      )}

      {/* ── RECEIVE ALL SHEET ── */}
      {showReceiveAll&&(()=>{
        const pending=shopItems.filter(s=>!s.done);
        const toAdd=pending.filter(s=>!receiveAllSkipped.includes(s.id));
        const skipped=pending.filter(s=>receiveAllSkipped.includes(s.id));
        function confirmAll(){
          toAdd.forEach(item=>{
            const match=allPaints.find(p=>(item.barcode&&p.barcode===item.barcode)||p.name.toLowerCase()===item.name.toLowerCase());
            if(match) setOwnedMap(m=>({...m,[match.id]:(m[match.id]||0)+(item.qty||1)}));
          });
          setShopItems(prev=>prev.map(s=>toAdd.find(i=>i.id===s.id)?{...s,done:true}:s));
          setLibraryToast({name:`${toAdd.length} item${toAdd.length!==1?"s":""} added to inventory`,hex:""});
          setTimeout(()=>setLibraryToast(null),3000);
          setShowReceiveAll(false);
          setReceiveAllSkipped([]);
        }
        return (
          <Sheet title="Add All to Inventory" badge="RECEIVE"
            onClose={()=>{setShowReceiveAll(false);setReceiveAllSkipped([]);}}
            footer={
              <div style={{display:"flex",gap:8}}>
                <GhostBtn onClick={()=>{setShowReceiveAll(false);setReceiveAllSkipped([]);}} color={T.dim}>CANCEL</GhostBtn>
                <Btn onClick={confirmAll} disabled={!toAdd.length} color={T.green} full>
                  CONFIRM {toAdd.length} ITEM{toAdd.length!==1?"S":""}
                </Btn>
              </div>
            }>
            {/* summary */}
            <div style={{background:T.surface,border:`1px solid ${T.green}`,borderRadius:12,
              padding:"12px 14px",marginBottom:16,display:"flex",gap:16}}>
              <div style={{textAlign:"center",flex:1}}>
                <div style={{color:T.green,fontWeight:900,fontSize:22}}>{toAdd.length}</div>
                <div style={{color:T.dim,fontSize:10,letterSpacing:1,textTransform:"uppercase"}}>Adding</div>
              </div>
              {skipped.length>0&&(
                <div style={{textAlign:"center",flex:1}}>
                  <div style={{color:T.yellow,fontWeight:900,fontSize:22}}>{skipped.length}</div>
                  <div style={{color:T.dim,fontSize:10,letterSpacing:1,textTransform:"uppercase"}}>Skipped</div>
                </div>
              )}
              <div style={{textAlign:"center",flex:1}}>
                <div style={{color:T.orange,fontWeight:900,fontSize:22}}>{pending.length}</div>
                <div style={{color:T.dim,fontSize:10,letterSpacing:1,textTransform:"uppercase"}}>Total</div>
              </div>
            </div>

            <div style={{color:T.dim,fontSize:10,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>
              Tap SKIP to exclude an item — you can still add it later individually.
            </div>

            {pending.map(item=>{
              const isSkipped=receiveAllSkipped.includes(item.id);
              const match=allPaints.find(p=>(item.barcode&&p.barcode===item.barcode)||p.name.toLowerCase()===item.name.toLowerCase());
              return (
                <div key={item.id} style={{display:"flex",alignItems:"center",gap:10,
                  background:isSkipped?"rgba(0,0,0,.2)":T.card,
                  border:`1px solid ${isSkipped?T.dimmer:match?T.green:T.border}`,
                  borderRadius:10,padding:"10px 12px",marginBottom:6,
                  opacity:isSkipped?.5:1,transition:"all .2s"}}>
                  {item.hex&&<div style={{width:28,height:28,borderRadius:6,background:item.hex,border:`1px solid ${T.border}`,flexShrink:0}}/>}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{color:isSkipped?T.dim:T.white,fontSize:13,fontWeight:700,
                      textDecoration:isSkipped?"line-through":"none"}}>{item.name}</div>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginTop:2,flexWrap:"wrap"}}>
                      {item.brand&&<span style={{color:T.dim,fontSize:10}}>{item.brand}</span>}
                      <span style={{color:T.orange,fontSize:10,fontWeight:700}}>× {item.qty||1}</span>
                      {match
                        ?<span style={{color:T.green,fontSize:10}}>✓ matched in library</span>
                        :<span style={{color:T.yellow,fontSize:10}}>⚠ no library match</span>}
                    </div>
                  </div>
                  <button onClick={()=>setReceiveAllSkipped(prev=>
                    isSkipped?prev.filter(id=>id!==item.id):[...prev,item.id])}
                    style={{background:isSkipped?"rgba(212,245,74,.1)":"transparent",
                      border:`1px solid ${isSkipped?T.orange:T.border}`,
                      color:isSkipped?T.orange:T.dim,
                      borderRadius:8,padding:"4px 10px",cursor:"pointer",
                      fontSize:10,fontWeight:900,textTransform:"uppercase",flexShrink:0}}>
                    {isSkipped?"INCLUDE":"SKIP"}
                  </button>
                </div>
              );
            })}
          </Sheet>
        );
      })()}

      {confirmReceive&&(
        <Sheet title="Add to Library" badge="RECEIVE" onClose={()=>setConfirmReceive(null)}
          footer={<div style={{display:"flex",gap:8}}><GhostBtn onClick={()=>setConfirmReceive(null)} color={T.dim}>CANCEL</GhostBtn><Btn onClick={receiveIntoLibrary} color={T.green} full>CONFIRM RECEIVED</Btn></div>}>
          <div style={{background:T.surface,border:`1px solid ${T.green}`,padding:"14px 16px",marginBottom:16,borderRadius:12}}>
            <div style={{color:T.white,fontSize:15,fontWeight:900,marginBottom:4}}>{confirmReceive.name}</div>
            {confirmReceive.brand&&<div style={{color:T.dim,fontSize:12}}>{confirmReceive.brand}</div>}
            {confirmReceive.barcode&&<div style={{color:T.orange,fontSize:11,fontFamily:"monospace",marginTop:4}}>▐ {confirmReceive.barcode}</div>}
          </div>
          {(()=>{
            const match=allPaints.find(p=>(confirmReceive.barcode&&p.barcode===confirmReceive.barcode)||p.name.toLowerCase()===confirmReceive.name.toLowerCase());
            return match?(
              <div style={{color:T.dim,fontSize:12,marginBottom:14,padding:"10px 12px",border:`1px solid ${T.border}`,borderRadius:10}}>
                <span style={{color:T.green,fontWeight:700}}>✓ Matched:</span> {match.name} · {match.id}<br/>
                Currently in library: <span style={{color:T.orange,fontWeight:700}}>{ownedMap[match.id]||0}</span> → will become <span style={{color:T.green,fontWeight:700}}>{(ownedMap[match.id]||0)+receiveQty}</span>
              </div>
            ):(
              <div style={{color:T.yellow,fontSize:12,marginBottom:14,padding:"10px 12px",border:`1px solid ${T.yellow}`,borderRadius:10}}>
                ⚠ No exact match found in library. Stock count won't update automatically, but the item will be marked as done.
              </div>
            );
          })()}
          <FieldLabel>Quantity Received</FieldLabel>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <button onClick={()=>setReceiveQty(q=>Math.max(1,q-1))}
              style={{width:36,height:36,background:T.border,border:"none",color:T.white,fontSize:20,cursor:"pointer",fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
            <div style={{textAlign:"center",minWidth:48}}>
              <div style={{color:T.orange,fontSize:24,fontWeight:900,lineHeight:1}}>{receiveQty}</div>
              <div style={{color:T.dim,fontSize:9,letterSpacing:1,textTransform:"uppercase"}}>QTY</div>
            </div>
            <button onClick={()=>setReceiveQty(q=>q+1)}
              style={{width:36,height:36,background:T.border,border:"none",color:T.white,fontSize:20,cursor:"pointer",fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
          </div>
          <div style={{color:T.dimmer,fontSize:11,marginTop:10,letterSpacing:1,textTransform:"uppercase",textAlign:"center"}}>
            This will update your library stock and mark the item as done.
          </div>
        </Sheet>
      )}

      {confirmDel&&(()=>{
        const proj=projects.find(p=>p.id===confirmDel);
        return (
          <Sheet title="Delete Project?" badge="!" onClose={()=>setConfirmDel(null)}
            footer={<div style={{display:"flex",gap:10}}><GhostBtn onClick={()=>setConfirmDel(null)} color={T.dim}>CANCEL</GhostBtn><Btn onClick={()=>deleteProject(confirmDel)} color={T.red} full>DELETE</Btn></div>}>
            <div style={{border:`1px solid ${T.red}`,padding:14,marginBottom:16,background:"rgba(232,48,48,.05)",borderRadius:12}}>
              <div style={{color:T.white,fontSize:14,marginBottom:4}}>Delete <strong style={{color:T.red}}>{proj?.name}</strong>?</div>
              <div style={{color:T.dim,fontSize:12}}>This will remove the project and all its mixes. Cannot be undone.</div>
            </div>
          </Sheet>
        );
      })()}

      {/* BACKUP & RESTORE */}
      {showBackup&&(
        <Sheet title="Backup & Restore" badge="DATA" onClose={()=>{setShowBackup(false);setImportError("");setImportSuccess(false);}}>

          {/* Sync Code — share between devices */}
          <div style={{marginBottom:20,background:"rgba(212,245,74,.05)",border:`1px solid ${T.orange}`,borderRadius:12,padding:"14px"}}>
            <div style={{color:T.orange,fontWeight:900,fontSize:13,marginBottom:4}}>🔗 SYNC BETWEEN DEVICES</div>
            <div style={{color:T.dim,fontSize:12,marginBottom:10,lineHeight:1.5}}>
              Share your sync code with your brother so you both see the same data.
            </div>
            <div style={{color:T.dimmer,fontSize:10,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Your sync code:</div>
            <div style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 12px",
              fontFamily:"monospace",fontSize:13,color:T.orange,letterSpacing:1,marginBottom:10,wordBreak:"break-all"}}>
              {uid}
            </div>
            <Btn onClick={()=>{try{navigator.clipboard.writeText(uid);}catch{}}} small full>COPY SYNC CODE</Btn>
            <div style={{height:1,background:T.border,margin:"12px 0"}}/>
            <div style={{color:T.dimmer,fontSize:10,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Use someone else's sync code:</div>
            <input
              placeholder="Paste sync code here"
              defaultValue=""
              id="sync-code-input"
              style={{width:"100%",boxSizing:"border-box",background:"#0a0a0a",border:`1px solid ${T.border}`,
                padding:"10px 12px",color:T.white,fontSize:12,fontFamily:"monospace",outline:"none",borderRadius:8,marginBottom:8}}/>
            <Btn onClick={()=>{
              const code=document.getElementById("sync-code-input").value.trim();
              if(code&&code.length>5){
                localStorage.setItem("pf_uid",code);
                window.location.reload();
              }
            }} small full color={T.surface} style={{border:`1px solid ${T.border}`,color:T.white}}>
              SWITCH TO THIS SYNC CODE
            </Btn>
            <div style={{color:T.dimmer,fontSize:10,marginTop:6,textAlign:"center"}}>
              ⚠️ This will reload the app and load that device's data
            </div>
          </div>
          {/* Export */}
          <div style={{marginBottom:20}}>
            <div style={{color:T.dim,fontSize:12,marginBottom:12,lineHeight:1.5}}>
              Downloads a JSON file containing your entire collection — paints, tools, supplies, projects, mixes, barcodes and prices. Save it to iCloud Drive, email it to yourself, or share it with your brother.
            </div>
            <Btn onClick={exportData} full>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:6}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              DOWNLOAD BACKUP
            </Btn>
            <div style={{color:T.dimmer,fontSize:10,marginTop:8,textAlign:"center",letterSpacing:.5}}>
              {Object.keys(ownedMap).filter(k=>ownedMap[k]>0).length} paints · {tools.length} tools · {consumables.length} supplies · {projects.length} projects
            </div>
          </div>

          <div style={{height:1,background:T.border,marginBottom:20}}/>

          {/* Import */}
          <div>
            <div style={{color:T.white,fontWeight:900,fontSize:13,marginBottom:6}}>RESTORE FROM BACKUP</div>
            <div style={{color:T.dim,fontSize:12,marginBottom:12,lineHeight:1.5}}>
              Import a PaintForge backup file. <strong style={{color:T.yellow}}>This will replace your current data.</strong> Export a backup first if you want to keep your current data.
            </div>
            {importSuccess&&(
              <div style={{background:"rgba(0,204,102,.1)",border:`1px solid ${T.green}`,borderRadius:10,
                padding:"10px 14px",marginBottom:12,color:T.green,fontWeight:700,fontSize:12,textAlign:"center"}}>
                ✓ Backup restored successfully!
              </div>
            )}
            {importError&&(
              <div style={{background:"rgba(200,0,0,.1)",border:`1px solid ${T.red}`,borderRadius:10,
                padding:"10px 14px",marginBottom:12,color:T.red,fontSize:12}}>
                {importError}
              </div>
            )}
            <label style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,
              width:"100%",padding:"12px 0",background:T.surface,border:`2px dashed ${T.border}`,
              borderRadius:10,cursor:"pointer",color:T.dim,fontWeight:900,fontSize:12,
              letterSpacing:1,textTransform:"uppercase",boxSizing:"border-box"}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 16 12 21 17 16"/><line x1="12" y1="21" x2="12" y2="9"/></svg>
              CHOOSE BACKUP FILE
              <input type="file" accept=".json,application/json"
                onChange={e=>importData(e.target.files?.[0])} style={{display:"none"}}/>
            </label>
          </div>
        </Sheet>
      )}

      {/* LIGHTBOX */}
      {lightbox&&<Lightbox photos={lightbox.photos} startIndex={lightbox.index} onClose={()=>setLightbox(null)}/>}
    </div>
  );
}

export default function PaintTracker(){
  return <ErrorBoundary><PaintTrackerApp/></ErrorBoundary>;
}
