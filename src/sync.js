import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://nwbhfjdgphfkfqhhbcqh.supabase.co";
const SUPABASE_KEY = "sb_publishable_gLbbB1Ay4K7KpPx2-KujVw_OWTNSr21";

export const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

export function getUID() {
  try {
    let id = localStorage.getItem("pf_uid");
    if (!id) {
      id = "u" + Math.random().toString(36).slice(2);
      localStorage.setItem("pf_uid", id);
    }
    return id;
  } catch (e) {
    return "local_" + Math.random().toString(36).slice(2);
  }
}

export async function syncLoad(uid, setters) {
  try {
    await sb.from("pf_users").upsert({ id: uid }, { onConflict: "id" });
    const [barcodes, owned, prices, customs, tools, cons, shop, projects] = await Promise.all([
      sb.from("pf_barcodes").select("barcode,paint_id").eq("user_id", uid),
      sb.from("pf_owned").select("paint_id,qty").eq("user_id", uid),
      sb.from("pf_prices").select("paint_id,price").eq("user_id", uid),
      sb.from("pf_custom_paints").select("id,data").eq("user_id", uid),
      sb.from("pf_tools").select("id,data").eq("user_id", uid),
      sb.from("pf_consumables").select("id,data").eq("user_id", uid),
      sb.from("pf_shop_items").select("id,data").eq("user_id", uid),
      sb.from("pf_projects").select("id,data").eq("user_id", uid),
    ]);
    if (barcodes.data?.length) setters.setBarcodeMap(Object.fromEntries(barcodes.data.map(r => [r.barcode, r.paint_id])));
    if (owned.data?.length) setters.setOwnedMap(Object.fromEntries(owned.data.map(r => [r.paint_id, r.qty])));
    if (prices.data?.length) setters.setPaintPrices(Object.fromEntries(prices.data.map(r => [r.paint_id, r.price])));
    if (customs.data?.length) setters.setCustomPaints(customs.data.map(r => r.data));
    if (tools.data?.length) setters.setTools(tools.data.map(r => r.data));
    if (cons.data?.length) setters.setConsumables(cons.data.map(r => r.data));
    if (shop.data?.length) setters.setShopItems(shop.data.map(r => r.data));
    if (projects.data?.length) setters.setProjects(projects.data.map(r => r.data));
  } catch (e) {
    console.log("Sync load error:", e);
  }
}

export function syncSave(table, rows) {
  try {
    sb.from(table).upsert(rows, { onConflict: rows[0] && "id" in rows[0] ? "id" : undefined }).then();
  } catch (e) {}
}
