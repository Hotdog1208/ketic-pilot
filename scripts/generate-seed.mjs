// Deterministic seed generator. Outputs SQL INSERT statements to stdout.
// Run with: node scripts/generate-seed.mjs > /tmp/seed.sql

const PROPERTY_ID_PLACEHOLDER = "__PROPERTY_ID__";

// Mulberry32 deterministic RNG
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rnd = mulberry32(42);

function pick(arr) {
  return arr[Math.floor(rnd() * arr.length)];
}

function roomTypeFor(num) {
  if (num <= 124) return "King";
  if (num <= 136) return "Double Queen";
  return "Suite";
}

function floorFor(num) {
  if (num <= 110) return 1;
  if (num <= 120) return 2;
  if (num <= 130) return 3;
  return 4;
}

// dayOfWeek: 0=Sun .. 6=Sat
// probability that this room generates a vacancy event on this date
const DAY_VACANCY_PROB = {
  0: 0.40, // Sun
  1: 0.46, // Mon
  2: 0.42, // Tue
  3: 0.35, // Wed
  4: 0.22, // Thu
  5: 0.12, // Fri
  6: 0.08, // Sat
};

function pickVacancyHours() {
  const r = rnd();
  if (r < 0.40) return 2 + rnd() * 3; // 2-5
  if (r < 0.75) return 5 + rnd() * 7; // 5-12
  if (r < 0.95) return 12 + rnd() * 12; // 12-24
  return 24 + rnd() * 24; // 24-48
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function isoUtc(d) {
  return d.toISOString().replace("T", " ").replace(/\.\d{3}Z$/, "+00");
}

function dateOnly(d) {
  return d.toISOString().slice(0, 10);
}

function esc(s) {
  return String(s).replace(/'/g, "''");
}

// Build 30 days back from a fixed anchor for reproducibility.
const ANCHOR = new Date(Date.UTC(2026, 4, 22, 0, 0, 0)); // 2026-05-22

const events = [];
const rooms = [];
for (let n = 101; n <= 140; n++) {
  rooms.push({
    num: String(n),
    type: roomTypeFor(n),
    floor: floorFor(n),
  });
}

for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
  const day = new Date(ANCHOR.getTime() - dayOffset * 86400000);
  const dow = day.getUTCDay();
  const prob = DAY_VACANCY_PROB[dow];

  for (const room of rooms) {
    if (rnd() > prob) continue;

    // Checkout time between 09:00 and 12:00 local
    const checkoutHour = 9 + rnd() * 3;
    const checkout = new Date(
      Date.UTC(
        day.getUTCFullYear(),
        day.getUTCMonth(),
        day.getUTCDate(),
        Math.floor(checkoutHour),
        Math.floor((checkoutHour % 1) * 60),
        0,
      ),
    );

    const vacancyHours = pickVacancyHours();
    const nextCheckin = new Date(
      checkout.getTime() + vacancyHours * 3600 * 1000,
    );

    const isSuite = room.type === "Suite";
    const kwh = round2(vacancyHours * 0.65 * (isSuite ? 1.4 : 1));
    const cost = round2(kwh * 0.14);
    const save = round2(cost * 0.72);

    events.push({
      room_number: room.num,
      room_type: room.type,
      floor: room.floor,
      checkout_time: isoUtc(checkout),
      next_checkin_time: isoUtc(nextCheckin),
      vacancy_hours: round2(vacancyHours),
      kwh_wasted: kwh,
      cost_wasted: cost,
      ketic_would_save: save,
      event_date: dateOnly(checkout),
    });
  }
}

// Emit SQL
let sql = "";
sql += "-- Seed: property\n";
sql += `with new_property as (\n`;
sql += `  insert into properties (slug, name, location, room_count, pms_type)\n`;
sql += `  values ('the-meridian-austin', 'The Meridian', 'Austin, TX', 180, 'cloudbeds')\n`;
sql += `  returning id\n`;
sql += `)\n`;
sql += `insert into room_events (property_id, room_number, room_type, floor, checkout_time, next_checkin_time, vacancy_hours, kwh_wasted, cost_wasted, ketic_would_save, event_date) values\n`;

const rows = events.map((e) => {
  return `((select id from new_property), '${esc(e.room_number)}', '${esc(e.room_type)}', ${e.floor}, '${e.checkout_time}', '${e.next_checkin_time}', ${e.vacancy_hours}, ${e.kwh_wasted}, ${e.cost_wasted}, ${e.ketic_would_save}, '${e.event_date}')`;
});
sql += rows.join(",\n") + ";\n";

process.stdout.write(sql);
process.stderr.write(`Generated ${events.length} events\n`);
