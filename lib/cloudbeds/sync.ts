import { createServerClient } from "@/lib/supabase/server";
import {
  computeCostWasted,
  computeKeticSavings,
  computeKwhWasted,
  ENERGY_CONSTANTS,
  round2,
} from "@/lib/calculations";
import { getReservations, getRooms } from "./client";
import type { CloudbedsReservation, CloudbedsRoom } from "./types";

export type SyncResult = {
  synced: number;
  errors: string[];
};

export async function syncProperty(propertyId: string): Promise<SyncResult> {
  const supabase = createServerClient();
  const errors: string[] = [];

  const { data: property, error: propErr } = await supabase
    .from("properties")
    .select("id, api_key")
    .eq("id", propertyId)
    .maybeSingle<{ id: string; api_key: string | null }>();

  if (propErr) throw new Error(propErr.message);
  if (!property) throw new Error("Property not found");
  if (!property.api_key) throw new Error("Property has no api_key configured");

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);
  const dateFrom = thirtyDaysAgo.toISOString().slice(0, 10);
  const dateTo = now.toISOString().slice(0, 10);

  const [reservations, rooms] = await Promise.all([
    getReservations(property.api_key, dateFrom, dateTo),
    getRooms(property.api_key),
  ]);

  const roomMeta = new Map<string, CloudbedsRoom>();
  for (const r of rooms) roomMeta.set(r.roomID, r);

  // Group reservations by room and sort by checkout time
  const byRoom = new Map<string, CloudbedsReservation[]>();
  for (const r of reservations) {
    const arr = byRoom.get(r.roomID) ?? [];
    arr.push(r);
    byRoom.set(r.roomID, arr);
  }

  const upserts: Array<Record<string, unknown>> = [];

  for (const [roomID, list] of byRoom) {
    try {
      list.sort((a, b) => {
        const ax = checkoutOf(a).getTime();
        const bx = checkoutOf(b).getTime();
        return ax - bx;
      });

      const meta = roomMeta.get(roomID);
      const roomNumber = meta?.roomName ?? roomID;
      const roomType = meta?.roomTypeName ?? null;
      const floor =
        meta?.floor !== undefined && meta.floor !== null
          ? Number(meta.floor)
          : null;
      const isSuite = (roomType ?? "").toLowerCase().includes("suite");

      for (let i = 0; i < list.length - 1; i++) {
        try {
          const current = list[i];
          const next = list[i + 1];
          const checkoutTime = checkoutOf(current);
          const nextCheckinTime = checkinOf(next);
          const vacancyHours =
            (nextCheckinTime.getTime() - checkoutTime.getTime()) / 3600000;
          if (vacancyHours < ENERGY_CONSTANTS.MIN_VACANCY_HOURS) continue;

          const kwh = computeKwhWasted(vacancyHours, isSuite);
          const cost = computeCostWasted(kwh);
          const save = computeKeticSavings(cost);

          upserts.push({
            property_id: property.id,
            room_number: roomNumber,
            room_type: roomType,
            floor,
            checkout_time: checkoutTime.toISOString(),
            next_checkin_time: nextCheckinTime.toISOString(),
            vacancy_hours: round2(vacancyHours),
            kwh_wasted: kwh,
            cost_wasted: cost,
            ketic_would_save: save,
            event_date: checkoutTime.toISOString().slice(0, 10),
          });
        } catch (rowErr) {
          errors.push(
            `room ${roomID} pair ${i}: ${
              rowErr instanceof Error ? rowErr.message : String(rowErr)
            }`,
          );
        }
      }
    } catch (roomErr) {
      errors.push(
        `room ${roomID}: ${
          roomErr instanceof Error ? roomErr.message : String(roomErr)
        }`,
      );
    }
  }

  if (upserts.length > 0) {
    const { error: upErr } = await supabase
      .from("room_events")
      .upsert(upserts, {
        onConflict: "property_id,room_number,checkout_time",
        ignoreDuplicates: false,
      });
    if (upErr) errors.push(`upsert: ${upErr.message}`);
  }

  await supabase
    .from("properties")
    .update({ last_synced_at: new Date().toISOString() })
    .eq("id", property.id);

  return { synced: upserts.length, errors };
}

function checkoutOf(r: CloudbedsReservation): Date {
  const raw = r.checkOutDate ?? r.endDate;
  if (!raw) throw new Error(`reservation ${r.reservationID} missing checkout`);
  return new Date(raw);
}

function checkinOf(r: CloudbedsReservation): Date {
  const raw = r.checkInDate ?? r.startDate;
  if (!raw) throw new Error(`reservation ${r.reservationID} missing checkin`);
  return new Date(raw);
}
